import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Define industry templates
const industryTemplates = [
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
    features: ["Client history tracking", "Color formula records", "Service & retail inventory"]
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
    features: ["Project estimates", "Materials calculator", "Visual project gallery"]
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
    features: ["Client health records", "SOAP notes", "Wellness packages"]
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
    features: ["Design gallery", "Product inventory", "Client favorites tracking"]
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
    features: ["Job estimates", "Parts inventory", "Emergency dispatch"]
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
    features: ["Permit tracking", "Job documentation", "Emergency scheduling"]
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
    features: ["Full customization", "Personalized branding", "Custom business logic"]
  }
];

interface IndustryTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

export default function IndustryTemplates({ onSelectTemplate }: IndustryTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const template = industryTemplates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: `${template.name} Template Selected`,
        description: "Your dashboard will be personalized for this industry."
      });
    }
    
    onSelectTemplate(templateId);
  };

  return (
    <div className="space-y-10">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-heading-1 mb-3 font-bold tracking-tight">Choose Your Industry</h2>
        <p className="text-body text-neutral-600">
          Select a template to personalize your scheduling dashboard for your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industryTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`card-premium overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-xl' 
                : 'shadow-md'
            }`}
          >
            <div 
              className="h-1.5" 
              style={{ backgroundColor: template.primaryColor }}
            />
            <CardHeader className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle 
                    className="flex items-center gap-2 text-xl tracking-tight"
                    style={{ color: template.primaryColor }}
                  >
                    <span className="text-3xl mr-1">{template.icon}</span> 
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-neutral-600 mt-1.5 font-medium">
                    {template.description}
                  </CardDescription>
                </div>
                
                {selectedTemplate === template.id && (
                  <Badge variant="success" className="ml-2 mt-1">Selected</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-0 space-y-5">
              {/* Key Benefits */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-neutral-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" style={{ color: template.primaryColor }}>
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                  Key Benefits
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {template.benefits?.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="text-neutral-600 text-sm flex items-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 mt-0.5" style={{ color: template.primaryColor }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-neutral-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" style={{ color: template.primaryColor }}>
                    <path d="M4 17a4 4 0 0 1-4-4c0-1.4.7-2.7 1.8-3.4A5 5 0 0 1 10 6a6.7 6.7 0 0 1 2.5-.5 5.8 5.8 0 0 1 5.5 4c1.5.3 2.8 1 3.6 2.2a4 4 0 0 1-3.5 6.8 4 4 0 0 1-1.1-.2" />
                    <path d="M9 12a3 3 0 1 0 3 3" />
                  </svg>
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {template.features?.map((feature, index) => (
                    <Badge 
                      key={index} 
                      style={{ 
                        backgroundColor: `${template.primaryColor}20`, 
                        color: template.primaryColor,
                        border: `1px solid ${template.primaryColor}50`
                      }} 
                      className="py-1 px-2.5 text-xs font-medium rounded-md"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-neutral-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" style={{ color: template.primaryColor }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8h20" />
                    <circle cx="8" cy="14" r="2" />
                    <path d="M16 12h4" />
                    <path d="M16 16h4" />
                  </svg>
                  Sample Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.services.map((service, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="py-1 px-2.5 text-xs font-medium rounded-md bg-neutral-50"
                    >
                      {service}
                    </Badge>
                  ))}
                  {template.services.length === 0 && (
                    <span className="text-neutral-400 text-sm italic">Define your own services</span>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-6 py-5 pt-3 border-t border-neutral-100">
              <Button 
                className="w-full btn-premium font-medium"
                style={{ 
                  backgroundColor: selectedTemplate === template.id ? template.accentColor : template.primaryColor,
                  color: "white",
                  border: "none"
                }}
                onClick={() => handleSelectTemplate(template.id)}
              >
                {selectedTemplate === template.id ? 'Selected' : 'Choose Template'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}