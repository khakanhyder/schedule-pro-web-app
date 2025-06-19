import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIndustry } from "@/lib/industryContext";
import { 
  DollarSign, Clock, Users, TrendingUp, Package,
  Scissors, Wrench, Heart, PawPrint, Palette,
  Plus, Edit, Trash2, Copy, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryPricingModels() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState('services');

  const getIndustryPricingModels = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          services: [
            { name: "Haircut & Style", basePrice: 85, duration: 60, category: "Hair Services" },
            { name: "Full Highlights", basePrice: 180, duration: 180, category: "Color Services" },
            { name: "Root Touch-up", basePrice: 95, duration: 90, category: "Color Services" },
            { name: "Balayage", basePrice: 220, duration: 240, category: "Color Services" },
            { name: "Deep Conditioning Treatment", basePrice: 45, duration: 30, category: "Treatments" },
            { name: "Wedding Updo", basePrice: 150, duration: 90, category: "Special Events" },
            { name: "Keratin Treatment", basePrice: 300, duration: 180, category: "Treatments" }
          ],
          packages: [
            { name: "Bridal Package", services: ["Trial Run", "Wedding Day Hair", "Touch-up"], price: 450, savings: 75 },
            { name: "Color Maintenance", services: ["Root Touch-up", "Toner", "Treatment"], price: 160, savings: 30 },
            { name: "Complete Makeover", services: ["Cut", "Color", "Style", "Treatment"], price: 380, savings: 50 }
          ],
          modifiers: [
            { name: "Hair Length - Long", multiplier: 1.3, description: "For hair past shoulders" },
            { name: "Hair Length - Extra Long", multiplier: 1.6, description: "For hair past mid-back" },
            { name: "Thick/Curly Hair", multiplier: 1.2, description: "Requires extra time and product" },
            { name: "Color Correction", multiplier: 2.0, description: "Fixing previous color work" },
            { name: "Rush Service", multiplier: 1.5, description: "Same-day booking" },
            { name: "After Hours", multiplier: 1.3, description: "Outside normal business hours" }
          ]
        };

      case 'trades':
        return {
          services: [
            { name: "Emergency Plumbing Call", basePrice: 150, duration: 60, category: "Emergency Services" },
            { name: "Bathroom Renovation", basePrice: 8500, duration: 480, category: "Major Projects" },
            { name: "Kitchen Remodel", basePrice: 15000, duration: 720, category: "Major Projects" },
            { name: "Electrical Panel Upgrade", basePrice: 2200, duration: 240, category: "Electrical" },
            { name: "HVAC Maintenance", basePrice: 180, duration: 90, category: "Maintenance" },
            { name: "Roof Repair", basePrice: 850, duration: 180, category: "Roofing" },
            { name: "Drywall Patch & Paint", basePrice: 280, duration: 120, category: "Repair Services" }
          ],
          packages: [
            { name: "Home Maintenance Annual", services: ["HVAC Check", "Plumbing Inspection", "Electrical Safety"], price: 450, savings: 120 },
            { name: "Kitchen Upgrade Combo", services: ["Electrical Update", "Plumbing", "Tile Work"], price: 5200, savings: 800 },
            { name: "Emergency Service Plan", services: ["Priority Response", "Discounted Rates", "Annual Inspection"], price: 299, savings: 0 }
          ],
          modifiers: [
            { name: "Emergency Call", multiplier: 2.0, description: "After hours or weekend emergency" },
            { name: "Material Markup", multiplier: 1.2, description: "When contractor supplies materials" },
            { name: "Permit Required", addOn: 250, description: "City permit and inspection fees" },
            { name: "Difficult Access", multiplier: 1.4, description: "Crawl space, attic, or tight areas" },
            { name: "Rush Job", multiplier: 1.5, description: "Completion required within 48 hours" },
            { name: "Commercial Property", multiplier: 1.3, description: "Business location requirements" }
          ]
        };

      case 'wellness':
        return {
          services: [
            { name: "60-Minute Massage", basePrice: 120, duration: 60, category: "Massage Therapy" },
            { name: "90-Minute Deep Tissue", basePrice: 160, duration: 90, category: "Massage Therapy" },
            { name: "Acupuncture Session", basePrice: 85, duration: 45, category: "Alternative Medicine" },
            { name: "Private Yoga Session", basePrice: 95, duration: 60, category: "Movement Therapy" },
            { name: "Nutrition Consultation", basePrice: 150, duration: 90, category: "Wellness Coaching" },
            { name: "Reiki Healing", basePrice: 75, duration: 60, category: "Energy Work" },
            { name: "Couples Massage", basePrice: 220, duration: 60, category: "Specialty Services" }
          ],
          packages: [
            { name: "Wellness Journey - 5 Sessions", services: ["Choice of Services"], price: 450, savings: 75 },
            { name: "Monthly Unlimited Yoga", services: ["Unlimited Classes"], price: 180, savings: 0 },
            { name: "Complete Wellness Package", services: ["Massage", "Nutrition", "Yoga", "Meditation"], price: 320, savings: 60 }
          ],
          modifiers: [
            { name: "Prenatal Specialist", multiplier: 1.2, description: "Specialized prenatal care" },
            { name: "Chronic Pain Protocol", multiplier: 1.3, description: "Extended treatment for chronic conditions" },
            { name: "House Call Service", addOn: 50, description: "Mobile service to client location" },
            { name: "Couples Session", multiplier: 1.8, description: "Sessions for two people" },
            { name: "Extended Session", multiplier: 1.5, description: "Additional 30 minutes" },
            { name: "Holistic Assessment", addOn: 75, description: "Comprehensive health evaluation" }
          ]
        };

      case 'pet-care':
        return {
          services: [
            { name: "Small Dog Grooming", basePrice: 45, duration: 90, category: "Grooming" },
            { name: "Large Dog Grooming", basePrice: 75, duration: 120, category: "Grooming" },
            { name: "Cat Grooming", basePrice: 55, duration: 60, category: "Grooming" },
            { name: "Nail Trim", basePrice: 15, duration: 15, category: "Basic Care" },
            { name: "De-shedding Treatment", basePrice: 35, duration: 30, category: "Specialty Services" },
            { name: "Flea Treatment", basePrice: 40, duration: 45, category: "Health Services" },
            { name: "Teeth Cleaning", basePrice: 25, duration: 20, category: "Health Services" }
          ],
          packages: [
            { name: "Full Service Spa Day", services: ["Grooming", "Nail Trim", "Teeth Cleaning", "Bow"], price: 95, savings: 20 },
            { name: "Monthly Maintenance", services: ["Grooming", "Nail Trim"], price: 65, savings: 10 },
            { name: "Puppy Introduction Package", services: ["First Groom", "Nail Trim", "Desensitization"], price: 80, savings: 15 }
          ],
          modifiers: [
            { name: "Matted Coat", addOn: 25, description: "Extra time for dematting" },
            { name: "Anxious Pet", addOn: 15, description: "Extra patience and care required" },
            { name: "Aggressive Pet", addOn: 30, description: "Special handling and safety measures" },
            { name: "Extra Large Dog", multiplier: 1.4, description: "Dogs over 100 lbs" },
            { name: "Mobile Service", addOn: 35, description: "Grooming at client location" },
            { name: "Show Cut Precision", multiplier: 1.5, description: "Competition or show grooming standards" }
          ]
        };

      case 'creative':
        return {
          services: [
            { name: "Portrait Photography Session", basePrice: 350, duration: 120, category: "Photography" },
            { name: "Wedding Photography", basePrice: 2500, duration: 480, category: "Event Photography" },
            { name: "Logo Design", basePrice: 850, duration: 240, category: "Graphic Design" },
            { name: "Website Design", basePrice: 3200, duration: 960, category: "Web Design" },
            { name: "Product Photography", basePrice: 200, duration: 180, category: "Commercial" },
            { name: "Brand Identity Package", basePrice: 2800, duration: 600, category: "Branding" },
            { name: "Video Production", basePrice: 1500, duration: 360, category: "Video Services" }
          ],
          packages: [
            { name: "Complete Brand Launch", services: ["Logo", "Website", "Photography"], price: 5500, savings: 1500 },
            { name: "Social Media Starter", services: ["Logo", "Brand Colors", "Templates"], price: 1200, savings: 300 },
            { name: "Wedding Documentation", services: ["Engagement Photos", "Wedding Day", "Album"], price: 3800, savings: 700 }
          ],
          modifiers: [
            { name: "Rush Delivery", multiplier: 1.5, description: "Delivery within 48 hours" },
            { name: "Additional Revisions", addOn: 150, description: "Beyond standard 3 revisions" },
            { name: "Usage Rights Extended", multiplier: 1.3, description: "Commercial usage rights" },
            { name: "Travel Required", addOn: 200, description: "Location more than 30 miles away" },
            { name: "Weekend/Holiday", multiplier: 1.4, description: "Non-business hours" },
            { name: "Client Consultation", addOn: 125, description: "In-depth strategy session" }
          ]
        };

      default:
        return { services: [], packages: [], modifiers: [] };
    }
  };

  const pricingData = getIndustryPricingModels();

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-5 w-5 text-pink-600" />;
      case 'trades': return <Wrench className="h-5 w-5 text-orange-600" />;
      case 'wellness': return <Heart className="h-5 w-5 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-5 w-5 text-amber-600" />;
      case 'creative': return <Palette className="h-5 w-5 text-purple-600" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getIndustryColor = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return 'border-pink-200 bg-pink-50';
      case 'trades': return 'border-orange-200 bg-orange-50';
      case 'wellness': return 'border-green-200 bg-green-50';
      case 'pet-care': return 'border-amber-200 bg-amber-50';
      case 'creative': return 'border-purple-200 bg-purple-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Pricing Updated",
      description: `${selectedIndustry.name} pricing structure has been saved successfully`
    });
  };

  const handleDuplicateService = (service) => {
    toast({
      title: "Service Duplicated",
      description: `Created copy of ${service.name}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIndustryIcon()}
          <div>
            <h2 className="text-2xl font-bold">Industry Pricing Models</h2>
            <p className="text-muted-foreground">
              Optimized pricing strategies for {selectedIndustry.name} businesses
            </p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {selectedIndustry.name}
        </Badge>
      </div>

      <Tabs value={selectedModel} onValueChange={setSelectedModel}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="modifiers">Price Modifiers</TabsTrigger>
          <TabsTrigger value="analytics">Pricing Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Pricing</h3>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          <div className="grid gap-4">
            {pricingData.services?.map((service, index) => (
              <Card key={index} className={getIndustryColor()}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{service.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${service.basePrice}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDuplicateService(service)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Packages</h3>
            <Button className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Create Package
            </Button>
          </div>

          <div className="grid gap-4">
            {pricingData.packages?.map((pkg, index) => (
              <Card key={index} className={getIndustryColor()}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <Badge variant="default" className="text-xs bg-green-600">
                          Save ${pkg.savings}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Array.isArray(pkg.services) ? pkg.services.join(", ") : pkg.services}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-green-600">
                          ${pkg.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${pkg.price + pkg.savings}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modifiers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Dynamic Pricing Rules</h3>
            <Button className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Add Rule
            </Button>
          </div>

          <div className="grid gap-4">
            {pricingData.modifiers?.map((modifier, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{modifier.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {modifier.multiplier ? `${modifier.multiplier}x` : `+$${modifier.addOn}`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {modifier.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Average Service Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${pricingData.services?.reduce((sum, s) => sum + s.basePrice, 0) / (pricingData.services?.length || 1) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Across all services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Price Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12%</div>
                <p className="text-xs text-muted-foreground">Recommended increase</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${pricingData.packages?.reduce((sum, p) => sum + p.savings, 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total client savings offered</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Industry Pricing Insights
              </CardTitle>
              <CardDescription>
                Competitive analysis for {selectedIndustry.name} businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your pricing vs. local market</Label>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Below Average</div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <div className="text-sm font-medium">Above Average</div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You could increase prices by 15-20% and remain competitive
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Service demand trends</Label>
                  <div className="space-y-1">
                    {selectedIndustry.id === 'beauty' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Balayage/Highlights</span>
                          <span className="text-green-600">↗ High demand</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Keratin Treatments</span>
                          <span className="text-green-600">↗ Growing</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Basic Cuts</span>
                          <span className="text-orange-600">→ Stable</span>
                        </div>
                      </>
                    )}
                    {selectedIndustry.id === 'trades' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Kitchen Remodels</span>
                          <span className="text-green-600">↗ High demand</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Bathroom Updates</span>
                          <span className="text-green-600">↗ Growing</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Emergency Repairs</span>
                          <span className="text-orange-600">→ Stable</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleSaveChanges} className="mr-2">
                  Save Pricing Changes
                </Button>
                <Button variant="outline">
                  Export Price List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}