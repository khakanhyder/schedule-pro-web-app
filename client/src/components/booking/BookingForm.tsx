import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { insertAppointmentSchema, type Stylist, type Appointment, type ClientService } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SelectedBooking } from "@/pages/Booking";
import { ChevronLeft, ChevronRight, CreditCard, DollarSign } from "lucide-react";

// Step 1: Booking Details Schema
const step1Schema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  serviceId: z.string().min(1, "Please select a service"),
  stylistId: z.string().min(1, "Please select a stylist"),
  date: z.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), {
    message: "Please select a date and time",
  }),
  notes: z.string().optional(),
  emailConfirmation: z.boolean().default(true),
  smsConfirmation: z.boolean().default(false),
});

// Step 2: Payment Method Schema
const step2Schema = z.object({
  preferredPaymentMethod: z.enum(["CASH", "ONLINE"], { required_error: "Please select a payment method" }),
});

// Combined form schema
const formSchema = step1Schema.merge(step2Schema);

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type FormData = z.infer<typeof formSchema>;

interface BookingFormProps {
  selectedBooking: SelectedBooking;
  setSelectedBooking: React.Dispatch<React.SetStateAction<SelectedBooking>>;
  services?: ClientService[];
  stylists?: Stylist[];
  onConfirmation: (data: {
    appointment: Appointment;
    service: ClientService | undefined;
    stylist: Stylist | undefined;
    confirmations: string[];
  }) => void;
}

export default function BookingForm({ 
  selectedBooking, 
  setSelectedBooking, 
  services, 
  stylists,
  onConfirmation 
}: BookingFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({});
  const totalSteps = 2;
  
  // Step 1 form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      serviceId: "",
      stylistId: "",
      notes: "",
      emailConfirmation: true,
      smsConfirmation: false,
      date: new Date(),
    },
  });

  // Step 2 form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      preferredPaymentMethod: "CASH",
    },
  });

  // Watch service, stylist, and date fields to update the selectedBooking state
  const watchedServiceId = step1Form.watch("serviceId");
  const watchedStylistId = step1Form.watch("stylistId");
  
  // Update the form when selectedBooking changes
  useEffect(() => {
    if (selectedBooking.serviceId !== null && selectedBooking.serviceId !== watchedServiceId) {
      step1Form.setValue("serviceId", selectedBooking.serviceId);
    }
    
    if (selectedBooking.stylistId !== null && selectedBooking.stylistId !== watchedStylistId) {
      step1Form.setValue("stylistId", selectedBooking.stylistId);
    }
    
    if (selectedBooking.date && selectedBooking.timeSlot) {
      const dateTime = new Date(selectedBooking.timeSlot);
      step1Form.setValue("date", dateTime);
    }
  }, [selectedBooking, step1Form, watchedServiceId, watchedStylistId]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return apiRequest("/api/appointments", "POST", data);
    },
    onSuccess: async (response) => {
      const responseData = await response.json();
      
      const selectedService = services?.find(service => service.id === watchedServiceId);
      const selectedStylist = stylists?.find(stylist => stylist.id === watchedStylistId);
      
      onConfirmation({
        appointment: responseData.appointment,
        service: selectedService,
        stylist: selectedStylist,
        confirmations: responseData.confirmations,
      });
      
      // Reset the forms
      step1Form.reset();
      step2Form.reset();
      setCurrentStep(1);
      setStep1Data({});
      setSelectedBooking({
        date: null,
        timeSlot: null,
        serviceId: null,
        stylistId: null,
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an issue booking your appointment. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  // Handle step 1 completion
  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  // Handle step 2 completion (final submission)
  const handleStep2Submit = (data: Step2Data) => {
    const combinedData = { ...step1Data, ...data } as FormData;
    mutation.mutate(combinedData);
  };

  // Handle going back to step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const selectedDateTime = selectedBooking.date && selectedBooking.timeSlot
    ? new Date(selectedBooking.timeSlot)
    : null;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step 1: Booking Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Booking Details
            </CardTitle>
            <CardDescription>
              Please provide your information and select your preferred service and time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
        <FormField
          control={step1Form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Service</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedBooking({...selectedBooking, serviceId: value});
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()} data-testid={`option-service-${service.id}`}>
                      {service.name} - {service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={step1Form.control}
          name="stylistId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Stylist</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedBooking({...selectedBooking, stylistId: value, timeSlot: null});
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-stylist">
                    <SelectValue placeholder="Any available stylist" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stylists?.map((stylist) => (
                    <SelectItem key={stylist.id} value={stylist.id} data-testid={`option-stylist-${stylist.id}`}>
                      {stylist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedDateTime && (
          <div className="p-4 bg-neutral rounded-md" data-testid="selected-appointment-display">
            <p className="font-medium">Selected Appointment:</p>
            <p className="text-primary" data-testid="text-selected-datetime">
              {selectedDateTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedDateTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
          </div>
        )}
        
        <FormField
          control={step1Form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" data-testid="input-client-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={step1Form.control}
          name="clientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" data-testid="input-client-email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={step1Form.control}
          name="clientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" data-testid="input-client-phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={step1Form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special requests or notes for your stylist..." 
                  className="resize-none" 
                  data-testid="textarea-notes"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <div className="flex flex-wrap items-center space-x-6">
          <FormField
            control={step1Form.control}
            name="smsConfirmation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-sms-confirmation"
                  />
                </FormControl>
                <FormLabel className="text-gray-700">Text confirmation</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={step1Form.control}
            name="emailConfirmation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-email-confirmation"
                  />
                </FormControl>
                <FormLabel className="text-gray-700">Email confirmation</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-md transition"
                  disabled={
                    !selectedBooking.date || 
                    !selectedBooking.timeSlot || 
                    !selectedBooking.serviceId || 
                    !selectedBooking.stylistId
                  }
                  data-testid="button-continue-to-payment"
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Continue to Payment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment Method */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Payment Method
            </CardTitle>
            <CardDescription>
              Choose how you'd like to pay for your service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...step2Form}>
              <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                <FormField
                  control={step2Form.control}
                  name="preferredPaymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">Select Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 gap-4"
                          data-testid="radio-group-payment-method"
                        >
                          <div className="flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value="CASH" id="cash" data-testid="radio-payment-cash" />
                            <Label htmlFor="cash" className="flex-1 cursor-pointer">
                              <div className="flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                  <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-base">Pay with Cash</div>
                                  <div className="text-sm text-muted-foreground">Pay in person at the time of your appointment</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value="ONLINE" id="online" data-testid="radio-payment-online" />
                            <Label htmlFor="online" className="flex-1 cursor-pointer">
                              <div className="flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                  <CreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-base">Pay Online (Stripe)</div>
                                  <div className="text-sm text-muted-foreground">Secure online payment with credit/debit card</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToStep1}
                    className="flex-1"
                    data-testid="button-back-to-details"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Details
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-secondary text-white font-semibold"
                    disabled={mutation.isPending}
                    data-testid="button-complete-booking"
                  >
                    {mutation.isPending ? "Processing..." : "Complete Booking"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
