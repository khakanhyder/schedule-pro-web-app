import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
];

const DEFAULT_HOURS: BusinessHours = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: true, openTime: "10:00", closeTime: "16:00" },
  sunday: { isOpen: false, openTime: "10:00", closeTime: "16:00" }
};

// Correct day-of-week mapping to match JS Date.getDay()
const DAY_OF_WEEK_MAP: { [key: string]: number } = {
  sunday: 0,
  monday: 1, 
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

export default function BusinessHoursManagement() {
  const [hours, setHours] = useState<BusinessHours>(DEFAULT_HOURS);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  // Get clientId (TODO: Get from auth context in real app)
  const getClientId = () => {
    const clientData = localStorage.getItem('clientData');
    if (clientData) {
      try {
        return JSON.parse(clientData).id;
      } catch (e) {
        console.warn('Failed to parse clientData from localStorage');
      }
    }
    return localStorage.getItem('currentClientId') || 'client_1';
  };
  
  const clientId = getClientId();

  // Load existing appointment slots on component mount
  useEffect(() => {
    const loadExistingSlots = async () => {
      if (!clientId) return;
      
      try {
        const response = await apiRequest("GET", `/api/client/${clientId}/appointment-slots`);
        const existingSlots = await response.json();
        
        if (existingSlots && existingSlots.length > 0) {
          // Convert existing slots back to BusinessHours format
          const loadedHours = { ...DEFAULT_HOURS };
          
          existingSlots.forEach((slot: any) => {
            const dayKey = Object.keys(DAY_OF_WEEK_MAP).find(key => DAY_OF_WEEK_MAP[key] === slot.dayOfWeek);
            if (dayKey) {
              loadedHours[dayKey] = {
                isOpen: slot.isActive,
                openTime: slot.startTime,
                closeTime: slot.endTime
              };
            }
          });
          
          setHours(loadedHours);
        }
      } catch (error) {
        console.error("Error loading existing slots:", error);
        // Use defaults if loading fails
      } finally {
        setInitialLoading(false);
        setHasChanges(false);
      }
    };

    loadExistingSlots();
  }, [clientId]);

  const updateDayHours = (day: string, field: keyof BusinessHours[string], value: boolean | string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
    setHasChanges(true);
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceHours = hours[sourceDay];
    const newHours = { ...hours };
    
    DAYS_OF_WEEK.forEach(day => {
      if (day.key !== sourceDay) {
        newHours[day.key] = { ...sourceHours };
      }
    });
    
    setHours(newHours);
    setHasChanges(true);
    toast({
      title: "Hours Copied",
      description: `Applied ${DAYS_OF_WEEK.find(d => d.key === sourceDay)?.label} hours to all days`
    });
  };

  const setStandardHours = (type: "business" | "weekend") => {
    const newHours = { ...hours };
    
    if (type === "business") {
      ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
        newHours[day] = { isOpen: true, openTime: "09:00", closeTime: "17:00" };
      });
      toast({
        title: "Standard Business Hours Set",
        description: "Monday-Friday: 9:00 AM - 5:00 PM"
      });
    } else {
      ["saturday", "sunday"].forEach(day => {
        newHours[day] = { isOpen: true, openTime: "10:00", closeTime: "16:00" };
      });
      toast({
        title: "Weekend Hours Set",
        description: "Saturday-Sunday: 10:00 AM - 4:00 PM"
      });
    }
    
    setHours(newHours);
    setHasChanges(true);
  };

  const saveHours = async () => {
    if (!clientId) {
      toast({
        title: "Error",
        description: "Client ID not found",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, get existing appointment slots to update them
      const response = await apiRequest("GET", `/api/client/${clientId}/appointment-slots`);
      const existingSlots = await response.json();
      
      // Convert BusinessHours format to AppointmentSlot format using correct day mapping
      const slotsToUpdate = Object.entries(hours).map(([day, dayHours]) => {
        const dayOfWeek = DAY_OF_WEEK_MAP[day];
        return {
          clientId,
          dayOfWeek,
          startTime: dayHours.openTime,
          endTime: dayHours.closeTime,
          slotDuration: 30,
          isActive: dayHours.isOpen
        };
      });

      // Update or create each appointment slot using correct apiRequest signature
      for (const slot of slotsToUpdate) {
        const existingSlot = existingSlots?.find((s: any) => s.dayOfWeek === slot.dayOfWeek);
        
        if (existingSlot) {
          // Update existing slot
          await apiRequest("PUT", `/api/client/${clientId}/appointment-slots/${existingSlot.id}`, slot);
        } else {
          // Create new slot  
          await apiRequest("POST", `/api/client/${clientId}/appointment-slots`, slot);
        }
      }
      
      setHasChanges(false);
      toast({
        title: "Business Hours Saved",
        description: "Your operating hours have been updated successfully. Available appointment slots will now reflect these changes."
      });
    } catch (error) {
      console.error("Error saving business hours:", error);
      toast({
        title: "Error", 
        description: "Failed to save business hours. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Loading business hours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Hours</h2>
          <p className="text-muted-foreground">
            Set your operating hours for each day of the week
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setStandardHours("business")}
          >
            Set Business Hours
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setStandardHours("weekend")}
          >
            Set Weekend Hours
          </Button>
          {hasChanges && (
            <Button onClick={saveHours} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DAYS_OF_WEEK.map((day) => {
          const dayHours = hours[day.key];
          
          return (
            <Card key={day.key}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{day.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={dayHours.isOpen}
                      onCheckedChange={(checked) => 
                        updateDayHours(day.key, "isOpen", checked)
                      }
                    />
                    <Label htmlFor={`${day.key}-open`} className="text-sm">
                      Open
                    </Label>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {dayHours.isOpen ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${day.key}-open-time`}>Opening Time</Label>
                        <Input
                          id={`${day.key}-open-time`}
                          type="time"
                          value={dayHours.openTime}
                          onChange={(e) => 
                            updateDayHours(day.key, "openTime", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${day.key}-close-time`}>Closing Time</Label>
                        <Input
                          id={`${day.key}-close-time`}
                          type="time"
                          value={dayHours.closeTime}
                          onChange={(e) => 
                            updateDayHours(day.key, "closeTime", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {dayHours.openTime} - {dayHours.closeTime}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(day.key)}
                      >
                        Copy to All
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Closed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hours Summary</CardTitle>
          <CardDescription>
            Review your complete weekly schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const dayHours = hours[day.key];
              return (
                <div key={day.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium">{day.label}</span>
                  <span className="text-muted-foreground">
                    {dayHours.isOpen 
                      ? `${dayHours.openTime} - ${dayHours.closeTime}`
                      : "Closed"
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}