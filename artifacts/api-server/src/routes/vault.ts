import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, clientVaultTable, memberApplicationsTable } from "@workspace/db";
import { requireSuperAdmin } from "./access";
import { logAudit } from "./audit";

const router = Router();

// GET /api/vault/clients — full vault with member profile joined
router.get("/vault/clients", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;

  const members = await db
    .select()
    .from(memberApplicationsTable)
    .orderBy(desc(memberApplicationsTable.createdAt));

  const vaults = await db.select().from(clientVaultTable);
  const vaultMap = new Map(vaults.map(v => [v.memberApplicationId, v]));

  const result = members.map(m => ({
    member: {
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      quotationSentAt: m.quotationSentAt?.toISOString() ?? null,
      paidAt: m.paidAt?.toISOString() ?? null,
    },
    vault: vaultMap.get(m.id) ? {
      ...vaultMap.get(m.id)!,
      monthlyValueUsd: parseFloat(vaultMap.get(m.id)!.monthlyValueUsd ?? "0"),
      totalPaidUsd: parseFloat(vaultMap.get(m.id)!.totalPaidUsd ?? "0"),
      createdAt: vaultMap.get(m.id)!.createdAt.toISOString(),
      updatedAt: vaultMap.get(m.id)!.updatedAt.toISOString(),
      engagementStartDate: vaultMap.get(m.id)!.engagementStartDate?.toISOString() ?? null,
      lastActiveAt: vaultMap.get(m.id)!.lastActiveAt?.toISOString() ?? null,
      contractSignedAt: vaultMap.get(m.id)!.contractSignedAt?.toISOString() ?? null,
    } : null,
  }));

  res.json(result);
});

// PATCH /api/vault/clients/:id — update or create vault record
router.patch("/vault/clients/:id", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;

  const memberId = parseInt(req.params.id as string);
  if (isNaN(memberId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = req.body as Record<string, unknown>;
  const allowedFields = [
    "privateNotes", "contractNotes", "healthScore", "healthReason",
    "monthlyValueUsd", "totalPaidUsd", "tags", "riskLevel",
  ];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of allowedFields) {
    if (f in body) update[f] = body[f];
  }
  if (body.contractSignedAt !== undefined) update.contractSignedAt = body.contractSignedAt ? new Date(body.contractSignedAt as string) : null;
  if (body.engagementStartDate !== undefined) update.engagementStartDate = body.engagementStartDate ? new Date(body.engagementStartDate as string) : null;

  const existing = await db.select().from(clientVaultTable).where(eq(clientVaultTable.memberApplicationId, memberId));
  let row;
  if (existing.length === 0) {
    [row] = await db.insert(clientVaultTable).values({ memberApplicationId: memberId, ...update }).returning();
  } else {
    [row] = await db.update(clientVaultTable).set(update).where(eq(clientVaultTable.memberApplicationId, memberId)).returning();
  }

  await logAudit(adminEmail, "vault_update", "member_application", String(memberId), { fields: Object.keys(update) });
  res.json({ ...row, monthlyValueUsd: parseFloat(row.monthlyValueUsd ?? "0"), totalPaidUsd: parseFloat(row.totalPaidUsd ?? "0"), createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() });
});

// GET /api/vault/export — full data export as JSON
router.get("/vault/export", async (req, res): Promise<void> => {
  const adminEmail = await requireSuperAdmin(req, res);
  if (!adminEmail) return;

  const members = await db.select().from(memberApplicationsTable).orderBy(desc(memberApplicationsTable.createdAt));
  const vaults = await db.select().from(clientVaultTable);
  const vaultMap = new Map(vaults.map(v => [v.memberApplicationId, v]));

  const payload = members.map(m => ({
    id: m.id,
    fullName: m.fullName,
    email: m.email,
    phone: m.phone,
    company: m.company,
    country: m.country,
    industry: m.industry,
    status: m.status,
    bloomMemberId: m.bloomMemberId,
    assignedGrahamId: m.assignedGrahamId,
    quotationAmount: m.quotationAmount,
    paidAt: m.paidAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    vault: vaultMap.get(m.id) ? {
      healthScore: vaultMap.get(m.id)!.healthScore,
      monthlyValueUsd: parseFloat(vaultMap.get(m.id)!.monthlyValueUsd ?? "0"),
      totalPaidUsd: parseFloat(vaultMap.get(m.id)!.totalPaidUsd ?? "0"),
      riskLevel: vaultMap.get(m.id)!.riskLevel,
      tags: vaultMap.get(m.id)!.tags,
    } : null,
  }));

  await logAudit(adminEmail, "data_export", "vault", null, { count: payload.length });
  res.setHeader("Content-Disposition", `attachment; filename="bloom-society-export-${new Date().toISOString().slice(0, 10)}.json"`);
  res.setHeader("Content-Type", "application/json");
  res.json({ exportedAt: new Date().toISOString(), exportedBy: adminEmail, count: payload.length, clients: payload });
});

export default router;
