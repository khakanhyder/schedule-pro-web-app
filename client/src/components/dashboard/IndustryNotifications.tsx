import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useIndustry } from "@/lib/industryContext";
import { 
  MessageSquare, Mail, Smartphone, Bell,
  Scissors, Wrench, Heart, PawPrint, Palette,
  Clock, Calendar, Star, Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryNotifications() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();

  const getIndustryTemplates = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          appointment_reminder: {
            subject: "Your Beauty Appointment Tomorrow ✨",
            message: "Hi {client_name}! We're excited to see you tomorrow at {time} for your {service}. Please arrive 10 minutes early for your consultation. Can't wait to make you feel fabulous! 💕"
          },
          confirmation: {
            subject: "Appointment Confirmed - Let's Make You Gorgeous! 💅",
            message: "Perfect! Your {service} appointment is confirmed for {date} at {time}. We'll have everything ready to give you that stunning look you deserve. See you soon, beautiful! ✨"
          },
          follow_up: {
            subject: "How's Your New Look? Share Your Glow! ✨",
            message: "Hi gorgeous! How are you loving your new {service}? We hope you're feeling absolutely radiant! Don't forget to use the aftercare products we recommended. Tag us in your selfies - we love seeing our beautiful clients shine! 🌟"
          },
          rebooking: {
            subject: "Time for Your Touch-Up, Beautiful! 💕",
            message: "Hey {client_name}! Your {service} is due for a refresh in about a week. Ready to keep that gorgeous look going? Book your next appointment and maintain that fabulous vibe! Click here to schedule: {booking_link}"
          },
          seasonal: {
            subject: "Summer Hair Trends Are Here! ☀️",
            message: "Ready for summer, {client_name}? Beach waves and sun-kissed highlights are trending! Book your seasonal refresh and get that perfect summer glow. Limited time: 20% off highlight packages! ✨"
          }
        };

      case 'trades':
        return {
          appointment_reminder: {
            subject: "Project Visit Scheduled for Tomorrow",
            message: "Hello {client_name}, this confirms our appointment tomorrow at {time} for {service}. I'll bring all necessary tools and materials. Please ensure the work area is accessible. Call me at {phone} if you have any questions."
          },
          confirmation: {
            subject: "Job Confirmed - Ready to Get to Work",
            message: "Your {service} project is confirmed for {date} at {time}. I've reviewed the scope and will arrive with everything needed to complete the work professionally. Estimated completion: {duration}. Looking forward to exceeding your expectations."
          },
          follow_up: {
            subject: "How's Everything Holding Up?",
            message: "Hi {client_name}, just checking in on the {service} we completed. Is everything working perfectly? Remember, all work comes with our 2-year warranty. If you need anything or have questions, don't hesitate to call. Thanks for trusting us with your project!"
          },
          rebooking: {
            subject: "Maintenance Reminder - Keep Things Running Smooth",
            message: "Hello {client_name}, your {service} is due for routine maintenance. Regular upkeep prevents costly repairs and keeps your warranty valid. Ready to schedule? I have availability next week. Call {phone} or reply to book."
          },
          emergency: {
            subject: "Emergency Service Available 24/7",
            message: "Need urgent {service} repair? We're available 24/7 for emergencies. Call {emergency_phone} now for immediate assistance. Quick response, quality work, fair pricing - even on weekends and holidays."
          }
        };

      case 'wellness':
        return {
          appointment_reminder: {
            subject: "Your Wellness Journey Continues Tomorrow 🧘",
            message: "Namaste {client_name}, your {service} session is tomorrow at {time}. Please arrive 15 minutes early to center yourself. Bring comfortable clothes and an open mind. Looking forward to supporting your wellness journey! 🌱"
          },
          confirmation: {
            subject: "Session Confirmed - Your Path to Wellness Awaits",
            message: "Beautiful! Your {service} is confirmed for {date} at {time}. This is your time to focus on you and your well-being. Remember to stay hydrated and get good rest tonight. See you soon on your wellness journey! ✨"
          },
          follow_up: {
            subject: "How Are You Feeling After Your Session? 💚",
            message: "Hi {client_name}, how are you feeling after yesterday's {service}? Take time to notice any shifts in your energy or mood. Remember to practice the techniques we discussed. Your wellness journey is a beautiful process - trust it! 🌿"
          },
          rebooking: {
            subject: "Continue Your Healing Journey 🌸",
            message: "Hello beautiful soul, it's time to schedule your next {service} session. Consistency is key to lasting transformation. Your body and mind are ready for the next step in your wellness journey. Book now: {booking_link}"
          },
          motivation: {
            subject: "Daily Mindfulness Reminder 🧘‍♀️",
            message: "Good morning {client_name}! Take 3 deep breaths right now. Feel your body, honor your feelings, and set a positive intention for today. You are worthy of love, peace, and all good things. Have a mindful day! 💙"
          }
        };

      case 'pet-care':
        return {
          appointment_reminder: {
            subject: "Spa Day Tomorrow for {pet_name}! 🐾",
            message: "Woof woof! {pet_name}'s grooming appointment is tomorrow at {time}. Please bring their favorite toy for comfort! We can't wait to pamper your furry family member. They're going to look and feel amazing! 🎾"
          },
          confirmation: {
            subject: "Appointment Confirmed - {pet_name} is Going to Look Pawsome! 🐕",
            message: "Great news! {pet_name}'s {service} is all set for {date} at {time}. We'll take excellent care of your precious pup and make sure they're comfortable throughout their spa experience. Can't wait to see that wagging tail! 🐾"
          },
          follow_up: {
            subject: "How's {pet_name} Feeling After Their Spa Day? 🛁",
            message: "Hi {client_name}! We hope {pet_name} is feeling fresh and fabulous after their grooming session! Watch for any skin sensitivity over the next 24 hours (totally normal). We loved spending time with your sweet pup! 🐾💕"
          },
          rebooking: {
            subject: "Time for {pet_name}'s Next Spa Day! 🐾",
            message: "Hello! {pet_name} is due for their next grooming session. Regular grooming keeps their coat healthy and them comfortable. Plus, we miss those adorable paws! Ready to book their next pamper session? 🛁"
          },
          health_reminder: {
            subject: "Vaccination Reminder for {pet_name} 💉",
            message: "Just a friendly reminder that {pet_name}'s vaccinations are due soon. Keeping up with vaccines protects them and all their furry friends at daycare and grooming. Contact your vet to schedule! 🏥"
          }
        };

      case 'creative':
        return {
          appointment_reminder: {
            subject: "Creative Session Tomorrow - Let's Make Magic! ✨",
            message: "Hey {client_name}! Our {service} session is tomorrow at {time}. I'm excited to bring your vision to life! Please review the creative brief and bring any inspiration materials. This is going to be amazing! 🎨"
          },
          confirmation: {
            subject: "Project Confirmed - Ready to Create Something Beautiful",
            message: "Fantastic! Your {service} project is confirmed for {date} at {time}. I've been brainstorming ideas based on our conversation and can't wait to start creating. This collaboration is going to produce something truly special! 🎯"
          },
          follow_up: {
            subject: "How Are You Loving Your New {service}? 🌟",
            message: "Hi {client_name}! I hope you're thrilled with how your {service} turned out! I loved working on this project with you. If you're happy with the results, I'd be grateful for a review. Ready for the next creative adventure? 🚀"
          },
          rebooking: {
            subject: "Ready for Your Next Creative Project? 🎨",
            message: "Hello creative soul! I've been thinking about some exciting ideas for your next {service} project. Your brand is evolving beautifully and I'd love to help take it to the next level. Coffee chat soon? ☕"
          },
          inspiration: {
            subject: "Creative Inspiration Just for You! 💡",
            message: "Hey {client_name}! Saw this {trend/technique} and immediately thought of your brand aesthetic. Sometimes inspiration strikes at random moments! Let me know if you want to explore incorporating this into your next project. 🎭"
          }
        };

      default:
        return {
          appointment_reminder: {
            subject: "Appointment Reminder",
            message: "Hi {client_name}, this is a reminder about your {service} appointment tomorrow at {time}. We look forward to seeing you!"
          }
        };
    }
  };

  const templates = getIndustryTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState('appointment_reminder');

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-5 w-5 text-pink-600" />;
      case 'trades': return <Wrench className="h-5 w-5 text-orange-600" />;
      case 'wellness': return <Heart className="h-5 w-5 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-5 w-5 text-amber-600" />;
      case 'creative': return <Palette className="h-5 w-5 text-purple-600" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getIndustryColor = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return 'text-pink-600';
      case 'trades': return 'text-orange-600';
      case 'wellness': return 'text-green-600';
      case 'pet-care': return 'text-amber-600';
      case 'creative': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: `${selectedIndustry.name} communication template updated successfully`
    });
  };

  const handleSendTest = () => {
    toast({
      title: "Test Message Sent",
      description: "Preview sent to your email address"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {getIndustryIcon()}
        <div>
          <h2 className="text-2xl font-bold">Industry Communication Templates</h2>
          <p className="text-muted-foreground">
            Personalized messaging that speaks your client's language
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {selectedIndustry.name}
        </Badge>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="channels">Communication Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Types</CardTitle>
                <CardDescription>
                  Choose a message type to customize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(templates).map(([key, template]) => (
                  <Button
                    key={key}
                    variant={selectedTemplate === key ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedTemplate(key)}
                  >
                    <div className="flex items-center gap-2">
                      {key === 'appointment_reminder' && <Clock className="h-4 w-4" />}
                      {key === 'confirmation' && <Calendar className="h-4 w-4" />}
                      {key === 'follow_up' && <MessageSquare className="h-4 w-4" />}
                      {key === 'rebooking' && <Bell className="h-4 w-4" />}
                      {key === 'seasonal' && <Star className="h-4 w-4" />}
                      {key === 'emergency' && <Bell className="h-4 w-4" />}
                      {key === 'motivation' && <Heart className="h-4 w-4" />}
                      {key === 'health_reminder' && <Heart className="h-4 w-4" />}
                      {key === 'inspiration' && <Palette className="h-4 w-4" />}
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getIndustryIcon()}
                  <span className="capitalize">{selectedTemplate.replace('_', ' ')} Template</span>
                </CardTitle>
                <CardDescription>
                  Customize this message for your {selectedIndustry.name} business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject Line</Label>
                  <Textarea
                    id="subject"
                    rows={1}
                    defaultValue={templates[selectedTemplate]?.subject}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    defaultValue={templates[selectedTemplate]?.message}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variables like {'{client_name}'}, {'{service}'}, {'{time}'}, {'{date}'} for personalization
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveTemplate}>Save Template</Button>
                  <Button variant="outline" onClick={handleSendTest}>Send Test</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${getIndustryColor()}`}>
                  <Bell className="h-5 w-5" />
                  Smart Timing Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">24-Hour Reminder</Label>
                    <p className="text-sm text-muted-foreground">Send reminder day before appointment</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">2-Hour Alert</Label>
                    <p className="text-sm text-muted-foreground">Final reminder before service</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Follow-up After 24h</Label>
                    <p className="text-sm text-muted-foreground">Ask about experience next day</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Rebooking Window</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedIndustry.id === 'beauty' ? 'Send 6 weeks after service' : 
                       selectedIndustry.id === 'wellness' ? 'Send weekly for packages' :
                       selectedIndustry.id === 'pet-care' ? 'Send every 6-8 weeks' :
                       'Send based on service type'}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${getIndustryColor()}`}>
                  <Star className="h-5 w-5" />
                  Industry-Specific Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedIndustry.id === 'beauty' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Color Touch-up Reminders</Label>
                        <p className="text-sm text-muted-foreground">Send 4 weeks after color services</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Seasonal Service Offers</Label>
                        <p className="text-sm text-muted-foreground">Promote trending seasonal looks</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}

                {selectedIndustry.id === 'trades' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Maintenance Schedules</Label>
                        <p className="text-sm text-muted-foreground">Annual HVAC, seasonal gutters</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Weather Alerts</Label>
                        <p className="text-sm text-muted-foreground">Storm damage services offers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}

                {selectedIndustry.id === 'wellness' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Progress Check-ins</Label>
                        <p className="text-sm text-muted-foreground">Weekly wellness goal updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Mindfulness Prompts</Label>
                        <p className="text-sm text-muted-foreground">Daily meditation reminders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}

                {selectedIndustry.id === 'pet-care' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Vaccination Reminders</Label>
                        <p className="text-sm text-muted-foreground">Track and remind about pet vaccines</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Birthday Celebrations</Label>
                        <p className="text-sm text-muted-foreground">Special offers on pet birthdays</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}

                {selectedIndustry.id === 'creative' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Portfolio Updates</Label>
                        <p className="text-sm text-muted-foreground">Share new work with past clients</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Trend Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify about relevant design trends</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enabled</Label>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm text-muted-foreground">
                  Professional, detailed communication perfect for confirmations and follow-ups
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enabled</Label>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm text-muted-foreground">
                  Quick reminders and time-sensitive notifications
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enabled</Label>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm text-muted-foreground">
                  Instant alerts for urgent updates
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}