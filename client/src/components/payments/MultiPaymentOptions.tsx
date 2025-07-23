import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Copy, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentOptionsProps {
  amount: number;
  description: string;
  clientName: string;
  clientEmail?: string;
  estimateId?: number;
  onPaymentComplete?: (method: string, details: any) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  type: 'instant' | 'manual' | 'link';
  description: string;
  processingTime: string;
  fees: string;
}

export default function MultiPaymentOptions({ 
  amount, 
  description, 
  clientName, 
  clientEmail, 
  estimateId,
  onPaymentComplete 
}: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      type: 'instant',
      description: 'Visa, Mastercard, American Express, Discover',
      processingTime: 'Instant',
      fees: '2.9% + $0.30'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: DollarSign,
      type: 'link',
      description: 'Pay with PayPal account or guest checkout',
      processingTime: 'Instant',
      fees: '2.9% + $0.30'
    },
    {
      id: 'zelle',
      name: 'Zelle',
      icon: Smartphone,
      type: 'manual',
      description: 'Bank-to-bank transfer (US banks only)',
      processingTime: 'Minutes',
      fees: 'No fees'
    },
    {
      id: 'venmo',
      name: 'Venmo',
      icon: Smartphone,
      type: 'manual',
      description: 'Popular peer-to-peer payment app',
      processingTime: '1-3 business days',
      fees: 'No fees (standard transfer)'
    }
  ];

  // Generate payment instructions for manual methods
  const generatePaymentInstructions = (method: string) => {
    // These would be configurable in your business settings
    const businessInfo = {
      businessName: 'Your Business Name', // Configure in Settings
      zelleEmail: 'your-business@email.com', // Your Zelle-enabled business email
      zellePhone: '(555) 123-4567', // Your Zelle-enabled business phone
      venmoHandle: '@YourBusinessVenmo' // Your business Venmo handle
    };

    switch (method) {
      case 'zelle':
        return {
          instructions: [
            'Open your bank\'s mobile app',
            'Select "Send Money with Zelle"',
            `Enter email: ${businessInfo.zelleEmail}`,
            `Enter amount: $${amount.toFixed(2)}`,
            `Add memo: "${description} - ${clientName}"`
          ],
          paymentDetails: {
            email: businessInfo.zelleEmail,
            phone: businessInfo.zellePhone,
            memo: `${description} - ${clientName}`
          }
        };
      
      case 'venmo':
        return {
          instructions: [
            'Open the Venmo app',
            'Tap "Pay or Request"',
            `Search for: ${businessInfo.venmoHandle}`,
            `Enter amount: $${amount.toFixed(2)}`,
            `Add note: "${description} - ${clientName}"`
          ],
          paymentDetails: {
            handle: businessInfo.venmoHandle,
            note: `${description} - ${clientName}`
          }
        };
      
      default:
        return null;
    }
  };

  // Handle Stripe payment
  const handleStripePayment = async () => {
    setPaymentStatus('processing');
    try {
      // Redirect to our existing Stripe checkout
      const checkoutUrl = `/checkout?amount=${amount}&description=${encodeURIComponent(description)}&client=${encodeURIComponent(clientName)}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: "Failed to initialize card payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle PayPal payment
  const handlePayPalPayment = async () => {
    setPaymentStatus('processing');
    try {
      // This would integrate with our PayPal system
      const paypalUrl = `/paypal-checkout?amount=${amount}&description=${encodeURIComponent(description)}&client=${encodeURIComponent(clientName)}`;
      window.open(paypalUrl, '_blank');
      
      toast({
        title: "PayPal Payment",
        description: "PayPal checkout opened in new window"
      });
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: "Failed to initialize PayPal payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle manual payment methods
  const handleManualPayment = (method: string) => {
    const instructions = generatePaymentInstructions(method);
    if (instructions) {
      setPaymentDetails(instructions);
      setSelectedMethod(method);
      setPaymentStatus('pending');
    }
  };

  // Copy payment details to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Payment details copied to clipboard"
    });
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const instructions = paymentDetails || generatePaymentInstructions(selectedMethod);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Client</Label>
              <p className="font-semibold">{clientName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Amount</Label>
              <p className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-sm text-gray-600">Description</Label>
              <p>{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card 
                  key={method.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="w-6 h-6 mt-1 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{method.name}</h3>
                          <Badge variant={method.type === 'instant' ? 'default' : 'outline'}>
                            {method.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>⏱️ {method.processingTime}</span>
                          <span>💰 {method.fees}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Action */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMethod === 'stripe' && (
            <div className="space-y-4">
              <p className="text-gray-600">Secure credit card processing powered by Stripe</p>
              <Button 
                onClick={handleStripePayment}
                disabled={paymentStatus === 'processing'}
                className="w-full"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {paymentStatus === 'processing' ? 'Processing...' : `Pay $${amount.toFixed(2)} with Card`}
              </Button>
            </div>
          )}

          {selectedMethod === 'paypal' && (
            <div className="space-y-4">
              <p className="text-gray-600">Pay securely with your PayPal account</p>
              <Button 
                onClick={handlePayPalPayment}
                disabled={paymentStatus === 'processing'}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {paymentStatus === 'processing' ? 'Processing...' : `Pay $${amount.toFixed(2)} with PayPal`}
              </Button>
            </div>
          )}

          {(selectedMethod === 'zelle' || selectedMethod === 'venmo') && instructions && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Payment Instructions
                </h4>
                <ol className="space-y-2">
                  {instructions.instructions.map((step: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Quick Copy Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">Quick Copy Details:</h4>
                {selectedMethod === 'zelle' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Email:</Label>
                      <Input 
                        value={instructions.paymentDetails.email} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(instructions.paymentDetails.email)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Amount:</Label>
                      <Input 
                        value={`$${amount.toFixed(2)}`} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(`$${amount.toFixed(2)}`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Memo:</Label>
                      <Input 
                        value={instructions.paymentDetails.memo} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(instructions.paymentDetails.memo)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'venmo' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Handle:</Label>
                      <Input 
                        value={instructions.paymentDetails.handle} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(instructions.paymentDetails.handle)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Amount:</Label>
                      <Input 
                        value={`$${amount.toFixed(2)}`} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(`$${amount.toFixed(2)}`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Note:</Label>
                      <Input 
                        value={instructions.paymentDetails.note} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(instructions.paymentDetails.note)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Payment Confirmation */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Awaiting Payment Confirmation</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Once you've sent the payment, it may take {selectedMethodData?.processingTime.toLowerCase()} to process. 
                      You'll receive a confirmation email when payment is received.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Status */}
      {paymentStatus !== 'pending' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {paymentStatus === 'processing' && (
                <>
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600">Processing payment...</span>
                </>
              )}
              {paymentStatus === 'completed' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Payment completed successfully!</span>
                </>
              )}
              {paymentStatus === 'failed' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Payment failed. Please try again.</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}