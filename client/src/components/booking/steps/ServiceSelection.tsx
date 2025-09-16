import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, DollarSign, User, Star, CheckCircle } from "lucide-react";
import { type ClientService, type Stylist, type BookingData } from "@shared/schema";

interface ServiceSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  services: ClientService[];
  stylists: Stylist[];
  isLoading: boolean;
}

export default function ServiceSelection({ 
  bookingData, 
  updateBookingData, 
  services, 
  stylists, 
  isLoading 
}: ServiceSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from services
  const categories = ["all", ...Array.from(new Set(services.map(service => service.category).filter(Boolean)))];

  // Filter services by category
  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleServiceSelect = (serviceId: string) => {
    const updates: Partial<BookingData> = { serviceId };
    
    // If no stylists available, auto-set to "any" to allow progression
    if (stylists.length === 0) {
      updates.stylistId = "any";
    } else {
      // Reset stylist when service changes if stylists are available
      updates.stylistId = null;
    }
    
    updateBookingData(updates);
  };

  const handleStylistSelect = (stylistId: string) => {
    updateBookingData({ stylistId });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Service</h2>
          <p className="text-gray-600">Choose the service you'd like to book</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Service</h2>
        <p className="text-gray-600">
          Choose the service you'd like to book{stylists.length > 0 ? " and your preferred stylist" : ""}
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category || "all")}
              className="capitalize"
              data-testid={`category-filter-${category}`}
            >
              {category === "all" ? "All Services" : category}
            </Button>
          ))}
        </div>
      )}

      {/* Service Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                bookingData.serviceId === service.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              onClick={() => handleServiceSelect(service.id)}
              data-testid={`service-card-${service.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                  {bookingData.serviceId === service.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" data-testid="service-selected-icon" />
                  )}
                </div>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{service.price}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{service.durationMinutes} min</span>
                  </div>
                </div>
                
                {service.category && (
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stylist Selection - Only show if stylists exist */}
      {bookingData.serviceId && stylists.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Stylist (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stylists.map((stylist) => (
              <Card
                key={stylist.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  bookingData.stylistId === stylist.id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => handleStylistSelect(stylist.id)}
                data-testid={`stylist-card-${stylist.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      {stylist.name}
                    </CardTitle>
                    {bookingData.stylistId === stylist.id && (
                      <CheckCircle className="w-5 h-5 text-green-600" data-testid="stylist-selected-icon" />
                    )}
                  </div>
                  {stylist.email && (
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {stylist.email}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {stylist.specializations && stylist.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stylist.specializations.slice(0, 3).map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm font-medium">
                        5.0
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      New reviews
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Any Available Stylist Option */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-dashed ${
                bookingData.stylistId === "any"
                  ? 'ring-2 ring-blue-500 shadow-lg border-solid'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              onClick={() => handleStylistSelect("any")}
              data-testid="stylist-card-any"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  Any Available Stylist
                  {bookingData.stylistId === "any" && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  We'll assign the best available stylist for your appointment
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Badge variant="secondary" className="text-xs">
                  Flexible scheduling
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {bookingData.serviceId && (stylists.length === 0 || bookingData.stylistId) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Selection Complete</h4>
          </div>
          <p className="text-green-700 text-sm">
            You've selected "{services.find(s => s.id === bookingData.serviceId)?.name}"
            {stylists.length === 0 
              ? "" 
              : bookingData.stylistId === "any" 
                ? " with any available stylist" 
                : ` with ${stylists.find(s => s.id === bookingData.stylistId)?.name}`
            }. Click "Next" to continue.
          </p>
        </div>
      )}
    </div>
  );
}