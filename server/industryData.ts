export type IndustryData = {
  id: string;
  name: string;
  professionalName: string;
  professionalTitle: string;
  services: string[];
  serviceDescriptions: string[];
  professionalNames: string[];
  professionalBios: string[];
}

// Industry-specific data
export const industryDatabase: Record<string, IndustryData> = {
  beauty: {
    id: "beauty",
    name: "Beauty Professional",
    professionalName: "specialist",
    professionalTitle: "Beauty Specialist",
    services: ["Haircut & Styling", "Color Treatment", "Manicure & Pedicure", "Facial Treatment", "Waxing Services", "Lash Extensions"],
    serviceDescriptions: [
      "Full service haircut, wash, and blow dry styling",
      "Professional hair coloring with quality products",
      "Nail care for hands and feet with polish application",
      "Deep cleansing facial with customized treatments",
      "Hair removal services for various body areas",
      "Application of semi-permanent lash extensions"
    ],
    professionalNames: [
      "Sarah Johnson", 
      "Michael Chen", 
      "Anna Rodriguez", 
      "David Smith"
    ],
    professionalBios: [
      "Sarah specializes in color techniques and precision cuts with 8 years of experience.",
      "Michael is known for his creative styling and formal updos for special occasions.",
      "Anna brings expertise in nail art and skin care with advanced certification.",
      "David focuses on classic cuts with modern influences from international trends."
    ]
  },
  wellness: {
    id: "wellness",
    name: "Wellness Provider",
    professionalName: "practitioner",
    professionalTitle: "Wellness Practitioner",
    services: ["Massage Therapy", "Personal Training", "Yoga Class", "Nutrition Consultation", "Physical Therapy", "Meditation Session"],
    serviceDescriptions: [
      "Therapeutic massage to relieve tension and promote relaxation",
      "One-on-one fitness training customized to your goals",
      "Guided yoga practice for all experience levels",
      "Personalized nutrition planning and dietary guidance",
      "Targeted therapy to address physical injuries and limitations",
      "Guided meditation and mindfulness practices"
    ],
    professionalNames: [
      "Lisa Thompson", 
      "James Wilson", 
      "Maria Garcia", 
      "Robert Taylor"
    ],
    professionalBios: [
      "Lisa is a certified massage therapist specializing in deep tissue and sports recovery.",
      "James combines strength training with mobility work for a balanced fitness approach.",
      "Maria is a registered dietitian with focus on holistic nutrition and wellness.",
      "Robert brings 10 years of experience in yoga and meditation instruction."
    ]
  },
  home_services: {
    id: "home_services",
    name: "Home Service Provider",
    professionalName: "technician",
    professionalTitle: "Home Service Technician",
    services: ["Bathroom Remodel", "Built-in Cabinets", "Electrical Panel Upgrade", "Kitchen Renovation", "Plumbing Repair", "Deck Construction"],
    serviceDescriptions: [
      "Complete bathroom renovation including fixtures and finishes",
      "Custom cabinet design and installation for any room",
      "Professional electrical panel replacement and upgrading",
      "Full kitchen remodeling with modern appliances and finishes",
      "Expert plumbing repairs and fixture installations",
      "Custom outdoor deck design and construction"
    ],
    professionalNames: [
      "Thomas Brown", 
      "Jennifer Martinez", 
      "William Davis", 
      "Jessica Wilson"
    ],
    professionalBios: [
      "Thomas specializes in custom carpentry with 15 years of woodworking experience.",
      "Jennifer is a licensed electrician focused on residential safety upgrades.",
      "William brings expertise in kitchen and bathroom renovation projects.",
      "Jessica is a master plumber specializing in complex plumbing systems."
    ]
  },
  pet_care: {
    id: "pet_care",
    name: "Pet Care Professional",
    professionalName: "caretaker",
    professionalTitle: "Pet Care Specialist",
    services: ["Pet Grooming", "Dog Training", "Pet Sitting", "Dog Walking", "Basic Veterinary Care", "Pet Photography"],
    serviceDescriptions: [
      "Complete grooming package including bath, haircut, and nail trimming",
      "Behavior training for puppies and adult dogs",
      "In-home pet sitting while you're away",
      "Scheduled dog walking with exercise and potty breaks",
      "Routine health checks and preventative care",
      "Professional pet photography sessions"
    ],
    professionalNames: [
      "Emma Clark", 
      "Daniel Rodriguez", 
      "Olivia Lee", 
      "Nathan Parker"
    ],
    professionalBios: [
      "Emma is a certified dog groomer with specialized training for all breed types.",
      "Daniel uses positive reinforcement techniques for effective dog training.",
      "Olivia is a veterinary assistant providing basic health services for pets.",
      "Nathan combines pet care with professional photography for memorable portraits."
    ]
  },
  creative: {
    id: "creative",
    name: "Creative Professional",
    professionalName: "artist",
    professionalTitle: "Creative Artist",
    services: ["Photo Session", "Design Consultation", "Custom Artwork", "Portfolio Review", "Creative Direction", "Wedding Photography"],
    serviceDescriptions: [
      "Professional photography session in studio or on location",
      "Consultation for branding, web, or print design projects",
      "Commission custom artwork tailored to your preferences",
      "Expert review and feedback on your creative portfolio",
      "Creative direction for brands and marketing campaigns",
      "Complete wedding photography package with editing"
    ],
    professionalNames: [
      "Christopher Adams", 
      "Sophia Chen", 
      "Marcus Johnson", 
      "Isabella Martinez"
    ],
    professionalBios: [
      "Christopher is an award-winning photographer specializing in portraits and events.",
      "Sophia brings expertise in graphic design with focus on brand identity.",
      "Marcus creates custom illustrations and fine art for residential and commercial spaces.",
      "Isabella specializes in wedding and special event photography with a journalistic style."
    ]
  },
  custom: {
    id: "custom",
    name: "Custom Business",
    professionalName: "professional",
    professionalTitle: "Service Professional",
    services: ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5", "Service 6"],
    serviceDescriptions: [
      "Description for Service 1",
      "Description for Service 2",
      "Description for Service 3",
      "Description for Service 4",
      "Description for Service 5",
      "Description for Service 6"
    ],
    professionalNames: [
      "Professional 1", 
      "Professional 2", 
      "Professional 3", 
      "Professional 4"
    ],
    professionalBios: [
      "Bio for Professional 1",
      "Bio for Professional 2",
      "Bio for Professional 3",
      "Bio for Professional 4"
    ]
  }
};