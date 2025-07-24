import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIndustry } from "@/lib/industryContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Flame, 
  Phone, 
  Mail, 
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  MapPin,
  MessageSquare,
  Target,
  Zap
} from "lucide-react";

interface HotLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  serviceRequested: string;
  estimatedValue: number;
  leadScore: number;
  priority: "hot" | "warm" | "cold";
  lastActivity: string;
  nextAction: string;
  nextActionDate: string;
  signals: LeadSignal[];
  notes: string;
  timeSinceInquiry: string;
}

interface LeadSignal {
  type: "high_value" | "urgent" | "competitor" | "referral" | "repeat_visitor";
  description: string;
  points: number;
  icon: React.ReactNode;
}

export default function HotLeadsTracker() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();

  // Lead scoring signals - these would be tracked automatically
  const getLeadSignals = (lead: HotLead): LeadSignal[] => {
    return [
      {
        type: "high_value" as const,
        description: `${lead.estimatedValue > 5000 ? 'Large' : lead.estimatedValue > 2000 ? 'Medium' : 'Standard'} project value`,
        points: lead.estimatedValue > 5000 ? 25 : lead.estimatedValue > 2000 ? 15 : 5,
        icon: <DollarSign className="h-4 w-4" />
      },
      {
        type: "urgent" as const,
        description: lead.serviceRequested.includes('emergency') ? 'Emergency service needed' : 'Standard timeline',
        points: lead.serviceRequested.includes('emergency') ? 30 : 0,
        icon: <AlertCircle className="h-4 w-4" />
      },
      {
        type: "referral" as const,
        description: lead.source.includes('referral') ? 'Referred by existing client' : 'Direct inquiry',
        points: lead.source.includes('referral') ? 20 : 0,
        icon: <Star className="h-4 w-4" />
      },
      {
        type: "repeat_visitor" as const,
        description: 'Multiple website visits in past week',
        points: 15,
        icon: <TrendingUp className="h-4 w-4" />
      }
    ].filter(signal => signal.points > 0);
  };

  // Mock hot leads data - in real app would come from CRM
  const hotLeads: HotLead[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      source: 'Google Ads - Kitchen Remodel',
      serviceRequested: 'Complete kitchen renovation',
      estimatedValue: 25000,
      leadScore: 95,
      priority: 'hot',
      lastActivity: '2 hours ago',
      nextAction: 'Send detailed quote with 3D renderings',
      nextActionDate: '2025-01-25 10:00 AM',
      signals: [],
      notes: 'Very specific about timeline - needs to start by March. Budget confirmed at $25k-30k.',
      timeSinceInquiry: '2 hours'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      source: 'Client referral - John Smith',
      serviceRequested: 'Bathroom remodel + plumbing',
      estimatedValue: 12000,
      leadScore: 85,
      priority: 'hot',
      lastActivity: '6 hours ago',
      nextAction: 'Schedule in-home consultation',
      nextActionDate: '2025-01-25 2:00 PM',
      signals: [],
      notes: 'Referred by John Smith (5-star client). Mentioned timeline flexibility.',
      timeSinceInquiry: '6 hours'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa.r@company.com',
      phone: '(555) 345-6789',
      source: 'Yelp - Pet Grooming',
      serviceRequested: 'Monthly grooming for 2 dogs',
      estimatedValue: 1200,
      leadScore: 75,
      priority: 'warm',
      lastActivity: '1 day ago',
      nextAction: 'Follow up on pricing questions',
      nextActionDate: '2025-01-25 11:00 AM',
      signals: [],
      notes: 'Asked detailed questions about services. Has 2 golden retrievers.',
      timeSinceInquiry: '1 day'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'dwilson@email.com',
      phone: '(555) 456-7890',
      source: 'Facebook - Emergency repair',
      serviceRequested: 'Emergency plumbing repair',
      estimatedValue: 800,
      leadScore: 90,
      priority: 'hot',
      lastActivity: '30 minutes ago',
      nextAction: 'Call immediately - emergency service',
      nextActionDate: '2025-01-24 4:30 PM',
      signals: [],
      notes: 'Pipe burst in basement. Needs immediate attention.',
      timeSinceInquiry: '30 minutes'
    }
  ];

  // Calculate lead score based on signals
  const calculateLeadScore = (lead: HotLead): number => {
    const signals = getLeadSignals(lead);
    const baseScore = 40;
    const signalPoints = signals.reduce((total, signal) => total + signal.points, 0);
    
    // Time decay factor - fresher leads score higher
    const hoursOld = lead.timeSinceInquiry.includes('hour') ? 
      parseInt(lead.timeSinceInquiry) : 
      lead.timeSinceInquiry.includes('day') ? parseInt(lead.timeSinceInquiry) * 24 : 1;
    
    const timeDecay = Math.max(0, 20 - (hoursOld * 2));
    
    return Math.min(100, baseScore + signalPoints + timeDecay);
  };

  // Update lead scores
  const updatedLeads = hotLeads.map(lead => ({
    ...lead,
    leadScore: calculateLeadScore(lead),
    signals: getLeadSignals(lead)
  })).sort((a, b) => b.leadScore - a.leadScore);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-blue-600';
  };

  const handleTakeAction = (lead: HotLead, action: string) => {
    toast({
      title: "Action Taken",
      description: `${action} for ${lead.name}`,
    });
  };

  const isOverdue = (nextActionDate: string) => {
    return new Date(nextActionDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="h-6 w-6 text-red-500" />
            Hot Leads Tracker
          </h2>
          <p className="text-gray-600">
            AI-powered lead scoring to focus on your highest-value prospects
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-red-100 text-red-800">
            {updatedLeads.filter(l => l.priority === 'hot').length} Hot
          </Badge>
          <Badge className="bg-orange-100 text-orange-800">
            {updatedLeads.filter(l => l.priority === 'warm').length} Warm
          </Badge>
        </div>
      </div>

      {/* Lead Scoring Overview */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Lead Scoring System
          </CardTitle>
          <CardDescription>
            Automatically prioritizes leads based on value, urgency, and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">Project Value</p>
              <p className="text-sm text-muted-foreground">Up to +25 points</p>
            </div>
            <div className="text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <p className="font-semibold">Urgency</p>
              <p className="text-sm text-muted-foreground">Up to +30 points</p>
            </div>
            <div className="text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="font-semibold">Referral Source</p>
              <p className="text-sm text-muted-foreground">+20 points</p>
            </div>
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">Response Time</p>
              <p className="text-sm text-muted-foreground">+20 points max</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hot Leads List */}
      <div className="grid gap-4">
        {updatedLeads.map((lead) => (
          <Card key={lead.id} className={`transition-all duration-200 ${
            lead.priority === 'hot' ? 'ring-2 ring-red-200 shadow-lg' : 
            isOverdue(lead.nextActionDate) ? 'ring-2 ring-yellow-200' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      getPriorityColor(lead.priority)
                    }`}>
                      {lead.leadScore}
                    </div>
                    {lead.priority === 'hot' && (
                      <Flame className="absolute -top-1 -right-1 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lead.serviceRequested}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                      <span className="text-xs text-muted-foreground">
                        ${lead.estimatedValue.toLocaleString()} estimated
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getPriorityColor(lead.priority)}>
                    {lead.priority.toUpperCase()}
                  </Badge>
                  {isOverdue(lead.nextActionDate) && (
                    <Badge className="bg-yellow-100 text-yellow-800 mt-1 block">
                      OVERDUE
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Lead Signals */}
              {lead.signals.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Lead Signals:</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.signals.map((signal, index) => (
                      <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg text-xs">
                        {signal.icon}
                        <span>{signal.description}</span>
                        <Badge variant="outline" className="text-xs">+{signal.points}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Inquiry: {lead.timeSinceInquiry} ago</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Next Action:</p>
                  <p className="text-sm text-gray-600">{lead.nextAction}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {lead.nextActionDate}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm">{lead.notes}</p>
                </div>
              )}

              {/* Lead Score Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Lead Score</span>
                  <span className={`text-sm font-bold ${getScoreColor(lead.leadScore)}`}>
                    {lead.leadScore}/100
                  </span>
                </div>
                <Progress value={lead.leadScore} className="h-2" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  style={{ backgroundColor: selectedIndustry?.primaryColor }}
                  onClick={() => handleTakeAction(lead, 'Called')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTakeAction(lead, 'Emailed quote')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Quote
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTakeAction(lead, 'Scheduled consultation')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTakeAction(lead, 'Added notes')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {updatedLeads.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No active leads</h3>
            <p className="text-muted-foreground">
              Your hot leads will appear here when you receive new inquiries.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}