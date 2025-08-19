import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  LogOut,
  MoreHorizontal,
  AlertCircle
} from "lucide-react";

interface Client {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  status: string;
  plan: string;
  planId?: string;
  monthlyRevenue: number;
  createdAt: string;
  lastLogin: string | null;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: string;
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [clientForm, setClientForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessAddress: '',
    industry: '',
    planId: '',
    status: 'TRIAL'
  });
  const [planForm, setPlanForm] = useState({
    name: '',
    price: 0,
    billing: 'MONTHLY',
    features: [] as string[],
    maxUsers: 1,
    storageGB: 10
  });
  const [newFeature, setNewFeature] = useState('');

  const queryClient = useQueryClient();

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

  // Mutations for client management
  const createClientMutation = useMutation({
    mutationFn: async (clientData: typeof clientForm) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Failed to create client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/revenue'] });
      setIsAddingClient(false);
      setClientForm({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        businessAddress: '',
        industry: '',
        planId: '',
        status: 'TRIAL'
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<typeof clientForm> }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/revenue'] });
      setSelectedClient(null);
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/revenue'] });
    }
  });

  // Mutations for plan management
  const createPlanMutation = useMutation({
    mutationFn: async (planData: typeof planForm) => {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      if (!response.ok) throw new Error('Failed to create plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      setIsAddingPlan(false);
      setPlanForm({
        name: '',
        price: 0,
        billing: 'MONTHLY',
        features: [],
        maxUsers: 1,
        storageGB: 10
      });
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<typeof planForm> }) => {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      setSelectedPlan(null);
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      if (selectedPlan) {
        setSelectedPlan({
          ...selectedPlan,
          features: [...selectedPlan.features, newFeature.trim()]
        });
      } else {
        setPlanForm({
          ...planForm,
          features: [...planForm.features, newFeature.trim()]
        });
      }
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (selectedPlan) {
      const updatedFeatures = selectedPlan.features.filter((_, i) => i !== index);
      setSelectedPlan({
        ...selectedPlan,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = planForm.features.filter((_, i) => i !== index);
      setPlanForm({
        ...planForm,
        features: updatedFeatures
      });
    }
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
              <Sheet open={isAddingClient} onOpenChange={setIsAddingClient}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Add New Client</SheetTitle>
                    <SheetDescription>
                      Create a new client account and assign them to a plan
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={clientForm.businessName}
                          onChange={(e) => setClientForm({ ...clientForm, businessName: e.target.value })}
                          placeholder="Business Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={clientForm.contactPerson}
                          onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        placeholder="business@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <select
                          id="industry"
                          className="w-full p-2 border rounded-md"
                          value={clientForm.industry}
                          onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })}
                        >
                          <option value="">Select Industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Retail">Retail</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Input
                        id="businessAddress"
                        value={clientForm.businessAddress}
                        onChange={(e) => setClientForm({ ...clientForm, businessAddress: e.target.value })}
                        placeholder="123 Main St, City, State"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="planId">Plan *</Label>
                        <select
                          id="planId"
                          className="w-full p-2 border rounded-md"
                          value={clientForm.planId}
                          onChange={(e) => setClientForm({ ...clientForm, planId: e.target.value })}
                        >
                          <option value="">Select Plan</option>
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} - ${plan.price}/month
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          className="w-full p-2 border rounded-md"
                          value={clientForm.status}
                          onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                        >
                          <option value="TRIAL">Trial</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => createClientMutation.mutate(clientForm)}
                      disabled={createClientMutation.isPending || !clientForm.businessName || !clientForm.contactPerson || !clientForm.email || !clientForm.planId}
                    >
                      {createClientMutation.isPending ? "Creating..." : "Create Client"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingClient(false)}>
                      Cancel
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
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
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                                  <SheetHeader>
                                    <SheetTitle>Client Details</SheetTitle>
                                    <SheetDescription>
                                      View and manage client information
                                    </SheetDescription>
                                  </SheetHeader>
                                  {selectedClient && (
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Business Name</Label>
                                          <p className="font-medium">{selectedClient.businessName}</p>
                                        </div>
                                        <div>
                                          <Label>Contact Person</Label>
                                          <p className="font-medium">{selectedClient.contactPerson}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className="font-medium">{selectedClient.email}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Plan</Label>
                                          <p className="font-medium">{selectedClient.plan}</p>
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <Badge className={getStatusBadge(selectedClient.status)}>
                                            {selectedClient.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Monthly Revenue</Label>
                                        <p className="font-medium">${selectedClient.monthlyRevenue.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <Label>Created</Label>
                                        <p className="font-medium">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label>Last Login</Label>
                                        <p className="font-medium">
                                          {selectedClient.lastLogin 
                                            ? new Date(selectedClient.lastLogin).toLocaleDateString()
                                            : 'Never'
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </SheetContent>
                              </Sheet>
                              
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => {
                                    setSelectedClient(client);
                                    setClientForm({
                                      businessName: client.businessName,
                                      contactPerson: client.contactPerson,
                                      email: client.email,
                                      phone: '',
                                      businessAddress: '',
                                      industry: '',
                                      planId: client.planId || '',
                                      status: client.status
                                    });
                                  }}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                                  <SheetHeader>
                                    <SheetTitle>Edit Client</SheetTitle>
                                    <SheetDescription>
                                      Update client information and settings
                                    </SheetDescription>
                                  </SheetHeader>
                                  {selectedClient && (
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="edit-businessName">Business Name *</Label>
                                          <Input
                                            id="edit-businessName"
                                            value={clientForm.businessName}
                                            onChange={(e) => setClientForm({ ...clientForm, businessName: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-contactPerson">Contact Person *</Label>
                                          <Input
                                            id="edit-contactPerson"
                                            value={clientForm.contactPerson}
                                            onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-email">Email *</Label>
                                        <Input
                                          id="edit-email"
                                          type="email"
                                          value={clientForm.email}
                                          onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="edit-planId">Plan *</Label>
                                          <select
                                            id="edit-planId"
                                            className="w-full p-2 border rounded-md"
                                            value={clientForm.planId}
                                            onChange={(e) => setClientForm({ ...clientForm, planId: e.target.value })}
                                          >
                                            {plans.map((plan) => (
                                              <option key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price}/month
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-status">Status</Label>
                                          <select
                                            id="edit-status"
                                            className="w-full p-2 border rounded-md"
                                            value={clientForm.status}
                                            onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                                          >
                                            <option value="TRIAL">Trial</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                            <option value="CANCELLED">Cancelled</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={() => updateClientMutation.mutate({
                                            id: selectedClient.id,
                                            updates: clientForm
                                          })}
                                          disabled={updateClientMutation.isPending}
                                        >
                                          {updateClientMutation.isPending ? "Updating..." : "Update Client"}
                                        </Button>
                                        <Button variant="outline" onClick={() => setSelectedClient(null)}>
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </SheetContent>
                              </Sheet>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${client.businessName}?`)) {
                                    deleteClientMutation.mutate(client.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
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
              <Sheet open={isAddingPlan} onOpenChange={setIsAddingPlan}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Create New Plan</SheetTitle>
                    <SheetDescription>
                      Design a new subscription plan for your platform
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="planName">Plan Name *</Label>
                        <Input
                          id="planName"
                          value={planForm.name}
                          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                          placeholder="e.g., Starter, Pro, Enterprise"
                        />
                      </div>
                      <div>
                        <Label htmlFor="planPrice">Price *</Label>
                        <Input
                          id="planPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                          placeholder="29.99"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxUsers">Max Users *</Label>
                        <Input
                          id="maxUsers"
                          type="number"
                          min="1"
                          value={planForm.maxUsers}
                          onChange={(e) => setPlanForm({ ...planForm, maxUsers: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="storageGB">Storage (GB) *</Label>
                        <Input
                          id="storageGB"
                          type="number"
                          min="1"
                          value={planForm.storageGB}
                          onChange={(e) => setPlanForm({ ...planForm, storageGB: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billing">Billing Cycle</Label>
                      <select
                        id="billing"
                        className="w-full p-2 border rounded-md"
                        value={planForm.billing}
                        onChange={(e) => setPlanForm({ ...planForm, billing: e.target.value })}
                      >
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <Label>Features</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Add a feature..."
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                          />
                          <Button type="button" onClick={handleAddFeature} size="sm">
                            Add
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {planForm.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFeature(index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => createPlanMutation.mutate(planForm)}
                      disabled={createPlanMutation.isPending || !planForm.name || planForm.price <= 0}
                    >
                      {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingPlan(false)}>
                      Cancel
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
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
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedPlan(plan);
                              setPlanForm({
                                name: plan.name,
                                price: plan.price,
                                billing: plan.billing,
                                features: [...plan.features],
                                maxUsers: plan.maxUsers,
                                storageGB: plan.storageGB
                              });
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Edit Plan</SheetTitle>
                              <SheetDescription>
                                Update plan details and features
                              </SheetDescription>
                            </SheetHeader>
                            {selectedPlan && (
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editPlanName">Plan Name *</Label>
                                    <Input
                                      id="editPlanName"
                                      value={planForm.name}
                                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editPlanPrice">Price *</Label>
                                    <Input
                                      id="editPlanPrice"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={planForm.price}
                                      onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editMaxUsers">Max Users *</Label>
                                    <Input
                                      id="editMaxUsers"
                                      type="number"
                                      min="1"
                                      value={planForm.maxUsers}
                                      onChange={(e) => setPlanForm({ ...planForm, maxUsers: parseInt(e.target.value) || 1 })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editStorageGB">Storage (GB) *</Label>
                                    <Input
                                      id="editStorageGB"
                                      type="number"
                                      min="1"
                                      value={planForm.storageGB}
                                      onChange={(e) => setPlanForm({ ...planForm, storageGB: parseInt(e.target.value) || 1 })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="editBilling">Billing Cycle</Label>
                                  <select
                                    id="editBilling"
                                    className="w-full p-2 border rounded-md"
                                    value={planForm.billing}
                                    onChange={(e) => setPlanForm({ ...planForm, billing: e.target.value })}
                                  >
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                  </select>
                                </div>
                                <div>
                                  <Label>Features</Label>
                                  <div className="space-y-2">
                                    <div className="flex gap-2">
                                      <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Add a feature..."
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                                      />
                                      <Button type="button" onClick={handleAddFeature} size="sm">
                                        Add
                                      </Button>
                                    </div>
                                    <div className="space-y-1">
                                      {planForm.features.map((feature, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                          <span className="text-sm">{feature}</span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFeature(index)}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={() => updatePlanMutation.mutate({
                                      id: selectedPlan.id,
                                      updates: planForm
                                    })}
                                    disabled={updatePlanMutation.isPending}
                                  >
                                    {updatePlanMutation.isPending ? "Updating..." : "Update Plan"}
                                  </Button>
                                  <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the ${plan.name} plan?`)) {
                              deletePlanMutation.mutate(plan.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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