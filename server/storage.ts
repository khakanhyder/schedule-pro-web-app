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
  invoices, type Invoice, type InsertInvoice,
  invoiceViews, type InvoiceView, type InsertInvoiceView,
  invoiceNotifications, type InvoiceNotification, type InsertInvoiceNotification,
  reviewRequests, type ReviewRequest, type InsertReviewRequest,
  reviewSubmissions, type ReviewSubmission, type InsertReviewSubmission,
  roomProjects, type RoomProject, type InsertRoomProject,
  roomMaterials, type RoomMaterial, type InsertRoomMaterial
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
  
  // Industry management
  setIndustry(industryId: string): void;
  getCurrentIndustry(): IndustryData;
  
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
  
  // Track the current industry
  private currentIndustryId = "beauty";

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
    
    // Create services based on current industry
    for (let i = 0; i < industry.services.length; i++) {
      const name = industry.services[i];
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
    const industry = industryDatabase[this.currentIndustryId];
    
    if (!industry) {
      console.error(`Industry ${this.currentIndustryId} not found!`);
      return;
    }
    
    // Create professionals based on current industry
    for (let i = 0; i < industry.professionalNames.length; i++) {
      const name = industry.professionalNames[i];
      const bio = industry.professionalBios[i] || `${name} is an experienced ${industry.professionalName}`;
      
      const stylist: InsertStylist = {
        name,
        bio,
        imageUrl: null
      };
      
      this.createStylist(stylist);
    }
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
    return Array.from(this.services.values());
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
    return Array.from(this.stylists.values());
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
      notes: insertAppointment.notes || null,
      confirmed: insertAppointment.confirmed || null,
      emailConfirmation: insertAppointment.emailConfirmation || null,
      smsConfirmation: insertAppointment.smsConfirmation || null
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
      date: insertReview.date,
      publishConsent: insertReview.publishConsent || null,
      published: insertReview.published || null
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

  getCurrentIndustry(): { id: string; name: string } {
    const industry = industryDatabase[this.currentIndustryId];
    return {
      id: this.currentIndustryId,
      name: industry?.name || 'Unknown Industry'
    };
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

  // Initialize room materials with sample data
  private initializeRoomMaterials(): void {
    const sampleMaterials = [
      // Flooring
      { name: "Oak Hardwood", category: "flooring", subcategory: "hardwood", color: "Natural Oak", price: 8.5, unit: "sq_ft", brand: "Armstrong", description: "Classic oak hardwood flooring", imageUrl: "/materials/oak-hardwood.jpg", isActive: true },
      { name: "Marble Tile", category: "flooring", subcategory: "tile", color: "Carrara White", price: 12.0, unit: "sq_ft", brand: "Daltile", description: "Elegant marble tile flooring", imageUrl: "/materials/marble-tile.jpg", isActive: true },
      { name: "Luxury Vinyl", category: "flooring", subcategory: "vinyl", color: "Rustic Brown", price: 4.5, unit: "sq_ft", brand: "Shaw", description: "Waterproof luxury vinyl planks", imageUrl: "/materials/luxury-vinyl.jpg", isActive: true },
      
      // Paint
      { name: "Premium Interior Paint", category: "paint", subcategory: "interior", color: "Warm White", price: 45.0, unit: "gallon", brand: "Sherwin Williams", description: "High-quality interior paint", imageUrl: "/materials/paint-white.jpg", isActive: true },
      { name: "Premium Interior Paint", category: "paint", subcategory: "interior", color: "Sage Green", price: 45.0, unit: "gallon", brand: "Sherwin Williams", description: "High-quality interior paint", imageUrl: "/materials/paint-green.jpg", isActive: true },
      
      // Tiles
      { name: "Subway Tiles", category: "tiles", subcategory: "ceramic", color: "Classic White", price: 3.5, unit: "sq_ft", brand: "American Olean", description: "Timeless subway tiles", imageUrl: "/materials/subway-tiles.jpg", isActive: true },
      { name: "Mosaic Tiles", category: "tiles", subcategory: "glass", color: "Ocean Blue", price: 15.0, unit: "sq_ft", brand: "Bisazza", description: "Premium glass mosaic tiles", imageUrl: "/materials/mosaic-tiles.jpg", isActive: true },
      
      // Fixtures
      { name: "Modern Faucet", category: "fixtures", subcategory: "faucets", color: "Brushed Nickel", price: 185.0, unit: "unit", brand: "Moen", description: "Contemporary kitchen faucet", imageUrl: "/materials/modern-faucet.jpg", isActive: true },
      { name: "LED Light Fixture", category: "fixtures", subcategory: "lighting", color: "Warm White", price: 95.0, unit: "unit", brand: "Philips", description: "Energy-efficient LED ceiling light", imageUrl: "/materials/led-light.jpg", isActive: true },
      
      // Cabinets
      { name: "Shaker Cabinets", category: "cabinets", subcategory: "kitchen", color: "Navy Blue", price: 125.0, unit: "linear_ft", brand: "KraftMaid", description: "Classic shaker style kitchen cabinets", imageUrl: "/materials/shaker-cabinets.jpg", isActive: true },
      { name: "Modern Cabinets", category: "cabinets", subcategory: "bathroom", color: "Espresso", price: 95.0, unit: "linear_ft", brand: "Thomasville", description: "Contemporary bathroom vanity", imageUrl: "/materials/modern-cabinets.jpg", isActive: true }
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
}

export const storage = new MemStorage();