import { pgTable, serial, text, numeric, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mkpWishlistTable = pgTable("mkp_wishlist", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  budgetMin: numeric("budget_min", { precision: 12, scale: 2 }).notNull(),
  budgetMax: numeric("budget_max", { precision: 12, scale: 2 }).notNull(),
  platform: text("platform").notNull().default("any"),
  status: text("status").notNull().default("watching"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mkpDealsTable = pgTable("mkp_deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  platform: text("platform").notNull(),
  originalPrice: numeric("original_price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  url: text("url").notNull(),
  isTrending: boolean("is_trending").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(true),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mkpAlertsTable = pgTable("mkp_alerts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  wishlistItemId: integer("wishlist_item_id").notNull(),
  platform: text("platform").notNull(),
  originalPrice: numeric("original_price", { precision: 12, scale: 2 }).notNull(),
  alertPrice: numeric("alert_price", { precision: 12, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 12, scale: 2 }).notNull(),
  triggered: boolean("triggered").notNull().default(false),
  triggeredAt: timestamp("triggered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMkpWishlistSchema = createInsertSchema(mkpWishlistTable).omit({ id: true, createdAt: true });
export type InsertMkpWishlist = z.infer<typeof insertMkpWishlistSchema>;
export type MkpWishlist = typeof mkpWishlistTable.$inferSelect;

export const insertMkpDealSchema = createInsertSchema(mkpDealsTable).omit({ id: true, createdAt: true });
export type InsertMkpDeal = z.infer<typeof insertMkpDealSchema>;
export type MkpDeal = typeof mkpDealsTable.$inferSelect;
