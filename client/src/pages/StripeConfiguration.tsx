import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Link as LinkIcon, 
  Shield, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Key,
  DollarSign
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// SECURE: Only public key allowed - secret keys handled server-side only
const stripeConfigSchema = z.object({
  stripePublicKey: z.string().min(1, "Stripe public key is required").refine((val) => val.startsWith('pk_'), {
    message: "Must be a valid Stripe public key (starts with pk_)"
  }),
  // SECURITY: stripeSecretKey removed - managed securely server-side only
});

type StripeConfigValues = z.infer<typeof stripeConfigSchema>;

interface StripeStatus {
  isConfigured: boolean;
  hasValidKeys: boolean;
  accountId?: string;
  businessProfile?: {
    name: string;
    support_email: string;
    country: string;
  };
  capabilities?: {
    card_payments: string;
    transfers: string;
  };
}

export default function StripeConfiguration() {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current Stripe configuration
  const { data: stripeStatus, isLoading: statusLoading } = useQuery<StripeStatus>({
    queryKey: ['/api/client/client_1/stripe-status'],
  });

  const form = useForm<StripeConfigValues>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      stripePublicKey: '',
      // SECURITY: stripeSecretKey removed - handled server-side only
    },
  });

  // Save Stripe configuration
  const saveConfigMutation = useMutation({
    mutationFn: async (data: StripeConfigValues) => {
      const response = await apiRequest('POST', '/api/client/client_1/stripe-config', data);
      if (!response.ok) {
        throw new Error('Failed to save Stripe configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Stripe Configuration Saved",
        description: "Your Stripe keys have been securely stored and verified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/client/client_1/stripe-status'] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to save Stripe configuration",
        variant: "destructive",
      });
    },
  });

  // Test Stripe connection
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/client/client_1/stripe-test');
      if (!response.ok) {
        throw new Error('Failed to test Stripe connection');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Successful",
        description: `Connected to Stripe account: ${data.accountId}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/client/client_1/stripe-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Stripe",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StripeConfigValues) => {
    saveConfigMutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stripe Configuration</h1>
          <p className="text-muted-foreground">
            Configure your Stripe account to accept online payments
          </p>
        </div>
        <Badge 
          variant={stripeStatus?.isConfigured ? "default" : "secondary"}
          className={stripeStatus?.isConfigured ? "bg-green-100 text-green-800" : ""}
        >
          {stripeStatus?.isConfigured ? "Configured" : "Not Configured"}
        </Badge>
      </div>

      {/* Status Overview */}
      {stripeStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stripeStatus.isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CreditCard className={`h-5 w-5 ${stripeStatus.isConfigured ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-medium">API Keys</p>
                  <p className="text-sm text-muted-foreground">
                    {stripeStatus.isConfigured ? 'Configured' : 'Missing'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stripeStatus.hasValidKeys ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Shield className={`h-5 w-5 ${stripeStatus.hasValidKeys ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-medium">Validation</p>
                  <p className="text-sm text-muted-foreground">
                    {stripeStatus.hasValidKeys ? 'Valid' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stripeStatus.capabilities?.card_payments === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <DollarSign className={`h-5 w-5 ${stripeStatus.capabilities?.card_payments === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-medium">Payments</p>
                  <p className="text-sm text-muted-foreground">
                    {stripeStatus.capabilities?.card_payments === 'active' ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="help">Help & Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>API Keys Configuration</span>
              </CardTitle>
              <CardDescription>
                Enter your Stripe API keys to enable payment processing. Your keys are encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="stripePublicKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Public Key</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="pk_test_..." 
                            data-testid="input-stripe-public-key"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SECURITY: Secret key field completely removed - handled server-side only */}
                  <Alert className="border-amber-200 bg-amber-50">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <div className="space-y-2">
                        <p className="font-medium">🔒 Secure Secret Key Handling</p>
                        <p className="text-sm">
                          Your Stripe secret keys are managed securely server-side and never exposed to the frontend for maximum security. 
                          Only your public key is needed here.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="flex space-x-3">
                    <Button 
                      type="submit" 
                      disabled={saveConfigMutation.isPending}
                      data-testid="button-save-stripe-config"
                    >
                      {saveConfigMutation.isPending ? "Saving..." : "Save Configuration"}
                    </Button>
                    
                    {stripeStatus?.isConfigured && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => testConnectionMutation.mutate()}
                        disabled={testConnectionMutation.isPending}
                        data-testid="button-test-stripe-connection"
                      >
                        {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          {stripeStatus?.businessProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your Stripe account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                    <p className="font-medium">{stripeStatus.businessProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Support Email</p>
                    <p className="font-medium">{stripeStatus.businessProfile.support_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p className="font-medium">{stripeStatus.businessProfile.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                    <p className="font-mono text-sm">{stripeStatus.accountId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stripeStatus?.capabilities && (
            <Card>
              <CardHeader>
                <CardTitle>Account Capabilities</CardTitle>
                <CardDescription>Available features for your Stripe account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Card Payments</span>
                    <Badge variant={stripeStatus.capabilities.card_payments === 'active' ? 'default' : 'secondary'}>
                      {stripeStatus.capabilities.card_payments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Transfers</span>
                    <Badge variant={stripeStatus.capabilities.transfers === 'active' ? 'default' : 'secondary'}>
                      {stripeStatus.capabilities.transfers}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Your Stripe API Keys</CardTitle>
              <CardDescription>Follow these steps to find your Stripe API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Go to your Stripe Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      Visit <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                        dashboard.stripe.com/apikeys <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Copy your Publishable key</p>
                    <p className="text-sm text-muted-foreground">
                      This starts with <code className="bg-muted px-1 py-0.5 rounded text-xs">pk_test_</code> for test mode or <code className="bg-muted px-1 py-0.5 rounded text-xs">pk_live_</code> for live mode
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Reveal and copy your Secret key</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Reveal live key" or use the test key. This starts with <code className="bg-muted px-1 py-0.5 rounded text-xs">sk_test_</code> or <code className="bg-muted px-1 py-0.5 rounded text-xs">sk_live_</code>
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> Never share your secret key or store it in client-side code. 
                  We encrypt and securely store your keys on our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>After configuring Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Configure service pricing for online payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Test payment flow with test cards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Set up webhooks for payment notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Go live when ready to accept real payments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}