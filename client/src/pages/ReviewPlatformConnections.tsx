import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Star, Plus, RefreshCw, ExternalLink, CheckCircle, AlertCircle, 
  Trash2, Settings, TrendingUp, Calendar, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ReviewPlatformConnection, PlatformReview } from "@shared/schema";

const clientId = "client_1"; // This would come from auth context

const connectionSchema = z.object({
  platform: z.enum(["GOOGLE", "YELP", "TRUSTPILOT"]),
  platformAccountId: z.string().min(1, "Account ID is required"),
  apiKey: z.string().optional(),
  accessToken: z.string().optional(),
  platformUrl: z.string().url("Please enter a valid URL").optional(),
  syncFrequency: z.enum(["HOURLY", "DAILY", "WEEKLY"]).default("DAILY"),
});

type ConnectionFormData = z.infer<typeof connectionSchema>;

const platformInfo = {
  GOOGLE: {
    name: "Google Business",
    description: "Connect your Google Business Profile to sync reviews and ratings",
    icon: "🏢",
    color: "bg-blue-500",
    setupInstructions: [
      "Go to your Google Business Profile dashboard",
      "Navigate to Settings > API Access",
      "Generate an API key or access token",
      "Copy your Business Profile ID"
    ]
  },
  YELP: {
    name: "Yelp Business",
    description: "Sync reviews and ratings from your Yelp business listing",
    icon: "🌟", 
    color: "bg-red-500",
    setupInstructions: [
      "Sign up for Yelp Fusion API",
      "Create a new app in Yelp Developers",
      "Copy your API key",
      "Find your business ID from your Yelp page URL"
    ]
  },
  TRUSTPILOT: {
    name: "Trustpilot",
    description: "Connect to Trustpilot to manage your business reviews",
    icon: "⭐",
    color: "bg-green-500",
    setupInstructions: [
      "Access your Trustpilot Business account",
      "Go to Settings > API Access",
      "Generate API credentials",
      "Copy your business unit ID"
    ]
  }
};

export default function ReviewPlatformConnections() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      platform: "GOOGLE",
      platformAccountId: "",
      apiKey: "",
      accessToken: "",
      platformUrl: "",
      syncFrequency: "DAILY",
    },
  });

  // Fetch existing connections
  const { data: connections, isLoading } = useQuery({
    queryKey: [`/api/clients/${clientId}/review-connections`],
  });

  // Fetch platform reviews for overview
  const { data: reviews } = useQuery({
    queryKey: [`/api/clients/${clientId}/platform-reviews`],
  });

  // Type-safe data access
  const connectionsArray = Array.isArray(connections) ? connections as ReviewPlatformConnection[] : [];
  const reviewsArray = Array.isArray(reviews) ? reviews as PlatformReview[] : [];

  // Create connection mutation
  const createConnectionMutation = useMutation({
    mutationFn: async (data: ConnectionFormData) => {
      return apiRequest(`/api/clients/${clientId}/review-connections`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/review-connections`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/platform-reviews`] });
      toast({
        title: "Connection Created",
        description: "Review platform connected successfully!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to review platform. Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  // Sync data mutation
  const syncMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      return apiRequest(`/api/clients/${clientId}/review-connections/${connectionId}/sync`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/review-connections`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/platform-reviews`] });
      toast({
        title: "Data Synced",
        description: "Review data has been updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync review data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete connection mutation
  const deleteConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      return apiRequest(`/api/clients/${clientId}/review-connections/${connectionId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/review-connections`] });
      toast({
        title: "Connection Removed",
        description: "Review platform connection has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to remove connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ConnectionFormData) => {
    createConnectionMutation.mutate(data);
  };

  const connectedPlatforms = connectionsArray.map(c => c.platform);
  const availablePlatforms = Object.keys(platformInfo).filter(
    platform => !connectedPlatforms.includes(platform)
  );

  const totalReviews = reviewsArray.length;
  const averageRating = reviewsArray.length > 0 
    ? reviewsArray.reduce((sum, review) => sum + review.rating, 0) / reviewsArray.length 
    : 0;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="title-review-platforms">
            Review Platform Connections
          </h1>
          <p className="text-gray-600">
            Connect your review platforms to sync ratings and manage customer feedback
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2" 
              data-testid="button-add-connection"
              disabled={availablePlatforms.length === 0}
            >
              <Plus className="h-4 w-4" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Review Platform</DialogTitle>
              <DialogDescription>
                Add a new review platform connection to sync your ratings and reviews.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedPlatform(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePlatforms.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platformInfo[platform as keyof typeof platformInfo]?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platformAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account/Business ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your business account ID" 
                          {...field} 
                          data-testid="input-account-id"
                        />
                      </FormControl>
                      <FormDescription>
                        The unique identifier for your business on this platform
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key (if required)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your API key" 
                          type="password" 
                          {...field} 
                          data-testid="input-api-key"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platformUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform URL (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://..." 
                          {...field} 
                          data-testid="input-platform-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Direct link to your business listing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="syncFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sync Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sync-frequency">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HOURLY">Every Hour</SelectItem>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createConnectionMutation.isPending}
                    data-testid="button-connect"
                  >
                    {createConnectionMutation.isPending ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Platforms</p>
                <p className="text-2xl font-bold" data-testid="stat-connected-platforms">
                  {connectionsArray.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold" data-testid="stat-average-rating">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold" data-testid="stat-total-reviews">
                  {totalReviews}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Platforms */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Connections</h2>
        
        {connectionsArray.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Connections Yet</h3>
              <p className="text-gray-600 mb-4">
                Connect your review platforms to start syncing ratings and managing reviews.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
                data-testid="button-get-started"
              >
                <Plus className="h-4 w-4" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectionsArray.map((connection) => {
              const info = platformInfo[connection.platform as keyof typeof platformInfo];
              return (
                <Card key={connection.id} data-testid={`card-connection-${connection.platform.toLowerCase()}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${info?.color} flex items-center justify-center text-white text-lg`}>
                          {info?.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{info?.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {connection.isActive ? "Active" : "Inactive"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={connection.isActive ? "default" : "secondary"}
                        className={connection.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {connection.isActive ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {connection.isActive ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Rating</p>
                        <p className="font-semibold" data-testid={`rating-${connection.platform.toLowerCase()}`}>
                          {connection.averageRating ? connection.averageRating.toFixed(1) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reviews</p>
                        <p className="font-semibold" data-testid={`reviews-${connection.platform.toLowerCase()}`}>
                          {connection.totalReviews || 0}
                        </p>
                      </div>
                    </div>

                    {connection.lastSyncAt && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last synced: {new Date(connection.lastSyncAt).toLocaleDateString()}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncMutation.mutate(connection.id)}
                        disabled={syncMutation.isPending}
                        className="flex-1"
                        data-testid={`button-sync-${connection.platform.toLowerCase()}`}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                      
                      {connection.platformUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          data-testid={`button-view-${connection.platform.toLowerCase()}`}
                        >
                          <a href={connection.platformUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteConnectionMutation.mutate(connection.id)}
                        disabled={deleteConnectionMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-${connection.platform.toLowerCase()}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      {availablePlatforms.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Platforms</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availablePlatforms.map((platform) => {
              const info = platformInfo[platform as keyof typeof platformInfo];
              return (
                <Card key={platform} className="border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${info?.color} flex items-center justify-center text-white text-lg opacity-60`}>
                        {info?.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{info?.name}</CardTitle>
                        <CardDescription className="text-xs">
                          Not connected
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{info?.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        form.setValue("platform", platform as any);
                        setIsDialogOpen(true);
                      }}
                      className="w-full"
                      data-testid={`button-connect-${platform.toLowerCase()}`}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}