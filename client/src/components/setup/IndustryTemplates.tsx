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
import { industryTemplates } from "@/lib/industryContext";

interface IndustryTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

export default function IndustryTemplates({ onSelectTemplate }: IndustryTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string) => {
    try {
      console.log('Template selected:', templateId);
      setSelectedTemplate(templateId);
      onSelectTemplate(templateId);
      
      toast({
        title: "Industry Selected", 
        description: `Selected ${templateId} template`,
      });
    } catch (error) {
      console.error('Error in handleSelectTemplate:', error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl mb-3 font-bold tracking-tight">Choose Your Industry</h2>
        <p className="text-muted-foreground">
          Select a template to personalize your scheduling dashboard for your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industryTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-blue-500 shadow-xl' 
                : 'shadow-md'
            }`}
          >
            <div 
              className="h-1.5" 
              style={{ backgroundColor: template.primaryColor }}
            />
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">{template.icon}</div>
                {selectedTemplate === template.id && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Key Benefits:</h4>
                <ul className="space-y-1">
                  {template.benefits?.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Sample Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.services.slice(0, 3).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {template.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.services.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button 
                className="w-full"
                style={{ 
                  backgroundColor: template.primaryColor,
                  color: "white"
                }}
                onClick={() => handleSelectTemplate(template.id)}
              >
                {selectedTemplate === template.id ? '✓ Selected' : 'Choose Template'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}