import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Load Stripe outside component to avoid recreating on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// SECURE: Remove amount prop - server calculates all amounts
interface CheckoutFormProps {
  clientId: string;
  serviceId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  tipPercentage?: number;
  onSuccess: (appointment: any, payment: any) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ 
  clientId,
  serviceId,
  customerEmail, 
  customerName,
  customerPhone,
  appointmentDate,
  startTime,
  endTime,
  notes,
  tipPercentage,
  onSuccess, 
  onError 
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // SECURE: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
          receipt_email: customerEmail,
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // SECURE: Confirm booking with server using secure endpoint
        const response = await apiRequest('/api/bookings/confirm', 'POST', {
          paymentIntentId: paymentIntent.id,
          customerName,
          customerEmail,
          customerPhone,
          appointmentDate,
          startTime,
          endTime,
          notes
        });

        if (response.success) {
          onSuccess(response.appointment, response.payment);
          toast({
            title: "Payment Successful",
            description: "Your appointment is confirmed!",
          });
        } else {
          throw new Error('Failed to confirm booking');
        }
      }
    } catch (err: any) {
      onError(err.message || 'An unexpected error occurred');
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Secure Payment</CardTitle>
        </div>
        <CardDescription>
          Complete your payment for ${amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{customerEmail}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground">
                  <span>Total:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <PaymentElement 
                options={{
                  layout: 'tabs'
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by Stripe</span>
            <Lock className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || isProcessing}
            data-testid="button-pay-now"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// SECURE: No amount prop - server calculates all amounts
interface StripeCheckoutProps {
  clientId: string;
  serviceId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  tipPercentage?: number;
  onSuccess: (appointment: any, payment: any) => void;
  onError: (error: string) => void;
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // SECURE: Create PaymentIntent with server-side amount calculation
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('/api/bookings/payment-intent', 'POST', {
          clientId: props.clientId,
          serviceId: props.serviceId,
          tipPercentage: props.tipPercentage,
          customerEmail: props.customerEmail,
          customerName: props.customerName
        });

        if (!response.clientSecret) {
          throw new Error('Failed to create payment intent');
        }

        setClientSecret(response.clientSecret);
      } catch (error: any) {
        props.onError(error.message || 'Failed to initialize payment');
        toast({
          title: "Payment Setup Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [props.clientId, props.serviceId, props.tipPercentage, props.customerEmail, props.customerName]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Setting up secure payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-destructive">
            Unable to initialize payment. Please refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
    },
  };

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
}