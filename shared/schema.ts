import { pgTable, text, serial, integer, boolean, timestamp, varchar, real, doublePrecision } from "drizzle-orm/pg-core";
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

// Stylists
export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  email: text("email"),
  phone: text("phone"),
  specialties: text("specialties").array(),
});

export const insertStylistSchema = createInsertSchema(stylists).pick({
  name: true,
  bio: true,
  imageUrl: true,
  email: true,
  phone: true,
  specialties: true,
});

export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type Stylist = typeof stylists.$inferSelect;

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  preferredService: text("preferred_service"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  lastVisit: timestamp("last_visit"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  email: true,
  phone: true,
  preferredService: true,
  notes: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  stylistId: integer("stylist_id").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  date: timestamp("date").notNull(),
  durationMinutes: integer("duration_minutes").default(60),
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
  durationMinutes: true,
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

// AI Scheduling Optimization
export const aiSchedulingRules = pgTable("ai_scheduling_rules", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().default(1),
  ruleType: text("rule_type").notNull(), // 'optimization', 'prediction', 'pricing'
  conditions: text("conditions").notNull(), // JSON string of conditions
  actions: text("actions").notNull(), // JSON string of actions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Marketing Campaigns
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'email', 'sms', 'review_request', 'rebook_reminder'
  status: text("status").notNull().default('draft'), // 'draft', 'active', 'paused', 'completed'
  targetAudience: text("target_audience").notNull(), // JSON string of targeting criteria
  content: text("content").notNull(), // Generated content
  schedule: text("schedule"), // JSON string of scheduling rules
  metrics: text("metrics"), // JSON string of performance metrics
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSent: timestamp("last_sent"),
});

// Client Insights (Analytics)
export const clientInsights = pgTable("client_insights", {
  id: serial("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  insightType: text("insight_type").notNull(), // 'loyalty_score', 'churn_risk', 'lifetime_value', 'preferences'
  data: text("data").notNull(), // JSON string of insight data
  confidence: real("confidence"), // Confidence score 0-1
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Smart Scheduling Suggestions
export const schedulingSuggestions = pgTable("scheduling_suggestions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  suggestionType: text("suggestion_type").notNull(), // 'time_optimization', 'service_upsell', 'rebooking'
  suggestion: text("suggestion").notNull(),
  reasoning: text("reasoning").notNull(),
  priority: integer("priority").default(1), // 1-5 priority score
  isAccepted: boolean("is_accepted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).pick({
  name: true,
  type: true,
  targetAudience: true,
  content: true,
  schedule: true,
});

export const insertClientInsightSchema = createInsertSchema(clientInsights).pick({
  clientEmail: true,
  appointmentId: true,
  insightType: true,
  data: true,
  confidence: true,
});

export const insertSchedulingSuggestionSchema = createInsertSchema(schedulingSuggestions).pick({
  appointmentId: true,
  suggestionType: true,
  suggestion: true,
  reasoning: true,
  priority: true,
});

// Invoices and Tracking
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  status: text("status").notNull().default('sent'), // 'sent', 'viewed', 'paid', 'overdue'
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  publicUrl: text("public_url").notNull(), // Unique URL for client access
});

export const invoiceViews = pgTable("invoice_views", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  duration: integer("duration"), // Time spent viewing in seconds
});

export const invoiceNotifications = pgTable("invoice_notifications", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  notificationType: text("notification_type").notNull(), // 'view', 'multiple_views', 'time_spent'
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  clientId: true,
  clientEmail: true,
  clientName: true,
  invoiceNumber: true,
  title: true,
  description: true,
  amount: true,
  status: true,
  dueDate: true,
  publicUrl: true,
});

export const insertInvoiceViewSchema = createInsertSchema(invoiceViews).pick({
  invoiceId: true,
  ipAddress: true,
  userAgent: true,
  duration: true,
});

export const insertInvoiceNotificationSchema = createInsertSchema(invoiceNotifications).pick({
  invoiceId: true,
  notificationType: true,
  message: true,
});

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = z.infer<typeof insertMarketingCampaignSchema>;
export type ClientInsight = typeof clientInsights.$inferSelect;
export type InsertClientInsight = z.infer<typeof insertClientInsightSchema>;
export type SchedulingSuggestion = typeof schedulingSuggestions.$inferSelect;
export type InsertSchedulingSuggestion = z.infer<typeof insertSchedulingSuggestionSchema>;
// Review Request Management
export const reviewRequests = pgTable("review_requests", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  platform: text("platform").notNull(), // 'google', 'yelp', 'facebook', 'angi', 'bbb', 'nextdoor'
  status: text("status").notNull().default('sent'), // 'sent', 'opened', 'completed', 'expired'
  customMessage: text("custom_message"),
  requestUrl: text("request_url").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  openedAt: timestamp("opened_at"),
  completedAt: timestamp("completed_at"),
});

export const reviewSubmissions = pgTable("review_submissions", {
  id: serial("id").primaryKey(),
  reviewRequestId: integer("review_request_id").references(() => reviewRequests.id),
  clientName: text("client_name").notNull(),
  platform: text("platform").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  isApproved: boolean("is_approved").default(false),
  isPublished: boolean("is_published").default(false),
  approvedAt: timestamp("approved_at"),
  publishedAt: timestamp("published_at"),
  operatorNotes: text("operator_notes"),
});

export const insertReviewRequestSchema = createInsertSchema(reviewRequests).pick({
  clientId: true,
  clientName: true,
  clientEmail: true,
  platform: true,
  customMessage: true,
  requestUrl: true,
});

export const insertReviewSubmissionSchema = createInsertSchema(reviewSubmissions).pick({
  reviewRequestId: true,
  clientName: true,
  platform: true,
  rating: true,
  reviewText: true,
  operatorNotes: true,
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InvoiceView = typeof invoiceViews.$inferSelect;
export type InsertInvoiceView = z.infer<typeof insertInvoiceViewSchema>;
export type InvoiceNotification = typeof invoiceNotifications.$inferSelect;
export type InsertInvoiceNotification = z.infer<typeof insertInvoiceNotificationSchema>;
export type ReviewRequest = typeof reviewRequests.$inferSelect;
export type InsertReviewRequest = z.infer<typeof insertReviewRequestSchema>;
export type ReviewSubmission = typeof reviewSubmissions.$inferSelect;
export type InsertReviewSubmission = z.infer<typeof insertReviewSubmissionSchema>;

// 3D Room Visualization for Skilled Trades
export const roomProjects = pgTable("room_projects", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(), // 'kitchen', 'bathroom', 'living_room', 'bedroom', 'custom'
  roomLength: real("room_length").notNull(), // in feet
  roomWidth: real("room_width").notNull(), // in feet
  roomHeight: real("room_height").notNull(), // in feet
  doorPositions: text("door_positions"), // JSON array of door positions
  windowPositions: text("window_positions"), // JSON array of window positions
  currentMaterials: text("current_materials"), // JSON object of current materials
  selectedMaterials: text("selected_materials"), // JSON object of selected materials
  photos: text("photos").array(), // Array of photo URLs
  notes: text("notes"),
  estimatedCost: real("estimated_cost"),
  status: text("status").notNull().default('draft'), // 'draft', 'approved', 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roomMaterials = pgTable("room_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'flooring', 'paint', 'tiles', 'fixtures', 'cabinets'
  subcategory: text("subcategory"), // 'hardwood', 'laminate', 'ceramic', 'granite', etc.
  color: text("color").notNull(),
  texture: text("texture"), // URL to texture image
  price: real("price"), // per square foot or unit
  unit: text("unit").notNull(), // 'sq_ft', 'linear_ft', 'unit'
  brand: text("brand"),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

export const insertRoomProjectSchema = createInsertSchema(roomProjects).pick({
  clientId: true,
  clientName: true,
  clientEmail: true,
  projectName: true,
  projectType: true,
  roomLength: true,
  roomWidth: true,
  roomHeight: true,
  doorPositions: true,
  windowPositions: true,
  currentMaterials: true,
  selectedMaterials: true,
  photos: true,
  notes: true,
  estimatedCost: true,
  status: true,
});

export const insertRoomMaterialSchema = createInsertSchema(roomMaterials).pick({
  name: true,
  category: true,
  subcategory: true,
  color: true,
  texture: true,
  price: true,
  unit: true,
  brand: true,
  description: true,
  imageUrl: true,
  isActive: true,
});

export type RoomProject = typeof roomProjects.$inferSelect;
export type InsertRoomProject = z.infer<typeof insertRoomProjectSchema>;
export type RoomMaterial = typeof roomMaterials.$inferSelect;
export type InsertRoomMaterial = z.infer<typeof insertRoomMaterialSchema>;


