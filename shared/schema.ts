import { pgTable, text, serial, integer, boolean, timestamp, varchar, real, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main user table for authentication
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("CLIENT"), // SUPER_ADMIN or CLIENT
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Plans/Pricing table
export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  billing: text("billing").notNull().default("MONTHLY"), // MONTHLY or YEARLY
  features: text("features").array().notNull(),
  maxUsers: integer("max_users").notNull(),
  storageGB: integer("storage_gb").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlanSchema = createInsertSchema(plans).pick({
  name: true,
  price: true,
  billing: true,
  features: true,
  maxUsers: true,
  storageGB: true,
  isActive: true,
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

// Onboarding sessions for tracking multi-step signup
export const onboardingSessions = pgTable("onboarding_sessions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  planId: text("plan_id").notNull(),
  currentStep: integer("current_step").default(1),
  isCompleted: boolean("is_completed").default(false),
  businessData: text("business_data"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertOnboardingSessionSchema = createInsertSchema(onboardingSessions).pick({
  sessionId: true,
  planId: true,
  currentStep: true,
  businessData: true,
});

export type InsertOnboardingSession = z.infer<typeof insertOnboardingSessionSchema>;
export type OnboardingSession = typeof onboardingSessions.$inferSelect;

// Client businesses 
export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  businessAddress: text("business_address"),
  industry: text("industry"),
  businessDescription: text("business_description"),
  logoUrl: text("logo_url"),
  operatingHours: text("operating_hours"), // JSON string
  timeZone: text("time_zone"),
  planId: text("plan_id").notNull(),
  status: text("status").notNull().default("TRIAL"), // TRIAL, ACTIVE, INACTIVE, CANCELLED
  userId: text("user_id").notNull().unique(),
  onboardingSessionId: text("onboarding_session_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  businessName: true,
  contactPerson: true,
  email: true,
  phone: true,
  businessAddress: true,
  industry: true,
  businessDescription: true,
  logoUrl: true,
  operatingHours: true,
  timeZone: true,
  planId: true,
  status: true,
  userId: true,
  onboardingSessionId: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Legacy services table (keeping for now)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  category: text("category"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  durationMinutes: true,
  category: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Reviews table (keeping for demo purposes)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  date: timestamp("date").defaultNow(),
  publishConsent: boolean("publish_consent").default(false),
  published: boolean("published").default(false),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  name: true,
  email: true,
  rating: true,
  text: true,
  publishConsent: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;