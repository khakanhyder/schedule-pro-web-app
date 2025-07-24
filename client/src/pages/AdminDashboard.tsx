import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReferralTracking from '@/components/analytics/ReferralTracking';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Settings,
  Database,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Business intelligence and partnership management</p>
          </div>
          <Badge className="bg-red-100 text-red-800 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admin Only
          </Badge>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="partnerships" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="partnerships" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Partnership Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Analytics
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Business Metrics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Settings
            </TabsTrigger>
          </TabsList>

          {/* Partnership Analytics */}
          <TabsContent value="partnerships">
            <ReferralTracking />
          </TabsContent>

          {/* User Analytics */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-gray-600">Waiting for first users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-gray-600">Ready for launch</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0%</div>
                  <p className="text-sm text-gray-600">Pre-launch phase</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Business Metrics */}
          <TabsContent value="business">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">Revenue metrics will appear when users start subscribing</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Industry Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">Industry analytics will show user template preferences</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h3 className="font-medium">Referral Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor Stripe partnership referrals</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h3 className="font-medium">User Analytics</h3>
                      <p className="text-sm text-gray-600">Track user engagement and retention</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h3 className="font-medium">Partnership Reminders</h3>
                      <p className="text-sm text-gray-600">Automated partnership milestone alerts</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}