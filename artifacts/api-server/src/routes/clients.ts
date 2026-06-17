import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, clientsTable } from "@workspace/db";

const router = Router();

router.get("/clients", async (req, res): Promise<void> => {
  const rows = await db.select().from(clientsTable).orderBy(clientsTable.createdAt);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() })));
});

router.post("/clients", async (req, res): Promise<void> => {
  const { name, industry, description, contactName, contactEmail, contactPhone, country, status, notes } = req.body as Record<string, string | undefined>;
  if (!name) { res.status(400).json({ error: "name is required" }); return; }
  const [row] = await db.insert(clientsTable).values({
    name,
    industry: (industry as "other" | "food_beverage" | "retail" | "hospitality" | "manufacturing" | "technology" | "healthcare" | "finance" | "export_trade" | "real_estate" | "professional_services") ?? "other",
    description: description ?? null,
    contactName: contactName ?? null,
    contactEmail: contactEmail ?? null,
    contactPhone: contactPhone ?? null,
    country: country ?? null,
    status: (status as "prospect" | "active" | "paused" | "completed") ?? "prospect",
    notes: notes ?? null,
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() });
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() });
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Record<string, unknown>;
  const [row] = await db.update(clientsTable).set({ ...body, updatedAt: new Date() }).where(eq(clientsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() });
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(clientsTable).where(eq(clientsTable.id, id));
  res.status(204).send();
});

export default router;
