import { pgTable, serial, text, timestamp, pgEnum, integer, jsonb } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";

export const agentStatusEnum = pgEnum("agent_status", ["configuring", "standby", "active", "suspended"]);
export const agentModuleEnum = pgEnum("agent_module_type", [
  "financial", "marketing", "operations", "compliance", "events", "export_b2b", "hr", "logistics"
]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed", "cancelled"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "critical"]);

export const grahamAgentsTable = pgTable("graham_agents", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  clientId: integer("client_id").references(() => clientsTable.id, { onDelete: "set null" }),
  status: agentStatusEnum("status").notNull().default("configuring"),
  modules: text("modules").array().notNull().default([]),
  objective: text("objective"),
  deployedAt: timestamp("deployed_at"),
  notes: text("notes"),
  config: jsonb("config"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const agentTasksTable = pgTable("agent_tasks", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => grahamAgentsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: agentModuleEnum("type").notNull().default("operations"),
  status: taskStatusEnum("status").notNull().default("pending"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  dueDate: text("due_date"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentReportsTable = pgTable("agent_reports", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => grahamAgentsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: agentModuleEnum("type").notNull().default("operations"),
  content: text("content").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
