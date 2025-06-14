import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  MessageSquare, 
  Zap, 
  BarChart3, 
  Clock, 
  CreditCard,
  Users,
  Bell,
  Smartphone,
  MapPin,
  Camera,
  FileText,
  TrendingUp,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedFeatures() {
  const [selectedTab, setSelectedTab] = useState("automation");
  const { toast } = useToast();

  const handleSetup = (feature: string) => {
    toast({ title: `${feature} setup initiated!` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Advanced Business Features</h2>
        <Badge variant="outline" className="bg-purple-50">Pro Features</Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="automation">Smart Automation</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Features</TabsTrigger>
          <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          <TabsTrigger value="analytics">Business Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Smart SMS & Email Campaigns
                </CardTitle>
                <CardDescription>
                  Automated client communication with personalized messaging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Appointment Reminders</h4>
                    <p className="text-sm text-muted-foreground">24hr, 2hr, and 30min before</p>
                    <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Birthday Campaigns</h4>
                    <p className="text-sm text-muted-foreground">Automatic birthday specials</p>
                    <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">No-Show Follow-ups</h4>
                    <p className="text-sm text-muted-foreground">Automatic rebooking offers</p>
                    <Badge variant="outline">Setup</Badge>
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleSetup("SMS Campaigns")}>
                  Configure Campaigns
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Waitlist Management
                </CardTitle>
                <CardDescription>
                  Smart waitlist with automatic booking when slots open
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-blue-600">On Waitlist</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">7</div>
                    <div className="text-sm text-green-600">Auto-Booked</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-notify when available</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Priority booking for VIPs</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleSetup("Waitlist")}>
                  Manage Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Smart Business Insights & Alerts
              </CardTitle>
              <CardDescription>
                Real-time notifications and business intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border-l-4 border-red-500 bg-red-50">
                  <h4 className="font-medium text-red-800">Revenue Alert</h4>
                  <p className="text-sm text-red-600">Today's revenue 20% below average</p>
                  <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-800">Booking Surge</h4>
                  <p className="text-sm text-green-600">150% more bookings this week</p>
                  <Button size="sm" variant="outline" className="mt-2">Optimize</Button>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-800">Client Milestone</h4>
                  <p className="text-sm text-blue-600">Sarah reached 10 visits - reward?</p>
                  <Button size="sm" variant="outline" className="mt-2">Send Reward</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Check-In & Forms
                </CardTitle>
                <CardDescription>
                  Contactless check-in with digital intake forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">QR Code Check-In</h4>
                  <div className="w-24 h-24 bg-black mx-auto mb-2 flex items-center justify-center text-white text-xs">
                    QR CODE
                  </div>
                  <p className="text-sm text-center">Clients scan to check-in</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Send check-in link via SMS</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Collect health forms digitally</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Photo consent forms</span>
                    <Switch />
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleSetup("Mobile Check-In")}>
                  Setup Mobile Check-In
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mobile Service Management
                </CardTitle>
                <CardDescription>
                  Tools for mobile businesses and house calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Route Optimization</h4>
                    <p className="text-sm text-muted-foreground">Smart scheduling by location</p>
                    <Badge variant="outline" className="text-blue-600 mt-1">Coming Soon</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Travel Time Calculator</h4>
                    <p className="text-sm text-muted-foreground">Auto-add travel between appointments</p>
                    <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">GPS Client Locations</h4>
                    <p className="text-sm text-muted-foreground">Save and navigate to client addresses</p>
                    <Badge variant="outline" className="text-green-600 mt-1">Active</Badge>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleSetup("Mobile Services")}>
                  Configure Mobile Tools
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Before/After Photo Management
              </CardTitle>
              <CardDescription>
                Professional photo tools for portfolio and marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium">Auto Photo Reminders</h4>
                  <p className="text-sm text-muted-foreground">Prompt for before/after shots</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Client Consent</h4>
                  <p className="text-sm text-muted-foreground">Digital photo release forms</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">Auto Social Posts</h4>
                  <p className="text-sm text-muted-foreground">Share with client permission</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Integrated Point of Sale
                </CardTitle>
                <CardDescription>
                  Complete POS system with inventory management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$1,240</div>
                    <div className="text-sm text-green-600">Today's Sales</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">28</div>
                    <div className="text-sm text-blue-600">Items Sold</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quick Sale Items</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Shampoo - $25</Button>
                    <Button variant="outline" size="sm">Treatment - $35</Button>
                    <Button variant="outline" size="sm">Styling Cream - $18</Button>
                    <Button variant="outline" size="sm">Gift Card - $50</Button>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleSetup("POS System")}>
                  Launch POS
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Inventory & Product Management
                </CardTitle>
                <CardDescription>
                  Track inventory with low-stock alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">Professional Shampoo</p>
                      <p className="text-sm text-muted-foreground">Stock: 12 units</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Good</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">Hair Treatment</p>
                      <p className="text-sm text-muted-foreground">Stock: 3 units</p>
                    </div>
                    <Badge variant="outline" className="text-red-600">Low Stock</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">Styling Cream</p>
                      <p className="text-sm text-muted-foreground">Stock: 8 units</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Good</Badge>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleSetup("Inventory")}>
                  Manage Inventory
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gift Cards & Packages</CardTitle>
              <CardDescription>
                Sell gift cards and service packages to boost revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Gift Card Sales</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-semibold">$2,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Outstanding Balance</span>
                      <span className="font-semibold">$1,920</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cards Sold</span>
                      <span className="font-semibold">34</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Package Deals</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      5 Cuts Package - $300
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Color + Cut Bundle - $180
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Monthly Maintenance - $250
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">$12,340</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                  <div className="text-sm text-green-600 mt-1">↗ +18% vs last month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Client Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-muted-foreground">Active Clients</div>
                  <div className="text-sm text-blue-600 mt-1">↗ +23 new this month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Efficiency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-muted-foreground">Utilization Rate</div>
                  <div className="text-sm text-purple-600 mt-1">↗ +5% this week</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Business Intelligence Dashboard
              </CardTitle>
              <CardDescription>
                Advanced analytics to optimize your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Revenue Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Services</span>
                      <span className="font-semibold">$9,240 (75%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Products</span>
                      <span className="font-semibold">$2,100 (17%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gift Cards</span>
                      <span className="font-semibold">$850 (7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tips</span>
                      <span className="font-semibold">$150 (1%)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Peak Performance Times</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Busiest Day</span>
                      <span className="font-semibold">Friday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Hours</span>
                      <span className="font-semibold">2-4 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Appointment Value</span>
                      <span className="font-semibold">$97</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Client Lifetime Value</span>
                      <span className="font-semibold">$1,240</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Insights
              </CardTitle>
              <CardDescription>
                AI-powered forecasting and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-800">Revenue Forecast</h4>
                  <p className="text-sm text-blue-600">Projected to reach $15,200 next month based on current trends</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-800">Capacity Optimization</h4>
                  <p className="text-sm text-green-600">Add 2 more Friday afternoon slots to maximize revenue</p>
                </div>
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-medium text-orange-800">Client Retention Alert</h4>
                  <p className="text-sm text-orange-600">5 VIP clients haven't booked in 45+ days - send offers?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}