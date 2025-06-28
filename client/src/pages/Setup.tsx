import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import IndustryTemplates from "@/components/setup/IndustryTemplates";
import SimpleThemeCustomizer from "@/components/setup/SimpleThemeCustomizer";
import LogoCustomizer from "@/components/setup/LogoCustomizer";
import BusinessDetailsCustomizer from "@/components/setup/BusinessDetailsCustomizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/lib/industryContext";
import { useTheme } from "@/lib/themeContext";

export default function Setup() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [step, setStep] = useState(1);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectIndustryById, selectedIndustry } = useIndustry();
  const { applyTheme } = useTheme();
  
  const handleTemplateSelection = (templateId: string) => {
    // Set the template selection state first
    setSelectedTemplate(templateId);
    
    // Update industry in background
    selectIndustryById(templateId).catch(error => {
      console.error('Error setting industry:', error);
    });
    
    // Immediately advance to step 2
    setStep(2);
    
    toast({
      title: "Industry Selected",
      description: "Now choose your theme style."
    });
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
    
    // Mark setup as completed in localStorage
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('hasServices', 'true'); // Default services are created
    localStorage.setItem('hasStaff', 'true'); // Default staff is created
    localStorage.setItem('selectedIndustry', selectedTemplate || 'beauty');
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('businessName', businessName);
    if (businessLogo) {
      localStorage.setItem('businessLogo', businessLogo);
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
            
            {/* Progress indicator */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm">Industry</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm">Theme</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm">Branding</span>
              </div>
            </div>
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
            {step === 3 && (
              <LogoCustomizer 
                onLogoChange={(logo, name) => {
                  setBusinessLogo(logo);
                  setBusinessName(name);
                }}
                currentLogo={businessLogo}
                currentBusinessName={businessName}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (step === 1) {
                  setLocation("/");
                } else {
                  setStep(step - 1);
                }
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            
            {step === 2 && (
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedTheme}
              >
                Next: Add Your Logo
              </Button>
            )}
            
            {step === 3 && (
              <Button 
                onClick={handleCompleteSetup}
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