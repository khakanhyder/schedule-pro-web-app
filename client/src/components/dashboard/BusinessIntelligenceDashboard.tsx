import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Star,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Brain,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BusinessMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalClients: number;
  clientGrowth: number;
  totalBookings: number;
  bookingGrowth: number;
  averageBookingValue: number;
  clientRetentionRate: number;
  popularServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: string;
    bookings: number;
  }>;
}

interface GrowthInsight {
  id: string;
  type: "opportunity" | "warning" | "success";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  recommendation?: string;
}

const SAMPLE_METRICS: BusinessMetrics = {
  totalRevenue: 12450,
  revenueGrowth: 18.5,
  totalClients: 127,
  clientGrowth: 12.3,
  totalBookings: 89,
  bookingGrowth: 8.7,
  averageBookingValue: 67.50,
  clientRetentionRate: 78.5,
  popularServices: [
    { name: "Haircut & Style", bookings: 45, revenue: 2850 },
    { name: "Hair Color", bookings: 23, revenue: 3220 },
    { name: "Highlights", bookings: 15, revenue: 2100 },
    { name: "Deep Conditioning", bookings: 12, revenue: 720 }
  ],
  peakHours: [
    { hour: "10:00 AM", bookings: 12 },
    { hour: "2:00 PM", bookings: 15 },
    { hour: "4:00 PM", bookings: 18 },
    { hour: "6:00 PM", bookings: 14 }
  ]
};

const GROWTH_INSIGHTS: GrowthInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Expand Weekend Hours",
    description: "Saturday 4-6 PM shows 23% higher booking demand than available slots",
    impact: "high",
    actionable: true,
    recommendation: "Add 2 more weekend time slots to capture $890 additional monthly revenue"
  },
  {
    id: "2",
    type: "warning",
    title: "Client Retention Declining",
    description: "15% of regular clients haven't booked in 45+ days",
    impact: "medium",
    actionable: true,
    recommendation: "Launch automated win-back campaign with 10% discount offer"
  },
  {
    id: "3",
    type: "success",
    title: "Color Services Trending Up",
    description: "Hair color bookings increased 34% this month vs last month",
    impact: "high",
    actionable: true,
    recommendation: "Consider adding premium color services or color specialist staff"
  },
  {
    id: "4",
    type: "opportunity",
    title: "Upselling Potential",
    description: "68% of haircut clients could be offered add-on treatments",
    impact: "medium",
    actionable: true,
    recommendation: "Train staff on upselling techniques for deep conditioning and styling"
  }
];

export default function BusinessIntelligenceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [metrics] = useState<BusinessMetrics>(SAMPLE_METRICS);
  const [insights] = useState<GrowthInsight[]>(GROWTH_INSIGHTS);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInsightIcon = (type: GrowthInsight['type']) => {
    switch (type) {
      case "opportunity": return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getImpactColor = (impact: GrowthInsight['impact']) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Intelligence</h1>
          <p className="text-muted-foreground">
            AI-powered insights to grow your business
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === "7d" ? "7 Days" : 
               period === "30d" ? "30 Days" :
               period === "90d" ? "90 Days" : "1 Year"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              +{metrics.revenueGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              +{metrics.clientGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              +{metrics.bookingGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.averageBookingValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              Industry avg: $45.20
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Client Analysis
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <Card key={insight.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{insight.description}</p>
                  {insight.recommendation && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">💡 Recommendation:</p>
                      <p className="text-sm text-blue-800">{insight.recommendation}</p>
                    </div>
                  )}
                  {insight.actionable && (
                    <Button size="sm" className="w-full">
                      Take Action
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Top performing services by bookings and revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.popularServices.map((service, index) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{service.name}</span>
                      <span>{formatCurrency(service.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{service.bookings} bookings</span>
                      <span>{formatCurrency(service.revenue / service.bookings)} avg</span>
                    </div>
                    <Progress value={(service.bookings / metrics.popularServices[0].bookings) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>Busiest times for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.peakHours.map((hour, index) => (
                  <div key={hour.hour} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{hour.hour}</span>
                      <span>{hour.bookings} bookings</span>
                    </div>
                    <Progress value={(hour.bookings / Math.max(...metrics.peakHours.map(h => h.bookings))) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue performance and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Revenue chart visualization would appear here</p>
                  <p className="text-sm">Integration with charting library recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.clientRetentionRate}%</div>
                <Progress value={metrics.clientRetentionRate} className="mb-2" />
                <p className="text-sm text-muted-foreground">Industry average: 65%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">23</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +15% this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>At-Risk Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">8</div>
                <p className="text-sm text-muted-foreground">45+ days since last visit</p>
                <Button size="sm" className="mt-2 w-full">
                  Send Win-Back Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Client Segmentation</CardTitle>
              <CardDescription>Understand your client base better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>VIP Clients (5+ visits)</span>
                  <Badge variant="secondary">34 clients</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Regular Clients (2-4 visits)</span>
                  <Badge variant="secondary">67 clients</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>New Clients (1 visit)</span>
                  <Badge variant="secondary">26 clients</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Optimization</CardTitle>
                <CardDescription>AI-recommended pricing adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Hair Color Service</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current: $75 → Recommended: $85
                  </p>
                  <p className="text-sm text-green-600">+$230 estimated monthly increase</p>
                  <Button size="sm" className="mt-2">Apply Pricing</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Deep Conditioning</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current: $25 → Recommended: $30
                  </p>
                  <p className="text-sm text-green-600">+$120 estimated monthly increase</p>
                  <Button size="sm" className="mt-2">Apply Pricing</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Optimization</CardTitle>
                <CardDescription>Maximize your booking efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Add Saturday 6-8 PM</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    High demand period with 85% booking probability
                  </p>
                  <p className="text-sm text-green-600">+$680 estimated monthly revenue</p>
                  <Button size="sm" className="mt-2">Update Schedule</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Reduce Tuesday 10-12 PM</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Low demand period with 32% booking rate
                  </p>
                  <p className="text-sm text-blue-600">Reallocate time for peak hours</p>
                  <Button size="sm" variant="outline" className="mt-2">Consider Change</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Opportunities</CardTitle>
              <CardDescription>Data-driven expansion recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Package Deals</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    68% of clients book multiple services
                  </p>
                  <p className="text-sm text-green-600">Create "Cut + Color" package for 15% savings</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">💄 Add-On Services</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Eyebrow services requested 23 times this month
                  </p>
                  <p className="text-sm text-green-600">Potential $450/month additional revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}