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
  Send, 
  Copy, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Users,
  Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SimplePaymentRequest from './SimplePaymentRequest';

interface PaymentRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  createdAt: Date;
  dueDate: Date;
}

export default function PaymentManagement() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@example.com',
      amount: 2500.00,
      description: 'Kitchen Renovation - Final Payment',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      clientName: 'Mike Wilson',
      clientEmail: 'mike@example.com',
      amount: 1200.00,
      description: 'Bathroom Remodel - Deposit',
      status: 'paid',
      paymentMethod: 'Stripe (Visa)',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      clientName: 'Lisa Chen',
      clientEmail: 'lisa@example.com',
      amount: 850.00,
      description: 'Deck Construction - Progress Payment',
      status: 'paid',
      paymentMethod: 'Zelle',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  ]);

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const sendPaymentLink = (request: PaymentRequest) => {
    const paymentUrl = `/pay-invoice?amount=${request.amount}&description=${encodeURIComponent(request.description)}&client=${encodeURIComponent(request.clientName)}&email=${encodeURIComponent(request.clientEmail)}`;
    
    navigator.clipboard.writeText(`${window.location.origin}${paymentUrl}`);
    
    toast({
      title: "Payment Link Copied",
      description: "Multi-payment link copied to clipboard - supports all payment methods"
    });
  };

  const totalPending = paymentRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPaid = paymentRequests
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Simple Payment Request Form */}
      <SimplePaymentRequest />
      
      {/* Divider */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Payment Overview & History</h2>
        
        {/* Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">${totalPending.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-purple-600">{paymentRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Supported */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Supported Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Credit Cards</span>
                <Badge variant="outline" className="text-xs">2.9%</Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium">PayPal</span>
                <Badge variant="outline" className="text-xs">2.9%</Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="font-medium">Zelle</span>
                <Badge variant="outline" className="text-xs bg-green-100">Free</Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="font-medium">Venmo</span>
                <Badge variant="outline" className="text-xs bg-green-100">Free</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{request.clientName}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                          {request.paymentMethod && (
                            <Badge variant="outline">
                              {request.paymentMethod}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Amount: </span>
                            <span className="text-lg font-bold text-green-600">${request.amount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Description: </span>
                            {request.description}
                          </div>
                          <div>
                            <span className="font-medium">Due: </span>
                            {new Date(request.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => sendPaymentLink(request)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send Link
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendPaymentLink(request)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}