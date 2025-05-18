import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  insertReviewSchema, 
  insertContactMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
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
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Check if the provided date is valid (not in the past and during business hours)
      const appointmentDate = new Date(validatedData.date);
      const now = new Date();
      
      if (appointmentDate < now) {
        return res.status(400).json({ message: "Cannot book appointments in the past" });
      }
      
      const hours = appointmentDate.getHours();
      if (hours < 9 || hours >= 19) {
        return res.status(400).json({ message: "Appointments are only available between 9 AM and 7 PM" });
      }
      
      // Check if the time slot is already booked
      const existingAppointments = await storage.getAppointmentsByDate(appointmentDate);
      const isTimeSlotTaken = existingAppointments.some(apt => {
        const existingTime = new Date(apt.date);
        return existingTime.getHours() === appointmentDate.getHours() && 
               existingTime.getMinutes() === appointmentDate.getMinutes() &&
               apt.stylistId === validatedData.stylistId;
      });
      
      if (isTimeSlotTaken) {
        return res.status(400).json({ message: "This time slot is already booked" });
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
      
      if (!dateParam) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
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

  const httpServer = createServer(app);

  return httpServer;
}
