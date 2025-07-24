import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Wifi,
  Zap,
  Store,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function StripeTerminalInfo() {
  const terminals = [
    {
      name: "BBPOS WisePad 3",
      price: "$59",
      features: ["Chip & PIN", "Contactless", "Apple/Google Pay", "Portable"],
      bestFor: "Mobile businesses, small salons",
      image: "📱"
    },
    {
      name: "Stripe Reader M2",
      price: "$249", 
      features: ["All-in-one", "Receipt printer", "Large screen", "Ethernet/WiFi"],
      bestFor: "Full-service salons, spas",
      image: "🖥️"
    },
    {
      name: "Verifone P400",
      price: "$149",
      features: ["Countertop", "Customer screen", "Chip & contactless", "Fast processing"],
      bestFor: "High-volume businesses",
      image: "💳"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Store className="w-5 h-5" />
            Stripe Terminal - Professional In-Person Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-4">
            Perfect for salons, spas, and service businesses that need to accept payments in-person. 
            All terminals connect to your existing Stripe account with the same 2.9% + $0.30 rates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-white rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Same-day deposits</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">All payment methods</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Receipt printing</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terminals.map((terminal) => (
          <Card key={terminal.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{terminal.image}</div>
                <Badge variant="outline" className="text-lg font-bold">
                  {terminal.price}
                </Badge>
              </div>
              <CardTitle className="text-lg">{terminal.name}</CardTitle>
              <p className="text-sm text-gray-600">{terminal.bestFor}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {terminal.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://stripe.com/terminal', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Order from Stripe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Easy Setup Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-1">Order Terminal</h4>
              <p className="text-xs text-gray-600">Choose and order from Stripe</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-1">Connect to WiFi</h4>
              <p className="text-xs text-gray-600">Terminal connects to your network</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-1">Pair with Stripe</h4>
              <p className="text-xs text-gray-600">Links to your existing account</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h4 className="font-medium mb-1">Start Processing</h4>
              <p className="text-xs text-gray-600">Accept payments immediately</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits for Salons/Spas */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Perfect for Salon & Spa Businesses</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Customer Experience</h4>
              <ul className="text-sm space-y-1">
                <li>• Quick contactless payments</li>
                <li>• Digital receipts via email/SMS</li>
                <li>• Easy tip options on screen</li>
                <li>• Apple Pay & Google Pay support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Business Benefits</h4>
              <ul className="text-sm space-y-1">
                <li>• Same-day fund deposits</li>
                <li>• Automatic sales reporting</li>
                <li>• PCI compliance included</li>
                <li>• Integrates with appointment system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}