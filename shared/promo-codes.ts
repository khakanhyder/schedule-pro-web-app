// Beta Testing Promo Code System
import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const promoCodes = pgTable("promo_codes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // 'beta_testing', 'discount', 'free_trial'
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // 'percentage', 'fixed_amount', 'free_months'
  discountValue: integer("discount_value").notNull(), // percentage (1-100) or amount in cents or months
  maxUses: integer("max_uses").default(null), // null = unlimited
  currentUses: integer("current_uses").default(0),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promoCodeUsage = pgTable("promo_code_usage", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  promoCodeId: integer("promo_code_id").notNull().references(() => promoCodes.id),
  userEmail: text("user_email").notNull(),
  userName: text("user_name"),
  usedAt: timestamp("used_at").defaultNow(),
  subscriptionId: text("subscription_id"), // Stripe subscription ID if applicable
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  currentUses: true,
  createdAt: true,
});

export const insertPromoCodeUsageSchema = createInsertSchema(promoCodeUsage).omit({
  id: true,
  usedAt: true,
});

export type PromoCode = typeof promoCodes.$inferSelect;
export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type InsertPromoCodeUsage = z.infer<typeof insertPromoCodeUsageSchema>;

// Pre-defined beta testing codes
export const BETA_PROMO_CODES = [
  {
    code: 'BETA3MONTHS',
    type: 'beta_testing',
    description: 'Beta Tester - 3 Months Free Access',
    discountType: 'free_months',
    discountValue: 3,
    maxUses: 100, // Limit beta testers
    validFrom: new Date('2025-07-24'),
    validUntil: new Date('2025-12-31'),
  },
  {
    code: 'EARLYACCESS',
    type: 'beta_testing', 
    description: 'Early Access Beta - 3 Months Free',
    discountType: 'free_months',
    discountValue: 3,
    maxUses: 50,
    validFrom: new Date('2025-07-24'),
    validUntil: new Date('2025-10-31'),
  },
  {
    code: 'TESTSCHEDULED',
    type: 'beta_testing',
    description: 'Scheduled Beta Testing Program',
    discountType: 'free_months', 
    discountValue: 3,
    maxUses: 75,
    validFrom: new Date('2025-07-24'),
    validUntil: new Date('2025-11-30'),
  }
];