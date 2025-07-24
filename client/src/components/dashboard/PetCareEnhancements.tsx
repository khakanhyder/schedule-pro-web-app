import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PawPrint, 
  Calendar, 
  Bell, 
  Heart, 
  Camera, 
  FileText, 
  Stethoscope,
  AlertTriangle,
  Users,
  Clock,
  Star,
  Phone,
  Home,
  Scissors,
  MapPin
} from 'lucide-react';

interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  temperament: string;
  specialNeeds: string;
  lastVisit: string;
  nextDue: string;
  vaccinationStatus: 'current' | 'due' | 'overdue';
  photos: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  veterinarian: {
    name: string;
    phone: string;
    address: string;
  };
}

const samplePets: PetProfile[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '3 years',
    weight: '68 lbs',
    temperament: 'Friendly, energetic, excellent with children',
    specialNeeds: 'Mild anxiety during nail trims, prefers calm environment',
    lastVisit: '2025-06-15',
    nextDue: '2025-08-15',
    vaccinationStatus: 'current',
    photos: [],
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      relationship: 'Pet Parent'
    },
    veterinarian: {
      name: 'Westside Animal Hospital',
      phone: '(555) 987-6543',
      address: '123 Main St, Anytown, USA'
    }
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Maine Coon',
    age: '7 years',
    weight: '14 lbs',
    temperament: 'Calm, dislikes loud noises',
    specialNeeds: 'Requires sedative for grooming',
    lastVisit: '2025-05-01',
    nextDue: '2025-07-01',
    vaccinationStatus: 'due',
    photos: [],
    emergencyContact: {
      name: 'Michael Chen',
      phone: '(555) 234-5678',
      relationship: 'Owner'
    },
    veterinarian: {
      name: 'City Cat Clinic',
      phone: '(555) 876-5432',
      address: '456 Oak Ave, Anytown, USA'
    }
  }
];

type PetCareSpecialization = 'groomer' | 'sitter' | 'both';

const PetCareEnhancements: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profiles');
  const [specialization, setSpecialization] = useState<PetCareSpecialization>('both');

  const getVaccinationBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-green-100 text-green-800">Current</Badge>;
      case 'due':
        return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderPetProfiles = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pet Profiles</h3>
        <Button>
          <PawPrint className="h-4 w-4 mr-2" />
          Add New Pet
        </Button>
      </div>
      
      <div className="grid gap-4">
        {samplePets.map((pet) => (
          <Card key={pet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                      <PawPrint className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{pet.name}</h4>
                      <p className="text-sm text-gray-600">{pet.breed} • {pet.age} • {pet.weight}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label className="text-xs text-gray-500">Temperament</Label>
                      <p className="text-sm">{pet.temperament}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Last Visit</Label>
                      <p className="text-sm">{new Date(pet.lastVisit).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {pet.specialNeeds && (
                    <div className="mb-3">
                      <Label className="text-xs text-gray-500">Special Needs</Label>
                      <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        {pet.specialNeeds}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-xs text-gray-500">Vaccination Status:</Label>
                    {getVaccinationBadge(pet.vaccinationStatus)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedPet(pet)}>
                    View Details
                  </Button>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {specialization === 'groomer' ? 'Book Grooming' : 
                     specialization === 'sitter' ? 'Book Care' : 'Book Service'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHealthTracking = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Health & Vaccination Tracking</h3>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Set Reminder
        </Button>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Vaccination Schedule
            </CardTitle>
            <CardDescription>Track and manage pet vaccination requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Buddy - Rabies Booster</p>
                  <p className="text-sm text-gray-600">Due: August 15, 2025</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg border-yellow-200">
                <div>
                  <p className="font-medium">Whiskers - Annual Checkup</p>
                  <p className="text-sm text-gray-600">Due: July 1, 2025</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg border-red-200">
                <div>
                  <p className="font-medium">Max - Dental Cleaning</p>
                  <p className="text-sm text-gray-600">Overdue by 2 weeks</p>
                </div>
                <Badge className="bg-red-100 text-red-800">Overdue</Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Smart Reminders</span>
              </div>
              <p className="text-sm text-blue-700">
                Automatically send vaccination reminders to pet owners 2 weeks before due dates
              </p>
              <Switch className="mt-2" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSeasonalServices = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Seasonal Service Suggestions</h3>
        <Button>
          <Star className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      
      <div className="grid gap-4">
        {(specialization === 'groomer' || specialization === 'both') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-green-600" />
                Grooming Services - Summer
              </CardTitle>
              <CardDescription>High-demand grooming services for summer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-900">De-shedding Treatments</h4>
                  <p className="text-sm text-green-700">Heavy shedding season - promote professional de-shedding</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">+40% demand</Badge>
                    <Button size="sm" variant="outline">Send to Clients</Button>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-900">Cooling Baths</h4>
                  <p className="text-sm text-blue-700">Special cooling treatments for hot weather comfort</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Premium service</Badge>
                    <Button size="sm" variant="outline">Add to Menu</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {(specialization === 'sitter' || specialization === 'both') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Pet Sitting Services - Summer
              </CardTitle>
              <CardDescription>High-demand pet sitting services for vacation season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-900">Vacation Pet Care</h4>
                  <p className="text-sm text-blue-700">Extended pet sitting during summer vacation season</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">+65% demand</Badge>
                    <Button size="sm" variant="outline">Open Bookings</Button>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-900">Daily Dog Walking</h4>
                  <p className="text-sm text-green-700">Increased demand for dog walking during hot weather</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Early morning preferred</Badge>
                    <Button size="sm" variant="outline">Schedule Premium</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Winter Services - All Pet Care
            </CardTitle>
            <CardDescription>Essential winter care services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-orange-50">
                <h4 className="font-medium text-orange-900">Paw Care & Protection</h4>
                <p className="text-sm text-orange-700">Salt and ice protection for paws, essential for all pets</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Essential care</Badge>
                  <Button size="sm" variant="outline">Schedule Regular</Button>
                </div>
              </div>
              
              {specialization === 'sitter' || specialization === 'both' ? (
                <div className="p-3 border rounded-lg bg-purple-50">
                  <h4 className="font-medium text-purple-900">Holiday Pet Sitting</h4>
                  <p className="text-sm text-purple-700">Premium holiday pet sitting services</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Premium rates</Badge>
                    <Button size="sm" variant="outline">Book Early</Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 border rounded-lg bg-purple-50">
                  <h4 className="font-medium text-purple-900">Dry Skin Treatments</h4>
                  <p className="text-sm text-purple-700">Moisturizing treatments for winter dry skin</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Comfort care</Badge>
                    <Button size="sm" variant="outline">Promote Service</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
          <PawPrint className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Pet Care Enhancements</h2>
          <p className="text-gray-600">Advanced features specifically designed for pet care professionals</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="specialization" className="text-sm font-medium">Your Focus:</Label>
          <Select value={specialization} onValueChange={(value) => setSpecialization(value as PetCareSpecialization)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groomer">
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Groomer
                </div>
              </SelectItem>
              <SelectItem value="sitter">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Pet Sitter
                </div>
              </SelectItem>
              <SelectItem value="both">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  Both
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profiles">Pet Profiles</TabsTrigger>
          <TabsTrigger value="health">Health Tracking</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="space-y-4">
          {renderPetProfiles()}
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          {renderHealthTracking()}
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-4">
          {renderSeasonalServices()}
        </TabsContent>
      </Tabs>
      
      {/* Pet Detail Dialog */}
      <Dialog open={!!selectedPet} onOpenChange={() => setSelectedPet(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              {selectedPet?.name} - Complete Profile
            </DialogTitle>
            <DialogDescription>
              Comprehensive pet information and care history
            </DialogDescription>
          </DialogHeader>
          
          {selectedPet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Emergency Contact</Label>
                  <div className="p-2 border rounded">
                    <p className="font-medium">{selectedPet.emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">{selectedPet.emergencyContact.phone}</p>
                    <p className="text-sm text-gray-600">{selectedPet.emergencyContact.relationship}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Veterinarian</Label>
                  <div className="p-2 border rounded">
                    <p className="font-medium">{selectedPet.veterinarian.name}</p>
                    <p className="text-sm text-gray-600">{selectedPet.veterinarian.phone}</p>
                    <p className="text-sm text-gray-600">{selectedPet.veterinarian.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Service History
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetCareEnhancements;