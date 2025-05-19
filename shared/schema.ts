import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Services
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  durationMinutes: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Stylists
export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
});

export const insertStylistSchema = createInsertSchema(stylists).pick({
  name: true,
  bio: true,
  imageUrl: true,
});

export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type Stylist = typeof stylists.$inferSelect;

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  stylistId: integer("stylist_id").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  professionalNotes: text("professional_notes"),
  confirmed: boolean("confirmed").default(false),
  emailConfirmation: boolean("email_confirmation").default(true),
  smsConfirmation: boolean("sms_confirmation").default(false),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  serviceId: true,
  stylistId: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  date: true,
  notes: true,
  professionalNotes: true,
  emailConfirmation: true,
  smsConfirmation: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  date: timestamp("date").notNull().defaultNow(),
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

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  read: boolean("read").default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
