import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Copy, 
  DollarSign,
  User,
  FileText,
  Calendar,
  CheckCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SimplePaymentRequest() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [paymentLink, setPaymentLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createPaymentRequest = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in client name, email, and amount",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Generate payment link
      const amount = parseFloat(formData.amount);
      const description = formData.description || 'Service Payment';
      const paymentUrl = `/pay-invoice?amount=${amount}&description=${encodeURIComponent(description)}&client=${encodeURIComponent(formData.clientName)}&email=${encodeURIComponent(formData.clientEmail)}`;
      const fullLink = `${window.location.origin}${paymentUrl}`;
      
      setPaymentLink(fullLink);
      
      // Copy to clipboard
      navigator.clipboard.writeText(fullLink);
      
      toast({
        title: "Payment Request Created!",
        description: "Link copied to clipboard. Send it to your client to get paid with Stripe, PayPal, Zelle, or Venmo."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment request",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      amount: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setPaymentLink('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Payment Request
          </CardTitle>
          <p className="text-gray-600">
            Create a payment link that accepts multiple payment methods. Your clients can pay with credit cards, PayPal, Zelle, or Venmo.
          </p>
        </CardHeader>
      </Card>

      {/* Payment Methods Available */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Your clients can pay with:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Credit Cards
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              PayPal
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              Zelle
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              Venmo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Client Name *
              </Label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Client Email *
              </Label>
              <Input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount *
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description (Optional)
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Service description, invoice number, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={createPaymentRequest} 
              disabled={isCreating}
              className="flex-1"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Payment Request'}
            </Button>
            {paymentLink && (
              <Button variant="outline" onClick={resetForm}>
                Create Another
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Payment Link */}
      {paymentLink && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Payment Request Ready!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-green-800">Payment Link (copied to clipboard)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={paymentLink}
                  readOnly
                  className="bg-white"
                />
                <Button size="sm" onClick={copyLink} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Send this link to {formData.clientName} via email, text, or any messaging app</li>
                <li>They'll click the link and choose how to pay (credit card, PayPal, Zelle, or Venmo)</li>
                <li>Money goes directly to your accounts - no waiting!</li>
                <li>You'll get a confirmation when payment is received</li>
              </ol>
            </div>

            <div className="text-xs text-green-700 bg-green-100 p-3 rounded">
              <strong>Pro Tip:</strong> You can send this same link multiple times if needed. It stays active until paid.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}