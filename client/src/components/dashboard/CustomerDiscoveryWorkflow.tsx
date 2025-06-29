import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIndustry } from '@/lib/industryContext';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  MapPin, 
  Users, 
  Target, 
  Zap,
  ExternalLink,
  Calendar,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  impact: 'High' | 'Medium' | 'Low';
  category: 'foundation' | 'optimization' | 'growth' | 'advanced';
  tasks: WorkflowTask[];
  prerequisites?: string[];
  tools?: string[];
  resources?: { title: string; url: string; }[];
}

interface WorkflowTask {
  id: string;
  description: string;
  action: string;
  example?: string;
  checkable: boolean;
}

export default function CustomerDiscoveryWorkflow() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const { selectedIndustry } = useIndustry();

  const getIndustryWorkflow = (industryId: string): WorkflowStep[] => {
    const baseSteps: WorkflowStep[] = [
      {
        id: 'foundation',
        title: 'Foundation Setup (Week 1)',
        description: 'Establish your basic online presence and claim your digital real estate',
        timeEstimate: '4-6 hours',
        difficulty: 'Easy',
        impact: 'High',
        category: 'foundation',
        tasks: [
          {
            id: 'google-business',
            description: 'Claim and verify your Google Business Profile',
            action: 'Go to business.google.com and follow the verification process',
            example: 'Request verification postcard or phone verification',
            checkable: true
          },
          {
            id: 'complete-profile',
            description: 'Complete 100% of your Google Business Profile',
            action: 'Add business hours, phone, website, services, and photos',
            example: 'Upload 10+ high-quality photos of your work and location',
            checkable: true
          },
          {
            id: 'yelp-profile',
            description: 'Claim your Yelp business page',
            action: 'Search for your business on Yelp and claim existing listing',
            checkable: true
          },
          {
            id: 'social-accounts',
            description: 'Set up professional social media accounts',
            action: 'Create business accounts on Instagram and Facebook',
            example: 'Use consistent business name, logo, and contact info',
            checkable: true
          }
        ],
        tools: ['Google Business Profile', 'Yelp for Business', 'Instagram Business', 'Facebook Business']
      },
      {
        id: 'local-seo',
        title: 'Local SEO Optimization (Week 2)',
        description: 'Optimize your online presence for local search discovery',
        timeEstimate: '3-4 hours',
        difficulty: 'Medium',
        impact: 'High',
        category: 'optimization',
        prerequisites: ['foundation'],
        tasks: [
          {
            id: 'consistent-nap',
            description: 'Ensure consistent NAP (Name, Address, Phone) everywhere',
            action: 'Audit all online listings for consistent business information',
            checkable: true
          },
          {
            id: 'local-directories',
            description: 'Submit to 5+ local business directories',
            action: 'Submit to chamber of commerce, Nextdoor, and local directories',
            example: 'Better Business Bureau, Yellow Pages, local city websites',
            checkable: true
          },
          {
            id: 'google-posts',
            description: 'Create your first Google Business posts',
            action: 'Post about services, offers, or business updates',
            example: 'Share recent work photos with service descriptions',
            checkable: true
          },
          {
            id: 'review-strategy',
            description: 'Set up customer review collection system',
            action: 'Create process to ask satisfied customers for reviews',
            checkable: true
          }
        ],
        tools: ['Nextdoor Business', 'Chamber websites', 'Review management tools']
      }
    ];

    // Add industry-specific steps
    const industrySteps: Record<string, WorkflowStep[]> = {
      beauty: [
        {
          id: 'beauty-partnerships',
          title: 'Beauty Industry Networking (Week 3)',
          description: 'Build relationships within the beauty and wedding industry',
          timeEstimate: '4-5 hours',
          difficulty: 'Medium',
          impact: 'High',
          category: 'growth',
          prerequisites: ['foundation', 'local-seo'],
          tasks: [
            {
              id: 'wedding-vendors',
              description: 'Connect with 3 wedding vendors (photographers, planners, venues)',
              action: 'Reach out with collaboration proposals and portfolio',
              example: 'Offer bridal trial discounts for vendor referrals',
              checkable: true
            },
            {
              id: 'beauty-directories',
              description: 'List on beauty-specific platforms',
              action: 'Create profiles on StyleSeat, Booksy, and wedding directories',
              checkable: true
            },
            {
              id: 'influencer-outreach',
              description: 'Partner with 2 local micro-influencers',
              action: 'Offer free services for authentic social media posts',
              example: 'Find local lifestyle bloggers with 1K-10K followers',
              checkable: true
            },
            {
              id: 'bridal-content',
              description: 'Create bridal-focused content',
              action: 'Post bridal makeup tutorials and wedding preparation tips',
              checkable: true
            }
          ],
          tools: ['StyleSeat', 'WeddingWire', 'The Knot', 'Instagram', 'Local wedding groups'],
          resources: [
            { title: 'Wedding Vendor Partnership Templates', url: '#' },
            { title: 'Bridal Content Calendar', url: '#' }
          ]
        }
      ],
      petservices: [
        {
          id: 'pet-community',
          title: 'Pet Community Integration (Week 3)',
          description: 'Become part of the local pet owner ecosystem',
          timeEstimate: '3-4 hours',
          difficulty: 'Easy',
          impact: 'High',
          category: 'growth',
          prerequisites: ['foundation', 'local-seo'],
          tasks: [
            {
              id: 'vet-partnerships',
              description: 'Visit 5 local veterinary clinics',
              action: 'Introduce services and leave business cards with reception',
              example: 'Offer 20% discount for vet-referred customers',
              checkable: true
            },
            {
              id: 'pet-store-network',
              description: 'Partner with local pet stores',
              action: 'Ask to display business cards or flyers',
              checkable: true
            },
            {
              id: 'dog-park-presence',
              description: 'Visit dog parks and pet-friendly locations',
              action: 'Network with pet owners and share business cards',
              example: 'Attend weekend morning peak hours at local dog parks',
              checkable: true
            },
            {
              id: 'pet-event-participation',
              description: 'Attend or sponsor one pet-related event',
              action: 'Find local adoption events, pet shows, or farmer\'s markets',
              checkable: true
            }
          ],
          tools: ['Local vet directories', 'Nextdoor pet groups', 'Facebook pet communities'],
          resources: [
            { title: 'Vet Partnership Scripts', url: '#' },
            { title: 'Pet Event Calendar', url: '#' }
          ]
        }
      ],
      skilledtrades: [
        {
          id: 'contractor-network',
          title: 'Trade Professional Networking (Week 3)',
          description: 'Build referral relationships with complementary trades',
          timeEstimate: '4-6 hours',
          difficulty: 'Medium',
          impact: 'High',
          category: 'growth',
          prerequisites: ['foundation', 'local-seo'],
          tasks: [
            {
              id: 'trade-partnerships',
              description: 'Connect with 5 complementary contractors',
              action: 'Reach out to electricians, plumbers, general contractors',
              example: 'Offer reciprocal referral agreements with commission structure',
              checkable: true
            },
            {
              id: 'realestate-agents',
              description: 'Partner with 3 real estate agents',
              action: 'Offer pre-sale home improvement services',
              example: 'Quick fixes and staging improvements for faster sales',
              checkable: true
            },
            {
              id: 'trade-association',
              description: 'Join local contractor or trade association',
              action: 'Find and apply for membership in relevant trade groups',
              checkable: true
            },
            {
              id: 'home-show-booth',
              description: 'Plan participation in next local home show',
              action: 'Research upcoming home and garden shows in your area',
              checkable: true
            }
          ],
          tools: ['Trade association directories', 'Real estate agent networks', 'Home show organizers'],
          resources: [
            { title: 'Contractor Partnership Agreements', url: '#' },
            { title: 'Home Show Planning Guide', url: '#' }
          ]
        }
      ]
    };

    return [...baseSteps, ...(industrySteps[industryId] || [])];
  };

  const workflowSteps = getIndustryWorkflow(selectedIndustry?.id || 'beauty');

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const getStepProgress = (step: WorkflowStep) => {
    const completedCount = step.tasks.filter(task => completedTasks.has(task.id)).length;
    return Math.round((completedCount / step.tasks.length) * 100);
  };

  const getTotalProgress = () => {
    const allTasks = workflowSteps.flatMap(step => step.tasks);
    const completedCount = allTasks.filter(task => completedTasks.has(task.id)).length;
    return Math.round((completedCount / allTasks.length) * 100);
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

  return (
    <div className="space-y-6" style={{ 
      '--primary-color': selectedIndustry?.primaryColor || '#3b82f6',
      '--accent-color': selectedIndustry?.accentColor || '#1d4ed8'
    } as React.CSSProperties}>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" style={{ color: selectedIndustry?.primaryColor }} />
            Customer Discovery Workflow
          </CardTitle>
          <CardDescription>
            Complete step-by-step guide to build your customer discovery system for {selectedIndustry?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{getTotalProgress()}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${getTotalProgress()}%`,
                    backgroundColor: selectedIndustry?.primaryColor 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: selectedIndustry?.primaryColor }}>
                {workflowSteps.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {workflowSteps.filter(step => getStepProgress(step) === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {workflowSteps.reduce((acc, step) => acc + step.tasks.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {completedTasks.size}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const progress = getStepProgress(step);
          const isExpanded = expandedStep === step.id;
          const isCompleted = progress === 100;
          
          return (
            <Card key={step.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader className="cursor-pointer" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                         style={{ backgroundColor: isCompleted ? '#10b981' : selectedIndustry?.primaryColor }}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(step.difficulty)}>{step.difficulty}</Badge>
                    <Badge className={getImpactColor(step.impact)}>{step.impact} Impact</Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.timeEstimate}
                    </Badge>
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{progress}% ({step.tasks.filter(t => completedTasks.has(t.id)).length}/{step.tasks.length} tasks)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: isCompleted ? '#10b981' : selectedIndustry?.primaryColor 
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  {step.prerequisites && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Prerequisites:</strong> Complete {step.prerequisites.join(', ')} first
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-3">
                    {step.tasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={completedTasks.has(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                            {task.description}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{task.action}</p>
                          {task.example && (
                            <p className="text-xs text-blue-600 mt-1 italic">💡 {task.example}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {step.tools && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Recommended Tools:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {step.tools.map((tool, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.resources && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Helpful Resources:</h4>
                      <div className="space-y-1">
                        {step.resources.map((resource, index) => (
                          <Button key={index} variant="link" className="p-0 h-auto text-blue-600">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {resource.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      {getTotalProgress() < 100 && (
        <Card className="border-2" style={{ borderColor: selectedIndustry?.primaryColor }}>
          <CardContent className="p-6 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4" style={{ color: selectedIndustry?.primaryColor }} />
            <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-4">
              Begin with Week 1 foundation setup to establish your online presence in just 4-6 hours
            </p>
            <Button size="lg" className="text-white" style={{ backgroundColor: selectedIndustry?.primaryColor }}>
              Start Foundation Setup →
            </Button>
          </CardContent>
        </Card>
      )}
      
      {getTotalProgress() === 100 && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations! 🎉</h3>
            <p className="text-green-700 mb-4">
              You've completed your Customer Discovery setup. Your business is now optimized for customer acquisition!
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Advanced Growth Strategies
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}