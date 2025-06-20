import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Clock, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessDetails {
  businessName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  services: string[];
}

interface BusinessDetailsCustomizerProps {
  onDetailsChange: (details: BusinessDetails) => void;
  currentDetails?: BusinessDetails;
}

const defaultHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "10:00", close: "16:00", closed: false },
  sunday: { open: "10:00", close: "16:00", closed: true }
};

export default function BusinessDetailsCustomizer({ onDetailsChange, currentDetails }: BusinessDetailsCustomizerProps) {
  const [details, setDetails] = useState<BusinessDetails>(currentDetails || {
    businessName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    hours: defaultHours,
    services: []
  });
  
  const [newService, setNewService] = useState("");
  const { toast } = useToast();

  const updateDetails = (updates: Partial<BusinessDetails>) => {
    const newDetails = { ...details, ...updates };
    setDetails(newDetails);
    onDetailsChange(newDetails);
  };

  const addService = () => {
    if (newService.trim() && !details.services.includes(newService.trim())) {
      const updatedServices = [...details.services, newService.trim()];
      updateDetails({ services: updatedServices });
      setNewService("");
      toast({
        title: "Service Added",
        description: `${newService.trim()} has been added to your services`
      });
    }
  };

  const removeService = (service: string) => {
    const updatedServices = details.services.filter(s => s !== service);
    updateDetails({ services: updatedServices });
  };

  const updateHours = (day: string, field: string, value: string | boolean) => {
    const updatedHours = {
      ...details.hours,
      [day]: { ...details.hours[day], [field]: value }
    };
    updateDetails({ hours: updatedHours });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Basic details about your business that will appear on your booking page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={details.businessName}
                onChange={(e) => updateDetails({ businessName: e.target.value })}
                placeholder="Your Business Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={details.website}
                onChange={(e) => updateDetails({ website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={details.description}
              onChange={(e) => updateDetails({ description: e.target.value })}
              placeholder="Tell potential clients about your business..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={details.phone}
                onChange={(e) => updateDetails({ phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => updateDetails({ email: e.target.value })}
                placeholder="contact@yourbusiness.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={details.address}
              onChange={(e) => updateDetails({ address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>
            Add the services you provide to help clients book the right appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Enter a service name"
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <Button onClick={addService} disabled={!newService.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {details.services.map((service, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {service}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => removeService(service)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your operating hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(details.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-20 capitalize font-medium">
                  {day}
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Open</span>
                </label>

                {!hours.closed && (
                  <>
                    <Input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}

                {hours.closed && (
                  <span className="text-muted-foreground italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}