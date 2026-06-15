import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, accountsTable } from "@workspace/db";
import {
  CreateAccountBody,
  GetAccountParams,
  UpdateAccountParams,
  UpdateAccountBody,
  DeleteAccountParams,
  ListAccountsResponse,
  GetAccountResponse,
  UpdateAccountResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/accounts", async (req, res): Promise<void> => {
  const accounts = await db.select().from(accountsTable).orderBy(accountsTable.createdAt);
  res.json(ListAccountsResponse.parse(accounts.map(a => ({ ...a, balance: parseFloat(a.balance) }))));
});

router.post("/accounts", async (req, res): Promise<void> => {
  const parsed = CreateAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [account] = await db.insert(accountsTable).values({
    ...parsed.data,
    balance: String(parsed.data.balance),
  }).returning();
  res.status(201).json({ ...account, balance: parseFloat(account.balance) });
});

router.get("/accounts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAccountParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, params.data.id));
  if (!account) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetAccountResponse.parse({ ...account, balance: parseFloat(account.balance) }));
});

router.patch("/accounts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAccountParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateAccountBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.balance !== undefined) updateData.balance = String(parsed.data.balance);
  const [account] = await db.update(accountsTable).set(updateData).where(eq(accountsTable.id, params.data.id)).returning();
  if (!account) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateAccountResponse.parse({ ...account, balance: parseFloat(account.balance) }));
});

router.delete("/accounts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteAccountParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(accountsTable).where(eq(accountsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
