import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import express from "express";
import { storage } from "./storage";
import { sendEmail } from "./sendgrid";
import { 
  insertUserSchema,
  insertPlanSchema,
  insertOnboardingSessionSchema,
  insertClientSchema,
  insertServiceSchema,
  insertReviewSchema,
  insertClientServiceSchema,
  insertAppointmentSchema,
  insertOperatingHoursSchema,
  insertLeadSchema,
  insertClientWebsiteSchema,
  insertAppointmentSlotSchema,
  insertTeamMemberSchema,
  insertReviewPlatformSchema,
  insertReviewPlatformConnectionSchema,
  insertPlatformReviewSchema,
  insertDomainConfigurationSchema,
  insertDomainVerificationLogSchema
} from "@shared/schema";
import { 
  validateDomain, 
  DomainValidationError, 
  enhancedDomainConfigurationSchema 
} from "./domain-validation";
import { v4 as uuidv4 } from "uuid";

// Initialize Stripe (if configured)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Permission checking middleware
interface TeamMemberSession {
  teamMemberId: string;
  permissions: string[];
  clientId: string;
}

const requirePermission = (requiredPermission: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if request has team member session data
      const teamMemberSession = req.headers['x-team-member-session'];
      
      // First check if this is a business owner with full access
      // Business owners should bypass team member permission checking
      if (teamMemberSession) {
        try {
          const sessionData = JSON.parse(teamMemberSession as string);
          
          // If session has full permissions (*), this is a business owner - grant access
          if (sessionData.permissions && sessionData.permissions.includes('*')) {
            console.log(`Business owner access granted for ${requiredPermission}`);
            return next();
          }
          
          // Verify client ID matches for team members
          const { clientId } = req.params;
          if (!clientId || sessionData.clientId !== clientId) {
            return res.status(403).json({ error: "Access denied: Client ID mismatch or missing" });
          }

          // Check if team member has required permission
          if (!sessionData.permissions.includes(requiredPermission)) {
            return res.status(403).json({ 
              error: `Access denied: Missing required permission '${requiredPermission}'` 
            });
          }

          // Permission granted for team member
          return next();
        } catch (parseError) {
          return res.status(401).json({ error: "Invalid team member session format" });
        }
      }
      
      // No authentication provided
      return res.status(401).json({ error: "Authentication required: Missing team member session" });
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Permission validation failed" });
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable JSON parsing
  app.use(express.json());

  // CORS headers for all routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Team-Member-Session");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", service: "SaaS Platform API" });
  });

  // =============================================================================
  // STRIPE PAYMENT ROUTES
  // =============================================================================
  
  // Create payment intent for plan purchase
  app.post("/api/payments/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const { planId, clientEmail } = req.body;
      
      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(plan.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          planId: plan.id,
          planName: plan.name,
          clientEmail: clientEmail
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        planName: plan.name,
        amount: plan.price
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Handle successful payment
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { paymentIntentId, clientId } = req.body;
      
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update client status to ACTIVE
        const planId = paymentIntent.metadata.planId;
        if (clientId && planId) {
          await storage.updateClient(clientId, { 
            status: "ACTIVE", 
            planId: planId 
          });
        }
        
        res.json({ success: true, status: paymentIntent.status });
      } else {
        res.json({ success: false, status: paymentIntent.status });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // =============================================================================
  // AUTHENTICATION ROUTES
  // =============================================================================

  // Super Admin Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // For demo purposes, we'll send back the user info (in production use JWT)
      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Client Login
  app.post("/api/auth/client-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password || user.role !== "CLIENT") {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const client = await storage.getClientByEmail(email);
      if (!client) {
        return res.status(404).json({ error: "Client profile not found" });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        client: client,
        message: "Client login successful"
      });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ error: "Client login failed" });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Plans Management
  // =============================================================================

  // Get all plans
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Create new plan
  app.post("/api/plans", async (req, res) => {
    try {
      const planData = insertPlanSchema.parse(req.body);
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  // Update plan
  app.put("/api/plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const plan = await storage.updatePlan(id, updates);
      res.json(plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  // Delete plan
  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePlan(id);
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Review Platforms Management
  // =============================================================================

  // Get all review platforms
  app.get("/api/review-platforms", async (req, res) => {
    try {
      const platforms = await storage.getReviewPlatforms();
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching review platforms:", error);
      res.status(500).json({ error: "Failed to fetch review platforms" });
    }
  });

  // Create new review platform
  app.post("/api/review-platforms", async (req, res) => {
    try {
      const platformData = insertReviewPlatformSchema.parse(req.body);
      const platform = await storage.createReviewPlatform(platformData);
      res.json(platform);
    } catch (error) {
      console.error("Error creating review platform:", error);
      res.status(500).json({ error: "Failed to create review platform" });
    }
  });

  // Update review platform
  app.put("/api/review-platforms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const platform = await storage.updateReviewPlatform(id, updates);
      res.json(platform);
    } catch (error) {
      console.error("Error updating review platform:", error);
      res.status(500).json({ error: "Failed to update review platform" });
    }
  });

  // Delete review platform
  app.delete("/api/review-platforms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteReviewPlatform(id);
      res.json({ message: "Review platform deleted successfully" });
    } catch (error) {
      console.error("Error deleting review platform:", error);
      res.status(500).json({ error: "Failed to delete review platform" });
    }
  });

  // =============================================================================
  // CLIENT ROUTES - Review Platform Connections (Real Review Data)
  // =============================================================================

  // Get review platform connections for a client
  app.get("/api/clients/:clientId/review-connections", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { clientId } = req.params;
      const connections = await storage.getReviewPlatformConnections(clientId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching review platform connections:", error);
      res.status(500).json({ error: "Failed to fetch review platform connections" });
    }
  });

  // Create new review platform connection
  app.post("/api/clients/:clientId/review-connections", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { clientId } = req.params;
      const connectionData = insertReviewPlatformConnectionSchema.parse({
        ...req.body,
        clientId
      });
      const connection = await storage.createReviewPlatformConnection(connectionData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating review platform connection:", error);
      res.status(500).json({ error: "Failed to create review platform connection" });
    }
  });

  // Update review platform connection
  app.put("/api/clients/:clientId/review-connections/:id", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const connection = await storage.updateReviewPlatformConnection(id, updates);
      res.json(connection);
    } catch (error) {
      console.error("Error updating review platform connection:", error);
      res.status(500).json({ error: "Failed to update review platform connection" });
    }
  });

  // Delete review platform connection
  app.delete("/api/clients/:clientId/review-connections/:id", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteReviewPlatformConnection(id);
      res.json({ message: "Review platform connection deleted successfully" });
    } catch (error) {
      console.error("Error deleting review platform connection:", error);
      res.status(500).json({ error: "Failed to delete review platform connection" });
    }
  });

  // Sync review platform data
  app.post("/api/clients/:clientId/review-connections/:id/sync", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await storage.syncReviewPlatformData(id);
      res.json(connection);
    } catch (error) {
      console.error("Error syncing review platform data:", error);
      res.status(500).json({ error: "Failed to sync review platform data" });
    }
  });

  // =============================================================================
  // CLIENT ROUTES - Platform Reviews (Individual Review Data)
  // =============================================================================

  // Get platform reviews for a client
  app.get("/api/clients/:clientId/platform-reviews", requirePermission("VIEW_REVIEWS"), async (req, res) => {
    try {
      const { clientId } = req.params;
      const { platform } = req.query;
      const reviews = await storage.getPlatformReviews(clientId, platform as string);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching platform reviews:", error);
      res.status(500).json({ error: "Failed to fetch platform reviews" });
    }
  });

  // Create new platform review
  app.post("/api/clients/:clientId/platform-reviews", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { clientId } = req.params;
      const reviewData = insertPlatformReviewSchema.parse({
        ...req.body,
        clientId
      });
      const review = await storage.createPlatformReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating platform review:", error);
      res.status(500).json({ error: "Failed to create platform review" });
    }
  });

  // Update platform review (typically for business responses)
  app.put("/api/clients/:clientId/platform-reviews/:id", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const review = await storage.updatePlatformReview(id, updates);
      res.json(review);
    } catch (error) {
      console.error("Error updating platform review:", error);
      res.status(500).json({ error: "Failed to update platform review" });
    }
  });

  // Delete platform review
  app.delete("/api/clients/:clientId/platform-reviews/:id", requirePermission("MANAGE_REVIEWS"), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePlatformReview(id);
      res.json({ message: "Platform review deleted successfully" });
    } catch (error) {
      console.error("Error deleting platform review:", error);
      res.status(500).json({ error: "Failed to delete platform review" });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Review Analytics & Management
  // =============================================================================

  // Get all platform reviews across all clients (for super admin analytics)
  app.get("/api/admin/platform-reviews", async (req, res) => {
    try {
      const { platform, clientId } = req.query;
      
      if (clientId) {
        const reviews = await storage.getPlatformReviews(clientId as string, platform as string);
        res.json(reviews);
      } else {
        // Get all reviews across all clients for super admin dashboard
        const clients = await storage.getClients();
        const allReviews = [];
        
        for (const client of clients) {
          const clientReviews = await storage.getPlatformReviews(client.id, platform as string);
          allReviews.push(...clientReviews);
        }
        
        res.json(allReviews);
      }
    } catch (error) {
      console.error("Error fetching admin platform reviews:", error);
      res.status(500).json({ error: "Failed to fetch platform reviews" });
    }
  });

  // Get review analytics summary for super admin
  app.get("/api/admin/review-analytics", async (req, res) => {
    try {
      const clients = await storage.getClients();
      const analytics = [];
      
      for (const client of clients) {
        const connections = await storage.getReviewPlatformConnections(client.id);
        const reviews = await storage.getPlatformReviews(client.id);
        
        const clientAnalytics = {
          clientId: client.id,
          clientName: client.businessName,
          totalConnections: connections.length,
          activeConnections: connections.filter(c => c.isActive).length,
          totalReviews: reviews.length,
          averageRating: reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0,
          platforms: connections.map(conn => ({
            platform: conn.platform,
            isActive: conn.isActive,
            averageRating: conn.averageRating,
            totalReviews: conn.totalReviews,
            lastSyncAt: conn.lastSyncAt
          }))
        };
        
        analytics.push(clientAnalytics);
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching review analytics:", error);
      res.status(500).json({ error: "Failed to fetch review analytics" });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Client Management
  // =============================================================================

  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      
      // Enhance with plan information and revenue calculation
      const enhancedClients = await Promise.all(
        clients.map(async (client) => {
          const plan = await storage.getPlan(client.planId);
          return {
            ...client,
            plan: plan ? plan.name : "Unknown",
            planPrice: plan ? plan.price : 0,
            monthlyRevenue: plan ? plan.price : 0
          };
        })
      );
      
      res.json(enhancedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Create new client
  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Update client
  app.put("/api/clients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const client = await storage.updateClient(id, updates);
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // Delete client
  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteClient(id);
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Analytics
  // =============================================================================

  // Revenue analytics
  app.get("/api/analytics/revenue", async (req, res) => {
    try {
      const clients = await storage.getClients();
      const plans = await storage.getPlans();
      
      let totalMRR = 0;
      const planDistribution: { [key: string]: number } = {};
      
      for (const client of clients) {
        const plan = plans.find(p => p.id === client.planId);
        if (plan && client.status === "ACTIVE") {
          totalMRR += plan.price;
          planDistribution[plan.name] = (planDistribution[plan.name] || 0) + 1;
        }
      }
      
      // Generate sample time series data for charts
      const now = new Date();
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: totalMRR * (0.8 + Math.random() * 0.4), // Simulate growth
          clients: Math.floor(clients.length * (0.7 + i * 0.05))
        });
      }
      
      res.json({
        totalMRR,
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === "ACTIVE").length,
        averageRevenuePerClient: clients.length > 0 ? totalMRR / clients.length : 0,
        planDistribution,
        monthlyData,
        churnRate: 2.5, // Sample churn rate
      });
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Client analytics
  app.get("/api/analytics/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      
      const statusDistribution = clients.reduce((acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      const industryDistribution = clients.reduce((acc, client) => {
        const industry = client.industry || "Other";
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      res.json({
        statusDistribution,
        industryDistribution,
        totalClients: clients.length,
        newClientsThisMonth: Math.floor(clients.length * 0.2), // Sample data
      });
    } catch (error) {
      console.error("Error fetching client analytics:", error);
      res.status(500).json({ error: "Failed to fetch client analytics" });
    }
  });

  // =============================================================================
  // ONBOARDING ROUTES
  // =============================================================================

  // Get all onboarding sessions (Super Admin)
  app.get("/api/onboarding/sessions", async (req, res) => {
    try {
      const sessions = await storage.getOnboardingSessions();
      
      // Enhance with plan information
      const enhancedSessions = await Promise.all(
        sessions.map(async (session) => {
          const plan = await storage.getPlan(session.planId);
          return {
            ...session,
            planName: plan ? plan.name : "Unknown",
            businessData: session.businessData ? JSON.parse(session.businessData) : null
          };
        })
      );
      
      res.json(enhancedSessions);
    } catch (error) {
      console.error("Error fetching onboarding sessions:", error);
      res.status(500).json({ error: "Failed to fetch onboarding sessions" });
    }
  });

  // Get onboarding analytics
  app.get("/api/onboarding/analytics", async (req, res) => {
    try {
      const sessions = await storage.getOnboardingSessions();
      
      const completionRate = sessions.length > 0 
        ? (sessions.filter(s => s.isCompleted).length / sessions.length) * 100 
        : 0;
      
      const stepAnalysis = {
        step1: sessions.filter(s => (s.currentStep || 1) >= 1).length,
        step2: sessions.filter(s => (s.currentStep || 1) >= 2).length,
        step3: sessions.filter(s => (s.currentStep || 1) >= 3).length,
        step4: sessions.filter(s => (s.currentStep || 1) >= 4).length,
        step5: sessions.filter(s => (s.currentStep || 1) >= 5).length,
        step6: sessions.filter(s => (s.currentStep || 1) >= 6).length,
        completed: sessions.filter(s => s.isCompleted).length,
      };
      
      res.json({
        totalSessions: sessions.length,
        completionRate: Math.round(completionRate),
        averageCompletionTime: "12 minutes", // Sample data
        dropOffPoints: [
          { step: "Step 2: Business Info", dropoff: "15%" },
          { step: "Step 4: Payment", dropoff: "35%" },
          { step: "Step 5: Setup", dropoff: "8%" }
        ],
        stepAnalysis
      });
    } catch (error) {
      console.error("Error fetching onboarding analytics:", error);
      res.status(500).json({ error: "Failed to fetch onboarding analytics" });
    }
  });

  // =============================================================================
  // PUBLIC WEBSITE & ONBOARDING ROUTES
  // =============================================================================

  // Get public plans for website
  app.get("/api/public/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching public plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Start onboarding session
  app.post("/api/onboarding/start", async (req, res) => {
    try {
      const { planId } = req.body;
      const sessionId = uuidv4();
      
      const session = await storage.createOnboardingSession({
        sessionId,
        planId,
        currentStep: 1,
        businessData: null
      });
      
      res.json({ sessionId: session.sessionId, session });
    } catch (error) {
      console.error("Error starting onboarding:", error);
      res.status(500).json({ error: "Failed to start onboarding" });
    }
  });

  // Get onboarding session
  app.get("/api/onboarding/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getOnboardingSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Onboarding session not found" });
      }
      
      const plan = await storage.getPlan(session.planId);
      
      res.json({
        ...session,
        plan,
        businessData: session.businessData ? JSON.parse(session.businessData) : null
      });
    } catch (error) {
      console.error("Error fetching onboarding session:", error);
      res.status(500).json({ error: "Failed to fetch onboarding session" });
    }
  });

  // Save step data
  app.put("/api/onboarding/:sessionId/step/:stepNumber", async (req, res) => {
    try {
      const { sessionId, stepNumber } = req.params;
      const stepData = req.body;
      
      const session = await storage.getOnboardingSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Onboarding session not found" });
      }
      
      // Merge new step data with existing business data
      const existingData = session.businessData ? JSON.parse(session.businessData) : {};
      const updatedData = { ...existingData, [`step${stepNumber}`]: stepData };
      
      const updatedSession = await storage.updateOnboardingSession(sessionId, {
        currentStep: Math.max(parseInt(stepNumber), session.currentStep || 1),
        businessData: JSON.stringify(updatedData)
      });
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error saving step data:", error);
      res.status(500).json({ error: "Failed to save step data" });
    }
  });

  // Complete onboarding and create client
  app.post("/api/onboarding/:sessionId/complete", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getOnboardingSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Onboarding session not found" });
      }
      
      const businessData = session.businessData ? JSON.parse(session.businessData) : {};
      
      // Create user account
      const user = await storage.createUser({
        email: businessData.step3?.adminEmail || businessData.step2?.businessEmail,
        password: businessData.step3?.password,
        role: "CLIENT"
      });
      
      // Create client
      const client = await storage.createClient({
        businessName: businessData.step2?.businessName,
        contactPerson: businessData.step2?.contactPerson,
        email: businessData.step2?.businessEmail,
        phone: businessData.step2?.phone,
        businessAddress: businessData.step2?.businessAddress,
        industry: businessData.step2?.industry,
        businessDescription: businessData.step5?.businessDescription,
        operatingHours: businessData.step5?.operatingHours ? JSON.stringify(businessData.step5.operatingHours) : null,
        timeZone: businessData.step5?.timeZone,
        planId: session.planId,
        status: "TRIAL",
        userId: user.id,
        onboardingSessionId: session.id
      });
      
      // Mark onboarding as completed
      await storage.completeOnboarding(sessionId);
      
      res.json({
        message: "Onboarding completed successfully",
        client,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });

  // =============================================================================
  // PAYMENT ROUTES (Stripe Integration)
  // =============================================================================

  // Process payment
  app.post("/api/payment/process", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe not configured" });
      }
      
      const { amount, currency = "usd", paymentMethodId, planId } = req.body;
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${req.headers.origin}/payment-success`
      });
      
      res.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ error: "Payment processing failed" });
    }
  });

  // =============================================================================
  // CLIENT DASHBOARD ROUTES
  // =============================================================================

  // Get client dashboard data
  app.get("/api/client/:clientId/dashboard", async (req, res) => {
    try {
      const { clientId } = req.params;
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const services = await storage.getClientServices(clientId);
      const appointments = await storage.getAppointments(clientId);
      const leads = await storage.getLeads(clientId);
      const operatingHours = await storage.getOperatingHours(clientId);
      const website = await storage.getClientWebsite(clientId);

      // Calculate dashboard metrics
      const thisMonth = new Date();
      const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
      
      const thisMonthAppointments = appointments.filter(a => 
        a.appointmentDate && new Date(a.appointmentDate) >= startOfMonth
      );
      const thisMonthRevenue = thisMonthAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
      const newLeadsThisMonth = leads.filter(l => 
        l.createdAt && new Date(l.createdAt) >= startOfMonth
      );

      res.json({
        client,
        services,
        appointments: appointments.slice(-10), // Recent 10 appointments
        leads: leads.slice(-10), // Recent 10 leads
        operatingHours,
        website,
        metrics: {
          totalAppointments: appointments.length,
          thisMonthAppointments: thisMonthAppointments.length,
          thisMonthRevenue,
          totalLeads: leads.length,
          newLeadsThisMonth: newLeadsThisMonth.length,
          conversionRate: leads.length > 0 ? 
            (leads.filter(l => l.convertedToAppointment).length / leads.length * 100) : 0
        }
      });
    } catch (error) {
      console.error("Error fetching client dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Client Services Management
  app.get("/api/client/:clientId/services", requirePermission('services.view'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const services = await storage.getClientServices(clientId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client services" });
    }
  });

  app.post("/api/client/:clientId/services", requirePermission('services.create'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const serviceData = { ...insertClientServiceSchema.parse(req.body), clientId };
      const service = await storage.createClientService(serviceData);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/client/:clientId/services/:serviceId", requirePermission('services.edit'), async (req, res) => {
    try {
      const { serviceId } = req.params;
      const updates = req.body;
      const service = await storage.updateClientService(serviceId, updates);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/client/:clientId/services/:serviceId", requirePermission('services.delete'), async (req, res) => {
    try {
      const { serviceId } = req.params;
      await storage.deleteClientService(serviceId);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Appointments Management
  app.get("/api/client/:clientId/appointments", requirePermission('appointments.view'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const appointments = await storage.getAppointments(clientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/client/:clientId/appointments", requirePermission('appointments.create'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const appointmentData = { ...insertAppointmentSchema.parse(req.body), clientId };
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put("/api/client/:clientId/appointments/:appointmentId", requirePermission('appointments.edit'), async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const updates = req.body;
      const appointment = await storage.updateAppointment(appointmentId, updates);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/client/:clientId/appointments/:appointmentId", requirePermission('appointments.edit'), async (req, res) => {
    try {
      const { appointmentId } = req.params;
      await storage.deleteAppointment(appointmentId);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Operating Hours Management
  app.get("/api/client/:clientId/operating-hours", async (req, res) => {
    try {
      const { clientId } = req.params;
      const hours = await storage.getOperatingHours(clientId);
      res.json(hours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch operating hours" });
    }
  });

  app.post("/api/client/:clientId/operating-hours", async (req, res) => {
    try {
      const { clientId } = req.params;
      const hoursData = req.body.map((h: any) => ({ ...h, clientId }));
      const hours = await storage.setOperatingHours(clientId, hoursData);
      res.json(hours);
    } catch (error) {
      res.status(500).json({ error: "Failed to update operating hours" });
    }
  });

  // Leads Management
  app.get("/api/client/:clientId/leads", requirePermission('leads.view'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const leads = await storage.getLeads(clientId);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.post("/api/client/:clientId/leads", requirePermission('leads.create'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const leadData = { ...insertLeadSchema.parse(req.body), clientId };
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.put("/api/client/:clientId/leads/:leadId", requirePermission('leads.edit'), async (req, res) => {
    try {
      const { leadId } = req.params;
      const updates = req.body;
      const lead = await storage.updateLead(leadId, updates);
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.delete("/api/client/:clientId/leads/:leadId", requirePermission('leads.edit'), async (req, res) => {
    try {
      const { leadId } = req.params;
      await storage.deleteLead(leadId);
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Client Website Management
  app.get("/api/client/:clientId/website", async (req, res) => {
    try {
      const { clientId } = req.params;
      const website = await storage.getClientWebsite(clientId);
      res.json(website);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website settings" });
    }
  });

  app.post("/api/client/:clientId/website", async (req, res) => {
    try {
      const { clientId } = req.params;
      console.log('POST website request body:', req.body);
      const websiteData = { ...insertClientWebsiteSchema.parse(req.body), clientId };
      const website = await storage.createClientWebsite(websiteData);
      res.json(website);
    } catch (error) {
      console.error('POST website error:', error);
      res.status(500).json({ error: "Failed to create website" });
    }
  });

  app.put("/api/client/:clientId/website", async (req, res) => {
    try {
      const { clientId } = req.params;
      const updates = req.body;
      console.log('PUT website request body:', updates);
      const website = await storage.updateClientWebsite(clientId, updates);
      res.json(website);
    } catch (error) {
      console.error('PUT website error:', error);
      res.status(500).json({ error: "Failed to update website" });
    }
  });

  // Public website data endpoint
  app.get("/api/public/client/:clientId/website", async (req, res) => {
    try {
      const { clientId } = req.params;
      const website = await storage.getClientWebsite(clientId);
      if (!website) {
        return res.status(404).json({ error: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website" });
    }
  });

  // Appointment Slots Management
  app.get("/api/client/:clientId/appointment-slots", async (req, res) => {
    try {
      const { clientId } = req.params;
      const slots = await storage.getAppointmentSlots(clientId);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointment slots" });
    }
  });

  app.post("/api/client/:clientId/appointment-slots", async (req, res) => {
    try {
      const { clientId } = req.params;
      console.log("Creating appointment slot - clientId:", clientId);
      console.log("Request body:", req.body);
      
      const slotData = { ...insertAppointmentSlotSchema.parse(req.body), clientId };
      console.log("Parsed slot data:", slotData);
      
      const slot = await storage.createAppointmentSlot(slotData);
      console.log("Created slot:", slot);
      res.json(slot);
    } catch (error) {
      console.error("Error creating appointment slot:", error);
      res.status(500).json({ error: "Failed to create appointment slot", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/client/:clientId/appointment-slots/:slotId", async (req, res) => {
    try {
      const { slotId } = req.params;
      const updates = req.body;
      const slot = await storage.updateAppointmentSlot(slotId, updates);
      res.json(slot);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment slot" });
    }
  });

  app.delete("/api/client/:clientId/appointment-slots/:slotId", async (req, res) => {
    try {
      const { slotId } = req.params;
      await storage.deleteAppointmentSlot(slotId);
      res.json({ message: "Appointment slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment slot" });
    }
  });

  // Team Members Management
  app.get("/api/client/:clientId/team", requirePermission('team.view'), async (req, res) => {
    try {
      const { clientId } = req.params;
      const teamMembers = await storage.getTeamMembers(clientId);
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/client/:clientId/team", async (req, res) => {
    try {
      const { clientId } = req.params;
      const memberData = { ...insertTeamMemberSchema.parse(req.body), clientId };
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.patch("/api/client/:clientId/team/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const updates = req.body;
      const member = await storage.updateTeamMember(memberId, updates);
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/client/:clientId/team/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      await storage.deleteTeamMember(memberId);
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // Public Website Routes
  app.get("/api/public/website/:subdomain", async (req, res) => {
    try {
      const { subdomain } = req.params;
      const website = await storage.getPublicWebsite(subdomain);
      
      if (!website) {
        return res.status(404).json({ error: "Website not found" });
      }

      const client = await storage.getClient(website.clientId);
      const services = await storage.getClientServices(website.clientId);
      const operatingHours = await storage.getOperatingHours(website.clientId);

      res.json({
        website,
        client,
        services: services.filter(s => s.isActive),
        operatingHours
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch public website" });
    }
  });

  // Public appointment booking
  app.post("/api/public/website/:subdomain/book-appointment", async (req, res) => {
    try {
      const { subdomain } = req.params;
      const website = await storage.getPublicWebsite(subdomain);
      
      if (!website || !website.allowOnlineBooking) {
        return res.status(404).json({ error: "Booking not available" });
      }

      const appointmentData = { 
        ...insertAppointmentSchema.parse(req.body), 
        clientId: website.clientId,
        status: "SCHEDULED"
      };
      
      const appointment = await storage.createAppointment(appointmentData);
      
      // Also create a lead
      await storage.createLead({
        clientId: website.clientId,
        name: appointment.customerName,
        email: appointment.customerEmail,
        phone: appointment.customerPhone || "",
        source: "website",
        status: "CONVERTED",
        convertedToAppointment: true,
        appointmentId: appointment.id,
        interestedServices: [appointment.serviceId]
      });

      res.json({ 
        message: "Appointment booked successfully",
        appointment 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to book appointment" });
    }
  });

  // Unified client authentication route - handles both business owners and team members
  app.post("/api/auth/client-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check for business owner first
      const user = await storage.getUserByEmail(email);
      if (user && user.role === 'CLIENT' && user.password === password) {
        const client = await storage.getClientByEmail(email);
        if (client) {
          res.json({
            user: { 
              id: user.id, 
              email: user.email, 
              role: "BUSINESS_OWNER",
              clientId: client.id,
              permissions: ["*"], // Full access
              name: client.contactPerson
            },
            client,
            userType: "BUSINESS_OWNER"
          });
          return;
        }
      }
      
      // Check for team members
      console.log(`Looking for team member with email: ${email}`);
      
      const clients = await storage.getClients();
      const allTeamMembers = [];
      
      for (const client of clients) {
        try {
          const clientTeamMembers = await storage.getTeamMembers(client.id);
          allTeamMembers.push(...clientTeamMembers);
        } catch (error) {
          console.error(`Error fetching team members for client ${client.id}:`, error);
        }
      }
      
      const teamMember = allTeamMembers.find(member => 
        member.email === email && member.isActive !== false
      );
      
      if (teamMember && teamMember.password === password) {
        console.log(`Found team member: ${teamMember.name} (${teamMember.email})`);
        
        const client = await storage.getClient(teamMember.clientId);
        if (client) {
          console.log("Team login successful");
          res.json({
            user: {
              id: teamMember.id,
              email: teamMember.email,
              role: "TEAM_MEMBER",
              clientId: teamMember.clientId,
              permissions: teamMember.permissions,
              name: teamMember.name
            },
            client,
            userType: "TEAM_MEMBER",
            teamMember: {
              id: teamMember.id,
              name: teamMember.name,
              email: teamMember.email,
              role: teamMember.role,
              permissions: teamMember.permissions,
              clientId: teamMember.clientId
            }
          });
          return;
        }
      }
      
      // No match found
      res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Team member authentication route
  app.post("/api/auth/team-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Get team members from all clients
      const clients = await storage.getClients();
      const allTeamMembers = [];
      
      for (const client of clients) {
        try {
          const clientTeamMembers = await storage.getTeamMembers(client.id);
          allTeamMembers.push(...clientTeamMembers);
        } catch (error) {
          console.error(`Error fetching team members for client ${client.id}:`, error);
        }
      }
      
      console.log(`Found ${allTeamMembers.length} total team members`);
      console.log(`Looking for team member with email: ${email}`);
      
      const teamMember = allTeamMembers.find(member => 
        member.email === email && member.isActive !== false
      );
      
      if (!teamMember) {
        console.log("Team member not found or inactive");
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      console.log(`Found team member: ${teamMember.name} (${teamMember.email})`);
      
      // Verify password (simple comparison for demo)
      if (teamMember.password !== password) {
        console.log("Password mismatch");
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Get the client info for the team member
      const client = await storage.getClient(teamMember.clientId);
      if (!client) {
        console.log(`Client ${teamMember.clientId} not found`);
        return res.status(404).json({ error: "Client not found" });
      }
      
      console.log("Team login successful");
      res.json({
        teamMember: {
          id: teamMember.id,
          name: teamMember.name,
          email: teamMember.email,
          role: teamMember.role,
          permissions: teamMember.permissions,
          clientId: teamMember.clientId
        },
        client
      });
    } catch (error) {
      console.error("Team member login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // =============================================================================
  // PUBLIC CLIENT WEBSITE ROUTES
  // =============================================================================

  // Get public client info
  app.get("/api/public/client/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      console.error("Error fetching public client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  // Get public client services
  app.get("/api/public/client/:clientId/services", async (req, res) => {
    try {
      const { clientId } = req.params;
      const services = await storage.getClientServices(clientId);
      
      // Only return active services for public view
      const activeServices = services.filter(s => s.isActive);
      res.json(activeServices);
    } catch (error) {
      console.error("Error fetching public services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get available time slots for a specific date
  app.get("/api/public/client/:clientId/available-slots", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ error: "Date parameter is required" });
      }

      const availableSlots = await storage.getAvailableSlots(clientId, date as string);
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ error: "Failed to fetch available slots" });
    }
  });

  // Public contact form submission
  app.post("/api/public/client/:clientId/contact", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { name, email, phone, message } = req.body;
      
      // Create lead from contact form
      const lead = await storage.createLead({
        clientId,
        name,
        email,
        phone: phone || "",
        source: "website",
        status: "NEW",
        notes: message,
        estimatedValue: 0,
        convertedToAppointment: false
      });

      res.json({ 
        message: "Contact form submitted successfully",
        lead 
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Public lead form submission
  app.post("/api/public/client/:clientId/submit-lead", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { name, email, phone, serviceInterest, estimatedBudget, contactMethod, notes } = req.body;
      
      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      
      // Parse estimated budget if provided
      let estimatedValue = null;
      if (estimatedBudget && estimatedBudget.trim()) {
        const cleanBudget = estimatedBudget.replace(/[^\d.]/g, '');
        const parsedBudget = parseFloat(cleanBudget);
        if (!isNaN(parsedBudget)) {
          estimatedValue = parsedBudget;
        }
      }
      
      // Create lead from lead form
      const lead = await storage.createLead({
        clientId,
        name,
        email,
        phone: phone || "",
        source: "website-lead-form",
        status: "NEW",
        notes: notes || `Contact preference: ${contactMethod || 'Not specified'}`,
        interestedServices: serviceInterest ? [serviceInterest] : [],
        estimatedValue,
        followUpDate: null,
        convertedToAppointment: false,
        appointmentId: null
      });
      
      res.json({ message: "Lead submitted successfully! We'll contact you within 24 hours.", leadId: lead.id });
    } catch (error) {
      console.error("Error submitting lead form:", error);
      res.status(500).json({ error: "Failed to submit lead form" });
    }
  });

  // Public appointment booking
  app.post("/api/public/client/:clientId/book", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { serviceId, customerName, customerEmail, customerPhone, appointmentDate, startTime, notes } = req.body;
      
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const service = await storage.getClientServices(clientId);
      const selectedService = service.find(s => s.id === serviceId);
      if (!selectedService) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check if the time slot is available
      const availableSlots = await storage.getAvailableSlots(clientId, appointmentDate);
      if (!availableSlots.includes(startTime)) {
        return res.status(400).json({ error: "Time slot is not available" });
      }

      // Calculate end time based on service duration
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = startMinutes + selectedService.durationMinutes;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

      // Create appointment
      const appointment = await storage.createAppointment({
        clientId,
        serviceId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || "",
        appointmentDate,
        startTime,
        endTime,
        notes: notes || "",
        status: "PENDING",
        totalPrice: selectedService.price
      });
      
      // Also create a lead
      await storage.createLead({
        clientId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "",
        source: "website",
        status: "CONVERTED",
        estimatedValue: selectedService.price,
        convertedToAppointment: true,
        appointmentId: appointment.id,
        interestedServices: [serviceId]
      });
      
      // Send confirmation email      
      if (client && selectedService) {
        const confirmationEmailSent = await sendEmail({
          to: customerEmail,
          from: 'appointments@scheduledpros.com',
          subject: `Appointment Confirmation - ${client.businessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; text-align: center;">Appointment Confirmation</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Hi ${customerName},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Your appointment with <strong>${client.businessName}</strong> has been booked successfully!
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
                <p><strong>Service:</strong> ${selectedService.name}</p>
                <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                <p><strong>Duration:</strong> ${selectedService.durationMinutes} minutes</p>
                <p><strong>Price:</strong> $${selectedService.price}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                <strong>Status:</strong> Your appointment is currently pending approval. You will receive another email once it's confirmed.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                If you need to make any changes or cancel your appointment, please contact us directly.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; text-align: center;">
                Thank you for choosing ${client.businessName}!<br>
                ${client.phone ? `Phone: ${client.phone}` : ''}<br>
                Email: ${client.email}
              </p>
            </div>
          `,
          text: `
Hi ${customerName},

Your appointment with ${client.businessName} has been booked successfully!

Appointment Details:
- Service: ${selectedService.name}
- Date: ${new Date(appointmentDate).toLocaleDateString()}
- Time: ${startTime} - ${endTime}
- Duration: ${selectedService.durationMinutes} minutes
- Price: $${selectedService.price}
${notes ? `- Notes: ${notes}` : ''}

Status: Your appointment is currently pending approval. You will receive another email once it's confirmed.

If you need to make any changes or cancel your appointment, please contact us directly.

Thank you for choosing ${client.businessName}!
${client.phone ? `Phone: ${client.phone}` : ''}
Email: ${client.email}
          `
        });
        
        console.log(`Email confirmation sent: ${confirmationEmailSent ? 'Success' : 'Failed'}`);
      }

      res.json({ 
        message: "Appointment booked successfully",
        appointment 
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ error: "Failed to book appointment" });
    }
  });

  // =============================================================================
  // Domain Configuration Management
  // =============================================================================

  // Get domain configurations for a client
  app.get("/api/clients/:clientId/domains", requirePermission("domains.view"), async (req, res) => {
    try {
      const { clientId } = req.params;
      const domains = await storage.getDomainConfigurations(clientId);
      res.json(domains);
    } catch (error) {
      console.error("Error fetching domain configurations:", error);
      res.status(500).json({ error: "Failed to fetch domain configurations" });
    }
  });

  // Get a specific domain configuration
  app.get("/api/domains/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const domain = await storage.getDomainConfiguration(id);
      if (!domain) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }
      res.json(domain);
    } catch (error) {
      console.error("Error fetching domain configuration:", error);
      res.status(500).json({ error: "Failed to fetch domain configuration" });
    }
  });

  // Create domain configuration
  app.post("/api/clients/:clientId/domains", requirePermission("domains.create"), async (req, res) => {
    try {
      const { clientId } = req.params;
      
      // Enhanced domain validation
      let validatedData;
      try {
        validatedData = enhancedDomainConfigurationSchema.parse(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          error: "Domain validation failed", 
          details: validationError.errors || validationError.message 
        });
      }

      // Comprehensive uniqueness validation
      const normalizedDomain = validateDomain(validatedData.domain);
      
      // Check if exact domain already exists
      const existingDomain = await storage.getDomainConfigurationByDomain(normalizedDomain);
      if (existingDomain) {
        return res.status(400).json({ 
          error: "Domain already configured",
          domain: normalizedDomain
        });
      }

      // Check for similar domains (with/without www)
      const wwwDomain = `www.${normalizedDomain}`;
      const nonWwwDomain = normalizedDomain.replace(/^www\./, '');
      
      if (normalizedDomain !== wwwDomain) {
        const wwwExists = await storage.getDomainConfigurationByDomain(wwwDomain);
        if (wwwExists) {
          return res.status(400).json({ 
            error: "Domain conflict: www variant already configured",
            conflicting_domain: wwwDomain
          });
        }
      }
      
      if (normalizedDomain !== nonWwwDomain) {
        const nonWwwExists = await storage.getDomainConfigurationByDomain(nonWwwDomain);
        if (nonWwwExists) {
          return res.status(400).json({ 
            error: "Domain conflict: non-www variant already configured",
            conflicting_domain: nonWwwDomain
          });
        }
      }

      // Create domain configuration with validated data
      const domainData = {
        ...validatedData,
        clientId,
        domain: normalizedDomain
      };

      const domain = await storage.createDomainConfiguration(domainData);
      res.json(domain);
    } catch (error) {
      console.error("Error creating domain configuration:", error);
      
      if (error instanceof DomainValidationError) {
        return res.status(400).json({ 
          error: error.message,
          code: error.code
        });
      }
      
      res.status(500).json({ error: "Failed to create domain configuration" });
    }
  });

  // Update domain configuration
  app.put("/api/domains/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // First get the domain to ensure it exists and get clientId for permission check
      const existingDomain = await storage.getDomainConfiguration(id);
      if (!existingDomain) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }

      // Check permissions manually by creating a modified request
      const permissionCheck = await requirePermission("domains.edit")(
        { ...req, params: { ...req.params, clientId: existingDomain.clientId } }, 
        res, 
        () => {}
      );

      if (res.headersSent) {
        return; // Permission check failed and response was sent
      }

      // Validate update data with enhanced validation
      let validatedUpdates;
      try {
        validatedUpdates = enhancedDomainConfigurationSchema.partial().parse(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          error: "Domain validation failed", 
          details: validationError.errors || validationError.message 
        });
      }

      // If domain is being updated, validate uniqueness
      if (validatedUpdates.domain && validatedUpdates.domain !== existingDomain.domain) {
        const normalizedDomain = validateDomain(validatedUpdates.domain);
        const domainExists = await storage.getDomainConfigurationByDomain(normalizedDomain);
        
        if (domainExists && domainExists.id !== id) {
          return res.status(400).json({ 
            error: "Domain already configured by another configuration",
            domain: normalizedDomain
          });
        }
        
        validatedUpdates.domain = normalizedDomain;
      }

      const domain = await storage.updateDomainConfiguration(id, validatedUpdates);
      res.json(domain);
    } catch (error) {
      console.error("Error updating domain configuration:", error);
      
      if (error instanceof DomainValidationError) {
        return res.status(400).json({ 
          error: error.message,
          code: error.code
        });
      }
      
      res.status(500).json({ error: "Failed to update domain configuration" });
    }
  });

  // Delete domain configuration
  app.delete("/api/domains/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // First get the domain to ensure it exists and get clientId for permission check
      const existingDomain = await storage.getDomainConfiguration(id);
      if (!existingDomain) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }

      // Check permissions manually by creating a modified request
      const permissionCheck = await requirePermission("domains.delete")(
        { ...req, params: { ...req.params, clientId: existingDomain.clientId } }, 
        res, 
        () => {}
      );

      if (res.headersSent) {
        return; // Permission check failed and response was sent
      }

      await storage.deleteDomainConfiguration(id);
      res.json({ message: "Domain configuration deleted successfully" });
    } catch (error) {
      console.error("Error deleting domain configuration:", error);
      
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }
      
      res.status(500).json({ error: "Failed to delete domain configuration" });
    }
  });

  // Verify domain
  app.post("/api/domains/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      
      // First get the domain to ensure it exists and get clientId for permission check
      const existingDomain = await storage.getDomainConfiguration(id);
      if (!existingDomain) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }

      // Check permissions manually by creating a modified request
      const permissionCheck = await requirePermission("domains.edit")(
        { ...req, params: { ...req.params, clientId: existingDomain.clientId } }, 
        res, 
        () => {}
      );

      if (res.headersSent) {
        return; // Permission check failed and response was sent
      }

      const domain = await storage.verifyDomain(id);
      res.json(domain);
    } catch (error) {
      console.error("Error verifying domain:", error);
      
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }
      
      if (error instanceof Error && error.message.includes("verification")) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: "Failed to verify domain" });
    }
  });

  // Get domain verification logs
  app.get("/api/domains/:id/logs", async (req, res) => {
    try {
      const { id } = req.params;
      
      // First get the domain to ensure it exists and get clientId for permission check
      const existingDomain = await storage.getDomainConfiguration(id);
      if (!existingDomain) {
        return res.status(404).json({ error: "Domain configuration not found" });
      }

      // Check permissions manually by creating a modified request
      const permissionCheck = await requirePermission("domains.view")(
        { ...req, params: { ...req.params, clientId: existingDomain.clientId } }, 
        res, 
        () => {}
      );

      if (res.headersSent) {
        return; // Permission check failed and response was sent
      }

      const logs = await storage.getDomainVerificationLogs(id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching domain verification logs:", error);
      res.status(500).json({ error: "Failed to fetch domain verification logs" });
    }
  });

  // =============================================================================
  // LEGACY ROUTES (keeping for demo)
  // =============================================================================

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create review
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  const server = createServer(app);
  return server;
}