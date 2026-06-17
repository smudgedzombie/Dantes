import { Router } from "express";
import { sql, eq } from "drizzle-orm";
import { db, clientsTable, grahamAgentsTable, agentTasksTable } from "@workspace/db";

const router = Router();

router.get("/operator/summary", async (req, res): Promise<void> => {
  const [clientCounts] = await db.select({
    total: sql<string>`count(*)`,
    active: sql<string>`count(*) filter (where ${clientsTable.status} = 'active')`,
  }).from(clientsTable);

  const [agentCounts] = await db.select({
    total: sql<string>`count(*)`,
    active: sql<string>`count(*) filter (where ${grahamAgentsTable.status} = 'active')`,
  }).from(grahamAgentsTable);

  const [taskCounts] = await db.select({
    pending: sql<string>`count(*) filter (where ${agentTasksTable.status} in ('pending','in_progress'))`,
    completed: sql<string>`count(*) filter (where ${agentTasksTable.status} = 'completed')`,
  }).from(agentTasksTable);

  res.json({
    totalClients: parseInt(clientCounts?.total ?? "0"),
    activeClients: parseInt(clientCounts?.active ?? "0"),
    totalGrahams: parseInt(agentCounts?.total ?? "0"),
    activeGrahams: parseInt(agentCounts?.active ?? "0"),
    pendingTasks: parseInt(taskCounts?.pending ?? "0"),
    completedTasks: parseInt(taskCounts?.completed ?? "0"),
  });
});

export default router;
