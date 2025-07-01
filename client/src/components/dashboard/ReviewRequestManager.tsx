import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useIndustry } from '@/lib/industryContext';
import { 
  Star, 
  Send,
  Clock,
  CheckCircle,
  Users,
  MessageSquare,
  ExternalLink,
  Target,
  TrendingUp,
  Globe
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  lastVisit?: string;
  reviewHistory?: ReviewRequest[];
  availablePlatforms?: ReviewPlatform[];
  suggestedPlatform?: ReviewPlatform;
}

interface ReviewRequest {
  id: number;
  clientId: number;
  clientName: string;
  clientEmail: string;
  platform: string;
  status: 'sent' | 'opened' | 'completed' | 'expired';
  sentAt: string;
  requestUrl: string;
  customMessage?: string;
}

interface ReviewPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  priority: number;
  avgImpact: string;
}

export default function ReviewRequestManager() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();

  const reviewPlatforms: ReviewPlatform[] = [
    {
      id: 'google',
      name: 'Google Business',
      icon: '🔍',
      color: 'bg-blue-100 text-blue-800',
      description: 'Highest local search impact',
      priority: 1,
      avgImpact: 'Very High'
    },
    {
      id: 'yelp',
      name: 'Yelp',
      icon: '⭐',
      color: 'bg-red-100 text-red-800',
      description: 'Popular for service discovery',
      priority: 2,
      avgImpact: 'High'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      color: 'bg-blue-100 text-blue-800',
      description: 'Social proof and referrals',
      priority: 3,
      avgImpact: 'Medium'
    },
    {
      id: 'angi',
      name: 'Angi (Angie\'s List)',
      icon: '🏠',
      color: 'bg-green-100 text-green-800',
      description: 'Home services focused',
      priority: 2,
      avgImpact: 'High'
    },
    {
      id: 'bbb',
      name: 'Better Business Bureau',
      icon: '🛡️',
      color: 'bg-purple-100 text-purple-800',
      description: 'Trust and credibility',
      priority: 4,
      avgImpact: 'Medium'
    },
    {
      id: 'nextdoor',
      name: 'Nextdoor',
      icon: '🏘️',
      color: 'bg-green-100 text-green-800',
      description: 'Neighborhood recommendations',
      priority: 3,
      avgImpact: 'Medium'
    }
  ];

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: reviewRequests = [] } = useQuery<ReviewRequest[]>({
    queryKey: ['/api/review-requests'],
  });

  const sendReviewRequestMutation = useMutation({
    mutationFn: (requestData: any) => apiRequest('POST', '/api/review-requests', requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/review-requests'] });
      setShowRequestDialog(false);
      setSelectedClient(null);
      setSelectedPlatform('');
      setCustomMessage('');
      toast({
        title: "Review Request Sent",
        description: "Your customer will receive a personalized review request.",
      });
    },
  });

  // Get clients who haven't been asked for reviews on specific platforms
  const getAvailableClients = () => {
    return clients.map(client => {
      const clientRequests = reviewRequests.filter(req => req.clientId === client.id);
      const requestedPlatforms = clientRequests.map(req => req.platform);
      const availablePlatforms = reviewPlatforms.filter(p => !requestedPlatforms.includes(p.id));
      
      return {
        ...client,
        availablePlatforms,
        reviewHistory: clientRequests,
        suggestedPlatform: availablePlatforms.sort((a, b) => a.priority - b.priority)[0]
      };
    }).filter(client => client.availablePlatforms.length > 0);
  };

  const getRecommendedPlatform = (client: any) => {
    const hasGoogleReview = client.reviewHistory?.some((req: ReviewRequest) => 
      req.platform === 'google' && req.status === 'completed'
    );
    
    if (!hasGoogleReview) {
      return reviewPlatforms.find(p => p.id === 'google');
    }

    // Industry-specific recommendations
    if (selectedIndustry?.id === 'skilledtrades' || selectedIndustry?.id === 'homeservices') {
      return reviewPlatforms.find(p => p.id === 'angi');
    }
    
    if (selectedIndustry?.id === 'beauty' || selectedIndustry?.id === 'wellness') {
      return reviewPlatforms.find(p => p.id === 'yelp');
    }

    return reviewPlatforms.find(p => p.id === 'yelp');
  };

  const getDefaultMessage = (platform: string, clientName: string) => {
    const platformName = reviewPlatforms.find(p => p.id === platform)?.name || platform;
    const industry = selectedIndustry?.name || 'our business';
    
    return `Hi ${clientName}! Thank you for choosing ${industry} for your recent service. We'd be grateful if you could take a moment to share your experience on ${platformName}. Your feedback helps us serve you and other customers better. Click the link below to leave your review - it only takes a minute!`;
  };

  const handleSendRequest = () => {
    if (!selectedClient || !selectedPlatform) return;

    const requestData = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      platform: selectedPlatform,
      customMessage: customMessage || getDefaultMessage(selectedPlatform, selectedClient.name),
    };

    sendReviewRequestMutation.mutate(requestData);
  };

  const availableClients = getAvailableClients();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Request Manager</h2>
          <p className="text-gray-600">
            Smart platform targeting based on customer review history
          </p>
        </div>
        
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button 
              className="text-white"
              style={{ backgroundColor: selectedIndustry?.primaryColor }}
              disabled={availableClients.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Review Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Review Request</DialogTitle>
              <DialogDescription>
                Choose which platform to request a review on
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Customer</label>
                <Select onValueChange={(value) => {
                  const client = availableClients.find(c => c.id === parseInt(value));
                  setSelectedClient(client || null);
                  setSelectedPlatform('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{client.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {client.availablePlatforms.length} platforms available
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Platform</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(selectedClient.availablePlatforms || []).map((platform: ReviewPlatform) => {
                      const isRecommended = getRecommendedPlatform(selectedClient)?.id === platform.id;
                      return (
                        <div
                          key={platform.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedPlatform === platform.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform.icon}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{platform.name}</span>
                                  {isRecommended && (
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{platform.description}</p>
                              </div>
                            </div>
                            <Badge className={platform.color} variant="secondary">
                              {platform.avgImpact}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedClient && selectedPlatform && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Message (Optional)</label>
                  <Textarea
                    placeholder={getDefaultMessage(selectedPlatform, selectedClient.name)}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              <Button 
                onClick={handleSendRequest}
                disabled={!selectedClient || !selectedPlatform || sendReviewRequestMutation.isPending}
                className="w-full"
              >
                {sendReviewRequestMutation.isPending ? 'Sending...' : 'Send Review Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Requests Sent</p>
                <p className="text-2xl font-bold">{reviewRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold">
                  {reviewRequests.filter(req => req.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold">
                  {reviewRequests.filter(req => req.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">
                  {reviewRequests.length > 0 
                    ? Math.round((reviewRequests.filter(req => req.status === 'completed').length / reviewRequests.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers Ready for Review Requests
          </CardTitle>
          <CardDescription>
            Customers who haven't been asked to review on all platforms yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableClients.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500">
                You've requested reviews from all customers on available platforms
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableClients.slice(0, 5).map((client) => {
                const recommended = getRecommendedPlatform(client);
                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {client.availablePlatforms.length} platforms available
                          </Badge>
                          {recommended && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Try {recommended.name} next
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        if (recommended) {
                          setSelectedPlatform(recommended.id);
                        }
                        setShowRequestDialog(true);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Review Requests</CardTitle>
          <CardDescription>
            Track the status of your review requests across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviewRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent yet</h3>
              <p className="text-gray-500 mb-4">Start building your review presence across platforms</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewRequests.slice(0, 10).map((request) => {
                const platform = reviewPlatforms.find(p => p.id === request.platform);
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'completed': return 'bg-green-100 text-green-800';
                    case 'opened': return 'bg-blue-100 text-blue-800';
                    case 'sent': return 'bg-yellow-100 text-yellow-800';
                    case 'expired': return 'bg-gray-100 text-gray-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{platform?.icon || '⭐'}</div>
                      <div>
                        <h4 className="font-medium">{request.clientName}</h4>
                        <p className="text-sm text-gray-500">
                          {platform?.name} • {new Date(request.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}