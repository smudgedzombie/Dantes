import { Router } from "express";
  import { eq } from "drizzle-orm";
  import { getAuth, createClerkClient } from "@clerk/express";
  import { db, staffRequestsTable, memberApplicationsTable } from "@workspace/db";

  const router = Router();

  export const SUPER_ADMINS = ["akshayprabhakar@gmail.com", "dragogateway@gmail.com"];

  async function getUserEmail(req: Parameters<typeof getAuth>[0]): Promise<string | null> {
    const { userId } = getAuth(req);
    if (!userId) return null;
    try {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const user = await clerk.users.getUser(userId);
      return user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress ?? null;
    } catch {
      return null;
    }
  }

  async function requireSuperAdmin(req: any, res: any): Promise<string | null> {
    const email = await getUserEmail(req);
    if (!email || !SUPER_ADMINS.includes(email)) {
      res.status(403).json({ error: "Forbidden — Bloom Society principals only" });
      return null;
    }
    return email;
  }

  // GET /api/my-access — returns current user's role + allowed tabs
  router.get("/my-access", async (req, res): Promise<void> => {
    const email = await getUserEmail(req);
    if (!email) { res.json({ role: "unauthenticated", allowedTabs: [] }); return; }
    if (SUPER_ADMINS.includes(email)) { res.json({ role: "super_admin", allowedTabs: [], email }); return; }
    const [record] = await db.select().from(staffRequestsTable).where(eq(staffRequestsTable.email, email));
    if (!record) { res.json({ role: "unknown", allowedTabs: [], email }); return; }
    if (record.status === "approved") { res.json({ role: "staff", allowedTabs: record.permittedTabs, email }); return; }
    if (record.status === "denied") { res.json({ role: "denied", allowedTabs: [], email }); return; }
    res.json({ role: "pending", allowedTabs: [], email });
  });

  // Staff access requests
  router.get("/staff-requests", async (req, res): Promise<void> => {
    if (!await requireSuperAdmin(req, res)) return;
    const rows = await db.select().from(staffRequestsTable).orderBy(staffRequestsTable.createdAt);
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), reviewedAt: r.reviewedAt?.toISOString() ?? null })));
  });

  router.post("/staff-requests", async (req, res): Promise<void> => {
    const { email, fullName, role, reason } = req.body as Record<string, string>;
    if (!email || !fullName || !role || !reason) { res.status(400).json({ error: "email, fullName, role, reason required" }); return; }
    const existing = await db.select().from(staffRequestsTable).where(eq(staffRequestsTable.email, email));
    if (existing.length > 0) { res.status(409).json({ error: "A request for this email already exists" }); return; }
    const [row] = await db.insert(staffRequestsTable).values({ email, fullName, role, reason }).returning();
    res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), reviewedAt: null });
  });

  router.patch("/staff-requests/:id", async (req, res): Promise<void> => {
    if (!await requireSuperAdmin(req, res)) return;
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { status, permittedTabs, adminNotes } = req.body as any;
    const [row] = await db.update(staffRequestsTable).set({
      ...(status ? { status } : {}),
      ...(permittedTabs !== undefined ? { permittedTabs } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      reviewedAt: new Date(), updatedAt: new Date(),
    }).where(eq(staffRequestsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), reviewedAt: row.reviewedAt?.toISOString() ?? null });
  });

  // Member applications
  router.get("/member-applications", async (req, res): Promise<void> => {
    if (!await requireSuperAdmin(req, res)) return;
    const rows = await db.select().from(memberApplicationsTable).orderBy(memberApplicationsTable.createdAt);
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), quotationSentAt: r.quotationSentAt?.toISOString() ?? null, paidAt: r.paidAt?.toISOString() ?? null })));
  });

  router.post("/member-applications", async (req, res): Promise<void> => {
    const { fullName, email, phone, company, country, industry, businessDescription, grahamGoals, budget, referral } = req.body as Record<string, string | undefined>;
    if (!fullName || !email || !businessDescription || !grahamGoals) { res.status(400).json({ error: "fullName, email, businessDescription, grahamGoals required" }); return; }
    const [row] = await db.insert(memberApplicationsTable).values({
      fullName, email, phone: phone ?? null, company: company ?? null, country: country ?? null,
      industry: industry ?? null, businessDescription, grahamGoals, budget: budget ?? null, referral: referral ?? null,
    }).returning();
    res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), quotationSentAt: null, paidAt: null });
  });

  router.patch("/member-applications/:id", async (req, res): Promise<void> => {
    if (!await requireSuperAdmin(req, res)) return;
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const body = req.body as Record<string, unknown>;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    for (const f of ["status","quotationAmount","quotationNotes","adminNotes","bloomMemberId","bloomSecretPassword","assignedGrahamId"]) {
      if (f in body) update[f] = body[f];
    }
    if (body.status === "quoted") update.quotationSentAt = new Date();
    if (body.status === "paid") update.paidAt = new Date();
    const [row] = await db.update(memberApplicationsTable).set(update).where(eq(memberApplicationsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), quotationSentAt: row.quotationSentAt?.toISOString() ?? null, paidAt: row.paidAt?.toISOString() ?? null });
  });

  export default router;
  