import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface CheckoutFormProps {
  plan: Plan;
  clientEmail: string;
  onSuccess: () => void;
}

function CheckoutForm({ plan, clientEmail, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/onboarding?success=true`,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Payment successful!",
        description: `Welcome to ${plan.name}! Your account has been activated.`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
        size="lg"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isLoading ? 'Processing...' : `Pay $${plan.price}/month`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get plan and email from URL params or session
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    const email = urlParams.get('email');

    if (planId && email) {
      setClientEmail(email);
      createPaymentIntent(planId, email);
    } else {
      toast({
        title: "Missing information",
        description: "Plan or email not specified. Redirecting...",
        variant: "destructive",
      });
      setLocation('/');
    }
  }, []);

  const createPaymentIntent = async (planId: string, email: string) => {
    try {
      const response = await apiRequest("/api/payments/create-payment-intent", "POST", {
        planId,
        clientEmail: email,
      }) as any;

      setClientSecret(response.clientSecret);
      setSelectedPlan({
        id: planId,
        name: response.planName,
        price: response.amount,
        features: [] // Will be populated from plan data if needed
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Payment setup failed",
        description: "Unable to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    setLocation('/onboarding?success=true');
  };

  if (!clientSecret || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedPlan.name}
                  <Badge className="bg-blue-600 text-white">
                    ${selectedPlan.price}/mo
                  </Badge>
                </CardTitle>
                <CardDescription>
                  You're subscribing to the {selectedPlan.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">7-day free trial</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Full feature access</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Billing Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span>{selectedPlan.name} Plan</span>
                    <span>${selectedPlan.price}/month</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Free trial</span>
                    <span>7 days</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total due today</span>
                    <span>$0.00</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You'll be charged ${selectedPlan.price} after your 7-day trial ends
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Enter your payment details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements options={stripeOptions} stripe={stripePromise}>
                  <CheckoutForm 
                    plan={selectedPlan}
                    clientEmail={clientEmail}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your payment information is secure and encrypted. We use Stripe for payment processing and never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}