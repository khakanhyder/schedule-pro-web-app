import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Clock, Shield } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'cash' | 'online' | null;
  onMethodChange: (method: 'cash' | 'online') => void;
  servicePrice: number;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange, 
  servicePrice 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to pay for your ${servicePrice} service
        </p>
      </div>

      <RadioGroup
        value={selectedMethod || ''}
        onValueChange={(value) => onMethodChange(value as 'cash' | 'online')}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Cash Payment Option */}
        <div className="relative">
          <RadioGroupItem value="cash" id="cash" className="sr-only" />
          <Label
            htmlFor="cash"
            className={`cursor-pointer block transition-all ${
              selectedMethod === 'cash' 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Card className={`h-full ${selectedMethod === 'cash' ? 'border-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Pay at Service</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    No fees
                  </Badge>
                </div>
                <CardDescription>
                  Pay with cash when you arrive for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Payment due at time of service</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Cash, card, or check accepted</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-800">
                    Total: ${servicePrice.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>

        {/* Online Payment Option */}
        <div className="relative">
          <RadioGroupItem value="online" id="online" className="sr-only" />
          <Label
            htmlFor="online"
            className={`cursor-pointer block transition-all ${
              selectedMethod === 'online' 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Card className={`h-full ${selectedMethod === 'online' ? 'border-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Pay Online Now</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-blue-600">
                    Secure
                  </Badge>
                </div>
                <CardDescription>
                  Pay securely online with your credit or debit card
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Secured by Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>All major cards accepted</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800">
                    Total: ${servicePrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Your appointment is guaranteed once payment is processed
                  </p>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}