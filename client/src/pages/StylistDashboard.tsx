import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  type Service, 
  type Stylist, 
  type Appointment 
} from "@shared/schema";

export default function StylistDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("appointments");
  
  // Format date for API request
  const formattedDate = selectedDate ? selectedDate.toISOString() : new Date().toISOString();
  
  // Get all appointments for the selected date
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", formattedDate],
    queryFn: async () => {
      const response = await fetch(`/api/appointments?date=${formattedDate}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
  });
  
  // Get all services
  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  // Get all stylists
  const { data: stylists } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });
  
  // Find service name by ID
  const getServiceName = (serviceId: number) => {
    return services?.find(service => service.id === serviceId)?.name || "Unknown Service";
  };
  
  // Find stylist name by ID
  const getStylistName = (stylistId: number) => {
    return stylists?.find(stylist => stylist.id === stylistId)?.name || "Unknown Stylist";
  };
  
  // Sort appointments by time
  const sortedAppointments = appointments?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">Stylist Dashboard</h2>
        
        <Tabs defaultValue="appointments" onValueChange={setSelectedTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today\'s'} Appointments
                  </CardTitle>
                  <Button size="sm">+ Add Appointment</Button>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="text-center py-8">Loading appointments...</div>
                  ) : sortedAppointments && sortedAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {sortedAppointments.map((appointment) => (
                        <Card key={appointment.id} className="p-4 relative hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-[2fr_2fr_1fr] gap-4">
                            <div>
                              <h3 className="font-medium text-lg">{appointment.clientName}</h3>
                              <div className="text-sm text-muted-foreground">
                                {appointment.clientEmail} | {appointment.clientPhone}
                              </div>
                              <div className="mt-2">
                                <Badge variant="secondary">{getServiceName(appointment.serviceId)}</Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Time:</span> {format(new Date(appointment.date), 'h:mm a')}
                              </p>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Stylist:</span> {getStylistName(appointment.stylistId)}
                              </p>
                              {appointment.notes && (
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end justify-start gap-2">
                              <Button size="sm" variant="outline">Details</Button>
                              <Button size="sm" variant="outline">Reschedule</Button>
                              <Badge variant={appointment.confirmed ? "success" : "outline"}>
                                {appointment.confirmed ? "Confirmed" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                      <p className="text-muted-foreground mb-4">No appointments for this date</p>
                      <Button size="sm">Add New Appointment</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center font-medium border-b pb-2">
                  <div>Sunday</div>
                  <div>Monday</div>
                  <div>Tuesday</div>
                  <div>Wednesday</div>
                  <div>Thursday</div>
                  <div>Friday</div>
                  <div>Saturday</div>
                </div>
                <div className="h-96 mt-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Detailed schedule view will be implemented soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </TabsContent>
          
          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client List</CardTitle>
                <Button size="sm">+ Add Client</Button>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">Client management feature will be implemented soon.</p>
                </CardContent>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}