import { pgTable, serial, text, timestamp, integer, jsonb, numeric } from "drizzle-orm/pg-core";

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const revenueSnapshotsTable = pgTable("revenue_snapshots", {
  id: serial("id").primaryKey(),
  month: text("month").notNull().unique(),
  totalMrrUsd: numeric("total_mrr_usd", { precision: 15, scale: 2 }).notNull().default("0"),
  activeMembers: integer("active_members").notNull().default(0),
  newMembers: integer("new_members").notNull().default(0),
  churnedMembers: integer("churned_members").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
