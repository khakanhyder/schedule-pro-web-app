import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIndustry } from '@/lib/industryContext';
import { 
  Search, 
  MapPin, 
  Globe, 
  Camera, 
  Share2, 
  TrendingUp,
  FileText,
  Users,
  Star,
  CheckCircle,
  ExternalLink,
  Calendar,
  Target,
  Megaphone,
  Heart,
  Trophy,
  Zap
} from 'lucide-react';

interface DiscoveryTactic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  impact: 'High' | 'Medium' | 'Low';
  timeToImplement: string;
  category: 'local' | 'content' | 'social' | 'partnership' | 'referral';
  steps: string[];
  tools?: string[];
  example?: string;
  industrySpecific?: string[];
}

// Industry-specific customer discovery strategies
const getIndustryTactics = (industryId: string): DiscoveryTactic[] => {
  const baseTactics: DiscoveryTactic[] = [
    {
      id: 'google-business-profile',
      title: 'Optimize Google Business Profile',
      description: 'Complete and optimize your Google Business Profile for maximum local visibility',
      difficulty: 'Easy',
      impact: 'High',
      timeToImplement: '30 minutes',
      category: 'local',
      steps: [
        'Claim and verify your Google Business Profile',
        'Add all business information (hours, phone, website)',
        'Upload high-quality photos of your work, space, and team',
        'Post regular updates about services, promotions, and events',
        'Respond to all reviews professionally and promptly',
        'Add relevant business attributes and services'
      ],
      tools: ['Google Business Profile', 'Google My Business app']
    },
    {
      id: 'social-proof-marketing',
      title: 'Social Proof Content Strategy',
      description: 'Create shareable content that builds trust and attracts new customers',
      difficulty: 'Easy',
      impact: 'High',
      timeToImplement: '15 minutes daily',
      category: 'social',
      steps: [
        'Share before/after transformations (with permission)',
        'Post behind-the-scenes content of your work',
        'Feature client testimonials and success stories',
        'Create location-tagged posts for local visibility',
        'Use industry-specific hashtags for discovery'
      ],
      tools: ['Instagram', 'Facebook', 'TikTok', 'YouTube Shorts']
    }
  ];

  // Add industry-specific tactics
  const industrySpecificTactics: Record<string, DiscoveryTactic[]> = {
    beauty: [
      {
        id: 'beauty-influencer-partnerships',
        title: 'Local Beauty Influencer Collaborations',
        description: 'Partner with local beauty influencers and micro-influencers',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '2 hours',
        category: 'partnership',
        steps: [
          'Find local beauty influencers with 1K-10K followers',
          'Offer free services in exchange for authentic posts',
          'Create branded hashtags for tracking',
          'Host influencer events and makeover parties',
          'Cross-promote on each other\'s platforms'
        ],
        tools: ['Instagram', 'TikTok', 'Local Facebook groups'],
        example: 'Partner with local lifestyle bloggers for bridal makeup trials'
      },
      {
        id: 'beauty-directory-listings',
        title: 'Beauty-Specific Directory Domination',
        description: 'Get listed on all major beauty and wellness directories',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '3 hours',
        category: 'local',
        steps: [
          'Create profiles on StyleSeat, Booksy, and Fresha',
          'List on local wedding vendor directories',
          'Join beauty professional associations',
          'Get featured in local spa and salon roundups',
          'Submit to "Best of" beauty lists in your city'
        ],
        tools: ['StyleSeat', 'Booksy', 'Fresha', 'WeddingWire', 'The Knot']
      }
    ],
    petservices: [
      {
        id: 'pet-community-engagement',
        title: 'Pet Community Networking',
        description: 'Build relationships within the local pet owner community',
        difficulty: 'Easy',
        impact: 'High',
        timeToImplement: '1 hour weekly',
        category: 'partnership',
        steps: [
          'Partner with local dog parks and pet stores',
          'Offer services at pet adoption events',
          'Join pet owner Facebook groups and forums',
          'Create educational content about pet care',
          'Host "Yappy Hours" and pet meetups'
        ],
        tools: ['Facebook Groups', 'Nextdoor', 'Local pet stores'],
        example: 'Set up a booth at weekend farmer\'s markets with pet-friendly activities'
      },
      {
        id: 'veterinary-partnerships',
        title: 'Veterinary Clinic Referral Network',
        description: 'Build referral relationships with local veterinarians',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '2 hours',
        category: 'referral',
        steps: [
          'Visit local vet clinics with business cards and service info',
          'Offer special rates for vet-referred customers',
          'Provide emergency pet care services',
          'Create referral incentive programs',
          'Share pet care tips on social media and tag vets'
        ],
        tools: ['Business cards', 'Referral tracking system'],
        example: 'Offer 20% discount for pets referred by veterinarians'
      }
    ],
    skilledtrades: [
      {
        id: 'contractor-network',
        title: 'Contractor Referral Network',
        description: 'Build relationships with complementary trade professionals',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '2 hours',
        category: 'referral',
        steps: [
          'Network with electricians, plumbers, and general contractors',
          'Join local contractor associations and trade groups',
          'Attend home and garden shows as an exhibitor',
          'Offer reciprocal referral agreements',
          'Create a "trusted trades" directory with partners'
        ],
        tools: ['Local trade associations', 'Home show booths'],
        example: 'Partner with real estate agents for pre-sale home improvements'
      },
      {
        id: 'home-improvement-content',
        title: 'DIY Education Content Strategy',
        description: 'Create helpful content that establishes expertise and drives leads',
        difficulty: 'Medium',
        impact: 'Medium',
        timeToImplement: '1 hour weekly',
        category: 'content',
        steps: [
          'Create "How to" videos for simple DIY projects',
          'Share seasonal maintenance tips and checklists',
          'Write blog posts about common home problems',
          'Post before/after project photos with explanations',
          'Answer questions in local Facebook groups'
        ],
        tools: ['YouTube', 'TikTok', 'Local Facebook groups'],
        example: '"5 Signs Your Roof Needs Professional Attention" video series'
      }
    ],
    wellness: [
      {
        id: 'wellness-workshop-hosting',
        title: 'Community Wellness Workshops',
        description: 'Host educational workshops to demonstrate expertise and build relationships',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '3 hours per event',
        category: 'partnership',
        steps: [
          'Partner with local gyms, yoga studios, and health stores',
          'Host free wellness workshops and health screenings',
          'Speak at corporate wellness events',
          'Create wellness challenges and group programs',
          'Collaborate with other wellness professionals'
        ],
        tools: ['Local venues', 'Eventbrite', 'Meetup'],
        example: 'Monthly "Stress Relief Workshop" at local library'
      },
      {
        id: 'healthcare-partnerships',
        title: 'Healthcare Provider Referral Network',
        description: 'Build relationships with doctors, chiropractors, and healthcare providers',
        difficulty: 'Medium',
        impact: 'High',
        timeToImplement: '2 hours',
        category: 'referral',
        steps: [
          'Visit local medical offices with professional materials',
          'Offer complementary wellness services to their patients',
          'Create educational materials for healthcare waiting rooms',
          'Attend medical networking events',
          'Provide wellness talks for medical staff'
        ],
        tools: ['Professional brochures', 'Medical networking events'],
        example: 'Partner with chiropractors for holistic pain management'
      }
    ],
    homeservices: [
      {
        id: 'neighborhood-ambassador',
        title: 'Neighborhood Brand Ambassador Program',
        description: 'Turn satisfied customers into local brand ambassadors',
        difficulty: 'Easy',
        impact: 'High',
        timeToImplement: '1 hour',
        category: 'referral',
        steps: [
          'Create a formal referral reward program',
          'Provide branded yard signs for recent customers',
          'Offer "neighbor discounts" for referred customers',
          'Host neighborhood appreciation events',
          'Create door hangers for surrounding properties after jobs'
        ],
        tools: ['Yard signs', 'Referral tracking system', 'Door hangers'],
        example: 'Offer $50 credit for each successful neighbor referral'
      },
      {
        id: 'seasonal-marketing',
        title: 'Seasonal Service Marketing',
        description: 'Time your marketing with seasonal home service needs',
        difficulty: 'Easy',
        impact: 'High',
        timeToImplement: '30 minutes weekly',
        category: 'content',
        steps: [
          'Create seasonal maintenance checklists and tips',
          'Send targeted emails about seasonal services',
          'Post seasonal reminders on social media',
          'Offer seasonal packages and promotions',
          'Partner with seasonal businesses (landscaping, pool services)'
        ],
        tools: ['Email marketing', 'Social media scheduler'],
        example: 'Spring cleaning services promoted in March with early bird discounts'
      }
    ]
  };

  return [...baseTactics, ...(industrySpecificTactics[industryId] || [])];
};

export default function CustomerDiscoveryEngine() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedTactics, setCompletedTactics] = useState<Set<string>>(new Set());
  const { selectedIndustry } = useIndustry();

  const allTactics = getIndustryTactics(selectedIndustry?.id || 'beauty');
  const filteredTactics = selectedCategory === 'all' 
    ? allTactics 
    : allTactics.filter(tactic => tactic.category === selectedCategory);

  const toggleCompleted = (tacticId: string) => {
    const newCompleted = new Set(completedTactics);
    if (newCompleted.has(tacticId)) {
      newCompleted.delete(tacticId);
    } else {
      newCompleted.add(tacticId);
    }
    setCompletedTactics(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-purple-100 text-purple-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionRate = Math.round((completedTactics.size / allTactics.length) * 100);

  return (
    <div className="space-y-6" style={{ 
      '--primary-color': selectedIndustry?.primaryColor || '#3b82f6',
      '--accent-color': selectedIndustry?.accentColor || '#1d4ed8'
    } as React.CSSProperties}>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${selectedIndustry?.primaryColor}20` }}>
              <Megaphone className="h-6 w-6" style={{ color: selectedIndustry?.primaryColor }} />
            </div>
            <div>
              <CardTitle>Customer Discovery Engine</CardTitle>
              <CardDescription>
                Powerful strategies to help customers find YOU in the {selectedIndustry?.name.toLowerCase()} industry
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Local Search</p>
                <p className="text-xs text-muted-foreground">Get found on Google</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium">Social Proof</p>
                <p className="text-xs text-muted-foreground">Build trust & credibility</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Referral Network</p>
                <p className="text-xs text-muted-foreground">Partner with others</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm font-medium">Industry Authority</p>
                <p className="text-xs text-muted-foreground">Become the go-to expert</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Discovery Progress</span>
                <span>{completionRate}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${completionRate}%`,
                    backgroundColor: selectedIndustry?.primaryColor 
                  }}
                />
              </div>
            </div>
            <Badge variant="outline" className="ml-4">
              {completedTactics.size}/{allTactics.length} strategies completed
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="strategies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategies">Discovery Strategies</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
          <TabsTrigger value="industry-specific">Industry Specific</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Strategies
            </Button>
            <Button
              variant={selectedCategory === 'local' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('local')}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Local Search
            </Button>
            <Button
              variant={selectedCategory === 'social' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('social')}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Social Proof
            </Button>
            <Button
              variant={selectedCategory === 'partnership' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('partnership')}
            >
              <Users className="h-4 w-4 mr-1" />
              Partnerships
            </Button>
            <Button
              variant={selectedCategory === 'referral' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('referral')}
            >
              <Heart className="h-4 w-4 mr-1" />
              Referrals
            </Button>
          </div>

          {/* Discovery Strategies List */}
          <div className="grid gap-4">
            {filteredTactics.map((tactic) => (
              <Card key={tactic.id} className={`transition-all ${completedTactics.has(tactic.id) ? 'bg-green-50 border-green-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{tactic.title}</CardTitle>
                        <Button
                          variant={completedTactics.has(tactic.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleCompleted(tactic.id)}
                        >
                          {completedTactics.has(tactic.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </>
                          ) : (
                            'Mark Complete'
                          )}
                        </Button>
                      </div>
                      <CardDescription className="mb-3">{tactic.description}</CardDescription>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getDifficultyColor(tactic.difficulty)}>
                          {tactic.difficulty}
                        </Badge>
                        <Badge className={getImpactColor(tactic.impact)}>
                          {tactic.impact} Impact
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {tactic.timeToImplement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Action steps:</h4>
                      <ol className="space-y-1 text-sm text-muted-foreground">
                        {tactic.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-medium text-primary">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {tactic.tools && (
                      <div>
                        <h4 className="font-semibold mb-2">Recommended tools:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {tactic.tools.map((tool, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {tactic.example && (
                      <Alert>
                        <Target className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Example:</strong> {tactic.example}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Win Strategies
              </CardTitle>
              <CardDescription>
                Start with these high-impact, low-effort tactics to get immediate results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {allTactics.filter(t => t.difficulty === 'Easy' && t.impact === 'High').map((tactic) => (
                  <div key={tactic.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{tactic.title}</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">Quick Win</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tactic.description}</p>
                    <p className="text-xs font-medium">⏱️ Time needed: {tactic.timeToImplement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry-specific" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: selectedIndustry?.primaryColor }} />
                {selectedIndustry?.name} Industry Strategies
              </CardTitle>
              <CardDescription>
                Specialized customer discovery tactics for your specific industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {allTactics.filter(t => t.id.includes(selectedIndustry?.id || 'beauty')).map((tactic) => (
                  <div key={tactic.id} className="p-4 border rounded-lg" style={{ 
                    backgroundColor: `${selectedIndustry?.primaryColor}10`,
                    borderColor: `${selectedIndustry?.primaryColor}30`
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{tactic.title}</h4>
                      <Badge style={{ backgroundColor: selectedIndustry?.primaryColor, color: 'white' }}>
                        Industry Focus
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tactic.description}</p>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(tactic.difficulty)}>{tactic.difficulty}</Badge>
                      <Badge className={getImpactColor(tactic.impact)}>{tactic.impact} Impact</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}