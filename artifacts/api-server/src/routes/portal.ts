import { Router } from "express";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { getAuth, createClerkClient } from "@clerk/express";
import {
  db, grahamActivitiesTable, clientTasksTable, taskCommentsTable,
  clientDocumentsTable, clientInvoicesTable,
  memberApplicationsTable, clientVaultTable, grahamAgentsTable,
  auditLogsTable,
} from "@workspace/db";
import { requireSuperAdmin, getUserEmail, SUPER_ADMINS } from "./access";
import { emailService } from "../lib/emailService";

const router = Router();

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
  const recentActivities = await db.select().from(grahamActivitiesTable).where(eq(grahamActivitiesTable.clientEmail, email)).orderBy(desc(grahamActivitiesTable.createdAt)).limit(10);
  const pendingTasks = await db.select().from(clientTasksTable).where(and(eq(clientTasksTable.clientEmail, email), eq(clientTasksTable.status, "pending"))).orderBy(desc(clientTasksTable.createdAt)).limit(5);
  const unpaidInvoices = await db.select().from(clientInvoicesTable).where(and(eq(clientInvoicesTable.clientEmail, email), eq(clientInvoicesTable.status, "pending"))).orderBy(desc(clientInvoicesTable.createdAt));
  res.json({
    member: { fullName: member.fullName, email: member.email, bloomMemberId: member.bloomMemberId, assignedGrahamId: member.assignedGrahamId, status: member.status, company: member.company },
    vault: vault ? { healthScore: vault.healthScore, riskLevel: vault.riskLevel, monthlyValueUsd: parseFloat(vault.monthlyValueUsd ?? "0"), totalPaidUsd: parseFloat(vault.totalPaidUsd ?? "0") } : null,
    recentActivities: recentActivities.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
    pendingTasksCount: pendingTasks.length,
    unpaidInvoicesCount: unpaidInvoices.length,
  });
});

// GET /api/portal/metrics — ROI & impact stats
router.get("/portal/metrics", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const { email, member } = user;

  const [allTasks] = await db.select({ cnt: count() }).from(clientTasksTable).where(eq(clientTasksTable.clientEmail, email));
  const [completedTasks] = await db.select({ cnt: count() }).from(clientTasksTable).where(and(eq(clientTasksTable.clientEmail, email), eq(clientTasksTable.status, "completed")));
  const [allActivities] = await db.select({ cnt: count() }).from(grahamActivitiesTable).where(eq(grahamActivitiesTable.clientEmail, email));
  const [totalPaid] = await db.select({ total: sql<string>`COALESCE(SUM(amount_usd::numeric), 0)` }).from(clientInvoicesTable).where(and(eq(clientInvoicesTable.clientEmail, email), eq(clientInvoicesTable.status, "paid")));

  const modulesActive = member.assignedGrahamId ? ["financial", "marketing", "operations"] : [];
  const estimatedHoursSaved = (completedTasks?.cnt ?? 0) * 4 + (allActivities?.cnt ?? 0) * 2;

  res.json({
    tasksTotal: allTasks?.cnt ?? 0,
    tasksCompleted: completedTasks?.cnt ?? 0,
    activitiesLogged: allActivities?.cnt ?? 0,
    modulesActive: modulesActive.length,
    estimatedHoursSaved,
    totalPaidUsd: parseFloat(totalPaid?.total ?? "0"),
    grahamCode: member.assignedGrahamId,
  });
});

// GET /api/portal/activities
router.get("/portal/activities", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const limit = Math.min(parseInt((req.query.limit as string) ?? "50"), 200);
  const rows = await db.select().from(grahamActivitiesTable).where(eq(grahamActivitiesTable.clientEmail, user.email)).orderBy(desc(grahamActivitiesTable.createdAt)).limit(limit);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// POST /api/portal/activities
router.post("/portal/activities", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const { grahamCode, clientEmail, type, module, title, description, status, metadata } = req.body as Record<string, unknown>;
  if (!grahamCode || !clientEmail || !title) { res.status(400).json({ error: "grahamCode, clientEmail, title required" }); return; }
  const [row] = await db.insert(grahamActivitiesTable).values({ grahamCode: grahamCode as string, clientEmail: clientEmail as string, type: (type as string) ?? "task", module: (module as string) ?? "operations", title: title as string, description: description as string ?? null, status: (status as string) ?? "completed", metadata: metadata ?? null }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// GET /api/portal/tasks
router.get("/portal/tasks", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const rows = await db.select().from(clientTasksTable).where(eq(clientTasksTable.clientEmail, user.email)).orderBy(desc(clientTasksTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), completedAt: r.completedAt?.toISOString() ?? null })));
});

// POST /api/portal/tasks
router.post("/portal/tasks", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const { title, description, module, priority } = req.body as Record<string, string | undefined>;
  if (!title) { res.status(400).json({ error: "title required" }); return; }
  const [row] = await db.insert(clientTasksTable).values({ clientEmail: user.email, grahamCode: user.member.assignedGrahamId ?? null, title, description: description ?? null, module: module ?? "operations", priority: priority ?? "medium" }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), completedAt: null });
});

// PATCH /api/portal/tasks/:id
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
  if (body.status && body.status !== row.status) {
    emailService.taskStatusChanged(row.clientEmail, row.title, body.status as string).catch(() => {});
  }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), completedAt: row.completedAt?.toISOString() ?? null });
});

// GET /api/portal/tasks/:id/comments
router.get("/portal/tasks/:id/comments", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const adminEmail = await requireSuperAdmin(req, res).catch(() => null);
  if (!adminEmail) {
    const user = await getPortalUser(req);
    if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [task] = await db.select().from(clientTasksTable).where(and(eq(clientTasksTable.id, id), eq(clientTasksTable.clientEmail, user.email)));
    if (!task) { res.status(403).json({ error: "Forbidden" }); return; }
  }
  const rows = await db.select().from(taskCommentsTable).where(eq(taskCommentsTable.taskId, id)).orderBy(taskCommentsTable.createdAt);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// POST /api/portal/tasks/:id/comments — client or admin posts a comment
router.post("/portal/tasks/:id/comments", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { content } = req.body as { content?: string };
  if (!content?.trim()) { res.status(400).json({ error: "content required" }); return; }

  const email = await getUserEmail(req);
  if (!email) { res.status(401).json({ error: "Unauthorized" }); return; }

  const isAdmin = SUPER_ADMINS.includes(email);
  let authorName = "Team Dantès";
  let clientEmail = "";

  if (isAdmin) {
    const [task] = await db.select().from(clientTasksTable).where(eq(clientTasksTable.id, id));
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    clientEmail = task.clientEmail;
    authorName = "Team Dantès";
  } else {
    const user = await getPortalUser(req);
    if (!user) { res.status(403).json({ error: "Not an active member" }); return; }
    const [task] = await db.select().from(clientTasksTable).where(and(eq(clientTasksTable.id, id), eq(clientTasksTable.clientEmail, user.email)));
    if (!task) { res.status(403).json({ error: "Forbidden" }); return; }
    clientEmail = user.email;
    authorName = user.member.fullName;
  }

  const [row] = await db.insert(taskCommentsTable).values({ taskId: id, authorType: isAdmin ? "admin" : "client", authorName, content: content.trim() }).returning();

  if (isAdmin) {
    const [task] = await db.select().from(clientTasksTable).where(eq(clientTasksTable.id, id));
    if (task) emailService.taskComment(clientEmail, task.title, authorName, content.trim()).catch(() => {});
  }

  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
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
  const { clientEmail, grahamCode, name, type, description, fileContent, fileUrl, mimeType, fileSize } = req.body as Record<string, string | undefined>;
  if (!clientEmail || !name) { res.status(400).json({ error: "clientEmail, name required" }); return; }
  const [row] = await db.insert(clientDocumentsTable).values({ clientEmail, grahamCode: grahamCode ?? null, name, type: type ?? "report", description: description ?? null, fileContent: fileContent ?? null, fileUrl: fileUrl ?? null, mimeType: mimeType ?? null, fileSize: fileSize ?? null, uploadedBy: adminEmail }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// POST /api/portal/documents/client-upload — client uploads their own document
router.post("/portal/documents/client-upload", async (req, res): Promise<void> => {
  const user = await getPortalUser(req);
  if (!user) { res.status(401).json({ error: "Not a Bloom Society member" }); return; }
  const { name, type, description, fileUrl, mimeType, fileSize } = req.body as Record<string, string | undefined>;
  if (!name || !fileUrl) { res.status(400).json({ error: "name, fileUrl required" }); return; }
  const [row] = await db.insert(clientDocumentsTable).values({ clientEmail: user.email, grahamCode: user.member.assignedGrahamId ?? null, name, type: type ?? "report", description: description ?? null, fileUrl, mimeType: mimeType ?? null, fileSize: fileSize ?? null, uploadedBy: user.email }).returning();
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

// POST /api/portal/invoices
router.post("/portal/invoices", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const { clientEmail, memberApplicationId, period, amountUsd, currency, notes, paymentLink, dueDate } = req.body as Record<string, string | undefined>;
  if (!clientEmail || !period || !amountUsd) { res.status(400).json({ error: "clientEmail, period, amountUsd required" }); return; }
  const [row] = await db.insert(clientInvoicesTable).values({ clientEmail, memberApplicationId: memberApplicationId ? parseInt(memberApplicationId) : null, period, amountUsd, currency: currency ?? "USD", notes: notes ?? null, paymentLink: paymentLink ?? null, dueDate: dueDate ?? null }).returning();
  emailService.invoiceCreated(clientEmail, period, amountUsd, dueDate ?? null, paymentLink ?? null).catch(() => {});
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString(), paidAt: null, updatedAt: row.updatedAt.toISOString() });
});

// PATCH /api/portal/invoices/:id
router.patch("/portal/invoices/:id", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, notes, paymentLink, dueDate } = req.body as Record<string, string | undefined>;
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;
  if (paymentLink !== undefined) update.paymentLink = paymentLink;
  if (dueDate !== undefined) update.dueDate = dueDate;
  if (status === "paid") update.paidAt = new Date();
  const [row] = await db.update(clientInvoicesTable).set(update).where(eq(clientInvoicesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString(), paidAt: row.paidAt?.toISOString() ?? null, updatedAt: row.updatedAt.toISOString() });
});

// GET /api/admin/tasks
router.get("/admin/tasks", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const rows = await db.select().from(clientTasksTable).orderBy(desc(clientTasksTable.createdAt));
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), completedAt: r.completedAt?.toISOString() ?? null })));
});

// GET /api/admin/grahams — Graham status board
router.get("/admin/grahams", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const agents = await db.select().from(grahamAgentsTable).orderBy(desc(grahamAgentsTable.updatedAt));
  const members = await db.select().from(memberApplicationsTable).where(eq(memberApplicationsTable.status, "active"));

  const board = members.map(m => {
    const agent = agents.find(a => a.code === m.assignedGrahamId);
    return {
      memberId: m.id,
      memberName: m.fullName,
      memberEmail: m.email,
      company: m.company,
      bloomMemberId: m.bloomMemberId,
      grahamCode: m.assignedGrahamId,
      agentStatus: agent?.status ?? "unassigned",
      agentModules: agent?.modules ?? [],
      agentObjective: agent?.objective ?? null,
      deployedAt: agent?.deployedAt?.toISOString() ?? null,
    };
  });

  const unlinked = agents.filter(a => !members.find(m => m.assignedGrahamId === a.code));

  res.json({
    board,
    unlinkedAgents: unlinked.map(a => ({ ...a, createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(), deployedAt: a.deployedAt?.toISOString() ?? null })),
    summary: {
      total: board.length,
      active: board.filter(b => b.agentStatus === "active").length,
      configuring: board.filter(b => b.agentStatus === "configuring").length,
      standby: board.filter(b => b.agentStatus === "standby").length,
      unassigned: board.filter(b => b.agentStatus === "unassigned").length,
    },
  });
});

// GET /api/admin/export?type=members|tasks|audit|revenue&format=csv
router.get("/admin/export", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const type = (req.query.type as string) ?? "members";
  const format = (req.query.format as string) ?? "csv";

  function toCsv(rows: Record<string, unknown>[]): string {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))];
    return lines.join("\n");
  }

  if (format === "csv") {
    let data: Record<string, unknown>[] = [];
    let filename = "export";

    if (type === "members") {
      const rows = await db.select().from(memberApplicationsTable).orderBy(desc(memberApplicationsTable.createdAt));
      data = rows.map(r => ({ id: r.id, name: r.fullName, email: r.email, phone: r.phone, company: r.company, country: r.country, industry: r.industry, status: r.status, bloomMemberId: r.bloomMemberId, assignedGraham: r.assignedGrahamId, budget: r.budget, createdAt: r.createdAt.toISOString() }));
      filename = "bloom-members";
    } else if (type === "tasks") {
      const rows = await db.select().from(clientTasksTable).orderBy(desc(clientTasksTable.createdAt));
      data = rows.map(r => ({ id: r.id, clientEmail: r.clientEmail, grahamCode: r.grahamCode, title: r.title, module: r.module, priority: r.priority, status: r.status, adminNotes: r.adminNotes, createdAt: r.createdAt.toISOString(), completedAt: r.completedAt?.toISOString() ?? "" }));
      filename = "bloom-tasks";
    } else if (type === "audit") {
      const rows = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt));
      data = rows.map(r => ({ id: r.id, adminEmail: r.adminEmail, action: r.action, targetType: r.targetType, targetId: r.targetId, details: JSON.stringify(r.details), createdAt: r.createdAt.toISOString() }));
      filename = "bloom-audit";
    } else if (type === "invoices") {
      const rows = await db.select().from(clientInvoicesTable).orderBy(desc(clientInvoicesTable.createdAt));
      data = rows.map(r => ({ id: r.id, clientEmail: r.clientEmail, period: r.period, amountUsd: r.amountUsd, currency: r.currency, status: r.status, dueDate: r.dueDate, paymentLink: r.paymentLink, paidAt: r.paidAt?.toISOString() ?? "", createdAt: r.createdAt.toISOString() }));
      filename = "bloom-invoices";
    }

    const csv = toCsv(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
    return;
  }

  res.status(400).json({ error: "Use format=csv" });
});

export default router;
