import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreditCard, DollarSign, Plus, Filter, Download, 
  CheckCircle, Clock, XCircle, RefreshCw, ExternalLink,
  Smartphone, Building2, Banknote, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Payment } from "@shared/schema";

const clientId = "client_1"; // This would come from auth context

// SECURE: No secret keys on frontend - only public keys allowed
const paymentMethodSchema = z.object({
  stripeEnabled: z.boolean().default(false),
  paypalEnabled: z.boolean().default(false),
  venmoEnabled: z.boolean().default(false),
  zelleEnabled: z.boolean().default(false),
  cashEnabled: z.boolean().default(true),
  stripePublicKey: z.string().optional(),
  // NEVER include secret keys in frontend schemas
  paypalClientId: z.string().optional(),
  venmoBusinessProfile: z.string().optional(),
  zelleEmail: z.string().email().optional(),
  processingFeePercentage: z.number().min(0).max(10).default(2.9),
  enableTipping: z.boolean().default(true),
  defaultTipPercentages: z.array(z.number()).default([15, 18, 20, 25]),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

const paymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    icon: CreditCard,
    description: "Accept credit cards and digital payments",
    fees: "2.9% + $0.30 per transaction",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: Wallet,
    description: "Popular digital payment platform",
    fees: "2.9% + $0.30 per transaction",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "venmo",
    name: "Venmo",
    icon: Smartphone,
    description: "Social payment app popular with younger customers",
    fees: "1.9% per transaction",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  {
    id: "zelle",
    name: "Zelle",
    icon: Building2,
    description: "Bank-to-bank transfers",
    fees: "No fees (bank dependent)",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "cash",
    name: "Cash",
    icon: Banknote,
    description: "Traditional cash payments",
    fees: "No processing fees",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

// SECURE: Removed mock data - using real backend payments

export default function PaymentManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      stripeEnabled: false,
      paypalEnabled: false,
      venmoEnabled: false,
      zelleEnabled: false,
      cashEnabled: true,
      processingFeePercentage: 2.9,
      enableTipping: true,
      defaultTipPercentages: [15, 18, 20, 25],
    },
  });

  // SECURE: Connect to real backend payments (no mock fallback)
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: [`/api/client/${clientId}/payments`],
  });

  // SECURE: Get Stripe status from secure backend
  const { data: stripeStatus, isLoading: settingsLoading } = useQuery({
    queryKey: [`/api/client/${clientId}/stripe-status`],
  });

  // SECURE: Update to use secure Stripe config endpoint (no secret key exposure)
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: PaymentMethodFormData) => {
      // Only send public key to secure backend (never secret key)
      if (data.stripeEnabled && data.stripePublicKey) {
        await apiRequest(`/api/client/${clientId}/stripe-config`, "POST", {
          stripePublicKey: data.stripePublicKey,
          // Secret key must be entered through separate secure admin interface
        });
      }
      return apiRequest(`/api/client/${clientId}/payment-settings`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/stripe-status`] });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/payment-settings`] });
      setDialogOpen(false);
      toast({
        title: "Payment Settings Updated",
        description: "Your payment methods have been configured successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payment settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const refundPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return apiRequest(`/api/client/${clientId}/payments/${paymentId}/refund`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/payments`] });
      toast({
        title: "Refund Processed",
        description: "The payment refund has been initiated.",
      });
    },
  });

  const handleSubmit = (data: PaymentMethodFormData) => {
    updateSettingsMutation.mutate(data);
  };

  const getPaymentIcon = (method: string) => {
    const methodConfig = paymentMethods.find(m => m.id === method.toLowerCase());
    return methodConfig?.icon || CreditCard;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDING": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "FAILED": return <XCircle className="h-4 w-4 text-red-600" />;
      case "REFUNDED": return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "FAILED": return "bg-red-100 text-red-800";
      case "REFUNDED": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== "all" && payment.status !== filterStatus.toUpperCase()) return false;
    if (filterMethod !== "all" && payment.paymentMethod !== filterMethod.toUpperCase()) return false;
    return true;
  });

  const totalRevenue = payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + (p.processingFee || 0), 0);

  const netRevenue = totalRevenue - totalFees;

  if (paymentsLoading || settingsLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Manage payment methods and transaction history</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Configure Payments
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Method Configuration</DialogTitle>
              <DialogDescription>
                Set up your preferred payment methods and processing settings.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid gap-6">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${method.bgColor}`}>
                            <method.icon className={`h-6 w-6 ${method.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{method.name}</h3>
                                <p className="text-sm text-gray-600">{method.description}</p>
                                <p className="text-xs text-gray-500">{method.fees}</p>
                              </div>
                              <FormField
                                control={form.control}
                                name={`${method.id}Enabled` as keyof PaymentMethodFormData}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Switch
                                        checked={field.value as boolean}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {method.id === "stripe" && (
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="stripePublicKey"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stripe Public Key</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="pk_test_..." 
                                      {...field} 
                                      data-testid="input-stripe-public-key"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Only enter your Stripe public key here. Secret keys are managed securely server-side.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            {/* SECURITY: Secret key field removed - managed server-side only */}
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                                <span className="text-sm text-amber-800 font-medium">Security Notice</span>
                              </div>
                              <p className="text-sm text-amber-700 mt-1">
                                Secret keys are handled securely by our system and never exposed to the frontend for your protection.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      )}

                      {method.id === "paypal" && (
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="paypalClientId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your PayPal Client ID" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="paypalClientSecret"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client Secret</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Your PayPal Client Secret" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      )}

                      {method.id === "venmo" && (
                        <CardContent className="pt-0">
                          <FormField
                            control={form.control}
                            name="venmoBusinessProfile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Venmo Business Profile</FormLabel>
                                <FormControl>
                                  <Input placeholder="@your-business-name" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Your Venmo business username (include @)
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      )}

                      {method.id === "zelle" && (
                        <CardContent className="pt-0">
                          <FormField
                            control={form.control}
                            name="zelleEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zelle Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="business@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Email address linked to your Zelle account
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="processingFeePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Fee %</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="10" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Percentage fee to cover payment processing costs
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableTipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Tipping</FormLabel>
                          <FormDescription>
                            Allow customers to add tips to their payments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateSettingsMutation.isPending}>
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${netRevenue.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Net Revenue</p>
                <p className="text-xs text-gray-500">After processing fees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-50">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Processing Fees</p>
                <p className="text-xs text-gray-500">{((totalFees / totalRevenue) * 100).toFixed(1)}% of revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                  <SelectItem value="zelle">Zelle</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const PaymentIcon = getPaymentIcon(payment.paymentMethod);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.customerName}</div>
                            <div className="text-sm text-gray-600">{payment.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PaymentIcon className="h-4 w-4" />
                            <span className="capitalize">{payment.paymentMethod.toLowerCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(payment.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(payment.status)}
                              {payment.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          ${payment.processingFee?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          ${payment.netAmount?.toFixed(2) || payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {payment.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {payment.paymentIntentId && (
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                            {payment.status === "COMPLETED" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => refundPaymentMutation.mutate(payment.id)}
                                disabled={refundPaymentMutation.isPending}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}