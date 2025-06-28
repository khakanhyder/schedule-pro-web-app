import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Smartphone, Monitor, Globe } from "lucide-react";

export default function BusinessBrandingPreview() {
  const [businessName, setBusinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");

  useEffect(() => {
    // Get branding from localStorage
    setBusinessName(localStorage.getItem('businessName') || 'Your Business Name');
    setBusinessLogo(localStorage.getItem('businessLogo') || '');
  }, []);

  const previewLocations = [
    {
      icon: <Globe className="h-4 w-4" />,
      title: "Website Header",
      description: "Your logo appears in the navigation bar on all pages",
      preview: (
        <div className="bg-white border rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-3">
            {businessLogo ? (
              <img src={businessLogo} alt={businessName} className="h-6 w-6 rounded object-cover" />
            ) : (
              <div className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                {businessName.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-blue-600">{businessName}</span>
          </div>
        </div>
      )
    },
    {
      icon: <Monitor className="h-4 w-4" />,
      title: "Dashboard Header",
      description: "Personalized welcome message and branding in your business portal",
      preview: (
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            {businessLogo ? (
              <img src={businessLogo} alt={businessName} className="h-8 w-8 rounded object-cover" />
            ) : (
              <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm">
                {businessName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900">{businessName} Dashboard</h3>
              <p className="text-sm text-slate-600">Welcome back!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      title: "Booking Confirmation",
      description: "Clients see your branding when booking appointments",
      preview: (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {businessLogo ? (
                <img src={businessLogo} alt={businessName} className="h-10 w-10 rounded object-cover" />
              ) : (
                <div className="h-10 w-10 bg-blue-500 rounded flex items-center justify-center text-white">
                  {businessName.charAt(0)}
                </div>
              )}
            </div>
            <h4 className="font-semibold text-slate-900">{businessName}</h4>
            <p className="text-sm text-slate-600">Appointment Confirmed</p>
            <Badge variant="secondary" className="mt-2">Service Booked</Badge>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Branding Preview</h2>
        <p className="text-muted-foreground">
          See how your business logo and name appear throughout the platform
        </p>
      </div>

      <div className="grid gap-6">
        {previewLocations.map((location, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {location.icon}
                {location.title}
              </CardTitle>
              <CardDescription>{location.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {location.preview}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Additional Branding Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Client-Facing Areas:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Email confirmations and reminders</li>
                <li>• Receipt and invoice headers</li>
                <li>• Online booking widget</li>
                <li>• Review request emails</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Business Areas:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Staff notification emails</li>
                <li>• Business reports and analytics</li>
                <li>• Marketing campaign headers</li>
                <li>• Mobile app icon (iOS/Android)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}