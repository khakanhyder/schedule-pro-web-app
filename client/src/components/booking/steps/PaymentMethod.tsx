import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Smartphone, CheckCircle, Info, Shield, Clock } from "lucide-react";
import { type ClientService, type BookingData } from "@shared/schema";

const paymentMethodSchema = z.object({
  paymentMethod: z.enum(["CASH", "ONLINE"], {
    required_error: "Please select a payment method",
  }),
});

type PaymentMethodData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  selectedService?: ClientService;
}

export default function PaymentMethod({ 
  bookingData, 
  updateBookingData, 
  selectedService 
}: PaymentMethodProps) {
  const form = useForm<PaymentMethodData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethod: bookingData.paymentMethod || undefined,
    },
  });

  // Watch form values and update booking data
  const watchedPaymentMethod = form.watch("paymentMethod");
  
  useEffect(() => {
    if (watchedPaymentMethod) {
      updateBookingData({ paymentMethod: watchedPaymentMethod });
    }
  }, [watchedPaymentMethod, updateBookingData]);

  // Parse service price for calculations
  const servicePrice = selectedService?.price || 0;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
        <p className="text-gray-600">Choose how you'd like to pay for your appointment</p>
      </div>

      {/* Service Price Summary */}
      {selectedService && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">{selectedService.name}</h3>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {selectedService.price}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {selectedService.durationMinutes} minutes
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <div className="max-w-2xl mx-auto">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="space-y-4"
                    data-testid="payment-method-radio-group"
                  >
                    {/* Online Payment Option */}
                    <div className="space-y-4">
                      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        field.value === "ONLINE" 
                          ? 'ring-2 ring-blue-500 shadow-lg' 
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}>
                        <CardHeader 
                          className="pb-4"
                          onClick={() => field.onChange("ONLINE")}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value="ONLINE" 
                                id="online"
                                data-testid="radio-payment-online"
                              />
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                <div>
                                  <CardTitle className="text-lg">Pay Online Now</CardTitle>
                                  <CardDescription>
                                    Secure payment with credit/debit card
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                            {field.value === "ONLINE" && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Benefits */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Secure & encrypted
                              </Badge>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Instant confirmation
                              </Badge>
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                <Smartphone className="w-3 h-3 mr-1" />
                                Mobile-friendly
                              </Badge>
                            </div>
                            
                            {/* Payment Details */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  What happens next:
                                </span>
                              </div>
                              <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Complete payment securely with Stripe</li>
                                <li>• Receive instant booking confirmation</li>
                                <li>• Get email receipt and appointment details</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cash Payment Option */}
                      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        field.value === "CASH" 
                          ? 'ring-2 ring-blue-500 shadow-lg' 
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}>
                        <CardHeader 
                          className="pb-4"
                          onClick={() => field.onChange("CASH")}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value="CASH" 
                                id="cash"
                                data-testid="radio-payment-cash"
                              />
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-green-600" />
                                <div>
                                  <CardTitle className="text-lg">Pay at Appointment</CardTitle>
                                  <CardDescription>
                                    Pay with cash or card when you arrive
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                            {field.value === "CASH" && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Benefits */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Cash accepted
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <CreditCard className="w-3 h-3 mr-1" />
                                Cards accepted
                              </Badge>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Flexible payment
                              </Badge>
                            </div>
                            
                            {/* Payment Details */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-900">
                                  Please note:
                                </span>
                              </div>
                              <ul className="text-sm text-amber-800 space-y-1">
                                <li>• Booking confirmed but payment due at appointment</li>
                                <li>• We accept cash, credit, and debit cards</li>
                                <li>• Please arrive 5 minutes early for payment</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Method Selected Confirmation */}
          {watchedPaymentMethod && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Payment Method Selected</h4>
              </div>
              <p className="text-green-700 text-sm">
                {watchedPaymentMethod === "ONLINE" 
                  ? "You'll complete payment securely in the next step."
                  : "You can pay when you arrive for your appointment."
                }
              </p>
            </div>
          )}

          {/* Security & Trust Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Secure & Trusted</h4>
            </div>
            <p className="text-gray-700 text-sm">
              All online payments are processed securely through Stripe with industry-standard encryption. 
              Your payment information is never stored on our servers.
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}