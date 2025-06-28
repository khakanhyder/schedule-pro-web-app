import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plus, Users, DollarSign, TrendingUp, Maximize2, Minimize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { type Service, type Stylist, type Appointment } from "@shared/schema";

export default function CalendarCentricDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcuts for desktop users
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        case 'w':
          e.preventDefault();
          setViewMode('week');
          break;
        case 'd':
          e.preventDefault();
          setViewMode('day');
          break;
        case 't':
          e.preventDefault();
          setSelectedDate(new Date());
          break;
        case 'arrowleft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (viewMode === 'week') {
              goToPreviousWeek();
            } else {
              setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
            }
          }
          break;
        case 'arrowright':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (viewMode === 'week') {
              goToNextWeek();
            } else {
              setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
            }
          }
          break;
        case 'escape':
          if (isFullscreen) {
            e.preventDefault();
            setIsFullscreen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, viewMode, selectedDate]);

  // Get appointments for selected date
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments', selectedDate.toISOString().split('T')[0]],
    queryFn: () => fetch(`/api/appointments?date=${selectedDate.toISOString().split('T')[0]}`).then(res => res.json())
  });

  // Get services and staff for quick stats
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  const { data: staff = [] } = useQuery<Stylist[]>({
    queryKey: ['/api/stylists']
  });

  // Calculate week days for week view
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate month days for month view
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthStartWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEndWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthStartWeek, end: monthEndWeek });

  // Quick stats
  const todayAppointments = appointments.length;
  const todayRevenue = appointments.reduce((sum: number, apt: any) => sum + (parseFloat(apt.price) || 0), 0);

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  // Navigation functions
  const goToPreviousWeek = () => setSelectedDate(subWeeks(selectedDate, 1));
  const goToNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
  const goToPreviousDay = () => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  const goToNextDay = () => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  const goToPreviousMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate()));
  const goToNextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate()));
  const goToToday = () => setSelectedDate(new Date());

  // Button action handlers
  const handleAddAppointment = (time?: string) => {
    const timeInfo = time ? ` at ${time}` : '';
    alert(`Would open appointment creation form for ${format(selectedDate, 'MMM d, yyyy')}${timeInfo}`);
  };

  const handleAppointmentClick = (appointment: any) => {
    alert(`Would open details for ${appointment.clientName}'s appointment`);
  };

  // Full-screen calendar component
  const FullscreenCalendar = () => (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Full-screen Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card">
        <div>
          <h1 className="text-4xl font-bold">Schedule Calendar</h1>
          <p className="text-lg text-muted-foreground mt-1">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "day" ? "default" : "outline"}
              onClick={() => setViewMode("day")}
            >
              Day View
            </Button>
            <Button 
              variant={viewMode === "week" ? "default" : "outline"}
              onClick={() => setViewMode("week")}
            >
              Week View
            </Button>
            <Button 
              variant={viewMode === "month" ? "default" : "outline"}
              onClick={() => setViewMode("month")}
            >
              Month View
            </Button>
          </div>
          
          <Button onClick={() => setIsFullscreen(false)} variant="outline" size="lg">
            <X className="h-5 w-5 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-b bg-muted/10">
        <Button 
          variant="outline" 
          onClick={viewMode === "week" ? goToPreviousWeek : viewMode === "day" ? goToPreviousDay : goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" /> 
          Previous {viewMode === "week" ? "Week" : viewMode === "day" ? "Day" : "Month"}
        </Button>
        
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
        
        <Button 
          variant="outline" 
          onClick={viewMode === "week" ? goToNextWeek : viewMode === "day" ? goToNextDay : goToNextMonth}
        >
          Next {viewMode === "week" ? "Week" : viewMode === "day" ? "Day" : "Month"} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Full-screen Calendar Grid */}
      <div className="flex-1 p-6 overflow-auto">
        {viewMode === "week" ? (
          <>
            {/* Desktop Week View */}
            <div className="hidden lg:grid grid-cols-8 gap-2 h-full min-h-[600px]">
              {/* Time column */}
              <div className="space-y-16 pt-12">
                {timeSlots.map((time) => (
                  <div key={time} className="text-sm text-muted-foreground text-right pr-2 font-medium">
                    {time}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className={`p-4 text-center border-b ${
                    isToday(day) ? 'bg-primary text-primary-foreground' : 
                    isSameDay(day, selectedDate) ? 'bg-primary/10' : ''
                  }`}>
                    <div className="font-medium text-sm">{format(day, "EEE")}</div>
                    <div className="text-3xl font-bold">{format(day, "d")}</div>
                  </div>
                  
                  <div className="p-2 space-y-16">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-16 border-t border-dashed relative group cursor-pointer hover:bg-muted/50">
                        {appointments
                          .filter(apt => isSameDay(new Date(apt.date), day))
                          .map((apt, idx) => (
                            <div
                              key={apt.id || idx}
                              className="absolute inset-x-1 top-1 bg-primary text-primary-foreground text-xs rounded p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <div className="font-medium truncate">{apt.clientName}</div>
                              <div className="truncate opacity-90">{apt.serviceName || 'Service'}</div>
                            </div>
                          ))}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Week View - Simplified */}
            <div className="lg:hidden space-y-4">
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      isToday(day) ? 'bg-primary text-primary-foreground' : 
                      isSameDay(day, selectedDate) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="text-xs font-medium">{format(day, "EEE")}</div>
                    <div className="text-lg font-bold">{format(day, "d")}</div>
                    <div className="text-xs">
                      {appointments.filter(apt => isSameDay(new Date(apt.date), day)).length || ''}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected Day Schedule for Mobile */}
              <Card>
                <CardHeader>
                  <CardTitle>{format(selectedDate, "EEEE, MMMM d")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {timeSlots.map((time) => {
                    const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), selectedDate));
                    return (
                      <div key={time} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <span className="font-medium">{time}</span>
                        {dayAppointments.length > 0 ? (
                          <div className="text-sm">
                            {dayAppointments.map((apt, idx) => (
                              <div key={apt.id || idx} className="text-primary font-medium">
                                {apt.clientName}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleAddAppointment(time)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </>
          
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">{format(selectedDate, "EEEE")}</h2>
              <p className="text-2xl text-muted-foreground">{format(selectedDate, "MMMM d, yyyy")}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {timeSlots.map((time) => {
                const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), selectedDate));
                const hasAppointment = dayAppointments.some(apt => {
                  // Simple time matching - in real app would need proper time parsing
                  return true; // For demo purposes
                });
                
                return (
                  <Card key={time} className="p-6 min-h-32 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold">{time}</span>
                      <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddAppointment(time)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                    </div>
                    
                    {dayAppointments.length > 0 ? (
                      <div className="space-y-2">
                        {dayAppointments.map((apt: any, idx: number) => (
                          <div key={apt.id || idx} 
                               className="p-3 bg-primary/10 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors" 
                               onClick={() => handleAppointmentClick(apt)}>
                            <div className="font-medium text-lg">{apt.clientName}</div>
                            <div className="text-muted-foreground">{apt.serviceName || 'Service'}</div>
                            <div className="text-sm text-primary font-medium mt-1">
                              {apt.duration ? `${apt.duration} min` : '60 min'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4 border-2 border-dashed border-muted rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Available</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        ) : viewMode === "month" ? (
          <div className="text-center text-muted-foreground py-8">
            Month view coming soon!
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && <FullscreenCalendar />}
      
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
            <Button 
              variant={viewMode === "day" ? "default" : "outline"}
              onClick={() => setViewMode("day")}
              size="sm"
            >
              Day
            </Button>
            <Button 
              variant={viewMode === "week" ? "default" : "outline"}
              onClick={() => setViewMode("week")}
              size="sm"
            >
              Week
            </Button>
            <Button 
              variant={viewMode === "month" ? "default" : "outline"}
              onClick={() => setViewMode("month")}
              size="sm"
            >
              Month
            </Button>
            <Button 
              onClick={() => setIsFullscreen(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Full Calendar
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsFullscreen(true)}>
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
              <div className="text-2xl font-bold">${todayRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Projected earnings
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

        {/* Compact Calendar Preview - Click to Expand */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsFullscreen(true)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Weekly Schedule</CardTitle>
              <CardDescription className="hidden sm:block">
                Click to expand • Keyboard: F (fullscreen), W (week), D (day), T (today), Ctrl+← → (navigate)
              </CardDescription>
              <CardDescription className="sm:hidden">
                Tap to open full calendar view
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); goToPreviousWeek(); }}>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Prev</span>
              </Button>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); goToToday(); }}>
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">•</span>
              </Button>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); goToNextWeek(); }}>
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}>
                <Maximize2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Expand</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Week Grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="text-center p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors min-h-24">
                    <div className={`font-medium text-sm ${isToday(day) ? 'text-primary' : ''}`}>
                      {format(day, "EEE")}
                    </div>
                    <div className={`text-xl font-bold ${isToday(day) ? 'text-primary' : ''}`}>
                      {format(day, "d")}
                    </div>
                    <div className="mt-2 space-y-1">
                      {appointments
                        .filter((apt: any) => isSameDay(new Date(apt.date), day))
                        .slice(0, 3)
                        .map((apt: any, idx: number) => (
                          <div key={apt.id || idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded truncate">
                            {apt.clientName}
                          </div>
                        ))}
                      {appointments.filter((apt: any) => isSameDay(new Date(apt.date), day)).length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{appointments.filter((apt: any) => isSameDay(new Date(apt.date), day)).length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Week Row */}
            <div className="md:hidden">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={(e) => { e.stopPropagation(); setSelectedDate(day); }}
                    className={`text-center p-2 border rounded transition-colors ${
                      isToday(day) ? 'bg-primary text-primary-foreground' : 
                      isSameDay(day, selectedDate) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="text-xs font-medium">{format(day, "EEE")[0]}</div>
                    <div className="text-sm font-bold">{format(day, "d")}</div>
                    <div className="w-1 h-1 bg-primary rounded-full mx-auto" 
                         style={{ opacity: appointments.filter((apt: any) => isSameDay(new Date(apt.date), day)).length > 0 ? 1 : 0 }} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Detailed Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments > 0 ? (
              <div className="space-y-4">
                {appointments.map((apt, idx) => (
                  <div key={apt.id || idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {format(new Date(apt.date), "h:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(apt.date), "a")}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{apt.clientName}</div>
                        <div className="text-sm text-muted-foreground">{apt.serviceName || 'Service'}</div>
                        <div className="text-sm text-muted-foreground">{apt.clientPhone || apt.clientEmail}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{apt.duration || 60} min</Badge>
                      <Badge variant="outline">${apt.price || '0'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No appointments today</h3>
                <p className="text-muted-foreground mb-4">Your schedule is clear</p>
                <Button onClick={() => setIsFullscreen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}