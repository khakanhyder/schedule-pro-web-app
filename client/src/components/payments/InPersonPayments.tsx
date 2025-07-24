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
  Zap,
  Nfc,
  Banknote,
  Receipt,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle
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
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [showTipping, setShowTipping] = useState(false);
  const { toast } = useToast();

  const tipOptions = [
    { percentage: 15, label: '15%' },
    { percentage: 18, label: '18%' },
    { percentage: 20, label: '20%' }
  ];

  const calculateTip = (baseAmount: number, tipPercentage: number): number => {
    return (baseAmount * tipPercentage) / 100;
  };

  const getTotalAmount = (): number => {
    const base = parseFloat(paymentAmount) || 0;
    const tip = selectedTip > 0 ? calculateTip(base, selectedTip) : parseFloat(customTip) || 0;
    return base + tip;
  };

  const getTipAmount = (): number => {
    const base = parseFloat(paymentAmount) || 0;
    return selectedTip > 0 ? calculateTip(base, selectedTip) : parseFloat(customTip) || 0;
  };

  const processPayment = async (method: string) => {
    setIsProcessing(true);
    setPaymentMethod(method);

    try {
      // NOTE: This is a demonstration interface
      // In production, this would integrate with:
      // - Stripe Terminal SDK for card payments
      // - Your POS system for cash tracking
      // - Real payment processing APIs
      
      // Simulate payment processing for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const baseAmount = parseFloat(paymentAmount);
      const tipAmount = getTipAmount();
      const totalAmount = getTotalAmount();

      const paymentData = {
        baseAmount,
        tipAmount,
        totalAmount,
        method,
        timestamp: new Date(),
        clientName: clientName || 'Walk-in Customer',
        status: 'completed'
      };

      toast({
        title: "Payment Successful!",
        description: `${method} payment of $${totalAmount.toFixed(2)} completed successfully${tipAmount > 0 ? ` (includes $${tipAmount.toFixed(2)} tip)` : ''}`
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
                Service Amount
              </Label>
              <Input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  // Reset tip when amount changes
                  setSelectedTip(0);
                  setCustomTip('');
                }}
                placeholder="0.00"
                className="text-2xl font-bold"
              />
            </div>
          </div>
          
          {parseFloat(paymentAmount) > 0 && (
            <>
              <Separator />
              
              {/* Tip Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Add Tip (Optional)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTipping(!showTipping)}
                  >
                    {showTipping ? 'Hide Tip Options' : 'Add Tip'}
                  </Button>
                </div>
                
                {showTipping && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* Preset Tip Percentages */}
                    <div className="grid grid-cols-3 gap-3">
                      {tipOptions.map((option) => (
                        <Button
                          key={option.percentage}
                          variant={selectedTip === option.percentage ? "default" : "outline"}
                          onClick={() => {
                            setSelectedTip(option.percentage);
                            setCustomTip('');
                          }}
                          className="h-16 flex flex-col"
                        >
                          <span className="text-lg font-bold">{option.label}</span>
                          <span className="text-sm">
                            ${calculateTip(parseFloat(paymentAmount) || 0, option.percentage).toFixed(2)}
                          </span>
                        </Button>
                      ))}
                    </div>
                    
                    {/* Custom Tip Amount */}
                    <div>
                      <Label>Custom Tip Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={customTip}
                        onChange={(e) => {
                          setCustomTip(e.target.value);
                          setSelectedTip(0); // Clear percentage selection
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    
                    {/* No Tip Option */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedTip(0);
                        setCustomTip('');
                      }}
                      className="w-full"
                    >
                      No Tip
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Payment Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Amount:</span>
                    <span>${parseFloat(paymentAmount).toFixed(2)}</span>
                  </div>
                  {getTipAmount() > 0 && (
                    <div className="flex justify-between">
                      <span>Tip:</span>
                      <span>${getTipAmount().toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
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
              disabled={isProcessing || parseFloat(paymentAmount) <= 0}
            >
              {isProcessing && paymentMethod === 'Card Payment' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Charge ${getTotalAmount().toFixed(2)}
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
              disabled={isProcessing || parseFloat(paymentAmount) <= 0}
            >
              {isProcessing && paymentMethod === 'Digital Wallet' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Nfc className="w-4 h-4 mr-2" />
                  Charge ${getTotalAmount().toFixed(2)}
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
              disabled={isProcessing || parseFloat(paymentAmount) <= 0}
            >
              {isProcessing && paymentMethod === 'Cash' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Banknote className="w-4 h-4 mr-2" />
                  Record ${getTotalAmount().toFixed(2)} Cash
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Demo Interface - Integration Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-700">
          <p className="mb-3">
            This is a demonstration of the payment interface. For live processing, you'll need:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-medium">1. Stripe Terminal SDK:</span>
              <span>Connect physical card readers for real transactions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">2. Payment Processing:</span>
              <span>Integrate with Stripe's payment intent APIs</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">3. POS Integration:</span>
              <span>Connect to your point-of-sale system for cash tracking</span>
            </div>
          </div>
          <p className="mt-3 text-xs">
            The interface design and tipping logic are production-ready. Only the payment processing backend needs implementation.
          </p>
        </CardContent>
      </Card>

      {/* Stripe Terminal Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">Next Steps: Stripe Terminal Setup</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <p className="mb-2">
            To make this fully functional, order a Stripe Terminal reader:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>BBPOS WisePad 3:</strong> $59 - Portable, perfect for salons</li>
            <li><strong>Stripe Reader M2:</strong> $249 - Countertop with receipt printer</li>
            <li><strong>Verifone P400:</strong> $149 - Customer-facing screen</li>
          </ul>
          <p className="mt-2 text-xs">
            Once connected, the same interface will process real payments with live tip calculations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}