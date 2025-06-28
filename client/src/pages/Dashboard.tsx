import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle,
  AlertCircle,
  Settings,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  type Service, 
  type Stylist, 
  type Appointment 
} from "@shared/schema";
import CalendarCentricDashboard from "@/components/dashboard/CalendarCentricDashboard";
import AppointmentForm from "@/components/dashboard/AppointmentForm";
import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import ClientManagement from "@/components/dashboard/ClientManagement";
import PaymentOptions from "@/components/dashboard/PaymentOptions";
import AIInsights from "@/components/dashboard/AIInsights";
import BusinessGrowthTools from "@/components/dashboard/BusinessGrowthToolsSimple";
import AdvancedFeatures from "@/components/dashboard/AdvancedFeatures";
import IndustrySpecificFeatures from "@/components/dashboard/IndustrySpecificFeatures";
import PredictiveInsights from "@/components/dashboard/PredictiveInsights";
import ExecutiveDashboard from "@/components/dashboard/ExecutiveDashboard";
import SettingsManagement from "@/components/dashboard/SettingsManagement";
import { useIndustry, getTerminology } from "@/lib/industryContext";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("appointments");
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();

  // Check if setup is completed
  useEffect(() => {
    const setupCompleted = localStorage.getItem('setupCompleted');
    const hasServices = localStorage.getItem('hasServices');
    const hasStaff = localStorage.getItem('hasStaff');

    if (!setupCompleted || !hasServices || !hasStaff) {
      setLocation("/setup");
    }
  }, [setLocation]);

  // Get terminology for current industry
  const terms = getTerminology(selectedIndustry.id);

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  // Fetch staff/professionals  
  const { data: staff = [] } = useQuery<Stylist[]>({
    queryKey: ['/api/stylists']
  });

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const { data: todayAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', today],
    queryFn: () => fetch(`/api/appointments?date=${today}`).then(res => res.json())
  });

  // Calculate stats
  const todayAppointmentsCount = todayAppointments.length;
  const calculateDailyRevenue = () => {
    return todayAppointments.reduce((sum, apt) => {
      const service = services.find(s => s.id === apt.serviceId);
      const price = parseFloat(service?.price?.replace(/[^0-9.]/g, '') || '0');
      return sum + price;
    }, 0);
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (data: any) => {
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsAddAppointmentOpen(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <section className="py-8 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedIndustry.name} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your {terms.appointment}s and grow your business
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsAddAppointmentOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New {terms.appointment.charAt(0).toUpperCase() + terms.appointment.slice(1)}
            </Button>
            <Button variant="outline" onClick={() => setSelectedTab("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateDailyRevenue().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {todayAppointmentsCount} {todayAppointmentsCount === 1 ? terms.appointment : terms.appointment + 's'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {terms.appointment.charAt(0).toUpperCase() + terms.appointment.slice(1)}s
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointmentsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Today's schedule
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => setIsAddAppointmentOpen(true)}
              >
                New {terms.appointment.charAt(0).toUpperCase() + terms.appointment.slice(1)}
              </Button>
              <Button size="sm" variant="outline">Request Review</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="appointments" onValueChange={setSelectedTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="appointments">Calendar</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="clients">{terms.client.charAt(0).toUpperCase() + terms.client.slice(1)}s</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Calendar-Centric Dashboard */}
          <TabsContent value="appointments">
            <CalendarCentricDashboard />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <WeeklySchedule />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentOptions />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <AIInsights />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>

        {/* Add Appointment Dialog */}
        <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Create New {terms.appointment.charAt(0).toUpperCase() + terms.appointment.slice(1)}</DialogTitle>
            <DialogDescription>
              Schedule a new {terms.appointment} for your {terms.client}
            </DialogDescription>
            <AppointmentForm 
              onSubmit={handleAppointmentSubmit}
              onCancel={() => setIsAddAppointmentOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}