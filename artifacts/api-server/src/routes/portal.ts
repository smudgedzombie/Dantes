import { Router } from "express";
import { eq, desc, and } from "drizzle-orm";
import { getAuth, createClerkClient } from "@clerk/express";
import {
  db, grahamActivitiesTable, clientTasksTable,
  clientDocumentsTable, clientInvoicesTable,
  memberApplicationsTable, clientVaultTable,
} from "@workspace/db";
import { requireSuperAdmin, getUserEmail } from "./access";

const router = Router();

// Helper: get calling user's email and verify they are an ACTIVE Bloom Society member.
// Only members with status="active" pass this gate — pending, rejected, reviewing,
// quoted, and paid-but-not-yet-activated applicants are all rejected.
// Data returned is always scoped to the authenticated user's email — no cross-client
// access is possible through any portal route.
async function getPortalUser(req: Parameters<typeof getAuth>[0]): Promise<{ email: string; member: typeof memberApplicationsTable.$inferSelect } | null> {
  const email = await getUserEmail(req);
  if (!email) return null;
  const [member] = await db
    .select()
    .from(memberApplicationsTable)
    .where(and(eq(memberApplicationsTable.email, email), eq(memberApplicationsTable.status, "active")));
  if (!member) return null;
  return { email, member };
}

// GET /api/portal/overview
router.get("/portal/overview", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }

  const { email, member } = user;
  const [vault] = await db.select().from(clientVaultTable).where(eq(clientVaultTable.memberApplicationId, member.id));

  const recentActivities = await db
    .select().from(grahamActivitiesTable)
    .where(eq(grahamActivitiesTable.clientEmail, email))
    .orderBy(desc(grahamActivitiesTable.createdAt)).limit(10);

  const pendingTasks = await db
    .select().from(clientTasksTable)
    .where(and(eq(clientTasksTable.clientEmail, email), eq(clientTasksTable.status, "pending")))
    .orderBy(desc(clientTasksTable.createdAt)).limit(5);

  const unpaidInvoices = await db
    .select().from(clientInvoicesTable)
    .where(and(eq(clientInvoicesTable.clientEmail, email), eq(clientInvoicesTable.status, "pending")))
    .orderBy(desc(clientInvoicesTable.createdAt));

  res.json({
    member: {
      fullName: member.fullName,
      email: member.email,
      bloomMemberId: member.bloomMemberId,
      assignedGrahamId: member.assignedGrahamId,
      status: member.status,
      company: member.company,
    },
    vault: vault ? {
      healthScore: vault.healthScore,
      riskLevel: vault.riskLevel,
      monthlyValueUsd: parseFloat(vault.monthlyValueUsd ?? "0"),
      totalPaidUsd: parseFloat(vault.totalPaidUsd ?? "0"),
    } : null,
    recentActivities: recentActivities.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
    pendingTasksCount: pendingTasks.length,
    unpaidInvoicesCount: unpaidInvoices.length,
  });
});

// GET /api/portal/activities
router.get("/portal/activities", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const limit = Math.min(parseInt((req.query.limit as string) ?? "50"), 200);
  const rows = await db.select().from(grahamActivitiesTable)
    .where(eq(grahamActivitiesTable.clientEmail, user.email))
    .orderBy(desc(grahamActivitiesTable.createdAt)).limit(limit);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// POST /api/portal/activities — admin posts activity on behalf of Graham
router.post("/portal/activities", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const { grahamCode, clientEmail, type, module, title, description, status, metadata } = req.body as Record<string, unknown>;
  if (!grahamCode || !clientEmail || !title) { res.status(400).json({ error: "grahamCode, clientEmail, title required" }); return; }
  const [row] = await db.insert(grahamActivitiesTable).values({
    grahamCode: grahamCode as string,
    clientEmail: clientEmail as string,
    type: (type as string) ?? "task",
    module: (module as string) ?? "operations",
    title: title as string,
    description: description as string ?? null,
    status: (status as string) ?? "completed",
    metadata: metadata ?? null,
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// GET /api/portal/tasks
router.get("/portal/tasks", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const rows = await db.select().from(clientTasksTable)
    .where(eq(clientTasksTable.clientEmail, user.email))
    .orderBy(desc(clientTasksTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), completedAt: r.completedAt?.toISOString() ?? null })));
});

// POST /api/portal/tasks
router.post("/portal/tasks", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const { title, description, module, priority } = req.body as Record<string, string | undefined>;
  if (!title) { res.status(400).json({ error: "title required" }); return; }
  const [row] = await db.insert(clientTasksTable).values({
    clientEmail: user.email,
    grahamCode: user.member.assignedGrahamId ?? null,
    title,
    description: description ?? null,
    module: module ?? "operations",
    priority: priority ?? "medium",
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), completedAt: null });
});

// PATCH /api/portal/tasks/:id — admin updates task
router.patch("/portal/tasks/:id", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Record<string, unknown>;
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of ["status", "adminNotes", "priority"]) { if (f in body) update[f] = body[f]; }
  if (body.status === "completed") update.completedAt = new Date();
  const [row] = await db.update(clientTasksTable).set(update).where(eq(clientTasksTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), completedAt: row.completedAt?.toISOString() ?? null });
});

// GET /api/portal/documents
router.get("/portal/documents", async (req, res): Promise<void> => {
  const emailParam = req.query.email as string | undefined;
  if (emailParam) {
    if (!await requireSuperAdmin(req, res)) return;
    const rows = await db.select().from(clientDocumentsTable).where(eq(clientDocumentsTable.clientEmail, emailParam)).orderBy(desc(clientDocumentsTable.createdAt));
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
    return;
  }
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const rows = await db.select().from(clientDocumentsTable).where(eq(clientDocumentsTable.clientEmail, user.email)).orderBy(desc(clientDocumentsTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// POST /api/portal/documents — admin uploads document for a client
router.post("/portal/documents", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const { clientEmail, grahamCode, name, type, description, fileContent } = req.body as Record<string, string | undefined>;
  if (!clientEmail || !name) { res.status(400).json({ error: "clientEmail, name required" }); return; }
  const [row] = await db.insert(clientDocumentsTable).values({
    clientEmail,
    grahamCode: grahamCode ?? null,
    name,
    type: type ?? "report",
    description: description ?? null,
    fileContent: fileContent ?? null,
    uploadedBy: adminEmail,
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// GET /api/portal/invoices
router.get("/portal/invoices", async (req, res): Promise<void> => {
  const emailParam = req.query.email as string | undefined;
  if (emailParam) {
    if (!await requireSuperAdmin(req, res)) return;
    const rows = await db.select().from(clientInvoicesTable).where(eq(clientInvoicesTable.clientEmail, emailParam)).orderBy(desc(clientInvoicesTable.createdAt));
    res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), paidAt: r.paidAt?.toISOString() ?? null, updatedAt: r.updatedAt.toISOString() })));
    return;
  }
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const rows = await db.select().from(clientInvoicesTable).where(eq(clientInvoicesTable.clientEmail, user.email)).orderBy(desc(clientInvoicesTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), paidAt: r.paidAt?.toISOString() ?? null, updatedAt: r.updatedAt.toISOString() })));
});

// POST /api/portal/invoices — admin creates invoice
router.post("/portal/invoices", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const { clientEmail, memberApplicationId, period, amountUsd, currency, notes } = req.body as Record<string, string | undefined>;
  if (!clientEmail || !period || !amountUsd) { res.status(400).json({ error: "clientEmail, period, amountUsd required" }); return; }
  const [row] = await db.insert(clientInvoicesTable).values({
    clientEmail,
    memberApplicationId: memberApplicationId ? parseInt(memberApplicationId) : null,
    period,
    amountUsd,
    currency: currency ?? "USD",
    notes: notes ?? null,
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), paidAt: null, updatedAt: row.updatedAt.toISOString() });
});

// PATCH /api/portal/invoices/:id
router.patch("/portal/invoices/:id", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, notes } = req.body as Record<string, string | undefined>;
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;
  if (status === "paid") update.paidAt = new Date();
  const [row] = await db.update(clientInvoicesTable).set(update).where(eq(clientInvoicesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), paidAt: row.paidAt?.toISOString() ?? null, updatedAt: row.updatedAt.toISOString() });
});

// All tasks (admin view)
router.get("/admin/tasks", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const rows = await db.select().from(clientTasksTable).orderBy(desc(clientTasksTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), completedAt: r.completedAt?.toISOString() ?? null })));
});

export default router;
