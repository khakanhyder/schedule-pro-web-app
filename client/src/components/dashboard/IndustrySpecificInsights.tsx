import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  Scissors, Heart, Wrench, Leaf, Home, TrendingUp, Calendar, 
  DollarSign, Users, Target, Clock, Star, AlertTriangle, CheckCircle 
} from "lucide-react";
import { useIndustry, industryTemplates } from "@/lib/industryContext";

interface IndustryInsight {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: any;
  recommendations: string[];
}

const industrySpecificInsights = {
  beauty: {
    icon: Scissors,
    color: "indigo",
    insights: [
      {
        category: "Seasonal Trends",
        title: "Wedding Season Revenue Opportunity",
        description: "April-September bookings typically increase 40%. Prepare for bridal packages.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Create bridal service packages (trial + wedding day)",
          "Offer early booking discounts for spring weddings",
          "Partner with wedding venues for referral programs",
          "Build portfolio with before/after wedding photos"
        ]
      },
      {
        category: "Client Retention",
        title: "Color Touch-Up Optimization",
        description: "Clients who book color touch-ups within 6 weeks have 85% higher retention.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Send automatic reminders at 4-week mark",
          "Offer touch-up packages at 20% discount",
          "Create loyalty program for regular color clients",
          "Use before/after photos to showcase color maintenance"
        ]
      },
      {
        category: "Service Upselling",
        title: "Treatment Add-On Potential",
        description: "Deep conditioning treatments have 60% acceptance rate when offered mid-service.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Train staff to assess hair condition during wash",
          "Offer mini treatments as 'upgrades' for $15-25",
          "Create treatment packages for damaged hair",
          "Display treatment results on social media"
        ]
      }
    ]
  },
  
  petServices: {
    icon: Heart,
    color: "green",
    insights: [
      {
        category: "Customer Experience",
        title: "Instant Photo Sharing Success",
        description: "Before/after grooming photos shared within 30 minutes increase customer satisfaction by 89% and generate 40% more repeat bookings.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Enable automatic photo sharing after each appointment",
          "Train staff to capture before/during/after photos",
          "Add personal notes with each photo share",
          "Request feedback and ratings with photo delivery"
        ]
      },
      {
        category: "Operations Efficiency", 
        title: "Boarding & Daycare Capacity Management",
        description: "Optimizing boarding schedules and daycare capacity can increase revenue by 35% while maintaining quality care standards.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Track daily boarding capacity and utilization rates",
          "Group daycare pets by size and energy level", 
          "Schedule staff based on expected daily boarding count",
          "Offer premium rates for holiday and peak season boarding"
        ]
      },
      {
        category: "Revenue Growth",
        title: "24/7 Online Booking Impact", 
        description: "Pet parents book 60% more appointments when they can see real-time availability and book online anytime, especially evenings and weekends.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Enable 24/7 online booking with real-time calendar",
          "Show available time slots and service duration",
          "Allow booking modifications and cancellations online",
          "Send automatic confirmations and reminders"
        ]
      },
      {
        category: "Service Quality",
        title: "Breed-Specific Service Recommendations",
        description: "Using breed databases to suggest appropriate services increases average service value by 30% and improves grooming outcomes.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Access comprehensive breed grooming database",
          "Suggest breed-appropriate services and frequency",
          "Educate pet parents on breed-specific needs",
          "Adjust pricing based on breed coat complexity"
        ]
      },
      {
        category: "Communication Excellence",
        title: "Automated Reminder System",
        description: "Automated SMS and email reminders reduce no-shows by 75% and improve customer communication satisfaction.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Send appointment reminders 24 hours in advance",
          "Include appointment details and preparation instructions",
          "Allow easy rescheduling through reminder messages",
          "Follow up with service feedback requests"
        ]
      },
      {
        category: "Seasonal Strategy",
        title: "Seasonal Service Campaigns",
        description: "Targeted seasonal campaigns (summer de-shedding, holiday grooming, winter paw care) drive 35% revenue increases during peak periods.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Launch summer de-shedding campaigns in May-August",
          "Promote holiday grooming packages in November-December",
          "Offer winter paw protection services",
          "Create seasonal service bundles with discounts"
        ]
      }
    ]
  },
  
  skilledTrades: {
    icon: Wrench,
    color: "orange",
    insights: [
      {
        category: "Project Timing",
        title: "Storm Season Preparation",
        description: "Weather-related repairs increase 200% during storm season. Prepare inventory.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Stock emergency repair materials by May",
          "Create 'storm damage' service packages",
          "Offer priority scheduling for storm repairs",
          "Partner with insurance companies for direct billing"
        ]
      },
      {
        category: "Revenue Optimization",
        title: "Maintenance Contract Potential",
        description: "Recurring maintenance contracts generate 3x more annual revenue per client.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Offer annual maintenance packages at 20% discount",
          "Create seasonal maintenance checklists",
          "Send automatic maintenance reminders",
          "Provide priority scheduling for contract customers"
        ]
      },
      {
        category: "Material Management",
        title: "Supply Chain Optimization",
        description: "Material costs fluctuate 15-30% seasonally. Time purchases strategically.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Buy materials in bulk during low-demand periods",
          "Create material cost tracking spreadsheet",
          "Offer fixed-price contracts during stable periods",
          "Build relationships with multiple suppliers"
        ]
      }
    ]
  },
  
  wellness: {
    icon: Leaf,
    color: "emerald",
    insights: [
      {
        category: "Wellness Trends",
        title: "New Year Wellness Surge",
        description: "January bookings increase 120% as clients pursue wellness goals.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Create 'New Year, New You' packages in December",
          "Offer goal-setting sessions with treatment plans",
          "Partner with fitness centers for cross-promotion",
          "Launch social media wellness challenges"
        ]
      },
      {
        category: "Client Retention",
        title: "Stress-Relief Service Demand",
        description: "Stress-relief treatments have 90% rebooking rate when offered monthly.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Create monthly stress-relief memberships",
          "Offer corporate wellness packages for businesses",
          "Send stress management tips between appointments",
          "Partner with mental health professionals"
        ]
      },
      {
        category: "Seasonal Services",
        title: "Detox Season Opportunity",
        description: "Spring detox services see 80% higher demand in March-May.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Launch spring detox programs in February",
          "Create 21-day wellness challenge packages",
          "Offer group detox sessions at reduced rates",
          "Partner with nutritionists for comprehensive programs"
        ]
      }
    ]
  },
  
  homeServices: {
    icon: Home,
    color: "blue",
    insights: [
      {
        category: "Seasonal Demand",
        title: "Spring Cleaning Revenue Peak",
        description: "March-May cleaning services increase 150%. Expand capacity early.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Hire seasonal cleaning staff by February",
          "Create 'spring deep clean' packages",
          "Offer early booking discounts in January",
          "Partner with organizing professionals"
        ]
      },
      {
        category: "Service Expansion",
        title: "Moving Season Opportunity",
        description: "Summer moving services can triple monthly revenue for cleaning businesses.",
        priority: "high" as const,
        actionable: true,
        recommendations: [
          "Create move-in/move-out cleaning packages",
          "Partner with real estate agents and moving companies",
          "Offer same-day cleaning for urgent moves",
          "Create checklist for move-out cleaning"
        ]
      },
      {
        category: "Client Retention",
        title: "Recurring Service Value",
        description: "Weekly/bi-weekly clients generate 5x more revenue than one-time cleanings.",
        priority: "medium" as const,
        actionable: true,
        recommendations: [
          "Offer recurring service discounts (10-15% off)",
          "Create loyalty programs for long-term clients",
          "Send quality check-ins after each service",
          "Provide priority scheduling for recurring clients"
        ]
      }
    ]
  }
};

export default function IndustrySpecificInsights() {
  const { selectedIndustry } = useIndustry();
  
  // Get current industry template
  const currentTemplate = selectedIndustry || industryTemplates[0];
  const industryKey = currentTemplate.id as keyof typeof industrySpecificInsights;
  const industryData = industrySpecificInsights[industryKey] || industrySpecificInsights.beauty;
  
  const IconComponent = industryData.icon;
  
  // Fetch real appointment data for context
  const { data: appointments } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: () => apiRequest('GET', '/api/appointments').then(res => res.json())
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Industry Header */}
      <Card className={`border-l-4 border-l-${industryData.color}-500 bg-gradient-to-r from-${industryData.color}-50 to-white`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${industryData.color}-100`}>
              <IconComponent className={`h-6 w-6 text-${industryData.color}-600`} />
            </div>
            <div>
              <CardTitle className="text-xl">{currentTemplate.name} Industry Insights</CardTitle>
              <CardDescription>
                Tailored intelligence and opportunities for {currentTemplate.professionalName.toLowerCase()} businesses
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {industryData.insights.map((insight, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {insight.category}
                </Badge>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(insight.priority)}
                  <Badge variant={getPriorityBadgeVariant(insight.priority)} className="text-xs">
                    {insight.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Action Steps
                </h4>
                <ul className="space-y-2">
                  {insight.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {insight.actionable && (
                <div className="pt-3 border-t">
                  <Button 
                    size="sm" 
                    className={`w-full bg-${industryData.color}-600 hover:bg-${industryData.color}-700`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Implement Strategy
                  </Button>
                </div>
              )}
            </CardContent>
            
            {/* Priority accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              insight.priority === 'high' ? 'from-red-500 to-red-600' :
              insight.priority === 'medium' ? 'from-yellow-500 to-yellow-600' :
              'from-green-500 to-green-600'
            }`} />
          </Card>
        ))}
      </div>

      {/* Industry-Specific Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions for {currentTemplate.name}
          </CardTitle>
          <CardDescription>
            Common tasks and optimizations for {currentTemplate.professionalName.toLowerCase()} businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto p-4 text-left">
              <div className="space-y-1">
                <div className="font-semibold text-sm">Price Analysis</div>
                <div className="text-xs text-muted-foreground">
                  Compare rates with competitors
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4 text-left">
              <div className="space-y-1">
                <div className="font-semibold text-sm">Service Packages</div>
                <div className="text-xs text-muted-foreground">
                  Create bundled offerings
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4 text-left">
              <div className="space-y-1">
                <div className="font-semibold text-sm">Seasonal Planning</div>
                <div className="text-xs text-muted-foreground">
                  Prepare for demand changes
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4 text-left">
              <div className="space-y-1">
                <div className="font-semibold text-sm">Client Retention</div>
                <div className="text-xs text-muted-foreground">
                  Build loyalty programs
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}