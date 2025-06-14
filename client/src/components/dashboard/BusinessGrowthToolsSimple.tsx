import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  TrendingUp, 
  Share2, 
  Star, 
  Users, 
  ExternalLink,
  Copy,
  CheckCircle,
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
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    Professional [service] services in [city]. Book online for expert [service] with experienced professionals. Same-day appointments available.
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("Professional hair styling services in Downtown. Book online for expert cuts with experienced stylists. Same-day appointments available.")}
                  >
                    {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <Badge variant="outline">service near me</Badge>
                    <Badge variant="outline">city service</Badge>
                    <Badge variant="outline">best service area</Badge>
                    <Badge variant="outline">book service online</Badge>
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
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Active Referral Program</h4>
                  <p className="text-sm text-green-600">$20 reward for successful referrals</p>
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
                  Manage Referral Program
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
                    <span className="text-sm">Share client results</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}