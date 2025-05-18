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
    description: "Perfect for salon professionals managing clients and appointments",
    services: ["Women's Haircut", "Men's Haircut", "Color Treatment", "Highlights", "Blowout"],
    icon: "✂️",
    primaryColor: "#f472b6", // Pink
    accentColor: "#db2777"
  },
  {
    id: "carpenter",
    name: "Carpenter",
    description: "For woodworking professionals tracking jobs and materials",
    services: ["Custom Furniture", "Kitchen Cabinets", "Deck Building", "Repairs", "Installations"],
    icon: "🔨",
    primaryColor: "#ca8a04", // Amber
    accentColor: "#a16207"
  },
  {
    id: "massage",
    name: "Massage Therapist",
    description: "Ideal for massage therapists managing sessions and clients",
    services: ["Deep Tissue", "Swedish Massage", "Hot Stone", "Sports Massage", "Reflexology"],
    icon: "💆",
    primaryColor: "#22c55e", // Green
    accentColor: "#16a34a"
  },
  {
    id: "nails",
    name: "Nail Technician",
    description: "For nail artists handling appointments and designs",
    services: ["Manicure", "Pedicure", "Gel Polish", "Nail Art", "Acrylic Sets"],
    icon: "💅",
    primaryColor: "#ec4899", // Pink
    accentColor: "#be185d"
  },
  {
    id: "plumber",
    name: "Plumber",
    description: "For plumbing professionals managing service calls and parts",
    services: ["Leak Repairs", "Installation", "Drain Cleaning", "Inspections", "Emergency Services"],
    icon: "🔧",
    primaryColor: "#3b82f6", // Blue
    accentColor: "#1d4ed8"
  },
  {
    id: "electrician",
    name: "Electrician",
    description: "Designed for electrical contractors tracking jobs and materials",
    services: ["Installations", "Repairs", "Inspections", "Upgrades", "Emergency Services"],
    icon: "⚡",
    primaryColor: "#facc15", // Yellow
    accentColor: "#ca8a04"
  },
  {
    id: "custom",
    name: "Custom Template",
    description: "Build your own custom template from scratch",
    services: [],
    icon: "✨",
    primaryColor: "#a855f7", // Purple
    accentColor: "#7e22ce"
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Industry</h2>
        <p className="text-muted-foreground">
          Select a template to personalize your scheduling dashboard for your business type
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary' 
                : ''
            }`}
          >
            <div 
              className="h-2" 
              style={{ backgroundColor: template.primaryColor }}
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{template.icon}</span> 
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                
                {selectedTemplate === template.id && (
                  <Badge variant="success">Selected</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <h4 className="font-medium mb-2">Sample Services:</h4>
              <div className="flex flex-wrap gap-2">
                {template.services.map((service, index) => (
                  <Badge key={index} variant="outline">{service}</Badge>
                ))}
                {template.services.length === 0 && (
                  <span className="text-muted-foreground text-sm">Define your own services</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                style={{ 
                  backgroundColor: selectedTemplate === template.id ? template.accentColor : template.primaryColor,
                  color: "white"
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