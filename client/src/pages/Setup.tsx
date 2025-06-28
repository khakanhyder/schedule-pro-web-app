import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import IndustryTemplates from "@/components/setup/IndustryTemplates";
import LogoCustomizer from "@/components/setup/LogoCustomizer";
import BusinessDetailsCustomizer from "@/components/setup/BusinessDetailsCustomizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/lib/industryContext";

export default function Setup() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [step, setStep] = useState(1);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectIndustryById, selectedIndustry } = useIndustry();

  console.log('Setup component rendered, step:', step, 'selectedTemplate:', selectedTemplate);

  useEffect(() => {
    console.log('Setup component mounted/updated');
    
    // Add a global click listener to see if any clicks are happening
    const handleGlobalClick = (e: MouseEvent) => {
      console.log('Global click detected:', e.target);
    };
    
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  const handleTemplateSelection = (templateId: string) => {
    console.log('Setup: handleTemplateSelection called with:', templateId);
    setSelectedTemplate(templateId);
    
    selectIndustryById(templateId).then(() => {
      console.log('Industry set successfully');
      setStep(2);
      toast({
        title: "Industry Selected",
        description: "Now customize your business details."
      });
    }).catch((error: any) => {
      console.error('Error setting industry:', error);
      toast({
        title: "Error",
        description: "Failed to set industry. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  const handleCompleteSetup = () => {
    if (!selectedTemplate) {
      toast({
        title: "Please select an industry",
        description: "Choose an industry template to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!businessName.trim()) {
      toast({
        title: "Please enter business name",
        description: "Enter your business name to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Mark setup as completed in localStorage
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('hasServices', 'true'); // Default services are created
    localStorage.setItem('hasStaff', 'true'); // Default staff is created
    localStorage.setItem('selectedIndustry', selectedTemplate);
    localStorage.setItem('businessName', businessName);
    if (businessLogo) {
      localStorage.setItem('businessLogo', businessLogo);
    }
    
    // Navigate to the dashboard
    setLocation("/dashboard");
    
    toast({
      title: "Setup Complete!",
      description: "Your business profile has been configured successfully."
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
                <span className="ml-2 text-sm">Business Details</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Choose Your Industry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Beauty button clicked - event object:', e);
                      handleTemplateSelection('beauty');
                    }}
                    variant="outline"
                    className="p-6 h-auto border-2 hover:border-blue-500 hover:bg-blue-50 text-left justify-start"
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">💄</div>
                      <h4 className="font-semibold">Beauty Professional</h4>
                      <p className="text-sm text-gray-600">Salons, spas, beauty specialists</p>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Wellness button clicked - event object:', e);
                      handleTemplateSelection('wellness');
                    }}
                    variant="outline"
                    className="p-6 h-auto border-2 hover:border-blue-500 hover:bg-blue-50 text-left justify-start"
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">🧘</div>
                      <h4 className="font-semibold">Wellness Provider</h4>
                      <p className="text-sm text-gray-600">Massage, fitness, therapy</p>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Home services button clicked - event object:', e);
                      handleTemplateSelection('home_services');
                    }}
                    variant="outline"
                    className="p-6 h-auto border-2 hover:border-blue-500 hover:bg-blue-50 text-left justify-start"
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">🔧</div>
                      <h4 className="font-semibold">Home Services</h4>
                      <p className="text-sm text-gray-600">Contractors, repair, maintenance</p>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Pet care button clicked - event object:', e);
                      handleTemplateSelection('pet_care');
                    }}
                    variant="outline"
                    className="p-6 h-auto border-2 hover:border-blue-500 hover:bg-blue-50 text-left justify-start"
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">🐾</div>
                      <h4 className="font-semibold">Pet Care</h4>
                      <p className="text-sm text-gray-600">Grooming, training, veterinary</p>
                    </div>
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
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