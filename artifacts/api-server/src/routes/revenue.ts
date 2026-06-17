import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db, memberApplicationsTable, clientVaultTable, revenueSnapshotsTable } from "@workspace/db";
import { requireSuperAdmin } from "./access";

const router = Router();

router.get("/admin/revenue", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;

  const members = await db.select().from(memberApplicationsTable).orderBy(desc(memberApplicationsTable.createdAt));
  const vaults = await db.select().from(clientVaultTable);
  const vaultMap = new Map(vaults.map(v => [v.memberApplicationId, v]));

  const activeMembers = members.filter(m => m.status === "active");
  const paidMembers = members.filter(m => ["paid", "active"].includes(m.status));
  const pipeline = members.filter(m => ["pending", "reviewing", "quoted"].includes(m.status));

  // MRR from vault monthly values
  const mrr = activeMembers.reduce((sum, m) => {
    const v = vaultMap.get(m.id);
    return sum + parseFloat(v?.monthlyValueUsd ?? m.quotationAmount ?? "0");
  }, 0);

  // Total revenue collected
  const totalRevenue = paidMembers.reduce((sum, m) => {
    const v = vaultMap.get(m.id);
    return sum + parseFloat(v?.totalPaidUsd ?? "0");
  }, 0);

  // Pipeline value
  const pipelineValue = pipeline.reduce((sum, m) => {
    return sum + parseFloat(m.quotationAmount ?? "0");
  }, 0);

  // Status breakdown
  const statusBreakdown = [
    "pending", "reviewing", "quoted", "paid", "active", "rejected",
  ].map(s => ({
    status: s,
    count: members.filter(m => m.status === s).length,
    value: members.filter(m => m.status === s).reduce((sum, m) => sum + parseFloat(m.quotationAmount ?? "0"), 0),
  }));

  // Referral breakdown
  const referralMap = new Map<string, number>();
  for (const m of members) {
    const ref = m.referral?.trim() || "Unknown";
    referralMap.set(ref, (referralMap.get(ref) ?? 0) + 1);
  }
  const referrals = [...referralMap.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Industry breakdown
  const industryMap = new Map<string, number>();
  for (const m of members) {
    const ind = m.industry?.trim() || "Unknown";
    industryMap.set(ind, (industryMap.get(ind) ?? 0) + 1);
  }
  const industries = [...industryMap.entries()]
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly join trend (last 12 months)
  const now = new Date();
  const monthlyTrend = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const yyyy = d.getFullYear();
    const mm = d.getMonth();
    const count = members.filter(m => {
      const c = new Date(m.createdAt);
      return c.getFullYear() === yyyy && c.getMonth() === mm;
    }).length;
    const activated = activeMembers.filter(m => {
      const c = new Date(m.createdAt);
      return c.getFullYear() === yyyy && c.getMonth() === mm;
    }).length;
    monthlyTrend.push({ label, applications: count, activations: activated });
  }

  // Health score distribution
  const healthBands = [
    { label: "Excellent (80-100)", min: 80, max: 100 },
    { label: "Good (60-79)", min: 60, max: 79 },
    { label: "Fair (40-59)", min: 40, max: 59 },
    { label: "At Risk (<40)", min: 0, max: 39 },
  ].map(b => ({
    label: b.label,
    count: vaults.filter(v => v.healthScore >= b.min && v.healthScore <= b.max).length,
  }));

  res.json({
    summary: {
      totalApplications: members.length,
      activeMembers: activeMembers.length,
      pipelineCount: pipeline.length,
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      totalRevenue: Math.round(totalRevenue),
      pipelineValue: Math.round(pipelineValue),
      avgDealSize: activeMembers.length > 0 ? Math.round(mrr / activeMembers.length) : 0,
    },
    statusBreakdown,
    referrals,
    industries,
    monthlyTrend,
    healthBands,
  });
});

// Snapshots history
router.get("/admin/revenue/snapshots", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const rows = await db.select().from(revenueSnapshotsTable).orderBy(desc(revenueSnapshotsTable.month)).limit(24);
  res.json(rows.map(r => ({ ...r, totalMrrUsd: parseFloat(r.totalMrrUsd ?? "0"), createdAt: r.createdAt.toISOString() })));
});

export default router;
