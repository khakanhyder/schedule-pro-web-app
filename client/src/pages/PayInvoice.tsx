import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import MultiPaymentOptions from '@/components/payments/MultiPaymentOptions';

export default function PayInvoice() {
  const [location] = useLocation();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const amount = parseFloat(params.get('amount') || '0');
    const description = params.get('description') || 'Service Payment';
    const client = params.get('client') || 'Valued Customer';
    const estimateId = params.get('estimateId') ? parseInt(params.get('estimateId')!) : undefined;
    const invoiceId = params.get('invoiceId') || undefined;

    if (amount > 0) {
      setPaymentData({
        amount,
        description,
        clientName: client,
        estimateId,
        invoiceId
      });
    }
    setIsLoading(false);
  }, [location]);

  const handlePaymentComplete = (method: string, details: any) => {
    console.log('Payment completed:', { method, details });
    // Handle payment completion - update database, send confirmations, etc.
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!paymentData || paymentData.amount <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Payment Request</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              This payment link appears to be invalid or expired.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scheduled Pro Services</h1>
                <p className="text-sm text-gray-600">Secure Payment Portal</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              🔒 Secure Payment
            </Badge>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Payment
            </h2>
            <p className="text-gray-600">
              Choose your preferred payment method below
            </p>
          </div>
        </div>

        <MultiPaymentOptions
          amount={paymentData.amount}
          description={paymentData.description}
          clientName={paymentData.clientName}
          estimateId={paymentData.estimateId}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Scheduled Pro Services. All rights reserved.</p>
            <p className="mt-1">
              Secure payments powered by Stripe • Questions? Contact us at support@scheduledpro.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}