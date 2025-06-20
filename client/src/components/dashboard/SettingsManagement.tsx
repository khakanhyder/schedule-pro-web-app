import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Scissors, Clock, Settings2, Building2 } from "lucide-react";
import StaffManagement from "./StaffManagement";
import ServicesManagement from "./ServicesManagement";
import BusinessHoursManagement from "./BusinessHoursManagement";
import { useIndustry, getTerminology } from "@/lib/industryContext";

export default function SettingsManagement() {
  const { selectedIndustry } = useIndustry();
  const terminology = getTerminology(selectedIndustry.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-muted-foreground">
          Manage your team, services, hours, and business configuration
        </p>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
          <StaffManagement />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServicesManagement />
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <BusinessHoursManagement />
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <BusinessInfoManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BusinessInfoManagement() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Your Business Name",
    email: "contact@yourbusiness.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    website: "https://yourbusiness.com",
    description: "Professional services with excellent customer care"
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Business Information</h2>
        <p className="text-muted-foreground">
          Update your business details and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Primary business contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <input 
                className="w-full px-3 py-2 border rounded-md"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input 
                className="w-full px-3 py-2 border rounded-md"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <input 
                className="w-full px-3 py-2 border rounded-md"
                value={businessInfo.website}
                onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Description</CardTitle>
            <CardDescription>
              Business address and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Address</label>
              <input 
                className="w-full px-3 py-2 border rounded-md"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Description</label>
              <textarea 
                className="w-full px-3 py-2 border rounded-md h-32"
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Settings</CardTitle>
          <CardDescription>
            Configure how customers can book with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Advance Booking Window</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
                <option value="60">2 months</option>
                <option value="90">3 months</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Notice</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Confirmations</h4>
                <p className="text-sm text-muted-foreground">Send booking confirmations via email</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">SMS Reminders</h4>
                <p className="text-sm text-muted-foreground">Send appointment reminders via SMS</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Online Payments</h4>
                <p className="text-sm text-muted-foreground">Allow customers to pay when booking</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}