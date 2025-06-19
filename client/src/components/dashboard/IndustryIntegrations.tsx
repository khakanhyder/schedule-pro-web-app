import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIndustry } from "@/lib/industryContext";
import { 
  Zap, CheckCircle, Clock, AlertCircle, ExternalLink,
  Scissors, Wrench, Heart, PawPrint, Palette,
  CreditCard, Mail, MessageSquare, Calendar, FileText,
  BarChart3, Camera, MapPin, Share2, ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryIntegrations() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const getIndustryIntegrations = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          essential: [
            {
              id: 'square',
              name: 'Square',
              description: 'Accept payments and manage retail inventory',
              category: 'Payment Processing',
              icon: <CreditCard className="h-6 w-6" />,
              benefits: ['Accept credit cards', 'Track product sales', 'Inventory management'],
              setupTime: '5 minutes',
              popularity: 95
            },
            {
              id: 'instagram',
              name: 'Instagram Business',
              description: 'Showcase your work and attract new clients',
              category: 'Social Media',
              icon: <Camera className="h-6 w-6" />,
              benefits: ['Auto-post client photos', 'Book appointments from Instagram', 'Hashtag optimization'],
              setupTime: '10 minutes',
              popularity: 88
            },
            {
              id: 'mailchimp',
              name: 'Mailchimp',
              description: 'Send beauty tips and appointment reminders',
              category: 'Email Marketing',
              icon: <Mail className="h-6 w-6" />,
              benefits: ['Automated email campaigns', 'Client segmentation', 'Beauty content templates'],
              setupTime: '15 minutes',
              popularity: 72
            }
          ],
          popular: [
            {
              id: 'canva',
              name: 'Canva Pro',
              description: 'Create stunning social media content',
              category: 'Design',
              icon: <Palette className="h-6 w-6" />,
              benefits: ['Beauty-themed templates', 'Before/after layouts', 'Brand consistency'],
              setupTime: '8 minutes',
              popularity: 65
            },
            {
              id: 'zenoti',
              name: 'Zenoti',
              description: 'Comprehensive salon management software',
              category: 'Salon Management',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Advanced reporting', 'Staff management', 'Inventory tracking'],
              setupTime: '30 minutes',
              popularity: 58
            },
            {
              id: 'google_my_business',
              name: 'Google My Business',
              description: 'Manage your online presence and reviews',
              category: 'Local SEO',
              icon: <MapPin className="h-6 w-6" />,
              benefits: ['Review management', 'Local search visibility', 'Business hours sync'],
              setupTime: '12 minutes',
              popularity: 89
            }
          ],
          specialized: [
            {
              id: 'fresha',
              name: 'Fresha',
              description: 'All-in-one beauty business platform',
              category: 'Beauty Platform',
              icon: <Scissors className="h-6 w-6" />,
              benefits: ['Client management', 'Inventory tracking', 'Staff scheduling'],
              setupTime: '45 minutes',
              popularity: 42
            },
            {
              id: 'glossgenius',
              name: 'GlossGenius',
              description: 'Beauty business management and payments',
              category: 'Beauty Platform',
              icon: <Scissors className="h-6 w-6" />,
              benefits: ['Appointment booking', 'Payment processing', 'Client profiles'],
              setupTime: '25 minutes',
              popularity: 38
            }
          ]
        };

      case 'trades':
        return {
          essential: [
            {
              id: 'quickbooks',
              name: 'QuickBooks',
              description: 'Manage finances, estimates, and invoicing',
              category: 'Accounting',
              icon: <FileText className="h-6 w-6" />,
              benefits: ['Job costing', 'Tax preparation', 'Expense tracking'],
              setupTime: '20 minutes',
              popularity: 82
            },
            {
              id: 'buildertrend',
              name: 'BuilderTrend',
              description: 'Construction project management software',
              category: 'Project Management',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Project tracking', 'Client communication', 'Photo documentation'],
              setupTime: '30 minutes',
              popularity: 68
            },
            {
              id: 'stripe',
              name: 'Stripe',
              description: 'Accept online payments and deposits',
              category: 'Payment Processing',
              icon: <CreditCard className="h-6 w-6" />,
              benefits: ['Online deposits', 'Invoice payments', 'Automatic receipts'],
              setupTime: '10 minutes',
              popularity: 75
            }
          ],
          popular: [
            {
              id: 'angie_list',
              name: "Angie's List",
              description: 'Generate leads and manage reviews',
              category: 'Lead Generation',
              icon: <Star className="h-6 w-6" />,
              benefits: ['Qualified leads', 'Review management', 'Local visibility'],
              setupTime: '15 minutes',
              popularity: 64
            },
            {
              id: 'home_advisor',
              name: 'HomeAdvisor',
              description: 'Connect with homeowners needing services',
              category: 'Lead Generation',
              icon: <MapPin className="h-6 w-6" />,
              benefits: ['Instant leads', 'Background check badge', 'Local market insights'],
              setupTime: '25 minutes',
              popularity: 59
            },
            {
              id: 'procore',
              name: 'Procore',
              description: 'Construction management platform',
              category: 'Project Management',
              icon: <Wrench className="h-6 w-6" />,
              benefits: ['Document management', 'Field reporting', 'Budget tracking'],
              setupTime: '45 minutes',
              popularity: 51
            }
          ],
          specialized: [
            {
              id: 'servicemax',
              name: 'ServiceMax',
              description: 'Field service management for trades',
              category: 'Field Service',
              icon: <Wrench className="h-6 w-6" />,
              benefits: ['Work order management', 'Technician scheduling', 'Parts inventory'],
              setupTime: '60 minutes',
              popularity: 34
            }
          ]
        };

      case 'wellness':
        return {
          essential: [
            {
              id: 'square_appointments',
              name: 'Square Appointments',
              description: 'Simple booking and payment system',
              category: 'Booking & Payments',
              icon: <Calendar className="h-6 w-6" />,
              benefits: ['Online booking', 'Payment processing', 'Client management'],
              setupTime: '15 minutes',
              popularity: 71
            },
            {
              id: 'zoom',
              name: 'Zoom',
              description: 'Conduct virtual wellness sessions',
              category: 'Video Conferencing',
              icon: <MessageSquare className="h-6 w-6" />,
              benefits: ['Virtual consultations', 'Group classes', 'Session recording'],
              setupTime: '8 minutes',
              popularity: 86
            },
            {
              id: 'simple_practice',
              name: 'SimplePractice',
              description: 'Practice management for wellness professionals',
              category: 'Practice Management',
              icon: <Heart className="h-6 w-6" />,
              benefits: ['HIPAA compliance', 'Progress notes', 'Insurance billing'],
              setupTime: '30 minutes',
              popularity: 63
            }
          ],
          popular: [
            {
              id: 'thera_nest',
              name: 'TheraNest',
              description: 'Complete practice management solution',
              category: 'Practice Management',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Client portal', 'Treatment planning', 'Outcome tracking'],
              setupTime: '40 minutes',
              popularity: 45
            },
            {
              id: 'wellness_living',
              name: 'WellnessLiving',
              description: 'All-in-one wellness business software',
              category: 'Wellness Platform',
              icon: <Heart className="h-6 w-6" />,
              benefits: ['Class scheduling', 'Package management', 'Marketing automation'],
              setupTime: '35 minutes',
              popularity: 52
            },
            {
              id: 'myfitnesspal',
              name: 'MyFitnessPal',
              description: 'Nutrition tracking for clients',
              category: 'Health Tracking',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Nutrition monitoring', 'Goal tracking', 'Progress reports'],
              setupTime: '12 minutes',
              popularity: 78
            }
          ],
          specialized: [
            {
              id: 'telehealth',
              name: 'Telehealth Platform',
              description: 'HIPAA-compliant virtual sessions',
              category: 'Telehealth',
              icon: <MessageSquare className="h-6 w-6" />,
              benefits: ['Secure video calls', 'Session notes', 'Client portal'],
              setupTime: '25 minutes',
              popularity: 38
            }
          ]
        };

      case 'pet-care':
        return {
          essential: [
            {
              id: 'pet_desk',
              name: 'PetDesk',
              description: 'Pet appointment scheduling and reminders',
              category: 'Pet Management',
              icon: <PawPrint className="h-6 w-6" />,
              benefits: ['Pet profiles', 'Vaccination tracking', 'Photo sharing'],
              setupTime: '15 minutes',
              popularity: 73
            },
            {
              id: 'square_pets',
              name: 'Square for Pet Care',
              description: 'Payment processing for pet services',
              category: 'Payment Processing',
              icon: <CreditCard className="h-6 w-6" />,
              benefits: ['Mobile payments', 'Inventory for pet products', 'Customer loyalty'],
              setupTime: '10 minutes',
              popularity: 68
            },
            {
              id: 'rover_pro',
              name: 'Rover Pro',
              description: 'Connect with pet owners and manage bookings',
              category: 'Pet Platform',
              icon: <PawPrint className="h-6 w-6" />,
              benefits: ['Client discovery', 'Secure messaging', 'Payment protection'],
              setupTime: '20 minutes',
              popularity: 56
            }
          ],
          popular: [
            {
              id: 'gingr',
              name: 'Gingr',
              description: 'Complete pet care business management',
              category: 'Pet Management',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Daycare management', 'Webcam integration', 'Report cards'],
              setupTime: '45 minutes',
              popularity: 42
            },
            {
              id: 'pet_sitter_plus',
              name: 'Pet Sitter Plus',
              description: 'Professional pet sitting software',
              category: 'Pet Management',
              icon: <PawPrint className="h-6 w-6" />,
              benefits: ['Visit tracking', 'GPS check-ins', 'Photo updates'],
              setupTime: '25 minutes',
              popularity: 39
            },
            {
              id: 'instagram_pets',
              name: 'Instagram for Pet Businesses',
              description: 'Showcase adorable pets and grow your following',
              category: 'Social Media',
              icon: <Camera className="h-6 w-6" />,
              benefits: ['Pet photo sharing', 'Client testimonials', 'Local hashtags'],
              setupTime: '12 minutes',
              popularity: 81
            }
          ],
          specialized: [
            {
              id: 'veterinary_software',
              name: 'Veterinary Practice Software',
              description: 'Integration with local vet practices',
              category: 'Healthcare',
              icon: <Heart className="h-6 w-6" />,
              benefits: ['Health record sharing', 'Vaccination reminders', 'Emergency contacts'],
              setupTime: '35 minutes',
              popularity: 28
            }
          ]
        };

      case 'creative':
        return {
          essential: [
            {
              id: 'stripe_creative',
              name: 'Stripe',
              description: 'Accept project payments and deposits',
              category: 'Payment Processing',
              icon: <CreditCard className="h-6 w-6" />,
              benefits: ['Project invoicing', 'Milestone payments', 'International clients'],
              setupTime: '10 minutes',
              popularity: 84
            },
            {
              id: 'dropbox',
              name: 'Dropbox',
              description: 'Share large files and collaborate with clients',
              category: 'File Storage',
              icon: <Share2 className="h-6 w-6" />,
              benefits: ['Large file sharing', 'Version control', 'Client proofing'],
              setupTime: '8 minutes',
              popularity: 76
            },
            {
              id: 'adobe_creative',
              name: 'Adobe Creative Cloud',
              description: 'Professional design and editing tools',
              category: 'Design Tools',
              icon: <Palette className="h-6 w-6" />,
              benefits: ['Professional tools', 'Asset libraries', 'Team collaboration'],
              setupTime: '20 minutes',
              popularity: 92
            }
          ],
          popular: [
            {
              id: 'behance',
              name: 'Behance',
              description: 'Showcase your creative portfolio',
              category: 'Portfolio',
              icon: <Camera className="h-6 w-6" />,
              benefits: ['Professional portfolio', 'Client discovery', 'Industry recognition'],
              setupTime: '25 minutes',
              popularity: 67
            },
            {
              id: 'freshbooks',
              name: 'FreshBooks',
              description: 'Project-based accounting and time tracking',
              category: 'Accounting',
              icon: <FileText className="h-6 w-6" />,
              benefits: ['Time tracking', 'Project profitability', 'Expense management'],
              setupTime: '30 minutes',
              popularity: 58
            },
            {
              id: 'monday',
              name: 'Monday.com',
              description: 'Project management and client collaboration',
              category: 'Project Management',
              icon: <BarChart3 className="h-6 w-6" />,
              benefits: ['Timeline tracking', 'Client portals', 'Task automation'],
              setupTime: '35 minutes',
              popularity: 54
            }
          ],
          specialized: [
            {
              id: 'pixieset',
              name: 'Pixieset',
              description: 'Client galleries and photo delivery',
              category: 'Photo Delivery',
              icon: <Camera className="h-6 w-6" />,
              benefits: ['Client galleries', 'Download tracking', 'Print ordering'],
              setupTime: '22 minutes',
              popularity: 41
            }
          ]
        };

      default:
        return { essential: [], popular: [], specialized: [] };
    }
  };

  const integrations = getIndustryIntegrations();

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-5 w-5 text-pink-600" />;
      case 'trades': return <Wrench className="h-5 w-5 text-orange-600" />;
      case 'wellness': return <Heart className="h-5 w-5 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-5 w-5 text-amber-600" />;
      case 'creative': return <Palette className="h-5 w-5 text-purple-600" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const handleConnect = (integrationId: string, integrationName: string) => {
    if (connectedIntegrations.includes(integrationId)) {
      setConnectedIntegrations(prev => prev.filter(id => id !== integrationId));
      toast({
        title: "Integration Disconnected",
        description: `${integrationName} has been disconnected from your account`
      });
    } else {
      setConnectedIntegrations(prev => [...prev, integrationId]);
      toast({
        title: "Integration Connected",
        description: `${integrationName} is now connected to your ${selectedIndustry.name} business`
      });
    }
  };

  const renderIntegrationCard = (integration: any, category: string) => {
    const isConnected = connectedIntegrations.includes(integration.id);
    
    return (
      <Card key={integration.id} className={`transition-all ${isConnected ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                {integration.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <Badge variant="outline" className="text-xs mt-1">
                  {integration.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription>{integration.description}</CardDescription>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup time: {integration.setupTime}</span>
              <span>{integration.popularity}% of {selectedIndustry.name} businesses use this</span>
            </div>
            <Progress value={integration.popularity} className="h-1" />
          </div>

          <div className="space-y-1">
            <h5 className="text-sm font-medium">Key Benefits:</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              {integration.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleConnect(integration.id, integration.name)}
              className={`flex-1 ${isConnected ? 'bg-red-600 hover:bg-red-700' : ''}`}
              variant={isConnected ? 'destructive' : 'default'}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIndustryIcon()}
          <div>
            <h2 className="text-2xl font-bold">Industry Integrations</h2>
            <p className="text-muted-foreground">
              Connect with tools popular in {selectedIndustry.name} businesses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {connectedIntegrations.length} Connected
          </Badge>
          <Badge variant="outline" className="capitalize">
            {selectedIndustry.name}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {connectedIntegrations.length}
            </div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(integrations).flat().length}
            </div>
            <p className="text-xs text-muted-foreground">Total integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Setup Time</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              15m
            </div>
            <p className="text-xs text-muted-foreground">Average setup</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="essential">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="essential">Essential ({integrations.essential?.length || 0})</TabsTrigger>
          <TabsTrigger value="popular">Popular ({integrations.popular?.length || 0})</TabsTrigger>
          <TabsTrigger value="specialized">Specialized ({integrations.specialized?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="essential" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Essential Integrations</h3>
            <p className="text-sm text-muted-foreground">
              Must-have tools that most {selectedIndustry.name} businesses use daily
            </p>
          </div>
          <div className="grid gap-4">
            {integrations.essential?.map(integration => 
              renderIntegrationCard(integration, 'essential')
            )}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Popular Integrations</h3>
            <p className="text-sm text-muted-foreground">
              Widely adopted tools that can enhance your {selectedIndustry.name} operations
            </p>
          </div>
          <div className="grid gap-4">
            {integrations.popular?.map(integration => 
              renderIntegrationCard(integration, 'popular')
            )}
          </div>
        </TabsContent>

        <TabsContent value="specialized" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Specialized Integrations</h3>
            <p className="text-sm text-muted-foreground">
              Advanced tools for specific {selectedIndustry.name} business needs
            </p>
          </div>
          <div className="grid gap-4">
            {integrations.specialized?.map(integration => 
              renderIntegrationCard(integration, 'specialized')
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Don't see your favorite tool?</h3>
              <p className="text-sm text-muted-foreground">
                Request new integrations or explore our API for custom connections
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Request Integration
              </Button>
              <Button>
                View API Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}