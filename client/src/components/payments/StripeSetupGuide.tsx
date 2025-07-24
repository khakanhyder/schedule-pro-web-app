import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ExternalLink, 
  CreditCard, 
  Smartphone,
  Store,
  Settings,
  ArrowRight,
  Info
} from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url?: string;
  instructions: string[];
}

export default function StripeSetupGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'account',
      title: 'Create Stripe Account',
      description: 'Set up your Stripe business account for payment processing',
      completed: false,
      url: 'https://dashboard.stripe.com/register',
      instructions: [
        'Visit Stripe.com and click "Start now"',
        'Enter your business information',
        'Verify your identity and bank account',
        'Complete the onboarding process'
      ]
    },
    {
      id: 'keys',
      title: 'Get API Keys',
      description: 'Copy your publishable and secret keys',
      completed: false,
      url: 'https://dashboard.stripe.com/apikeys',
      instructions: [
        'Log into your Stripe Dashboard',
        'Go to Developers → API keys',
        'Copy your "Publishable key" (pk_...)',
        'Copy your "Secret key" (sk_...)',
        'Add both keys to your Scheduled payment settings'
      ]
    },
    {
      id: 'terminal',
      title: 'Order Terminal Hardware',
      description: 'Choose and order your in-person payment terminal',
      completed: false,
      url: 'https://stripe.com/terminal',
      instructions: [
        'Visit Stripe Terminal page',
        'Choose your terminal (recommended: BBPOS WisePad 3 for $59)',
        'Order and wait for delivery (2-3 business days)',
        'Hardware will arrive pre-configured for your account'
      ]
    },
    {
      id: 'setup',
      title: 'Connect Terminal',
      description: 'Connect your terminal to WiFi and pair with Stripe',
      completed: false,
      instructions: [
        'Unbox your terminal and power it on',
        'Connect to your business WiFi network',
        'Terminal will automatically pair with your Stripe account',
        'Test a small payment to confirm everything works'
      ]
    }
  ]);

  const trackStripeReferral = async (action: string, url?: string) => {
    try {
      // Track referral in analytics
      const referralData = {
        businessName: 'Current User Business', // Will be dynamic when user auth is implemented
        email: 'user@example.com', // Will be dynamic when user auth is implemented
        action,
        timestamp: new Date().toISOString(),
        sourceUrl: url
      };
      
      // Store locally for now (will integrate with backend when users are active)
      const existingReferrals = JSON.parse(localStorage.getItem('stripe_referrals') || '[]');
      existingReferrals.push(referralData);
      localStorage.setItem('stripe_referrals', JSON.stringify(existingReferrals));
      
      console.log('Stripe referral tracked:', action);
    } catch (error) {
      console.log('Referral tracking error (non-critical):', error);
    }
  };

  const markStepComplete = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].completed = true;
    setSteps(newSteps);
    
    // Track completion in analytics
    const step = steps[stepIndex];
    trackStripeReferral(`completed_${step.id}`);
    
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Payment Options for Your Business
          </CardTitle>
          <p className="text-gray-600">
            Choose how you want to accept payments. Online payments work immediately, in-person terminals are optional.
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button
              onClick={() => {
                trackStripeReferral('clicked_main_setup', 'https://dashboard.stripe.com/register');
                window.open('https://dashboard.stripe.com/register', '_blank');
              }}
              className="mr-3"
            >
              Start Stripe Setup
            </Button>
            <Button variant="outline">
              I'll Use Online Payments Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Online Payments - Already Working */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Online Payments (Ready Now!)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-green-700">
                Already working in your "Send Payment Requests" tab:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Credit card payments (Stripe)</li>
                <li>• PayPal payments</li>
                <li>• Zelle transfers (free)</li>
                <li>• Venmo payments (free)</li>
              </ul>
              <div className="p-3 bg-white rounded border">
                <p className="text-xs text-gray-600">
                  <strong>How it works:</strong> Create payment request → Send link to client → They pay with preferred method → Money goes to your accounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In-Person Payments - Optional Setup */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CreditCard className="w-5 h-5" />
              In-Person Payments (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-blue-700">
                Add physical card terminals for checkout:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chip & PIN card readers</li>
                <li>• Contactless/tap payments</li>
                <li>• Apple Pay & Google Pay</li>
                <li>• Built-in tip options (15%, 18%, 20%)</li>
              </ul>
              <div className="p-3 bg-white rounded border">
                <p className="text-xs text-gray-600">
                  <strong>Cost:</strong> $59-$249 for hardware + same 2.9% processing fees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Steps for In-Person Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Want In-Person Card Terminals? Here's How:</CardTitle>
          <p className="text-sm text-gray-600">
            Only follow these steps if you want to accept cards in-person at your location.
          </p>
        </CardHeader>
      </Card>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`
              ${step.completed ? 'bg-green-50 border-green-200' : ''}
              ${index === currentStep && !step.completed ? 'border-blue-300 shadow-md' : ''}
            `}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${step.completed ? 'bg-green-100' : 'bg-gray-100'}
                  `}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                {step.completed && (
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                )}
              </div>
            </CardHeader>
            
            {(index === currentStep || step.completed) && (
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {step.instructions.map((instruction, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-sm text-gray-500 mt-0.5">{i + 1}.</span>
                        <span className="text-sm">{instruction}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {step.url && (
                      <Button
                        onClick={() => {
                          trackStripeReferral(`clicked_${step.id}`, step.url);
                          window.open(step.url, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open {step.title.includes('Account') ? 'Stripe' : step.title.includes('Keys') ? 'API Keys' : 'Terminal Store'}
                      </Button>
                    )}
                    
                    {!step.completed && (
                      <Button
                        variant="outline"
                        onClick={() => markStepComplete(index)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Terminal Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Terminals for Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold">BBPOS WisePad 3</h3>
                <Badge className="text-lg">$59</Badge>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                <li>• Portable and wireless</li>
                <li>• Chip, tap, and mobile wallets</li>
                <li>• Perfect for salons/mobile services</li>
                <li>• 1-day battery life</li>
              </ul>
              <Badge variant="outline" className="w-full justify-center bg-green-50 text-green-700">
                Most Popular for Salons
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl mb-2">🖥️</div>
                <h3 className="font-semibold">Stripe Reader M2</h3>
                <Badge className="text-lg">$249</Badge>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                <li>• All-in-one countertop</li>
                <li>• Built-in receipt printer</li>
                <li>• Large customer screen</li>
                <li>• Ethernet and WiFi</li>
              </ul>
              <Badge variant="outline" className="w-full justify-center">
                Best for High Volume
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl mb-2">💳</div>
                <h3 className="font-semibold">Verifone P400</h3>
                <Badge className="text-lg">$149</Badge>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                <li>• Customer-facing terminal</li>
                <li>• PIN entry and signatures</li>
                <li>• Contactless payments</li>
                <li>• Reliable and durable</li>
              </ul>
              <Badge variant="outline" className="w-full justify-center">
                Great Middle Option
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Setup */}
      {completedSteps === steps.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-green-800 mb-2">Setup Complete!</h2>
            <p className="text-green-700 mb-4">
              Your business can now accept payments both online and in-person through Stripe.
            </p>
            <div className="flex justify-center gap-3">
              <Button className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Test Payment Terminal
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}