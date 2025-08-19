import { 
  users, type User, type InsertUser,
  plans, type Plan, type InsertPlan,
  onboardingSessions, type OnboardingSession, type InsertOnboardingSession,
  clients, type Client, type InsertClient,
  services, type Service, type InsertService,
  reviews, type Review, type InsertReview,
} from "@shared/schema";

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
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private users: User[] = [];
  private plans: Plan[] = [];
  private onboardingSessions: OnboardingSession[] = [];
  private clients: Client[] = [];
  private services: Service[] = [];
  private reviews: Review[] = [];

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

    // Create sample plans
    await this.createPlan({
      name: "Basic",
      price: 29.99,
      billing: "MONTHLY",
      features: ["1 User", "10GB Storage", "Basic Support"],
      maxUsers: 1,
      storageGB: 10,
      isActive: true
    });

    await this.createPlan({
      name: "Pro",
      price: 99.99,
      billing: "MONTHLY", 
      features: ["5 Users", "100GB Storage", "Priority Support", "Advanced Analytics"],
      maxUsers: 5,
      storageGB: 100,
      isActive: true
    });

    await this.createPlan({
      name: "Enterprise",
      price: 299.99,
      billing: "MONTHLY",
      features: ["Unlimited Users", "1TB Storage", "24/7 Support", "Custom Integrations"],
      maxUsers: 999,
      storageGB: 1000,
      isActive: true
    });

    // Create sample clients
    await this.createClient({
      businessName: "ABC Consulting",
      contactPerson: "John Smith",
      email: "john@abcconsulting.com",
      phone: "555-0101",
      planId: "plan_1",
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
      planId: "plan_2",
      status: "TRIAL",
      userId: "user_3",
      businessAddress: "456 Tech Ave, City, State",
      industry: "Technology"
    });

    // Add sample services
    await this.createService({
      name: "Hair Cut",
      description: "Professional hair cutting service",
      price: "$50",
      durationMinutes: 60,
      category: "Hair"
    });

    await this.createService({
      name: "Color Treatment",
      description: "Hair coloring and treatment",
      price: "$120",
      durationMinutes: 120,
      category: "Hair"
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
}

export const storage = new MemStorage();