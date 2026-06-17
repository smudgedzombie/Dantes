import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, grahamAgentsTable, clientsTable, agentTasksTable } from "@workspace/db";

const router = Router();

function serializeAgent(row: typeof grahamAgentsTable.$inferSelect & { clientName?: string | null; clientIndustry?: string | null }) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    clientId: row.clientId,
    clientName: row.clientName ?? null,
    clientIndustry: row.clientIndustry ?? null,
    status: row.status,
    modules: row.modules ?? [],
    objective: row.objective,
    deployedAt: row.deployedAt ? row.deployedAt.toISOString() : null,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/graham-agents", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: grahamAgentsTable.id,
      code: grahamAgentsTable.code,
      name: grahamAgentsTable.name,
      clientId: grahamAgentsTable.clientId,
      clientName: clientsTable.name,
      clientIndustry: clientsTable.industry,
      status: grahamAgentsTable.status,
      modules: grahamAgentsTable.modules,
      objective: grahamAgentsTable.objective,
      deployedAt: grahamAgentsTable.deployedAt,
      notes: grahamAgentsTable.notes,
      createdAt: grahamAgentsTable.createdAt,
      updatedAt: grahamAgentsTable.updatedAt,
    })
    .from(grahamAgentsTable)
    .leftJoin(clientsTable, eq(grahamAgentsTable.clientId, clientsTable.id))
    .orderBy(desc(grahamAgentsTable.createdAt));
  res.json(rows.map(r => serializeAgent(r as Parameters<typeof serializeAgent>[0])));
});

router.post("/graham-agents", async (req, res): Promise<void> => {
  const { code, name, clientId, status, modules, objective, notes } = req.body as Record<string, unknown>;
  if (!code || !name) { res.status(400).json({ error: "code and name are required" }); return; }
  const [row] = await db.insert(grahamAgentsTable).values({
    code: String(code),
    name: String(name),
    clientId: clientId ? Number(clientId) : null,
    status: (status as "configuring" | "standby" | "active" | "suspended") ?? "configuring",
    modules: Array.isArray(modules) ? modules.map(String) : [],
    objective: objective ? String(objective) : null,
    notes: notes ? String(notes) : null,
  }).returning();
  const agent = await db.select({
    id: grahamAgentsTable.id, code: grahamAgentsTable.code, name: grahamAgentsTable.name,
    clientId: grahamAgentsTable.clientId, clientName: clientsTable.name, clientIndustry: clientsTable.industry,
    status: grahamAgentsTable.status, modules: grahamAgentsTable.modules, objective: grahamAgentsTable.objective,
    deployedAt: grahamAgentsTable.deployedAt, notes: grahamAgentsTable.notes, createdAt: grahamAgentsTable.createdAt, updatedAt: grahamAgentsTable.updatedAt,
  }).from(grahamAgentsTable).leftJoin(clientsTable, eq(grahamAgentsTable.clientId, clientsTable.id)).where(eq(grahamAgentsTable.id, row.id));
  res.status(201).json(serializeAgent(agent[0] as Parameters<typeof serializeAgent>[0]));
});

router.get("/graham-agents/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const rows = await db.select({
    id: grahamAgentsTable.id, code: grahamAgentsTable.code, name: grahamAgentsTable.name,
    clientId: grahamAgentsTable.clientId, clientName: clientsTable.name, clientIndustry: clientsTable.industry,
    status: grahamAgentsTable.status, modules: grahamAgentsTable.modules, objective: grahamAgentsTable.objective,
    deployedAt: grahamAgentsTable.deployedAt, notes: grahamAgentsTable.notes, createdAt: grahamAgentsTable.createdAt, updatedAt: grahamAgentsTable.updatedAt,
  }).from(grahamAgentsTable).leftJoin(clientsTable, eq(grahamAgentsTable.clientId, clientsTable.id)).where(eq(grahamAgentsTable.id, id));
  if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeAgent(rows[0] as Parameters<typeof serializeAgent>[0]));
});

router.patch("/graham-agents/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Record<string, unknown>;
  if (body.status === "active" && !body.deployedAt) body.deployedAt = new Date().toISOString();
  await db.update(grahamAgentsTable).set({ ...body, updatedAt: new Date() }).where(eq(grahamAgentsTable.id, id));
  const rows = await db.select({
    id: grahamAgentsTable.id, code: grahamAgentsTable.code, name: grahamAgentsTable.name,
    clientId: grahamAgentsTable.clientId, clientName: clientsTable.name, clientIndustry: clientsTable.industry,
    status: grahamAgentsTable.status, modules: grahamAgentsTable.modules, objective: grahamAgentsTable.objective,
    deployedAt: grahamAgentsTable.deployedAt, notes: grahamAgentsTable.notes, createdAt: grahamAgentsTable.createdAt, updatedAt: grahamAgentsTable.updatedAt,
  }).from(grahamAgentsTable).leftJoin(clientsTable, eq(grahamAgentsTable.clientId, clientsTable.id)).where(eq(grahamAgentsTable.id, id));
  if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeAgent(rows[0] as Parameters<typeof serializeAgent>[0]));
});

router.delete("/graham-agents/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(grahamAgentsTable).where(eq(grahamAgentsTable.id, id));
  res.status(204).send();
});

router.get("/graham-agents/:id/tasks", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const tasks = await db.select().from(agentTasksTable).where(eq(agentTasksTable.agentId, id)).orderBy(desc(agentTasksTable.createdAt));
  res.json(tasks.map(t => ({ ...t, createdAt: t.createdAt.toISOString(), completedAt: t.completedAt ? t.completedAt.toISOString() : null })));
});

router.post("/graham-agents/:id/tasks", async (req, res): Promise<void> => {
  const agentId = parseInt(req.params.id as string);
  if (isNaN(agentId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, description, type, status, priority, dueDate, notes } = req.body as Record<string, string | undefined>;
  if (!title) { res.status(400).json({ error: "title is required" }); return; }
  const [task] = await db.insert(agentTasksTable).values({
    agentId,
    title,
    description: description ?? null,
    type: (type as "financial" | "marketing" | "operations" | "compliance" | "events" | "export_b2b" | "hr" | "logistics") ?? "operations",
    status: (status as "pending" | "in_progress" | "completed" | "cancelled") ?? "pending",
    priority: (priority as "low" | "medium" | "high" | "critical") ?? "medium",
    dueDate: dueDate ?? null,
    notes: notes ?? null,
  }).returning();
  res.status(201).json({ ...task, createdAt: task.createdAt.toISOString(), completedAt: task.completedAt ? task.completedAt.toISOString() : null });
});

export default router;
