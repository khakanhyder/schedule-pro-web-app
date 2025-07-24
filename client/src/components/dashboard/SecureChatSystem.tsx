import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Phone,
  Users,
  Shield,
  Clock,
  Paperclip,
  Camera,
  MapPin,
  Heart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'sitter' | 'admin';
  message: string;
  timestamp: string;
  attachments?: {
    type: 'photo' | 'location' | 'file';
    url: string;
    caption?: string;
  }[];
  isUrgent?: boolean;
}

interface ChatThread {
  id: string;
  petName: string;
  clientName: string;
  sitterName: string;
  serviceType: string;
  serviceDate: string;
  status: 'active' | 'completed' | 'urgent';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const sampleChats: ChatThread[] = [
  {
    id: '1',
    petName: 'Max',
    clientName: 'Jennifer Smith',
    sitterName: 'Sarah Johnson',
    serviceType: 'Dog Walking',
    serviceDate: '2025-07-24',
    status: 'active',
    lastMessage: 'Max did great on his walk today! He was very energetic.',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'client1',
        senderName: 'Jennifer Smith',
        senderRole: 'client',
        message: 'Hi Sarah! Just checking in about Max\'s walk today. How did he do?',
        timestamp: '2:15 PM'
      },
      {
        id: 'm2',
        senderId: 'sitter1',
        senderName: 'Sarah Johnson',
        senderRole: 'sitter',
        message: 'Max did great on his walk today! He was very energetic and well-behaved. We walked for 35 minutes around the neighborhood.',
        timestamp: '2:30 PM',
        attachments: [
          {
            type: 'photo',
            url: 'max_walk.jpg',
            caption: 'Max enjoying his walk!'
          }
        ]
      },
      {
        id: 'm3',
        senderId: 'sitter1',
        senderName: 'Sarah Johnson',
        senderRole: 'sitter',
        message: 'Here\'s where we went today',
        timestamp: '2:31 PM',
        attachments: [
          {
            type: 'location',
            url: 'map_location',
            caption: 'Walk route - 1.2 miles'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    petName: 'Luna',
    clientName: 'David Chen',
    sitterName: 'Mike Rodriguez',
    serviceType: 'Pet Sitting',
    serviceDate: '2025-07-24',
    status: 'urgent',
    lastMessage: 'Luna seems a bit anxious today. Should I give her the medication?',
    lastMessageTime: '1:45 PM',
    unreadCount: 1,
    messages: [
      {
        id: 'm4',
        senderId: 'sitter2',
        senderName: 'Mike Rodriguez',
        senderRole: 'sitter',
        message: 'Luna seems a bit anxious today. Should I give her the medication you mentioned?',
        timestamp: '1:45 PM',
        isUrgent: true
      }
    ]
  },
  {
    id: '3',
    petName: 'Bella',
    clientName: 'Maria Rodriguez',
    sitterName: 'Emily Davis',
    serviceType: 'Pet Boarding',
    serviceDate: '2025-07-23',
    status: 'completed',
    lastMessage: 'Thank you so much for taking such great care of Bella!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        senderId: 'client3',
        senderName: 'Maria Rodriguez',
        senderRole: 'client',
        message: 'Thank you so much for taking such great care of Bella! The photos you sent were wonderful.',
        timestamp: 'Yesterday 6:30 PM'
      }
    ]
  }
];

export default function SecureChatSystem() {
  const [chats, setChats] = useState<ChatThread[]>(sampleChats);
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(chats[0]);
  const [newMessage, setNewMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client': return 'bg-blue-500';
      case 'sitter': return 'bg-green-500';
      case 'admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message: ChatMessage = {
        id: `m${Date.now()}`,
        senderId: 'admin1',
        senderName: 'Pet Care Admin',
        senderRole: 'admin',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };

      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, message],
        lastMessage: newMessage,
        lastMessageTime: 'Just now'
      };

      setChats(chats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      ));
      setSelectedChat(updatedChat);
      setNewMessage('');
    }
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const activeChats = chats.filter(chat => chat.status === 'active').length;
  const urgentChats = chats.filter(chat => chat.status === 'urgent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">3-Way Secure Chat</h2>
          <p className="text-gray-600">Real-time communication between clients, sitters, and administrators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Contact
          </Button>
          <Button className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Chats</p>
                <p className="text-2xl font-bold">{chats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Urgent</p>
                <p className="text-2xl font-bold">{urgentChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Unread</p>
                <p className="text-2xl font-bold">{totalUnread}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {chats.map((chat) => (
                <div 
                  key={chat.id}
                  className={`p-3 cursor-pointer transition-colors border-l-4 ${
                    selectedChat?.id === chat.id 
                      ? 'bg-blue-50 border-l-blue-500' 
                      : chat.status === 'urgent'
                      ? 'hover:bg-red-50 border-l-red-500'
                      : 'hover:bg-gray-50 border-l-transparent'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{chat.petName}</h3>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1 min-w-[16px] h-4">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(chat.status)} text-xs`}>
                      {chat.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <p>{chat.clientName} • {chat.sitterName}</p>
                    <p>{chat.serviceType} • {chat.serviceDate}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate flex-1 mr-2">
                      {chat.lastMessage}
                    </p>
                    <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {selectedChat.petName} - {selectedChat.serviceType}
                    </CardTitle>
                    <CardDescription>
                      Client: {selectedChat.clientName} • Sitter: {selectedChat.sitterName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedChat.status)}>
                      {selectedChat.status.toUpperCase()}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={`text-white text-xs ${getRoleColor(message.senderRole)}`}>
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.senderName}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.senderRole}
                          </Badge>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {message.isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm">{message.message}</p>
                          {message.attachments && message.attachments.map((attachment, index) => (
                            <div key={index} className="mt-2 p-2 bg-white rounded border">
                              <div className="flex items-center gap-2">
                                {attachment.type === 'photo' && <Camera className="w-4 h-4" />}
                                {attachment.type === 'location' && <MapPin className="w-4 h-4" />}
                                {attachment.type === 'file' && <Paperclip className="w-4 h-4" />}
                                <span className="text-xs text-gray-600">
                                  {attachment.caption || attachment.url}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-600 mb-2">Select a Conversation</h3>
              <p className="text-sm text-gray-500">
                Choose a chat from the list to view messages and continue the conversation.
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Security Features */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Secure Communication Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">End-to-End Security</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Encrypted messaging for privacy protection</li>
                <li>• Secure photo and file sharing</li>
                <li>• GPS location sharing with consent</li>
                <li>• Message history preservation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">3-Way Communication</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Direct client-sitter communication</li>
                <li>• Admin oversight and support</li>
                <li>• Emergency escalation protocols</li>
                <li>• Professional mediation when needed</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Smart Features</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Urgent message prioritization</li>
                <li>• Automated service updates</li>
                <li>• Photo sharing with GPS timestamps</li>
                <li>• Integration with visit tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}