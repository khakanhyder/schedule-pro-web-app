import { 
  User, 
  Plan, 
  Client, 
  OnboardingSession, 
  ReviewPlatform,
  IUser,
  IPlan,
  IClient,
  IReviewPlatform
} from './models/index.js';
import { connectToMongoDB } from './mongo-db.js';

// MongoDB connection will be initialized when the storage is first used

export class MongoDBStorage {
  private initialized = false;

  private async ensureConnection() {
    if (!this.initialized) {
      await connectToMongoDB();
      this.initialized = true;
    }
  }
  // User operations
  async getUser(id: string) {
    await this.ensureConnection();
    return await User.findById(id).lean();
  }

  async getUserByEmail(email: string) {
    await this.ensureConnection();
    return await User.findOne({ email }).lean();
  }

  async createUser(userData: Omit<IUser, '_id'>) {
    await this.ensureConnection();
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(id: string, updates: Partial<IUser>) {
    await this.ensureConnection();
    return await User.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  // Plan operations
  async getPlans() {
    await this.ensureConnection();
    return await Plan.find({ isActive: true }).lean();
  }

  async getPlan(id: string) {
    await this.ensureConnection();
    return await Plan.findById(id).lean();
  }

  async createPlan(planData: Omit<IPlan, '_id'>) {
    await this.ensureConnection();
    const plan = new Plan(planData);
    return await plan.save();
  }

  async updatePlan(id: string, updates: Partial<IPlan>) {
    await this.ensureConnection();
    return await Plan.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deletePlan(id: string) {
    await this.ensureConnection();
    return await Plan.findByIdAndDelete(id).lean();
  }

  // Client operations
  async getClients() {
    return await Client.find().populate('planId', 'name price').lean();
  }

  async getClient(id: string) {
    return await Client.findById(id).populate('planId').lean();
  }

  async getClientByEmail(email: string) {
    return await Client.findOne({ email }).populate('planId').lean();
  }

  async createClient(clientData: Omit<IClient, '_id'>) {
    const client = new Client(clientData);
    return await client.save();
  }

  async updateClient(id: string, updates: Partial<IClient>) {
    return await Client.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteClient(id: string) {
    return await Client.findByIdAndDelete(id).lean();
  }

  // Onboarding operations
  async getOnboardingSessions() {
    return await OnboardingSession.find().populate('planId', 'name price').lean();
  }

  async getOnboardingSession(sessionId: string) {
    return await OnboardingSession.findOne({ sessionId }).populate('planId').lean();
  }

  async createOnboardingSession(sessionData: any) {
    const session = new OnboardingSession(sessionData);
    return await session.save();
  }

  async updateOnboardingSession(sessionId: string, updates: any) {
    return await OnboardingSession.findOneAndUpdate(
      { sessionId }, 
      updates, 
      { new: true }
    ).lean();
  }

  // Review Platform operations
  async getReviewPlatforms() {
    return await ReviewPlatform.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  }

  async getAllReviewPlatforms() {
    return await ReviewPlatform.find().sort({ sortOrder: 1 }).lean();
  }

  async getReviewPlatform(id: string) {
    return await ReviewPlatform.findById(id).lean();
  }

  async createReviewPlatform(platformData: Omit<IReviewPlatform, '_id'>) {
    const platform = new ReviewPlatform(platformData);
    return await platform.save();
  }

  async updateReviewPlatform(id: string, updates: Partial<IReviewPlatform>) {
    return await ReviewPlatform.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async deleteReviewPlatform(id: string) {
    return await ReviewPlatform.findByIdAndDelete(id).lean();
  }

  // Analytics
  async getAnalytics() {
    const clients = await Client.find().lean();
    const activeClients = clients.filter(c => c.status === 'ACTIVE');
    
    const totalMRR = activeClients.reduce((sum, client) => sum + (client.monthlyRevenue || 0), 0);
    
    return {
      totalMRR,
      totalClients: clients.length,
      activeClients: activeClients.length,
      churnRate: clients.length > 0 ? ((clients.length - activeClients.length) / clients.length * 100) : 0,
      monthlyData: [] // You can implement monthly data aggregation if needed
    };
  }

  // Sample data initialization
  async initializeSampleData() {
    await this.ensureConnection();
    // Check if data already exists
    const existingPlans = await Plan.countDocuments();
    if (existingPlans > 0) return;

    // Create sample plans
    const samplePlans = [
      {
        name: "Free Demo",
        price: 0,
        billing: "MONTHLY" as const,
        features: ["Basic Features", "1 User", "Email Support"],
        maxUsers: 1,
        storageGB: 1,
        isFreeTrial: true,
        trialDays: 14
      },
      {
        name: "Professional",
        price: 29,
        billing: "MONTHLY" as const,
        features: ["All Features", "5 Users", "Priority Support", "Advanced Analytics"],
        maxUsers: 5,
        storageGB: 10
      }
    ];

    for (const planData of samplePlans) {
      await this.createPlan(planData);
    }

    // Create sample review platforms
    const samplePlatforms = [
      {
        name: "google",
        displayName: "Google Reviews",
        rating: 4.9,
        maxRating: 5,
        reviewCount: 247,
        isActive: true,
        sortOrder: 1
      },
      {
        name: "yelp",
        displayName: "Yelp",
        rating: 4.7,
        maxRating: 5,
        reviewCount: 156,
        isActive: true,
        sortOrder: 2
      },
      {
        name: "trustpilot",
        displayName: "Trust Pilot",
        rating: 4.8,
        maxRating: 5,
        reviewCount: 89,
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const platformData of samplePlatforms) {
      await this.createReviewPlatform(platformData);
    }

    console.log('✅ Sample data initialized for MongoDB');
  }
}

export const storage = new MongoDBStorage();

// Initialize sample data when storage is first used
storage.initializeSampleData().catch(console.error);