import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Zap,
  Nfc,
  Banknote,
  Receipt,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InPersonPaymentProps {
  clientName?: string;
  amount: number;
  onPaymentComplete?: (paymentData: any) => void;
}

export default function InPersonPayments({ clientName, amount, onPaymentComplete }: InPersonPaymentProps) {
  const [paymentAmount, setPaymentAmount] = useState(amount.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const { toast } = useToast();

  const processPayment = async (method: string) => {
    setIsProcessing(true);
    setPaymentMethod(method);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        amount: parseFloat(paymentAmount),
        method,
        timestamp: new Date(),
        clientName: clientName || 'Walk-in Customer',
        status: 'completed'
      };

      toast({
        title: "Payment Successful!",
        description: `${method} payment of $${paymentAmount} completed successfully`
      });

      onPaymentComplete?.(paymentData);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setPaymentMethod('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            In-Person Payment Terminal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name (Optional)</Label>
              <Input
                value={clientName || ''}
                placeholder="Walk-in customer"
                disabled
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Payment Amount
              </Label>
              <Input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="text-2xl font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Payments */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <CreditCard className="w-5 h-5" />
              Card Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Chip & PIN</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Contactless/Tap</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Apple Pay/Google Pay</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => processPayment('Card Payment')}
              disabled={isProcessing}
            >
              {isProcessing && paymentMethod === 'Card Payment' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Card Payment
                </>
              )}
            </Button>
            <div className="text-xs text-gray-600 text-center">
              Fee: 2.9% + $0.30
            </div>
          </CardContent>
        </Card>

        {/* Digital Wallets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Nfc className="w-5 h-5" />
              Digital Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Apple Pay</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Google Pay</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Samsung Pay</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 hover:bg-purple-50" 
              size="lg"
              onClick={() => processPayment('Digital Wallet')}
              disabled={isProcessing}
            >
              {isProcessing && paymentMethod === 'Digital Wallet' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Nfc className="w-4 h-4 mr-2" />
                  Accept Digital Payment
                </>
              )}
            </Button>
            <div className="text-xs text-gray-600 text-center">
              Fee: 2.9% + $0.30
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Payment Option */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Cash Payment</h3>
                <p className="text-sm text-green-700">No processing fees</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="border-green-300 hover:bg-green-100"
              onClick={() => processPayment('Cash')}
              disabled={isProcessing}
            >
              {isProcessing && paymentMethod === 'Cash' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Banknote className="w-4 h-4 mr-2" />
                  Record Cash Payment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Terminal Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">Stripe Terminal Integration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <p className="mb-2">
            For full in-person payment processing, connect a Stripe Terminal reader:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>BBPOS WisePad 3:</strong> $59 - Chip, contactless, and mobile wallets</li>
            <li><strong>Stripe Reader M2:</strong> $249 - All-in-one with receipt printer</li>
            <li><strong>Verifone P400:</strong> $149 - Countertop terminal with screen</li>
          </ul>
          <p className="mt-2 text-xs">
            All readers integrate directly with your Stripe account for seamless payment processing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}