import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Shield,
  Loader2,
  CheckCircle,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

interface SecurePaymentMethodSetupProps {
  clientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Payment form component that uses Stripe Elements
function PaymentMethodForm({ clientId, onSuccess }: { clientId: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const confirmSetupIntentMutation = useMutation({
    mutationFn: async ({ setupIntentId }: { setupIntentId: string }) => {
      const response = await apiRequest(`/api/client/${clientId}/confirm-setup-intent`, 'POST', {
        setupIntentId,
        setAsDefault: true
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/payment-methods`] });
      toast({
        title: 'Payment Method Added',
        description: 'Your payment method has been securely saved.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Setup Failed',
        description: error.message || 'Failed to save payment method.',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: 'Stripe Not Ready',
        description: 'Payment system is still loading. Please wait.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/client-dashboard`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: 'Payment Method Setup Failed',
          description: error.message || 'An error occurred while setting up your payment method.',
          variant: 'destructive'
        });
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        // Payment method setup was successful
        confirmSetupIntentMutation.mutate({ setupIntentId: setupIntent.id });
      }
    } catch (error: any) {
      toast({
        title: 'Setup Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">PCI-Compliant Secure Processing</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Your payment information is processed securely by Stripe and never stored on our servers.
        </p>
      </div>

      {/* Stripe Payment Element - PCI Compliant */}
      <div className="p-4 border rounded-lg bg-white">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card']
          }}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="submit"
          disabled={!stripe || isProcessing || confirmSetupIntentMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
          data-testid="button-save-secure-payment-method"
        >
          {isProcessing || confirmSetupIntentMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Securing Payment Method...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Save Payment Method Securely
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Main component that loads Stripe and provides Elements context
export default function SecurePaymentMethodSetup({ clientId, onSuccess, onCancel }: SecurePaymentMethodSetupProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const createSetupIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/client/${clientId}/setup-intent`, 'POST');
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      
      // Initialize Stripe with public key from response
      if (data.stripePublicKey) {
        setStripePromise(loadStripe(data.stripePublicKey));
      } else {
        throw new Error('Stripe public key not available');
      }
      
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Setup Failed',
        description: error.message || 'Failed to initialize secure payment setup.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  });

  useEffect(() => {
    createSetupIntentMutation.mutate();
  }, []);

  if (isLoading || !stripePromise || !clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span>Initializing secure payment setup...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#16a34a', // Green color
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        borderRadius: '8px'
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment Method
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            PCI Compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={elementsOptions}>
          <PaymentMethodForm clientId={clientId} onSuccess={onSuccess} />
        </Elements>
        
        <div className="flex justify-start mt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            data-testid="button-cancel-payment-setup"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}