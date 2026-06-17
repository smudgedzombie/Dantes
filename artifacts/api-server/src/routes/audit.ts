import { Router } from "express";
import { desc } from "drizzle-orm";
import { db, auditLogsTable } from "@workspace/db";
import { requireSuperAdmin } from "./access";

const router = Router();

export async function logAudit(
  adminEmail: string,
  action: string,
  targetType: string,
  targetId?: string | null,
  details?: Record<string, unknown>
) {
  try {
    await db.insert(auditLogsTable).values({
      adminEmail,
      action,
      targetType,
      targetId: targetId ?? null,
      details: details ?? null,
    });
  } catch {
    // audit logging must never crash the main request
  }
}

router.get("/admin/audit", async (req, res): Promise<void> => {
  if (!await requireSuperAdmin(req, res)) return;
  const limit = Math.min(parseInt((req.query.limit as string) ?? "100"), 500);
  const offset = parseInt((req.query.offset as string) ?? "0");
  const rows = await db
    .select()
    .from(auditLogsTable)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit)
    .offset(offset);
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

export default router;
