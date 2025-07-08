import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIndustry, industryTemplates } from "@/lib/industryContext";
import ImageUploadManager, { type CustomImages } from "@/components/setup/ImageUploadManager";

export default function Setup() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [customImages, setCustomImages] = useState<CustomImages>({
    heroImage: undefined,
    galleryImages: [],
    serviceShowcaseImages: []
  });
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectIndustryById } = useIndustry();
  
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    selectIndustryById(templateId);
    setStep(2);
    
    toast({
      title: "Industry Selected",
      description: "Now customize your business details."
    });
  };

  const handleBusinessDetails = () => {
    if (!businessName.trim()) {
      toast({
        title: "Please enter business name",
        description: "Enter your business name to continue.",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
    
    toast({
      title: "Business Details Saved",
      description: "Now customize your images to make your template unique."
    });
  };

  const handleImagesUpdate = (images: CustomImages) => {
    setCustomImages(images);
  };

  const completeSetup = () => {
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
    
    // Save all setup data including custom images
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('hasServices', 'true');
    localStorage.setItem('hasStaff', 'true');
    localStorage.setItem('selectedIndustry', selectedTemplate);
    localStorage.setItem('businessName', businessName);
    localStorage.setItem('customImages', JSON.stringify(customImages));
    
    setLocation("/dashboard");
    
    toast({
      title: "Setup Complete!",
      description: "Your personalized business profile has been configured successfully."
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
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm">Custom Images</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 1 && (
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
                      onClick={() => handleTemplateSelection(template.id)}
                    >
                      <div 
                        className="h-1 w-full"
                        style={{ backgroundColor: template.primaryColor }}
                      />
                      
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
                            e.stopPropagation();
                            handleTemplateSelection(template.id);
                          }}
                        >
                          {selectedTemplate === template.id ? '✓ Selected' : 'Choose Template'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Business Details</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your business name to personalize the platform
                  </p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && selectedTemplate && (
              <div className="space-y-6">
                <ImageUploadManager 
                  selectedIndustry={industryTemplates.find(t => t.id === selectedTemplate)!}
                  onImagesUpdate={handleImagesUpdate}
                />
              </div>
            )}


          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step === 1 && (
              <>
                <Button variant="outline" onClick={() => setLocation("/")}>
                  Back to Home
                </Button>
                <div className="text-sm text-muted-foreground">
                  Select an industry template to continue
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Industry
                </Button>
                <Button onClick={handleBusinessDetails}>
                  Continue to Images
                </Button>
              </>
            )}
            
            {step === 3 && (
              <>
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back to Details
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={completeSetup}>
                    Skip Images
                  </Button>
                  <Button onClick={completeSetup}>
                    Complete Setup
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}