import { Router } from "express";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db, budgetsTable, categoriesTable, transactionsTable } from "@workspace/db";
import {
  CreateBudgetBody,
  UpdateBudgetParams,
  UpdateBudgetBody,
  UpdateBudgetResponse,
  DeleteBudgetParams,
  ListBudgetsResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/budgets", async (req, res): Promise<void> => {
  const budgets = await db
    .select({
      id: budgetsTable.id,
      categoryId: budgetsTable.categoryId,
      amount: budgetsTable.amount,
      period: budgetsTable.period,
      startDate: budgetsTable.startDate,
      endDate: budgetsTable.endDate,
      createdAt: budgetsTable.createdAt,
      categoryName: categoriesTable.name,
      categoryColor: categoriesTable.color,
    })
    .from(budgetsTable)
    .leftJoin(categoriesTable, eq(budgetsTable.categoryId, categoriesTable.id))
    .orderBy(budgetsTable.createdAt);

  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = today.substring(0, 8) + "01";

  const spentRows = await db
    .select({
      categoryId: transactionsTable.categoryId,
      total: sql<string>`sum(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.type, "expense"),
        gte(transactionsTable.date, firstOfMonth),
        lte(transactionsTable.date, today),
      )
    )
    .groupBy(transactionsTable.categoryId);

  const spentMap = new Map<number, number>();
  for (const row of spentRows) {
    if (row.categoryId) spentMap.set(row.categoryId, parseFloat(row.total ?? "0"));
  }

  res.json(ListBudgetsResponse.parse(budgets.map(b => ({
    ...b,
    amount: parseFloat(b.amount),
    createdAt: b.createdAt.toISOString(),
    spent: spentMap.get(b.categoryId) ?? 0,
  }))));
});

router.post("/budgets", async (req, res): Promise<void> => {
  const parsed = CreateBudgetBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [budget] = await db.insert(budgetsTable).values({
    ...parsed.data,
    amount: String(parsed.data.amount),
  }).returning();
  res.status(201).json({ ...budget, amount: parseFloat(budget.amount), createdAt: budget.createdAt.toISOString() });
});

router.patch("/budgets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBudgetParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateBudgetBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.amount !== undefined) updateData.amount = String(parsed.data.amount);
  const [budget] = await db.update(budgetsTable).set(updateData).where(eq(budgetsTable.id, params.data.id)).returning();
  if (!budget) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateBudgetResponse.parse({ ...budget, amount: parseFloat(budget.amount), createdAt: budget.createdAt.toISOString() }));
});

router.delete("/budgets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteBudgetParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(budgetsTable).where(eq(budgetsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
