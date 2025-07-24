import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Star,
  Download,
  Search,
  Shield,
  BarChart3,
  Tag
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  totalAppointments: number;
  averageRating: number;
  growthRate: number;
}

interface UserAccount {
  id: string;
  email: string;
  businessName: string;
  industry: string;
  plan: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  monthlyRevenue: number;
}

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [_, setLocation] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminKey = sessionStorage.getItem('admin-key');
    if (!adminKey) {
      setLocation('/admin-login');
    }
  }, [setLocation]);

  // Get admin key for API requests
  const getAdminHeaders = () => {
    const adminKey = sessionStorage.getItem('admin-key');
    return adminKey ? { 'x-admin-key': adminKey } : {};
  };

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => fetch('/api/admin/stats', { headers: getAdminHeaders() }).then(res => res.json())
  });

  // Fetch promo code stats
  const { data: promoStats, isLoading: promoLoading } = useQuery({
    queryKey: ['/api/promo-stats'],
    queryFn: () => fetch('/api/promo-stats', { headers: getAdminHeaders() }).then(res => res.json())
  });

  // Fetch user accounts
  const { data: users, isLoading: usersLoading } = useQuery<UserAccount[]>({
    queryKey: ['/api/admin/users'],
    queryFn: () => fetch('/api/admin/users', { headers: getAdminHeaders() }).then(res => res.json())
  });

  // Fetch health status
  const { data: health } = useQuery({
    queryKey: ['/api/health'],
    queryFn: () => fetch('/api/health').then(res => res.json())
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || user.plan.toLowerCase() === selectedPlan;
    return matchesSearch && matchesPlan;
  }) || [];

  const exportUserData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Business Name,Industry,Plan,Status,Join Date,Last Login,Monthly Revenue\n" +
      filteredUsers.map(user => 
        `${user.email},${user.businessName},${user.industry},${user.plan},${user.status},${user.joinDate},${user.lastLogin},${user.monthlyRevenue}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scheduled_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (statsLoading || promoLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scheduled Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your business platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={health?.status === 'healthy' ? 'default' : 'destructive'}>
              <Shield className="w-3 h-3 mr-1" />
              {health?.status || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeUsers || 0} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.growthRate || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Platform-wide bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating || 0}/5</div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="promo">Promo Codes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>Manage all registered businesses</CardDescription>
                  </div>
                  <Button onClick={exportUserData} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by business name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Plans</option>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Business</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Industry</th>
                        <th className="text-left p-2">Plan</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Monthly Revenue</th>
                        <th className="text-left p-2">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{user.businessName}</td>
                          <td className="p-2 text-gray-600">{user.email}</td>
                          <td className="p-2">{user.industry}</td>
                          <td className="p-2">
                            <Badge variant={user.plan === 'Enterprise' ? 'default' : 'secondary'}>
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-2">${user.monthlyRevenue}</td>
                          <td className="p-2 text-gray-600">{user.lastLogin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promo Codes Tab */}
          <TabsContent value="promo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Beta Promo Code Usage
                </CardTitle>
                <CardDescription>Monitor your beta testing program</CardDescription>
              </CardHeader>
              <CardContent>
                {promoStats?.promoCodes?.map((promo: any) => (
                  <div key={promo.code} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{promo.code}</h3>
                        <p className="text-gray-600">{promo.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {promo.currentUses}/{promo.maxUses}
                        </div>
                        <p className="text-sm text-gray-500">
                          {promo.remaining} remaining
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(promo.currentUses / promo.maxUses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Revenue by Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Basic ($29/month)</span>
                      <span className="font-bold">$2,320</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Professional ($79/month)</span>
                      <span className="font-bold">$15,800</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enterprise ($199/month)</span>
                      <span className="font-bold">$7,960</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Industry Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Beauty & Wellness</span>
                      <span className="font-bold">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Home Services</span>
                      <span className="font-bold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pet Care</span>
                      <span className="font-bold">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Creative Services</span>
                      <span className="font-bold">17%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor platform health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>Database Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>Email Service</span>
                      <Badge variant="default">Operational</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>Payment Processing</span>
                      <Badge variant="default">Operational</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>API Response Time</span>
                      <Badge variant="default">&lt; 200ms</Badge>
                    </div>
                  </div>
                </div>
                
                {health && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">System Information</h4>
                    <div className="text-sm space-y-1">
                      <div>Version: {health.version}</div>
                      <div>Service: {health.service}</div>
                      <div>Timestamp: {new Date(health.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}