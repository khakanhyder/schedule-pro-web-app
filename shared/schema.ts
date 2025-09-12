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
  isFreeTrial: boolean("is_free_trial").default(false),
  trialDays: integer("trial_days").default(0),
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
  isFreeTrial: true,
  trialDays: true,
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

// Client-specific business services
export const clientServices = pgTable("client_services", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  category: text("category"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientServiceSchema = createInsertSchema(clientServices).pick({
  clientId: true,
  name: true,
  description: true,
  price: true,
  durationMinutes: true,
  category: true,
  isActive: true,
});

export type InsertClientService = z.infer<typeof insertClientServiceSchema>;
export type ClientService = typeof clientServices.$inferSelect;

// Client appointments
export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  serviceId: text("service_id").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("SCHEDULED"), // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
  notes: text("notes"),
  totalPrice: real("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  clientId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  serviceId: true,
  appointmentDate: true,
  startTime: true,
  endTime: true,
  status: true,
  notes: true,
  totalPrice: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Client operating hours
export const operatingHours = pgTable("operating_hours", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  isOpen: boolean("is_open").default(true),
  openTime: text("open_time"), // HH:MM format
  closeTime: text("close_time"), // HH:MM format
  breakStartTime: text("break_start_time"),
  breakEndTime: text("break_end_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOperatingHoursSchema = createInsertSchema(operatingHours).pick({
  clientId: true,
  dayOfWeek: true,
  isOpen: true,
  openTime: true,
  closeTime: true,
  breakStartTime: true,
  breakEndTime: true,
});

export type InsertOperatingHours = z.infer<typeof insertOperatingHoursSchema>;
export type OperatingHours = typeof operatingHours.$inferSelect;

// Client leads tracking
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  source: text("source").notNull(), // website, phone, referral, social, etc.
  status: text("status").notNull().default("NEW"), // NEW, CONTACTED, QUALIFIED, CONVERTED, LOST
  notes: text("notes"),
  interestedServices: text("interested_services").array().default([]),
  estimatedValue: real("estimated_value"),
  followUpDate: timestamp("follow_up_date"),
  convertedToAppointment: boolean("converted_to_appointment").default(false),
  appointmentId: text("appointment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  clientId: true,
  name: true,
  email: true,
  phone: true,
  source: true,
  status: true,
  notes: true,
  interestedServices: true,
  estimatedValue: true,
  followUpDate: true,
  convertedToAppointment: true,
  appointmentId: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Client website settings
export const clientWebsites = pgTable("client_websites", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  subdomain: text("subdomain").notNull().unique(), // e.g., "johns-salon"
  customDomain: text("custom_domain"), // e.g., "johnssalon.com"
  title: text("title").notNull(),
  description: text("description"),
  heroImage: text("hero_image"),
  primaryColor: text("primary_color").default("#3B82F6"),
  secondaryColor: text("secondary_color").default("#F3F4F6"),
  contactInfo: text("contact_info"), // JSON string
  socialLinks: text("social_links"), // JSON string
  sections: text("sections"), // JSON string for website sections
  showPrices: boolean("show_prices").default(true),
  allowOnlineBooking: boolean("allow_online_booking").default(true),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientWebsiteSchema = createInsertSchema(clientWebsites).pick({
  clientId: true,
  subdomain: true,
  customDomain: true,
  title: true,
  description: true,
  heroImage: true,
  primaryColor: true,
  secondaryColor: true,
  contactInfo: true,
  socialLinks: true,
  sections: true,
  showPrices: true,
  allowOnlineBooking: true,
  isPublished: true,
});

export type InsertClientWebsite = z.infer<typeof insertClientWebsiteSchema>;
export type ClientWebsite = typeof clientWebsites.$inferSelect;

// Appointment Slots for availability management
export const appointmentSlots = pgTable("appointment_slots", {
  id: varchar("id").primaryKey().notNull(),
  clientId: varchar("client_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time").notNull(), // "09:00"
  endTime: varchar("end_time").notNull(), // "17:00"
  slotDuration: integer("slot_duration").default(30), // minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppointmentSlotSchema = createInsertSchema(appointmentSlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppointmentSlot = z.infer<typeof insertAppointmentSlotSchema>;
export type AppointmentSlot = typeof appointmentSlots.$inferSelect;

// Team Members table
export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("STAFF"), // ADMIN, STAFF, MANAGER
  permissions: text("permissions").array().default([]), // Array of permission strings
  isActive: boolean("is_active").default(true),
  hourlyRate: real("hourly_rate"),
  specializations: text("specializations").array().default([]),
  workingHours: text("working_hours"), // JSON string with schedule
  password: text("password").notNull(), // Hashed password for authentication
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  clientId: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  permissions: true,
  isActive: true,
  hourlyRate: true,
  specializations: true,
  workingHours: true,
  password: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Stylist is an alias for TeamMember (industry-specific terminology)
export const insertStylistSchema = insertTeamMemberSchema;
export type Stylist = TeamMember;

// Payments table
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  appointmentId: text("appointment_id"),
  paymentMethod: text("payment_method").notNull(), // STRIPE, PAYPAL, VENMO, ZELLE, CASH
  paymentProvider: text("payment_provider"), // stripe, paypal, etc.
  paymentIntentId: text("payment_intent_id"), // External payment ID
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("PENDING"), // PENDING, COMPLETED, FAILED, REFUNDED
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  processingFee: real("processing_fee"),
  netAmount: real("net_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  clientId: true,
  appointmentId: true,
  paymentMethod: true,
  paymentProvider: true,
  paymentIntentId: true,
  amount: true,
  currency: true,
  status: true,
  customerName: true,
  customerEmail: true,
  description: true,
  metadata: true,
  processingFee: true,
  netAmount: true,
  paidAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// AI Voice Agents table
export const aiVoiceAgents = pgTable("ai_voice_agents", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  agentName: text("agent_name").notNull(),
  voiceType: text("voice_type").default("PROFESSIONAL"), // PROFESSIONAL, FRIENDLY, CASUAL
  language: text("language").default("en-US"),
  isActive: boolean("is_active").default(false),
  welcomeMessage: text("welcome_message"),
  businessHours: text("business_hours"), // JSON string
  availableServices: text("available_services").array().default([]),
  bookingEnabled: boolean("booking_enabled").default(true),
  transcriptionEnabled: boolean("transcription_enabled").default(true),
  twilioPhoneNumber: text("twilio_phone_number"),
  callVolume: integer("call_volume").default(0),
  lastCallAt: timestamp("last_call_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAIVoiceAgentSchema = createInsertSchema(aiVoiceAgents).pick({
  clientId: true,
  agentName: true,
  voiceType: true,
  language: true,
  isActive: true,
  welcomeMessage: true,
  businessHours: true,
  availableServices: true,
  bookingEnabled: true,
  transcriptionEnabled: true,
  twilioPhoneNumber: true,
});

export type InsertAIVoiceAgent = z.infer<typeof insertAIVoiceAgentSchema>;
export type AIVoiceAgent = typeof aiVoiceAgents.$inferSelect;

// Google Business Profiles table
export const googleBusinessProfiles = pgTable("google_business_profiles", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  businessName: text("business_name").notNull(),
  googlePlaceId: text("google_place_id"),
  isVerified: boolean("is_verified").default(false),
  averageRating: real("average_rating"),
  totalReviews: integer("total_reviews").default(0),
  businessHours: text("business_hours"), // JSON string
  businessDescription: text("business_description"),
  businessCategories: text("business_categories").array().default([]),
  businessPhotos: text("business_photos").array().default([]),
  website: text("website"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGoogleBusinessProfileSchema = createInsertSchema(googleBusinessProfiles).pick({
  clientId: true,
  businessName: true,
  googlePlaceId: true,
  isVerified: true,
  averageRating: true,
  totalReviews: true,
  businessHours: true,
  businessDescription: true,
  businessCategories: true,
  businessPhotos: true,
  website: true,
  phoneNumber: true,
  address: true,
  postalCode: true,
  city: true,
  state: true,
  country: true,
  latitude: true,
  longitude: true,
  lastSyncAt: true,
});

export type InsertGoogleBusinessProfile = z.infer<typeof insertGoogleBusinessProfileSchema>;
export type GoogleBusinessProfile = typeof googleBusinessProfiles.$inferSelect;

// Review platforms for landing page "How It Works" section
export const reviewPlatforms = pgTable("landing_review_platforms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Google", "Yelp", "Trust Pilot"
  displayName: text("display_name").notNull(), // e.g., "Google Reviews"
  rating: real("rating").notNull(), // e.g., 4.9
  maxRating: real("max_rating").notNull().default(5), // e.g., 5
  reviewCount: integer("review_count"), // Optional: number of reviews
  logoUrl: text("logo_url"), // Optional: logo image URL
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0), // For ordering on frontend
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReviewPlatformSchema = createInsertSchema(reviewPlatforms).pick({
  name: true,
  displayName: true,
  rating: true,
  maxRating: true,
  reviewCount: true,
  logoUrl: true,
  isActive: true,
  sortOrder: true,
});

export type InsertReviewPlatform = z.infer<typeof insertReviewPlatformSchema>;
export type ReviewPlatform = typeof reviewPlatforms.$inferSelect;

// Domain configurations for client admin and client websites
export const domainConfigurations = pgTable("domain_configurations", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  domainType: text("domain_type").notNull(), // ADMIN_PORTAL, CLIENT_WEBSITE
  domain: text("domain").notNull(), // e.g., "admin.mybusiness.com" or "mybusiness.com"
  subdomain: text("subdomain"), // e.g., "admin" or "www" 
  isActive: boolean("is_active").default(false),
  verificationStatus: text("verification_status").default("PENDING"), // PENDING, VERIFIED, FAILED
  verificationToken: text("verification_token"), // For domain verification
  verificationMethod: text("verification_method").default("DNS_TXT"), // DNS_TXT, FILE_UPLOAD, CNAME
  sslStatus: text("ssl_status").default("PENDING"), // PENDING, ACTIVE, FAILED, EXPIRED
  sslCertificateId: text("ssl_certificate_id"), // External SSL cert reference
  sslIssuedAt: timestamp("ssl_issued_at"),
  sslExpiresAt: timestamp("ssl_expires_at"),
  dnsRecords: text("dns_records"), // JSON string of required DNS records
  redirectToHttps: boolean("redirect_to_https").default(true),
  customSettings: text("custom_settings"), // JSON string for additional domain settings
  lastCheckedAt: timestamp("last_checked_at"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDomainConfigurationSchema = createInsertSchema(domainConfigurations).pick({
  clientId: true,
  domainType: true,
  domain: true,
  subdomain: true,
  isActive: true,
  verificationStatus: true,
  verificationToken: true,
  verificationMethod: true,
  sslStatus: true,
  sslCertificateId: true,
  sslIssuedAt: true,
  sslExpiresAt: true,
  dnsRecords: true,
  redirectToHttps: true,
  customSettings: true,
  lastCheckedAt: true,
  verifiedAt: true,
});

export type InsertDomainConfiguration = z.infer<typeof insertDomainConfigurationSchema>;
export type DomainConfiguration = typeof domainConfigurations.$inferSelect;

// Domain verification logs for tracking verification attempts
export const domainVerificationLogs = pgTable("domain_verification_logs", {
  id: text("id").primaryKey(),
  domainConfigId: text("domain_config_id").notNull(),
  verificationAttempt: integer("verification_attempt").default(1),
  verificationMethod: text("verification_method").notNull(),
  status: text("status").notNull(), // SUCCESS, FAILED, TIMEOUT
  errorMessage: text("error_message"),
  verificationData: text("verification_data"), // JSON string with verification details
  responseTime: integer("response_time"), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDomainVerificationLogSchema = createInsertSchema(domainVerificationLogs).pick({
  domainConfigId: true,
  verificationAttempt: true,
  verificationMethod: true,
  status: true,
  errorMessage: true,
  verificationData: true,
  responseTime: true,
});

export type InsertDomainVerificationLog = z.infer<typeof insertDomainVerificationLogSchema>;
export type DomainVerificationLog = typeof domainVerificationLogs.$inferSelect;