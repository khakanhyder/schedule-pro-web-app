import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PaymentOptionsProps {
  appointmentId: number;
  clientName: string;
  amount: number;
}

export default function PaymentOptions({ appointmentId, clientName, amount }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [receiptSent, setReceiptSent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");
  const [manualReference, setManualReference] = useState("");
  const { toast } = useToast();

  const handleCardPayment = () => {
    // Redirect to our Stripe checkout page
    const checkoutUrl = `/checkout?amount=${amount}&appointmentId=${appointmentId}&clientName=${encodeURIComponent(clientName)}`;
    window.location.href = checkoutUrl;
  };

  const handleCashPayment = () => {
    toast({
      title: "Cash Payment Recorded",
      description: `$${amount.toFixed(2)} cash payment from ${clientName} recorded.`,
    });
    setPaymentStatus("completed");
  };

  const handleManualPayment = () => {
    if (!manualReference && paymentMethod !== "cash") {
      toast({
        title: "Reference Required",
        description: "Please add a reference number or description for this payment.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Payment Recorded",
      description: `${paymentMethod.toUpperCase()} payment of $${amount.toFixed(2)} recorded.`,
    });
    setPaymentStatus("completed");
  };

  const handleSendReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: `Receipt has been sent to ${clientName}.`,
    });
    setReceiptSent(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Process Payment</span>
          <Badge variant={
            paymentStatus === "completed" ? "success" : 
            paymentStatus === "failed" ? "destructive" : 
            "outline"
          }>
            {paymentStatus === "completed" ? "Paid" : 
             paymentStatus === "failed" ? "Failed" : 
             "Pending"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Payment for {clientName}'s appointment (#{appointmentId})
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-semibold mb-6">${amount.toFixed(2)}</div>
        
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="alternative">Alternative</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid gap-4 py-4">
              <Button 
                onClick={handleCardPayment}
                disabled={paymentStatus === "completed"}
                className="w-full"
              >
                Process Credit Card
              </Button>
              
              <Button 
                onClick={handleCashPayment}
                disabled={paymentStatus === "completed"}
                variant="outline" 
                className="w-full"
              >
                Record Cash Payment
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="alternative">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <select 
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={paymentStatus === "completed"}
                  >
                    <option value="venmo">Venmo</option>
                    <option value="zelle">Zelle</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {paymentMethod !== "cash" && (
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="reference">Reference/Transaction ID</Label>
                    <Input 
                      id="reference" 
                      value={manualReference}
                      onChange={(e) => setManualReference(e.target.value)}
                      placeholder="Enter reference number or description"
                      disabled={paymentStatus === "completed"}
                    />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleManualPayment}
                disabled={paymentStatus === "completed"}
                className="w-full mt-4"
              >
                Record {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} Payment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.print()}
          disabled={paymentStatus !== "completed"}
        >
          Print Receipt
        </Button>
        
        <Button
          onClick={handleSendReceipt}
          disabled={paymentStatus !== "completed" || receiptSent}
        >
          {receiptSent ? "Receipt Sent" : "Email Receipt"}
        </Button>
      </CardFooter>
    </Card>
  );
}