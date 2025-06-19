import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIndustry } from "@/lib/industryContext";
import { 
  CheckCircle, Star, TrendingUp, Users, DollarSign,
  Scissors, Wrench, Heart, PawPrint, Palette,
  Zap, Settings, BarChart3, MessageSquare, Book,
  ArrowRight, Target, Shield, Sparkles
} from "lucide-react";

export default function IndustryOverview() {
  const { selectedIndustry } = useIndustry();
  const [activeFeature, setActiveFeature] = useState('customizations');

  const getIndustryStats = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          setupProgress: 87,
          customizations: 12,
          integrations: 8,
          templates: 15,
          automations: 6,
          insights: "Color services generate 45% more revenue than cuts alone"
        };
      case 'trades':
        return {
          setupProgress: 92,
          customizations: 14,
          integrations: 6,
          templates: 12,
          automations: 8,
          insights: "Emergency services command 2x premium pricing"
        };
      case 'wellness':
        return {
          setupProgress: 85,
          customizations: 11,
          integrations: 7,
          templates: 13,
          automations: 5,
          insights: "Package deals increase client retention by 67%"
        };
      case 'pet-care':
        return {
          setupProgress: 89,
          customizations: 10,
          integrations: 6,
          templates: 11,
          automations: 7,
          insights: "Size-based pricing improves profit margins by 23%"
        };
      case 'creative':
        return {
          setupProgress: 83,
          customizations: 13,
          integrations: 9,
          templates: 14,
          automations: 4,
          insights: "Value-based pricing increases project values by 40%"
        };
      default:
        return {
          setupProgress: 0,
          customizations: 0,
          integrations: 0,
          templates: 0,
          automations: 0,
          insights: "No insights available"
        };
    }
  };

  const stats = getIndustryStats();

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-6 w-6 text-pink-600" />;
      case 'trades': return <Wrench className="h-6 w-6 text-orange-600" />;
      case 'wellness': return <Heart className="h-6 w-6 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-6 w-6 text-amber-600" />;
      case 'creative': return <Palette className="h-6 w-6 text-purple-600" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const getIndustryColor = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return 'from-pink-500 to-rose-600';
      case 'trades': return 'from-orange-500 to-amber-600';
      case 'wellness': return 'from-green-500 to-emerald-600';
      case 'pet-care': return 'from-amber-500 to-yellow-600';
      case 'creative': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getCustomizationFeatures = () => {
    const baseFeatures = [
      {
        name: "Industry-Specific Dashboard Widgets",
        description: "Custom metrics and KPIs tailored for your business type",
        status: "active",
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        name: "Personalized Communication Templates",
        description: "Messages that speak your clients' language",
        status: "active",
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        name: "Dynamic Pricing Models",
        description: "Industry-optimized pricing strategies and modifiers",
        status: "active",
        icon: <DollarSign className="h-4 w-4" />
      },
      {
        name: "Workflow Automation Rules",
        description: "Smart automation designed for your industry patterns",
        status: "active",
        icon: <Zap className="h-4 w-4" />
      },
      {
        name: "Comprehensive Help Center",
        description: "Expert guidance and best practices for your field",
        status: "active",
        icon: <Book className="h-4 w-4" />
      },
      {
        name: "Industry Integration Hub",
        description: "Connect with tools popular in your business sector",
        status: "active",
        icon: <Settings className="h-4 w-4" />
      }
    ];

    const industrySpecific = {
      beauty: [
        {
          name: "Color Formula Tracking",
          description: "Document and organize color formulas for consistent results",
          status: "active",
          icon: <Palette className="h-4 w-4" />
        },
        {
          name: "Hair Length Pricing Multipliers",
          description: "Automatic pricing adjustments based on hair length and thickness",
          status: "active",
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          name: "Seasonal Beauty Trend Alerts",
          description: "Stay ahead with trending services and techniques",
          status: "active",
          icon: <Sparkles className="h-4 w-4" />
        }
      ],
      trades: [
        {
          name: "Emergency Service Premium Pricing",
          description: "Automatic rate adjustments for after-hours and emergency calls",
          status: "active",
          icon: <Shield className="h-4 w-4" />
        },
        {
          name: "Material Cost Tracking",
          description: "Real-time material pricing and markup calculations",
          status: "active",
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          name: "Permit and Compliance Management",
          description: "Track required permits and certifications for each job",
          status: "active",
          icon: <CheckCircle className="h-4 w-4" />
        }
      ],
      wellness: [
        {
          name: "Client Progress Tracking",
          description: "Monitor wellness goals and celebrate achievements",
          status: "active",
          icon: <Target className="h-4 w-4" />
        },
        {
          name: "Holistic Assessment Tools",
          description: "Comprehensive intake forms for wellness practitioners",
          status: "active",
          icon: <Heart className="h-4 w-4" />
        },
        {
          name: "Package Deal Optimization",
          description: "Smart package pricing to improve client retention",
          status: "active",
          icon: <Star className="h-4 w-4" />
        }
      ],
      'pet-care': [
        {
          name: "Pet Size-Based Pricing",
          description: "Automatic pricing tiers based on pet size and breed",
          status: "active",
          icon: <PawPrint className="h-4 w-4" />
        },
        {
          name: "Vaccination Reminder System",
          description: "Track and remind clients about pet health requirements",
          status: "active",
          icon: <Shield className="h-4 w-4" />
        },
        {
          name: "Behavioral Notes Tracking",
          description: "Document pet temperament and special handling needs",
          status: "active",
          icon: <Heart className="h-4 w-4" />
        }
      ],
      creative: [
        {
          name: "Project Scope Management",
          description: "Clear boundaries and revision tracking for creative work",
          status: "active",
          icon: <Target className="h-4 w-4" />
        },
        {
          name: "Usage Rights Pricing",
          description: "Automatic pricing adjustments based on usage scope",
          status: "active",
          icon: <DollarSign className="h-4 w-4" />
        },
        {
          name: "Creative Brief Templates",
          description: "Structured forms to capture client vision clearly",
          status: "active",
          icon: <Palette className="h-4 w-4" />
        }
      ]
    };

    return [...baseFeatures, ...(industrySpecific[selectedIndustry.id] || [])];
  };

  const customizationFeatures = getCustomizationFeatures();

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${getIndustryColor()} p-6 text-white`}>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {getIndustryIcon()}
            <div>
              <h1 className="text-2xl font-bold">
                Welcome to Your {selectedIndustry.name} Dashboard
              </h1>
              <p className="text-white/90">
                Fully customized for {selectedIndustry.name} professionals
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.setupProgress}%</div>
              <div className="text-sm text-white/80">Setup Complete</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.customizations}</div>
              <div className="text-sm text-white/80">Custom Features</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.integrations}</div>
              <div className="text-sm text-white/80">Integrations</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.templates}</div>
              <div className="text-sm text-white/80">Templates</div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Industry Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                💡 {stats.insights}
              </p>
              <Button size="sm" className="mt-3" variant="outline">
                View Full Analytics
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Setup Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Platform Customization</span>
                <span>{stats.setupProgress}%</span>
              </div>
              <Progress value={stats.setupProgress} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Industry configuration complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeFeature} onValueChange={setActiveFeature}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customizations">Customizations</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="customizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry-Specific Features</CardTitle>
              <CardDescription>
                Customizations designed specifically for {selectedIndustry.name} businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {customizationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{feature.name}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge variant={feature.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {feature.status === 'active' ? 'Active' : 'Coming Soon'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Smart Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">24-hour appointment reminders</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Follow-up after service</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rebooking suggestions</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dynamic Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service complexity adjustments</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak time pricing</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Package deal optimization</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Revenue Growth</span>
                </div>
                <div className="text-2xl font-bold text-green-600">+18%</div>
                <p className="text-xs text-muted-foreground">Since industry customization</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Client Retention</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">+23%</div>
                <p className="text-xs text-muted-foreground">Improved rebooking rates</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Satisfaction</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">4.9/5</div>
                <p className="text-xs text-muted-foreground">Client satisfaction score</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ready to take your {selectedIndustry.name} business to the next level?</h3>
              <p className="text-sm text-muted-foreground">
                Explore advanced features and integrations designed for your industry
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                View All Features
              </Button>
              <Button>
                Upgrade Plan
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}