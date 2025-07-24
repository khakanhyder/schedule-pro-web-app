import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Camera,
  Navigation,
  Timer,
  Activity,
  Star,
  AlertCircle,
  Phone,
  MessageCircle,
  FileText,
  User
} from 'lucide-react';

interface VisitRecord {
  id: string;
  petName: string;
  petParent: string;
  serviceName: string;
  assignedSitter: string;
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
  visitNotes: string;
  photos: string[];
  duration?: number;
  mileage?: number;
  clientRating?: number;
  emergencyAlerts?: string[];
}

const sampleVisits: VisitRecord[] = [
  {
    id: '1',
    petName: 'Max',
    petParent: 'Jennifer Smith',
    serviceName: 'Dog Walking (30 min)',
    assignedSitter: 'Sarah Johnson',
    scheduledTime: '2025-07-24T14:00:00',
    actualStartTime: '2025-07-24T14:02:00',
    actualEndTime: '2025-07-24T14:35:00',
    checkInLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '123 Oak Street, Beverly Hills, CA'
    },
    checkOutLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '123 Oak Street, Beverly Hills, CA'
    },
    status: 'completed',
    visitNotes: 'Max was very energetic today! We had a great walk around the neighborhood. He did his business twice and drank water when we got back. Very well behaved with other dogs we met.',
    photos: ['max_walk_1.jpg', 'max_walk_2.jpg'],
    duration: 33,
    mileage: 1.2,
    clientRating: 5
  },
  {
    id: '2',
    petName: 'Luna',
    petParent: 'David Chen',
    serviceName: 'Pet Sitting (2 hours)',
    assignedSitter: 'Mike Rodriguez',
    scheduledTime: '2025-07-24T16:00:00',
    actualStartTime: '2025-07-24T15:58:00',
    status: 'in-progress',
    checkInLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '456 Pine Avenue, West Hollywood, CA'
    },
    visitNotes: 'Luna is doing great! Fed her at 4 PM as requested. She\'s been playful and enjoying her toys. Currently resting on her favorite couch.',
    photos: ['luna_sitting_1.jpg'],
    duration: 0,
    mileage: 2.1
  },
  {
    id: '3',
    petName: 'Bella',
    petParent: 'Maria Rodriguez',
    serviceName: 'Dog Walking (45 min)',
    assignedSitter: 'Emily Davis',
    scheduledTime: '2025-07-24T18:00:00',
    status: 'scheduled',
    visitNotes: '',
    photos: []
  }
];

export default function VisitTrackingGPS() {
  const [visits, setVisits] = useState<VisitRecord[]>(sampleVisits);
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const completedVisits = visits.filter(v => v.status === 'completed');
  const inProgressVisits = visits.filter(v => v.status === 'in-progress');
  const scheduledVisits = visits.filter(v => v.status === 'scheduled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">GPS Visit Tracking</h2>
          <p className="text-gray-600">Real-time location tracking and visit accountability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Bulk Reports
          </Button>
          <Button className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Live Tracking
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Completed Today</p>
                <p className="text-2xl font-bold">{completedVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{inProgressVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Scheduled</p>
                <p className="text-2xl font-bold">{scheduledVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {completedVisits.filter(v => v.clientRating).length > 0 
                    ? (completedVisits.filter(v => v.clientRating).reduce((sum, v) => sum + (v.clientRating || 0), 0) / completedVisits.filter(v => v.clientRating).length).toFixed(1)
                    : '—'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Today's Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visits.map((visit) => (
                <div 
                  key={visit.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedVisit?.id === visit.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVisit(visit)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{visit.petName} - {visit.petParent}</h3>
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{visit.serviceName} • {visit.assignedSitter}</p>
                    <p>Scheduled: {formatTime(visit.scheduledTime)}</p>
                    {visit.actualStartTime && (
                      <p>Started: {formatTime(visit.actualStartTime)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {visit.checkInLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        GPS Verified
                      </span>
                    )}
                    {visit.duration && (
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {formatDuration(visit.duration)}
                      </span>
                    )}
                    {visit.photos.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {visit.photos.length} photos
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit Details */}
        {selectedVisit ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {selectedVisit.petName} - Visit Details
              </CardTitle>
              <CardDescription>
                {selectedVisit.serviceName} by {selectedVisit.assignedSitter}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Tracking */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Tracking
                </h4>
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Scheduled</p>
                    <p className="text-sm text-gray-600">{formatTime(selectedVisit.scheduledTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-gray-600">
                      {selectedVisit.duration ? formatDuration(selectedVisit.duration) : 'In progress...'}
                    </p>
                  </div>
                  {selectedVisit.actualStartTime && (
                    <div>
                      <p className="text-sm font-medium">Actual Start</p>
                      <p className="text-sm text-gray-600">{formatTime(selectedVisit.actualStartTime)}</p>
                    </div>
                  )}
                  {selectedVisit.actualEndTime && (
                    <div>
                      <p className="text-sm font-medium">Actual End</p>
                      <p className="text-sm text-gray-600">{formatTime(selectedVisit.actualEndTime)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* GPS Verification */}
              {selectedVisit.checkInLocation && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    GPS Verification
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <p className="font-medium text-green-800">Check-In Location</p>
                      <p className="text-green-700">{selectedVisit.checkInLocation.address}</p>
                      <p className="text-green-600 text-xs">
                        {selectedVisit.checkInLocation.latitude.toFixed(6)}, {selectedVisit.checkInLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                    {selectedVisit.checkOutLocation && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                        <p className="font-medium text-blue-800">Check-Out Location</p>
                        <p className="text-blue-700">{selectedVisit.checkOutLocation.address}</p>
                        <p className="text-blue-600 text-xs">
                          {selectedVisit.checkOutLocation.latitude.toFixed(6)}, {selectedVisit.checkOutLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visit Notes */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Visit Report
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    {selectedVisit.visitNotes || 'No notes added yet...'}
                  </p>
                </div>
              </div>

              {/* Photos */}
              {selectedVisit.photos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Visit Photos ({selectedVisit.photos.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedVisit.photos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Rating */}
              {selectedVisit.clientRating && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-green-800">Client Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(selectedVisit.clientRating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-green-700 ml-2">
                      {selectedVisit.clientRating}/5 stars
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Send Report
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Call Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-600 mb-2">Select a Visit</h3>
              <p className="text-sm text-gray-500">
                Choose a visit from the list to view GPS tracking details, time records, and visit reports.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* GPS Tracking Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">GPS Tracking Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Accountability</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• GPS check-in/out for every visit</li>
                <li>• Accurate time tracking builds trust</li>
                <li>• Location verification prevents disputes</li>
                <li>• Detailed visit reports enhance credibility</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Client Communication</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Send real-time visit updates</li>
                <li>• Include photos with GPS timestamps</li>
                <li>• Share arrival and departure notifications</li>
                <li>• Provide detailed service summaries</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Business Management</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Track staff punctuality and performance</li>
                <li>• Monitor travel time and efficiency</li>
                <li>• Generate accurate invoicing from time logs</li>
                <li>• Analyze route optimization opportunities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}