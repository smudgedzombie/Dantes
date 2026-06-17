import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, agentTasksTable } from "@workspace/db";

const router = Router();

router.patch("/tasks/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Record<string, unknown>;
  if (body.status === "completed") body.completedAt = new Date();
  const [task] = await db.update(agentTasksTable).set(body).where(eq(agentTasksTable.id, id)).returning();
  if (!task) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...task, createdAt: task.createdAt.toISOString(), completedAt: task.completedAt ? task.completedAt.toISOString() : null });
});

router.delete("/tasks/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(agentTasksTable).where(eq(agentTasksTable.id, id));
  res.status(204).send();
});

export default router;
