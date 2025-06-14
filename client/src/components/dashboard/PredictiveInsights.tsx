import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Target,
  AlertTriangle,
  Clock,
  Zap,
  Brain,
  ChartBar
} from "lucide-react";
import { useIndustry } from "@/lib/industryContext";
import { useToast } from "@/hooks/use-toast";

export default function PredictiveInsights() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();

  const handleImplementSuggestion = (suggestion: string) => {
    toast({ 
      title: "Business Action Implemented", 
      description: `${suggestion} has been activated for your ${selectedIndustry.name} business.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Predictive Business Intelligence</h2>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          AI-Powered
        </Badge>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="font-medium mb-2">What competitors don't have:</h3>
        <p className="text-sm text-muted-foreground">
          Predictive analytics that tells you exactly when to raise prices, which clients will cancel, 
          and what services to offer next - before it happens.
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Optimization</TabsTrigger>
          <TabsTrigger value="client-risk">Client Risk Analysis</TabsTrigger>
          <TabsTrigger value="demand">Demand Forecasting</TabsTrigger>
          <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Dynamic Pricing Recommendations
                </CardTitle>
                <CardDescription>
                  AI analyzes market demand to suggest optimal pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-800">Increase Color Services +15%</h4>
                        <p className="text-sm text-green-600">High demand detected, low competition</p>
                      </div>
                      <Badge className="bg-green-600">+$2,340/month</Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-green-600 mt-1">85% confidence - implement immediately</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-blue-800">Premium Weekend Slots +25%</h4>
                        <p className="text-sm text-blue-600">Weekend demand exceeds capacity</p>
                      </div>
                      <Badge className="bg-blue-600">+$1,890/month</Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={92} className="h-2" />
                      <p className="text-xs text-blue-600 mt-1">92% confidence - high impact opportunity</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleImplementSuggestion("Dynamic pricing optimization")}
                >
                  Implement Pricing Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Upselling Opportunities
                </CardTitle>
                <CardDescription>
                  Identify clients most likely to purchase additional services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Sarah Mitchell</h4>
                    <p className="text-sm text-muted-foreground">97% likely to book facial add-on</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-green-600">High Value Client</Badge>
                      <Badge variant="outline" className="text-purple-600">+$85 potential</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Emma Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">89% likely to upgrade to premium package</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-green-600">Loyal Client</Badge>
                      <Badge variant="outline" className="text-purple-600">+$120 potential</Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleImplementSuggestion("Automated upselling campaigns")}
                >
                  Send Targeted Offers
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="client-risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  At-Risk Client Detection
                </CardTitle>
                <CardDescription>
                  Identify clients likely to stop booking before they do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-red-800">Jessica Chen</h4>
                        <p className="text-sm text-red-600">78% likely to churn in next 30 days</p>
                      </div>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <p className="text-xs text-red-600 mt-1">Last booking: 6 weeks ago (usually books every 4 weeks)</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-yellow-800">Michael Torres</h4>
                        <p className="text-sm text-yellow-600">45% likely to reduce frequency</p>
                      </div>
                      <Badge className="bg-yellow-600">Medium Risk</Badge>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">Booking pattern changing - needs re-engagement</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleImplementSuggestion("Client retention campaigns")}
                >
                  Launch Retention Campaign
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Client Lifetime Value Predictions
                </CardTitle>
                <CardDescription>
                  Forecast long-term client value and investment priority
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$3,420</div>
                    <div className="text-sm text-green-600">Avg. Lifetime Value</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">18 months</div>
                    <div className="text-sm text-blue-600">Avg. Client Lifespan</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">High-value clients identified</span>
                    <Badge variant="outline" className="text-green-600">23 clients</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Growth potential clients</span>
                    <Badge variant="outline" className="text-blue-600">47 clients</Badge>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleImplementSuggestion("VIP client program")}
                >
                  Create VIP Program
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5 text-purple-600" />
                  Seasonal Demand Patterns
                </CardTitle>
                <CardDescription>
                  Predict busy periods and optimize staffing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-purple-50">
                    <h4 className="font-medium text-purple-800">Wedding Season Surge</h4>
                    <p className="text-sm text-purple-600">Expected 40% increase in bookings April-June</p>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-purple-600 mt-1">Recommend booking 2 additional stylists</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-orange-50">
                    <h4 className="font-medium text-orange-800">Holiday Preparation</h4>
                    <p className="text-sm text-orange-600">Pre-holiday rush expected mid-November</p>
                    <div className="mt-2">
                      <Progress value={60} className="h-2" />
                      <p className="text-xs text-orange-600 mt-1">Start marketing campaigns in October</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleImplementSuggestion("Seasonal staffing optimization")}
                >
                  Optimize Seasonal Planning
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  Optimal Booking Windows
                </CardTitle>
                <CardDescription>
                  Find the best times to maximize revenue per hour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Prime Time Slots</h4>
                    <p className="text-sm text-muted-foreground">Saturday 10am-4pm: 95% premium pricing acceptance</p>
                    <Badge variant="outline" className="text-green-600 mt-1">High Revenue</Badge>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Opportunity Windows</h4>
                    <p className="text-sm text-muted-foreground">Tuesday 2pm-5pm: 65% capacity, offer incentives</p>
                    <Badge variant="outline" className="text-orange-600 mt-1">Fill Gaps</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">87%</div>
                    <div className="text-sm text-indigo-600">Optimal Utilization</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-green-600">Revenue Increase</div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleImplementSuggestion("Dynamic scheduling optimization")}
                >
                  Optimize Time Slots
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Untapped Revenue Streams
                </CardTitle>
                <CardDescription>
                  Discover new services your clients actually want
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-yellow-800">Brow Lamination Service</h4>
                        <p className="text-sm text-yellow-600">67% of clients asked about this service</p>
                      </div>
                      <Badge className="bg-yellow-600">+$4,200/month</Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={90} className="h-2" />
                      <p className="text-xs text-yellow-600 mt-1">High demand, easy to implement</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-800">Home Visit Premium</h4>
                        <p className="text-sm text-green-600">32% willing to pay 50% premium for home service</p>
                      </div>
                      <Badge className="bg-green-600">+$2,800/month</Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-green-600 mt-1">Premium pricing opportunity</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleImplementSuggestion("New service launch plan")}
                >
                  Launch New Services
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Market Expansion Opportunities
                </CardTitle>
                <CardDescription>
                  Find the best areas and demographics to target
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Corporate Partnerships</h4>
                    <p className="text-sm text-muted-foreground">3 nearby offices need employee wellness programs</p>
                    <Badge variant="outline" className="text-blue-600 mt-1">B2B Opportunity</Badge>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Younger Demographics</h4>
                    <p className="text-sm text-muted-foreground">25-35 age group underrepresented in client base</p>
                    <Badge variant="outline" className="text-purple-600 mt-1">Market Gap</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">47%</div>
                    <div className="text-sm text-blue-600">Market Share Potential</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$8.2k</div>
                    <div className="text-sm text-purple-600">Monthly Opportunity</div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleImplementSuggestion("Market expansion strategy")}
                >
                  Expand Market Reach
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}