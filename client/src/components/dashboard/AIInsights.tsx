import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Brain, TrendingUp, Users, Calendar, CheckCircle, Clock, Target, Sparkles, Zap, BarChart3 } from "lucide-react";
import { useIndustry, industryTemplates } from "@/lib/industryContext";
import IndustrySpecificInsights from "./IndustrySpecificInsights";
import SimpleBusinessSetup from "./SimpleBusinessSetup";

interface SchedulingSuggestion {
  id: number;
  suggestionType: string;
  suggestion: string;
  reasoning: string;
  priority: number;
  isAccepted: boolean | null;
  createdAt: string;
}

interface ClientInsight {
  id: number;
  clientEmail: string;
  insightType: string;
  data: string;
  confidence: number;
  createdAt: string;
}

interface MarketingCampaign {
  id: number;
  name: string;
  type: string;
  status: string;
  targetAudience: string;
  content: string;
  createdAt: string;
  lastSent: string | null;
}

export default function AIInsights() {
  const [selectedTab, setSelectedTab] = useState("scheduling");
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();
  
  // Get current industry template for theming
  const currentTemplate = selectedIndustry || industryTemplates[0];

  // Fetch rebooking suggestions
  const { data: rebookingSuggestions, isLoading: loadingRebooking } = useQuery({
    queryKey: ['/api/ai/rebooking-suggestions'],
    queryFn: () => apiRequest('GET', '/api/ai/rebooking-suggestions').then(res => res.json())
  });

  // Fetch marketing campaigns
  const { data: marketingCampaigns, isLoading: loadingCampaigns } = useQuery({
    queryKey: ['/api/marketing/campaigns'],
    queryFn: () => apiRequest('GET', '/api/marketing/campaigns').then(res => res.json())
  });

  // Accept suggestion mutation
  const acceptSuggestionMutation = useMutation({
    mutationFn: (suggestionId: number) => 
      apiRequest('POST', `/api/ai/accept-suggestion/${suggestionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/rebooking-suggestions'] });
    }
  });

  // Create marketing campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: (data: { type: string; targetCriteria: any }) => 
      apiRequest('POST', '/api/marketing/campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketing/campaigns'] });
    }
  });

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return "destructive";
    if (priority >= 3) return "default";
    return "secondary";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return "High";
    if (priority >= 3) return "Medium";
    return "Low";
  };

  const handleAcceptSuggestion = (suggestionId: number) => {
    acceptSuggestionMutation.mutate(suggestionId);
  };

  const handleCreateCampaign = (type: string) => {
    const targetCriteria = {
      segments: ["all_clients"],
      filters: {}
    };
    createCampaignMutation.mutate({ type, targetCriteria });
  };

  return (
    <div className="space-y-8">
      {/* Hero Header with Industry Theming */}
      <Card className="relative overflow-hidden border-2 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
        {/* Top accent line matching industry color */}
        <div 
          className="h-1.5 w-full"
          style={{ backgroundColor: currentTemplate.primaryColor }}
        />
        
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform duration-200"
              style={{ 
                backgroundColor: `${currentTemplate.primaryColor}15`,
                border: `1px solid ${currentTemplate.primaryColor}30`
              }}
            >
              <Brain className="h-8 w-8" style={{ color: currentTemplate.primaryColor }} />
            </div>
            <div className="flex-1">
              <CardTitle 
                className="text-2xl font-bold tracking-tight flex items-center gap-2"
                style={{ color: currentTemplate.primaryColor }}
              >
                AI Business Intelligence
                <Sparkles className="h-5 w-5" />
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1 font-medium">
                Grow your {currentTemplate.name.toLowerCase()} business with smart insights and automation
              </CardDescription>
            </div>
            <Badge 
              variant="outline" 
              className="px-3 py-1 font-medium border-2"
              style={{ 
                borderColor: currentTemplate.primaryColor + '40',
                backgroundColor: currentTemplate.primaryColor + '10',
                color: currentTemplate.primaryColor
              }}
            >
              Premium Feature
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs with Industry Theming */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-slate-100 rounded-lg">
          <TabsTrigger 
            value="scheduling" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'scheduling' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Scheduling</span>
              <span className="sm:hidden">Schedule</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="marketing" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'marketing' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Marketing Automation</span>
              <span className="sm:hidden">Marketing</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'insights' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Client Insights</span>
              <span className="sm:hidden">Insights</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="discovery" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'discovery' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customer Discovery</span>
              <span className="sm:hidden">Discovery</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="industry" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'industry' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Industry Intel</span>
              <span className="sm:hidden">Intel</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="google-setup" 
            className="text-xs sm:text-sm px-2 py-3 data-[state=active]:shadow-md transition-all duration-200 rounded-md data-[state=active]:text-white"
            style={selectedTab === 'google-setup' ? {
              backgroundColor: currentTemplate.primaryColor,
              color: 'white'
            } : {}}
          >
            <div className="flex flex-col items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Google Setup</span>
              <span className="sm:hidden">Setup</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling" className="space-y-6">
          <Card className="relative overflow-hidden border-2 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            {/* Accent line */}
            <div 
              className="h-1 w-full"
              style={{ backgroundColor: currentTemplate.primaryColor }}
            />
            <CardHeader className="pb-4">
              <CardTitle 
                className="flex items-center gap-2 text-xl"
                style={{ color: currentTemplate.primaryColor }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${currentTemplate.primaryColor}15` }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                Scheduling Optimization
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                AI-powered suggestions to optimize your booking schedule and increase revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRebooking ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {rebookingSuggestions?.suggestions?.length > 0 ? (
                    rebookingSuggestions.suggestions.map((suggestion: SchedulingSuggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getPriorityColor(suggestion.priority)}>
                                {getPriorityLabel(suggestion.priority)} Priority
                              </Badge>
                              <Badge variant="outline">{suggestion.suggestionType.replace('_', ' ')}</Badge>
                            </div>
                            <p className="font-medium mb-1">{suggestion.suggestion}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                          </div>
                          {suggestion.isAccepted === null && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptSuggestion(suggestion.id)}
                              disabled={acceptSuggestionMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          )}
                          {suggestion.isAccepted === true && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepted
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>AI is analyzing your booking patterns...</p>
                      <p className="text-sm">More suggestions will appear as you get more bookings</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="relative overflow-hidden border-2 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div 
                className="h-1 w-full"
                style={{ backgroundColor: currentTemplate.primaryColor }}
              />
              <CardHeader className="pb-3">
                <CardTitle 
                  className="text-base sm:text-lg flex items-center gap-2"
                  style={{ color: currentTemplate.primaryColor }}
                >
                  <div 
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: `${currentTemplate.primaryColor}15` }}
                  >
                    <Target className="h-4 w-4" />
                  </div>
                  Review Requests
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">
                  Automated review collection campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => handleCreateCampaign('review_request')}
                  disabled={createCampaignMutation.isPending}
                  className="w-full text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: currentTemplate.primaryColor,
                    border: 'none'
                  }}
                  size="sm"
                >
                  Create Campaign
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div 
                className="h-1 w-full"
                style={{ backgroundColor: currentTemplate.primaryColor }}
              />
              <CardHeader className="pb-3">
                <CardTitle 
                  className="text-base sm:text-lg flex items-center gap-2"
                  style={{ color: currentTemplate.primaryColor }}
                >
                  <div 
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: `${currentTemplate.primaryColor}15` }}
                  >
                    <Clock className="h-4 w-4" />
                  </div>
                  Rebooking Reminders
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">
                  Smart rebooking automation system
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => handleCreateCampaign('rebook_reminder')}
                  disabled={createCampaignMutation.isPending}
                  className="w-full shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: currentTemplate.primaryColor,
                    border: 'none'
                  }}
                  size="sm"
                >
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Active Campaigns
              </CardTitle>
              <CardDescription>
                Your automated marketing campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCampaigns ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {marketingCampaigns?.campaigns?.length > 0 ? (
                    marketingCampaigns.campaigns.map((campaign: MarketingCampaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm bg-gray-50 p-2 rounded">
                          {campaign.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                          {campaign.lastSent && (
                            <span>Last sent: {new Date(campaign.lastSent).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No marketing campaigns yet</p>
                      <p className="text-sm">Create your first automated campaign above</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Client Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Clients</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">VIP Clients</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">At Risk</span>
                    <span className="font-semibold text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold text-green-600">+18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Value</span>
                    <span className="font-semibold">$85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Hours</span>
                    <span className="font-semibold">2-4 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bookings Due</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-semibold">$1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Growth Rate</span>
                    <span className="font-semibold text-green-600">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                AI-powered insights to grow your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Optimize Peak Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider 15% premium pricing for 2-4 PM slots based on high demand patterns
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Client Retention Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    3 VIP clients haven't booked in 30+ days. Send personalized offers to re-engage
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Service Upsell Potential</h4>
                  <p className="text-sm text-muted-foreground">
                    65% of haircut clients would likely book color services - create a bundle offer
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          <Card className="relative overflow-hidden border-2 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            {/* Accent line */}
            <div 
              className="h-1 w-full"
              style={{ backgroundColor: currentTemplate.primaryColor }}
            />
            <CardHeader className="pb-4">
              <CardTitle 
                className="flex items-center gap-2 text-xl"
                style={{ color: currentTemplate.primaryColor }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${currentTemplate.primaryColor}15` }}
                >
                  <Users className="h-5 w-5" />
                </div>
                Customer Discovery Engine
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                Powerful strategies to help customers find YOU in the {currentTemplate.name.toLowerCase()} industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Local Search</span>
                  </div>
                  <p className="text-sm text-blue-700">Get found when customers search for your services nearby</p>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Referral Network</span>
                  </div>
                  <p className="text-sm text-green-700">Build partnerships with complementary businesses</p>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Social Proof</span>
                  </div>
                  <p className="text-sm text-purple-700">Showcase your work to attract new customers</p>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Industry Authority</span>
                  </div>
                  <p className="text-sm text-orange-700">Become the go-to expert in your area</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: currentTemplate.primaryColor }}>
                    Quick Win Strategies for {currentTemplate.name}
                  </h3>
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: currentTemplate.primaryColor }}
                  >
                    Industry Specific
                  </Badge>
                </div>

                {/* Industry-specific quick strategies */}
                {currentTemplate.id === 'beauty' && (
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-pink-600" />
                        Beauty Influencer Partnerships
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Partner with local beauty influencers and micro-influencers for authentic exposure</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Wedding Vendor Networks
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Build relationships with wedding planners, photographers, and venues</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                  </div>
                )}

                {currentTemplate.id === 'petservices' && (
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        Pet Community Networking
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Partner with dog parks, pet stores, and vet clinics for referrals</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Pet Event Participation
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Set up booths at adoption events, farmer's markets, and pet shows</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                  </div>
                )}

                {currentTemplate.id === 'skilledtrades' && (
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        Contractor Referral Network
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Build relationships with electricians, plumbers, and general contractors</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        Real Estate Partnerships
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Partner with real estate agents for pre-sale home improvements</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                  </div>
                )}

                {currentTemplate.id === 'wellness' && (
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        Community Wellness Workshops
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Host educational workshops at gyms, studios, and health stores</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Healthcare Provider Network
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Build referral relationships with doctors and chiropractors</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                  </div>
                )}

                {currentTemplate.id === 'homeservices' && (
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Neighborhood Ambassador Program
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Turn satisfied customers into local brand ambassadors with referral rewards</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        Seasonal Marketing Campaigns
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">Time your marketing with seasonal home service needs and maintenance</p>
                      <Button size="sm" variant="outline">Learn Strategy →</Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5" style={{ color: currentTemplate.primaryColor }} />
                    <h4 className="font-semibold" style={{ color: currentTemplate.primaryColor }}>
                      Universal Discovery Tactics
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Optimize Google Business Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Build local directory citations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Create social proof content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Encourage customer reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Network with local businesses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Share educational content</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    className="text-white"
                    style={{ backgroundColor: currentTemplate.primaryColor }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    View Complete Discovery Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry" className="space-y-6">
          <IndustrySpecificInsights />
        </TabsContent>

        <TabsContent value="google-setup" className="space-y-6">
          <SimpleBusinessSetup 
            industryId={currentTemplate.id} 
            businessName={currentTemplate.name} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}