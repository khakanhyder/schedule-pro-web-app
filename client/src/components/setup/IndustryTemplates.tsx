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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Choose Your Industry</h2>
        <p className="text-muted-foreground text-sm">
          Select a template to personalize your business dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {industryTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`group relative overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
              selectedTemplate === template.id 
                ? 'border-blue-500 shadow-xl scale-[1.02] bg-blue-50/30' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-[1.01]'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`${template.name} card clicked`);
              handleSelectTemplate(template.id);
            }}
          >
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                background: `linear-gradient(135deg, ${template.primaryColor} 0%, transparent 100%)` 
              }}
            />
            
            {/* Selection indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            )}
            
            <CardHeader className="relative pb-3">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${template.primaryColor}15` }}
                >
                  {template.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">{template.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {template.services.slice(0, 4).map((service, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-0"
                    >
                      {service}
                    </Badge>
                  ))}
                  {template.services.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500">
                      +{template.services.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 pb-4">
              <div className="w-full text-center">
                <div 
                  className={`text-sm font-medium transition-colors ${
                    selectedTemplate === template.id 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                >
                  {selectedTemplate === template.id ? '✓ Selected' : 'Click to select'}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}