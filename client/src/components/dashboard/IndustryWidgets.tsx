import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIndustry } from "@/lib/industryContext";
import { 
  Scissors, Wrench, Heart, PawPrint, Palette,
  TrendingUp, Users, Clock, DollarSign, Star,
  Calendar, AlertTriangle, CheckCircle, Package,
  Thermometer, Droplets, Zap, Shield
} from "lucide-react";

export default function IndustryWidgets() {
  const { selectedIndustry } = useIndustry();

  const getBeautyWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Scissors className="h-4 w-4 text-pink-600" />
            Color Services Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">8</div>
          <p className="text-xs text-muted-foreground">3 highlights, 2 full color, 3 touch-ups</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Developer stock</span>
              <span className="text-green-600">Good</span>
            </div>
            <Progress value={75} className="h-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-pink-600" />
            Client Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">4.9</div>
          <p className="text-xs text-muted-foreground">Average rating this week</p>
          <div className="mt-2 flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-3 w-3 fill-pink-600 text-pink-600" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4 text-pink-600" />
            Product Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">$847</div>
          <p className="text-xs text-muted-foreground">Retail sales today</p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">↗ 23%</span> vs yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-pink-600" />
            Rebooking Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">78%</div>
          <p className="text-xs text-muted-foreground">Clients rebook within 8 weeks</p>
          <Progress value={78} className="h-1 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplets className="h-4 w-4 text-pink-600" />
            Treatment Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">12</div>
          <p className="text-xs text-muted-foreground">Deep conditioning due</p>
          <Button size="sm" className="mt-2 w-full" variant="outline">
            Send Reminders
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-pink-600" />
            Seasonal Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-pink-600">Summer Ready</div>
          <p className="text-xs text-muted-foreground">Beach waves +45%, Blonde +32%</p>
          <Badge variant="secondary" className="mt-1 text-xs">
            Trending Up
          </Badge>
        </CardContent>
      </Card>
    </div>
  );

  const getTradesWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wrench className="h-4 w-4 text-orange-600" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">6</div>
          <p className="text-xs text-muted-foreground">2 kitchen, 3 bathroom, 1 deck</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>On schedule</span>
              <span className="text-green-600">83%</span>
            </div>
            <Progress value={83} className="h-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-600" />
            Material Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">$2,840</div>
          <p className="text-xs text-muted-foreground">This week's materials</p>
          <div className="mt-2 text-xs">
            <span className="text-red-600">↗ 15%</span> lumber prices up
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-600" />
            Safety Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">98%</div>
          <p className="text-xs text-muted-foreground">Safety checklist completion</p>
          <Badge variant="secondary" className="mt-1 text-xs bg-green-50 text-green-700">
            Excellent
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Emergency Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">3</div>
          <p className="text-xs text-muted-foreground">This week (avg response: 45min)</p>
          <Button size="sm" className="mt-2 w-full" variant="outline">
            View Queue
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            Permits Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">4/5</div>
          <p className="text-xs text-muted-foreground">Approved this month</p>
          <div className="mt-2 text-xs text-amber-600">
            1 pending city approval
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            Project Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">$47K</div>
          <p className="text-xs text-muted-foreground">Quoted work next month</p>
          <Progress value={65} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );

  const getWellnessWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-600" />
            Client Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">23</div>
          <p className="text-xs text-muted-foreground">Goals achieved this month</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>On track</span>
              <span className="text-green-600">87%</span>
            </div>
            <Progress value={87} className="h-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            Session Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">18</div>
          <p className="text-xs text-muted-foreground">Active package clients</p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">↗ 12%</span> retention rate
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-green-600" />
            Wellness Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">8.4</div>
          <p className="text-xs text-muted-foreground">Average client wellness rating</p>
          <Badge variant="secondary" className="mt-1 text-xs bg-green-50 text-green-700">
            Improving
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            Consistency Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">76%</div>
          <p className="text-xs text-muted-foreground">Clients attend scheduled sessions</p>
          <Button size="sm" className="mt-2 w-full" variant="outline">
            Send Reminders
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            Energy Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-green-600">High Energy</div>
          <p className="text-xs text-muted-foreground">Client mood tracking average</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            <div className="h-8 bg-green-200 rounded"></div>
            <div className="h-6 bg-green-300 rounded"></div>
            <div className="h-10 bg-green-400 rounded"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Referral Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">9</div>
          <p className="text-xs text-muted-foreground">New referrals this month</p>
          <Progress value={90} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );

  const getPetCareWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-amber-600" />
            Pets Served Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">14</div>
          <p className="text-xs text-muted-foreground">6 dogs, 4 cats, 3 exotics, 1 bird</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>On time</span>
              <span className="text-green-600">92%</span>
            </div>
            <Progress value={92} className="h-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-amber-600" />
            Pet Happiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">😊 98%</div>
          <p className="text-xs text-muted-foreground">Happy pets rating</p>
          <Badge variant="secondary" className="mt-1 text-xs bg-amber-50 text-amber-700">
            Tail-wagging good!
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-600" />
            Vaccination Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">87%</div>
          <p className="text-xs text-muted-foreground">Clients up to date</p>
          <div className="mt-2 text-xs text-amber-600">
            3 reminders sent today
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600" />
            Grooming Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">6 weeks</div>
          <p className="text-xs text-muted-foreground">Average rebooking time</p>
          <Button size="sm" className="mt-2 w-full" variant="outline">
            Send Reminders
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Special Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">5</div>
          <p className="text-xs text-muted-foreground">Anxious pets today</p>
          <div className="mt-2 text-xs text-blue-600">
            Extra comfort protocol ready
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-600" />
            Owner Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">4.8</div>
          <p className="text-xs text-muted-foreground">Average review rating</p>
          <Progress value={96} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );

  const getCreativeWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-600" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">8</div>
          <p className="text-xs text-muted-foreground">3 photography, 2 design, 3 video</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>On deadline</span>
              <span className="text-green-600">88%</span>
            </div>
            <Progress value={88} className="h-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-purple-600" />
            Portfolio Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">1,247</div>
          <p className="text-xs text-muted-foreground">This month</p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">↗ 34%</span> vs last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-600" />
            Project Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">$12,400</div>
          <p className="text-xs text-muted-foreground">In progress projects</p>
          <Badge variant="secondary" className="mt-1 text-xs bg-purple-50 text-purple-700">
            High Value
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            Creative Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">156</div>
          <p className="text-xs text-muted-foreground">Billable hours this month</p>
          <Progress value={78} className="h-1 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Client Revisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">2.1</div>
          <p className="text-xs text-muted-foreground">Average rounds per project</p>
          <div className="mt-2 text-xs text-green-600">
            Below industry average (2.8)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Referral Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">67%</div>
          <p className="text-xs text-muted-foreground">Clients refer new business</p>
          <Button size="sm" className="mt-2 w-full" variant="outline">
            View Referrals
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderIndustryWidgets = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return getBeautyWidgets();
      case 'trades':
        return getTradesWidgets();
      case 'wellness':
        return getWellnessWidgets();
      case 'pet-care':
        return getPetCareWidgets();
      case 'creative':
        return getCreativeWidgets();
      default:
        return (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Select an industry to see custom widgets</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Industry Dashboard</h2>
          <p className="text-muted-foreground">
            Custom metrics and insights for {selectedIndustry.name} businesses
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {selectedIndustry.name}
        </Badge>
      </div>

      {renderIndustryWidgets()}
    </div>
  );
}