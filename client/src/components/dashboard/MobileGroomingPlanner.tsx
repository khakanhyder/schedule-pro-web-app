import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Clock, 
  Route, 
  Car, 
  Navigation,
  Fuel,
  DollarSign,
  Calendar,
  Users,
  Home,
  Truck,
  CheckCircle
} from 'lucide-react';

interface MobileAppointment {
  id: string;
  petName: string;
  petParent: string;
  address: string;
  zipCode: string;
  service: string;
  duration: number;
  price: number;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  travelTime: number;
  distance: number;
  specialInstructions?: string;
}

const sampleAppointments: MobileAppointment[] = [
  {
    id: '1',
    petName: 'Max',
    petParent: 'Jennifer Smith',
    address: '123 Oak Street',
    zipCode: '90210',
    service: 'Full Service Grooming',
    duration: 90,
    price: 85,
    time: '9:00 AM',
    status: 'scheduled',
    travelTime: 15,
    distance: 8.2,
    specialInstructions: 'Use gate on left side of house'
  },
  {
    id: '2',
    petName: 'Luna',
    petParent: 'David Chen',
    address: '456 Pine Avenue',
    zipCode: '90211',
    service: 'Nail Trim & Bath',
    duration: 45,
    price: 45,
    time: '11:00 AM',
    status: 'scheduled',
    travelTime: 12,
    distance: 5.7
  },
  {
    id: '3',
    petName: 'Charlie',
    petParent: 'Maria Rodriguez',
    address: '789 Elm Drive',
    zipCode: '90210',
    service: 'De-shedding Treatment',
    duration: 60,
    price: 65,
    time: '1:30 PM',
    status: 'scheduled',
    travelTime: 18,
    distance: 11.3
  }
];

export default function MobileGroomingPlanner() {
  const [appointments, setAppointments] = useState<MobileAppointment[]>(sampleAppointments);
  const [routeOptimized, setRouteOptimized] = useState(false);

  const optimizeRoute = () => {
    // Simulate route optimization
    const optimized = [...appointments].sort((a, b) => {
      // Sort by zip code proximity and travel time
      if (a.zipCode === b.zipCode) {
        return a.travelTime - b.travelTime;
      }
      return a.zipCode.localeCompare(b.zipCode);
    });
    
    // Update times based on optimized order
    let currentTime = 9 * 60; // 9:00 AM in minutes
    const optimizedWithTimes = optimized.map((apt, index) => {
      if (index > 0) {
        currentTime += optimized[index - 1].duration + optimized[index - 1].travelTime;
      }
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      return {
        ...apt,
        time: `${hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
      };
    });
    
    setAppointments(optimizedWithTimes);
    setRouteOptimized(true);
  };

  const totalDistance = appointments.reduce((sum, apt) => sum + apt.distance, 0);
  const totalRevenue = appointments.reduce((sum, apt) => sum + apt.price, 0);
  const estimatedFuelCost = (totalDistance * 0.12).toFixed(2); // $0.12 per mile estimate

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Route Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-sm text-gray-600">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Route className="w-4 h-4" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} mi</div>
            <p className="text-sm text-gray-600">Driving distance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-sm text-gray-600">Est. fuel cost: ${estimatedFuelCost}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Route Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {routeOptimized ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Optimized</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Not optimized</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Optimization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Smart Route Planning
              </CardTitle>
              <CardDescription>
                Optimize your mobile grooming route to save time and fuel costs
              </CardDescription>
            </div>
            <Button 
              onClick={optimizeRoute}
              className="flex items-center gap-2"
              disabled={routeOptimized}
            >
              <Route className="w-4 h-4" />
              {routeOptimized ? 'Route Optimized' : 'Optimize Route'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {routeOptimized && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Route optimized! Estimated savings: 25 minutes, 8.3 miles
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{appointment.petName} - {appointment.petParent}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {appointment.address}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{appointment.time} ({appointment.duration}min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span>{appointment.distance}mi ({appointment.travelTime}min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span>{appointment.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>${appointment.price}</span>
                  </div>
                </div>

                {appointment.specialInstructions && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Special Instructions:</strong> {appointment.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Grooming Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Mobile Grooming Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Route Efficiency</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Group appointments by zip code</li>
                <li>• Schedule longest services first</li>
                <li>• Plan for 15-min buffer between visits</li>
                <li>• Track fuel costs for tax deductions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Client Communication</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Send arrival time updates via SMS</li>
                <li>• Share live location when en route</li>
                <li>• Confirm parking and access details</li>
                <li>• Send before/after photos instantly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}