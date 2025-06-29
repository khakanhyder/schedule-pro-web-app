import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Camera, Send, Phone, Image, Clock, CheckCircle2, Users } from "lucide-react";
import { useIndustry } from "@/lib/industryContext";

interface Message {
  id: string;
  appointmentId: number;
  clientName: string;
  clientPhone: string;
  direction: 'sent' | 'received';
  type: 'sms' | 'photo' | 'voice';
  content: string;
  timestamp: string;
  status: 'pending' | 'delivered' | 'read';
  attachments?: string[];
}

interface AutomatedMessage {
  id: string;
  trigger: string;
  template: string;
  enabled: boolean;
  timing: number; // hours before/after
  recipients: number;
}

export default function CommunicationHub() {
  const [selectedTab, setSelectedTab] = useState("messages");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { selectedIndustry } = useIndustry();
  const queryClient = useQueryClient();

  // Mock data - replace with real API calls
  const mockMessages: Message[] = [
    {
      id: "1",
      appointmentId: 1,
      clientName: "Sarah Johnson",
      clientPhone: "+1 (555) 123-4567",
      direction: "received",
      type: "sms",
      content: "Hi! I'm running about 10 minutes late. Is that okay?",
      timestamp: "2024-12-29T14:30:00Z",
      status: "read"
    },
    {
      id: "2",
      appointmentId: 1,
      clientName: "Sarah Johnson", 
      clientPhone: "+1 (555) 123-4567",
      direction: "sent",
      type: "sms",
      content: "No problem at all! See you when you get here.",
      timestamp: "2024-12-29T14:31:00Z",
      status: "delivered"
    },
    {
      id: "3",
      appointmentId: 2,
      clientName: "Mike Chen",
      clientPhone: "+1 (555) 987-6543",
      direction: "sent",
      type: "photo",
      content: "Here's your before and after! 📸",
      timestamp: "2024-12-29T16:45:00Z",
      status: "read",
      attachments: ["before_photo.jpg", "after_photo.jpg"]
    }
  ];

  const automatedMessages: AutomatedMessage[] = [
    {
      id: "1",
      trigger: "appointment_confirmed",
      template: "Hi {clientName}! Your {serviceName} appointment is confirmed for {date} at {time}. We're excited to see you!",
      enabled: true,
      timing: 0,
      recipients: 156
    },
    {
      id: "2",
      trigger: "appointment_reminder", 
      template: "Reminder: You have a {serviceName} appointment tomorrow at {time}. Reply CONFIRM to confirm or RESCHEDULE if you need to change.",
      enabled: true,
      timing: 24,
      recipients: 134
    },
    {
      id: "3",
      trigger: "service_complete",
      template: "Thanks for choosing us today! We'd love your feedback: {reviewLink}. Book your next appointment: {bookingLink}",
      enabled: false,
      timing: -2,
      recipients: 0
    }
  ];

  const sendMessage = useMutation({
    mutationFn: async (messageData: { appointmentId: number; content: string; type: string }) => {
      return apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMessage("");
    }
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage.mutate({
        appointmentId: parseInt(selectedConversation),
        content: newMessage,
        type: "sms"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      case 'read': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      default: return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getConversations = () => {
    const conversations = new Map();
    mockMessages.forEach(msg => {
      const key = `${msg.appointmentId}`;
      if (!conversations.has(key) || new Date(msg.timestamp) > new Date(conversations.get(key).timestamp)) {
        conversations.set(key, {
          appointmentId: msg.appointmentId,
          clientName: msg.clientName,
          clientPhone: msg.clientPhone,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          unread: msg.direction === 'received' && msg.status !== 'read'
        });
      }
    });
    return Array.from(conversations.values());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Communication Hub</h2>
        <p className="text-muted-foreground">
          Stay connected with clients through SMS, photos, and automated messaging
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
                <CardDescription>Recent client messages</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {getConversations().map((conversation) => (
                    <div
                      key={conversation.appointmentId}
                      className={`p-3 cursor-pointer hover:bg-muted/50 border-b ${
                        selectedConversation === conversation.appointmentId.toString() ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.appointmentId.toString())}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            {conversation.clientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{conversation.clientName}</p>
                            <p className="text-xs text-muted-foreground">{conversation.clientPhone}</p>
                          </div>
                        </div>
                        {conversation.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Thread */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedConversation 
                    ? getConversations().find(c => c.appointmentId.toString() === selectedConversation)?.clientName
                    : 'Select a conversation'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[500px]">
                {selectedConversation ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {mockMessages
                        .filter(msg => msg.appointmentId.toString() === selectedConversation)
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                              message.direction === 'sent' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              {message.type === 'photo' && message.attachments && (
                                <div className="mb-2 space-y-2">
                                  {message.attachments.map((attachment, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <Image className="h-4 w-4" />
                                      {attachment}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                {message.direction === 'sent' && getStatusIcon(message.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Messaging</CardTitle>
              <CardDescription>
                Set up automated messages for different appointment stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {automatedMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium capitalize">
                          {message.trigger.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Sent to {message.recipients} clients
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={message.enabled ? "default" : "secondary"}>
                          {message.enabled ? "Active" : "Inactive"}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ backgroundColor: message.enabled ? undefined : selectedIndustry.primaryColor }}
                        >
                          {message.enabled ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message Template</label>
                      <Textarea 
                        value={message.template}
                        className="min-h-[80px]"
                        placeholder="Enter your message template..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Timing</label>
                        <p className="text-xs text-muted-foreground">
                          {message.timing > 0 ? `${message.timing} hours before` : 
                           message.timing < 0 ? `${Math.abs(message.timing)} hours after` : 
                           'Immediately'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Messages Sent</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Photos Shared</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Communication Impact</CardTitle>
              <CardDescription>
                How messaging affects your business outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Appointment confirmation rate</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>No-show reduction</span>
                  <span className="font-bold text-green-600">-42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Client satisfaction increase</span>
                  <span className="font-bold">+28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rebook rate improvement</span>
                  <span className="font-bold">+35%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}