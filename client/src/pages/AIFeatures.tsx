import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Mic, MicOff, Phone, Settings, TrendingUp, BarChart3, 
  Users, Calendar, DollarSign, MessageSquare, Bot, 
  Play, Pause, Volume2, Languages, Clock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AIVoiceAgent } from "@shared/schema";

const clientId = "client_1"; // This would come from auth context

const voiceAgentSchema = z.object({
  agentName: z.string().min(2, "Agent name must be at least 2 characters"),
  voiceType: z.enum(["PROFESSIONAL", "FRIENDLY", "CASUAL"]),
  language: z.string().default("en-US"),
  welcomeMessage: z.string().min(10, "Welcome message must be at least 10 characters"),
  businessHours: z.string().optional(),
  bookingEnabled: z.boolean().default(true),
  transcriptionEnabled: z.boolean().default(true),
});

type VoiceAgentFormData = z.infer<typeof voiceAgentSchema>;

const mockInsights = [
  {
    title: "Peak Booking Hours",
    description: "Most appointments booked between 10 AM - 2 PM",
    value: "67%",
    trend: "+15%",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Customer Retention Rate",
    description: "Clients returning within 30 days",
    value: "84%",
    trend: "+8%",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Revenue Growth",
    description: "Monthly recurring revenue increase",
    value: "$3,247",
    trend: "+23%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Appointment No-Shows",
    description: "Missed appointments this month",
    value: "12%",
    trend: "-5%",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const mockRecommendations = [
  {
    type: "SCHEDULING",
    priority: "HIGH",
    title: "Optimize Staff Schedule",
    description: "Add 2 more staff members during peak hours (11 AM - 1 PM) to reduce wait times by 30%.",
    impact: "Increase capacity by 40%",
    action: "Review Schedule",
  },
  {
    type: "MARKETING",
    priority: "MEDIUM",
    title: "Target Off-Peak Hours",
    description: "Offer 20% discount for appointments between 3 PM - 5 PM to balance booking distribution.",
    impact: "Increase revenue by $800/month",
    action: "Create Campaign",
  },
  {
    type: "CUSTOMER_RETENTION",
    priority: "HIGH",
    title: "Follow-up Automation",
    description: "Set up automated follow-up messages 24 hours after appointments to increase rebooking by 25%.",
    impact: "Improve retention by 15%",
    action: "Setup Automation",
  },
];

export default function AIFeatures() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"voice" | "insights">("voice");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<VoiceAgentFormData>({
    resolver: zodResolver(voiceAgentSchema),
    defaultValues: {
      agentName: "",
      voiceType: "PROFESSIONAL",
      language: "en-US",
      welcomeMessage: "",
      businessHours: "",
      bookingEnabled: true,
      transcriptionEnabled: true,
    },
  });

  const { data: voiceAgent, isLoading } = useQuery({
    queryKey: [`/api/client/${clientId}/ai-voice-agent`],
  });

  const createAgentMutation = useMutation({
    mutationFn: async (data: VoiceAgentFormData) => {
      return apiRequest(`/api/client/${clientId}/ai-voice-agent`, "POST", { ...data, clientId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/ai-voice-agent`] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "AI Voice Agent Created",
        description: "Your AI voice agent has been successfully set up.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create AI voice agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleAgentMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      return apiRequest(`/api/client/${clientId}/ai-voice-agent/toggle`, "PATCH", { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/ai-voice-agent`] });
      const agent = voiceAgent as AIVoiceAgent;
      toast({
        title: agent?.isActive ? "AI Agent Deactivated" : "AI Agent Activated",
        description: agent?.isActive ? 
          "Your AI voice agent is now offline." : 
          "Your AI voice agent is now taking calls.",
      });
    },
  });

  const handleSubmit = (data: VoiceAgentFormData) => {
    createAgentMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Features</h1>
          <p className="text-gray-600">Leverage AI to automate tasks and gain insights</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === "voice" ? "default" : "outline"}
            onClick={() => setActiveTab("voice")}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            Voice Agent
          </Button>
          <Button
            variant={activeTab === "insights" ? "default" : "outline"}
            onClick={() => setActiveTab("insights")}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Voice Agent Section */}
      {activeTab === "voice" && (
        <div className="space-y-6">
          {!voiceAgent ? (
            <Card>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Set up your AI Voice Agent</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Create an AI-powered assistant to handle customer calls, answer questions, and book appointments 24/7.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full sm:w-auto">
                      <Mic className="h-4 w-4 mr-2" />
                      Setup AI Voice Agent
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Setup AI Voice Agent</DialogTitle>
                      <DialogDescription>
                        Configure your AI assistant to handle customer calls and bookings.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="agentName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Sarah" {...field} />
                                </FormControl>
                                <FormDescription>
                                  The name customers will hear when they call
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="voiceType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Voice Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                                    <SelectItem value="FRIENDLY">Friendly</SelectItem>
                                    <SelectItem value="CASUAL">Casual</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Language</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="en-US">English (US)</SelectItem>
                                    <SelectItem value="en-GB">English (UK)</SelectItem>
                                    <SelectItem value="es-US">Spanish (US)</SelectItem>
                                    <SelectItem value="fr-FR">French</SelectItem>
                                    <SelectItem value="de-DE">German</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="welcomeMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Welcome Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Hello! Thanks for calling [Business Name]. I'm Sarah, your AI assistant. How can I help you today?"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                The greeting customers will hear when they call
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Hours</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Monday-Friday: 9 AM - 6 PM, Saturday: 10 AM - 4 PM"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Hours to mention when customers ask about availability
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <h4 className="font-medium">Features</h4>
                          
                          <FormField
                            control={form.control}
                            name="bookingEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Enable Appointment Booking
                                  </FormLabel>
                                  <FormDescription>
                                    Allow customers to book appointments through the AI agent
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="transcriptionEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Call Transcription
                                  </FormLabel>
                                  <FormDescription>
                                    Generate transcripts of all calls for review
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createAgentMutation.isPending}>
                            {createAgentMutation.isPending ? "Setting up..." : "Create AI Agent"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Agent Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{(voiceAgent as AIVoiceAgent)?.agentName}</CardTitle>
                        <CardDescription>AI Voice Agent</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={(voiceAgent as AIVoiceAgent)?.isActive}
                      onCheckedChange={(checked) => toggleAgentMutation.mutate(checked)}
                      disabled={toggleAgentMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${(voiceAgent as AIVoiceAgent)?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="font-medium">
                        {(voiceAgent as AIVoiceAgent)?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {(voiceAgent as AIVoiceAgent)?.voiceType}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Languages className="h-4 w-4 text-gray-500" />
                      <span>{(voiceAgent as AIVoiceAgent)?.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{(voiceAgent as AIVoiceAgent)?.twilioPhoneNumber || 'Phone number pending'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span>{(voiceAgent as AIVoiceAgent)?.callVolume} calls handled</span>
                    </div>
                  </div>

                  {(voiceAgent as AIVoiceAgent)?.welcomeMessage && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 italic">
                        "{(voiceAgent as AIVoiceAgent)?.welcomeMessage}"
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Test Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Call Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Call Statistics</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Calls</span>
                      <span className="font-medium">127</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Successful Bookings</span>
                      <span className="font-medium">89</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Call Duration</span>
                      <span className="font-medium">2m 34s</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">$2,340</div>
                        <div className="text-xs text-gray-600">Revenue Generated</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">15h</div>
                        <div className="text-xs text-gray-600">Staff Time Saved</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* AI Insights Section */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${insight.bgColor}`}>
                      <insight.icon className={`h-6 w-6 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{insight.value}</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {insight.trend}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-1">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Personalized insights to grow your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} PRIORITY
                        </Badge>
                        <Badge variant="outline">{rec.type.replace('_', ' ')}</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-gray-600 mb-2">{rec.description}</p>
                      <div className="text-sm text-green-600 font-medium">
                        Expected Impact: {rec.impact}
                      </div>
                    </div>
                    <Button size="sm">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Daily appointment bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart visualization would be here</p>
                    <p className="text-sm">Integration with charts library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Revenue chart would be here</p>
                    <p className="text-sm">Integration with charts library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}