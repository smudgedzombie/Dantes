import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const grahamActivitiesTable = pgTable("graham_activities", {
  id: serial("id").primaryKey(),
  grahamCode: text("graham_code").notNull(),
  clientEmail: text("client_email").notNull(),
  type: text("type").notNull().default("task"),
  module: text("module").notNull().default("operations"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("completed"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clientTasksTable = pgTable("client_tasks", {
  id: serial("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  grahamCode: text("graham_code"),
  title: text("title").notNull(),
  description: text("description"),
  module: text("module").notNull().default("operations"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const taskCommentsTable = pgTable("task_comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => clientTasksTable.id, { onDelete: "cascade" }),
  authorType: text("author_type").notNull().default("client"),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clientDocumentsTable = pgTable("client_documents", {
  id: serial("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  grahamCode: text("graham_code"),
  name: text("name").notNull(),
  type: text("type").notNull().default("report"),
  description: text("description"),
  fileContent: text("file_content"),
  fileUrl: text("file_url"),
  mimeType: text("mime_type"),
  fileSize: text("file_size"),
  uploadedBy: text("uploaded_by").notNull().default("system"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clientInvoicesTable = pgTable("client_invoices", {
  id: serial("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  memberApplicationId: integer("member_application_id"),
  period: text("period").notNull(),
  amountUsd: text("amount_usd").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  paymentLink: text("payment_link"),
  dueDate: text("due_date"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
