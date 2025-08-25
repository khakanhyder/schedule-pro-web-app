import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Settings,
  Globe,
  BarChart3,
  UserPlus,
  Eye,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface Client {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  industry: string;
  status: string;
  planId: string;
}

interface ClientService {
  id: string;
  clientId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  estimatedValue: number;
  convertedToAppointment: boolean;
  createdAt: string;
}

interface DashboardMetrics {
  totalAppointments: number;
  thisMonthAppointments: number;
  thisMonthRevenue: number;
  totalLeads: number;
  newLeadsThisMonth: number;
  conversionRate: number;
}

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  // Edit states
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Form states
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
    category: '',
    isActive: true
  });
  
  const [appointmentForm, setAppointmentForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    appointmentDate: '',
    startTime: '',
    status: 'PENDING'
  });
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'NEW',
    notes: '',
    estimatedValue: ''
  });
  
  const [websiteSettings, setWebsiteSettings] = useState({
    title: '',
    description: '',
    primaryColor: '#3B82F6',
    showServices: true,
    showBooking: true,
    contactEmail: '',
    contactPhone: ''
  });
  
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30
  });

  useEffect(() => {
    // Load client data from localStorage (set during onboarding)
    const storedClient = localStorage.getItem('clientData');
    const storedUser = localStorage.getItem('clientUser');
    
    if (!storedClient || !storedUser) {
      setLocation('/client-login');
      return;
    }
    
    setClientData(JSON.parse(storedClient));
  }, [setLocation]);

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: [`/api/client/${clientData?.id}/dashboard`],
    enabled: !!clientData?.id
  });

  const { data: services = [] } = useQuery<ClientService[]>({
    queryKey: [`/api/client/${clientData?.id}/services`],
    enabled: !!clientData?.id
  });

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: [`/api/client/${clientData?.id}/appointments`],
    enabled: !!clientData?.id
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: [`/api/client/${clientData?.id}/leads`],
    enabled: !!clientData?.id
  });
  
  const { data: appointmentSlots = [] } = useQuery<any[]>({
    queryKey: [`/api/client/${clientData?.id}/appointment-slots`],
    enabled: !!clientData?.id
  });

  // Mutations for Services
  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/client/${clientData?.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, price: parseFloat(data.price), durationMinutes: parseInt(data.durationMinutes) })
      });
      if (!response.ok) throw new Error('Failed to create service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/services`] });
      setIsServiceModalOpen(false);
      setServiceForm({ name: '', description: '', price: '', durationMinutes: '', category: '', isActive: true });
      toast({ title: 'Service created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create service', variant: 'destructive' });
    }
  });
  
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/client/${clientData?.id}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, price: parseFloat(data.price), durationMinutes: parseInt(data.durationMinutes) })
      });
      if (!response.ok) throw new Error('Failed to update service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/services`] });
      setIsServiceModalOpen(false);
      setEditingService(null);
      toast({ title: 'Service updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update service', variant: 'destructive' });
    }
  });
  
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/client/${clientData?.id}/services/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/services`] });
      toast({ title: 'Service deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete service', variant: 'destructive' });
    }
  });
  
  // Mutations for Appointments
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/client/${clientData?.id}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/appointments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      setIsAppointmentModalOpen(false);
      setAppointmentForm({ customerName: '', customerEmail: '', customerPhone: '', serviceId: '', appointmentDate: '', startTime: '', status: 'PENDING' });
      toast({ title: 'Appointment created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create appointment', variant: 'destructive' });
    }
  });
  
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/client/${clientData?.id}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/appointments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
      toast({ title: 'Appointment updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update appointment', variant: 'destructive' });
    }
  });
  
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/client/${clientData?.id}/appointments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/appointments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      toast({ title: 'Appointment deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete appointment', variant: 'destructive' });
    }
  });
  
  // Mutations for Leads
  const createLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/client/${clientData?.id}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : 0 })
      });
      if (!response.ok) throw new Error('Failed to create lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/leads`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      setIsLeadModalOpen(false);
      setLeadForm({ name: '', email: '', phone: '', source: '', status: 'NEW', notes: '', estimatedValue: '' });
      toast({ title: 'Lead created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create lead', variant: 'destructive' });
    }
  });
  
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/client/${clientData?.id}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : 0 })
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/leads`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      setIsLeadModalOpen(false);
      setEditingLead(null);
      toast({ title: 'Lead updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update lead', variant: 'destructive' });
    }
  });
  
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/client/${clientData?.id}/leads/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/leads`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/dashboard`] });
      toast({ title: 'Lead deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete lead', variant: 'destructive' });
    }
  });
  
  // Website update mutation
  const updateWebsiteMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/client/${clientData?.id}/website`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update website');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Website updated successfully' });
      setIsWebsiteModalOpen(false);
    },
    onError: () => {
      toast({ title: 'Failed to update website', variant: 'destructive' });
    }
  });
  
  // Slot management mutations
  const createSlotMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/client/${clientData?.id}/appointment-slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create slot');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/appointment-slots`] });
      toast({ title: 'Time slot added successfully' });
      setSlotForm({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 30 });
    }
  });
  
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const response = await fetch(`/api/client/${clientData?.id}/appointment-slots/${slotId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete slot');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientData?.id}/appointment-slots`] });
      toast({ title: 'Time slot deleted successfully' });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('clientData');
    localStorage.removeItem('clientUser');
    setLocation('/');
  };
  
  // Helper functions
  const openServiceModal = (service?: ClientService) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        durationMinutes: service.durationMinutes.toString(),
        category: service.category,
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setServiceForm({ name: '', description: '', price: '', durationMinutes: '', category: '', isActive: true });
    }
    setIsServiceModalOpen(true);
  };
  
  const openAppointmentModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setAppointmentForm({
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        serviceId: appointment.serviceId,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        status: appointment.status
      });
    } else {
      setEditingAppointment(null);
      setAppointmentForm({ customerName: '', customerEmail: '', customerPhone: '', serviceId: '', appointmentDate: '', startTime: '', status: 'PENDING' });
    }
    setIsAppointmentModalOpen(true);
  };
  
  const openLeadModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setLeadForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        estimatedValue: lead.estimatedValue.toString()
      });
    } else {
      setEditingLead(null);
      setLeadForm({ name: '', email: '', phone: '', source: '', status: 'NEW', notes: '', estimatedValue: '' });
    }
    setIsLeadModalOpen(true);
  };
  
  const handleServiceSubmit = () => {
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: serviceForm });
    } else {
      createServiceMutation.mutate(serviceForm);
    }
  };
  
  const handleAppointmentSubmit = () => {
    if (editingAppointment) {
      updateAppointmentMutation.mutate({ id: editingAppointment.id, data: appointmentForm });
    } else {
      createAppointmentMutation.mutate(appointmentForm);
    }
  };
  
  const handleLeadSubmit = () => {
    if (editingLead) {
      updateLeadMutation.mutate({ id: editingLead.id, data: leadForm });
    } else {
      createLeadMutation.mutate(leadForm);
    }
  };
  
  const openWebsitePreview = () => {
    window.open(`/client-website/${clientData?.id}`, '_blank');
  };
  
  const handleCreateSlot = () => {
    if (!slotForm.dayOfWeek && slotForm.dayOfWeek !== 0 || !slotForm.startTime || !slotForm.endTime || !slotForm.slotDuration) {
      toast({ title: 'Please fill in all slot fields', variant: 'destructive' });
      return;
    }
    createSlotMutation.mutate(slotForm);
  };
  
  // Fetch available time slots when date changes
  useEffect(() => {
    if (appointmentForm.appointmentDate && clientData?.id) {
      fetch(`/api/public/client/${clientData.id}/available-slots?date=${appointmentForm.appointmentDate}`)
        .then(res => res.json())
        .then(slots => setAvailableTimeSlots(slots))
        .catch(err => console.error('Failed to fetch time slots:', err));
    }
  }, [appointmentForm.appointmentDate, clientData?.id]);

  if (!clientData) {
    return <div>Loading...</div>;
  }

  const metrics: DashboardMetrics = (dashboardData as any)?.metrics || {
    totalAppointments: 0,
    thisMonthAppointments: 0,
    thisMonthRevenue: 0,
    totalLeads: 0,
    newLeadsThisMonth: 0,
    conversionRate: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clientData.businessName}</h1>
              <p className="text-sm text-gray-600">Business Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {clientData.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.thisMonthRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.thisMonthAppointments} appointments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    All time bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.newLeadsThisMonth}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Leads to appointments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.slice(0, 5).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No appointments yet</p>
                  ) : (
                    <div className="space-y-4">
                      {appointments.slice(0, 5).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{appointment.customerName}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                            </p>
                          </div>
                          <Badge variant={appointment.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.slice(0, 5).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No leads yet</p>
                  ) : (
                    <div className="space-y-4">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-600">
                              {lead.source} • {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={lead.status === 'CONVERTED' ? 'default' : 'secondary'}>
                            {lead.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <div className="flex gap-2">
                <Dialog open={isSlotModalOpen} onOpenChange={setIsSlotModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Manage Availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Appointment Availability</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label>Day</Label>
                          <Select value={slotForm.dayOfWeek?.toString()} onValueChange={(value) => setSlotForm(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Sunday</SelectItem>
                              <SelectItem value="1">Monday</SelectItem>
                              <SelectItem value="2">Tuesday</SelectItem>
                              <SelectItem value="3">Wednesday</SelectItem>
                              <SelectItem value="4">Thursday</SelectItem>
                              <SelectItem value="5">Friday</SelectItem>
                              <SelectItem value="6">Saturday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={slotForm.startTime}
                            onChange={(e) => setSlotForm(prev => ({ ...prev, startTime: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={slotForm.endTime}
                            onChange={(e) => setSlotForm(prev => ({ ...prev, endTime: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Duration (min)</Label>
                          <Input
                            type="number"
                            value={slotForm.slotDuration}
                            onChange={(e) => setSlotForm(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <Button onClick={handleCreateSlot} className="w-full">
                        Add Time Slot
                      </Button>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <h4 className="font-medium">Current Availability:</h4>
                        {appointmentSlots.length === 0 ? (
                          <p className="text-sm text-gray-500">No availability slots configured</p>
                        ) : (
                          appointmentSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][slot.dayOfWeek]} {slot.startTime}-{slot.endTime} ({slot.slotDuration}min)
                              </span>
                              <Button size="sm" variant="outline" onClick={() => deleteSlotMutation.mutate(slot.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openAppointmentModal()}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                    <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={appointmentForm.customerName}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Customer Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={appointmentForm.customerEmail}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Customer Phone</Label>
                      <Input
                        id="customerPhone"
                        value={appointmentForm.customerPhone}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceSelect">Service *</Label>
                      <Select value={appointmentForm.serviceId} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, serviceId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${service.price} ({service.durationMinutes}min)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appointmentDate">Date *</Label>
                        <Input
                          id="appointmentDate"
                          type="date"
                          value={appointmentForm.appointmentDate}
                          onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Time *</Label>
                        <Select value={appointmentForm.startTime} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, startTime: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimeSlots.length > 0 ? (
                              availableTimeSlots.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>No available slots - Configure availability first</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="appointmentStatus">Status</Label>
                      <Select value={appointmentForm.status} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAppointmentModalOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleAppointmentSubmit}
                        disabled={!appointmentForm.customerName || !appointmentForm.customerEmail || !appointmentForm.serviceId || !appointmentForm.appointmentDate || !appointmentForm.startTime}
                      >
                        {editingAppointment ? 'Update' : 'Create'} Appointment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No appointments scheduled</p>
                    <Button onClick={() => openAppointmentModal()}>Schedule Your First Appointment</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.customerName}</p>
                          <p className="text-sm text-gray-600">{appointment.customerEmail}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.startTime} - {appointment.endTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                          <span className="font-medium">${appointment.totalPrice}</span>
                          <div className="flex gap-1 ml-2">
                            <Button variant="outline" size="sm" onClick={() => openAppointmentModal(appointment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this appointment with {appointment.customerName}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteAppointmentMutation.mutate(appointment.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Services</h2>
              <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openServiceModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="serviceName">Service Name *</Label>
                      <Input
                        id="serviceName"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Hair Cut, Manicure, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceDescription">Description</Label>
                      <Textarea
                        id="serviceDescription"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Service description..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="servicePrice">Price ($) *</Label>
                        <Input
                          id="servicePrice"
                          type="number"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="50.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceDuration">Duration (min) *</Label>
                        <Input
                          id="serviceDuration"
                          type="number"
                          value={serviceForm.durationMinutes}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, durationMinutes: e.target.value }))}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="serviceCategory">Category</Label>
                      <Select value={serviceForm.category} onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hair">Hair</SelectItem>
                          <SelectItem value="Nails">Nails</SelectItem>
                          <SelectItem value="Skin">Skin</SelectItem>
                          <SelectItem value="Massage">Massage</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="serviceActive"
                        checked={serviceForm.isActive}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <Label htmlFor="serviceActive">Service is active</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleServiceSubmit}
                        disabled={!serviceForm.name || !serviceForm.price || !serviceForm.durationMinutes}
                      >
                        {editingService ? 'Update' : 'Create'} Service
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Services</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No services added yet</p>
                    <Button onClick={() => openServiceModal()}>Add Your First Service</Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{service.name}</h3>
                          <Badge variant={service.isActive ? 'default' : 'secondary'}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">${service.price}</span>
                            <span className="text-sm text-gray-600 ml-2">• {service.durationMinutes}min</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openServiceModal(service)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{service.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteServiceMutation.mutate(service.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Leads</h2>
              <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openLeadModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="leadName">Name *</Label>
                      <Input
                        id="leadName"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leadEmail">Email *</Label>
                      <Input
                        id="leadEmail"
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leadPhone">Phone</Label>
                      <Input
                        id="leadPhone"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="leadSource">Source</Label>
                        <Select value={leadForm.source} onValueChange={(value) => setLeadForm(prev => ({ ...prev, source: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Walk-in">Walk-in</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="leadStatus">Status</Label>
                        <Select value={leadForm.status} onValueChange={(value) => setLeadForm(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="LOST">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        value={leadForm.estimatedValue}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, estimatedValue: e.target.value }))}
                        placeholder="150.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leadNotes">Notes</Label>
                      <Textarea
                        id="leadNotes"
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes about this lead..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsLeadModalOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleLeadSubmit}
                        disabled={!leadForm.name || !leadForm.email}
                      >
                        {editingLead ? 'Update' : 'Create'} Lead
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No leads captured yet</p>
                    <Button onClick={() => openLeadModal()}>Add Your First Lead</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.email} • {lead.phone}</p>
                          <p className="text-sm text-gray-600">
                            Source: {lead.source} • {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                          {lead.notes && (
                            <p className="text-sm text-gray-500 mt-1">{lead.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={lead.status === 'CONVERTED' ? 'default' : 'secondary'}>
                            {lead.status}
                          </Badge>
                          {lead.estimatedValue > 0 && (
                            <span className="text-sm">${lead.estimatedValue}</span>
                          )}
                          <div className="flex gap-1 ml-2">
                            <Button variant="outline" size="sm" onClick={() => openLeadModal(lead)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the lead for {lead.name}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteLeadMutation.mutate(lead.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue charts coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Lead source analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Website Tab */}
          <TabsContent value="website" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Business Website</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={openWebsitePreview}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Website
                </Button>
                <Dialog open={isWebsiteModalOpen} onOpenChange={setIsWebsiteModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Website Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Website Configuration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="websiteTitle">Website Title</Label>
                        <Input
                          id="websiteTitle"
                          value={websiteSettings.title}
                          onChange={(e) => setWebsiteSettings(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={clientData?.businessName || 'Your Business'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="websiteDescription">Description</Label>
                        <Textarea
                          id="websiteDescription"
                          value={websiteSettings.description}
                          onChange={(e) => setWebsiteSettings(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Welcome to our business..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Input
                          id="primaryColor"
                          type="color"
                          value={websiteSettings.primaryColor}
                          onChange={(e) => setWebsiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={websiteSettings.contactEmail}
                            onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                            placeholder={clientData?.email}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactPhone">Contact Phone</Label>
                          <Input
                            id="contactPhone"
                            value={websiteSettings.contactPhone}
                            onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                            placeholder={clientData?.phone}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showServices"
                            checked={websiteSettings.showServices}
                            onChange={(e) => setWebsiteSettings(prev => ({ ...prev, showServices: e.target.checked }))}
                          />
                          <Label htmlFor="showServices">Show services on website</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showBooking"
                            checked={websiteSettings.showBooking}
                            onChange={(e) => setWebsiteSettings(prev => ({ ...prev, showBooking: e.target.checked }))}
                          />
                          <Label htmlFor="showBooking">Enable online booking</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsWebsiteModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => updateWebsiteMutation.mutate(websiteSettings)}>
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Website Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{websiteSettings.title || clientData?.businessName}</h3>
                      <p className="text-sm text-gray-600">{websiteSettings.description || 'Professional services for all your needs'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">✓ Contact Information</p>
                      {websiteSettings.showServices && <p className="text-xs text-gray-500">✓ Service Listings</p>}
                      {websiteSettings.showBooking && <p className="text-xs text-gray-500">✓ Online Booking</p>}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={openWebsitePreview}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Website Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public Landing Page</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Service Showcase</span>
                      <Badge variant={websiteSettings.showServices ? "default" : "secondary"}>
                        {websiteSettings.showServices ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Online Booking</span>
                      <Badge variant={websiteSettings.showBooking ? "default" : "secondary"}>
                        {websiteSettings.showBooking ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Responsive</span>
                      <Badge variant="default">Yes</Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">Website URL:</p>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      /client-website/{clientData?.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" value={clientData?.businessName || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" value={clientData?.contactPerson || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={clientData?.email || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={clientData?.phone || ''} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={clientData?.businessAddress || ''} readOnly />
                  </div>
                </div>
                <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Edit Information</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Business Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="editBusinessName">Business Name</Label>
                          <Input id="editBusinessName" defaultValue={clientData?.businessName} />
                        </div>
                        <div>
                          <Label htmlFor="editContactPerson">Contact Person</Label>
                          <Input id="editContactPerson" defaultValue={clientData?.contactPerson} />
                        </div>
                        <div>
                          <Label htmlFor="editEmail">Email</Label>
                          <Input id="editEmail" defaultValue={clientData?.email} />
                        </div>
                        <div>
                          <Label htmlFor="editPhone">Phone</Label>
                          <Input id="editPhone" defaultValue={clientData?.phone} />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="editAddress">Address</Label>
                          <Input id="editAddress" defaultValue={clientData?.businessAddress} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                          toast({ title: 'Business information updated successfully' });
                          setIsSettingsModalOpen(false);
                        }}>Save Changes</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="w-20 font-medium">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="09:00" className="w-24" />
                        <span>to</span>
                        <Input type="time" defaultValue="17:00" className="w-24" />
                        <input type="checkbox" defaultChecked={day !== 'Sunday'} className="ml-2" />
                        <span className="text-sm text-gray-600">Open</span>
                      </div>
                    </div>
                  ))}
                  <Button className="mt-4">Save Operating Hours</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Plan Status</p>
                      <p className="text-sm text-gray-600">Current: {clientData?.status}</p>
                    </div>
                    <Badge variant="outline">{clientData?.status === 'TRIAL' ? 'TRIAL' : 'ACTIVE'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Subscription</p>
                      <p className="text-sm text-gray-600">Manage your billing and plan</p>
                    </div>
                    <Button variant="outline" size="sm">Manage Plan</Button>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
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