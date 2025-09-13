import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MapPin, Star, Camera, Globe, CheckCircle, AlertCircle, 
  ExternalLink, Upload, Clock, Phone, Mail, Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GoogleBusinessProfile } from "@shared/schema";

const clientId = "client_1"; // This would come from auth context

const businessProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessDescription: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  website: z.preprocess((val) => val === '' ? undefined : val, z.string().url("Please enter a valid website URL").optional()),
  businessCategories: z.array(z.string()).min(1, "Select at least one category"),
  businessHours: z.string().optional(),
});

const linkProfileSchema = z.object({
  googlePlaceId: z.string().min(10, "Valid Google Place ID is required"),
  businessName: z.string().min(2, "Business name is required for verification"),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
type LinkProfileFormData = z.infer<typeof linkProfileSchema>;

const businessCategories = [
  "Beauty Salon", "Hair Salon", "Nail Salon", "Spa", "Barbershop",
  "Massage Therapist", "Fitness Center", "Personal Trainer", "Yoga Studio",
  "Medical Spa", "Wellness Center", "Skin Care Clinic", "Day Spa", "Boutique"
];

const setupSteps = [
  {
    id: 1,
    title: "Business Information",
    description: "Enter your basic business details",
    completed: false,
  },
  {
    id: 2,
    title: "Verification",
    description: "Verify your business location",
    completed: false,
  },
  {
    id: 3,
    title: "Photos & Content",
    description: "Add photos and optimize your listing",
    completed: false,
  },
  {
    id: 4,
    title: "Reviews Management",
    description: "Set up review monitoring and responses",
    completed: false,
  },
];

const seoTips = [
  {
    icon: MapPin,
    title: "Local SEO Optimization",
    description: "Include location-based keywords in your business description",
    status: "pending",
  },
  {
    icon: Star,
    title: "Encourage Reviews",
    description: "Ask satisfied customers to leave Google reviews",
    status: "pending",
  },
  {
    icon: Camera,
    title: "Upload Quality Photos",
    description: "Add high-quality photos of your services and location",
    status: "pending",
  },
  {
    icon: Clock,
    title: "Keep Hours Updated",
    description: "Ensure your business hours are accurate and current",
    status: "pending",
  },
];

export default function GoogleBusinessSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [setupMode, setSetupMode] = useState<'choice' | 'create' | 'link'>('choice');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: "",
      businessDescription: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      website: "",
      businessCategories: [],
      businessHours: "",
    },
  });

  const linkForm = useForm<LinkProfileFormData>({
    resolver: zodResolver(linkProfileSchema),
    defaultValues: {
      googlePlaceId: "",
      businessName: "",
    },
  });

  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['/api/clients', clientId, 'google-business'],
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: BusinessProfileFormData) => {
      return apiRequest(`/api/clients/${clientId}/google-business`, "POST", { ...data, clientId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'google-business'] });
      toast({
        title: "Business Profile Created",
        description: "Your Google Business profile has been set up successfully.",
      });
      setCurrentStep(2);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create business profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const linkProfileMutation = useMutation({
    mutationFn: async (data: LinkProfileFormData) => {
      return apiRequest(`/api/clients/${clientId}/google-business`, "POST", { 
        ...data, 
        clientId,
        isLinkedProfile: true 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'google-business'] });
      toast({
        title: "Profile Linked Successfully",
        description: "Your existing Google Business profile has been linked.",
      });
      setCurrentStep(2);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to link existing profile. Please check the Place ID and try again.",
        variant: "destructive",
      });
    },
  });

  const syncProfileMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/google-business/${clientId}/sync`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId, 'google-business'] });
      toast({
        title: "Profile Synced",
        description: "Your Google Business profile has been updated.",
      });
    },
  });

  const handleSubmit = (data: BusinessProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  const handleLinkSubmit = (data: LinkProfileFormData) => {
    linkProfileMutation.mutate(data);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    form.setValue('businessCategories', newCategories, { shouldValidate: true });
  };

  const getStepStatus = (stepId: number, profile?: GoogleBusinessProfile) => {
    if (!profile) return stepId === 1 ? "current" : "pending";
    
    switch (stepId) {
      case 1: return "completed";
      case 2: return profile.isVerified ? "completed" : profile.googlePlaceId ? "current" : "pending";
      case 3: return profile.businessPhotos && profile.businessPhotos.length > 0 ? "completed" : "pending";
      case 4: return (profile.totalReviews || 0) > 0 ? "completed" : "pending";
      default: return "pending";
    }
  };

  const profile = businessProfile as GoogleBusinessProfile;
  const completedSteps = profile ? [
    profile.businessName ? 1 : 0,
    profile.isVerified ? 1 : 0,
    (profile.businessPhotos && profile.businessPhotos.length > 0) ? 1 : 0,
    ((profile.totalReviews || 0) > 0) ? 1 : 0,
  ].filter(Boolean).length : 0;

  const progressPercentage = (completedSteps / 4) * 100;

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Google Business Profile</h1>
        <p className="text-gray-600">
          Set up and optimize your Google Business listing to attract more local customers
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Setup Progress</CardTitle>
              <CardDescription>Complete all steps to maximize your online visibility</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progressPercentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3 mb-6" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {setupSteps.map((step) => {
              const status = getStepStatus(step.id, businessProfile as GoogleBusinessProfile);
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 ${
                    status === "completed"
                      ? "border-green-200 bg-green-50"
                      : status === "current"
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : status === "current" ? (
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {step.id}
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold">
                        {step.id}
                      </div>
                    )}
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!businessProfile ? (
        /* Setup Choice and Forms */
        <>
          {setupMode === 'choice' && (
            <Card>
              <CardHeader>
                <CardTitle>Google Business Profile Setup</CardTitle>
                <CardDescription>
                  Choose how you want to set up your Google Business Profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Create New Profile Option */}
                  <div
                    onClick={() => setSetupMode('create')}
                    className="p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Create New Profile</h3>
                      <p className="text-gray-600 text-sm">
                        Set up a completely new Google Business Profile for your business
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        Best for new businesses
                      </div>
                    </div>
                  </div>

                  {/* Link Existing Profile Option */}
                  <div
                    onClick={() => setSetupMode('link')}
                    className="p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <ExternalLink className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Link Existing Profile</h3>
                      <p className="text-gray-600 text-sm">
                        Connect your existing Google Business Profile to this platform
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Already have a profile
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500">
                  Don't worry, you can change this later if needed
                </div>
              </CardContent>
            </Card>
          )}

          {setupMode === 'create' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Step 1: Create New Profile</CardTitle>
                    <CardDescription>
                      Enter your business details to create your Google Business profile
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSetupMode('choice')}
                  >
                    ← Back to Options
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business, services, and what makes you unique..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include keywords that customers might search for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourbusiness.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Business Categories</FormLabel>
                      <FormDescription className="mb-3">
                        Select categories that best describe your business
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {businessCategories.map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryToggle(category)}
                            className="justify-start"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
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
                        <Textarea
                          placeholder="Monday-Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List your business hours for each day of the week
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={createProfileMutation.isPending}
                        size="lg"
                      >
                        {createProfileMutation.isPending ? "Creating..." : "Create Business Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {setupMode === 'link' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Step 1: Link Existing Profile</CardTitle>
                    <CardDescription>
                      Connect your existing Google Business Profile to this platform
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSetupMode('choice')}
                  >
                    ← Back to Options
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...linkForm}>
                  <form onSubmit={linkForm.handleSubmit(handleLinkSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={linkForm.control}
                        name="googlePlaceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Place ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ChIJOwE7_GTtwokRFq0uOwLSE9g"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Find your Google Place ID at{' '}
                              <a 
                                href="https://developers.google.com/maps/documentation/places/web-service/place-id" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Google Place ID Finder
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={linkForm.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name (for verification)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your Business Name"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your business name exactly as it appears on Google
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">How to find your Google Place ID:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Search for your business on Google Maps</li>
                        <li>2. Click on your business listing</li>
                        <li>3. Copy the URL from your browser</li>
                        <li>4. The Place ID is in the URL after "place/"</li>
                      </ol>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={linkProfileMutation.isPending}
                        size="lg"
                      >
                        {linkProfileMutation.isPending ? "Linking..." : "Link Existing Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Existing Profile Management */
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{(businessProfile as GoogleBusinessProfile).businessName}</CardTitle>
                  <CardDescription>Google Business Profile</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {(businessProfile as GoogleBusinessProfile).isVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{(businessProfile as GoogleBusinessProfile).address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{(businessProfile as GoogleBusinessProfile).phoneNumber}</span>
              </div>
              {(businessProfile as GoogleBusinessProfile).website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a 
                    href={(businessProfile as GoogleBusinessProfile).website || ""} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-600">
                    <Star className="h-5 w-5 fill-current" />
                    {(businessProfile as GoogleBusinessProfile).averageRating || "0.0"}
                  </div>
                  <div className="text-xs text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {(businessProfile as GoogleBusinessProfile).totalReviews || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Reviews</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => syncProfileMutation.mutate()}
                  disabled={syncProfileMutation.isPending}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {syncProfileMutation.isPending ? "Syncing..." : "Sync Profile"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Google
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Tips</CardTitle>
              <CardDescription>Improve your local search visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {seoTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-full bg-blue-100">
                    <tip.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}