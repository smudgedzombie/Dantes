import { Router } from "express";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { db, accountsTable, transactionsTable, categoriesTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetSpendingByCategoryQueryParams,
  GetSpendingByCategoryResponse,
  GetMonthlyFlowResponse,
  GetRecentTransactionsResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const accounts = await db.select({ balance: accountsTable.balance, type: accountsTable.type }).from(accountsTable);
  const accountCount = accounts.length;
  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
  const netWorth = accounts
    .filter(a => a.type !== "credit")
    .reduce((sum, a) => sum + parseFloat(a.balance), 0);

  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  const firstStr = firstOfMonth.toISOString().split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];

  const monthlyTotals = await db
    .select({
      type: transactionsTable.type,
      total: sql<string>`sum(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .where(and(gte(transactionsTable.date, firstStr), lte(transactionsTable.date, todayStr)))
    .groupBy(transactionsTable.type);

  let totalIncome = 0;
  let totalExpenses = 0;
  for (const row of monthlyTotals) {
    if (row.type === "income") totalIncome = parseFloat(row.total ?? "0");
    if (row.type === "expense") totalExpenses = parseFloat(row.total ?? "0");
  }

  const [txCount] = await db.select({ count: sql<string>`count(*)` }).from(transactionsTable);
  const transactionCount = parseInt(txCount?.count ?? "0", 10);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : null;

  res.json(GetDashboardSummaryResponse.parse({
    totalBalance,
    totalIncome,
    totalExpenses,
    netWorth,
    accountCount,
    transactionCount,
    savingsRate,
  }));
});

router.get("/dashboard/spending-by-category", async (req, res): Promise<void> => {
  const queryParams = GetSpendingByCategoryQueryParams.safeParse(req.query);
  if (!queryParams.success) { res.status(400).json({ error: queryParams.error.message }); return; }

  const period = queryParams.data.period ?? "month";
  const today = new Date();
  let startDate: Date;
  if (period === "week") {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
  } else if (period === "month") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (period === "quarter") {
    startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 3);
  } else {
    startDate = new Date(today.getFullYear(), 0, 1);
  }

  const startStr = startDate.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const rows = await db
    .select({
      categoryId: categoriesTable.id,
      categoryName: categoriesTable.name,
      categoryColor: categoriesTable.color,
      total: sql<string>`sum(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .innerJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(and(
      eq(transactionsTable.type, "expense"),
      gte(transactionsTable.date, startStr),
      lte(transactionsTable.date, todayStr),
    ))
    .groupBy(categoriesTable.id, categoriesTable.name, categoriesTable.color);

  const grandTotal = rows.reduce((sum, r) => sum + parseFloat(r.total ?? "0"), 0);

  res.json(GetSpendingByCategoryResponse.parse(rows.map(r => ({
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    categoryColor: r.categoryColor,
    amount: parseFloat(r.total ?? "0"),
    percentage: grandTotal > 0 ? (parseFloat(r.total ?? "0") / grandTotal) * 100 : 0,
  }))));
});

router.get("/dashboard/monthly-flow", async (req, res): Promise<void> => {
  const rows: { month: string; income: number; expenses: number; net: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const startStr = `${year}-${month}-01`;
    const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
    const endStr = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });

    const totals = await db
      .select({
        type: transactionsTable.type,
        total: sql<string>`sum(${transactionsTable.amount})`,
      })
      .from(transactionsTable)
      .where(and(gte(transactionsTable.date, startStr), lte(transactionsTable.date, endStr)))
      .groupBy(transactionsTable.type);

    let income = 0;
    let expenses = 0;
    for (const t of totals) {
      if (t.type === "income") income = parseFloat(t.total ?? "0");
      if (t.type === "expense") expenses = parseFloat(t.total ?? "0");
    }
    rows.push({ month: label, income, expenses, net: income - expenses });
  }

  res.json(GetMonthlyFlowResponse.parse(rows));
});

router.get("/dashboard/recent-transactions", async (req, res): Promise<void> => {
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
    .orderBy(desc(transactionsTable.date), desc(transactionsTable.createdAt))
    .limit(10);

  res.json(GetRecentTransactionsResponse.parse(rows.map(r => ({
    ...r,
    amount: parseFloat(r.amount as string),
    createdAt: r.createdAt.toISOString(),
  }))));
});

export default router;
