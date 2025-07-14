import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Star, CheckCircle } from "lucide-react";
import { useState } from "react";

interface SimpleBusinessSetupProps {
  industryId: string;
  businessName: string;
}

export default function SimpleBusinessSetup({ industryId, businessName }: SimpleBusinessSetupProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const googleSteps = [
    {
      title: "Create Google Business Profile",
      description: "Set up your free Google Business listing",
      url: "https://business.google.com/create",
      tip: "This is essential for local search visibility"
    },
    {
      title: "Add Photos & Services",
      description: "Upload photos and list your services",
      tip: "Businesses with photos get 42% more requests for directions"
    },
    {
      title: "Collect Reviews",
      description: "Start asking customers for Google reviews",
      tip: "Reviews help you rank higher in local searches"
    }
  ];

  const yelpSteps = [
    {
      title: "Claim Your Yelp Page",
      description: "Find and claim your business on Yelp",
      url: "https://biz.yelp.com/claim",
      tip: "Many customers check Yelp before choosing a business"
    },
    {
      title: "Complete Your Profile",
      description: "Add hours, photos, and business details",
      tip: "Complete profiles get 3x more customer views"
    },
    {
      title: "Respond to Reviews",
      description: "Reply to customer reviews professionally",
      tip: "Responding shows you care about customer feedback"
    }
  ];

  const completionPercentage = Math.round((completedSteps.length / (googleSteps.length + yelpSteps.length)) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Business Setup Guide
            </CardTitle>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage}% Complete
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Set up your Google and Yelp profiles to get found by customers
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Google Business Setup */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">G</span>
                </div>
                Google Business Profile
              </h3>
              <div className="space-y-3">
                {googleSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <button
                      onClick={() => toggleStep(index)}
                      className="mt-1 flex-shrink-0"
                    >
                      <CheckCircle 
                        className={`h-5 w-5 ${
                          completedSteps.includes(index) 
                            ? 'text-green-600 fill-green-100' 
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          completedSteps.includes(index) 
                            ? 'text-green-700 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                        {step.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(step.url, '_blank')}
                            className="ml-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {step.description}
                      </p>
                      <p className="text-xs text-blue-600">
                        💡 {step.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yelp Business Setup */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-red-600" />
                </div>
                Yelp Business Profile
              </h3>
              <div className="space-y-3">
                {yelpSteps.map((step, index) => {
                  const stepIndex = index + googleSteps.length;
                  return (
                    <div key={stepIndex} className="flex items-start gap-3 p-3 border rounded-lg">
                      <button
                        onClick={() => toggleStep(stepIndex)}
                        className="mt-1 flex-shrink-0"
                      >
                        <CheckCircle 
                          className={`h-5 w-5 ${
                            completedSteps.includes(stepIndex) 
                              ? 'text-green-600 fill-green-100' 
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium text-sm ${
                            completedSteps.includes(stepIndex) 
                              ? 'text-green-700 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {step.title}
                          </h4>
                          {step.url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(step.url, '_blank')}
                              className="ml-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {step.description}
                        </p>
                        <p className="text-xs text-red-600">
                          💡 {step.tip}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why This Matters</h4>
            <p className="text-sm text-blue-800">
              92% of customers search online before visiting a business. Having Google and Yelp profiles 
              helps customers find you, read reviews, and get directions to your location.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}