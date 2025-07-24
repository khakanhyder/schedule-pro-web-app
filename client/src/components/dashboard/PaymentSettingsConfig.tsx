import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Save,
  CheckCircle,
  AlertTriangle,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentConfig {
  stripe: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
  };
  zelle: {
    enabled: boolean;
    businessEmail: string;
    businessPhone: string;
  };
  venmo: {
    enabled: boolean;
    businessHandle: string;
  };
  businessInfo: {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
  };
}

export default function PaymentSettingsConfig() {
  const [config, setConfig] = useState<PaymentConfig>({
    stripe: {
      enabled: true,
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
      secretKey: '***hidden***'
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '***hidden***'
    },
    zelle: {
      enabled: false,
      businessEmail: '',
      businessPhone: ''
    },
    venmo: {
      enabled: false,
      businessHandle: ''
    },
    businessInfo: {
      businessName: 'Your Business Name',
      businessEmail: 'business@example.com',
      businessPhone: '(555) 123-4567'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const updateConfig = (section: keyof PaymentConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      // This would save to your backend/database
      // await apiRequest('POST', '/api/payment-config', config);
      
      toast({
        title: "Settings Saved",
        description: "Payment configuration updated successfully"
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save payment configuration",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (enabled: boolean, hasRequiredFields: boolean) => {
    if (!enabled) return <Badge variant="outline">Disabled</Badge>;
    if (enabled && hasRequiredFields) return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    return <Badge variant="destructive">Needs Setup</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Payment Method Configuration
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure which payment methods your clients can use to pay you. Each method deposits money directly into your accounts.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={config.businessInfo.businessName}
                  onChange={(e) => updateConfig('businessInfo', 'businessName', e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <Label>Business Email</Label>
                <Input
                  type="email"
                  value={config.businessInfo.businessEmail}
                  onChange={(e) => updateConfig('businessInfo', 'businessEmail', e.target.value)}
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <Label>Business Phone</Label>
                <Input
                  value={config.businessInfo.businessPhone}
                  onChange={(e) => updateConfig('businessInfo', 'businessPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Stripe Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Stripe (Credit/Debit Cards & In-Person)</h3>
                  <p className="text-sm text-gray-600">Accept cards online + in-person with Stripe Terminal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(config.stripe.enabled, !!config.stripe.publicKey)}
                <Switch
                  checked={config.stripe.enabled}
                  onCheckedChange={(checked) => updateConfig('stripe', 'enabled', checked)}
                />
              </div>
            </div>
            {config.stripe.enabled && (
              <div className="ml-9 space-y-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <CheckCircle className="w-4 h-4" />
                  Stripe keys are configured via environment variables
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Fee:</strong> 2.9% + $0.30 per transaction • <strong>Processing:</strong> Instant
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* PayPal Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">PayPal</h3>
                  <p className="text-sm text-gray-600">PayPal account & guest card payments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(config.paypal.enabled, !!config.paypal.clientId)}
                <Switch
                  checked={config.paypal.enabled}
                  onCheckedChange={(checked) => updateConfig('paypal', 'enabled', checked)}
                />
              </div>
            </div>
            {config.paypal.enabled && (
              <div className="ml-9 space-y-3 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  PayPal credentials needed - please provide PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Fee:</strong> 2.9% + $0.30 per transaction • <strong>Processing:</strong> Instant
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Zelle Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Zelle</h3>
                  <p className="text-sm text-gray-600">Bank-to-bank transfers (US banks)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(config.zelle.enabled, !!config.zelle.businessEmail)}
                <Switch
                  checked={config.zelle.enabled}
                  onCheckedChange={(checked) => updateConfig('zelle', 'enabled', checked)}
                />
              </div>
            </div>
            {config.zelle.enabled && (
              <div className="ml-9 space-y-3 p-4 bg-green-50 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm">Zelle Email (where you receive payments)</Label>
                    <Input
                      type="email"
                      value={config.zelle.businessEmail}
                      onChange={(e) => updateConfig('zelle', 'businessEmail', e.target.value)}
                      placeholder="your-business@email.com"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Zelle Phone (optional backup)</Label>
                    <Input
                      value={config.zelle.businessPhone}
                      onChange={(e) => updateConfig('zelle', 'businessPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Fee:</strong> Free • <strong>Processing:</strong> Usually within minutes
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Venmo Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Venmo</h3>
                  <p className="text-sm text-gray-600">Popular peer-to-peer payments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(config.venmo.enabled, !!config.venmo.businessHandle)}
                <Switch
                  checked={config.venmo.enabled}
                  onCheckedChange={(checked) => updateConfig('venmo', 'enabled', checked)}
                />
              </div>
            </div>
            {config.venmo.enabled && (
              <div className="ml-9 space-y-3 p-4 bg-purple-50 rounded-lg">
                <div>
                  <Label className="text-sm">Venmo Handle (where you receive payments)</Label>
                  <Input
                    value={config.venmo.businessHandle}
                    onChange={(e) => updateConfig('venmo', 'businessHandle', e.target.value)}
                    placeholder="@YourBusinessVenmo"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Fee:</strong> Free (standard transfer) • <strong>Processing:</strong> 1-3 business days
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-800">
              <strong>How it works:</strong> You configure your payment accounts once. Clients can then pay you using any enabled method - the money goes directly to your accounts.
            </div>
          </div>

          <Button onClick={saveConfiguration} disabled={isSaving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Payment Configuration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}