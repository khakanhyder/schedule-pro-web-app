import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  LogOut
} from "lucide-react";

interface Client {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  status: string;
  plan: string;
  monthlyRevenue: number;
  createdAt: string;
  lastLogin: string | null;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxUsers: number;
  storageGB: number;
}

interface Analytics {
  totalMRR: number;
  totalClients: number;
  activeClients: number;
  churnRate: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    clients: number;
  }>;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Check authentication
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'SUPER_ADMIN') {
    window.location.href = '/admin';
    return null;
  }

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients']
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ['/api/plans']
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ['/api/analytics/revenue']
  });

  const { data: onboardingSessions = [] } = useQuery({
    queryKey: ['/api/onboarding/sessions']
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      TRIAL: "bg-yellow-100 text-yellow-800", 
      INACTIVE: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.INACTIVE;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analyticsLoading ? '...' : analytics?.totalMRR?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clientsLoading ? '...' : clients.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active businesses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clientsLoading ? '...' : clients.filter(c => c.status === 'ACTIVE').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Paying customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsLoading ? '...' : analytics?.churnRate?.toFixed(1) || '0.0'}%
                  </div>
                  <p className="text-xs text-muted-foreground">Monthly churn</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>Latest business signups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{client.businessName}</p>
                          <p className="text-sm text-gray-600">{client.contactPerson}</p>
                        </div>
                        <Badge className={getStatusBadge(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Monthly revenue by plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans.map((plan) => {
                      const planClients = clients.filter(c => c.plan === plan.name && c.status === 'ACTIVE');
                      const planRevenue = planClients.length * plan.price;
                      return (
                        <div key={plan.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-gray-600">{planClients.length} clients</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${planRevenue.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">monthly</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Client Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {client.businessName}
                              </div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.contactPerson}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.plan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadge(client.status)}>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${client.monthlyRevenue.toFixed(2)}/mo
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Plan Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {plan.name}
                      <Badge>${plan.price}/mo</Badge>
                    </CardTitle>
                    <CardDescription>
                      {plan.maxUsers} users • {plan.storageGB}GB storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="text-sm">• {feature}</div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="text-sm text-gray-600">
                        {clients.filter(c => c.plan === plan.name).length} clients
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <h2 className="text-2xl font-bold">Onboarding Analytics</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{onboardingSessions.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {onboardingSessions.filter((s: any) => s.isCompleted).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {onboardingSessions.length > 0 
                      ? Math.round((onboardingSessions.filter((s: any) => s.isCompleted).length / onboardingSessions.length) * 100)
                      : 0
                    }%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Onboarding Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onboardingSessions.slice(0, 10).map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <p className="font-medium">{session.planName}</p>
                        <p className="text-sm text-gray-600">Step {session.currentStep || 1} of 6</p>
                      </div>
                      <div className="text-right">
                        <Badge className={session.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {session.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}