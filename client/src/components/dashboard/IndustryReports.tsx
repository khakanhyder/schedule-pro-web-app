import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useIndustry } from "@/lib/industryContext";
import { 
  BarChart3, TrendingUp, DollarSign, Users, Clock,
  Scissors, Wrench, Heart, PawPrint, Palette,
  Calendar, Star, Target, Download, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryReports() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const getIndustryMetrics = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          overview: {
            totalRevenue: 18650,
            clientCount: 142,
            averageServiceValue: 165,
            rebookingRate: 78,
            noShowRate: 8,
            productSales: 3240
          },
          serviceBreakdown: [
            { name: "Color Services", revenue: 7200, count: 42, avgPrice: 171 },
            { name: "Cut & Style", revenue: 4850, count: 58, avgPrice: 84 },
            { name: "Treatments", revenue: 2100, count: 28, avgPrice: 75 },
            { name: "Special Events", revenue: 1800, count: 12, avgPrice: 150 },
            { name: "Extensions", revenue: 1200, count: 8, avgPrice: 150 },
            { name: "Product Sales", revenue: 1500, count: 85, avgPrice: 18 }
          ],
          clientAnalytics: {
            newClients: 23,
            returningClients: 119,
            vipClients: 34,
            averageVisitFrequency: 6.2,
            clientLifetimeValue: 1240
          },
          trends: {
            peakHours: ["10:00 AM", "2:00 PM", "5:00 PM"],
            seasonalTrends: "Summer highlights up 45%, Beach waves trending",
            mostPopularServices: ["Balayage", "Keratin Treatment", "Wedding Updo"]
          }
        };

      case 'trades':
        return {
          overview: {
            totalRevenue: 47200,
            jobCount: 28,
            averageJobValue: 1686,
            completionRate: 96,
            emergencyCallRate: 12,
            materialCosts: 14800
          },
          serviceBreakdown: [
            { name: "Kitchen Remodels", revenue: 18500, count: 3, avgPrice: 6167 },
            { name: "Bathroom Renovations", revenue: 12200, count: 4, avgPrice: 3050 },
            { name: "Emergency Repairs", revenue: 6800, count: 12, avgPrice: 567 },
            { name: "Electrical Work", revenue: 4200, count: 5, avgPrice: 840 },
            { name: "Plumbing Services", revenue: 3600, count: 8, avgPrice: 450 },
            { name: "HVAC Maintenance", revenue: 1900, count: 6, avgPrice: 317 }
          ],
          clientAnalytics: {
            newClients: 8,
            returningClients: 20,
            commercialClients: 6,
            averageProjectSize: 1686,
            clientSatisfactionScore: 4.8
          },
          trends: {
            busySeasons: ["Spring", "Fall"],
            emergencyTrends: "HVAC calls peak in summer/winter",
            growingServices: ["Smart home installations", "Energy efficiency upgrades"]
          }
        };

      case 'wellness':
        return {
          overview: {
            totalRevenue: 12400,
            sessionCount: 156,
            averageSessionValue: 95,
            clientRetention: 84,
            packageSales: 28,
            progressGoalsAchieved: 142
          },
          serviceBreakdown: [
            { name: "Massage Therapy", revenue: 5200, count: 52, avgPrice: 100 },
            { name: "Yoga Sessions", revenue: 2800, count: 48, avgPrice: 58 },
            { name: "Nutrition Counseling", revenue: 2100, count: 14, avgPrice: 150 },
            { name: "Acupuncture", revenue: 1600, count: 20, avgPrice: 80 },
            { name: "Wellness Packages", revenue: 700, count: 22, avgPrice: 32 }
          ],
          clientAnalytics: {
            newClients: 18,
            returningClients: 67,
            packageClients: 28,
            averageSessionsPerMonth: 3.2,
            wellnessScoreImprovement: 2.3
          },
          trends: {
            popularModalities: ["Deep tissue massage", "Stress relief", "Chronic pain management"],
            seasonalPatterns: "Wellness challenges popular in January, self-care focus in December",
            clientGoals: ["Stress reduction (67%)", "Pain management (45%)", "Fitness goals (38%)"]
          }
        };

      case 'pet-care':
        return {
          overview: {
            totalRevenue: 8640,
            petCount: 168,
            averageServiceValue: 58,
            rebookingRate: 82,
            newPetRate: 15,
            healthReminders: 42
          },
          serviceBreakdown: [
            { name: "Full Grooming", revenue: 4200, count: 68, avgPrice: 62 },
            { name: "Bath & Brush", revenue: 1800, count: 45, avgPrice: 40 },
            { name: "Nail Trims", revenue: 960, count: 64, avgPrice: 15 },
            { name: "De-shedding", revenue: 720, count: 24, avgPrice: 30 },
            { name: "Specialty Services", revenue: 680, count: 12, avgPrice: 57 },
            { name: "Add-on Services", revenue: 280, count: 28, avgPrice: 10 }
          ],
          clientAnalytics: {
            newPets: 25,
            regularClients: 143,
            multiPetFamilies: 34,
            averageVisitFrequency: 7.2,
            petSatisfactionScore: 4.9
          },
          trends: {
            peakTimes: ["Spring shedding season", "Pre-holiday grooming", "Summer coat maintenance"],
            breedTrends: "Golden Retrievers (22%), Labrador (18%), Mixed breeds (31%)",
            seasonalServices: ["De-shedding treatments peak in spring", "Nail trims steady year-round"]
          }
        };

      case 'creative':
        return {
          overview: {
            totalRevenue: 32800,
            projectCount: 18,
            averageProjectValue: 1822,
            clientSatisfaction: 96,
            referralRate: 67,
            revisionRounds: 2.1
          },
          serviceBreakdown: [
            { name: "Wedding Photography", revenue: 12500, count: 5, avgPrice: 2500 },
            { name: "Brand Identity", revenue: 8400, count: 3, avgPrice: 2800 },
            { name: "Website Design", revenue: 6400, count: 2, avgPrice: 3200 },
            { name: "Portrait Sessions", revenue: 2800, count: 8, avgPrice: 350 },
            { name: "Logo Design", revenue: 1700, count: 2, avgPrice: 850 },
            { name: "Product Photography", revenue: 1000, count: 5, avgPrice: 200 }
          ],
          clientAnalytics: {
            newClients: 12,
            returningClients: 6,
            corporateClients: 4,
            averageProjectDuration: 3.2,
            portfolioViews: 1247
          },
          trends: {
            popularStyles: ["Minimalist design", "Bold typography", "Natural photography"],
            seasonalDemand: "Wedding season peaks in spring/summer",
            growingServices: ["Social media content", "Video production", "Brand strategy"]
          }
        };

      default:
        return {
          overview: {},
          serviceBreakdown: [],
          clientAnalytics: {},
          trends: {}
        };
    }
  };

  const metrics = getIndustryMetrics();

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-5 w-5 text-pink-600" />;
      case 'trades': return <Wrench className="h-5 w-5 text-orange-600" />;
      case 'wellness': return <Heart className="h-5 w-5 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-5 w-5 text-amber-600" />;
      case 'creative': return <Palette className="h-5 w-5 text-purple-600" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getIndustryColor = (opacity = 1) => {
    switch (selectedIndustry.id) {
      case 'beauty': return `rgba(236, 72, 153, ${opacity})`;
      case 'trades': return `rgba(251, 146, 60, ${opacity})`;
      case 'wellness': return `rgba(34, 197, 94, ${opacity})`;
      case 'pet-care': return `rgba(245, 158, 11, ${opacity})`;
      case 'creative': return `rgba(147, 51, 234, ${opacity})`;
      default: return `rgba(59, 130, 246, ${opacity})`;
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: `${selectedIndustry.name} analytics report downloaded as PDF`
    });
  };

  const renderOverviewMetrics = () => {
    const overview = metrics.overview;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              ${overview.totalRevenue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">This {timeframe}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">
                {selectedIndustry.id === 'pet-care' ? 'Pets' : 
                 selectedIndustry.id === 'trades' ? 'Jobs' : 
                 selectedIndustry.id === 'creative' ? 'Projects' :
                 selectedIndustry.id === 'wellness' ? 'Sessions' : 'Clients'}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              {overview.clientCount || overview.jobCount || overview.sessionCount || overview.petCount || overview.projectCount || '0'}
            </div>
            <p className="text-xs text-muted-foreground">This {timeframe}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">Avg Value</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              ${overview.averageServiceValue || overview.averageJobValue || overview.averageSessionValue || overview.averageProjectValue || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per service</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">
                {selectedIndustry.id === 'trades' ? 'Completion' : 
                 selectedIndustry.id === 'wellness' ? 'Retention' : 'Rebooking'} Rate
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              {overview.rebookingRate || overview.completionRate || overview.clientRetention || overview.clientSatisfaction || '0'}%
            </div>
            <Progress 
              value={overview.rebookingRate || overview.completionRate || overview.clientRetention || overview.clientSatisfaction || 0} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">
                {selectedIndustry.id === 'beauty' ? 'No-shows' :
                 selectedIndustry.id === 'trades' ? 'Emergency' :
                 selectedIndustry.id === 'wellness' ? 'Package Sales' :
                 selectedIndustry.id === 'pet-care' ? 'New Pets' : 'Referrals'}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              {overview.noShowRate || overview.emergencyCallRate || overview.packageSales || overview.newPetRate || overview.referralRate || '0'}
              {(overview.noShowRate || overview.emergencyCallRate || overview.newPetRate || overview.referralRate) ? '%' : ''}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedIndustry.id === 'wellness' ? 'Active packages' : 'This period'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4" style={{ color: getIndustryColor() }} />
              <span className="text-sm font-medium">
                {selectedIndustry.id === 'beauty' ? 'Product Sales' :
                 selectedIndustry.id === 'trades' ? 'Material Costs' :
                 selectedIndustry.id === 'wellness' ? 'Goals Achieved' :
                 selectedIndustry.id === 'pet-care' ? 'Health Alerts' : 'Revisions'}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
              {overview.productSales ? `$${overview.productSales.toLocaleString()}` :
               overview.materialCosts ? `$${overview.materialCosts.toLocaleString()}` :
               overview.progressGoalsAchieved || overview.healthReminders || overview.revisionRounds || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {(overview.productSales || overview.materialCosts) ? 'Revenue' : 'Total count'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderServiceBreakdown = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Service Performance Breakdown</h3>
        <div className="space-y-3">
          {metrics.serviceBreakdown?.map((service, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{service.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>${service.revenue.toLocaleString()} revenue</span>
                      <span>{service.count} services</span>
                      <span>Avg: ${service.avgPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: getIndustryColor() }}>
                      {Math.round((service.revenue / metrics.overview.totalRevenue) * 100)}%
                    </div>
                    <Progress 
                      value={(service.revenue / metrics.overview.totalRevenue) * 100}
                      className="w-24 h-2 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderClientAnalytics = () => {
    const analytics = metrics.clientAnalytics;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Acquisition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>New {selectedIndustry.id === 'pet-care' ? 'Pets' : selectedIndustry.id === 'trades' ? 'Clients' : 'Clients'}</span>
              <Badge variant="outline">{analytics.newClients || analytics.newPets || '0'}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Returning {selectedIndustry.id === 'pet-care' ? 'Pets' : 'Clients'}</span>
              <Badge variant="outline">{analytics.returningClients || '0'}</Badge>
            </div>
            {analytics.vipClients && (
              <div className="flex justify-between items-center">
                <span>VIP Clients</span>
                <Badge variant="outline">{analytics.vipClients}</Badge>
              </div>
            )}
            {analytics.multiPetFamilies && (
              <div className="flex justify-between items-center">
                <span>Multi-Pet Families</span>
                <Badge variant="outline">{analytics.multiPetFamilies}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.averageVisitFrequency && (
              <div className="flex justify-between items-center">
                <span>Visit Frequency</span>
                <Badge variant="outline">{analytics.averageVisitFrequency} weeks</Badge>
              </div>
            )}
            {analytics.clientLifetimeValue && (
              <div className="flex justify-between items-center">
                <span>Lifetime Value</span>
                <Badge variant="outline">${analytics.clientLifetimeValue}</Badge>
              </div>
            )}
            {analytics.clientSatisfactionScore && (
              <div className="flex justify-between items-center">
                <span>Satisfaction Score</span>
                <Badge variant="outline">{analytics.clientSatisfactionScore}/5.0</Badge>
              </div>
            )}
            {analytics.wellnessScoreImprovement && (
              <div className="flex justify-between items-center">
                <span>Wellness Improvement</span>
                <Badge variant="outline">+{analytics.wellnessScoreImprovement} points</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTrends = () => {
    const trends = metrics.trends;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: getIndustryColor() }} />
              Industry Trends & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedIndustry.id === 'beauty' && (
              <>
                <div>
                  <Label className="font-medium">Peak Service Hours</Label>
                  <p className="text-sm text-muted-foreground">{trends.peakHours?.join(', ')}</p>
                </div>
                <div>
                  <Label className="font-medium">Seasonal Trends</Label>
                  <p className="text-sm text-muted-foreground">{trends.seasonalTrends}</p>
                </div>
                <div>
                  <Label className="font-medium">Most Popular Services</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trends.mostPopularServices?.map((service, i) => (
                      <Badge key={i} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedIndustry.id === 'trades' && (
              <>
                <div>
                  <Label className="font-medium">Busy Seasons</Label>
                  <p className="text-sm text-muted-foreground">{trends.busySeasons?.join(', ')}</p>
                </div>
                <div>
                  <Label className="font-medium">Emergency Patterns</Label>
                  <p className="text-sm text-muted-foreground">{trends.emergencyTrends}</p>
                </div>
                <div>
                  <Label className="font-medium">Growing Service Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trends.growingServices?.map((service, i) => (
                      <Badge key={i} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedIndustry.id === 'wellness' && (
              <>
                <div>
                  <Label className="font-medium">Popular Modalities</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trends.popularModalities?.map((mod, i) => (
                      <Badge key={i} variant="secondary">{mod}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Seasonal Patterns</Label>
                  <p className="text-sm text-muted-foreground">{trends.seasonalPatterns}</p>
                </div>
                <div>
                  <Label className="font-medium">Common Client Goals</Label>
                  <div className="space-y-1 mt-1">
                    {trends.clientGoals?.map((goal, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{goal}</p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIndustryIcon()}
          <div>
            <h2 className="text-2xl font-bold">Industry Analytics</h2>
            <p className="text-muted-foreground">
              Comprehensive reporting for {selectedIndustry.name} businesses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewMetrics()}
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
                    {selectedIndustry.id === 'beauty' ? '+12%' :
                     selectedIndustry.id === 'trades' ? '+8%' :
                     selectedIndustry.id === 'wellness' ? '+15%' :
                     selectedIndustry.id === 'pet-care' ? '+18%' : '+22%'}
                  </div>
                  <p className="text-sm text-muted-foreground">Revenue Growth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
                    {selectedIndustry.id === 'beauty' ? '4.8' :
                     selectedIndustry.id === 'trades' ? '4.9' :
                     selectedIndustry.id === 'wellness' ? '4.7' :
                     selectedIndustry.id === 'pet-care' ? '4.9' : '4.8'}/5
                  </div>
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getIndustryColor() }}>
                    {selectedIndustry.id === 'beauty' ? '78%' :
                     selectedIndustry.id === 'trades' ? '85%' :
                     selectedIndustry.id === 'wellness' ? '82%' :
                     selectedIndustry.id === 'pet-care' ? '89%' : '76%'}
                  </div>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {renderServiceBreakdown()}
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {renderClientAnalytics()}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {renderTrends()}
        </TabsContent>
      </Tabs>
    </div>
  );
}