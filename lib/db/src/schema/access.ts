import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

  export const staffRequestStatusEnum = pgEnum("staff_request_status", ["pending", "approved", "denied"]);
  export const memberApplicationStatusEnum = pgEnum("member_application_status", [
    "pending", "reviewing", "quoted", "paid", "active", "rejected"
  ]);

  export const staffRequestsTable = pgTable("staff_requests", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    role: text("role").notNull(),
    reason: text("reason").notNull(),
    status: staffRequestStatusEnum("status").notNull().default("pending"),
    permittedTabs: text("permitted_tabs").array().notNull().default([]),
    adminNotes: text("admin_notes"),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });

  export const memberApplicationsTable = pgTable("member_applications", {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    country: text("country"),
    industry: text("industry"),
    businessDescription: text("business_description").notNull(),
    grahamGoals: text("graham_goals").notNull(),
    budget: text("budget"),
    referral: text("referral"),
    status: memberApplicationStatusEnum("status").notNull().default("pending"),
    quotationAmount: text("quotation_amount"),
    quotationNotes: text("quotation_notes"),
    quotationSentAt: timestamp("quotation_sent_at"),
    paidAt: timestamp("paid_at"),
    bloomMemberId: text("bloom_member_id"),
    bloomSecretPassword: text("bloom_secret_password"),
    assignedGrahamId: text("assigned_graham_id"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });
  