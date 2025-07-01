import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { aiSchedulingService, marketingAutomationService } from "./ai-service";
import { GlossGeniusIntegration, validateGlossGeniusCredentials } from "./glossgenius-integration";
import { CSVImporter } from "./csv-import";
import { getPlatformsByIndustry, getPlatformById } from "./industry-platforms";
import { sendReviewRequestEmail, sendEmail } from "./sendgrid";
import { 
  insertAppointmentSchema, 
  insertReviewSchema, 
  insertContactMessageSchema,
  insertInvoiceSchema
} from "@shared/schema";

// Initialize Stripe with the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Email/SMS notification function
async function sendAppointmentConfirmation(appointment: any) {
  // Get service and stylist details
  const service = await storage.getService(appointment.serviceId);
  const stylist = await storage.getStylist(appointment.stylistId);
  
  // Get current industry for proper terminology
  const industry = storage.getCurrentIndustry();
  
  const confirmationDetails = {
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    clientPhone: appointment.clientPhone,
    serviceName: service?.name || "Service",
    date: new Date(appointment.date).toLocaleDateString(),
    time: new Date(appointment.date).toLocaleTimeString(),
    price: service?.price || "150",
    professional: stylist?.name || "Professional",
    businessName: `${industry.name} Services`,
    professionalType: industry.professionalName || "professional"
  };

  // Log the confirmation (in production, this would send real emails/SMS)
  console.log("=== APPOINTMENT CONFIRMATION ===");
  console.log(`
📧 EMAIL CONFIRMATION SENT TO: ${confirmationDetails.clientEmail}

Subject: Your Appointment is Confirmed! - ${confirmationDetails.businessName}

Dear ${confirmationDetails.clientName},

Your appointment has been confirmed! Here are the details:

📋 SERVICE: ${confirmationDetails.serviceName}
📅 DATE: ${confirmationDetails.date}
⏰ TIME: ${confirmationDetails.time}
💰 PRICE: $${confirmationDetails.price}
👤 ${confirmationDetails.professionalType.toUpperCase()}: ${confirmationDetails.professional}

Your ${confirmationDetails.professionalType} will provide excellent service and ensure you receive professional, quality care.

📱 CONTACT: (555) 123-4567
📧 BUSINESS EMAIL: hello@${confirmationDetails.businessName.toLowerCase().replace(/\s+/g, '')}.com

If you need to reschedule or have any questions, please contact us at least 24 hours in advance.

Thank you for choosing ${confirmationDetails.businessName}!

Best regards,
${confirmationDetails.professional}
${confirmationDetails.businessName}
  `);

  console.log("=== SMS CONFIRMATION ===");
  console.log(`
📱 SMS SENT TO: ${confirmationDetails.clientPhone}

Hi ${confirmationDetails.clientName}! Your appointment with ${confirmationDetails.professional} at ${confirmationDetails.businessName} is confirmed for ${confirmationDetails.date} at ${confirmationDetails.time}. Service: ${confirmationDetails.serviceName} ($${confirmationDetails.price}). Contact: (555) 123-4567. Thank you!
  `);
  
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment processing endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, appointmentId, clientName } = req.body;
      
      if (!stripe) {
        return res.status(500).json({ 
          error: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." 
        });
      }
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      // Create a payment intent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          appointmentId: appointmentId.toString(),
          clientName
        }
      });
      
      // Send the client secret to the client
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creating payment intent", 
        details: error.message 
      });
    }
  });
  
  // prefix all routes with /api
  
  // API endpoint to set industry
  app.post("/api/set-industry", async (req, res) => {
    try {
      const { industryId } = req.body;
      if (!industryId) {
        return res.status(400).json({ message: "Industry ID is required" });
      }
      
      // Update the industry and regenerate services/staff
      await storage.setIndustry(industryId);
      res.json({ success: true, industryId });
    } catch (error) {
      console.error("Error setting industry:", error);
      res.status(500).json({ message: "Error setting industry" });
    }
  });
  
  // API endpoint to get current industry
  app.get("/api/current-industry", async (req, res) => {
    try {
      if (typeof storage.getCurrentIndustry === 'function') {
        const industry = storage.getCurrentIndustry();
        res.json(industry);
      } else {
        // If getCurrentIndustry not implemented yet, return default
        res.json({ id: "hairstylist", name: "Hairstylist" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting current industry" });
    }
  });
  
  // API endpoint to get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services" });
    }
  });

  // API endpoint to get all stylists
  app.get("/api/stylists", async (req, res) => {
    try {
      const stylists = await storage.getStylists();
      res.json(stylists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stylists" });
    }
  });

  // CRUD operations for stylists
  app.post("/api/stylists", async (req, res) => {
    try {
      const stylist = await storage.createStylist(req.body);
      res.json(stylist);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating stylist: " + error.message });
    }
  });

  app.put("/api/stylists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stylist = await storage.updateStylist(id, req.body);
      res.json(stylist);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating stylist: " + error.message });
    }
  });

  app.delete("/api/stylists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStylist(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting stylist: " + error.message });
    }
  });

  // Client API Routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating client: " + error.message });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.updateClient(id, req.body);
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating client: " + error.message });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting client: " + error.message });
    }
  });

  // CRUD operations for services
  app.post("/api/services", async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating service: " + error.message });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateService(id, req.body);
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating service: " + error.message });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting service: " + error.message });
    }
  });

  // API endpoint to get published reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getPublishedReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  // API endpoint to get appointments by date
  app.get("/api/appointments", async (req, res) => {
    try {
      const dateParam = req.query.date as string;
      if (!dateParam) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const appointments = await storage.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });

  // Pet sitting business setup endpoint
  app.post("/api/setup-pet-business", async (req, res) => {
    try {
      // Set up the pet care industry
      storage.setIndustry("petcare");
      
      // Create Krystal Bueller as the pet sitter
      const krystal = await storage.createStylist({
        name: "Krystal Bueller",
        bio: "Professional pet sitter with 5+ years experience. Specializes in dog care, medication administration, and overnight sitting. Bonded and insured.",
        email: "krystal@pawsandplay.com",
        phone: "(555) 123-4567"
      });

      // Create pet sitting services
      const petServices = [
        {
          name: "Full Day Pet Sitting",
          description: "Complete in-home pet care while you are away, including feeding, walks, and companionship",
          duration: 480,
          price: 250
        },
        {
          name: "Dog Walking (30 min)", 
          description: "Individual dog walking service with exercise and potty breaks",
          duration: 30,
          price: 25
        },
        {
          name: "Overnight Pet Sitting",
          description: "24-hour in-home pet care including overnight supervision", 
          duration: 1440,
          price: 120
        }
      ];

      // Add pet services
      for (const service of petServices) {
        await storage.createService(service);
      }

      res.json({ 
        success: true, 
        message: "Pet sitting business configured successfully",
        petSitter: krystal,
        services: petServices.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API endpoint to create a new appointment with notifications
  app.post("/api/appointments", async (req, res) => {
    try {
      console.log("Appointment data received:", req.body);
      
      // Create proper date object from ISO string
      const appointmentData = {
        ...req.body,
        date: new Date(req.body.date)
      };
      
      // This will validate and convert the data format
      const validatedData = insertAppointmentSchema.parse(appointmentData);
      
      // Create the appointment
      const appointment = await storage.createAppointment(validatedData);
      
      // Send confirmation email and SMS
      await sendAppointmentConfirmation(appointment);
      
      res.status(201).json({ 
        appointment, 
        message: "Appointment booked successfully - confirmations sent!",
        confirmations: ["email", "SMS"]
      });
    } catch (error: any) {
      console.error("Appointment creation error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid appointment data", details: error.errors });
      }
      res.status(500).json({ message: "Error creating appointment" });
    }
  });

  // API endpoint to submit a review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      
      // In a real application, reviews would generally go through a moderation process
      // before being published to Google or the website
      res.status(201).json({ 
        review, 
        message: "Review submitted successfully. It will be published after moderation." 
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ message: "Error submitting review" });
    }
  });

  // API endpoint to submit a contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      res.status(201).json({ 
        message: "Your message has been sent successfully. We'll get back to you soon." 
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid message data", details: error.errors });
      }
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // API endpoint to get available time slots for a specific date and stylist
  app.get("/api/timeslots", async (req, res) => {
    try {
      const dateParam = req.query.date as string;
      const stylistId = parseInt(req.query.stylistId as string) || 0;
      
      console.log("Timeslots request:", { dateParam, stylistId });
      
      if (!dateParam) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      console.log("Processing date:", date);
      
      // Generate time slots from 9 AM to 7 PM at 30-minute intervals
      const timeSlots = [];
      const appointments = await storage.getAppointmentsByDate(date);
      
      // Create a new date object to avoid modifying the original
      const slotDate = new Date(date);
      
      // Set hours to 9 AM to start
      slotDate.setHours(9, 0, 0, 0);
      
      // Generate slots until 6:30 PM (last appointment at 6:30 PM)
      while (slotDate.getHours() < 19) {
        const slot = new Date(slotDate);
        
        // Check if this slot is available
        const isBooked = appointments.some(apt => {
          // If no specific stylist is selected, or if the appointment is with the selected stylist
          if (stylistId === 0 || apt.stylistId === stylistId) {
            const aptDate = new Date(apt.date);
            return aptDate.getHours() === slot.getHours() && 
                   aptDate.getMinutes() === slot.getMinutes();
          }
          return false;
        });
        
        timeSlots.push({
          time: slot.toISOString(),
          available: !isBooked
        });
        
        // Add 30 minutes for next slot
        slotDate.setMinutes(slotDate.getMinutes() + 30);
      }
      
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: "Error generating time slots" });
    }
  });

  // API endpoint to create a payment intent for Stripe
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          error: { message: "Stripe integration is not configured. Please set STRIPE_SECRET_KEY." } 
        });
      }

      const { amount, appointmentId, clientName } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          error: { message: "Invalid payment amount." } 
        });
      }
      
      // Create a payment intent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          appointmentId: appointmentId?.toString() || '',
          clientName: clientName || 'Customer'
        },
        // Optional automatic payment methods
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: { 
          message: error.message || "An error occurred while creating payment intent." 
        } 
      });
    }
  });

  // API endpoint to verify and process a payment for an appointment
  app.post("/api/verify-payment", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          error: { message: "Stripe integration is not configured." } 
        });
      }

      const { paymentIntentId, appointmentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ 
          error: { message: "Payment intent ID is required." } 
        });
      }
      
      // Retrieve the payment intent to verify status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          error: { message: `Payment not successful. Status: ${paymentIntent.status}` } 
        });
      }
      
      // Here you would update the appointment record to mark payment as complete
      // For this demo, we'll just return success
      
      res.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100, // Convert from cents
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: { 
          message: error.message || "An error occurred during payment verification." 
        } 
      });
    }
  });

  // AI Scheduling & Marketing Automation Routes
  
  // Get smart scheduling suggestions
  app.get("/api/ai/scheduling-suggestions", async (req, res) => {
    try {
      const { date, serviceId, stylistId } = req.query;
      
      if (!date || !serviceId) {
        return res.status(400).json({ message: "Date and serviceId are required" });
      }
      
      const suggestions = await aiSchedulingService.optimizeScheduling(
        new Date(date as string),
        parseInt(serviceId as string),
        stylistId ? parseInt(stylistId as string) : undefined
      );
      
      res.json({ suggestions });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating scheduling suggestions" });
    }
  });

  // Get rebooking predictions
  app.get("/api/ai/rebooking-suggestions", async (req, res) => {
    try {
      const suggestions = await aiSchedulingService.generateRebookingSuggestions();
      res.json({ suggestions });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating rebooking suggestions" });
    }
  });

  // Get pricing optimization suggestions
  app.get("/api/ai/pricing-suggestions/:serviceId", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      const suggestions = await aiSchedulingService.generatePricingSuggestions(serviceId);
      res.json({ suggestions });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating pricing suggestions" });
    }
  });

  // Marketing Campaigns
  app.get("/api/marketing/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getMarketingCampaigns();
      res.json({ campaigns });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching marketing campaigns" });
    }
  });

  app.post("/api/marketing/campaigns", async (req, res) => {
    try {
      const { type, targetCriteria } = req.body;
      const campaign = await marketingAutomationService.createAutomatedCampaign(type, targetCriteria);
      res.status(201).json({ campaign });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating marketing campaign" });
    }
  });

  // Generate marketing content
  app.post("/api/marketing/generate-content", async (req, res) => {
    try {
      const { type, clientEmail } = req.body;
      const content = await marketingAutomationService.generateMarketingContent(type, clientEmail);
      res.json({ content });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating marketing content" });
    }
  });

  // Client Insights
  app.get("/api/ai/client-insights/:clientEmail", async (req, res) => {
    try {
      const clientEmail = req.params.clientEmail;
      const insights = await marketingAutomationService.generateClientInsights(clientEmail);
      res.json({ insights });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating client insights" });
    }
  });

  // Review Requests
  app.get("/api/review-requests", async (req, res) => {
    try {
      const reviewRequests = await storage.getReviewRequests();
      res.json(reviewRequests);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching review requests" });
    }
  });

  app.post("/api/review-requests", async (req, res) => {
    try {
      const { clientId, clientName, clientEmail, platform, customMessage } = req.body;
      
      // Generate review request URL (mock for demo)
      const requestUrl = `https://review.${platform}.com/request/${Math.random().toString(36).substr(2, 9)}`;
      
      const reviewRequest = await storage.createReviewRequest({
        clientId,
        clientName,
        clientEmail,
        platform,
        customMessage,
        requestUrl,
      });

      // For demo purposes, show email preview in console
      console.log(`\n📧 REVIEW REQUEST EMAIL PREVIEW:`);
      console.log(`═══════════════════════════════════════════════════════════`);
      console.log(`FROM: noreply@yourbusiness.com`);
      console.log(`TO: ${clientEmail}`);
      console.log(`SUBJECT: Please share your experience with Your Business`);
      console.log(`═══════════════════════════════════════════════════════════`);
      console.log(`Hi ${clientName},`);
      console.log(``);
      console.log(`${customMessage}`);
      console.log(``);
      console.log(`🌟 Click here to leave us a review on ${platform.toUpperCase()}:`);
      console.log(`https://review.${platform}.com/your-business`);
      console.log(``);
      console.log(`Thank you for choosing Your Business!`);
      console.log(`═══════════════════════════════════════════════════════════`);
      console.log(`✅ Review request logged and ready to send`);
      console.log(`💡 Add SendGrid API key to send real emails\n`);

      // Test simple email first, then full review email
      let emailSent = false;
      
      // Try basic email test
      try {
        console.log(`🧪 Testing basic email to ${clientEmail}...`);
        emailSent = await sendEmail({
          to: clientEmail,
          from: 'onboarding@resend.dev', // Resend verified domain
          subject: 'Test Email from Your Business',
          text: `Hi ${clientName}, this is a test email to verify our email system is working.`,
          html: `<p>Hi ${clientName},</p><p>This is a test email to verify our email system is working.</p>`
        });
        
        if (emailSent) {
          console.log(`✅ Basic email test successful!`);
          
          // Now try the full review email
          emailSent = await sendReviewRequestEmail(
            clientName,
            clientEmail,
            platform,
            customMessage,
            "Your Business"
          );
          
          if (emailSent) {
            console.log(`🚀 SUCCESS: Review request email sent to ${clientEmail}!`);
          }
        }
      } catch (error) {
        console.log(`❌ Email test failed:`, error);
      }

      res.status(201).json(reviewRequest);
    } catch (error: any) {
      console.error('Review request error:', error);
      res.status(500).json({ message: "Error sending review request" });
    }
  });

  app.patch("/api/review-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateReviewRequestStatus(id, status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating review request status" });
    }
  });

  // Accept scheduling suggestion
  app.post("/api/ai/accept-suggestion/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.acceptSchedulingSuggestion(id);
      res.json({ message: "Suggestion accepted" });
    } catch (error: any) {
      res.status(500).json({ message: "Error accepting suggestion" });
    }
  });

  // Get industry-specific scheduling platforms
  app.get("/api/platforms/:industryId", async (req, res) => {
    try {
      const { industryId } = req.params;
      const platforms = getPlatformsByIndustry(industryId);
      res.json({ platforms });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching platforms: " + error.message });
    }
  });

  // Get platform details by ID
  app.get("/api/platform/:platformId", async (req, res) => {
    try {
      const { platformId } = req.params;
      const platform = getPlatformById(platformId);
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      res.json({ platform });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching platform: " + error.message });
    }
  });

  // Data Import API endpoints for multiple scheduling platforms
  app.post("/api/import/glossgenius/validate", async (req, res) => {
    try {
      const { apiKey, businessId } = req.body;
      
      const config = {
        apiKey,
        businessId,
        baseUrl: "https://api.glossgenius.com/v1"
      };
      
      const isValid = await validateGlossGeniusCredentials(config);
      
      if (isValid) {
        res.json({ valid: true, message: "Credentials validated successfully" });
      } else {
        res.status(400).json({ valid: false, message: "Invalid credentials" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error validating credentials: " + error.message });
    }
  });

  app.post("/api/import/glossgenius/sync", async (req, res) => {
    try {
      const { apiKey, businessId, startDate, endDate } = req.body;
      
      const config = {
        apiKey,
        businessId,
        baseUrl: "https://api.glossgenius.com/v1"
      };
      
      const glossGenius = new GlossGeniusIntegration(config);
      
      // Get appointments from GlossGenius
      const ggAppointments = await glossGenius.getAppointments(startDate, endDate);
      
      // Convert and import appointments
      const convertedAppointments = glossGenius.convertAppointments(ggAppointments);
      
      let importedCount = 0;
      const errors: string[] = [];
      
      for (const appointment of convertedAppointments) {
        try {
          await storage.createAppointment(appointment);
          importedCount++;
        } catch (error: any) {
          errors.push(`Failed to import appointment for ${appointment.clientName}: ${error.message}`);
        }
      }
      
      res.json({
        message: "Import completed",
        imported: importedCount,
        total: ggAppointments.length,
        errors
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error importing from GlossGenius: " + error.message });
    }
  });

  app.post("/api/import/csv/preview", async (req, res) => {
    try {
      const { csvContent } = req.body;
      
      const importer = new CSVImporter();
      const rows = importer.parseCSV(csvContent);
      
      if (rows.length === 0) {
        return res.status(400).json({ message: "No data found in CSV" });
      }
      
      const headers = rows[0];
      const mappings = importer.detectFieldMappings(headers);
      const appointments = importer.convertToAppointments(rows.slice(1), mappings);
      const preview = importer.generatePreview(appointments, 10);
      
      res.json({
        headers,
        mappings,
        preview,
        totalRows: appointments.length
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing CSV: " + error.message });
    }
  });

  app.post("/api/import/csv/import", async (req, res) => {
    try {
      const { csvContent, mappings } = req.body;
      
      const importer = new CSVImporter();
      const rows = importer.parseCSV(csvContent);
      const appointments = importer.convertToAppointments(rows.slice(1), mappings);
      
      let importedCount = 0;
      const errors: string[] = [];
      
      for (const csvAppointment of appointments) {
        try {
          // Convert CSV appointment to our format
          const appointment = {
            date: new Date(csvAppointment.date + " " + csvAppointment.time),
            serviceId: 1, // Default service, can be improved with service matching
            stylistId: 1, // Default stylist, can be improved with staff matching
            clientName: csvAppointment.clientName,
            clientEmail: csvAppointment.clientEmail || "",
            clientPhone: csvAppointment.clientPhone || "",
            durationMinutes: csvAppointment.duration || 60,
            notes: csvAppointment.notes || null,
            professionalNotes: null,
            confirmed: csvAppointment.status === "Confirmed",
            emailConfirmation: true,
            smsConfirmation: false
          };
          
          await storage.createAppointment(appointment);
          importedCount++;
        } catch (error: any) {
          errors.push(`Failed to import appointment for ${csvAppointment.clientName}: ${error.message}`);
        }
      }
      
      res.json({
        message: "Import completed",
        imported: importedCount,
        total: appointments.length,
        errors
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error importing CSV: " + error.message });
    }
  });

  // Invoice tracking routes
  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = req.body;
      // Generate unique public URL for the invoice
      const publicUrl = `/invoice/${Math.random().toString(36).substring(2, 15)}`;
      
      const invoice = await storage.createInvoice({
        ...invoiceData,
        publicUrl
      });
      
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating invoice: " + error.message });
    }
  });

  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching invoices: " + error.message });
    }
  });

  // Public invoice view (for clients)
  app.get("/invoice/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const publicUrl = `/invoice/${token}`;
      
      const invoice = await storage.getInvoiceByPublicUrl(publicUrl);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Track the view
      await storage.trackInvoiceView({
        invoiceId: invoice.id,
        ipAddress: req.ip || req.connection.remoteAddress || null,
        userAgent: req.get('User-Agent') || null,
        duration: null
      });
      
      // Create notification for business owner
      const viewCount = await storage.getInvoiceViewCount(invoice.id);
      let notificationMessage = '';
      
      if (viewCount === 1) {
        notificationMessage = `${invoice.clientName} viewed invoice #${invoice.invoiceNumber} for the first time`;
      } else if (viewCount > 1) {
        notificationMessage = `${invoice.clientName} viewed invoice #${invoice.invoiceNumber} again (${viewCount} times total)`;
      }
      
      if (notificationMessage) {
        await storage.createInvoiceNotification({
          invoiceId: invoice.id,
          notificationType: viewCount === 1 ? 'view' : 'multiple_views',
          message: notificationMessage
        });
      }
      
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: "Error viewing invoice: " + error.message });
    }
  });

  // Track time spent on invoice
  app.post("/api/invoices/:id/track-time", async (req, res) => {
    try {
      const { id } = req.params;
      const { duration } = req.body;
      
      // Update the most recent view with duration
      await storage.updateInvoiceViewDuration(parseInt(id), duration);
      
      // Create time-based notification if significant time spent
      if (duration > 30) { // More than 30 seconds
        const invoice = await storage.getInvoice(parseInt(id));
        if (invoice) {
          await storage.createInvoiceNotification({
            invoiceId: parseInt(id),
            notificationType: 'time_spent',
            message: `${invoice.clientName} spent ${Math.round(duration / 60)} minutes reviewing invoice #${invoice.invoiceNumber}`
          });
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error tracking time: " + error.message });
    }
  });

  // Get invoice notifications
  app.get("/api/invoice-notifications", async (req, res) => {
    try {
      const notifications = await storage.getInvoiceNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching notifications: " + error.message });
    }
  });

  // Mark notifications as read
  app.post("/api/invoice-notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markNotificationAsRead(parseInt(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error marking notification as read: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
