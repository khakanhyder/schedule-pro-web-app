import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, User, Settings, LogOut } from "lucide-react";

export default function ClientDashboard() {
  // Check authentication
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'CLIENT') {
    window.location.href = '/';
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Business Profile
              </CardTitle>
              <CardDescription>Manage your business information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Status
              </CardTitle>
              <CardDescription>Your current plan and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <p className="text-sm text-gray-600 mt-2">Pro Plan - $99.99/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Users
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to set up your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Complete business profile</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Invite team members</span>
                <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Configure integrations</span>
                <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}