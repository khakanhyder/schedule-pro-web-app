import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function BusinessHoursManagement() {
  const [hours, setHours] = useState<BusinessHours>(DEFAULT_HOURS);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

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
    try {
      // Here you would typically save to your backend
      // await apiRequest("PUT", "/api/business-hours", hours);
      
      setHasChanges(false);
      toast({
        title: "Business Hours Saved",
        description: "Your operating hours have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save business hours",
        variant: "destructive"
      });
    }
  };

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
            <Button onClick={saveHours}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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