import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/lib/industryContext";
import { 
  Target, 
  Users, 
  Gift, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  ExternalLink,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Star,
  Zap,
  AlertCircle,
  CheckCircle,
  Heart,
  Camera
} from "lucide-react";

interface LeadSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: string;
  difficulty: "easy" | "medium" | "hard";
  timeToResults: string;
  avgConversion: string;
  bestFor: string[];
}

interface ReferralProgram {
  id: string;
  name: string;
  referrerReward: string;
  refereeReward: string;
  isActive: boolean;
  totalReferrals: number;
  conversionRate: string;
}

interface FollowUpSequence {
  id: string;
  trigger: string;
  timing: string;
  message: string;
  isActive: boolean;
}

interface LocalPartnership {
  id: string;
  businessName: string;
  type: string;
  contactInfo: string;
  status: "active" | "pending" | "inactive";
  lastContact: string;
  referralsSent: number;
  referralsReceived: number;
}

export default function LeadGenerationHub() {
  const [selectedTab, setSelectedTab] = useState("sources");
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showPartnershipDialog, setShowPartnershipDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();

  // Lead sources based on industry
  const getLeadSources = (): LeadSource[] => {
    const commonSources: LeadSource[] = [
      {
        id: 'google_business',
        name: 'Google Business Profile',
        description: 'Optimize for local search and maps',
        icon: <MapPin className="h-5 w-5" />,
        cost: 'Free',
        difficulty: 'easy',
        timeToResults: '2-4 weeks',
        avgConversion: '15-25%',
        bestFor: ['all']
      },
      {
        id: 'referral_program',
        name: 'Customer Referral Program',
        description: 'Incentivize existing clients to refer friends',
        icon: <Gift className="h-5 w-5" />,
        cost: 'Variable',
        difficulty: 'easy',
        timeToResults: '1-2 weeks',
        avgConversion: '30-45%',
        bestFor: ['all']
      },
      {
        id: 'follow_up_automation',
        name: 'Follow-up Automation',
        description: 'Re-engage leads who didn\'t book initially',
        icon: <Clock className="h-5 w-5" />,
        cost: 'Low',
        difficulty: 'medium',
        timeToResults: '1 week',
        avgConversion: '20-35%',
        bestFor: ['all']
      }
    ];

    const industrySpecific: LeadSource[] = selectedIndustry?.id === 'home_services' ? [
      {
        id: 'homeowner_lists',
        name: 'New Homeowner Lists',
        description: 'Target recent home buyers who need services',
        icon: <Users className="h-5 w-5" />,
        cost: '$50-200/month',
        difficulty: 'medium',
        timeToResults: '2-3 weeks',
        avgConversion: '8-15%',
        bestFor: ['home_services']
      },
      {
        id: 'real_estate_partnerships',
        name: 'Real Estate Agent Partnerships',
        description: 'Partner with agents for client referrals',
        icon: <Heart className="h-5 w-5" />,
        cost: 'Commission',
        difficulty: 'medium',
        timeToResults: '4-8 weeks',
        avgConversion: '25-40%',
        bestFor: ['home_services']
      }
    ] : selectedIndustry?.id === 'pet_care' ? [
      {
        id: 'vet_partnerships',
        name: 'Veterinarian Partnerships',
        description: 'Partner with local vets for referrals',
        icon: <Heart className="h-5 w-5" />,
        cost: 'Low',
        difficulty: 'medium',
        timeToResults: '3-6 weeks',
        avgConversion: '35-50%',
        bestFor: ['pet_care']
      },
      {
        id: 'pet_store_partnerships',
        name: 'Pet Store Partnerships',
        description: 'Display flyers at local pet stores',
        icon: <ExternalLink className="h-5 w-5" />,
        cost: 'Low',
        difficulty: 'easy',
        timeToResults: '2-4 weeks',
        avgConversion: '10-20%',
        bestFor: ['pet_care']
      }
    ] : selectedIndustry?.id === 'beauty' ? [
      {
        id: 'wedding_partnerships',
        name: 'Wedding Vendor Partnerships',
        description: 'Partner with photographers, planners, venues',
        icon: <Heart className="h-5 w-5" />,
        cost: 'Low',
        difficulty: 'medium',
        timeToResults: '4-8 weeks',
        avgConversion: '30-45%',
        bestFor: ['beauty', 'creative']
      },
      {
        id: 'social_media_showcase',
        name: 'Social Media Showcases',
        description: 'Before/after photos drive bookings',
        icon: <Camera className="h-5 w-5" />,
        cost: 'Time',
        difficulty: 'easy',
        timeToResults: '1-2 weeks',
        avgConversion: '12-25%',
        bestFor: ['beauty', 'creative']
      }
    ] : [];

    return [...commonSources, ...industrySpecific];
  };

  // Mock data for referral programs
  const referralPrograms: ReferralProgram[] = [
    {
      id: '1',
      name: 'Friend Referral Reward',
      referrerReward: '$25 credit',
      refereeReward: '20% off first service',
      isActive: true,
      totalReferrals: 47,
      conversionRate: '38%'
    },
    {
      id: '2', 
      name: 'VIP Client Program',
      referrerReward: 'Free service after 3 referrals',
      refereeReward: 'Free consultation',
      isActive: false,
      totalReferrals: 12,
      conversionRate: '58%'
    }
  ];

  // Mock data for follow-up sequences
  const followUpSequences: FollowUpSequence[] = [
    {
      id: '1',
      trigger: 'Quote requested but no booking',
      timing: '24 hours later',
      message: 'Hi [Name], I wanted to follow up on the quote I sent. Do you have any questions about the project?',
      isActive: true
    },
    {
      id: '2',
      trigger: 'Visited website but didn\'t book',
      timing: '3 days later',
      message: 'Hi [Name], I noticed you were looking at our services. I\'d love to help you with your [service] needs!',
      isActive: false
    },
    {
      id: '3',
      trigger: 'No booking in 90 days',
      timing: 'After 90 days',
      message: 'Hi [Name], it\'s been a while! We miss you and would love to help with your next [service] appointment.',
      isActive: true
    }
  ];

  // Mock data for partnerships
  const localPartnerships: LocalPartnership[] = [
    {
      id: '1',
      businessName: 'Elite Real Estate',
      type: 'Real Estate Agency',
      contactInfo: 'sarah@eliterealestate.com',
      status: 'active',
      lastContact: '2025-01-15',
      referralsSent: 8,
      referralsReceived: 12
    },
    {
      id: '2',
      businessName: 'Happy Paws Veterinary',
      type: 'Veterinarian',
      contactInfo: 'info@happypaws.com',
      status: 'pending',
      lastContact: '2025-01-10',
      referralsSent: 0,
      referralsReceived: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Generation Hub</h2>
          <p className="text-gray-600">
            Proven strategies to consistently attract new clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="referrals">Referral Programs</TabsTrigger>
          <TabsTrigger value="followup">Follow-up Automation</TabsTrigger>
          <TabsTrigger value="partnerships">Local Partnerships</TabsTrigger>
        </TabsList>

        {/* Lead Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <div className="grid gap-4">
            {getLeadSources().map((source) => (
              <Card key={source.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {source.icon}
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription>{source.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(source.difficulty)}>
                        {source.difficulty}
                      </Badge>
                      <Badge variant="outline">{source.cost}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Time to Results</p>
                      <p className="font-semibold">{source.timeToResults}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Avg Conversion</p>
                      <p className="font-semibold text-green-600">{source.avgConversion}</p>
                    </div>
                    <div className="text-center">
                      <Button size="sm" style={{ backgroundColor: selectedIndustry?.primaryColor }}>
                        Set Up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Referral Programs Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Referral Programs</h3>
              <p className="text-sm text-muted-foreground">Incentivize your best clients to bring their friends</p>
            </div>
            <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: selectedIndustry?.primaryColor }}>
                  <Gift className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Referral Program</DialogTitle>
                  <DialogDescription>
                    Set up rewards for clients who refer new customers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Program Name</Label>
                    <Input placeholder="e.g., Friend Referral Reward" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Referrer Reward</Label>
                      <Input placeholder="e.g., $25 credit" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Client Reward</Label>
                      <Input placeholder="e.g., 20% off first service" />
                    </div>
                  </div>
                  <Button className="w-full">Create Program</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {referralPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Referrer gets: <strong>{program.referrerReward}</strong></span>
                        <span>New client gets: <strong>{program.refereeReward}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={program.isActive} />
                      <Badge className={program.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Referrals</p>
                      <p className="text-2xl font-bold text-blue-600">{program.totalReferrals}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold text-green-600">{program.conversionRate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Follow-up Automation Tab */}
        <TabsContent value="followup" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Follow-up Sequences</h3>
            <p className="text-sm text-muted-foreground">Automatically re-engage leads who didn't book initially</p>
          </div>

          <div className="grid gap-4">
            {followUpSequences.map((sequence) => (
              <Card key={sequence.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sequence.trigger}</CardTitle>
                      <p className="text-sm text-muted-foreground">Sends {sequence.timing}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={sequence.isActive} />
                      <Badge className={sequence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {sequence.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{sequence.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Create Custom Follow-up</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set up automated messages to re-engage potential clients
              </p>
              <Button variant="outline">Add Follow-up Sequence</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Local Business Partnerships</h3>
              <p className="text-sm text-muted-foreground">Build referral relationships with complementary businesses</p>
            </div>
            <Dialog open={showPartnershipDialog} onOpenChange={setShowPartnershipDialog}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: selectedIndustry?.primaryColor }}>
                  <Heart className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Business Partner</DialogTitle>
                  <DialogDescription>
                    Track partnerships with local businesses for mutual referrals
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input placeholder="e.g., Elite Real Estate" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real_estate">Real Estate Agency</SelectItem>
                        <SelectItem value="veterinarian">Veterinarian</SelectItem>
                        <SelectItem value="wedding_vendor">Wedding Vendor</SelectItem>
                        <SelectItem value="home_improvement">Home Improvement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Information</Label>
                    <Input placeholder="Email or phone number" />
                  </div>
                  <Button className="w-full">Add Partnership</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {localPartnerships.map((partnership) => (
              <Card key={partnership.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{partnership.businessName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{partnership.type}</p>
                    </div>
                    <Badge className={getStatusColor(partnership.status)}>
                      {partnership.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{partnership.contactInfo}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Referrals Sent</p>
                      <p className="text-lg font-bold text-blue-600">{partnership.referralsSent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Referrals Received</p>
                      <p className="text-lg font-bold text-green-600">{partnership.referralsReceived}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      Track Referral
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}