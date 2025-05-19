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
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, DollarSign, CreditCard, AlertCircle } from "lucide-react";

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
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Digital payment details - in production this would come from the professional's profile
  const digitalPayments = {
    venmo: "@your-business-venmo",
    zelle: "payments@yourbusiness.com",
    paypal: "payments@yourbusiness.com"
  };

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
                  <div className="grid grid-cols-4 gap-2">
                    {["venmo", "zelle", "paypal", "cash"].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={paymentMethod === method ? "default" : "outline"}
                        onClick={() => setPaymentMethod(method)}
                        disabled={paymentStatus === "completed"}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        {method === "venmo" && <div className="text-[#3D95CE] text-lg">V</div>}
                        {method === "zelle" && <div className="text-[#6D1ED4] text-lg">Z</div>}
                        {method === "paypal" && <div className="text-[#003087] text-lg">P</div>}
                        {method === "cash" && <DollarSign className="h-5 w-5" />}
                        <span className="text-xs capitalize">{method}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {paymentMethod !== "cash" && (
                  <>
                    <div className="space-y-2 col-span-3 p-4 border rounded-md bg-neutral">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Your {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} Details:
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => {
                            navigator.clipboard.writeText(digitalPayments[paymentMethod as keyof typeof digitalPayments]);
                            setCopySuccess(paymentMethod);
                            setTimeout(() => setCopySuccess(null), 2000);
                          }}
                        >
                          {copySuccess === paymentMethod ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="text-xs">{copySuccess === paymentMethod ? "Copied!" : "Copy"}</span>
                        </Button>
                      </div>
                      <div className="font-mono mt-1 text-sm p-2 bg-background border rounded">
                        {digitalPayments[paymentMethod as keyof typeof digitalPayments]}
                      </div>
                      
                      <div className="flex items-start gap-2 mt-3 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500" />
                        <span>
                          Share these details with your client to receive payment directly. You'll save on processing fees!
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 col-span-3 mt-2">
                      <Label htmlFor="reference">Reference/Transaction ID</Label>
                      <Input 
                        id="reference" 
                        value={manualReference}
                        onChange={(e) => setManualReference(e.target.value)}
                        placeholder="Enter confirmation code/ID from the payment"
                        disabled={paymentStatus === "completed"}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <Separator className="my-2" />
              
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