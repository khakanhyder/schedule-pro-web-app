import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, DollarSign, Users, MessageSquare, Target, Star, Shield, Zap } from "lucide-react";
import { useIndustry } from "@/lib/industryContext";

interface RevenueMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface GrowthOpportunity {
  id: string;
  title: string;
  description: string;
  potentialRevenue: string;
  effort: "low" | "medium" | "high";
  priority: number;
  category: string;
}

export default function BusinessGrowthHub() {
  const [selectedTab, setSelectedTab] = useState("revenue");
  const { selectedIndustry } = useIndustry();
  const queryClient = useQueryClient();

  // Mock data for now - will be replaced with real API calls
  const revenueMetrics: RevenueMetric[] = [
    { label: "Monthly Revenue", value: "$8,450", change: "+12%", trend: "up" },
    { label: "Avg Transaction", value: "$85", change: "+8%", trend: "up" },
    { label: "Client Retention", value: "78%", change: "+5%", trend: "up" },
    { label: "No-Show Rate", value: "8%", change: "-3%", trend: "up" }
  ];

  const growthOpportunities: GrowthOpportunity[] = [
    {
      id: "1",
      title: "Implement Service Packages",
      description: "Bundle popular services to increase average transaction value",
      potentialRevenue: "+$1,200/month",
      effort: "low",
      priority: 1,
      category: "pricing"
    },
    {
      id: "2", 
      title: "Peak Hour Premium Pricing",
      description: "Charge 20% more during high-demand time slots",
      potentialRevenue: "+$800/month",
      effort: "low",
      priority: 2,
      category: "pricing"
    },
    {
      id: "3",
      title: "Automated Review Follow-up",
      description: "Send review requests to boost online reputation and attract new clients",
      potentialRevenue: "+$2,400/month",
      effort: "medium",
      priority: 1,
      category: "marketing"
    },
    {
      id: "4",
      title: "VIP Client Program", 
      description: "Create premium tier for high-value clients with priority booking",
      potentialRevenue: "+$1,800/month",
      effort: "medium",
      priority: 2,
      category: "retention"
    }
  ];

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↗️";
    if (trend === "down") return "↘️";
    return "→";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Growth Hub</h2>
        <p className="text-muted-foreground">
          Actionable insights and opportunities to grow your {selectedIndustry.name.toLowerCase()} business
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="opportunities">Growth</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {getTrendIcon(metric.trend)} {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Forecast
              </CardTitle>
              <CardDescription>
                Based on current trends and implemented optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Monthly Revenue</span>
                  <span className="font-bold">$8,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Projected Revenue (6 months)</span>
                  <span className="font-bold text-green-600">$12,680</span>
                </div>
                <Progress value={67} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  +50% growth potential with recommended optimizations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-4">
            {growthOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {opportunity.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-green-100 text-green-800 font-semibold">
                        {opportunity.potentialRevenue}
                      </Badge>
                      <Badge className={getEffortColor(opportunity.effort)}>
                        {opportunity.effort} effort
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{opportunity.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Priority: {opportunity.priority}
                      </span>
                    </div>
                    <Button size="sm" style={{ backgroundColor: selectedIndustry.primaryColor }}>
                      Implement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Client Lifecycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>New Clients (30 days)</span>
                  <span className="font-bold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Returning Clients</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>At-Risk Clients</span>
                  <span className="font-bold text-orange-600">8</span>
                </div>
                <Button className="w-full" variant="outline">
                  View Client Insights
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  No-Show Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Deposit Collection Rate</span>
                  <span className="font-bold">73%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revenue Protected</span>
                  <span className="font-bold text-green-600">$1,240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>No-Show Reduction</span>
                  <span className="font-bold">-65%</span>
                </div>
                <Button className="w-full" style={{ backgroundColor: selectedIndustry.primaryColor }}>
                  Setup Deposits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Automation
                </CardTitle>
                <CardDescription>
                  Automated messages that save time and improve client experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Appointment Confirmations</p>
                    <p className="text-sm text-muted-foreground">24h before appointment</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Review Requests</p>
                    <p className="text-sm text-muted-foreground">2h after appointment</p>
                  </div>
                  <Button size="sm" variant="outline">Setup</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Rebook Reminders</p>
                    <p className="text-sm text-muted-foreground">Based on service frequency</p>
                  </div>
                  <Button size="sm" variant="outline">Setup</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Pricing
                </CardTitle>
                <CardDescription>
                  Dynamic pricing based on demand and market conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Peak Hour Pricing</p>
                    <p className="text-sm text-muted-foreground">+20% during high demand</p>
                  </div>
                  <Button size="sm" variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Last-Minute Discounts</p>
                    <p className="text-sm text-muted-foreground">Fill empty slots automatically</p>
                  </div>
                  <Button size="sm" variant="outline">Setup</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}