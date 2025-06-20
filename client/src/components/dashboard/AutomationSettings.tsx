import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Clock, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Star,
  Bell,
  Target,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  conditions?: any;
}

const DEFAULT_AUTOMATIONS: AutomationRule[] = [
  {
    id: "booking-confirmation",
    name: "Booking Confirmation",
    trigger: "new_booking",
    action: "send_email",
    enabled: true
  },
  {
    id: "review-request",
    name: "Review Request",
    trigger: "appointment_completed",
    action: "send_review_request",
    enabled: true
  },
  {
    id: "rebooking-reminder",
    name: "Rebooking Reminder",
    trigger: "30_days_after_visit",
    action: "send_rebooking_sms",
    enabled: false
  },
  {
    id: "birthday-promotion",
    name: "Birthday Promotion",
    trigger: "client_birthday",
    action: "send_discount_email",
    enabled: false
  }
];

export default function AutomationSettings() {
  const [automations, setAutomations] = useState<AutomationRule[]>(DEFAULT_AUTOMATIONS);
  const [selectedTab, setSelectedTab] = useState("workflows");
  const { toast } = useToast();

  const toggleAutomation = (id: string) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
    toast({
      title: "Automation Updated",
      description: "Your automation settings have been saved"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Business Automation</h2>
        <p className="text-muted-foreground">
          Automate repetitive tasks to focus on growing your business
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automations.map((automation) => (
              <Card key={automation.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                      <CardDescription>
                        {getAutomationDescription(automation)}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={automation.enabled}
                      onCheckedChange={() => toggleAutomation(automation.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getTriggerLabel(automation.trigger)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge variant="secondary" className="text-xs">
                        {getActionLabel(automation.action)}
                      </Badge>
                    </div>
                    {automation.enabled && (
                      <Button variant="outline" size="sm" className="w-full">
                        Configure Settings
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered automation recommendations based on your business patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Suggested: No-Show Follow-up</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically reach out to clients who missed their appointments to reschedule
                </p>
                <Button size="sm">Enable Automation</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Suggested: VIP Client Recognition</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Send special offers to your most loyal clients automatically
                </p>
                <Button size="sm">Enable Automation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">Monthly Newsletter</SelectItem>
                      <SelectItem value="promotion">Seasonal Promotion</SelectItem>
                      <SelectItem value="reactivation">Client Reactivation</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="new">New Clients (Last 30 days)</SelectItem>
                      <SelectItem value="vip">VIP Clients</SelectItem>
                      <SelectItem value="inactive">Inactive Clients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Campaign</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Message Template</Label>
                  <Textarea 
                    placeholder="Hi {name}! 🌟 It's been a while since your last visit. Book now and get 15% off your next service!"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Send Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select send time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="morning">Next Morning (9 AM)</SelectItem>
                      <SelectItem value="afternoon">Next Afternoon (2 PM)</SelectItem>
                      <SelectItem value="custom">Custom Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Schedule SMS</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Settings</CardTitle>
              <CardDescription>
                Automatically reward your best clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points per Dollar Spent</Label>
                  <Input type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label>Reward Threshold</Label>
                  <Input type="number" placeholder="100" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reward Value</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount_10">10% Discount</SelectItem>
                    <SelectItem value="discount_15">15% Discount</SelectItem>
                    <SelectItem value="free_service">Free Add-on Service</SelectItem>
                    <SelectItem value="custom">Custom Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Reports</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Summary</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Insights</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Client Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retention Rate</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lifetime Value</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Booking Patterns</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Popularity</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff Performance</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Hours</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Generate detailed reports for business insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Revenue Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Client Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Booking Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Star className="h-6 w-6" />
                  <span>Service Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Stay informed about important business events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Bookings</h4>
                    <p className="text-sm text-muted-foreground">Get notified when clients book appointments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cancellations</h4>
                    <p className="text-sm text-muted-foreground">Alert when appointments are cancelled</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Received</h4>
                    <p className="text-sm text-muted-foreground">Confirmation when payments are processed</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Daily Summary</h4>
                    <p className="text-sm text-muted-foreground">End-of-day business summary</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>
                Set custom thresholds for business alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Low Booking Alert</Label>
                  <Input type="number" placeholder="5" />
                  <p className="text-xs text-muted-foreground">Alert when daily bookings fall below this number</p>
                </div>
                <div className="space-y-2">
                  <Label>Revenue Target</Label>
                  <Input type="number" placeholder="500" />
                  <p className="text-xs text-muted-foreground">Daily revenue goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getAutomationDescription(automation: AutomationRule): string {
  switch (automation.id) {
    case "booking-confirmation":
      return "Send confirmation emails when clients book appointments";
    case "review-request":
      return "Request reviews from clients after their visit";
    case "rebooking-reminder":
      return "Remind clients to book their next appointment";
    case "birthday-promotion":
      return "Send special birthday offers to clients";
    default:
      return "Custom automation workflow";
  }
}

function getTriggerLabel(trigger: string): string {
  switch (trigger) {
    case "new_booking": return "New Booking";
    case "appointment_completed": return "Visit Complete";
    case "30_days_after_visit": return "30 Days Later";
    case "client_birthday": return "Birthday";
    default: return trigger;
  }
}

function getActionLabel(action: string): string {
  switch (action) {
    case "send_email": return "Send Email";
    case "send_review_request": return "Request Review";
    case "send_rebooking_sms": return "SMS Reminder";
    case "send_discount_email": return "Send Discount";
    default: return action;
  }
}