import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIndustry } from "@/lib/industryContext";
import { 
  Scissors,
  Wrench,
  Heart,
  PawPrint,
  Palette,
  Stethoscope,
  Car,
  Home,
  Camera,
  Truck,
  Shield,
  Clock,
  FileText,
  Calculator,
  Clipboard,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimpleContractorTools from "./SimpleContractorTools";

export default function IndustrySpecificFeatures() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();

  const handleSetup = (feature: string) => {
    toast({ title: `${feature} configured for ${selectedIndustry.name}!` });
  };

  const renderBeautyFeatures = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Color Formulation Tracker
            </CardTitle>
            <CardDescription>
              Track custom color formulas for each client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Sarah's Blonde Formula</h4>
                <p className="text-sm text-muted-foreground">40g Level 9 + 20g Toner + 60ml 20vol</p>
                <Badge variant="outline" className="text-green-600 mt-1">Last Used: 3 weeks ago</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Emma's Highlights</h4>
                <p className="text-sm text-muted-foreground">Balayage technique, Face-framing pieces</p>
                <Badge variant="outline" className="text-blue-600 mt-1">Touchup Due: Next week</Badge>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Color Formulation")}>
              Manage Color Formulas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Beauty Portfolio & Progress
            </CardTitle>
            <CardDescription>
              Track client hair/beauty journey with photos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">247</div>
                <div className="text-sm text-pink-600">Before/After Sets</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-purple-600">Client Consent Rate</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Auto-suggest progress photos</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Social media auto-posting</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Beauty Portfolio")}>
              Manage Photo Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hair Care Recommendations Engine</CardTitle>
          <CardDescription>
            Personalized product recommendations based on hair type and treatments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Post-Color Care</h4>
              <p className="text-sm text-muted-foreground">Auto-recommend color-safe shampoo after coloring services</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Seasonal Treatments</h4>
              <p className="text-sm text-muted-foreground">Suggest deep conditioning in winter, UV protection in summer</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Maintenance Alerts</h4>
              <p className="text-sm text-muted-foreground">Remind clients when it's time for touch-ups or trims</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTradesFeatures = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Job Estimation & Quoting
            </CardTitle>
            <CardDescription>
              Generate professional estimates with material costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quick Estimate Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Bathroom Remodel</Button>
                <Button variant="outline" size="sm">Kitchen Install</Button>
                <Button variant="outline" size="sm">Electrical Panel</Button>
                <Button variant="outline" size="sm">Plumbing Repair</Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Material Cost Calculator</span>
                <Badge variant="outline" className="text-green-600">Enabled</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Labor Time Estimator</span>
                <Badge variant="outline" className="text-green-600">Enabled</Badge>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Job Estimation")}>
              Create New Estimate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vehicle & Equipment Tracking
            </CardTitle>
            <CardDescription>
              Track tools, materials, and service vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Service Van #1</h4>
                <p className="text-sm text-muted-foreground">Next maintenance: 2,500 miles</p>
                <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Tool Inventory</h4>
                <p className="text-sm text-muted-foreground">42 tools tracked, 3 need calibration</p>
                <Badge variant="outline" className="text-orange-600 mt-1">Action Needed</Badge>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Equipment Tracking")}>
              Manage Equipment
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety & Compliance Tracking
          </CardTitle>
          <CardDescription>
            Monitor safety protocols and licensing requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">License Renewals</h4>
              <p className="text-sm text-muted-foreground">Electrical license expires in 45 days</p>
              <Badge variant="outline" className="text-orange-600 mt-1">Renewal Due</Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Safety Certifications</h4>
              <p className="text-sm text-muted-foreground">OSHA 30-hour cert up to date</p>
              <Badge variant="outline" className="text-green-600 mt-1">Current</Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Insurance Coverage</h4>
              <p className="text-sm text-muted-foreground">Liability coverage valid</p>
              <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Contractor Tools */}
      <SimpleContractorTools />
    </div>
  );

  const renderWellnessFeatures = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Client Wellness Tracking
            </CardTitle>
            <CardDescription>
              Track client progress and wellness goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Stress Reduction Program</h4>
                <p className="text-sm text-muted-foreground">Client reports 40% improvement</p>
                <Badge variant="outline" className="text-green-600 mt-1">On Track</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Mobility Goals</h4>
                <p className="text-sm text-muted-foreground">Range of motion increasing</p>
                <Badge variant="outline" className="text-blue-600 mt-1">Progressing</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progress photo reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Wellness check-ins</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Wellness Tracking")}>
              View Client Progress
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Health Intake & Assessments
            </CardTitle>
            <CardDescription>
              Digital health forms and intake assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">89%</div>
                <div className="text-sm text-blue-600">Form Completion</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-green-600">Custom Forms</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pre-Built Assessment Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Pain Assessment</Button>
                <Button variant="outline" size="sm">Stress Evaluation</Button>
                <Button variant="outline" size="sm">Mobility Check</Button>
                <Button variant="outline" size="sm">Lifestyle Habits</Button>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Health Assessments")}>
              Manage Forms
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Plans & Protocols</CardTitle>
          <CardDescription>
            Structured treatment planning with progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Session Templates</h4>
              <p className="text-sm text-muted-foreground">Pre-built treatment protocols for common conditions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">Visual progress charts and improvement metrics</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Home Care Plans</h4>
              <p className="text-sm text-muted-foreground">Automated follow-up exercises and care instructions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPetCareFeatures = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              Pet Profiles & Medical History
            </CardTitle>
            <CardDescription>
              Comprehensive pet records and health tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Buddy - Golden Retriever</h4>
                <p className="text-sm text-muted-foreground">Last visit: Vaccination booster, Weight: 68lbs</p>
                <Badge variant="outline" className="text-green-600 mt-1">Up to date</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Whiskers - Maine Coon</h4>
                <p className="text-sm text-muted-foreground">Dental cleaning due, Special diet required</p>
                <Badge variant="outline" className="text-orange-600 mt-1">Overdue</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Vaccination reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Behavioral notes tracking</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Pet Profiles")}>
              Manage Pet Records
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Grooming & Care Tracking
            </CardTitle>
            <CardDescription>
              Track grooming styles and special care instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Preferred Grooming Styles</h4>
                <p className="text-sm text-muted-foreground">Teddy bear cut, nail trim, ear cleaning</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Special Instructions</h4>
                <p className="text-sm text-muted-foreground">Sensitive skin - use hypoallergenic products</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-purple-600">Grooming Records</div>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">42</div>
                <div className="text-sm text-pink-600">Before/After Photos</div>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Grooming Tracking")}>
              View Grooming History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Contacts & Vet Integration
          </CardTitle>
          <CardDescription>
            Quick access to emergency contacts and veterinary records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Emergency Contacts</h4>
              <p className="text-sm text-muted-foreground">Primary vet, emergency clinic, and owner contacts</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Medical Alerts</h4>
              <p className="text-sm text-muted-foreground">Allergies, medications, and behavioral warnings</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Vet Records Access</h4>
              <p className="text-sm text-muted-foreground">Integration with veterinary management systems</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCreativeFeatures = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Project Portfolio Management
            </CardTitle>
            <CardDescription>
              Showcase work and track creative projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Wedding Photography Package</h4>
                <p className="text-sm text-muted-foreground">8-hour coverage, 500+ edited photos</p>
                <Badge variant="outline" className="text-green-600 mt-1">Completed</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Brand Identity Design</h4>
                <p className="text-sm text-muted-foreground">Logo, business cards, website mockup</p>
                <Badge variant="outline" className="text-blue-600 mt-1">In Progress</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">34</div>
                <div className="text-sm text-indigo-600">Active Projects</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">127</div>
                <div className="text-sm text-green-600">Portfolio Pieces</div>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Portfolio Management")}>
              Manage Portfolio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Creative Contracts & Licensing
            </CardTitle>
            <CardDescription>
              Digital contracts with usage rights management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contract Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Photography Session</Button>
                <Button variant="outline" size="sm">Design Project</Button>
                <Button variant="outline" size="sm">Video Production</Button>
                <Button variant="outline" size="sm">Licensing Agreement</Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Digital signature collection</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Usage rights tracking</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment milestone alerts</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full" onClick={() => handleSetup("Contract Management")}>
              Manage Contracts
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Creative Pricing & Project Estimator
          </CardTitle>
          <CardDescription>
            Smart pricing tools for creative services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Time-Based Pricing</h4>
              <p className="text-sm text-muted-foreground">Automatic calculation based on project scope and hours</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Usage Rights Calculator</h4>
              <p className="text-sm text-muted-foreground">Pricing adjustments for commercial vs personal use</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Revision Tracking</h4>
              <p className="text-sm text-muted-foreground">Monitor revisions and additional charges</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getIndustryFeatures = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return renderBeautyFeatures();
      case 'trades':
        return renderTradesFeatures();
      case 'wellness':
        return renderWellnessFeatures();
      case 'pet-care':
        return renderPetCareFeatures();
      case 'creative':
        return renderCreativeFeatures();
      default:
        return renderBeautyFeatures();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Scissors className="h-6 w-6" style={{ color: selectedIndustry.primaryColor }} />
        <h2 className="text-2xl font-bold">{selectedIndustry.name} Specialist Tools</h2>
        <Badge variant="outline" style={{ backgroundColor: selectedIndustry.accentColor + '20' }}>
          Industry-Specific
        </Badge>
      </div>

      <div className="p-4 rounded-lg" style={{ backgroundColor: selectedIndustry.accentColor + '10' }}>
        <h3 className="font-medium mb-2">Built specifically for {selectedIndustry.name} professionals</h3>
        <p className="text-sm text-muted-foreground">
          These features are designed around the unique needs of {selectedIndustry.name} businesses, 
          helping you manage everything from client relationships to industry-specific workflows.
        </p>
      </div>

      {getIndustryFeatures()}
    </div>
  );
}