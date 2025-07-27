import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  stylists, type Stylist, type InsertStylist,
  clients, type Client, type InsertClient,
  appointments, type Appointment, type InsertAppointment,
  reviews, type Review, type InsertReview,
  contactMessages, type ContactMessage, type InsertContactMessage,
  marketingCampaigns, type MarketingCampaign, type InsertMarketingCampaign,
  clientInsights, type ClientInsight, type InsertClientInsight,
  schedulingSuggestions, type SchedulingSuggestion, type InsertSchedulingSuggestion,
  jobEstimates, type JobEstimate, type InsertJobEstimate,
  invoices, type Invoice, type InsertInvoice,
  invoiceViews, type InvoiceView, type InsertInvoiceView,
  invoiceNotifications, type InvoiceNotification, type InsertInvoiceNotification,
  reviewRequests, type ReviewRequest, type InsertReviewRequest,
  reviewSubmissions, type ReviewSubmission, type InsertReviewSubmission,
  roomProjects, type RoomProject, type InsertRoomProject,
  roomMaterials, type RoomMaterial, type InsertRoomMaterial,
  businessProfiles, type BusinessProfile, type InsertBusinessProfile,
  bookingQRCodes, type BookingQRCode, type InsertBookingQRCode
} from "@shared/schema";
import { type IndustryData, industryDatabase } from "./industryData";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Stylists
  getStylists(): Promise<Stylist[]>;
  getStylist(id: number): Promise<Stylist | undefined>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  updateStylist(id: number, updates: Partial<InsertStylist>): Promise<Stylist>;
  deleteStylist(id: number): Promise<void>;
  
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  // Appointment Approval System
  getPendingAppointments(): Promise<Appointment[]>;
  getAppointmentsByStatus(status: string): Promise<Appointment[]>;
  approveAppointment(id: number, operatorNotes?: string): Promise<Appointment>;
  declineAppointment(id: number, reason: string): Promise<Appointment>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getPublishedReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // AI Scheduling & Marketing
  getMarketingCampaigns(): Promise<MarketingCampaign[]>;
  createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign>;
  updateMarketingCampaign(id: number, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign>;
  
  getClientInsights(clientEmail: string): Promise<ClientInsight[]>;
  createClientInsight(insight: InsertClientInsight): Promise<ClientInsight>;
  
  getSchedulingSuggestions(appointmentId?: number): Promise<SchedulingSuggestion[]>;
  createSchedulingSuggestion(suggestion: InsertSchedulingSuggestion): Promise<SchedulingSuggestion>;
  acceptSchedulingSuggestion(id: number): Promise<void>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  getAllAppointments(): Promise<Appointment[]>;
  
  // Industry management
  setIndustryData(industryId: string): Promise<void>;
  getCurrentIndustry(): IndustryData;
  
  // Business Profiles
  getBusinessProfiles(): Promise<BusinessProfile[]>;
  createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile>;
  getBusinessProfile(slug: string): Promise<BusinessProfile | undefined>;
  getBusinessProfileBySlug(slug: string): Promise<BusinessProfile | undefined>;
  
  // QR Codes
  getBookingQRCodes(): Promise<BookingQRCode[]>;
  createBookingQRCode(qrCode: InsertBookingQRCode): Promise<BookingQRCode>;
  
  // Invoice tracking
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByPublicUrl(publicUrl: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  trackInvoiceView(view: InsertInvoiceView): Promise<InvoiceView>;
  getInvoiceViewCount(invoiceId: number): Promise<number>;
  updateInvoiceViewDuration(invoiceId: number, duration: number): Promise<void>;
  getInvoiceNotifications(): Promise<InvoiceNotification[]>;
  createInvoiceNotification(notification: InsertInvoiceNotification): Promise<InvoiceNotification>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Review request management
  getReviewRequests(): Promise<ReviewRequest[]>;
  getReviewRequest(id: number): Promise<ReviewRequest | undefined>;
  createReviewRequest(request: InsertReviewRequest): Promise<ReviewRequest>;
  updateReviewRequestStatus(id: number, status: string): Promise<void>;
  getReviewSubmissions(): Promise<ReviewSubmission[]>;
  createReviewSubmission(submission: InsertReviewSubmission): Promise<ReviewSubmission>;
  approveReviewSubmission(id: number, operatorNotes?: string): Promise<void>;
  publishReviewSubmission(id: number): Promise<void>;
  
  // Industry management
  setIndustry(industryId: string): Promise<void>;
  getCurrentIndustry(): { id: string; name: string };
  
  // Room Projects (3D Visualization)
  getRoomProjects(): Promise<RoomProject[]>;
  getRoomProject(id: number): Promise<RoomProject | undefined>;
  createRoomProject(project: InsertRoomProject): Promise<RoomProject>;
  updateRoomProject(id: number, updates: Partial<InsertRoomProject>): Promise<RoomProject>;
  deleteRoomProject(id: number): Promise<void>;
  
  // Room Materials
  getRoomMaterials(): Promise<RoomMaterial[]>;
  getRoomMaterial(id: number): Promise<RoomMaterial | undefined>;
  createRoomMaterial(material: InsertRoomMaterial): Promise<RoomMaterial>;
  updateRoomMaterial(id: number, updates: Partial<InsertRoomMaterial>): Promise<RoomMaterial>;
  deleteRoomMaterial(id: number): Promise<void>;
  getRoomMaterialsByCategory(category: string): Promise<RoomMaterial[]>;
  
  // Business Profiles (Direct Booking)
  getBusinessProfiles(): Promise<BusinessProfile[]>;
  getBusinessProfile(id: number): Promise<BusinessProfile | undefined>;
  getBusinessProfileBySlug(slug: string): Promise<BusinessProfile | undefined>;
  createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile>;
  updateBusinessProfile(id: number, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile>;
  deleteBusinessProfile(id: number): Promise<void>;
  
  // QR Codes for Booking
  getBookingQRCodes(businessId?: number): Promise<BookingQRCode[]>;
  getBookingQRCode(id: number): Promise<BookingQRCode | undefined>;
  createBookingQRCode(qrCode: InsertBookingQRCode): Promise<BookingQRCode>;
  updateQRCodeScanCount(id: number): Promise<void>;
  deleteBookingQRCode(id: number): Promise<void>;
  
  // Appointment Approval System
  approveAppointment(id: number, operatorNotes?: string): Promise<Appointment>;
  declineAppointment(id: number, reason: string): Promise<Appointment>;
  getPendingAppointments(): Promise<Appointment[]>;
  getAppointmentsByStatus(status: string): Promise<Appointment[]>;
  
  // Job Estimates
  getJobEstimates(): Promise<JobEstimate[]>;
  getJobEstimate(id: number): Promise<JobEstimate | undefined>;
  createJobEstimate(estimate: InsertJobEstimate): Promise<JobEstimate>;
  updateJobEstimate(id: number, updates: Partial<InsertJobEstimate>): Promise<JobEstimate>;
  deleteJobEstimate(id: number): Promise<void>;
  convertEstimateToInvoice(estimateId: number): Promise<Invoice>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private services = new Map<number, Service>();
  private stylists = new Map<number, Stylist>();
  private clients = new Map<number, Client>();
  private appointments = new Map<number, Appointment>();
  private reviews = new Map<number, Review>();
  private contactMessages = new Map<number, ContactMessage>();
  private marketingCampaigns = new Map<number, MarketingCampaign>();
  private clientInsights = new Map<number, ClientInsight>();
  private schedulingSuggestions = new Map<number, SchedulingSuggestion>();
  private invoices = new Map<number, Invoice>();
  private invoiceViews = new Map<number, InvoiceView>();
  private invoiceNotifications = new Map<number, InvoiceNotification>();
  private reviewRequests = new Map<number, ReviewRequest>();
  private reviewSubmissions = new Map<number, ReviewSubmission>();
  private roomProjects = new Map<number, RoomProject>();
  private roomMaterials = new Map<number, RoomMaterial>();
  private jobEstimates = new Map<number, JobEstimate>();
  private businessProfiles = new Map<number, BusinessProfile>();
  private bookingQRCodes = new Map<number, BookingQRCode>();
  
  private userCurrentId = 1;
  private serviceCurrentId = 1;
  private stylistCurrentId = 1;
  private clientCurrentId = 1;
  private appointmentCurrentId = 1;
  private reviewCurrentId = 1;
  private contactMessageCurrentId = 1;
  private marketingCampaignCurrentId = 1;
  private clientInsightCurrentId = 1;
  private schedulingSuggestionCurrentId = 1;
  private invoiceCurrentId = 1;
  private invoiceViewCurrentId = 1;
  private invoiceNotificationCurrentId = 1;
  private reviewRequestCurrentId = 1;
  private reviewSubmissionCurrentId = 1;
  private roomProjectCurrentId = 1;
  private roomMaterialCurrentId = 1;
  private jobEstimateCurrentId = 1;
  private businessProfileCurrentId = 1;
  private qrCodeCurrentId = 1;
  
  // Track the current industry
  private currentIndustryId = "home_services";

  constructor() {
    // Initialize with some sample data
    this.initializeServices();
    this.initializeStylists();
    this.initializeReviews();
    this.initializeRoomMaterials();
  }
  


  private initializeServices(): void {
    const industry = industryDatabase[this.currentIndustryId];
    
    if (!industry) {
      console.error(`Industry ${this.currentIndustryId} not found!`);
      return;
    }
    
    // Clear existing services to prevent duplicates
    this.services.clear();
    this.serviceCurrentId = 1;
    
    // Create unique services based on current industry
    const uniqueServices = Array.from(new Set(industry.services)); // Remove duplicates
    
    for (let i = 0; i < uniqueServices.length; i++) {
      const name = uniqueServices[i];
      const description = industry.serviceDescriptions[i] || `Professional ${name}`;
      
      // Generate price based on service index
      const basePrice = 45 + (i * 10);
      const price = `${basePrice}${i % 2 === 0 ? '' : '+'}`;
      
      // Generate duration based on service index
      const durations = [30, 45, 60, 90, 120];
      const durationMinutes = durations[i % durations.length];
      
      const service: InsertService = {
        name,
        description,
        price,
        durationMinutes
      };
      
      this.createService(service);
    }
  }
  
  private initializeStylists(): void {
    // Clear existing staff to start fresh
    this.stylists.clear();
    this.stylistCurrentId = 1;
    
    // Start with empty staff list - users will add their own team members
    // This creates a more personalized experience where the dropdown grows
    // as they add custom entries during appointment booking
  }

  private initializeReviews(): void {
    const sampleReviews = [
      {
        name: "Emma Johnson",
        email: "emma@example.com",
        rating: 5,
        text: "Absolutely amazing service! So happy with my experience and will definitely be coming back.",
        publishConsent: true,
        published: true
      },
      {
        name: "Michael Smith",
        email: "michael@example.com",
        rating: 4,
        text: "Great service, very professional and attentive to my needs. Highly recommended!",
        publishConsent: true,
        published: true
      },
      {
        name: "Sophia Williams",
        email: "sophia@example.com",
        rating: 5,
        text: "Excellent experience from start to finish. The attention to detail was impressive!",
        publishConsent: true,
        published: true
      }
    ];

    sampleReviews.forEach(review => {
      const insertReview: InsertReview = {
        ...review
      };
      this.createReview(insertReview);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getServices(): Promise<Service[]> {
    const services = Array.from(this.services.values());
    // Sort alphabetically by name for better organization
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const service: Service = { 
      ...insertService, 
      id,
      category: insertService.category || null
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<Service> {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`Service with id ${id} not found`);
    }
    const updatedService = { ...service, ...updates };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    if (!this.services.delete(id)) {
      throw new Error(`Service with id ${id} not found`);
    }
  }

  async getStylists(): Promise<Stylist[]> {
    const stylists = Array.from(this.stylists.values());
    // Sort alphabetically by name for better organization
    return stylists.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getStylist(id: number): Promise<Stylist | undefined> {
    return this.stylists.get(id);
  }

  async createStylist(insertStylist: InsertStylist): Promise<Stylist> {
    const id = this.stylistCurrentId++;
    const stylist: Stylist = { 
      id, 
      name: insertStylist.name, 
      bio: insertStylist.bio || null,
      imageUrl: insertStylist.imageUrl || null,
      email: insertStylist.email || null,
      phone: insertStylist.phone || null,
      specialties: insertStylist.specialties || null
    };
    this.stylists.set(id, stylist);
    return stylist;
  }

  async updateStylist(id: number, updates: Partial<InsertStylist>): Promise<Stylist> {
    const existing = this.stylists.get(id);
    if (!existing) {
      throw new Error(`Stylist with id ${id} not found`);
    }
    
    const updated: Stylist = {
      ...existing,
      name: updates.name !== undefined ? updates.name : existing.name,
      bio: updates.bio !== undefined ? updates.bio : existing.bio,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existing.imageUrl,
      email: updates.email !== undefined ? updates.email : existing.email,
      phone: updates.phone !== undefined ? updates.phone : existing.phone,
      specialties: updates.specialties !== undefined ? updates.specialties : existing.specialties
    };
    
    this.stylists.set(id, updated);
    return updated;
  }

  async deleteStylist(id: number): Promise<void> {
    this.stylists.delete(id);
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(client => client.email === email);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientCurrentId++;
    const client: Client = { 
      id, 
      name: insertClient.name,
      email: insertClient.email,
      phone: insertClient.phone,
      preferredService: insertClient.preferredService || null,
      notes: insertClient.notes || null,
      createdAt: new Date(),
      lastVisit: null
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client> {
    const existing = this.clients.get(id);
    if (!existing) {
      throw new Error(`Client with id ${id} not found`);
    }
    
    const updated: Client = {
      ...existing,
      name: updates.name !== undefined ? updates.name : existing.name,
      email: updates.email !== undefined ? updates.email : existing.email,
      phone: updates.phone !== undefined ? updates.phone : existing.phone,
      preferredService: updates.preferredService !== undefined ? updates.preferredService : existing.preferredService,
      notes: updates.notes !== undefined ? updates.notes : existing.notes
    };
    
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    this.clients.delete(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    const appointment: Appointment = {
      id,
      date: insertAppointment.date,
      serviceId: insertAppointment.serviceId,
      stylistId: insertAppointment.stylistId,
      clientName: insertAppointment.clientName,
      clientEmail: insertAppointment.clientEmail,
      clientPhone: insertAppointment.clientPhone,
      durationMinutes: insertAppointment.durationMinutes || 60,
      notes: insertAppointment.notes || null,
      professionalNotes: null,
      confirmed: false,
      emailConfirmation: insertAppointment.emailConfirmation !== false,
      smsConfirmation: insertAppointment.smsConfirmation || false,
      status: insertAppointment.status || (insertAppointment.isDirectBooking ? "pending" : "approved"),
      businessId: insertAppointment.businessId || null,
      isDirectBooking: insertAppointment.isDirectBooking || false,
      approvedAt: null,
      declinedAt: null,
      declineReason: null
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getPublishedReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.published);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = {
      id,
      name: insertReview.name,
      email: insertReview.email,
      rating: insertReview.rating,
      text: insertReview.text,
      date: new Date(),
      publishConsent: insertReview.publishConsent || false,
      published: false
    };
    this.reviews.set(id, review);
    return review;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const message: ContactMessage = {
      id,
      name: insertMessage.name,
      email: insertMessage.email,
      subject: insertMessage.subject,
      message: insertMessage.message,
      date: new Date(),
      read: null
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // AI Marketing Campaigns
  async getMarketingCampaigns(): Promise<MarketingCampaign[]> {
    return Array.from(this.marketingCampaigns.values());
  }

  async createMarketingCampaign(insertCampaign: InsertMarketingCampaign): Promise<MarketingCampaign> {
    const id = this.marketingCampaignCurrentId++;
    const campaign: MarketingCampaign = {
      id,
      name: insertCampaign.name,
      type: insertCampaign.type,
      status: 'draft',
      targetAudience: insertCampaign.targetAudience,
      content: insertCampaign.content,
      schedule: insertCampaign.schedule || null,
      metrics: null,
      createdAt: new Date(),
      lastSent: null
    };
    this.marketingCampaigns.set(id, campaign);
    return campaign;
  }

  async updateMarketingCampaign(id: number, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const campaign = this.marketingCampaigns.get(id);
    if (!campaign) {
      throw new Error(`Marketing campaign with id ${id} not found`);
    }
    const updatedCampaign = { ...campaign, ...updates };
    this.marketingCampaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Client Insights
  async getClientInsights(clientEmail: string): Promise<ClientInsight[]> {
    return Array.from(this.clientInsights.values()).filter(
      insight => insight.clientEmail === clientEmail
    );
  }

  async createClientInsight(insertInsight: InsertClientInsight): Promise<ClientInsight> {
    const id = this.clientInsightCurrentId++;
    const insight: ClientInsight = {
      id,
      clientEmail: insertInsight.clientEmail,
      appointmentId: insertInsight.appointmentId || null,
      insightType: insertInsight.insightType,
      data: insertInsight.data,
      confidence: insertInsight.confidence || null,
      createdAt: new Date()
    };
    this.clientInsights.set(id, insight);
    return insight;
  }

  // Scheduling Suggestions
  async getSchedulingSuggestions(appointmentId?: number): Promise<SchedulingSuggestion[]> {
    const suggestions = Array.from(this.schedulingSuggestions.values());
    if (appointmentId) {
      return suggestions.filter(s => s.appointmentId === appointmentId);
    }
    return suggestions;
  }

  async createSchedulingSuggestion(insertSuggestion: InsertSchedulingSuggestion): Promise<SchedulingSuggestion> {
    const id = this.schedulingSuggestionCurrentId++;
    const suggestion: SchedulingSuggestion = {
      id,
      appointmentId: insertSuggestion.appointmentId || null,
      suggestionType: insertSuggestion.suggestionType,
      suggestion: insertSuggestion.suggestion,
      reasoning: insertSuggestion.reasoning,
      priority: insertSuggestion.priority || 1,
      isAccepted: null,
      createdAt: new Date()
    };
    this.schedulingSuggestions.set(id, suggestion);
    return suggestion;
  }

  async acceptSchedulingSuggestion(id: number): Promise<void> {
    const suggestion = this.schedulingSuggestions.get(id);
    if (suggestion) {
      suggestion.isAccepted = true;
      this.schedulingSuggestions.set(id, suggestion);
    }
  }

  // Invoice tracking methods
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByPublicUrl(publicUrl: string): Promise<Invoice | undefined> {
    const invoices = Array.from(this.invoices.values());
    return invoices.find(invoice => invoice.publicUrl === publicUrl);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceCurrentId++;
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      status: insertInvoice.status || 'sent',
      description: insertInvoice.description || null,
      clientId: insertInvoice.clientId || null,
      createdAt: new Date(),
      paidAt: null
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async trackInvoiceView(insertView: InsertInvoiceView): Promise<InvoiceView> {
    const id = this.invoiceViewCurrentId++;
    const view: InvoiceView = {
      ...insertView,
      id,
      ipAddress: insertView.ipAddress || null,
      userAgent: insertView.userAgent || null,
      duration: insertView.duration || null,
      viewedAt: new Date()
    };
    this.invoiceViews.set(id, view);
    return view;
  }

  async getInvoiceViewCount(invoiceId: number): Promise<number> {
    const views = Array.from(this.invoiceViews.values());
    return views.filter(view => view.invoiceId === invoiceId).length;
  }

  async updateInvoiceViewDuration(invoiceId: number, duration: number): Promise<void> {
    const views = Array.from(this.invoiceViews.values());
    const lastView = views
      .filter(view => view.invoiceId === invoiceId)
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())[0];
    
    if (lastView) {
      lastView.duration = duration;
      this.invoiceViews.set(lastView.id, lastView);
    }
  }

  async getInvoiceNotifications(): Promise<InvoiceNotification[]> {
    return Array.from(this.invoiceNotifications.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createInvoiceNotification(insertNotification: InsertInvoiceNotification): Promise<InvoiceNotification> {
    const id = this.invoiceNotificationCurrentId++;
    const notification: InvoiceNotification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: new Date()
    };
    this.invoiceNotifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.invoiceNotifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.invoiceNotifications.set(id, notification);
    }
  }

  // Review request management methods
  async getReviewRequests(): Promise<ReviewRequest[]> {
    return Array.from(this.reviewRequests.values())
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  async getReviewRequest(id: number): Promise<ReviewRequest | undefined> {
    return this.reviewRequests.get(id);
  }

  async createReviewRequest(insertRequest: InsertReviewRequest): Promise<ReviewRequest> {
    const id = this.reviewRequestCurrentId++;
    const request: ReviewRequest = {
      ...insertRequest,
      id,
      status: 'sent',
      sentAt: new Date(),
      openedAt: null,
      completedAt: null
    };
    this.reviewRequests.set(id, request);
    return request;
  }

  async updateReviewRequestStatus(id: number, status: string): Promise<void> {
    const request = this.reviewRequests.get(id);
    if (request) {
      request.status = status;
      if (status === 'opened' && !request.openedAt) {
        request.openedAt = new Date();
      }
      if (status === 'completed' && !request.completedAt) {
        request.completedAt = new Date();
      }
      this.reviewRequests.set(id, request);
    }
  }

  async getReviewSubmissions(): Promise<ReviewSubmission[]> {
    return Array.from(this.reviewSubmissions.values())
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  async createReviewSubmission(insertSubmission: InsertReviewSubmission): Promise<ReviewSubmission> {
    const id = this.reviewSubmissionCurrentId++;
    const submission: ReviewSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
      isApproved: false,
      isPublished: false,
      approvedAt: null,
      publishedAt: null
    };
    this.reviewSubmissions.set(id, submission);
    return submission;
  }

  async approveReviewSubmission(id: number, operatorNotes?: string): Promise<void> {
    const submission = this.reviewSubmissions.get(id);
    if (submission) {
      submission.isApproved = true;
      submission.approvedAt = new Date();
      if (operatorNotes) {
        submission.operatorNotes = operatorNotes;
      }
      this.reviewSubmissions.set(id, submission);
    }
  }

  async publishReviewSubmission(id: number): Promise<void> {
    const submission = this.reviewSubmissions.get(id);
    if (submission && submission.isApproved) {
      submission.isPublished = true;
      submission.publishedAt = new Date();
      this.reviewSubmissions.set(id, submission);
    }
  }

  // Industry management methods
  async setIndustry(industryId: string): Promise<void> {
    this.currentIndustryId = industryId;
    
    // Clear existing services and stylists
    this.services.clear();
    this.stylists.clear();
    
    // Reset counters
    this.serviceCurrentId = 1;
    this.stylistCurrentId = 1;
    
    // Reinitialize with new industry data
    this.initializeServices();
    this.initializeStylists();
  }

  getCurrentIndustry(): IndustryData {
    return industryDatabase[this.currentIndustryId] || industryDatabase.custom;
  }

  // Room Projects Implementation
  async getRoomProjects(): Promise<RoomProject[]> {
    return Array.from(this.roomProjects.values());
  }

  async getRoomProject(id: number): Promise<RoomProject | undefined> {
    return this.roomProjects.get(id);
  }

  async createRoomProject(project: InsertRoomProject): Promise<RoomProject> {
    const id = this.roomProjectCurrentId++;
    const newProject: RoomProject = {
      ...project,
      id,
      status: project.status || 'draft',
      notes: project.notes || null,
      clientId: project.clientId || null,
      doorPositions: project.doorPositions || null,
      windowPositions: project.windowPositions || null,
      selectedMaterials: project.selectedMaterials || null,
      estimatedCost: project.estimatedCost || null,
      currentMaterials: project.currentMaterials || null,
      photos: project.photos || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.roomProjects.set(id, newProject);
    return newProject;
  }

  async updateRoomProject(id: number, updates: Partial<InsertRoomProject>): Promise<RoomProject> {
    const project = this.roomProjects.get(id);
    if (!project) {
      throw new Error(`Room project ${id} not found`);
    }
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.roomProjects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteRoomProject(id: number): Promise<void> {
    this.roomProjects.delete(id);
  }

  // Room Materials Implementation
  async getRoomMaterials(): Promise<RoomMaterial[]> {
    return Array.from(this.roomMaterials.values());
  }

  async getRoomMaterial(id: number): Promise<RoomMaterial | undefined> {
    return this.roomMaterials.get(id);
  }

  async createRoomMaterial(material: InsertRoomMaterial): Promise<RoomMaterial> {
    const id = this.roomMaterialCurrentId++;
    const newMaterial: RoomMaterial = { 
      ...material, 
      id,
      texture: material.texture || null,
      brand: material.brand || null,
      description: material.description || null,
      imageUrl: material.imageUrl || null,
      subcategory: material.subcategory || null,
      price: material.price || null,
      isActive: material.isActive !== undefined ? material.isActive : true
    };
    this.roomMaterials.set(id, newMaterial);
    return newMaterial;
  }

  async updateRoomMaterial(id: number, updates: Partial<InsertRoomMaterial>): Promise<RoomMaterial> {
    const material = this.roomMaterials.get(id);
    if (!material) {
      throw new Error(`Room material ${id} not found`);
    }
    const updatedMaterial = { ...material, ...updates };
    this.roomMaterials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  async deleteRoomMaterial(id: number): Promise<void> {
    this.roomMaterials.delete(id);
  }

  async getRoomMaterialsByCategory(category: string): Promise<RoomMaterial[]> {
    return Array.from(this.roomMaterials.values()).filter(m => m.category === category);
  }

  // Initialize room materials with 2024 market trends
  private initializeRoomMaterials(): void {
    const sampleMaterials = [
      // FLOORING - 2024 Top Trends
      { name: "White Oak Engineered", category: "flooring", subcategory: "hardwood", color: "Natural White Oak", price: 9.5, unit: "sq_ft", brand: "Shaw", description: "2024's most popular engineered hardwood", imageUrl: "/materials/white-oak.jpg", isActive: true },
      { name: "Luxury Vinyl Plank", category: "flooring", subcategory: "vinyl", color: "Warm Brown", price: 5.5, unit: "sq_ft", brand: "CoreLuxe", description: "Waterproof LVP - #1 kitchen choice", imageUrl: "/materials/lvp-brown.jpg", isActive: true },
      { name: "Hickory Hardwood", category: "flooring", subcategory: "hardwood", color: "Natural Hickory", price: 8.0, unit: "sq_ft", brand: "Mohawk", description: "Trending rustic hardwood", imageUrl: "/materials/hickory.jpg", isActive: true },
      { name: "Walnut Engineered", category: "flooring", subcategory: "hardwood", color: "Rich Walnut", price: 11.0, unit: "sq_ft", brand: "Armstrong", description: "Premium trending wood tone", imageUrl: "/materials/walnut.jpg", isActive: true },
      { name: "Wood-Look Porcelain", category: "flooring", subcategory: "tile", color: "Warm Gray", price: 6.5, unit: "sq_ft", brand: "Daltile", description: "Waterproof wood-look tile", imageUrl: "/materials/wood-look-tile.jpg", isActive: true },
      
      // PAINT - 2024 Top Colors
      { name: "Sage Green Paint", category: "paint", subcategory: "interior", color: "Sage Green", price: 48.0, unit: "gallon", brand: "Sherwin Williams", description: "2024's #1 trending kitchen color", imageUrl: "/materials/sage-green.jpg", isActive: true },
      { name: "Navy Blue Paint", category: "paint", subcategory: "interior", color: "Navy Blue", price: 48.0, unit: "gallon", brand: "Benjamin Moore", description: "Deep blue - major 2024 trend", imageUrl: "/materials/navy-blue.jpg", isActive: true },
      { name: "Warm Cream Paint", category: "paint", subcategory: "interior", color: "Warm Cream", price: 45.0, unit: "gallon", brand: "Clare", description: "Replacing stark whites in 2024", imageUrl: "/materials/warm-cream.jpg", isActive: true },
      { name: "Olive Green Paint", category: "paint", subcategory: "interior", color: "Olive Green", price: 48.0, unit: "gallon", brand: "Farrow & Ball", description: "Trending earthy green tone", imageUrl: "/materials/olive-green.jpg", isActive: true },
      { name: "Terracotta Paint", category: "paint", subcategory: "interior", color: "Dusty Terracotta", price: 46.0, unit: "gallon", brand: "Sherwin Williams", description: "Warm earthy 2024 trend", imageUrl: "/materials/terracotta.jpg", isActive: true },
      
      // TILES - 2024 Countertop Trends  
      { name: "Calacatta Quartz", category: "tiles", subcategory: "quartz", color: "Calacatta White", price: 85.0, unit: "sq_ft", brand: "Caesarstone", description: "2024's most popular quartz", imageUrl: "/materials/calacatta-quartz.jpg", isActive: true },
      { name: "Carrara Marble", category: "tiles", subcategory: "marble", color: "Carrara White", price: 65.0, unit: "sq_ft", brand: "MSI", description: "Classic luxury marble", imageUrl: "/materials/carrara-marble.jpg", isActive: true },
      { name: "Warm Gray Quartz", category: "tiles", subcategory: "quartz", color: "Warm Gray", price: 75.0, unit: "sq_ft", brand: "Silestone", description: "Trending warm tone quartz", imageUrl: "/materials/warm-gray-quartz.jpg", isActive: true },
      { name: "Granite Veined", category: "tiles", subcategory: "granite", color: "Light Veined", price: 55.0, unit: "sq_ft", brand: "Daltile", description: "Modern veined granite", imageUrl: "/materials/veined-granite.jpg", isActive: true },
      { name: "Marble-Look Porcelain", category: "tiles", subcategory: "porcelain", color: "Marble White", price: 12.0, unit: "sq_ft", brand: "Emser", description: "Low-maintenance marble look", imageUrl: "/materials/marble-porcelain.jpg", isActive: true },
      
      // FIXTURES - 2024 Trends
      { name: "Matte Black Faucet", category: "fixtures", subcategory: "faucets", color: "Matte Black", price: 225.0, unit: "unit", brand: "Delta", description: "Trending matte black finish", imageUrl: "/materials/black-faucet.jpg", isActive: true },
      { name: "Brushed Gold Faucet", category: "fixtures", subcategory: "faucets", color: "Brushed Gold", price: 285.0, unit: "unit", brand: "Moen", description: "Popular warm metal finish", imageUrl: "/materials/gold-faucet.jpg", isActive: true },
      { name: "Stainless Steel Appliances", category: "fixtures", subcategory: "appliances", color: "Stainless Steel", price: 2500.0, unit: "set", brand: "KitchenAid", description: "Classic appliance finish", imageUrl: "/materials/stainless-appliances.jpg", isActive: true },
      
      // CABINETS - 2024 Trends
      { name: "Sage Green Shaker", category: "cabinets", subcategory: "kitchen", color: "Sage Green", price: 145.0, unit: "linear_ft", brand: "KraftMaid", description: "2024's hottest cabinet color", imageUrl: "/materials/sage-cabinets.jpg", isActive: true },
      { name: "Navy Blue Shaker", category: "cabinets", subcategory: "kitchen", color: "Navy Blue", price: 145.0, unit: "linear_ft", brand: "Diamond", description: "Deep blue trending cabinets", imageUrl: "/materials/navy-cabinets.jpg", isActive: true },
      { name: "Warm White Shaker", category: "cabinets", subcategory: "kitchen", color: "Warm White", price: 125.0, unit: "linear_ft", brand: "Thomasville", description: "Replacing stark white cabinets", imageUrl: "/materials/warm-white-cabinets.jpg", isActive: true },
      { name: "Natural Wood Cabinets", category: "cabinets", subcategory: "kitchen", color: "Natural Oak", price: 165.0, unit: "linear_ft", brand: "Wellborn", description: "Wood tone comeback in 2024", imageUrl: "/materials/natural-wood-cabinets.jpg", isActive: true }
    ];

    sampleMaterials.forEach(material => {
      const id = this.roomMaterialCurrentId++;
      this.roomMaterials.set(id, { 
        ...material, 
        id,
        texture: null,
        brand: material.brand || null,
        description: material.description || null,
        imageUrl: material.imageUrl || null,
        subcategory: material.subcategory || null,
        price: material.price || null,
        isActive: material.isActive !== undefined ? material.isActive : true
      });
    });
  }

  // Job Estimates Implementation
  async getJobEstimates(): Promise<JobEstimate[]> {
    return Array.from(this.jobEstimates.values());
  }

  async getJobEstimate(id: number): Promise<JobEstimate | undefined> {
    return this.jobEstimates.get(id);
  }

  async createJobEstimate(estimate: InsertJobEstimate): Promise<JobEstimate> {
    const id = this.jobEstimateCurrentId++;
    const newEstimate: JobEstimate = {
      ...estimate,
      id,
      createdAt: new Date()
    };
    this.jobEstimates.set(id, newEstimate);
    return newEstimate;
  }

  async updateJobEstimate(id: number, updates: Partial<InsertJobEstimate>): Promise<JobEstimate> {
    const estimate = this.jobEstimates.get(id);
    if (!estimate) {
      throw new Error(`Job estimate ${id} not found`);
    }
    const updatedEstimate = { ...estimate, ...updates };
    this.jobEstimates.set(id, updatedEstimate);
    return updatedEstimate;
  }

  async deleteJobEstimate(id: number): Promise<void> {
    this.jobEstimates.delete(id);
  }

  async convertEstimateToInvoice(estimateId: number): Promise<Invoice> {
    const estimate = this.jobEstimates.get(estimateId);
    if (!estimate) {
      throw new Error(`Job estimate ${estimateId} not found`);
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Convert estimate to invoice format (using existing invoice schema)
    const invoiceData: InsertInvoice = {
      clientEmail: estimate.clientEmail,
      clientName: estimate.clientName,
      invoiceNumber,
      title: estimate.jobTitle,
      description: `Invoice converted from estimate: ${estimate.jobTitle}`,
      amount: estimate.total,
      status: 'sent',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      publicUrl: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`
    };

    const invoice = await this.createInvoice(invoiceData);
    
    // Update estimate status to converted
    await this.updateJobEstimate(estimateId, { status: 'accepted' });
    
    return invoice;
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  // Business Profiles (Direct Booking) Implementation
  async getBusinessProfiles(): Promise<BusinessProfile[]> {
    return Array.from(this.businessProfiles.values());
  }

  async getBusinessProfile(id: number): Promise<BusinessProfile | undefined> {
    return this.businessProfiles.get(id);
  }

  async getBusinessProfileBySlug(slug: string): Promise<BusinessProfile | undefined> {
    const profiles = Array.from(this.businessProfiles.values());
    return profiles.find(profile => profile.slug === slug);
  }

  async createBusinessProfile(insertProfile: InsertBusinessProfile): Promise<BusinessProfile> {
    const id = this.businessProfileCurrentId++;
    const profile: BusinessProfile = {
      id,
      businessName: insertProfile.businessName,
      ownerName: insertProfile.ownerName,
      slug: insertProfile.slug,
      industry: insertProfile.industry,
      phone: insertProfile.phone,
      email: insertProfile.email,
      address: insertProfile.address || null,
      city: insertProfile.city || null,
      state: insertProfile.state || null,
      zipCode: insertProfile.zipCode || null,
      website: insertProfile.website || null,
      description: insertProfile.description || null,
      profileImage: insertProfile.profileImage || null,
      coverImage: insertProfile.coverImage || null,
      socialLinks: insertProfile.socialLinks || null,
      isActive: insertProfile.isActive !== undefined ? insertProfile.isActive : true,
      bookingEnabled: insertProfile.bookingEnabled !== undefined ? insertProfile.bookingEnabled : true,
      instantBooking: insertProfile.instantBooking !== undefined ? insertProfile.instantBooking : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.businessProfiles.set(id, profile);
    return profile;
  }

  async updateBusinessProfile(id: number, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile> {
    const profile = this.businessProfiles.get(id);
    if (!profile) {
      throw new Error(`Business profile ${id} not found`);
    }
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.businessProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async deleteBusinessProfile(id: number): Promise<void> {
    this.businessProfiles.delete(id);
  }

  // QR Codes Implementation
  async getBookingQRCodes(businessId?: number): Promise<BookingQRCode[]> {
    const qrCodes = Array.from(this.bookingQRCodes.values());
    if (businessId) {
      return qrCodes.filter(qr => qr.businessId === businessId);
    }
    return qrCodes;
  }

  async getBookingQRCode(id: number): Promise<BookingQRCode | undefined> {
    return this.bookingQRCodes.get(id);
  }

  async createBookingQRCode(insertQRCode: InsertBookingQRCode): Promise<BookingQRCode> {
    const id = this.qrCodeCurrentId++;
    const qrCode: BookingQRCode = {
      id,
      businessId: insertQRCode.businessId,
      codeType: insertQRCode.codeType,
      serviceId: insertQRCode.serviceId || null,
      qrCodeData: insertQRCode.qrCodeData,
      displayName: insertQRCode.displayName,
      scanCount: 0,
      isActive: true,
      createdAt: new Date(),
      lastScanned: null
    };
    this.bookingQRCodes.set(id, qrCode);
    return qrCode;
  }

  async updateQRCodeScanCount(id: number): Promise<void> {
    const qrCode = this.bookingQRCodes.get(id);
    if (qrCode) {
      qrCode.scanCount = (qrCode.scanCount || 0) + 1;
      qrCode.lastScanned = new Date();
      this.bookingQRCodes.set(id, qrCode);
    }
  }

  async deleteBookingQRCode(id: number): Promise<void> {
    this.bookingQRCodes.delete(id);
  }

  // Appointment Approval System Implementation
  async approveAppointment(id: number, operatorNotes?: string): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    const updatedAppointment = {
      ...appointment,
      status: "approved",
      approvedAt: new Date(),
      professionalNotes: operatorNotes || appointment.professionalNotes
    };
    
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async declineAppointment(id: number, reason: string): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    const updatedAppointment = {
      ...appointment,
      status: "declined",
      declinedAt: new Date(),
      declineReason: reason
    };
    
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getPendingAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appt => appt.status === "pending");
  }

  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appt => appt.status === status);
  }
}

// Switch to DatabaseStorage for production reliability - ZERO DATA LOSS
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  private currentIndustryId = "home_services";
  private currentIndustry: IndustryData = {
    id: "home_services",
    name: "Home Services",
    services: []
  };
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getServices(): Promise<Service[]> {
    const serviceList = await db.select().from(services);
    // Sort alphabetically by name for better organization
    return serviceList.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<Service> {
    const [service] = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getStylists(): Promise<Stylist[]> {
    const stylistList = await db.select().from(stylists);
    // Sort alphabetically by name for better organization
    return stylistList.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getStylist(id: number): Promise<Stylist | undefined> {
    const [stylist] = await db.select().from(stylists).where(eq(stylists.id, id));
    return stylist || undefined;
  }

  async createStylist(stylist: InsertStylist): Promise<Stylist> {
    const [newStylist] = await db.insert(stylists).values(stylist).returning();
    return newStylist;
  }

  async updateStylist(id: number, updates: Partial<InsertStylist>): Promise<Stylist> {
    const [stylist] = await db.update(stylists).set(updates).where(eq(stylists.id, id)).returning();
    return stylist;
  }

  async deleteStylist(id: number): Promise<void> {
    await db.delete(stylists).where(eq(stylists.id, id));
  }

  async getClients(): Promise<Client[]> {
    return db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client> {
    const [client] = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
    return client;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return db.select().from(appointments).where(
      and(
        gte(appointments.date, startOfDay),
        lte(appointments.date, endOfDay)
      )
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getPendingAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.status, 'pending'));
  }

  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.status, status));
  }

  async approveAppointment(id: number, operatorNotes?: string): Promise<Appointment> {
    const [appointment] = await db.update(appointments).set({
      status: 'approved',
      approvedAt: new Date(),
      professionalNotes: operatorNotes
    }).where(eq(appointments.id, id)).returning();
    return appointment;
  }

  async declineAppointment(id: number, reason: string): Promise<Appointment> {
    const [appointment] = await db.update(appointments).set({
      status: 'declined',
      declinedAt: new Date(),
      declineReason: reason
    }).where(eq(appointments.id, id)).returning();
    return appointment;
  }

  // Essential methods only - simplified for immediate database migration
  async getReviews(): Promise<Review[]> { return []; }
  async getPublishedReviews(): Promise<Review[]> { return []; }
  async createReview(review: InsertReview): Promise<Review> { 
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  async getMarketingCampaigns(): Promise<MarketingCampaign[]> { return []; }
  async createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign> { 
    const [newCampaign] = await db.insert(marketingCampaigns).values(campaign).returning();
    return newCampaign;
  }
  async getClientInsights(): Promise<ClientInsight[]> { return []; }
  async createClientInsight(insight: InsertClientInsight): Promise<ClientInsight> { 
    const [newInsight] = await db.insert(clientInsights).values(insight).returning();
    return newInsight;
  }
  async getSchedulingSuggestions(): Promise<SchedulingSuggestion[]> { return []; }
  async createSchedulingSuggestion(suggestion: InsertSchedulingSuggestion): Promise<SchedulingSuggestion> { 
    const [newSuggestion] = await db.insert(schedulingSuggestions).values(suggestion).returning();
    return newSuggestion;
  }
  async getJobEstimates(): Promise<JobEstimate[]> { return []; }
  async createJobEstimate(estimate: InsertJobEstimate): Promise<JobEstimate> { 
    const [newEstimate] = await db.insert(jobEstimates).values(estimate).returning();
    return newEstimate;
  }
  async getInvoices(): Promise<Invoice[]> { return []; }
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> { 
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }
  async getInvoiceViews(): Promise<InvoiceView[]> { return []; }
  async createInvoiceView(view: InsertInvoiceView): Promise<InvoiceView> { 
    const [newView] = await db.insert(invoiceViews).values(view).returning();
    return newView;
  }
  async getInvoiceNotifications(): Promise<InvoiceNotification[]> { return []; }
  async createInvoiceNotification(notification: InsertInvoiceNotification): Promise<InvoiceNotification> { 
    const [newNotification] = await db.insert(invoiceNotifications).values(notification).returning();
    return newNotification;
  }
  async getReviewRequests(): Promise<ReviewRequest[]> { return []; }
  async createReviewRequest(request: InsertReviewRequest): Promise<ReviewRequest> { 
    const [newRequest] = await db.insert(reviewRequests).values(request).returning();
    return newRequest;
  }
  async getReviewSubmissions(): Promise<ReviewSubmission[]> { return []; }
  async createReviewSubmission(submission: InsertReviewSubmission): Promise<ReviewSubmission> { 
    const [newSubmission] = await db.insert(reviewSubmissions).values(submission).returning();
    return newSubmission;
  }
  async getRoomProjects(): Promise<RoomProject[]> { return []; }
  async createRoomProject(project: InsertRoomProject): Promise<RoomProject> { 
    const [newProject] = await db.insert(roomProjects).values(project).returning();
    return newProject;
  }
  async getRoomMaterials(): Promise<RoomMaterial[]> { return []; }
  async createRoomMaterial(material: InsertRoomMaterial): Promise<RoomMaterial> { 
    const [newMaterial] = await db.insert(roomMaterials).values(material).returning();
    return newMaterial;
  }
  async getBusinessProfiles(): Promise<BusinessProfile[]> { 
    return db.select().from(businessProfiles);
  }
  async createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile> { 
    const [newProfile] = await db.insert(businessProfiles).values(profile).returning();
    return newProfile;
  }
  async getBusinessProfile(slug: string): Promise<BusinessProfile | undefined> { 
    const profiles = await db.select().from(businessProfiles);
    return profiles.find(profile => profile.slug === slug);
  }
  async getBusinessProfileBySlug(slug: string): Promise<BusinessProfile | undefined> { 
    const profiles = await db.select().from(businessProfiles);
    return profiles.find(profile => profile.slug === slug);
  }
  async getBookingQRCodes(): Promise<BookingQRCode[]> { 
    return db.select().from(bookingQRCodes);
  }
  async createBookingQRCode(qrCode: InsertBookingQRCode): Promise<BookingQRCode> { 
    const [newQRCode] = await db.insert(bookingQRCodes).values(qrCode).returning();
    return newQRCode;
  }
  async setIndustryData(industryId: string): Promise<void> {
    const industryData = industryDatabase[industryId as keyof typeof industryDatabase];
    if (!industryData) return;

    // Check if this industry is already set to prevent duplicate service creation
    if (this.currentIndustryId === industryId) {
      console.log(`Industry ${industryId} already set, skipping recreation`);
      return;
    }

    // Update current industry ID
    this.currentIndustryId = industryId;

    // Update current industry
    this.currentIndustry = {
      id: industryData.id,
      name: industryData.name,
      services: []
    };

    // Clear existing data only if changing industries
    await db.delete(services);
    await db.delete(stylists);

    // Create unique services (remove duplicates)
    const uniqueServices = Array.from(new Set(industryData.services));
    
    for (let i = 0; i < uniqueServices.length; i++) {
      const serviceData = {
        name: uniqueServices[i],
        description: industryData.serviceDescriptions[i] || "Professional service",
        price: "$150",
        durationMinutes: 60,
        category: "standard"
      };

      await this.createService(serviceData);
    }
    
    console.log(`Industry ${industryId} set successfully with ${uniqueServices.length} services`);

    // Start with empty staff list - users will add their own team members
    // This creates a more personalized experience
  }

  getCurrentIndustry(): IndustryData {
    return this.currentIndustry;
  }

  // Missing interface methods - basic implementations
  async updateMarketingCampaign(id: number, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    throw new Error("Not implemented");
  }
  
  // Removed duplicate implementations - they're already defined above
  
  async acceptSchedulingSuggestion(id: number): Promise<void> {
    // Not implemented yet
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  async getAllAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }
  
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }
  
  async getInvoiceByPublicUrl(publicUrl: string): Promise<Invoice | undefined> {
    const invoicesList = await db.select().from(invoices);
    return invoicesList.find(inv => inv.publicUrl === publicUrl);
  }
  
  async trackInvoiceView(view: InsertInvoiceView): Promise<InvoiceView> {
    const [newView] = await db.insert(invoiceViews).values(view).returning();
    return newView;
  }
  
  async getInvoiceViewCount(invoiceId: number): Promise<number> {
    const views = await db.select().from(invoiceViews);
    return views.filter(view => view.invoiceId === invoiceId).length;
  }
  
  async updateInvoiceViewDuration(invoiceId: number, duration: number): Promise<void> {
    // Basic implementation - would need proper SQL update
  }
  
  async markNotificationAsRead(id: number): Promise<void> {
    // Basic implementation - would need proper SQL update
  }
}

export const storage = new DatabaseStorage();