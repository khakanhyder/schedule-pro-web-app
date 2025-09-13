import { 
  users, type User, type InsertUser,
  plans, type Plan, type InsertPlan,
  onboardingSessions, type OnboardingSession, type InsertOnboardingSession,
  clients, type Client, type InsertClient,
  services, type Service, type InsertService,
  reviews, type Review, type InsertReview,
  clientServices, type ClientService, type InsertClientService,
  appointments, type Appointment, type InsertAppointment,
  operatingHours, type OperatingHours, type InsertOperatingHours,
  leads, type Lead, type InsertLead,
  clientWebsites, type ClientWebsite, type InsertClientWebsite,
  appointmentSlots, type AppointmentSlot, type InsertAppointmentSlot,
  teamMembers, type TeamMember, type InsertTeamMember,
  reviewPlatforms, type ReviewPlatform, type InsertReviewPlatform,
  domainConfigurations, type DomainConfiguration, type InsertDomainConfiguration,
  domainVerificationLogs, type DomainVerificationLog, type InsertDomainVerificationLog,
  reviewPlatformConnections, type ReviewPlatformConnection, type InsertReviewPlatformConnection,
  platformReviews, type PlatformReview, type InsertPlatformReview,
  googleBusinessProfiles, type GoogleBusinessProfile, type InsertGoogleBusinessProfile,
} from "@shared/schema";
import { dnsVerificationService } from "./dns-verification";

export interface IStorage {
  // Authentication & Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Plans Management
  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: string, updates: Partial<InsertPlan>): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
  
  // Onboarding Management
  getOnboardingSessions(): Promise<OnboardingSession[]>;
  getOnboardingSession(sessionId: string): Promise<OnboardingSession | undefined>;
  createOnboardingSession(session: InsertOnboardingSession): Promise<OnboardingSession>;
  updateOnboardingSession(sessionId: string, updates: Partial<InsertOnboardingSession>): Promise<OnboardingSession>;
  completeOnboarding(sessionId: string): Promise<OnboardingSession>;
  
  // Client Management
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, updates: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Legacy services (keeping for demo)
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Legacy reviews (keeping for demo)
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Client-specific services
  getClientServices(clientId: string): Promise<ClientService[]>;
  createClientService(service: InsertClientService): Promise<ClientService>;
  updateClientService(id: string, updates: Partial<InsertClientService>): Promise<ClientService>;
  deleteClientService(id: string): Promise<void>;
  
  // Appointments
  getAppointments(clientId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  
  // Operating Hours
  getOperatingHours(clientId: string): Promise<OperatingHours[]>;
  setOperatingHours(clientId: string, hours: InsertOperatingHours[]): Promise<OperatingHours[]>;
  
  // Leads
  getLeads(clientId: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  
  // Client Websites
  getClientWebsite(clientId: string): Promise<ClientWebsite | undefined>;
  createClientWebsite(website: InsertClientWebsite): Promise<ClientWebsite>;
  updateClientWebsite(clientId: string, updates: Partial<InsertClientWebsite>): Promise<ClientWebsite>;
  getPublicWebsite(subdomain: string): Promise<ClientWebsite | undefined>;
  
  // Appointment Slots
  getAppointmentSlots(clientId: string): Promise<AppointmentSlot[]>;
  createAppointmentSlot(slot: InsertAppointmentSlot): Promise<AppointmentSlot>;
  updateAppointmentSlot(id: string, updates: Partial<InsertAppointmentSlot>): Promise<AppointmentSlot>;
  deleteAppointmentSlot(id: string): Promise<void>;
  getAvailableSlots(clientId: string, date: string): Promise<string[]>;
  
  // Team Members
  getTeamMembers(clientId: string): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;

  // Review Platforms (for landing page)
  getReviewPlatforms(): Promise<ReviewPlatform[]>;
  getReviewPlatform(id: string): Promise<ReviewPlatform | undefined>;
  createReviewPlatform(platform: InsertReviewPlatform): Promise<ReviewPlatform>;
  updateReviewPlatform(id: string, updates: Partial<InsertReviewPlatform>): Promise<ReviewPlatform>;
  deleteReviewPlatform(id: string): Promise<void>;

  // Review Platform Connections (for real review data)
  getReviewPlatformConnections(clientId: string): Promise<ReviewPlatformConnection[]>;
  getReviewPlatformConnection(id: string): Promise<ReviewPlatformConnection | undefined>;
  createReviewPlatformConnection(connection: InsertReviewPlatformConnection): Promise<ReviewPlatformConnection>;
  updateReviewPlatformConnection(id: string, updates: Partial<InsertReviewPlatformConnection>): Promise<ReviewPlatformConnection>;
  deleteReviewPlatformConnection(id: string): Promise<void>;
  syncReviewPlatformData(connectionId: string): Promise<ReviewPlatformConnection>;

  // Platform Reviews
  getPlatformReviews(clientId: string, platform?: string): Promise<PlatformReview[]>;
  getPlatformReview(id: string): Promise<PlatformReview | undefined>;
  createPlatformReview(review: InsertPlatformReview): Promise<PlatformReview>;
  updatePlatformReview(id: string, updates: Partial<InsertPlatformReview>): Promise<PlatformReview>;
  deletePlatformReview(id: string): Promise<void>;

  // Domain Configurations
  getDomainConfigurations(clientId: string): Promise<DomainConfiguration[]>;
  getDomainConfiguration(id: string): Promise<DomainConfiguration | undefined>;
  getDomainConfigurationByDomain(domain: string): Promise<DomainConfiguration | undefined>;
  createDomainConfiguration(domain: InsertDomainConfiguration): Promise<DomainConfiguration>;
  updateDomainConfiguration(id: string, updates: Partial<InsertDomainConfiguration>): Promise<DomainConfiguration>;
  deleteDomainConfiguration(id: string): Promise<void>;
  verifyDomain(id: string): Promise<DomainConfiguration>;

  // Google Business Profile methods
  getGoogleBusinessProfile(clientId: string): Promise<GoogleBusinessProfile | undefined>;
  createGoogleBusinessProfile(profile: InsertGoogleBusinessProfile): Promise<GoogleBusinessProfile>;
  updateGoogleBusinessProfile(clientId: string, updates: Partial<InsertGoogleBusinessProfile>): Promise<GoogleBusinessProfile>;
  deleteGoogleBusinessProfile(clientId: string): Promise<void>;
  syncGoogleBusinessProfile(clientId: string): Promise<GoogleBusinessProfile>;

  // Domain Verification Logs
  getDomainVerificationLogs(domainConfigId: string): Promise<DomainVerificationLog[]>;
  createDomainVerificationLog(log: InsertDomainVerificationLog): Promise<DomainVerificationLog>;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private users: User[] = [];
  private plans: Plan[] = [];
  private onboardingSessions: OnboardingSession[] = [];
  private clients: Client[] = [];
  private services: Service[] = [];
  private reviews: Review[] = [];
  private clientServices: ClientService[] = [];
  private appointments: Appointment[] = [];
  private operatingHours: OperatingHours[] = [];
  private leads: Lead[] = [];
  private clientWebsites: ClientWebsite[] = [
    {
      id: "website_1",
      clientId: "client_1",
      subdomain: "abc-consulting",
      customDomain: null,
      title: "ABC Consulting - Professional Services",
      description: "ABC Consulting - Consulting services",
      heroImage: null,
      primaryColor: "#3B82F6",
      secondaryColor: "#F3F4F6",
      contactInfo: '{"phone": "555-0101", "email": "john@abcconsulting.com"}',
      socialLinks: '{}',
      sections: '[{"id":"hero","type":"hero","title":"Welcome to ABC Consulting","content":"Professional consulting services for all your needs.","settings":{"backgroundColor":"#3B82F6","textColor":"#FFFFFF","alignment":"center","padding":"large"}},{"id":"about","type":"about","title":"About ABC Consulting","content":"Located at 123 Main St, City, State, we are dedicated to providing exceptional consulting services.","settings":{"backgroundColor":"#FFFFFF","textColor":"#1F2937","alignment":"left","padding":"medium"}}]',
      showPrices: true,
      allowOnlineBooking: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private appointmentSlots: AppointmentSlot[] = [];
  private teamMembers: TeamMember[] = [];
  private googleBusinessProfiles: GoogleBusinessProfile[] = [];
  private reviewPlatforms: ReviewPlatform[] = [];
  private reviewPlatformConnections: ReviewPlatformConnection[] = [];
  private platformReviews: PlatformReview[] = [];
  private domainConfigurations: DomainConfiguration[] = [];
  private domainVerificationLogs: DomainVerificationLog[] = [];

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create default super admin user
    await this.createUser({
      email: "admin@saas.com",
      password: "admin123",
      role: "SUPER_ADMIN"
    });

    // Create sample review platforms for landing page
    await this.createReviewPlatform({
      name: "google",
      displayName: "Google",
      rating: 4.9,
      maxRating: 5,
      reviewCount: 245,
      logoUrl: null,
      isActive: true,
      sortOrder: 1
    });

    await this.createReviewPlatform({
      name: "trustpilot", 
      displayName: "Trust Pilot",
      rating: 4.8,
      maxRating: 5,
      reviewCount: 189,
      logoUrl: null,
      isActive: true,
      sortOrder: 2
    });

    await this.createReviewPlatform({
      name: "yelp",
      displayName: "Yelp",
      rating: 4.7,
      maxRating: 5,
      reviewCount: 132,
      logoUrl: null,
      isActive: true,
      sortOrder: 3
    });

    // Create sample plans
    // Create Free Demo plan first
    await this.createPlan({
      name: "Free Demo",
      price: 0,
      billing: "MONTHLY",
      features: ["7-day trial", "1 User", "2GB Storage", "Basic Features"],
      maxUsers: 1,
      storageGB: 2,
      isActive: true,
      isFreeTrial: true,
      trialDays: 7
    });

    await this.createPlan({
      name: "Basic",
      price: 15.00,
      billing: "MONTHLY",
      features: ["1 User", "10GB Storage", "Basic Support", "Online Booking", "Client Management"],
      maxUsers: 1,
      storageGB: 10,
      isActive: true,
      isFreeTrial: false,
      trialDays: 0
    });

    await this.createPlan({
      name: "Pro",
      price: 99.99,
      billing: "MONTHLY", 
      features: ["5 Users", "100GB Storage", "Priority Support", "Advanced Analytics"],
      maxUsers: 5,
      storageGB: 100,
      isActive: true,
      isFreeTrial: false,
      trialDays: 0
    });

    await this.createPlan({
      name: "Enterprise",
      price: 299.99,
      billing: "MONTHLY",
      features: ["Unlimited Users", "1TB Storage", "24/7 Support", "Custom Integrations"],
      maxUsers: 999,
      storageGB: 1000,
      isActive: true,
      isFreeTrial: false,
      trialDays: 0
    });

    // Create demo client user accounts
    await this.createUser({
      email: "john@abcconsulting.com",
      password: "demo123",
      role: "CLIENT"
    });
    
    await this.createUser({
      email: "jane@techstartup.com",
      password: "demo123",
      role: "CLIENT"
    });

    // Create sample clients
    await this.createClient({
      businessName: "ABC Consulting",
      contactPerson: "John Smith",
      email: "john@abcconsulting.com",
      phone: "555-0101",
      planId: "plan_2",
      status: "ACTIVE",
      userId: "user_2",
      businessAddress: "123 Main St, City, State",
      industry: "Consulting"
    });

    await this.createClient({
      businessName: "Tech Startup Inc",
      contactPerson: "Jane Doe", 
      email: "jane@techstartup.com",
      phone: "555-0102",
      planId: "plan_3",
      status: "TRIAL",
      userId: "user_3",
      businessAddress: "456 Tech Ave, City, State",
      industry: "Technology"
    });

    // Add sample client services for client_1
    await this.createClientService({
      clientId: "client_1",
      name: "Business Consultation",
      description: "Comprehensive business strategy and consultation services",
      price: 150,
      durationMinutes: 60,
      category: "Consulting",
      isActive: true
    });

    await this.createClientService({
      clientId: "client_1",
      name: "Financial Planning",
      description: "Expert financial planning and investment advice",
      price: 200,
      durationMinutes: 90,
      category: "Consulting",
      isActive: true
    });

    await this.createClientService({
      clientId: "client_1",
      name: "Market Analysis",
      description: "In-depth market research and competitive analysis",
      price: 300,
      durationMinutes: 120,
      category: "Research",
      isActive: true
    });

    // Add sample team member for testing team login
    await this.createTeamMember({
      clientId: "client_1",
      name: "Khisal Test",
      email: "khisal@test.com",
      role: "MANAGER",
      password: "password123",
      permissions: ["overview.view", "appointments.view", "appointments.create", "appointments.edit", "services.view", "team.view"],
      isActive: true
    });

    console.log("✅ Sample data initialized for SaaS platform");
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user_${this.users.length + 1}`,
      email: user.email,
      password: user.password,
      role: user.role || "CLIENT",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Plan methods
  async getPlans(): Promise<Plan[]> {
    return this.plans.filter(p => p.isActive);
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    return this.plans.find(p => p.id === id);
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const newPlan: Plan = {
      id: `plan_${this.plans.length + 1}`,
      name: plan.name,
      price: plan.price,
      billing: plan.billing || "MONTHLY",
      features: plan.features,
      maxUsers: plan.maxUsers,
      storageGB: plan.storageGB,
      isActive: plan.isActive ?? true,
      isFreeTrial: plan.isFreeTrial ?? false,
      trialDays: plan.trialDays ?? 0,
      createdAt: new Date()
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  async updatePlan(id: string, updates: Partial<InsertPlan>): Promise<Plan> {
    const index = this.plans.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Plan not found");
    
    this.plans[index] = { ...this.plans[index], ...updates };
    return this.plans[index];
  }

  async deletePlan(id: string): Promise<void> {
    const index = this.plans.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Plan not found");
    this.plans.splice(index, 1);
  }

  // Onboarding methods
  async getOnboardingSessions(): Promise<OnboardingSession[]> {
    return this.onboardingSessions;
  }

  async getOnboardingSession(sessionId: string): Promise<OnboardingSession | undefined> {
    return this.onboardingSessions.find(s => s.sessionId === sessionId);
  }

  async createOnboardingSession(session: InsertOnboardingSession): Promise<OnboardingSession> {
    const newSession: OnboardingSession = {
      id: `onb_${this.onboardingSessions.length + 1}`,
      sessionId: session.sessionId,
      planId: session.planId,
      currentStep: session.currentStep || 1,
      isCompleted: false,
      businessData: session.businessData || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null
    };
    this.onboardingSessions.push(newSession);
    return newSession;
  }

  async updateOnboardingSession(sessionId: string, updates: Partial<InsertOnboardingSession>): Promise<OnboardingSession> {
    const index = this.onboardingSessions.findIndex(s => s.sessionId === sessionId);
    if (index === -1) throw new Error("Onboarding session not found");
    
    this.onboardingSessions[index] = { 
      ...this.onboardingSessions[index], 
      ...updates,
      updatedAt: new Date()
    };
    return this.onboardingSessions[index];
  }

  async completeOnboarding(sessionId: string): Promise<OnboardingSession> {
    const index = this.onboardingSessions.findIndex(s => s.sessionId === sessionId);
    if (index === -1) throw new Error("Onboarding session not found");
    
    this.onboardingSessions[index] = {
      ...this.onboardingSessions[index],
      isCompleted: true,
      completedAt: new Date(),
      updatedAt: new Date()
    };
    return this.onboardingSessions[index];
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return this.clients;
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.find(c => c.id === id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return this.clients.find(c => c.email === email);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const newClient: Client = {
      id: `client_${this.clients.length + 1}`,
      businessName: client.businessName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone || null,
      businessAddress: client.businessAddress || null,
      industry: client.industry || null,
      businessDescription: client.businessDescription || null,
      logoUrl: client.logoUrl || null,
      operatingHours: client.operatingHours || null,
      timeZone: client.timeZone || null,
      planId: client.planId,
      status: client.status || "TRIAL",
      userId: client.userId,
      onboardingSessionId: client.onboardingSessionId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Client not found");
    
    this.clients[index] = {
      ...this.clients[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.clients[index];
  }

  async deleteClient(id: string): Promise<void> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Client not found");
    this.clients.splice(index, 1);
  }

  // Legacy service methods
  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.find(s => s.id === id);
  }

  async createService(service: InsertService): Promise<Service> {
    const newService: Service = {
      id: this.services.length + 1,
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      category: service.category || null
    };
    this.services.push(newService);
    return newService;
  }

  // Legacy review methods
  async getReviews(): Promise<Review[]> {
    return this.reviews;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = {
      id: this.reviews.length + 1,
      name: review.name,
      email: review.email,
      rating: review.rating,
      text: review.text,
      publishConsent: review.publishConsent ?? false,
      date: new Date(),
      published: false
    };
    this.reviews.push(newReview);
    return newReview;
  }

  // Client services methods
  async getClientServices(clientId: string): Promise<ClientService[]> {
    return this.clientServices.filter(s => s.clientId === clientId);
  }

  async createClientService(service: InsertClientService): Promise<ClientService> {
    const newService: ClientService = {
      id: `service_${this.clientServices.length + 1}`,
      clientId: service.clientId,
      name: service.name,
      description: service.description || null,
      price: service.price,
      durationMinutes: service.durationMinutes,
      category: service.category || null,
      isActive: service.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clientServices.push(newService);
    return newService;
  }

  async updateClientService(id: string, updates: Partial<InsertClientService>): Promise<ClientService> {
    const index = this.clientServices.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Client service not found");
    
    this.clientServices[index] = {
      ...this.clientServices[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.clientServices[index];
  }

  async deleteClientService(id: string): Promise<void> {
    const index = this.clientServices.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Client service not found");
    this.clientServices.splice(index, 1);
  }

  // Appointments methods
  async getAppointments(clientId: string): Promise<Appointment[]> {
    return this.appointments.filter(a => a.clientId === clientId);
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.find(a => a.id === id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const newAppointment: Appointment = {
      id: `appt_${this.appointments.length + 1}`,
      clientId: appointment.clientId,
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone || null,
      serviceId: appointment.serviceId,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status || "SCHEDULED",
      notes: appointment.notes || null,
      totalPrice: appointment.totalPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Appointment not found");
    
    this.appointments[index] = {
      ...this.appointments[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.appointments[index];
  }

  async deleteAppointment(id: string): Promise<void> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Appointment not found");
    this.appointments.splice(index, 1);
  }

  // Operating hours methods
  async getOperatingHours(clientId: string): Promise<OperatingHours[]> {
    return this.operatingHours.filter(h => h.clientId === clientId);
  }

  async setOperatingHours(clientId: string, hours: InsertOperatingHours[]): Promise<OperatingHours[]> {
    // Remove existing hours for this client
    this.operatingHours = this.operatingHours.filter(h => h.clientId !== clientId);
    
    // Add new hours
    const newHours: OperatingHours[] = hours.map((h, index) => ({
      id: `hours_${clientId}_${h.dayOfWeek}`,
      clientId: h.clientId,
      dayOfWeek: h.dayOfWeek,
      isOpen: h.isOpen ?? true,
      openTime: h.openTime || null,
      closeTime: h.closeTime || null,
      breakStartTime: h.breakStartTime || null,
      breakEndTime: h.breakEndTime || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    this.operatingHours.push(...newHours);
    return newHours;
  }

  // Leads methods
  async getLeads(clientId: string): Promise<Lead[]> {
    return this.leads.filter(l => l.clientId === clientId);
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.find(l => l.id === id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const newLead: Lead = {
      id: `lead_${this.leads.length + 1}`,
      clientId: lead.clientId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      source: lead.source,
      status: lead.status || "NEW",
      notes: lead.notes || null,
      interestedServices: lead.interestedServices || [],
      estimatedValue: lead.estimatedValue || null,
      followUpDate: lead.followUpDate || null,
      convertedToAppointment: lead.convertedToAppointment ?? false,
      appointmentId: lead.appointmentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.leads.push(newLead);
    return newLead;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead> {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error("Lead not found");
    
    this.leads[index] = {
      ...this.leads[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.leads[index];
  }

  async deleteLead(id: string): Promise<void> {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error("Lead not found");
    this.leads.splice(index, 1);
  }

  // Client website methods
  async getClientWebsite(clientId: string): Promise<ClientWebsite | undefined> {
    return this.clientWebsites.find(w => w.clientId === clientId);
  }

  async createClientWebsite(website: InsertClientWebsite): Promise<ClientWebsite> {
    const newWebsite: ClientWebsite = {
      id: `website_${this.clientWebsites.length + 1}`,
      clientId: website.clientId,
      subdomain: website.subdomain,
      customDomain: website.customDomain || null,
      title: website.title,
      description: website.description || null,
      heroImage: website.heroImage || null,
      primaryColor: website.primaryColor || "#3B82F6",
      secondaryColor: website.secondaryColor || "#F3F4F6",
      contactInfo: website.contactInfo || null,
      socialLinks: website.socialLinks || null,
      sections: website.sections || null,
      showPrices: website.showPrices ?? true,
      allowOnlineBooking: website.allowOnlineBooking ?? true,
      isPublished: website.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clientWebsites.push(newWebsite);
    return newWebsite;
  }

  async updateClientWebsite(clientId: string, updates: Partial<InsertClientWebsite>): Promise<ClientWebsite> {
    const index = this.clientWebsites.findIndex(w => w.clientId === clientId);
    if (index === -1) throw new Error("Client website not found");
    
    this.clientWebsites[index] = {
      ...this.clientWebsites[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.clientWebsites[index];
  }

  async getPublicWebsite(subdomain: string): Promise<ClientWebsite | undefined> {
    return this.clientWebsites.find(w => w.subdomain === subdomain && w.isPublished);
  }

  // Appointment slots methods
  async getAppointmentSlots(clientId: string): Promise<AppointmentSlot[]> {
    return this.appointmentSlots.filter(slot => slot.clientId === clientId);
  }

  async createAppointmentSlot(slot: InsertAppointmentSlot): Promise<AppointmentSlot> {
    const newSlot: AppointmentSlot = {
      id: `slot_${this.appointmentSlots.length + 1}`,
      clientId: slot.clientId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotDuration: slot.slotDuration || 30,
      isActive: slot.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointmentSlots.push(newSlot);
    return newSlot;
  }

  async updateAppointmentSlot(id: string, updates: Partial<InsertAppointmentSlot>): Promise<AppointmentSlot> {
    const index = this.appointmentSlots.findIndex(slot => slot.id === id);
    if (index === -1) throw new Error("Appointment slot not found");
    
    this.appointmentSlots[index] = {
      ...this.appointmentSlots[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.appointmentSlots[index];
  }

  async deleteAppointmentSlot(id: string): Promise<void> {
    const index = this.appointmentSlots.findIndex(slot => slot.id === id);
    if (index === -1) throw new Error("Appointment slot not found");
    this.appointmentSlots.splice(index, 1);
  }

  async getAvailableSlots(clientId: string, date: string): Promise<string[]> {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0-6 (Sunday-Saturday)
    
    // Get slot configurations for this day
    const daySlots = this.appointmentSlots.filter(slot => 
      slot.clientId === clientId && 
      slot.dayOfWeek === dayOfWeek && 
      slot.isActive
    );
    
    if (daySlots.length === 0) return [];
    
    // Get existing appointments for this date
    const existingAppointments = this.appointments.filter(apt => 
      apt.clientId === clientId && 
      new Date(apt.appointmentDate).toDateString() === new Date(date).toDateString()
    );
    
    const bookedTimes = existingAppointments.map(apt => apt.startTime);
    
    // Generate available time slots
    const availableSlots: string[] = [];
    
    for (const slotConfig of daySlots) {
      const start = this.timeToMinutes(slotConfig.startTime);
      const end = this.timeToMinutes(slotConfig.endTime);
      const duration = slotConfig.slotDuration || 30;
      
      for (let time = start; time < end; time += duration) {
        const timeString = this.minutesToTime(time);
        if (!bookedTimes.includes(timeString)) {
          availableSlots.push(timeString);
        }
      }
    }
    
    return availableSlots.sort();
  }

  private timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Team Members
  async getTeamMembers(clientId: string): Promise<TeamMember[]> {
    return this.teamMembers.filter(member => member.clientId === clientId);
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return this.teamMembers.find(member => member.id === id);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: `team_${this.teamMembers.length + 1}`,
      clientId: member.clientId,
      name: member.name,
      email: member.email,
      phone: member.phone || null,
      role: member.role || "STAFF",
      permissions: member.permissions || [],
      isActive: member.isActive ?? true,
      hourlyRate: member.hourlyRate || null,
      specializations: member.specializations || [],
      workingHours: member.workingHours || null,
      password: member.password,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.teamMembers.push(newMember);
    return newMember;
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember> {
    const index = this.teamMembers.findIndex(member => member.id === id);
    if (index === -1) throw new Error("Team member not found");
    
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.teamMembers[index];
  }

  async deleteTeamMember(id: string): Promise<void> {
    const index = this.teamMembers.findIndex(member => member.id === id);
    if (index === -1) throw new Error("Team member not found");
    this.teamMembers.splice(index, 1);
  }

  // Review Platforms methods
  async getReviewPlatforms(): Promise<ReviewPlatform[]> {
    return this.reviewPlatforms.filter(platform => platform.isActive).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getReviewPlatform(id: string): Promise<ReviewPlatform | undefined> {
    return this.reviewPlatforms.find(platform => platform.id === id);
  }

  async createReviewPlatform(platform: InsertReviewPlatform): Promise<ReviewPlatform> {
    const newPlatform: ReviewPlatform = {
      id: `review_platform_${this.reviewPlatforms.length + 1}`,
      name: platform.name,
      displayName: platform.displayName,
      rating: platform.rating,
      maxRating: platform.maxRating || 5,
      reviewCount: platform.reviewCount || null,
      logoUrl: platform.logoUrl || null,
      isActive: platform.isActive ?? true,
      sortOrder: platform.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviewPlatforms.push(newPlatform);
    return newPlatform;
  }

  async updateReviewPlatform(id: string, updates: Partial<InsertReviewPlatform>): Promise<ReviewPlatform> {
    const index = this.reviewPlatforms.findIndex(platform => platform.id === id);
    if (index === -1) throw new Error("Review platform not found");
    
    this.reviewPlatforms[index] = {
      ...this.reviewPlatforms[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.reviewPlatforms[index];
  }

  async deleteReviewPlatform(id: string): Promise<void> {
    const index = this.reviewPlatforms.findIndex(platform => platform.id === id);
    if (index === -1) throw new Error("Review platform not found");
    this.reviewPlatforms.splice(index, 1);
  }

  // Review Platform Connections Implementation
  async getReviewPlatformConnections(clientId: string): Promise<ReviewPlatformConnection[]> {
    return this.reviewPlatformConnections.filter(c => c.clientId === clientId);
  }

  async getReviewPlatformConnection(id: string): Promise<ReviewPlatformConnection | undefined> {
    return this.reviewPlatformConnections.find(c => c.id === id);
  }

  async createReviewPlatformConnection(connection: InsertReviewPlatformConnection): Promise<ReviewPlatformConnection> {
    const newConnection: ReviewPlatformConnection = {
      id: `connection_${this.reviewPlatformConnections.length + 1}`,
      clientId: connection.clientId,
      platform: connection.platform,
      platformAccountId: connection.platformAccountId || null,
      apiKey: connection.apiKey || null,
      accessToken: connection.accessToken || null,
      refreshToken: connection.refreshToken || null,
      isActive: connection.isActive ?? true,
      lastSyncAt: connection.lastSyncAt || null,
      averageRating: connection.averageRating || null,
      totalReviews: connection.totalReviews || 0,
      platformUrl: connection.platformUrl || null,
      syncFrequency: connection.syncFrequency || "DAILY",
      errorMessage: connection.errorMessage || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviewPlatformConnections.push(newConnection);
    return newConnection;
  }

  async updateReviewPlatformConnection(id: string, updates: Partial<InsertReviewPlatformConnection>): Promise<ReviewPlatformConnection> {
    const index = this.reviewPlatformConnections.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Review platform connection not found");
    
    this.reviewPlatformConnections[index] = {
      ...this.reviewPlatformConnections[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.reviewPlatformConnections[index];
  }

  async deleteReviewPlatformConnection(id: string): Promise<void> {
    const index = this.reviewPlatformConnections.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Review platform connection not found");
    this.reviewPlatformConnections.splice(index, 1);
  }

  async syncReviewPlatformData(connectionId: string): Promise<ReviewPlatformConnection> {
    const connection = await this.getReviewPlatformConnection(connectionId);
    if (!connection) throw new Error("Review platform connection not found");

    // Mock sync implementation - in real app this would call external APIs
    const mockReviewData = this.generateMockReviewData(connection.platform);
    
    return this.updateReviewPlatformConnection(connectionId, {
      averageRating: mockReviewData.averageRating,
      totalReviews: mockReviewData.totalReviews,
      lastSyncAt: new Date(),
      errorMessage: null
    });
  }

  // Platform Reviews Implementation
  async getPlatformReviews(clientId: string, platform?: string): Promise<PlatformReview[]> {
    let reviews = this.platformReviews.filter(r => r.clientId === clientId);
    if (platform) {
      reviews = reviews.filter(r => r.platform === platform);
    }
    return reviews;
  }

  async getPlatformReview(id: string): Promise<PlatformReview | undefined> {
    return this.platformReviews.find(r => r.id === id);
  }

  async createPlatformReview(review: InsertPlatformReview): Promise<PlatformReview> {
    const newReview: PlatformReview = {
      id: `review_${this.platformReviews.length + 1}`,
      connectionId: review.connectionId,
      clientId: review.clientId,
      platform: review.platform,
      externalReviewId: review.externalReviewId,
      customerName: review.customerName,
      customerAvatar: review.customerAvatar || null,
      rating: review.rating,
      reviewText: review.reviewText || null,
      reviewDate: review.reviewDate,
      businessResponse: review.businessResponse || null,
      businessResponseDate: review.businessResponseDate || null,
      isVerified: review.isVerified ?? false,
      helpfulCount: review.helpfulCount || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.platformReviews.push(newReview);
    return newReview;
  }

  async updatePlatformReview(id: string, updates: Partial<InsertPlatformReview>): Promise<PlatformReview> {
    const index = this.platformReviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Platform review not found");
    
    this.platformReviews[index] = {
      ...this.platformReviews[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.platformReviews[index];
  }

  async deletePlatformReview(id: string): Promise<void> {
    const index = this.platformReviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Platform review not found");
    this.platformReviews.splice(index, 1);
  }

  private generateMockReviewData(platform: string) {
    const mockData = {
      GOOGLE: { averageRating: 4.8, totalReviews: 127 },
      YELP: { averageRating: 4.5, totalReviews: 89 },
      TRUSTPILOT: { averageRating: 4.9, totalReviews: 203 }
    };
    return mockData[platform as keyof typeof mockData] || { averageRating: 4.0, totalReviews: 50 };
  }

  // Domain Configuration methods
  async getDomainConfigurations(clientId: string): Promise<DomainConfiguration[]> {
    return this.domainConfigurations.filter(d => d.clientId === clientId);
  }

  async getDomainConfiguration(id: string): Promise<DomainConfiguration | undefined> {
    return this.domainConfigurations.find(d => d.id === id);
  }

  async getDomainConfigurationByDomain(domain: string): Promise<DomainConfiguration | undefined> {
    return this.domainConfigurations.find(d => d.domain === domain);
  }

  async createDomainConfiguration(domainConfig: InsertDomainConfiguration): Promise<DomainConfiguration> {
    const newDomainConfig: DomainConfiguration = {
      id: `domain_${this.domainConfigurations.length + 1}`,
      clientId: domainConfig.clientId,
      domainType: domainConfig.domainType,
      domain: domainConfig.domain,
      subdomain: domainConfig.subdomain || null,
      isActive: domainConfig.isActive ?? false,
      verificationStatus: domainConfig.verificationStatus || "PENDING",
      verificationToken: this.generateVerificationToken(),
      verificationMethod: domainConfig.verificationMethod || "DNS_TXT",
      sslStatus: domainConfig.sslStatus || "PENDING",
      sslCertificateId: domainConfig.sslCertificateId || null,
      sslIssuedAt: domainConfig.sslIssuedAt || null,
      sslExpiresAt: domainConfig.sslExpiresAt || null,
      dnsRecords: domainConfig.dnsRecords || this.generateDnsRecords(domainConfig.domain),
      redirectToHttps: domainConfig.redirectToHttps ?? true,
      customSettings: domainConfig.customSettings || null,
      lastCheckedAt: null,
      verifiedAt: domainConfig.verifiedAt || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.domainConfigurations.push(newDomainConfig);
    return newDomainConfig;
  }

  async updateDomainConfiguration(id: string, updates: Partial<InsertDomainConfiguration>): Promise<DomainConfiguration> {
    const index = this.domainConfigurations.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Domain configuration not found");
    
    this.domainConfigurations[index] = {
      ...this.domainConfigurations[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.domainConfigurations[index];
  }

  async deleteDomainConfiguration(id: string): Promise<void> {
    const index = this.domainConfigurations.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Domain configuration not found");
    this.domainConfigurations.splice(index, 1);
  }

  async verifyDomain(id: string): Promise<DomainConfiguration> {
    const domain = await this.getDomainConfiguration(id);
    if (!domain) throw new Error("Domain configuration not found");

    // Get verification attempt count for this domain
    const existingLogs = await this.getDomainVerificationLogs(id);
    const attemptNumber = existingLogs.length + 1;

    let verificationResult;
    
    try {
      // Perform real DNS verification based on verification method
      if (domain.verificationMethod === "DNS_TXT") {
        verificationResult = await dnsVerificationService.verifyDomainViaDNS(
          domain.domain, 
          domain.verificationToken || ""
        );
      } else if (domain.verificationMethod === "CNAME") {
        verificationResult = await dnsVerificationService.verifyDomainViaCNAME(
          domain.domain,
          "scheduled-platform.com"
        );
      } else {
        throw new Error(`Unsupported verification method: ${domain.verificationMethod}`);
      }

      // Log the verification attempt
      await this.createDomainVerificationLog({
        domainConfigId: id,
        verificationAttempt: attemptNumber,
        verificationMethod: domain.verificationMethod,
        status: verificationResult.success ? "SUCCESS" : "FAILED",
        errorMessage: verificationResult.errorMessage || null,
        verificationData: JSON.stringify(verificationResult.verificationData),
        responseTime: verificationResult.responseTime
      });

      // Update domain based on verification result
      if (verificationResult.success) {
        return this.updateDomainConfiguration(id, {
          verificationStatus: "VERIFIED",
          isActive: true,
          verifiedAt: new Date(),
          lastCheckedAt: new Date()
        });
      } else {
        return this.updateDomainConfiguration(id, {
          verificationStatus: "FAILED",
          lastCheckedAt: new Date()
        });
      }
    } catch (error: any) {
      // Log the verification failure
      await this.createDomainVerificationLog({
        domainConfigId: id,
        verificationAttempt: attemptNumber,
        verificationMethod: domain.verificationMethod || "DNS_TXT",
        status: "FAILED",
        errorMessage: `Verification error: ${error.message}`,
        verificationData: JSON.stringify({
          expected: domain.verificationToken,
          found: null,
          recordName: `_scheduled-verification.${domain.domain}`,
          error: error.message
        }),
        responseTime: 0
      });

      return this.updateDomainConfiguration(id, {
        verificationStatus: "FAILED",
        lastCheckedAt: new Date()
      });
    }
  }

  // Domain Verification Log methods
  async getDomainVerificationLogs(domainConfigId: string): Promise<DomainVerificationLog[]> {
    return this.domainVerificationLogs.filter(l => l.domainConfigId === domainConfigId);
  }

  async createDomainVerificationLog(log: InsertDomainVerificationLog): Promise<DomainVerificationLog> {
    const newLog: DomainVerificationLog = {
      id: `log_${this.domainVerificationLogs.length + 1}`,
      domainConfigId: log.domainConfigId,
      verificationAttempt: log.verificationAttempt || 1,
      verificationMethod: log.verificationMethod,
      status: log.status,
      errorMessage: log.errorMessage || null,
      verificationData: log.verificationData || null,
      responseTime: log.responseTime || null,
      createdAt: new Date()
    };
    this.domainVerificationLogs.push(newLog);
    return newLog;
  }

  // Helper methods for domain functionality
  private generateVerificationToken(): string {
    return `verify-domain-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateDnsRecords(domain: string): string {
    return JSON.stringify([
      {
        type: "TXT",
        name: `_scheduled-verification.${domain}`,
        value: this.generateVerificationToken(),
        ttl: 300
      },
      {
        type: "CNAME",
        name: domain,
        value: "scheduled-platform.com",
        ttl: 300
      }
    ]);
  }

  // Google Business Profile methods
  async getGoogleBusinessProfile(clientId: string): Promise<GoogleBusinessProfile | undefined> {
    return this.googleBusinessProfiles.find(profile => profile.clientId === clientId);
  }

  async createGoogleBusinessProfile(profile: InsertGoogleBusinessProfile): Promise<GoogleBusinessProfile> {
    const newProfile: GoogleBusinessProfile = {
      id: `google_business_${this.googleBusinessProfiles.length + 1}`,
      clientId: profile.clientId,
      businessName: profile.businessName,
      googlePlaceId: profile.googlePlaceId || null,
      googleAccountId: profile.googleAccountId || null,
      locationId: profile.locationId || null,
      oauthConnected: profile.oauthConnected || false,
      verificationStatus: profile.verificationStatus || "UNLINKED",
      verificationSource: profile.verificationSource || null,
      averageRating: profile.averageRating || null,
      totalReviews: profile.totalReviews || 0,
      businessHours: profile.businessHours || null,
      businessDescription: profile.businessDescription || null,
      businessCategories: profile.businessCategories || [],
      businessPhotos: profile.businessPhotos || [],
      website: profile.website || null,
      phoneNumber: profile.phoneNumber || null,
      address: profile.address || null,
      postalCode: profile.postalCode || null,
      city: profile.city || null,
      state: profile.state || null,
      country: profile.country || null,
      latitude: profile.latitude || null,
      longitude: profile.longitude || null,
      lastSyncAt: profile.lastSyncAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.googleBusinessProfiles.push(newProfile);
    return newProfile;
  }

  async updateGoogleBusinessProfile(clientId: string, updates: Partial<InsertGoogleBusinessProfile>): Promise<GoogleBusinessProfile> {
    const index = this.googleBusinessProfiles.findIndex(profile => profile.clientId === clientId);
    if (index === -1) throw new Error("Google Business Profile not found");
    
    this.googleBusinessProfiles[index] = {
      ...this.googleBusinessProfiles[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.googleBusinessProfiles[index];
  }

  async deleteGoogleBusinessProfile(clientId: string): Promise<void> {
    const index = this.googleBusinessProfiles.findIndex(profile => profile.clientId === clientId);
    if (index === -1) throw new Error("Google Business Profile not found");
    this.googleBusinessProfiles.splice(index, 1);
  }

  async syncGoogleBusinessProfile(clientId: string): Promise<GoogleBusinessProfile> {
    const profile = await this.getGoogleBusinessProfile(clientId);
    if (!profile) throw new Error("Google Business Profile not found");

    // Real Google My Business API integration required
    // This endpoint requires actual OAuth authentication and Google My Business API calls
    throw new Error("Google Business Profile sync requires OAuth authentication. Please connect your Google account first.");
  }
}

export const storage = new MemStorage();