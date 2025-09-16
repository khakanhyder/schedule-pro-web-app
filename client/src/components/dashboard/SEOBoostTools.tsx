import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Target
} from 'lucide-react';

interface SEOTactic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  impact: 'High' | 'Medium' | 'Low';
  timeToImplement: string;
  category: 'local' | 'content' | 'social' | 'technical';
  steps: string[];
  tools?: string[];
  example?: string;
}

// Industry-specific discovery tactics
const getIndustryTactics = (industryId: string): SEOTactic[] => {
  const baseTactics = [
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
        'Add relevant business attributes and services',
        'Use Google Posts to share news and offers weekly'
      ],
      tools: ['Google Business Profile', 'Google My Business app']
    },
    {
      id: 'local-citations',
      title: 'Build Local Directory Citations',
      description: 'Get listed on local directories and industry-specific platforms',
      difficulty: 'Medium',
      impact: 'High',
      timeToImplement: '2-3 hours',
      category: 'local',
      steps: [
        'Create profiles on Yelp, Nextdoor, and local chamber sites',
        'Submit to industry-specific directories',
        'Ensure NAP (Name, Address, Phone) consistency across all platforms',
        'Add detailed service descriptions and photos',
        'Monitor and claim existing listings'
      ],
      tools: ['Yelp for Business', 'Nextdoor Business', 'Better Business Bureau']
    },
  {
    id: 'content-marketing',
    title: 'Create Service-Focused Content',
    description: 'Publish helpful content that targets local search terms',
    difficulty: 'Medium',
    impact: 'High',
    timeToImplement: '1-2 hours weekly',
    category: 'content',
    steps: [
      'Write blog posts about your services with local keywords',
      'Create "How-to" guides for your industry',
      'Share before/after galleries with detailed descriptions',
      'Publish service area pages for different neighborhoods',
      'Create FAQ pages addressing common client questions'
    ],
    example: '"Best Hair Color Trends in [Your City] 2024"'
  },
  {
    id: 'social-proof',
    title: 'Generate Social Proof Content',
    description: 'Create shareable content that builds trust and visibility',
    difficulty: 'Easy',
    impact: 'Medium',
    timeToImplement: '15 minutes daily',
    category: 'social',
    steps: [
      'Share client transformations (with permission)',
      'Post behind-the-scenes content of your work process',
      'Feature client testimonials in Instagram Stories',
      'Create location-tagged posts for local visibility',
      'Use relevant hashtags for your city and services'
    ],
    tools: ['Instagram', 'Facebook', 'TikTok']
  },
  {
    id: 'schema-markup',
    title: 'Add Local Business Schema',
    description: 'Help search engines understand your business better',
    difficulty: 'Advanced',
    impact: 'Medium',
    timeToImplement: '1 hour',
    category: 'technical',
    steps: [
      'Add LocalBusiness schema to your website',
      'Include service-specific schema markup',
      'Add review schema for testimonials',
      'Implement FAQ schema for common questions',
      'Use event schema for special promotions'
    ],
    tools: ['Google Schema Markup Helper', 'JSON-LD Generator']
  },
  {
    id: 'link-building',
    title: 'Local Link Building',
    description: 'Get quality backlinks from local businesses and organizations',
    difficulty: 'Medium',
    impact: 'High',
    timeToImplement: '2-4 hours monthly',
    category: 'local',
    steps: [
      'Partner with complementary local businesses for cross-promotion',
      'Sponsor local events or charities',
      'Guest post on local lifestyle blogs',
      'Join local business associations',
      'Get featured in local news outlets'
    ]
  }
];

  return baseTactics;
};

export default function SEOBoostTools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedTactics, setCompletedTactics] = useState<Set<string>>(new Set());
  const { selectedIndustry } = useIndustry();

  const seoTactics = getIndustryTactics(selectedIndustry?.id || 'default');
  const filteredTactics = selectedCategory === 'all' 
    ? seoTactics 
    : seoTactics.filter((tactic: SEOTactic) => tactic.category === selectedCategory);

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

  const completionRate = Math.round((completedTactics.size / seoTactics.length) * 100);

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
              <TrendingUp className="h-6 w-6" style={{ color: selectedIndustry?.primaryColor }} />
            </div>
            <div>
              <CardTitle>SEO Boost Tools</CardTitle>
              <CardDescription>
                Powerful strategies to improve your local search visibility and attract more clients
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>SEO Progress</span>
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
              {completedTactics.size}/{seoTactics.length} tactics completed
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tactics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tactics">SEO Tactics</TabsTrigger>
          <TabsTrigger value="tracker">Progress Tracker</TabsTrigger>
          <TabsTrigger value="analyzer">Local SEO Analyzer</TabsTrigger>
        </TabsList>

        <TabsContent value="tactics" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Tactics
            </Button>
            <Button
              variant={selectedCategory === 'local' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('local')}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Local SEO
            </Button>
            <Button
              variant={selectedCategory === 'content' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('content')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Content
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
              variant={selectedCategory === 'technical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('technical')}
            >
              <Globe className="h-4 w-4 mr-1" />
              Technical
            </Button>
          </div>

          {/* SEO Tactics List */}
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
                      <h4 className="font-semibold mb-2">Step-by-step guide:</h4>
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

        <TabsContent value="tracker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your local search performance and track improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Google Rankings</p>
                        <p className="text-2xl font-bold">Track manually</p>
                        <p className="text-xs text-muted-foreground">Search for your services + city</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Local Visibility</p>
                        <p className="text-2xl font-bold">Check weekly</p>
                        <p className="text-xs text-muted-foreground">Google Business Profile insights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Online Reviews</p>
                        <p className="text-2xl font-bold">Monitor daily</p>
                        <p className="text-xs text-muted-foreground">Respond within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Set up Google Alerts for your business name and main services to monitor your online presence automatically.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Local SEO Health Check</CardTitle>
              <CardDescription>
                Quick assessment of your current local search optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="Enter your business name" />
                
                <Label htmlFor="city">City/Location</Label>
                <Input id="city" placeholder="Enter your city" />
                
                <Label htmlFor="main-service">Main Service</Label>
                <Input id="main-service" placeholder="e.g., Hair Styling, Dog Grooming" />
                
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Local SEO Health
                </Button>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This tool will help you identify quick wins to improve your local search visibility. 
                  Focus on the tactics marked as "Easy" and "High Impact" first!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}