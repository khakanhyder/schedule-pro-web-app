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
      // Template selected
      setSelectedTemplate(templateId);
      onSelectTemplate(templateId);
      
      toast({
        title: "Industry Selected", 
        description: `Selected ${templateId} template`,
      });
    } catch (error) {
      // Error in handleSelectTemplate
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
                ? 'border-blue-500 shadow-xl bg-gradient-to-br from-blue-50/30 to-slate-50/30' 
                : 'border-slate-200 hover:border-slate-300 hover:shadow-lg bg-white'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Template card clicked
              handleSelectTemplate(template.id);
            }}
          >
            {/* Top accent line */}
            <div 
              className="h-1 w-full"
              style={{ backgroundColor: template.primaryColor }}
            />
            
            {/* Selection indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm"
                  style={{ 
                    backgroundColor: `${template.primaryColor}15`,
                    borderColor: `${template.primaryColor}30`
                  }}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-slate-900">{template.name}</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Sample Services:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {template.services.slice(0, 4).map((service, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border-0"
                    >
                      {service}
                    </Badge>
                  ))}
                  {template.services.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-1 text-slate-500">
                      +{template.services.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 pb-4">
              <Button 
                className="w-full"
                variant={selectedTemplate === template.id ? "default" : "outline"}
                style={selectedTemplate === template.id ? { 
                  backgroundColor: template.primaryColor,
                  borderColor: template.primaryColor,
                  color: "white"
                } : {}}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Template button clicked
                  handleSelectTemplate(template.id);
                }}
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