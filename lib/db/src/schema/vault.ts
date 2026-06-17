import { pgTable, serial, text, timestamp, integer, numeric } from "drizzle-orm/pg-core";

export const clientVaultTable = pgTable("client_vault", {
  id: serial("id").primaryKey(),
  memberApplicationId: integer("member_application_id").notNull().unique(),
  privateNotes: text("private_notes"),
  contractNotes: text("contract_notes"),
  contractSignedAt: timestamp("contract_signed_at"),
  healthScore: integer("health_score").notNull().default(50),
  healthReason: text("health_reason"),
  monthlyValueUsd: numeric("monthly_value_usd", { precision: 15, scale: 2 }),
  totalPaidUsd: numeric("total_paid_usd", { precision: 15, scale: 2 }).notNull().default("0"),
  engagementStartDate: timestamp("engagement_start_date"),
  lastActiveAt: timestamp("last_active_at"),
  tags: text("tags").array().notNull().default([]),
  riskLevel: text("risk_level").notNull().default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
