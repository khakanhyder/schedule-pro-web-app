import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  stylists, type Stylist, type InsertStylist,
  appointments, type Appointment, type InsertAppointment,
  reviews, type Review, type InsertReview,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Stylists
  getStylists(): Promise<Stylist[]>;
  getStylist(id: number): Promise<Stylist | undefined>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private stylists: Map<number, Stylist>;
  private appointments: Map<number, Appointment>;
  private reviews: Map<number, Review>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userCurrentId: number;
  private serviceCurrentId: number;
  private stylistCurrentId: number;
  private appointmentCurrentId: number;
  private reviewCurrentId: number;
  private contactMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.stylists = new Map();
    this.appointments = new Map();
    this.reviews = new Map();
    this.contactMessages = new Map();
    
    this.userCurrentId = 1;
    this.serviceCurrentId = 1;
    this.stylistCurrentId = 1;
    this.appointmentCurrentId = 1;
    this.reviewCurrentId = 1;
    this.contactMessageCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeServices();
    this.initializeStylists();
    this.initializeReviews();
  }

  private initializeServices() {
    const sampleServices: InsertService[] = [
      {
        name: "Women's Haircut",
        description: "Full service haircut including consultation, shampoo, and style.",
        price: "$65",
        durationMinutes: 45
      },
      {
        name: "Men's Haircut",
        description: "Precision cut with clipper or scissor work.",
        price: "$45",
        durationMinutes: 30
      },
      {
        name: "Color & Highlights",
        description: "Full or partial highlights, balayage, or single-process color.",
        price: "$120+",
        durationMinutes: 120
      },
      {
        name: "Blowout & Style",
        description: "Professional blow dry and styling for any occasion.",
        price: "$45",
        durationMinutes: 30
      },
      {
        name: "Hair Treatments",
        description: "Deep conditioning, keratin treatments, and hair masks.",
        price: "$85+",
        durationMinutes: 60
      },
      {
        name: "Special Occasion",
        description: "Updos, formal styling, and wedding hair services.",
        price: "$85+",
        durationMinutes: 60
      }
    ];

    sampleServices.forEach(service => this.createService(service));
  }

  private initializeStylists() {
    const sampleStylists: InsertStylist[] = [
      {
        name: "Sarah Johnson",
        bio: "Master stylist with 10+ years of experience specializing in color and cuts.",
        imageUrl: ""
      },
      {
        name: "Michael Chen",
        bio: "Precision cutting specialist with training from Vidal Sassoon.",
        imageUrl: ""
      },
      {
        name: "Jessica Rodriguez",
        bio: "Color expert specializing in balayage and creative coloring techniques.",
        imageUrl: ""
      }
    ];

    sampleStylists.forEach(stylist => this.createStylist(stylist));
  }

  private initializeReviews() {
    const sampleReviews: InsertReview[] = [
      {
        name: "Jennifer K.",
        email: "jennifer@example.com",
        rating: 5,
        text: "Sarah is amazing! She listened to exactly what I wanted and delivered the perfect cut and color. The salon is beautiful and so relaxing. Highly recommend!",
        publishConsent: true,
      },
      {
        name: "Robert T.",
        email: "robert@example.com",
        rating: 4,
        text: "Fantastic experience from start to finish. Michael gave me the best men's cut I've had in years. The online booking system was so convenient, and I appreciated the text reminders.",
        publishConsent: true,
      },
      {
        name: "Amanda L.",
        email: "amanda@example.com",
        rating: 5,
        text: "Jessica did an amazing job with my highlights! The salon is clean and modern, and everyone was so friendly. I've already booked my next appointment.",
        publishConsent: true,
      }
    ];

    sampleReviews.forEach(review => {
      const savedReview = this.createReview(review);
      // Mark these initial reviews as published
      const publishedReview = {...savedReview, published: true};
      this.reviews.set(savedReview.id, publishedReview);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Services
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
  
  // Stylists
  async getStylists(): Promise<Stylist[]> {
    return Array.from(this.stylists.values());
  }
  
  async getStylist(id: number): Promise<Stylist | undefined> {
    return this.stylists.get(id);
  }
  
  async createStylist(insertStylist: InsertStylist): Promise<Stylist> {
    const id = this.stylistCurrentId++;
    const stylist: Stylist = { ...insertStylist, id };
    this.stylists.set(id, stylist);
    return stylist;
  }
  
  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return Array.from(this.appointments.values()).filter(
      appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      }
    );
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      confirmed: true 
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  // Reviews
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getPublishedReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.published);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      date: new Date(),
      published: false
    };
    this.reviews.set(id, review);
    return review;
  }
  
  // Contact Messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      date: new Date(),
      read: false
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
