import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import express from "express";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertPlanSchema,
  insertOnboardingSessionSchema,
  insertClientSchema,
  insertServiceSchema,
  insertReviewSchema
} from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// Initialize Stripe (if configured)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable JSON parsing
  app.use(express.json());

  // CORS headers for all routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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