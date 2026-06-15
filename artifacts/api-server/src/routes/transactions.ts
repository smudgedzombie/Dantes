import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, transactionsTable, accountsTable, categoriesTable } from "@workspace/db";
import {
  CreateTransactionBody,
  ListTransactionsQueryParams,
  GetTransactionParams,
  UpdateTransactionParams,
  UpdateTransactionBody,
  UpdateTransactionResponse,
  DeleteTransactionParams,
  ListTransactionsResponse,
  GetTransactionResponse,
} from "@workspace/api-zod";

const router = Router();

function toNumber(val: string | null | undefined): number | null {
  if (val == null) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

router.get("/transactions", async (req, res): Promise<void> => {
  const queryParams = ListTransactionsQueryParams.safeParse(req.query);
  if (!queryParams.success) { res.status(400).json({ error: queryParams.error.message }); return; }
  const { accountId, categoryId, type, limit, offset } = queryParams.data;

  const conditions = [];
  if (accountId !== undefined) conditions.push(eq(transactionsTable.accountId, accountId));
  if (categoryId !== undefined) conditions.push(eq(transactionsTable.categoryId, categoryId));
  if (type !== undefined) conditions.push(eq(transactionsTable.type, type));

  const rows = await db
    .select({
      id: transactionsTable.id,
      accountId: transactionsTable.accountId,
      categoryId: transactionsTable.categoryId,
      amount: transactionsTable.amount,
      type: transactionsTable.type,
      description: transactionsTable.description,
      date: transactionsTable.date,
      notes: transactionsTable.notes,
      createdAt: transactionsTable.createdAt,
      accountName: accountsTable.name,
      categoryName: categoriesTable.name,
      categoryColor: categoriesTable.color,
    })
    .from(transactionsTable)
    .leftJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(transactionsTable.date), desc(transactionsTable.createdAt))
    .limit(limit ?? 100)
    .offset(offset ?? 0);

  res.json(ListTransactionsResponse.parse(rows.map(r => ({
    ...r,
    amount: toNumber(r.amount as string) ?? 0,
    createdAt: r.createdAt.toISOString(),
  }))));
});

router.post("/transactions", async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [tx] = await db.insert(transactionsTable).values({
    ...parsed.data,
    amount: String(parsed.data.amount),
  }).returning();
  res.status(201).json({ ...tx, amount: parseFloat(tx.amount), createdAt: tx.createdAt.toISOString() });
});

router.get("/transactions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetTransactionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db
    .select({
      id: transactionsTable.id,
      accountId: transactionsTable.accountId,
      categoryId: transactionsTable.categoryId,
      amount: transactionsTable.amount,
      type: transactionsTable.type,
      description: transactionsTable.description,
      date: transactionsTable.date,
      notes: transactionsTable.notes,
      createdAt: transactionsTable.createdAt,
      accountName: accountsTable.name,
      categoryName: categoriesTable.name,
      categoryColor: categoriesTable.color,
    })
    .from(transactionsTable)
    .leftJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(eq(transactionsTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetTransactionResponse.parse({ ...row, amount: parseFloat(row.amount as string), createdAt: row.createdAt.toISOString() }));
});

router.patch("/transactions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateTransactionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateTransactionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.amount !== undefined) updateData.amount = String(parsed.data.amount);
  const [tx] = await db.update(transactionsTable).set(updateData).where(eq(transactionsTable.id, params.data.id)).returning();
  if (!tx) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateTransactionResponse.parse({ ...tx, amount: parseFloat(tx.amount), createdAt: tx.createdAt.toISOString() }));
});

router.delete("/transactions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTransactionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(transactionsTable).where(eq(transactionsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
