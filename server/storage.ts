import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  stylists, type Stylist, type InsertStylist,
  appointments, type Appointment, type InsertAppointment,
  reviews, type Review, type InsertReview,
  contactMessages, type ContactMessage, type InsertContactMessage,
  marketingCampaigns, type MarketingCampaign, type InsertMarketingCampaign,
  clientInsights, type ClientInsight, type InsertClientInsight,
  schedulingSuggestions, type SchedulingSuggestion, type InsertSchedulingSuggestion
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
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private services = new Map<number, Service>();
  private stylists = new Map<number, Stylist>();
  private appointments = new Map<number, Appointment>();
  private reviews = new Map<number, Review>();
  private contactMessages = new Map<number, ContactMessage>();
  private marketingCampaigns = new Map<number, MarketingCampaign>();
  private clientInsights = new Map<number, ClientInsight>();
  private schedulingSuggestions = new Map<number, SchedulingSuggestion>();
  
  private userCurrentId = 1;
  private serviceCurrentId = 1;
  private stylistCurrentId = 1;
  private appointmentCurrentId = 1;
  private reviewCurrentId = 1;
  private contactMessageCurrentId = 1;
  private marketingCampaignCurrentId = 1;
  private clientInsightCurrentId = 1;
  private schedulingSuggestionCurrentId = 1;
  
  // Track the current industry
  private currentIndustryId = "beauty";

  constructor() {
    // Initialize with some sample data
    this.initializeServices();
    this.initializeStylists();
    this.initializeReviews();
  }
  
  // Implement setIndustry method
  setIndustry(industryId: string): void {
    if (industryDatabase[industryId]) {
      this.currentIndustryId = industryId;
      
      // Reset services and professionals for the new industry
      this.services.clear();
      this.stylists.clear();
      this.serviceCurrentId = 1;
      this.stylistCurrentId = 1;
      
      this.initializeServices();
      this.initializeStylists();
    }
  }
  
  // Implement getCurrentIndustry method
  getCurrentIndustry(): IndustryData {
    return industryDatabase[this.currentIndustryId];
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
        ...review,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in the last 30 days
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
    const service: Service = { ...insertService, id };
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
      imageUrl: insertStylist.imageUrl || null
    };
    this.stylists.set(id, stylist);
    return stylist;
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
}

export const storage = new MemStorage();