import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Calendar, 
  Clock, 
  Users,
  MapPin,
  Phone,
  Heart,
  Star,
  AlertTriangle,
  CheckCircle,
  Camera,
  Activity,
  Bed,
  Utensils,
  PlayCircle,
  Shield
} from 'lucide-react';

interface BoardingReservation {
  id: string;
  petName: string;
  petParent: string;
  breed: string;
  checkIn: string;
  checkOut: string;
  serviceType: 'boarding' | 'daycare' | 'sitting';
  specialNeeds: string[];
  emergencyContact: string;
  vetInfo: string;
  dailyRate: number;
  status: 'confirmed' | 'checked-in' | 'in-progress' | 'completed';
  notes: string;
  feedingSchedule?: string;
  medications?: string;
  playPreferences?: string;
}

interface DaycareSlot {
  timeSlot: string;
  capacity: number;
  currentBookings: number;
  pets: string[];
}

const sampleReservations: BoardingReservation[] = [
  {
    id: '1',
    petName: 'Max',
    petParent: 'Jennifer Smith',
    breed: 'Golden Retriever',
    checkIn: '2025-07-25',
    checkOut: '2025-07-27',
    serviceType: 'boarding',
    specialNeeds: ['Anxiety medication twice daily', 'No other dogs during meals'],
    emergencyContact: '(555) 123-4567',
    vetInfo: 'Westside Animal Hospital - (555) 987-6543',
    dailyRate: 65,
    status: 'confirmed',
    notes: 'Very friendly but gets anxious at night. Loves tennis balls.',
    feedingSchedule: '7 AM, 12 PM, 6 PM - Blue Buffalo Adult',
    medications: 'Trazodone 50mg twice daily for anxiety',
    playPreferences: 'Loves fetch, gentle with other dogs'
  },
  {
    id: '2',
    petName: 'Luna',
    petParent: 'David Chen',
    breed: 'Border Collie',
    checkIn: '2025-07-24',
    checkOut: '2025-07-24',
    serviceType: 'daycare',
    specialNeeds: ['High energy - needs lots of exercise'],
    emergencyContact: '(555) 234-5678',
    vetInfo: 'Downtown Vet Clinic - (555) 876-5432',
    dailyRate: 45,
    status: 'checked-in',
    notes: 'Super intelligent and active. Loves puzzle toys.',
    feedingSchedule: 'Bring own food - 12 PM feeding',
    playPreferences: 'Agility exercises, mental stimulation games'
  },
  {
    id: '3',
    petName: 'Bella',
    petParent: 'Maria Rodriguez',
    breed: 'French Bulldog',
    checkIn: '2025-07-24',
    checkOut: '2025-07-26',
    serviceType: 'sitting',
    specialNeeds: ['Breathing issues - monitor during exercise', 'Keep cool'],
    emergencyContact: '(555) 345-6789',
    vetInfo: 'Pet Emergency Center - (555) 765-4321',
    dailyRate: 55,
    status: 'in-progress',
    notes: 'Sweet personality but watch for overheating. Prefers indoor activities.',
    feedingSchedule: '8 AM, 6 PM - Royal Canin Bulldog',
    medications: 'None',
    playPreferences: 'Gentle indoor play, short walks only'
  }
];

const daycareSchedule: DaycareSlot[] = [
  { timeSlot: '7:00 AM - 12:00 PM', capacity: 12, currentBookings: 8, pets: ['Luna', 'Rocky', 'Daisy', 'Cooper', 'Zoe', 'Buddy', 'Milo', 'Ruby'] },
  { timeSlot: '12:00 PM - 6:00 PM', capacity: 12, currentBookings: 10, pets: ['Luna', 'Rocky', 'Daisy', 'Cooper', 'Zoe', 'Max', 'Stella', 'Charlie', 'Lucy', 'Oliver'] },
  { timeSlot: 'Full Day (7 AM - 6 PM)', capacity: 8, currentBookings: 5, pets: ['Bailey', 'Rosie', 'Tucker', 'Penny', 'Zeus'] }
];

export default function BoardingDaycareManager() {
  const [reservations, setReservations] = useState<BoardingReservation[]>(sampleReservations);
  const [selectedReservation, setSelectedReservation] = useState<BoardingReservation | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'boarding': return <Bed className="w-4 h-4" />;
      case 'daycare': return <PlayCircle className="w-4 h-4" />;
      case 'sitting': return <Home className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const totalRevenue = reservations.reduce((sum, res) => {
    const days = res.serviceType === 'daycare' ? 1 : 
                 Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return sum + (res.dailyRate * days);
  }, 0);

  const availableCapacity = daycareSchedule.reduce((sum, slot) => sum + (slot.capacity - slot.currentBookings), 0);

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Boarding & Daycare Management</h2>
          <p className="text-gray-600">Manage pet boarding, daycare, and in-home sitting services</p>
        </div>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Boarding</p>
                <p className="text-2xl font-bold">
                  {reservations.filter(r => r.serviceType === 'boarding' && r.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Daycare Today</p>
                <p className="text-2xl font-bold">
                  {reservations.filter(r => r.serviceType === 'daycare' && r.status === 'checked-in').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">In-Home Sitting</p>
                <p className="text-2xl font-bold">
                  {reservations.filter(r => r.serviceType === 'sitting' && r.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Week Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Current Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReservation?.id === reservation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(reservation.serviceType)}
                      <h3 className="font-medium">{reservation.petName} - {reservation.petParent}</h3>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{reservation.breed} • {reservation.serviceType.charAt(0).toUpperCase() + reservation.serviceType.slice(1)}</p>
                    <p>
                      {reservation.serviceType === 'daycare' ? 
                        `Today • $${reservation.dailyRate}` : 
                        `${reservation.checkIn} to ${reservation.checkOut} • $${reservation.dailyRate}/day`
                      }
                    </p>
                  </div>
                  {reservation.specialNeeds.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{reservation.specialNeeds.length} special need(s)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Details or Daycare Schedule */}
        {selectedReservation ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getServiceIcon(selectedReservation.serviceType)}
                {selectedReservation.petName} - Care Details
              </CardTitle>
              <CardDescription>
                {selectedReservation.serviceType.charAt(0).toUpperCase() + selectedReservation.serviceType.slice(1)} Service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Breed</p>
                  <p className="text-sm text-gray-600">{selectedReservation.breed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Daily Rate</p>
                  <p className="text-sm text-gray-600">${selectedReservation.dailyRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-In</p>
                  <p className="text-sm text-gray-600">{selectedReservation.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-Out</p>
                  <p className="text-sm text-gray-600">{selectedReservation.checkOut}</p>
                </div>
              </div>

              {/* Special Care Instructions */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Care Instructions
                </h4>
                <div className="space-y-3">
                  {selectedReservation.feedingSchedule && (
                    <div className="p-2 bg-green-50 rounded border-l-4 border-green-200">
                      <p className="font-medium text-green-800 text-sm flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        Feeding Schedule
                      </p>
                      <p className="text-green-700 text-sm">{selectedReservation.feedingSchedule}</p>
                    </div>
                  )}
                  
                  {selectedReservation.medications && (
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-200">
                      <p className="font-medium text-red-800 text-sm flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Medications
                      </p>
                      <p className="text-red-700 text-sm">{selectedReservation.medications}</p>
                    </div>
                  )}
                  
                  {selectedReservation.playPreferences && (
                    <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                      <p className="font-medium text-blue-800 text-sm flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" />
                        Play Preferences
                      </p>
                      <p className="text-blue-700 text-sm">{selectedReservation.playPreferences}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Needs */}
              {selectedReservation.specialNeeds.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Special Needs
                  </h4>
                  <ul className="space-y-1">
                    {selectedReservation.specialNeeds.map((need, index) => (
                      <li key={index} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Emergency Contacts
                </h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="p-2 border rounded">
                    <p className="font-medium">Pet Parent</p>
                    <p className="text-gray-600">{selectedReservation.emergencyContact}</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="font-medium">Veterinarian</p>
                    <p className="text-gray-600">{selectedReservation.vetInfo}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" className="flex-1">
                  <Camera className="w-4 h-4 mr-1" />
                  Add Photos
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Activity className="w-4 h-4 mr-1" />
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Today's Daycare Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daycareSchedule.map((slot, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{slot.timeSlot}</h3>
                      <Badge variant={slot.currentBookings >= slot.capacity ? "destructive" : "secondary"}>
                        {slot.currentBookings}/{slot.capacity} capacity
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Available spots: {slot.capacity - slot.currentBookings}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {slot.pets.map((pet, petIndex) => (
                        <Badge key={petIndex} variant="outline" className="text-xs">
                          {pet}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Available Capacity</span>
                </div>
                <p className="text-sm text-blue-700">
                  {availableCapacity} spots available across all time slots today
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Boarding & Care Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Pet Care Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Boarding Excellence</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Check pets every 2 hours during boarding</li>
                <li>• Maintain detailed feeding and medication logs</li>
                <li>• Send daily photo updates to pet parents</li>
                <li>• Keep emergency vet contacts easily accessible</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Daycare Management</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Group pets by size and temperament</li>
                <li>• Rotate activities every 30-45 minutes</li>
                <li>• Monitor play for signs of stress or aggression</li>
                <li>• Maintain clean water and rest areas</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">In-Home Sitting</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Follow pet's exact home routine</li>
                <li>• Send regular updates and photos</li>
                <li>• Check in with pet parents daily</li>
                <li>• Keep detailed notes of pet behavior</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}