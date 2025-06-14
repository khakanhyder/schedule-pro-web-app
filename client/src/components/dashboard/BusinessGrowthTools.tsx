import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  TrendingUp, 
  Share2, 
  Star, 
  Users, 
  BarChart3, 
  ExternalLink,
  Copy,
  CheckCircle,
  MapPin,
  Calendar,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BusinessGrowthTools() {
  const [selectedTab, setSelectedTab] = useState("seo");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">Business Growth Tools</h2>
        <Badge variant="outline" className="bg-green-50">Growth Features</Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo">SEO & Discovery</TabsTrigger>
          <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="loyalty">Client Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Google My Business Optimization
                </CardTitle>
                <CardDescription>
                  Tools to improve your local search visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Description Generator</Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    "Professional [service] services in [city]. Book online for expert [service] with experienced professionals. Same-day appointments available. Serving [area] since 2020."
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("Professional hair styling services in Downtown. Book online for expert cuts with experienced stylists. Same-day appointments available. Serving Metro Area since 2020.")}
                  >
                    {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>SEO Keywords to Target</Label>
                  <div className="space-y-1">
                    <Badge variant="outline">"service near me"</Badge>
                    <Badge variant="outline">"city service"</Badge>
                    <Badge variant="outline">"best service area"</Badge>
                    <Badge variant="outline">"book service online"</Badge>
                  </div>
                </div>

                <Button className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google My Business
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Review Collection System
                </CardTitle>
                <CardDescription>
                  Automated review requests to boost SEO rankings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.8</div>
                    <div className="text-sm text-blue-600">Avg Rating</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">127</div>
                    <div className="text-sm text-green-600">Total Reviews</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-send review requests</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Follow up if no response</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thank happy reviewers</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">
                  View Review Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Local SEO Checklist</CardTitle>
              <CardDescription>
                Complete these tasks to improve your local search rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Claim Google My Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Add business hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Upload high-quality photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Enable online booking link</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Post regular updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Respond to all reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Add service-specific pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Create location landing pages</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referral Program Setup
                </CardTitle>
                <CardDescription>
                  Automated system to reward client referrals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="referral-reward">Reward Amount</Label>
                  <Input 
                    id="referral-reward"
                    placeholder="$20" 
                    value="$20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral-requirement">Minimum Spend Required</Label>
                  <Input 
                    id="referral-requirement"
                    placeholder="$50" 
                    value="$50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-track referrals</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Send reward notifications</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">
                  Activate Referral Program
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Performance</CardTitle>
                <CardDescription>Track your referral program success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-purple-600">Active Referrers</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">89</div>
                    <div className="text-sm text-orange-600">New Clients</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold">12 referrals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Generated</span>
                    <span className="font-semibold text-green-600">$2,340</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Top Referrer</span>
                    <span className="font-semibold">Sarah M. (5 refs)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shareable Referral Content</CardTitle>
              <CardDescription>
                Pre-written content your clients can easily share
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Social Media Post Template</Label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  "Just had an amazing {'{service}'} at {'{business}'}! 🤩 They're offering $20 off your first visit when you mention my name. Book online at {'{website}'} #LocalBusiness #GreatService"
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard("Just had an amazing haircut at Studio! 🤩 They're offering $20 off your first visit when you mention my name. Book online at ourwebsite.com #LocalBusiness #GreatService")}
                >
                  {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Text Message Template</Label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  "Hey! I found this great {'{service}'} place - {'{business}'}. You get $20 off if you mention me when booking. Check them out: {'{website}'}"
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard("Hey! I found this great salon - Studio Hair. You get $20 off if you mention me when booking. Check them out: ourwebsite.com")}
                >
                  {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Automation
                </CardTitle>
                <CardDescription>
                  Auto-post content to attract new clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Post Schedule</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Before/After Photos</Button>
                    <Button variant="outline" size="sm">Availability Posts</Button>
                    <Button variant="outline" size="sm">Service Highlights</Button>
                    <Button variant="outline" size="sm">Client Features</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-post availability</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Share client results (with permission)</span>
                    <Switch />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Post booking reminders</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">
                  Connect Social Accounts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Boosters</CardTitle>
                <CardDescription>
                  Content ideas that drive bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-800">Monday Motivation</h4>
                  <p className="text-sm text-blue-600">Post weekly specials or new service announcements</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-800">Transformation Tuesday</h4>
                  <p className="text-sm text-green-600">Share before/after photos with client permission</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-medium text-purple-800">Friday Availability</h4>
                  <p className="text-sm text-purple-600">Post weekend availability to fill last-minute slots</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking-Focused Content Templates</CardTitle>
              <CardDescription>
                Ready-to-use posts that drive appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">Last-Minute Availability</Badge>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    "🔥 LAST MINUTE OPENING! Had a cancellation for tomorrow at 2 PM. Perfect time for that {'{service}'} you've been wanting! DM to book or visit {'{website}'} ⚡"
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Seasonal Promotion</Badge>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    "✨ Ready for {'{season}'}? Book your {'{service}'} this week and get 15% off! Limited spots available. Book now: {'{website}'} 📅"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>
                  Automated rewards to increase client retention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Program Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="border-blue-500 bg-blue-50">
                      Points System
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Counter
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reward Schedule</Label>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>5 visits</span>
                      <span className="font-medium">10% off next service</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10 visits</span>
                      <span className="font-medium">Free add-on service</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15 visits</span>
                      <span className="font-medium">25% off any service</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Launch Loyalty Program
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Analytics</CardTitle>
                <CardDescription>
                  Track client loyalty and lifetime value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">73%</div>
                    <div className="text-sm text-indigo-600">Retention Rate</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">$340</div>
                    <div className="text-sm text-yellow-600">Avg LTV</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">VIP Clients (10+ visits)</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">At-Risk Clients</span>
                    <span className="font-semibold text-red-600">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Win-Back Campaigns Sent</span>
                    <span className="font-semibold">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automated Retention Campaigns</CardTitle>
              <CardDescription>
                Keep clients engaged and coming back
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Birthday Rewards</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automatic birthday discount emails
                  </p>
                  <Badge variant="outline" className="text-green-600">Active</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Win-Back Series</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Re-engage clients who haven't booked in 60+ days
                  </p>
                  <Badge variant="outline" className="text-green-600">Active</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Anniversary Specials</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Celebrate client loyalty milestones
                  </p>
                  <Badge variant="outline">Setup Required</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}