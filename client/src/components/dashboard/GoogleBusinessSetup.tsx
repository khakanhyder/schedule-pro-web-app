import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ExternalLink, MapPin, Star, Camera, Clock, Link2, Search } from "lucide-react";
import { useState } from "react";

interface GoogleBusinessSetupProps {
  industryId: string;
  businessName: string;
}

export default function GoogleBusinessSetup({ industryId, businessName }: GoogleBusinessSetupProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [reviewPlatforms, setReviewPlatforms] = useState({
    google: '',
    yelp: '',
    facebook: '',
    trustpilot: ''
  });

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const handlePlatformLink = (platform: string, url: string) => {
    setReviewPlatforms(prev => ({
      ...prev,
      [platform]: url
    }));
  };

  const getIndustrySpecificTips = () => {
    switch (industryId) {
      case 'beauty':
        return {
          photos: ['Before/after transformations', 'Professional styling work', 'Clean salon interior', 'Team at work'],
          services: ['Hair Color', 'Cuts & Styling', 'Treatments', 'Bridal Services'],
          keywords: ['hair salon', 'beauty', 'styling', 'color specialist']
        };
      case 'wellness':
        return {
          photos: ['Relaxing treatment rooms', 'Professional equipment', 'Peaceful ambiance', 'Client testimonials'],
          services: ['Massage Therapy', 'Wellness Treatments', 'Relaxation Services', 'Health Consultations'],
          keywords: ['massage', 'wellness', 'therapy', 'relaxation']
        };
      case 'home_services':
        return {
          photos: ['Before/after project photos', 'Work in progress', 'Team and equipment', 'Completed projects'],
          services: ['Kitchen Remodeling', 'Bathroom Renovation', 'Electrical Work', 'Plumbing Services'],
          keywords: ['contractor', 'renovation', 'remodeling', 'home improvement']
        };
      case 'pet_care':
        return {
          photos: ['Happy pets after grooming', 'Clean facilities', 'Safety certifications', 'Team with pets'],
          services: ['Pet Grooming', 'Dog Walking', 'Pet Sitting', 'Health Care'],
          keywords: ['pet care', 'grooming', 'dog walking', 'pet sitting']
        };
      case 'creative':
        return {
          photos: ['Portfolio samples', 'Creative workspace', 'Client collaborations', 'Final deliverables'],
          services: ['Design Services', 'Creative Consultation', 'Brand Development', 'Marketing Materials'],
          keywords: ['creative', 'design', 'branding', 'marketing']
        };
      default:
        return {
          photos: ['Professional workspace', 'Team members', 'Service delivery', 'Client results'],
          services: ['Consultation', 'Service Delivery', 'Follow-up Support', 'Maintenance'],
          keywords: ['professional', 'service', 'consultation', 'expert']
        };
    }
  };

  const industryTips = getIndustrySpecificTips();

  const googleSetupSteps = [
    {
      title: "Create Your Google Business Profile",
      description: "Visit Google Business Profile and claim your business listing",
      action: "Create Profile",
      url: "https://business.google.com/create"
    },
    {
      title: "Verify Your Business Location",
      description: "Complete the verification process via postcard, phone, or email",
      action: "Verify Location",
      details: "This usually takes 1-2 weeks for postcard verification"
    },
    {
      title: "Add Professional Photos",
      description: `Upload high-quality photos showcasing your ${industryId} services`,
      action: "Upload Photos",
      tips: industryTips.photos
    },
    {
      title: "Complete Business Information",
      description: "Add hours, contact info, website, and service descriptions",
      action: "Add Details",
      details: "Include accurate phone number, address, and business hours"
    },
    {
      title: "Add Your Services",
      description: "List all services you offer with accurate descriptions",
      action: "List Services",
      tips: industryTips.services
    },
    {
      title: "Optimize for Local SEO",
      description: "Use relevant keywords in your business description",
      action: "Optimize SEO",
      tips: industryTips.keywords
    }
  ];

  const setupSteps = googleSetupSteps;

  const completionPercentage = Math.round((completedSteps.length / setupSteps.length) * 100);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Google Business Page Setup for {businessName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage}% Complete
            </Badge>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Set up your Google Business Profile to appear in local searches and collect reviews.
          Businesses with complete profiles get 3x more local bookings.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {setupSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
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
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${
                    completedSteps.includes(index) 
                      ? 'text-green-700 line-through' 
                      : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  {step.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(step.url, '_blank')}
                      className="flex items-center gap-1"
                    >
                      {step.action}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {step.description}
                </p>
                
                {step.details && (
                  <p className="text-xs text-blue-600 mb-2">
                    💡 {step.details}
                  </p>
                )}
                
                {step.tips && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {step.tips.map((tip, tipIndex) => (
                      <Badge key={tipIndex} variant="outline" className="text-xs">
                        {tip}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-blue-900">Pro Tips for Success</h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Respond to all reviews within 24 hours</li>
            <li>• Post weekly updates about your services</li>
            <li>• Use the messaging feature to answer customer questions</li>
            <li>• Keep your hours updated, especially during holidays</li>
            <li>• Add seasonal photos to keep your profile fresh</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-900">Why This Matters</h3>
          </div>
          <p className="text-sm text-green-800">
            {industryId === 'beauty' && "Beauty businesses with complete Google profiles get 35% more bookings from local searches."}
            {industryId === 'wellness' && "Wellness businesses with Google profiles get 3x more local bookings from health-conscious clients."}
            {industryId === 'home_services' && "Home service contractors with Google profiles get 50% more local leads and project inquiries."}
            {industryId === 'pet_care' && "Pet care businesses with Google profiles get 60% more trust from local pet owners."}
            {industryId === 'creative' && "Creative professionals with Google profiles get 40% more inquiries from local clients."}
            {!['beauty', 'wellness', 'home_services', 'pet_care', 'creative'].includes(industryId) && "Complete Google Business profiles increase local visibility by 70% across all industries."}
          </p>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-slate-600" />
            <h3 className="font-medium text-slate-900">Link Your Review Platforms</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Connect your existing review profiles to maximize your online presence. If you don't have these yet, you can create them after setting up Google Business.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="google-link" className="text-sm font-medium">Google Business URL</Label>
              <div className="flex gap-2">
                <Input
                  id="google-link"
                  placeholder="https://business.google.com/..."
                  value={reviewPlatforms.google}
                  onChange={(e) => handlePlatformLink('google', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://business.google.com/create', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yelp-link" className="text-sm font-medium">Yelp Business URL</Label>
              <div className="flex gap-2">
                <Input
                  id="yelp-link"
                  placeholder="https://biz.yelp.com/..."
                  value={reviewPlatforms.yelp}
                  onChange={(e) => handlePlatformLink('yelp', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://biz.yelp.com/claim', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook-link" className="text-sm font-medium">Facebook Business URL</Label>
              <div className="flex gap-2">
                <Input
                  id="facebook-link"
                  placeholder="https://facebook.com/..."
                  value={reviewPlatforms.facebook}
                  onChange={(e) => handlePlatformLink('facebook', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://business.facebook.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustpilot-link" className="text-sm font-medium">Trustpilot URL (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="trustpilot-link"
                  placeholder="https://trustpilot.com/..."
                  value={reviewPlatforms.trustpilot}
                  onChange={(e) => handlePlatformLink('trustpilot', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://business.trustpilot.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> You don't need all platforms immediately. Start with Google Business (essential) and Yelp (recommended). 
              Add others as your business grows. Having multiple review platforms increases customer trust by 40%.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}