import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  Send, 
  Image, 
  Clock, 
  Check,
  Heart,
  Share2,
  Download,
  Eye,
  MessageCircle,
  Star,
  Upload
} from 'lucide-react';

interface PhotoSession {
  id: string;
  petName: string;
  petParent: string;
  service: string;
  date: string;
  beforePhotos: string[];
  afterPhotos: string[];
  progressNotes: string;
  parentFeedback?: string;
  rating?: number;
  shared: boolean;
  timestamp: string;
}

const sampleSessions: PhotoSession[] = [
  {
    id: '1',
    petName: 'Bella',
    petParent: 'Sarah Johnson',
    service: 'Full Service Grooming',
    date: '2025-07-24',
    beforePhotos: ['before-bella-1.jpg', 'before-bella-2.jpg'],
    afterPhotos: ['after-bella-1.jpg', 'after-bella-2.jpg'],
    progressNotes: 'Bella was such a good girl today! She sat perfectly still for her nail trim. Used the de-shedding shampoo which worked beautifully on her coat.',
    parentFeedback: 'She looks absolutely gorgeous! Thank you so much!',
    rating: 5,
    shared: true,
    timestamp: '2025-07-24T14:30:00Z'
  },
  {
    id: '2',
    petName: 'Max',
    petParent: 'David Chen',
    service: 'Puppy Cut',
    date: '2025-07-24',
    beforePhotos: ['before-max-1.jpg'],
    afterPhotos: ['after-max-1.jpg', 'after-max-2.jpg'],
    progressNotes: 'First grooming session for this sweet pup! He was a little nervous at first but warmed up quickly. Kept the cut nice and short for easy maintenance.',
    shared: true,
    timestamp: '2025-07-24T11:45:00Z'
  },
  {
    id: '3',
    petName: 'Luna',
    petParent: 'Maria Rodriguez',
    service: 'De-shedding Treatment',
    date: '2025-07-24',
    beforePhotos: ['before-luna-1.jpg'],
    afterPhotos: [],
    progressNotes: 'Luna is getting her summer de-shedding treatment. She loves the massage brush!',
    shared: false,
    timestamp: '2025-07-24T09:15:00Z'
  }
];

export default function PhotoProgressSharing() {
  const [sessions, setSessions] = useState<PhotoSession[]>(sampleSessions);
  const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(null);
  const [newNote, setNewNote] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const handleSharePhotos = (sessionId: string) => {
    // Simulate sharing photos with pet parent
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, shared: true, timestamp: new Date().toISOString() }
        : session
    );
    setSessions(updatedSessions);
    
    // Simulate SMS/email notification
    console.log(`Photos shared with pet parent for session ${sessionId}`);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (session: PhotoSession) => {
    if (session.afterPhotos.length === 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
    }
    if (!session.shared) {
      return <Badge className="bg-blue-100 text-blue-800">Ready to Share</Badge>;
    }
    if (session.parentFeedback) {
      return <Badge className="bg-green-100 text-green-800">Feedback Received</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Shared</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Photo Progress Sharing</h2>
          <p className="text-gray-600">Share grooming progress with pet parents in real-time</p>
        </div>
        <Button className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Start New Session
        </Button>
      </div>

      {/* Today's Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{session.petName} - {session.petParent}</h3>
                    {getStatusBadge(session)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{session.service} • {formatTime(session.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      Before: {session.beforePhotos.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      After: {session.afterPhotos.length}
                    </span>
                    {session.shared && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-3 h-3" />
                        Shared
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        {selectedSession ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {selectedSession.petName}'s Grooming Session
              </CardTitle>
              <CardDescription>
                {selectedSession.service} • {selectedSession.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Gallery */}
              <div>
                <h4 className="font-medium mb-3">Photos</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Before ({selectedSession.beforePhotos.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSession.beforePhotos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      ))}
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">After ({selectedSession.afterPhotos.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSession.afterPhotos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      ))}
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Notes */}
              <div>
                <h4 className="font-medium mb-2">Grooming Notes</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedSession.progressNotes}</p>
                </div>
              </div>

              {/* Parent Feedback */}
              {selectedSession.parentFeedback && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Pet Parent Feedback
                  </h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">{selectedSession.parentFeedback}</p>
                    {selectedSession.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(selectedSession.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-green-700 ml-2">
                          {selectedSession.rating}/5 stars
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share Actions */}
              <div className="pt-4 border-t">
                {!selectedSession.shared ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="shareMessage">Message to Pet Parent</Label>
                      <Textarea
                        id="shareMessage"
                        placeholder="Add a personal message (optional)..."
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={() => handleSharePhotos(selectedSession.id)}
                      className="w-full flex items-center gap-2"
                      disabled={selectedSession.afterPhotos.length === 0}
                    >
                      <Send className="w-4 h-4" />
                      Share Photos with {selectedSession.petParent}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">
                      Photos shared at {formatTime(selectedSession.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-600 mb-2">Select a Session</h3>
              <p className="text-sm text-gray-500">
                Choose a grooming session to view photos, add notes, and share progress with pet parents.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Photos Today</p>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.beforePhotos.length + s.afterPhotos.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Shared Sessions</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.shared).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Feedback Received</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.parentFeedback).length}
                </p>
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
                  {sessions.filter(s => s.rating).length > 0 
                    ? (sessions.filter(s => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.filter(s => s.rating).length).toFixed(1)
                    : '—'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photo Sharing Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Photo Sharing Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Photography Tips</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Take before photos from multiple angles</li>
                <li>• Use good lighting and clean backgrounds</li>
                <li>• Capture the pet's personality and comfort</li>
                <li>• Show detailed work (nails, ears, teeth)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Sharing Strategy</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Share progress photos during longer sessions</li>
                <li>• Include personal notes about the pet's behavior</li>
                <li>• Send photos within 30 minutes of completion</li>
                <li>• Ask for feedback to build relationships</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}