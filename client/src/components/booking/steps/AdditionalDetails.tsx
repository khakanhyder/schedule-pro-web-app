import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bell, Mail, Smartphone, Users, CheckCircle } from "lucide-react";
import { type BookingData } from "@shared/schema";

const additionalDetailsSchema = z.object({
  specialRequests: z.string().optional(),
  howHeardAboutUs: z.string().optional(),
  emailConfirmation: z.boolean().default(true),
  smsConfirmation: z.boolean().default(false),
});

type AdditionalDetailsData = z.infer<typeof additionalDetailsSchema>;

interface AdditionalDetailsProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
}

const howHeardOptions = [
  { value: "google", label: "Google Search" },
  { value: "social", label: "Social Media" },
  { value: "friend", label: "Friend/Family Referral" },
  { value: "website", label: "Your Website" },
  { value: "advertisement", label: "Advertisement" },
  { value: "walk_by", label: "Walked By Location" },
  { value: "previous_client", label: "Previous Client" },
  { value: "other", label: "Other" },
];

export default function AdditionalDetails({ 
  bookingData, 
  updateBookingData 
}: AdditionalDetailsProps) {
  const form = useForm<AdditionalDetailsData>({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      specialRequests: bookingData.specialRequests || "",
      howHeardAboutUs: bookingData.howHeardAboutUs || "",
      emailConfirmation: bookingData.emailConfirmation ?? true,
      smsConfirmation: bookingData.smsConfirmation ?? false,
    },
  });

  // Watch form values and update booking data
  const watchedValues = form.watch();
  
  useEffect(() => {
    const { specialRequests, howHeardAboutUs, emailConfirmation, smsConfirmation } = watchedValues;
    updateBookingData({
      specialRequests: specialRequests || "",
      howHeardAboutUs: howHeardAboutUs || "",
      emailConfirmation: emailConfirmation ?? true,
      smsConfirmation: smsConfirmation ?? false,
    });
  }, [watchedValues, updateBookingData]);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
        <p className="text-gray-600">Help us provide you with the best possible service</p>
      </div>

      <Form {...form}>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Special Requests
              </CardTitle>
              <CardDescription>
                Let us know about any specific needs, preferences, or concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Examples: Allergies, preferred styling techniques, accessibility needs, parking requirements, etc..."
                        className="resize-none min-h-[120px]"
                        data-testid="textarea-special-requests"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us prepare for your visit and ensure your comfort
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* How Did You Hear About Us */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                How Did You Hear About Us?
              </CardTitle>
              <CardDescription>
                Help us understand how our clients find us (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="howHeardAboutUs"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-how-heard">
                          <SelectValue placeholder="Please select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {howHeardOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            data-testid={`option-how-heard-${option.value}`}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Communication Preferences
              </CardTitle>
              <CardDescription>
                Choose how you'd like to receive appointment confirmations and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emailConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-email-confirmation"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Email Confirmation & Reminders
                      </FormLabel>
                      <FormDescription>
                        Receive booking confirmation and appointment reminders via email
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-sms-confirmation"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        SMS Text Reminders
                      </FormLabel>
                      <FormDescription>
                        Get text message reminders about your upcoming appointment
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Summary of Communication Preferences */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Communication Summary</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.watch("emailConfirmation") && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Mail className="w-3 h-3 mr-1" />
                  Email notifications
                </Badge>
              )}
              {form.watch("smsConfirmation") && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Smartphone className="w-3 h-3 mr-1" />
                  SMS reminders
                </Badge>
              )}
              {!form.watch("emailConfirmation") && !form.watch("smsConfirmation") && (
                <Badge variant="outline" className="text-gray-600">
                  No automatic notifications
                </Badge>
              )}
            </div>
            <p className="text-blue-700 text-sm mt-2">
              You can always call us directly if you need to make changes to your appointment.
            </p>
          </div>

          {/* Optional Completion Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Almost Done!</h4>
            </div>
            <p className="text-green-700 text-sm">
              You're all set with the details. Click "Next" to proceed to payment options.
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}