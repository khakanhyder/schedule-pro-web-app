import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Calendar,
  Clock,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from "lucide-react";
import { useIndustry } from "@/lib/industryContext";
import { useToast } from "@/hooks/use-toast";

export default function ExecutiveDashboard() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("30d");

  const handleExportReport = (reportType: string) => {
    toast({ 
      title: "Executive Report Generated", 
      description: `${reportType} report has been exported and is ready for download.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Executive Dashboard</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Real-Time Analytics
          </Badge>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExportReport("Executive Summary")}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$34,247</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +23.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">847</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              +12.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94.2%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              +5.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Service Value</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$127</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-orange-600" />
              +8.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
          <TabsTrigger value="operations">Operations Overview</TabsTrigger>
          <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Business Health Score
                </CardTitle>
                <CardDescription>
                  Overall business performance indicator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
                  <Badge className="bg-green-600">Excellent Performance</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-sm text-green-600">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Growth</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm text-green-600">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Operational Efficiency</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-20 h-2" />
                      <span className="text-sm text-yellow-600">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Position</span>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="w-20 h-2" />
                      <span className="text-sm text-green-600">89%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  Real-Time Performance
                </CardTitle>
                <CardDescription>
                  Live business metrics updating every minute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-blue-600">Today's Bookings</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$2,847</div>
                    <div className="text-sm text-green-600">Today's Revenue</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">96%</div>
                    <div className="text-sm text-purple-600">Capacity Utilization</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4.8★</div>
                    <div className="text-sm text-orange-600">Avg. Rating Today</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Peak Hours Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">10am - 12pm</span>
                      <Badge variant="outline" className="text-red-600">Overbooked</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">2pm - 4pm</span>
                      <Badge variant="outline" className="text-green-600">Optimal</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">6pm - 8pm</span>
                      <Badge variant="outline" className="text-yellow-600">Available</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>
                  Revenue distribution by service category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premium Services</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm font-medium">$15,411 (45%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Standard Services</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-20 h-2" />
                      <span className="text-sm font-medium">$11,986 (35%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Add-on Services</span>
                    <div className="flex items-center gap-2">
                      <Progress value={12} className="w-20 h-2" />
                      <span className="text-sm font-medium">$4,110 (12%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Product Sales</span>
                    <div className="flex items-center gap-2">
                      <Progress value={8} className="w-20 h-2" />
                      <span className="text-sm font-medium">$2,740 (8%)</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Revenue</span>
                    <span className="text-green-600">$34,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Growth Projections
                </CardTitle>
                <CardDescription>
                  AI-powered revenue forecasting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">Next Month Projection</span>
                      <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">$42,150</div>
                    <p className="text-sm text-blue-600">+23% growth expected</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-800">Quarter Projection</span>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">$118,500</div>
                    <p className="text-sm text-green-600">+31% quarterly growth</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Growth Drivers</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>New client acquisition</span>
                        <span className="text-green-600">+$8,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service upselling</span>
                        <span className="text-green-600">+$4,900</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium pricing</span>
                        <span className="text-green-600">+$3,100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Operational Efficiency
                </CardTitle>
                <CardDescription>
                  Time management and resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-purple-600">Schedule Efficiency</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">4.2min</div>
                    <div className="text-sm text-indigo-600">Avg. Turnaround</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">No-show rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={12} className="w-20 h-2" />
                      <span className="text-sm text-green-600">3.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-time performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="w-20 h-2" />
                      <span className="text-sm text-green-600">89%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client wait time</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20 h-2" />
                      <span className="text-sm text-green-600">6.3min avg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Productivity Insights
                </CardTitle>
                <CardDescription>
                  Staff performance and productivity metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Top Performer</h4>
                    <p className="text-sm text-muted-foreground">Sarah Johnson - $12,450 revenue this month</p>
                    <Badge variant="outline" className="text-green-600 mt-1">+34% vs. average</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Most Booked Service</h4>
                    <p className="text-sm text-muted-foreground">Premium Color Treatment - 89 bookings</p>
                    <Badge variant="outline" className="text-blue-600 mt-1">High demand</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Peak Productivity Hour</h4>
                    <p className="text-sm text-muted-foreground">2pm-3pm - 97% efficiency rate</p>
                    <Badge variant="outline" className="text-purple-600 mt-1">Optimal time</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Smart Business Alerts
                </CardTitle>
                <CardDescription>
                  AI-powered notifications for critical business events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-red-800">Revenue Drop Alert</h4>
                        <p className="text-sm text-red-600">This week's revenue is 15% below average</p>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                      View Analysis
                    </Button>
                  </div>

                  <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-yellow-800">Capacity Warning</h4>
                        <p className="text-sm text-yellow-600">Saturday slots are 95% booked - consider overtime</p>
                      </div>
                      <Badge className="bg-yellow-600">Attention</Badge>
                    </div>
                    <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                      Manage Schedule
                    </Button>
                  </div>

                  <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-800">Growth Opportunity</h4>
                        <p className="text-sm text-green-600">New service demand detected - 34 client inquiries</p>
                      </div>
                      <Badge className="bg-green-600">Opportunity</Badge>
                    </div>
                    <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                      Explore Service
                    </Button>
                  </div>

                  <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-blue-800">Marketing Success</h4>
                        <p className="text-sm text-blue-600">Email campaign achieved 34% conversion rate</p>
                      </div>
                      <Badge className="bg-blue-600">Success</Badge>
                    </div>
                    <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                      Replicate Campaign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}