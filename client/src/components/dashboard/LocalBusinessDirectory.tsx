import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIndustry } from "@/lib/industryContext";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  ExternalLink,
  Users,
  Heart,
  Building,
  UserPlus,
  Target,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

interface LocalBusiness {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  specialties: string[];
  partnershipPotential: "high" | "medium" | "low";
  status: "prospect" | "contacted" | "partner" | "inactive";
  notes: string;
  lastContact?: string;
  referralsSent: number;
  referralsReceived: number;
}

interface IndustryTarget {
  type: string;
  description: string;
  partnershipValue: string;
  approachStrategy: string;
  examples: string[];
}

export default function LocalBusinessDirectory() {
  const { selectedIndustry } = useIndustry();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get industry-specific partnership targets
  const getPartnershipTargets = (): IndustryTarget[] => {
    switch (selectedIndustry?.id) {
      case 'home_services':
        return [
          {
            type: 'Real Estate Agents',
            description: 'Agents with new homeowner clients who need contractors',
            partnershipValue: 'Very High',
            approachStrategy: 'Offer free estimates for their clients + commission per referral',
            examples: ['Kitchen remodels for new homes', 'Bathroom renovations', 'Electrical upgrades']
          },
          {
            type: 'Property Management Companies',
            description: 'Manage multiple properties needing regular maintenance',
            partnershipValue: 'High',
            approachStrategy: 'Volume pricing + priority service guarantees',
            examples: ['Plumbing repairs', 'Appliance installation', 'Emergency services']
          },
          {
            type: 'Interior Designers',
            description: 'Need contractors for client projects',
            partnershipValue: 'High',
            approachStrategy: 'Collaborative partnerships + design consultation',
            examples: ['Custom built-ins', 'Kitchen renovations', 'Bathroom remodels']
          }
        ];
      case 'pet_care':
        return [
          {
            type: 'Veterinary Clinics',
            description: 'Vets recommend grooming and pet sitting services',
            partnershipValue: 'Very High',
            approachStrategy: 'Professional referral program + emergency pet care partnership',
            examples: ['Post-surgery grooming', 'Boarding during treatment', 'Senior pet care']
          },
          {
            type: 'Pet Stores',
            description: 'Customers need grooming and pet services',
            partnershipValue: 'Medium',
            approachStrategy: 'Flyer placement + customer referral discounts',
            examples: ['New pet owner services', 'Grooming packages', 'Training programs']
          },
          {
            type: 'Dog Parks & Trainers',
            description: 'Pet owners gathering places and training needs',
            partnershipValue: 'Medium',
            approachStrategy: 'Cross-referral agreements + joint service packages',
            examples: ['Training + grooming packages', 'Socialization + boarding', 'Behavior + care']
          }
        ];
      case 'beauty':
        return [
          {
            type: 'Wedding Venues',
            description: 'Brides need hair and makeup services',
            partnershipValue: 'Very High',
            approachStrategy: 'Preferred vendor status + venue commission',
            examples: ['Bridal packages', 'Wedding party services', 'Trial sessions']
          },
          {
            type: 'Photography Studios',
            description: 'Clients need hair/makeup for photoshoots',
            partnershipValue: 'High',
            approachStrategy: 'Package deals + cross-promotion',
            examples: ['Portrait sessions', 'Family photos', 'Professional headshots']
          },
          {
            type: 'Event Planners',
            description: 'Events need beauty services for attendees',
            partnershipValue: 'High',
            approachStrategy: 'Event partnerships + group rates',
            examples: ['Corporate events', 'Special occasions', 'Fashion shows']
          }
        ];
      case 'wellness':
        return [
          {
            type: 'Medical Practices',
            description: 'Doctors recommend wellness and recovery services',
            partnershipValue: 'Very High',
            approachStrategy: 'Medical referral partnerships + therapy collaboration',
            examples: ['Physical therapy support', 'Stress relief', 'Recovery massage']
          },
          {
            type: 'Fitness Centers',
            description: 'Athletes need recovery and wellness services',
            partnershipValue: 'High',
            approachStrategy: 'Member discounts + on-site services',
            examples: ['Sports massage', 'Recovery therapy', 'Stress management']
          },
          {
            type: 'Chiropractors',
            description: 'Complementary therapeutic services',
            partnershipValue: 'High',
            approachStrategy: 'Treatment partnerships + referral exchange',
            examples: ['Massage therapy', 'Pain relief', 'Wellness packages']
          }
        ];
      default:
        return [
          {
            type: 'Complementary Businesses',
            description: 'Businesses serving similar customer base',
            partnershipValue: 'High',
            approachStrategy: 'Cross-referral agreements + joint marketing',
            examples: ['Related services', 'Customer overlap', 'Mutual benefits']
          }
        ];
    }
  };

  // Mock local business data - in real app this would come from local business APIs
  const localBusinesses: LocalBusiness[] = [
    {
      id: '1',
      name: 'Elite Real Estate Group',
      type: 'Real Estate Agency',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      email: 'sarah@eliterealestate.com',
      website: 'www.eliterealestate.com',
      specialties: ['Luxury Homes', 'New Construction', 'Investment Properties'],
      partnershipPotential: 'high',
      status: 'prospect',
      notes: 'Owner Sarah mentioned needing reliable contractors for client referrals',
      referralsSent: 0,
      referralsReceived: 0
    },
    {
      id: '2',
      name: 'Happy Paws Veterinary',
      type: 'Veterinary Clinic',
      address: '456 Oak Ave, Midtown',
      phone: '(555) 234-5678',
      email: 'info@happypaws.com',
      website: 'www.happypaws.com',
      specialties: ['General Practice', 'Emergency Care', 'Surgery'],
      partnershipPotential: 'high',
      status: 'contacted',
      notes: 'Dr. Johnson interested in referring grooming services to clients',
      lastContact: '2025-01-15',
      referralsSent: 2,
      referralsReceived: 5
    },
    {
      id: '3',
      name: 'Bella Vista Wedding Venue',
      type: 'Wedding Venue',
      address: '789 Garden Lane, Suburbs',
      phone: '(555) 345-6789',
      email: 'events@bellavista.com',
      specialties: ['Outdoor Weddings', 'Corporate Events', 'Receptions'],
      partnershipPotential: 'high',
      status: 'partner',
      notes: 'Preferred vendor for hair and makeup services. 15% commission on bookings.',
      lastContact: '2025-01-20',
      referralsSent: 8,
      referralsReceived: 12
    }
  ];

  const filteredBusinesses = localBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || business.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === 'all' || business.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'partner': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Local Business Directory</h2>
          <p className="text-gray-600">
            Build strategic partnerships with complementary businesses in your area
          </p>
        </div>
        <Button style={{ backgroundColor: selectedIndustry?.primaryColor }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      {/* Partnership Strategy Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Strategic Partnership Targets for {selectedIndustry?.name}
          </CardTitle>
          <CardDescription>
            Focus on these high-value partnership opportunities in your local market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {getPartnershipTargets().map((target, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{target.type}</h3>
                  <Badge className="bg-green-100 text-green-800">{target.partnershipValue} Value</Badge>
                </div>
                <p className="text-gray-600 mb-3">{target.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Approach Strategy:</p>
                    <p className="text-sm text-gray-600">{target.approachStrategy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                    <ul className="text-sm text-gray-600">
                      {target.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Business Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="real estate">Real Estate</SelectItem>
            <SelectItem value="veterinary">Veterinary</SelectItem>
            <SelectItem value="wedding">Wedding Services</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Directory */}
      <div className="grid gap-4">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{business.type}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPotentialColor(business.partnershipPotential)}>
                    {business.partnershipPotential} potential
                  </Badge>
                  <Badge className={getStatusColor(business.status)}>
                    {business.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{business.email}</span>
                  </div>
                  {business.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {business.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {business.status === 'partner' && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-lg font-bold text-blue-600">{business.referralsSent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Received</p>
                      <p className="text-lg font-bold text-green-600">{business.referralsReceived}</p>
                    </div>
                  </div>
                )}
              </div>

              {business.notes && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm">{business.notes}</p>
                  {business.lastContact && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last contact: {business.lastContact}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                {business.status === 'partner' && (
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Track Referral
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters, or add a new business to your directory.
            </p>
            <Button style={{ backgroundColor: selectedIndustry?.primaryColor }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Business
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}