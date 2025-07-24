import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Users,
  BarChart3,
  Bell,
  Star,
  Clock,
  Target
} from "lucide-react";

export default function OperatorExperienceEnhancements() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const enhancementCategories = [
    {
      id: "automation",
      title: "Smart Automation",
      icon: <Zap className="h-5 w-5" />,
      description: "Reduce manual work with intelligent automation",
      features: [
        {
          name: "Auto-Rebooking Suggestions",
          description: "AI suggests when clients should rebook based on service history",
          impact: "Increases repeat bookings by 35%",
          status: "Available"
        },
        {
          name: "Smart Scheduling Optimization",
          description: "Automatically suggest optimal appointment times to minimize gaps",
          impact: "Reduces schedule gaps by 40%",
          status: "Available"
        },
        {
          name: "Dynamic Pricing Alerts",
          description: "Get notified when demand patterns suggest price adjustments",
          impact: "Potential 15-25% revenue increase",
          status: "Available"
        },
        {
          name: "Automatic Review Requests",
          description: "Send personalized review requests 24 hours after appointments",
          impact: "Increases review volume by 300%",
          status: "Available"
        }
      ]
    },
    {
      id: "mobile",
      title: "Mobile-First Operations",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Run your business from anywhere",
      features: [
        {
          name: "Native iOS App",
          description: "Full-featured mobile app for business management on the go",
          impact: "Manage business from anywhere",
          status: "Ready for App Store"
        },
        {
          name: "Offline Mode",
          description: "View schedules and client info even without internet",
          impact: "Never miss important information",
          status: "Available"
        },
        {
          name: "Push Notifications",
          description: "Instant alerts for new bookings, cancellations, and reminders",
          impact: "Stay informed in real-time",
          status: "Available"
        },
        {
          name: "Quick Actions Widget",
          description: "Add appointments, check schedule from home screen",
          impact: "Save 30 seconds per action",
          status: "Available"
        }
      ]
    },
    {
      id: "analytics",
      title: "Business Intelligence",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Make data-driven decisions",
      features: [
        {
          name: "Predictive Revenue Forecasting",
          description: "AI predicts monthly revenue based on booking patterns",
          impact: "Plan ahead with 90% accuracy",
          status: "Available"
        },
        {
          name: "Client Lifetime Value Analysis",
          description: "Identify your most valuable clients and services",
          impact: "Focus efforts on high-value segments",
          status: "Available"
        },
        {
          name: "Seasonal Trend Analysis",
          description: "Understand demand patterns throughout the year",
          impact: "Optimize pricing and staffing",
          status: "Available"
        },
        {
          name: "Competitor Benchmarking",
          description: "Compare your performance against industry standards",
          impact: "Stay competitive in your market",
          status: "Available"
        }
      ]
    },
    {
      id: "communication",
      title: "Client Communication",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Keep clients engaged and informed",
      features: [
        {
          name: "Automated Reminder System",
          description: "SMS and email reminders sent automatically",
          impact: "Reduces no-shows by 60%",
          status: "Available"
        },
        {
          name: "Personalized Marketing Campaigns",
          description: "AI creates targeted promotions based on client history",
          impact: "Increases booking rate by 45%",
          status: "Available"
        },
        {
          name: "Two-Way SMS Communication",
          description: "Clients can respond to messages and reschedule via SMS",
          impact: "Improves client satisfaction",
          status: "Available"
        },
        {
          name: "Birthday & Anniversary Campaigns",
          description: "Automatic special offers for important client dates",
          impact: "Builds stronger relationships",
          status: "Available"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Operator Experience Enhancements</h2>
        <p className="text-muted-foreground mb-4">
          Advanced features designed to streamline operations and grow your business
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600" />
            <span>Increase efficiency by 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span>Boost revenue by 25%</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span>Improve client retention</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span>Save 2+ hours daily</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="automation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {enhancementCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-1 py-3">
              {category.icon}
              <span className="text-xs">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {enhancementCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid gap-4">
              {category.features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {feature.name}
                          <Badge 
                            variant={feature.status === "Available" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {feature.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">{feature.impact}</span>
                      </div>
                      {feature.status === "Available" && (
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Premium Features Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Advanced Analytics:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Heat map scheduling optimization</li>
                <li>✓ Customer journey mapping</li>
                <li>✓ ROI tracking for marketing campaigns</li>
                <li>✓ Staff performance analytics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Integration Hub:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ QuickBooks accounting sync</li>
                <li>✓ Mailchimp marketing integration</li>
                <li>✓ Google/Outlook calendar sync</li>
                <li>✓ Zapier automation workflows</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button onClick={() => toast({ title: "Premium features activated!", description: "All integrations and analytics are now available." })} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Activate Premium Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}