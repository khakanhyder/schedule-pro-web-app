import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plus, Users, DollarSign, TrendingUp } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";

export default function CalendarCentricDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  // Get appointments for selected date
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments', selectedDate.toISOString().split('T')[0]],
    queryFn: () => fetch(`/api/appointments?date=${selectedDate.toISOString().split('T')[0]}`).then(res => res.json())
  });

  // Get services and staff for quick stats
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services']
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['/api/stylists']
  });

  // Calculate week days for week view
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Quick stats
  const todayAppointments = appointments.length;
  const todayRevenue = appointments.reduce((sum: number, apt: any) => sum + (parseFloat(apt.price) || 0), 0);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Overview</h1>
          <p className="text-muted-foreground">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setViewMode("day")}>
            Day View
          </Button>
          <Button size="sm" variant="outline" onClick={() => setViewMode("week")}>
            Week View
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments > 0 ? "scheduled" : "No appointments today"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Expected earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Offered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Available services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Calendar View */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {viewMode === "week" ? "Week Schedule" : "Day Schedule"}
              </CardTitle>
              <CardDescription>
                Click on time slots to add appointments
              </CardDescription>
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - (viewMode === "week" ? 7 : 1) * 24 * 60 * 60 * 1000))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + (viewMode === "week" ? 7 : 1) * 24 * 60 * 60 * 1000))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === "week" ? (
            // Week View
            <div className="grid grid-cols-8 gap-1 text-sm">
              {/* Header row */}
              <div className="p-2 font-medium">Time</div>
              {weekDays.map((day) => (
                <div 
                  key={day.toISOString()} 
                  className={`p-2 text-center font-medium border rounded ${
                    isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div>{format(day, "EEE")}</div>
                  <div className="text-lg">{format(day, "d")}</div>
                </div>
              ))}
              
              {/* Time slots */}
              {timeSlots.map((time) => (
                <>
                  <div key={time} className="p-2 font-medium text-gray-600 border-r">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const dayAppointments = appointments.filter((apt: any) => 
                      isSameDay(new Date(apt.date), day) && apt.time?.includes(time.split(' ')[0])
                    );
                    
                    return (
                      <div 
                        key={`${day.toISOString()}-${time}`}
                        className="p-1 border border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          // Open appointment modal for this time slot
                          console.log(`Create appointment for ${format(day, "MM/dd/yyyy")} at ${time}`);
                        }}
                      >
                        {dayAppointments.map((apt: any, index: number) => (
                          <div 
                            key={index}
                            className="bg-blue-100 border border-blue-200 rounded px-2 py-1 mb-1 text-xs"
                          >
                            <div className="font-medium truncate">{apt.clientName}</div>
                            <div className="text-gray-600 truncate">{apt.serviceName}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          ) : (
            // Day View
            <div className="space-y-2">
              {timeSlots.map((time) => {
                const timeAppointments = appointments.filter((apt: any) => 
                  apt.time?.includes(time.split(' ')[0])
                );
                
                return (
                  <div 
                    key={time}
                    className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      console.log(`Create appointment for ${format(selectedDate, "MM/dd/yyyy")} at ${time}`);
                    }}
                  >
                    <div className="w-20 text-sm font-medium text-gray-600">
                      {time}
                    </div>
                    <div className="flex-1">
                      {timeAppointments.length > 0 ? (
                        <div className="space-y-2">
                          {timeAppointments.map((apt: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex-1">
                                <div className="font-medium">{apt.clientName}</div>
                                <div className="text-sm text-gray-600">{apt.serviceName}</div>
                              </div>
                              <Badge variant="secondary">${apt.price}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">Available</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Appointments Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{appointment.clientName}</div>
                      <div className="text-sm text-gray-600">{appointment.serviceName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{appointment.time || "Time TBD"}</div>
                    <div className="text-sm text-gray-600">${appointment.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No appointments scheduled for today</p>
              <Button className="mt-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}