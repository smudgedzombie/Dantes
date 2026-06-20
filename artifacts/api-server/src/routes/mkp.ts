import { Router } from "express";
import { eq, desc, and, gte, lte, ilike, sql } from "drizzle-orm";
import { db, mkpWishlistTable, mkpDealsTable, mkpAlertsTable } from "@workspace/db";
import {
  CreateWishlistItemBody,
  UpdateWishlistItemBody,
  UpdateWishlistItemParams,
  DeleteWishlistItemParams,
  ListDealsQueryParams,
} from "@workspace/api-zod";

const router = Router();

function formatItem(r: typeof mkpWishlistTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    category: r.category,
    budgetMin: parseFloat(r.budgetMin),
    budgetMax: parseFloat(r.budgetMax),
    platform: r.platform,
    status: r.status,
    imageUrl: r.imageUrl ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

function formatDeal(r: typeof mkpDealsTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? null,
    platform: r.platform,
    originalPrice: parseFloat(r.originalPrice),
    salePrice: parseFloat(r.salePrice),
    discountPercent: parseFloat(r.discountPercent),
    category: r.category,
    imageUrl: r.imageUrl ?? null,
    url: r.url,
    isTrending: r.isTrending,
    isVerified: r.isVerified,
    endsAt: r.endsAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

const DEMO_USER = "demo-user";

router.get("/mkp/wishlist", async (req, res) => {
  const rows = await db.select().from(mkpWishlistTable)
    .where(eq(mkpWishlistTable.userId, DEMO_USER))
    .orderBy(desc(mkpWishlistTable.createdAt));
  res.json(rows.map(formatItem));
});

router.post("/mkp/wishlist", async (req, res) => {
  const parsed = CreateWishlistItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const d = parsed.data;
  const [row] = await db.insert(mkpWishlistTable).values({
    userId: DEMO_USER,
    name: d.name,
    description: d.description ?? null,
    category: d.category,
    budgetMin: String(d.budgetMin),
    budgetMax: String(d.budgetMax),
    platform: d.platform,
    imageUrl: d.imageUrl ?? null,
    notes: d.notes ?? null,
  }).returning();
  res.status(201).json(formatItem(row));
});

router.patch("/mkp/wishlist/:id", async (req, res) => {
  const params = UpdateWishlistItemParams.safeParse(req.params);
  const body = UpdateWishlistItemBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const d = body.data;
  const update: Record<string, unknown> = {};
  if (d.name !== undefined) update.name = d.name;
  if (d.description !== undefined) update.description = d.description;
  if (d.category !== undefined) update.category = d.category;
  if (d.budgetMin !== undefined) update.budgetMin = String(d.budgetMin);
  if (d.budgetMax !== undefined) update.budgetMax = String(d.budgetMax);
  if (d.platform !== undefined) update.platform = d.platform;
  if (d.status !== undefined) update.status = d.status;
  if (d.imageUrl !== undefined) update.imageUrl = d.imageUrl;
  if (d.notes !== undefined) update.notes = d.notes;
  const [row] = await db.update(mkpWishlistTable)
    .set(update)
    .where(and(eq(mkpWishlistTable.id, params.data.id), eq(mkpWishlistTable.userId, DEMO_USER)))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatItem(row));
});

router.delete("/mkp/wishlist/:id", async (req, res) => {
  const params = DeleteWishlistItemParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(mkpWishlistTable)
    .where(and(eq(mkpWishlistTable.id, params.data.id), eq(mkpWishlistTable.userId, DEMO_USER)));
  res.status(204).end();
});

router.get("/mkp/deals", async (req, res) => {
  const parsed = ListDealsQueryParams.safeParse(req.query);
  const p = parsed.success ? parsed.data : {};
  let query = db.select().from(mkpDealsTable).$dynamic();
  if (p.platform && p.platform !== "all") {
    query = query.where(eq(mkpDealsTable.platform, p.platform));
  }
  if (p.category) {
    query = query.where(ilike(mkpDealsTable.category, `%${p.category}%`));
  }
  const rows = await query.orderBy(desc(mkpDealsTable.createdAt)).limit(p.limit ?? 50);
  res.json(rows.map(formatDeal));
});

router.get("/mkp/deals/trending", async (req, res) => {
  const rows = await db.select().from(mkpDealsTable)
    .where(eq(mkpDealsTable.isTrending, true))
    .orderBy(desc(mkpDealsTable.discountPercent))
    .limit(12);
  res.json(rows.map(formatDeal));
});

router.get("/mkp/deals/matched", async (req, res) => {
  const wishlist = await db.select().from(mkpWishlistTable)
    .where(and(eq(mkpWishlistTable.userId, DEMO_USER), eq(mkpWishlistTable.status, "watching")));
  const deals = await db.select().from(mkpDealsTable).orderBy(desc(mkpDealsTable.discountPercent));
  const matched: unknown[] = [];
  for (const item of wishlist) {
    const min = parseFloat(item.budgetMin);
    const max = parseFloat(item.budgetMax);
    for (const deal of deals) {
      const salePrice = parseFloat(deal.salePrice);
      const withinBudget = salePrice >= min && salePrice <= max;
      const platformMatch = item.platform === "any" || item.platform === deal.platform;
      const nameMatch = deal.title.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().split(" ").some((w: string) => w.length > 3 && deal.title.toLowerCase().includes(w));
      const categoryMatch = deal.category.toLowerCase().includes(item.category.toLowerCase());
      if (platformMatch && (nameMatch || categoryMatch)) {
        matched.push({
          deal: formatDeal(deal),
          wishlistItem: formatItem(item),
          savingsAmount: parseFloat(deal.originalPrice) - salePrice,
          withinBudget,
        });
        break;
      }
    }
  }
  res.json(matched);
});

router.get("/mkp/alerts", async (req, res) => {
  const alerts = await db.select().from(mkpAlertsTable)
    .where(eq(mkpAlertsTable.userId, DEMO_USER))
    .orderBy(desc(mkpAlertsTable.createdAt));
  const wishlist = await db.select().from(mkpWishlistTable)
    .where(eq(mkpWishlistTable.userId, DEMO_USER));
  const wishlistMap = Object.fromEntries(wishlist.map(w => [w.id, w]));
  res.json(alerts.map(a => ({
    id: a.id,
    wishlistItemId: a.wishlistItemId,
    wishlistItemName: wishlistMap[a.wishlistItemId]?.name ?? "Unknown",
    platform: a.platform,
    originalPrice: parseFloat(a.originalPrice),
    alertPrice: parseFloat(a.alertPrice),
    currentPrice: parseFloat(a.currentPrice),
    triggered: a.triggered,
    triggeredAt: a.triggeredAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.get("/mkp/alerts/summary", async (req, res) => {
  const wishlist = await db.select().from(mkpWishlistTable)
    .where(eq(mkpWishlistTable.userId, DEMO_USER));
  const alerts = await db.select().from(mkpAlertsTable)
    .where(eq(mkpAlertsTable.userId, DEMO_USER));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const triggeredToday = alerts.filter(a => a.triggered && a.triggeredAt && a.triggeredAt >= today).length;
  const totalSavings = alerts
    .filter(a => a.triggered)
    .reduce((sum, a) => sum + (parseFloat(a.originalPrice) - parseFloat(a.alertPrice)), 0);
  res.json({
    totalAlerts: alerts.length,
    triggeredToday,
    totalSavings,
    watchingCount: wishlist.filter(w => w.status === "watching").length,
    matchedCount: wishlist.filter(w => w.status === "matched").length,
  });
});

export default router;
