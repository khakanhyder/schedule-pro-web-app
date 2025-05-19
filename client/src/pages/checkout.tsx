import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : 
  Promise.resolve(null);

const CheckoutForm = ({ amount, appointmentId, clientName }: { amount: number, appointmentId: number, clientName: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [location, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
        payment_intent_data: {
          metadata: {
            appointmentId: appointmentId.toString(),
            clientName
          }
        }
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setProcessing(false);
    } else {
      // Success is handled by the return_url redirect
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setLocation('/dashboard')} type="button">
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          disabled={!stripe || processing}
          className="bg-primary hover:bg-secondary text-white"
        >
          {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Parse query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const amount = parseFloat(params.get('amount') || '0');
  const appointmentId = parseInt(params.get('appointmentId') || '0');
  const clientName = params.get('clientName') || 'Customer';

  useEffect(() => {
    if (!amount || amount <= 0) {
      setError("Invalid payment amount.");
      setLoading(false);
      return;
    }
    
    if (!appointmentId) {
      setError("Missing appointment information.");
      setLoading(false);
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount, 
          appointmentId,
          clientName
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || "Something went wrong with payment setup.");
        }
        
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment.");
        toast({
          title: "Payment Setup Failed",
          description: err.message || "There was a problem setting up the payment.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, appointmentId, clientName, toast]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-md">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>We encountered a problem with your payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-destructive mb-4">
                {error}
              </div>
              <p className="text-muted-foreground">
                Please try again or contact support if the issue persists.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle>Payment Setup</CardTitle>
              <CardDescription>Waiting for payment system to initialize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b5ac2',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
      },
    },
  };

  return (
    <div className="min-h-screen py-16 bg-neutral">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>Secure Payment</CardTitle>
            <CardDescription>Complete your payment for {clientName}'s appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg font-semibold">Amount: ${amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Appointment ID: #{appointmentId}</p>
            </div>
            
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm amount={amount} appointmentId={appointmentId} clientName={clientName} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}