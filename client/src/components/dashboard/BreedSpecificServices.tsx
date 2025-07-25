import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Clock, 
  DollarSign, 
  Info,
  Heart,
  Scissors,
  Droplets,
  Wind,
  Camera,
  Star
} from 'lucide-react';

interface BreedInfo {
  id: string;
  name: string;
  group: string;
  size: 'Small' | 'Medium' | 'Large' | 'Giant';
  coatType: 'Short' | 'Medium' | 'Long' | 'Double' | 'Curly' | 'Wire';
  sheddingLevel: 'Low' | 'Medium' | 'High';
  groomingFrequency: string;
  specialNeeds: string[];
  recommendedServices: {
    service: string;
    duration: number;
    basePrice: number;
    description: string;
    seasonal?: boolean;
  }[];
  temperamentNotes: string;
  commonIssues: string[];
}

const breedDatabase: BreedInfo[] = [
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    group: 'Sporting',
    size: 'Large',
    coatType: 'Long',
    sheddingLevel: 'High',
    groomingFrequency: 'Every 6-8 weeks',
    specialNeeds: ['De-shedding treatment', 'Ear cleaning', 'Nail trimming'],
    recommendedServices: [
      {
        service: 'Full Service Grooming',
        duration: 120,
        basePrice: 85,
        description: 'Bath, blow-dry, brush-out, nail trim, ear cleaning'
      },
      {
        service: 'De-shedding Treatment',
        duration: 90,
        basePrice: 75,
        description: 'Special shampoo and blow-out to reduce shedding',
        seasonal: true
      },
      {
        service: 'Sanitary Trim',
        duration: 30,
        basePrice: 25,
        description: 'Light trimming around paws and sanitary areas'
      }
    ],
    temperamentNotes: 'Generally friendly and patient. Great with water and blow-drying.',
    commonIssues: ['Heavy shedding', 'Ear infections', 'Hot spots in summer']
  },
  {
    id: 'poodle',
    name: 'Poodle (Standard)',
    group: 'Non-Sporting',
    size: 'Large',
    coatType: 'Curly',
    sheddingLevel: 'Low',
    groomingFrequency: 'Every 4-6 weeks',
    specialNeeds: ['Professional cut', 'Face and feet shaving', 'Coat maintenance'],
    recommendedServices: [
      {
        service: 'Poodle Cut (Full)',
        duration: 150,
        basePrice: 120,
        description: 'Traditional poodle cut with face, feet, and tail shaving'
      },
      {
        service: 'Puppy Cut',
        duration: 120,
        basePrice: 95,
        description: 'All-over shorter cut, easier maintenance'
      },
      {
        service: 'Face & Feet Touch-up',
        duration: 45,
        basePrice: 35,
        description: 'Between-visit touch-up for face and feet'
      }
    ],
    temperamentNotes: 'Intelligent and trainable. May be sensitive around face area.',
    commonIssues: ['Matting if not brushed regularly', 'Tear staining', 'Sensitive skin']
  },
  {
    id: 'bulldog',
    name: 'English Bulldog',
    group: 'Non-Sporting',
    size: 'Medium',
    coatType: 'Short',
    sheddingLevel: 'Medium',
    groomingFrequency: 'Every 8-10 weeks',
    specialNeeds: ['Wrinkle cleaning', 'Gentle handling', 'Temperature monitoring'],
    recommendedServices: [
      {
        service: 'Bulldog Special Care',
        duration: 75,
        basePrice: 65,
        description: 'Gentle bath, wrinkle cleaning, nail trim'
      },
      {
        service: 'Wrinkle Care Treatment',
        duration: 30,
        basePrice: 20,
        description: 'Deep cleaning and treatment of facial wrinkles'
      }
    ],
    temperamentNotes: 'Can be stubborn. Sensitive to heat and stress. Keep sessions cool.',
    commonIssues: ['Breathing difficulties', 'Overheating', 'Skin fold dermatitis']
  },
  {
    id: 'yorkie',
    name: 'Yorkshire Terrier',
    group: 'Toy',
    size: 'Small',
    coatType: 'Long',
    sheddingLevel: 'Low',
    groomingFrequency: 'Every 4-6 weeks',
    specialNeeds: ['Delicate handling', 'Eye area cleaning', 'Top knot styling'],
    recommendedServices: [
      {
        service: 'Yorkie Full Groom',
        duration: 90,
        basePrice: 55,
        description: 'Bath, cut, nail trim, ear cleaning, bow or bandana'
      },
      {
        service: 'Puppy Cut',
        duration: 75,
        basePrice: 45,
        description: 'Shorter all-over cut for easier maintenance'
      },
      {
        service: 'Face Trim Only',
        duration: 20,
        basePrice: 15,
        description: 'Clean up around eyes and ears'
      }
    ],
    temperamentNotes: 'Small but feisty. Can be nervous. Gentle, patient approach needed.',
    commonIssues: ['Tear staining', 'Dental issues', 'Luxating patella']
  }
];

export default function BreedSpecificServices() {
  const [selectedBreed, setSelectedBreed] = useState<BreedInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterSize, setFilterSize] = useState('all');

  const filteredBreeds = breedDatabase.filter(breed => {
    const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || breed.group === filterGroup;
    const matchesSize = filterSize === 'all' || breed.size === filterSize;
    return matchesSearch && matchesGroup && matchesSize;
  });

  const getSheddingColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'Small': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-purple-100 text-purple-800';
      case 'Large': return 'bg-orange-100 text-orange-800';
      case 'Giant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Breed-Specific Service Guide</h2>
        <p className="text-gray-600">Professional grooming recommendations based on breed characteristics</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Breed Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Breed</label>
              <Input
                placeholder="Enter breed name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Group</label>
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="Sporting">Sporting</SelectItem>
                  <SelectItem value="Non-Sporting">Non-Sporting</SelectItem>
                  <SelectItem value="Toy">Toy</SelectItem>
                  <SelectItem value="Terrier">Terrier</SelectItem>
                  <SelectItem value="Working">Working</SelectItem>
                  <SelectItem value="Herding">Herding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Giant">Giant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breed List */}
        <Card>
          <CardHeader>
            <CardTitle>Breed Database ({filteredBreeds.length} breeds)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBreeds.map((breed) => (
                <div 
                  key={breed.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBreed?.id === breed.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBreed(breed)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{breed.name}</h3>
                    <div className="flex gap-1">
                      <Badge className={getSizeColor(breed.size)}>{breed.size}</Badge>
                      <Badge className={getSheddingColor(breed.sheddingLevel)}>
                        {breed.sheddingLevel} Shed
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{breed.group} Group • {breed.coatType} Coat</p>
                    <p>Grooming: {breed.groomingFrequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breed Details */}
        {selectedBreed ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {selectedBreed.name} - Grooming Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p className="text-sm text-gray-600">{selectedBreed.size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Coat Type</p>
                  <p className="text-sm text-gray-600">{selectedBreed.coatType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shedding</p>
                  <p className="text-sm text-gray-600">{selectedBreed.sheddingLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Frequency</p>
                  <p className="text-sm text-gray-600">{selectedBreed.groomingFrequency}</p>
                </div>
              </div>

              {/* Recommended Services */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Recommended Services
                </h4>
                <div className="space-y-2">
                  {selectedBreed.recommendedServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{service.service}</h5>
                        <div className="flex items-center gap-2">
                          {service.seasonal && (
                            <Badge className="bg-orange-100 text-orange-800">Seasonal</Badge>
                          )}
                          <span className="text-sm font-medium">${service.basePrice}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Starting at ${service.basePrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Needs */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Special Care Notes
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                    <p className="font-medium text-blue-800">Temperament</p>
                    <p className="text-blue-700">{selectedBreed.temperamentNotes}</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-200">
                    <p className="font-medium text-yellow-800">Special Needs</p>
                    <ul className="text-yellow-700 list-disc list-inside">
                      {selectedBreed.specialNeeds.map((need, index) => (
                        <li key={index}>{need}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedBreed.commonIssues.length > 0 && (
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-200">
                      <p className="font-medium text-red-800">Common Health Issues</p>
                      <ul className="text-red-700 list-disc list-inside">
                        {selectedBreed.commonIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-600 mb-2">Select a Breed</h3>
              <p className="text-sm text-gray-500">
                Choose a breed from the list to see detailed grooming recommendations,
                pricing suggestions, and special care notes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Add to Services */}
      {selectedBreed && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedBreed.recommendedServices.map((service, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                  onClick={() => {
                    // Adding service to services menu
                    // This would integrate with the services management system
                  }}
                >
                  Add "{service.service}" to Services
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}