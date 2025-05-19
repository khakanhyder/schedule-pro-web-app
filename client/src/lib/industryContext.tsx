import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the industry data structure
export interface Industry {
  id: string;
  name: string;
  description: string;
  services: string[];
  icon: string;
  primaryColor: string;
  accentColor: string;
  benefits: string[];
  features: string[];
  // Professional terms
  professionalName: string;  // e.g., "stylist", "carpenter", "technician"
  professionalPlural: string; // e.g., "stylists", "carpenters"
  clientName: string;         // e.g., "client", "customer", "patient"
  appointmentTerm: string;    // e.g., "appointment", "booking", "session", "job"
  serviceTerm: string;        // e.g., "service", "job", "treatment"
  // Image paths
  heroImage: string;
  galleryImages: string[];
}

// Default industry templates
export const industryTemplates: Industry[] = [
  {
    id: "hairstylist",
    name: "Hairstylist",
    description: "Elevate your salon business with a beautiful, client-focused scheduling system",
    services: ["Women's Haircut", "Men's Haircut", "Color Treatment", "Highlights", "Blowout"],
    icon: "✂️",
    primaryColor: "#9d5da2", // Lavender
    accentColor: "#7a3f7e",
    benefits: [
      "Track client style preferences and color formulas",
      "Send before & after photos to clients",
      "Automated appointment reminders & confirmations"
    ],
    features: ["Client history tracking", "Color formula records", "Service & retail inventory"],
    professionalName: "stylist",
    professionalPlural: "stylists",
    clientName: "client",
    appointmentTerm: "appointment",
    serviceTerm: "service",
    heroImage: "/images/salon-hero.jpg",
    galleryImages: [
      "/images/salon-1.jpg",
      "/images/salon-2.jpg",
      "/images/salon-3.jpg",
      "/images/salon-4.jpg"
    ]
  },
  {
    id: "carpenter",
    name: "Carpenter",
    description: "Streamline your woodworking business with project tracking and client management",
    services: ["Custom Furniture", "Kitchen Cabinets", "Deck Building", "Repairs", "Installations"],
    icon: "🔨",
    primaryColor: "#976535", // Rich wood
    accentColor: "#6a4624",
    benefits: [
      "Manage project timelines and material costs",
      "Send project photos and updates to clients",
      "Track your tools and materials inventory"
    ],
    features: ["Project estimates", "Materials calculator", "Visual project gallery"],
    professionalName: "carpenter",
    professionalPlural: "carpenters",
    clientName: "customer",
    appointmentTerm: "job",
    serviceTerm: "project",
    heroImage: "/images/carpentry-hero.jpg",
    galleryImages: [
      "/images/carpentry-1.jpg",
      "/images/carpentry-2.jpg",
      "/images/carpentry-3.jpg",
      "/images/carpentry-4.jpg"
    ]
  },
  {
    id: "massage",
    name: "Massage Therapist",
    description: "Create a peaceful booking experience that reflects your wellness practice",
    services: ["Deep Tissue", "Swedish Massage", "Hot Stone", "Sports Massage", "Reflexology"],
    icon: "💆",
    primaryColor: "#5e8b7e", // Sage
    accentColor: "#3e6d5e",
    benefits: [
      "Track client preferences and health notes",
      "Manage session packages and gift cards",
      "Schedule breaks between sessions for recovery"
    ],
    features: ["Client health records", "SOAP notes", "Wellness packages"],
    professionalName: "therapist",
    professionalPlural: "therapists",
    clientName: "client",
    appointmentTerm: "session",
    serviceTerm: "treatment",
    heroImage: "/images/massage-hero.jpg",
    galleryImages: [
      "/images/massage-1.jpg",
      "/images/massage-2.jpg",
      "/images/massage-3.jpg",
      "/images/massage-4.jpg"
    ]
  },
  {
    id: "nails",
    name: "Nail Technician",
    description: "Showcase your nail art and make booking a breeze for your clients",
    services: ["Manicure", "Pedicure", "Gel Polish", "Nail Art", "Acrylic Sets"],
    icon: "💅",
    primaryColor: "#c43c6e", // Rose
    accentColor: "#a12a56",
    benefits: [
      "Maintain a gallery of your nail designs",
      "Track popular styles and seasonal trends",
      "Schedule efficiently to maximize your day"
    ],
    features: ["Design gallery", "Product inventory", "Client favorites tracking"],
    professionalName: "technician",
    professionalPlural: "technicians",
    clientName: "client",
    appointmentTerm: "appointment",
    serviceTerm: "service",
    heroImage: "/images/nails-hero.jpg",
    galleryImages: [
      "/images/nails-1.jpg",
      "/images/nails-2.jpg",
      "/images/nails-3.jpg",
      "/images/nails-4.jpg"
    ]
  },
  {
    id: "plumber",
    name: "Plumber",
    description: "Organize service calls, track parts, and grow your plumbing business",
    services: ["Leak Repairs", "Installation", "Drain Cleaning", "Inspections", "Emergency Services"],
    icon: "🔧",
    primaryColor: "#3d6d9b", // Navy blue
    accentColor: "#2a5078",
    benefits: [
      "Schedule and dispatch technicians efficiently",
      "Track parts and estimate material costs",
      "Handle emergency calls with priority scheduling"
    ],
    features: ["Job estimates", "Parts inventory", "Emergency dispatch"],
    professionalName: "plumber",
    professionalPlural: "plumbers",
    clientName: "customer",
    appointmentTerm: "job",
    serviceTerm: "service",
    heroImage: "/images/plumbing-hero.jpg",
    galleryImages: [
      "/images/plumbing-1.jpg",
      "/images/plumbing-2.jpg",
      "/images/plumbing-3.jpg",
      "/images/plumbing-4.jpg"
    ]
  },
  {
    id: "electrician",
    name: "Electrician",
    description: "Power up your electrical business with smart scheduling and job tracking",
    services: ["Installations", "Repairs", "Inspections", "Upgrades", "Emergency Services"],
    icon: "⚡",
    primaryColor: "#ffc045", // Bright yellow
    accentColor: "#e0a012",
    benefits: [
      "Organize permits and inspection documents",
      "Schedule and prioritize emergency calls",
      "Track materials and labor for accurate billing"
    ],
    features: ["Permit tracking", "Job documentation", "Emergency scheduling"],
    professionalName: "electrician",
    professionalPlural: "electricians",
    clientName: "customer",
    appointmentTerm: "job",
    serviceTerm: "service",
    heroImage: "/images/electrical-hero.jpg",
    galleryImages: [
      "/images/electrical-1.jpg",
      "/images/electrical-2.jpg",
      "/images/electrical-3.jpg",
      "/images/electrical-4.jpg"
    ]
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Organize your content creation, sponsorships, and fan interactions",
    services: ["Content Creation", "Sponsored Posts", "Fan Meetups", "Coaching", "Merchandise"],
    icon: "📱",
    primaryColor: "#e74c3c", // Vibrant red
    accentColor: "#c0392b",
    benefits: [
      "Track content schedules and posting timelines",
      "Manage brand partnerships and sponsorships",
      "Organize fan interactions and events"
    ],
    features: ["Content calendar", "Sponsorship tracking", "Audience analytics"],
    professionalName: "influencer",
    professionalPlural: "influencers",
    clientName: "follower",
    appointmentTerm: "session",
    serviceTerm: "content",
    heroImage: "/images/influencer-hero.jpg",
    galleryImages: [
      "/images/influencer-1.jpg",
      "/images/influencer-2.jpg",
      "/images/influencer-3.jpg",
      "/images/influencer-4.jpg"
    ]
  },
  {
    id: "custom",
    name: "Custom Template",
    description: "Build your unique business template with our powerful customization tools",
    services: [],
    icon: "✨",
    primaryColor: "#a855f7", // Purple
    accentColor: "#7e22ce",
    benefits: [
      "Design your dashboard exactly how you want it",
      "Create custom service categories and pricing",
      "Build the perfect workflow for your business"
    ],
    features: ["Full customization", "Personalized branding", "Custom business logic"],
    professionalName: "professional",
    professionalPlural: "professionals",
    clientName: "client",
    appointmentTerm: "appointment",
    serviceTerm: "service",
    heroImage: "/images/custom-hero.jpg",
    galleryImages: [
      "/images/custom-1.jpg",
      "/images/custom-2.jpg",
      "/images/custom-3.jpg",
      "/images/custom-4.jpg"
    ]
  }
];

// Default industry if none is selected
const defaultIndustry = industryTemplates[0];

// Define context types
interface IndustryContextType {
  selectedIndustry: Industry;
  setSelectedIndustry: (industry: Industry) => void;
  selectIndustryById: (id: string) => void;
}

// Create context
const IndustryContext = createContext<IndustryContextType>({
  selectedIndustry: defaultIndustry,
  setSelectedIndustry: () => {},
  selectIndustryById: () => {}
});

// Provider component
export const IndustryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(() => {
    // Check if we have a stored selection in localStorage
    const storedIndustry = localStorage.getItem('selectedIndustry');
    if (storedIndustry) {
      try {
        const industry = JSON.parse(storedIndustry);
        return industry;
      } catch (e) {
        console.error('Failed to parse stored industry:', e);
      }
    }
    return defaultIndustry;
  });

  // Save to localStorage when industry changes
  useEffect(() => {
    localStorage.setItem('selectedIndustry', JSON.stringify(selectedIndustry));
  }, [selectedIndustry]);

  // Select industry by ID
  const selectIndustryById = (id: string) => {
    const industry = industryTemplates.find(ind => ind.id === id);
    if (industry) {
      setSelectedIndustry(industry);
    }
  };

  return (
    <IndustryContext.Provider
      value={{
        selectedIndustry,
        setSelectedIndustry,
        selectIndustryById
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

// Hook for using the industry context
export const useIndustry = () => useContext(IndustryContext);

// Helper function to get appropriate terminology
export const getTerminology = (industry: Industry) => {
  return {
    professional: industry.professionalName,
    professionals: industry.professionalPlural,
    client: industry.clientName,
    appointment: industry.appointmentTerm,
    service: industry.serviceTerm,
  };
};