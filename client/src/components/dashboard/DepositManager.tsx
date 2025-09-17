import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Shield, DollarSign, Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useIndustry } from "@/lib/industryContext";

interface DepositSettings {
  id: string;
  serviceId: number;
  serviceName: string;
  depositRequired: boolean;
  depositType: 'fixed' | 'percentage';
  depositAmount: number;
  minimumValue: number;
  advanceNotice: number; // hours
}

interface NoShowStats {
  totalBookings: number;
  noShows: number;
  noShowRate: number;
  revenueProtected: number;
  depositsCollected: number;
  refundsIssued: number;
}

export default function DepositManager() {
  const [selectedTab, setSelectedTab] = useState("settings");
  const { selectedIndustry } = useIndustry();
  const queryClient = useQueryClient();

  // Mock data - replace with real API calls
  const mockDepositSettings: DepositSettings[] = [
    {
      id: "1",
      serviceId: 1,
      serviceName: "Haircut & Styling",
      depositRequired: true,
      depositType: "fixed",
      depositAmount: 25,
      minimumValue: 50,
      advanceNotice: 24
    },
    {
      id: "2", 
      serviceId: 2,
      serviceName: "Color Treatment",
      depositRequired: true,
      depositType: "percentage",
      depositAmount: 30,
      minimumValue: 100,
      advanceNotice: 48
    }
  ];

  const mockStats: NoShowStats = {
    totalBookings: 156,
    noShows: 12,
    noShowRate: 7.7,
    revenueProtected: 1240,
    depositsCollected: 42,
    refundsIssued: 3
  };

  const updateDepositSettings = useMutation({
    mutationFn: async (settings: DepositSettings) => {
      return apiRequest(`/api/deposits/${settings.id}`, "PUT", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deposits"] });
    }
  });

  const handleToggleDeposit = (settingId: string, enabled: boolean) => {
    const setting = mockDepositSettings.find(s => s.id === settingId);
    if (setting) {
      updateDepositSettings.mutate({
        ...setting,
        depositRequired: enabled
      });
    }
  };

  const getDepositAmount = (setting: DepositSettings) => {
    if (setting.depositType === 'fixed') {
      return `$${setting.depositAmount}`;
    } else {
      return `${setting.depositAmount}%`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Deposit & No-Show Protection</h2>
        <p className="text-muted-foreground">
          Protect your revenue and reduce no-shows with smart deposit collection
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue Protected</p>
                    <p className="text-2xl font-bold text-green-600">${mockStats.revenueProtected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No-Show Rate</p>
                    <p className="text-2xl font-bold">{mockStats.noShowRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deposits Collected</p>
                    <p className="text-2xl font-bold">{mockStats.depositsCollected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Refunds Issued</p>
                    <p className="text-2xl font-bold">{mockStats.refundsIssued}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Performance</CardTitle>
              <CardDescription>
                How deposits are protecting your business revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Bookings with deposits</span>
                  <span className="font-bold">73%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average deposit collected</span>
                  <span className="font-bold">$29.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>No-show reduction</span>
                  <span className="font-bold text-green-600">-65%</span>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Impact:</strong> Deposits have prevented an estimated $3,240 in lost revenue over the past 3 months.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Deposit Settings</CardTitle>
              <CardDescription>
                Configure deposit requirements for each service to protect against no-shows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockDepositSettings.map((setting) => (
                  <div key={setting.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{setting.serviceName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.depositRequired ? `${getDepositAmount(setting)} deposit required` : 'No deposit required'}
                        </p>
                      </div>
                      <Switch
                        checked={setting.depositRequired}
                        onCheckedChange={(checked) => handleToggleDeposit(setting.id, checked)}
                      />
                    </div>
                    
                    {setting.depositRequired && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor={`deposit-type-${setting.id}`}>Deposit Type</Label>
                          <select 
                            id={`deposit-type-${setting.id}`}
                            className="w-full p-2 border rounded"
                            value={setting.depositType}
                          >
                            <option value="fixed">Fixed Amount</option>
                            <option value="percentage">Percentage</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`deposit-amount-${setting.id}`}>
                            {setting.depositType === 'fixed' ? 'Amount ($)' : 'Percentage (%)'}
                          </Label>
                          <Input
                            id={`deposit-amount-${setting.id}`}
                            type="number"
                            value={setting.depositAmount}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`advance-notice-${setting.id}`}>Advance Notice (hours)</Label>
                          <Input
                            id={`advance-notice-${setting.id}`}
                            type="number"
                            value={setting.advanceNotice}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Deposit Rules</CardTitle>
              <CardDescription>
                Set default rules for when deposits should be collected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require deposits for all services over $75</Label>
                  <p className="text-sm text-muted-foreground">Automatically apply 25% deposit for high-value services</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Collect deposits for weekend bookings</Label>
                  <p className="text-sm text-muted-foreground">Higher no-show risk on weekends</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Waive deposits for VIP clients</Label>
                  <p className="text-sm text-muted-foreground">Trust established high-value clients</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deposit Activity</CardTitle>
              <CardDescription>
                Track deposits collected, refunded, and forfeited
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-12-29", client: "Sarah Johnson", service: "Color Treatment", amount: "$30", status: "collected", type: "booking" },
                  { date: "2024-12-28", client: "Mike Chen", service: "Haircut & Styling", amount: "$25", status: "refunded", type: "cancellation" },
                  { date: "2024-12-27", client: "Emma Wilson", service: "Manicure", amount: "$15", status: "forfeited", type: "no-show" },
                  { date: "2024-12-26", client: "David Smith", service: "Color Treatment", amount: "$30", status: "collected", type: "booking" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'collected' ? 'bg-green-500' :
                        activity.status === 'refunded' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.client}</p>
                        <p className="text-sm text-muted-foreground">{activity.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.amount}</p>
                      <Badge variant={
                        activity.status === 'collected' ? 'default' :
                        activity.status === 'refunded' ? 'secondary' : 'destructive'
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}