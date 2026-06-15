import { pgTable, text, serial, timestamp, numeric, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accountsTable } from "./accounts";
import { categoriesTable } from "./categories";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accountsTable.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  type: text("type").notNull(), // income, expense, transfer
  description: text("description").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
