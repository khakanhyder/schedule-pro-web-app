import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIndustry } from "@/lib/industryContext";
import { 
  Scissors, Wrench, Heart, PawPrint, Palette,
  Calendar, Clock, Users, DollarSign, Star,
  Camera, FileText, MessageSquare, Bell,
  Smartphone, Mail, Gift, Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryCustomizations() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("booking");

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    toast({
      title: `${feature} ${enabled ? 'enabled' : 'disabled'}`,
      description: `Feature customized for ${selectedIndustry.name} businesses`
    });
  };

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-6 w-6" />;
      case 'trades': return <Wrench className="h-6 w-6" />;
      case 'wellness': return <Heart className="h-6 w-6" />;
      case 'pet-care': return <PawPrint className="h-6 w-6" />;
      case 'creative': return <Palette className="h-6 w-6" />;
      default: return <Calendar className="h-6 w-6" />;
    }
  };

  const getBookingCustomizations = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-pink-600" />
                  Beauty-Specific Booking Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Color Consultation Required</Label>
                    <p className="text-sm text-muted-foreground">Require consultation for color services</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Color Consultation", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Allergy Screening</Label>
                    <p className="text-sm text-muted-foreground">Ask about allergies during booking</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Allergy Screening", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Hair Length Assessment</Label>
                    <p className="text-sm text-muted-foreground">Capture current hair length for accurate pricing</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Hair Length Assessment", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Service Duration Multipliers</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Short Hair</Label>
                      <Select defaultValue="1.0">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.8">0.8x (Faster)</SelectItem>
                          <SelectItem value="1.0">1.0x (Standard)</SelectItem>
                          <SelectItem value="1.2">1.2x (Longer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Long Hair</Label>
                      <Select defaultValue="1.5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.2">1.2x</SelectItem>
                          <SelectItem value="1.5">1.5x (Standard)</SelectItem>
                          <SelectItem value="2.0">2.0x (Extra Long)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'trades':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  Trades-Specific Booking Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Site Visit Required</Label>
                    <p className="text-sm text-muted-foreground">Require initial site assessment</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Site Visit", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Material Estimation</Label>
                    <p className="text-sm text-muted-foreground">Calculate material costs automatically</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Material Estimation", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Permit Requirements</Label>
                    <p className="text-sm text-muted-foreground">Track required permits for jobs</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Permit Requirements", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Call Rates</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Weekend Rate</Label>
                      <Input type="number" placeholder="1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">After Hours Rate</Label>
                      <Input type="number" placeholder="2.0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'wellness':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  Wellness-Specific Booking Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Health Intake Form</Label>
                    <p className="text-sm text-muted-foreground">Required health screening before appointment</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Health Intake", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Insurance Verification</Label>
                    <p className="text-sm text-muted-foreground">Verify insurance coverage automatically</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Insurance Verification", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Progress Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track client wellness goals and progress</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Progress Tracking", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Session Package Discounts</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">5-Session Package</Label>
                      <Input type="number" placeholder="10%" />
                    </div>
                    <div>
                      <Label className="text-sm">10-Session Package</Label>
                      <Input type="number" placeholder="20%" />
                    </div>
                    <div>
                      <Label className="text-sm">Monthly Unlimited</Label>
                      <Input type="number" placeholder="Custom" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'pet-care':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-amber-600" />
                  Pet Care-Specific Booking Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Pet Profile Required</Label>
                    <p className="text-sm text-muted-foreground">Capture pet details, breed, and special needs</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Pet Profile", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Vaccination Records</Label>
                    <p className="text-sm text-muted-foreground">Require up-to-date vaccination proof</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Vaccination Records", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Behavioral Notes</Label>
                    <p className="text-sm text-muted-foreground">Track pet temperament and special instructions</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Behavioral Notes", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Size-Based Pricing</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label className="text-sm">XS (Under 10lbs)</Label>
                      <Input type="number" placeholder="0.8" />
                    </div>
                    <div>
                      <Label className="text-sm">S (10-25lbs)</Label>
                      <Input type="number" placeholder="1.0" />
                    </div>
                    <div>
                      <Label className="text-sm">M (25-50lbs)</Label>
                      <Input type="number" placeholder="1.3" />
                    </div>
                    <div>
                      <Label className="text-sm">L (50+ lbs)</Label>
                      <Input type="number" placeholder="1.6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'creative':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Creative Services Booking Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Portfolio Consultation</Label>
                    <p className="text-sm text-muted-foreground">Review client's vision and style preferences</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Portfolio Consultation", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Creative Brief Required</Label>
                    <p className="text-sm text-muted-foreground">Detailed project requirements and mood board</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Creative Brief", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Usage Rights Discussion</Label>
                    <p className="text-sm text-muted-foreground">Clarify usage rights and licensing upfront</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Usage Rights", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Project Complexity Pricing</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Basic</Label>
                      <Input type="number" placeholder="1.0" />
                    </div>
                    <div>
                      <Label className="text-sm">Standard</Label>
                      <Input type="number" placeholder="1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">Premium</Label>
                      <Input type="number" placeholder="2.0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Select an industry to see custom booking features</p>
            </CardContent>
          </Card>
        );
    }
  };

  const getMarketingCustomizations = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-pink-600" />
                  Beauty Marketing Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Before/After Photo Requests</Label>
                    <p className="text-sm text-muted-foreground">Automatically request transformation photos</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Photo Requests", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Social Media Consent</Label>
                    <p className="text-sm text-muted-foreground">Get permission to share client results</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Social Media Consent", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Seasonal Treatment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for seasonal services</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Seasonal Reminders", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Referral Incentives</Label>
                  <Textarea placeholder="Refer a friend and both get 20% off your next service!" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'trades':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Trades Marketing Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Project Completion Photos</Label>
                    <p className="text-sm text-muted-foreground">Document finished work for portfolio</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Project Photos", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Maintenance Reminders</Label>
                    <p className="text-sm text-muted-foreground">Schedule follow-up maintenance services</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Maintenance Reminders", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Emergency Service Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify about 24/7 emergency availability</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Emergency Alerts", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Warranty Information</Label>
                  <Textarea placeholder="All work comes with our 2-year quality guarantee. Contact us for any issues!" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'wellness':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  Wellness Marketing Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Wellness Tips Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Send weekly wellness and health tips</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Wellness Newsletter", checked)} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Progress Celebration</Label>
                    <p className="text-sm text-muted-foreground">Celebrate client milestones and achievements</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Progress Celebration", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Mindfulness Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send daily mindfulness and meditation prompts</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleFeatureToggle("Mindfulness Reminders", checked)} />
                </div>

                <div className="space-y-2">
                  <Label>Wellness Challenge Invitations</Label>
                  <Textarea placeholder="Join our 30-day wellness challenge! Transform your health with guided support." />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Select an industry to see custom marketing features</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {getIndustryIcon()}
        <div>
          <h2 className="text-2xl font-bold">Industry Customizations</h2>
          <p className="text-muted-foreground">
            Tailored features designed specifically for {selectedIndustry.name} businesses
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {selectedIndustry.name}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-4">
          {getBookingCustomizations()}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          {getMarketingCustomizations()}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Dynamic Pricing Rules
              </CardTitle>
              <CardDescription>
                Set up industry-specific pricing strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Peak Time Pricing</Label>
                  <p className="text-sm text-muted-foreground">Charge premium rates during busy periods</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Peak Pricing", checked)} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Last-Minute Discounts</Label>
                  <p className="text-sm text-muted-foreground">Offer discounts for same-day bookings</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Last-Minute Discounts", checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Loyalty Pricing Tiers</Label>
                  <p className="text-sm text-muted-foreground">Reward repeat customers with better rates</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Loyalty Pricing", checked)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Custom Workflows
              </CardTitle>
              <CardDescription>
                Automate industry-specific business processes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Automated Follow-ups</Label>
                  <p className="text-sm text-muted-foreground">Send customized follow-up sequences</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Automated Follow-ups", checked)} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Quality Assurance Checks</Label>
                  <p className="text-sm text-muted-foreground">Ensure service standards are met</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Quality Checks", checked)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Inventory Integration</Label>
                  <p className="text-sm text-muted-foreground">Track supplies and materials automatically</p>
                </div>
                <Switch onCheckedChange={(checked) => handleFeatureToggle("Inventory Integration", checked)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Ready to customize your {selectedIndustry.name} experience?</h3>
              <p className="text-sm text-muted-foreground">
                These features are designed specifically for your industry
              </p>
            </div>
            <Button onClick={() => toast({ title: "Customizations saved!", description: "Your industry-specific features have been configured." })}>
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}