import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const clientStatusEnum = pgEnum("client_status", ["prospect", "active", "paused", "completed"]);
export const clientIndustryEnum = pgEnum("client_industry", [
  "food_beverage", "retail", "hospitality", "manufacturing", "technology",
  "healthcare", "finance", "export_trade", "real_estate", "professional_services", "other"
]);

export const clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: clientIndustryEnum("industry").notNull().default("other"),
  description: text("description"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  country: text("country"),
  status: clientStatusEnum("status").notNull().default("prospect"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
