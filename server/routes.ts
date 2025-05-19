import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  insertReviewSchema, 
  insertContactMessageSchema 
} from "@shared/schema";

// Initialize Stripe with the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

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
      
      // Store the industry ID in storage for future API calls
      if (typeof storage.setIndustry === 'function') {
        storage.setIndustry(industryId);
        res.json({ success: true, industryId });
      } else {
        // If setIndustry not implemented yet, tell the client
        res.status(501).json({ message: "Industry switching not fully implemented", industryId });
      }
    } catch (error) {
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

  // API endpoint to create a new appointment
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
      
      // Check if the provided date is valid (not in the past)
      const appointmentDate = new Date(validatedData.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Compare just the date part
      
      const appointmentDay = new Date(appointmentDate);
      appointmentDay.setHours(0, 0, 0, 0);
      
      if (appointmentDay < now) {
        return res.status(400).json({ message: "Cannot book appointments in the past" });
      }
      
      // Create the appointment
      const appointment = await storage.createAppointment(validatedData);
      
      // In a real application, this is where we would send confirmation emails/SMS
      // For this mock version, we'll simply return success
      const confirmations = [];
      if (validatedData.emailConfirmation) {
        confirmations.push("email");
      }
      if (validatedData.smsConfirmation) {
        confirmations.push("SMS");
      }
      
      res.status(201).json({ 
        appointment, 
        message: "Appointment booked successfully",
        confirmations: confirmations 
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

  const httpServer = createServer(app);

  return httpServer;
}
