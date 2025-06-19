import { useState } from "react";
import { useLocation } from "wouter";
import IndustryTemplates from "@/components/setup/IndustryTemplates";
import SimpleThemeCustomizer from "@/components/setup/SimpleThemeCustomizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/lib/industryContext";

export default function Setup() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectIndustryById } = useIndustry();
  
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Update the selected industry in our context
    selectIndustryById(templateId);
    
    // Show success toast
    toast({
      title: "Industry Template Selected",
      description: "Now choose your theme style for this industry."
    });
    
    // Automatically advance to step 2
    setTimeout(() => {
      setStep(2);
    }, 500);
  };
  
  const handleCompleteSetup = () => {
    if (!selectedTheme) {
      toast({
        title: "Please select a theme",
        description: "Choose a theme template to complete setup.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the dashboard
    setLocation("/dashboard");
    
    toast({
      title: "Setup Complete!",
      description: "Your dashboard has been personalized with your custom theme."
    });
  };

  return (
    <section className="py-12 bg-neutral min-h-screen">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Set Up Your Scheduled Dashboard</CardTitle>
            <CardDescription>
              Let's personalize your scheduling experience for your business
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 1 && (
              <IndustryTemplates onSelectTemplate={handleTemplateSelection} />
            )}
            {step === 2 && (
              <SimpleThemeCustomizer 
                selectedTheme={selectedTheme}
                onThemeSelect={setSelectedTheme}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => step === 1 ? setLocation("/") : setStep(1)}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            
            {step === 2 && (
              <Button 
                onClick={handleCompleteSetup}
                disabled={!selectedTheme}
              >
                Complete Setup
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}