import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useIndustry } from "@/lib/industryContext";
import { 
  Scissors, Wrench, Heart, PawPrint, Palette,
  Users, Clock, DollarSign, MapPin, Star,
  CheckCircle, ArrowRight, Camera, Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IndustryOnboarding() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const getIndustrySteps = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          1: {
            title: "Your Beauty Business Details",
            description: "Tell us about your salon or studio",
            fields: [
              { name: "business_name", label: "Salon/Studio Name", type: "text", required: true },
              { name: "specialties", label: "Main Specialties", type: "multiselect", options: ["Hair Cutting", "Hair Coloring", "Styling", "Extensions", "Keratin Treatments", "Nail Services", "Facials", "Lash Extensions", "Microblading", "Makeup"] },
              { name: "experience_years", label: "Years in Business", type: "select", options: ["New (0-1 years)", "Growing (2-5 years)", "Established (6-15 years)", "Veteran (15+ years)"] },
              { name: "location_type", label: "Business Type", type: "select", options: ["Home-based Studio", "Salon Suite Rental", "Full Service Salon", "Mobile Services", "Spa/Wellness Center"] }
            ]
          },
          2: {
            title: "Your Clientele & Services",
            description: "Help us understand your target market",
            fields: [
              { name: "target_demographics", label: "Primary Client Demographics", type: "multiselect", options: ["Young Professionals (25-35)", "Busy Moms (30-45)", "Mature Women (45+)", "Bridal Clients", "Fashion-Forward (18-30)", "Male Grooming", "Teens/Young Adults"] },
              { name: "price_range", label: "Service Price Range", type: "select", options: ["Budget-Friendly ($25-75)", "Mid-Range ($75-150)", "Premium ($150-300)", "Luxury ($300+)"] },
              { name: "booking_preferences", label: "How do clients usually book?", type: "multiselect", options: ["Phone Calls", "Walk-ins", "Social Media DMs", "Website", "Apps", "Referrals"] },
              { name: "busy_times", label: "Peak Hours", type: "multiselect", options: ["Early Morning (7-9am)", "Mid Morning (9-11am)", "Lunch (11am-2pm)", "Afternoon (2-5pm)", "Evening (5-8pm)", "Weekends"] }
            ]
          },
          3: {
            title: "Business Operations",
            description: "Set up your workflow preferences",
            fields: [
              { name: "consultation_required", label: "Require consultations for color services?", type: "checkbox" },
              { name: "cancellation_policy", label: "Cancellation Policy", type: "select", options: ["24 hours notice", "48 hours notice", "Same day OK", "No cancellations"] },
              { name: "payment_methods", label: "Accepted Payments", type: "multiselect", options: ["Cash", "Credit Cards", "Venmo", "CashApp", "Zelle", "PayPal", "Apple Pay"] },
              { name: "product_sales", label: "Do you sell hair/beauty products?", type: "checkbox" },
              { name: "social_media_focus", label: "Main Social Platform", type: "select", options: ["Instagram", "TikTok", "Facebook", "Pinterest", "None"] }
            ]
          },
          4: {
            title: "Marketing & Growth Goals",
            description: "How can we help you grow?",
            fields: [
              { name: "growth_goals", label: "Primary Business Goals", type: "multiselect", options: ["Increase bookings", "Raise prices", "Expand services", "Improve retention", "Social media growth", "Referral program"] },
              { name: "marketing_budget", label: "Monthly Marketing Budget", type: "select", options: ["$0-100", "$100-300", "$300-500", "$500+"] },
              { name: "challenges", label: "Biggest Challenges", type: "multiselect", options: ["No-shows", "Last-minute cancellations", "Slow periods", "Competition", "Pricing", "Time management", "Client retention"] },
              { name: "success_metric", label: "How do you measure success?", type: "select", options: ["Number of clients", "Revenue per month", "Bookings per week", "Client satisfaction", "Social media followers"] }
            ]
          }
        };

      case 'trades':
        return {
          1: {
            title: "Your Trade Business",
            description: "Tell us about your contracting business",
            fields: [
              { name: "business_name", label: "Company Name", type: "text", required: true },
              { name: "trade_specialties", label: "Primary Services", type: "multiselect", options: ["Plumbing", "Electrical", "HVAC", "Carpentry", "Roofing", "Flooring", "Painting", "Drywall", "Kitchen Remodeling", "Bathroom Remodeling", "General Contracting"] },
              { name: "service_area", label: "Service Radius", type: "select", options: ["Local (5-10 miles)", "City-wide (15-25 miles)", "Regional (25-50 miles)", "State-wide (50+ miles)"] },
              { name: "crew_size", label: "Team Size", type: "select", options: ["Solo operator", "2-3 people", "4-8 people", "8+ people"] }
            ]
          },
          2: {
            title: "Project Types & Clients",
            description: "What kind of work do you focus on?",
            fields: [
              { name: "project_types", label: "Typical Project Types", type: "multiselect", options: ["Emergency repairs", "Routine maintenance", "Home improvements", "New construction", "Commercial work", "Insurance claims"] },
              { name: "client_types", label: "Primary Clients", type: "multiselect", options: ["Homeowners", "Property managers", "Real estate agents", "General contractors", "Commercial businesses", "Insurance companies"] },
              { name: "project_size", label: "Average Project Value", type: "select", options: ["Small jobs ($100-500)", "Medium projects ($500-2000)", "Large projects ($2000-10000)", "Major renovations ($10000+)"] },
              { name: "scheduling_preference", label: "Preferred Scheduling", type: "select", options: ["Same day service", "Next day", "Within a week", "Planned in advance"] }
            ]
          },
          3: {
            title: "Operations & Licensing",
            description: "Business requirements and processes",
            fields: [
              { name: "licenses", label: "Required Licenses/Certifications", type: "multiselect", options: ["General contractor", "Electrical license", "Plumbing license", "HVAC certification", "Roofing license", "Bonded", "Insured"] },
              { name: "estimate_process", label: "How do you handle estimates?", type: "select", options: ["Free estimates", "Paid consultations", "Phone estimates", "On-site required"] },
              { name: "warranty_offered", label: "Warranty Period", type: "select", options: ["30 days", "90 days", "1 year", "2+ years", "Varies by job"] },
              { name: "emergency_services", label: "Offer 24/7 emergency service?", type: "checkbox" },
              { name: "material_sourcing", label: "How do you handle materials?", type: "select", options: ["Client purchases", "I purchase/markup", "Both options", "Depends on job"] }
            ]
          },
          4: {
            title: "Business Growth",
            description: "Your expansion and marketing strategy",
            fields: [
              { name: "lead_sources", label: "Main Lead Sources", type: "multiselect", options: ["Word of mouth", "Google/SEO", "Home advisor", "Angie's List", "Social media", "Direct mail", "Vehicle signage", "Networking"] },
              { name: "growth_focus", label: "Growth Priorities", type: "multiselect", options: ["More customers", "Higher value jobs", "Expand service area", "Add services", "Hire employees", "Better margins"] },
              { name: "technology_comfort", label: "Comfort with Technology", type: "select", options: ["Prefer simple tools", "Moderately tech-savvy", "Very comfortable", "Early adopter"] },
              { name: "biggest_challenge", label: "Biggest Business Challenge", type: "select", options: ["Finding quality leads", "Scheduling efficiently", "Managing cash flow", "Competition", "Hiring help", "Material costs"] }
            ]
          }
        };

      case 'wellness':
        return {
          1: {
            title: "Your Wellness Practice",
            description: "Tell us about your healing journey",
            fields: [
              { name: "practice_name", label: "Practice/Studio Name", type: "text", required: true },
              { name: "wellness_modalities", label: "Services Offered", type: "multiselect", options: ["Massage Therapy", "Acupuncture", "Yoga Classes", "Personal Training", "Nutrition Counseling", "Life Coaching", "Reiki", "Meditation", "Pilates", "Mental Health Counseling"] },
              { name: "practice_philosophy", label: "Approach to Wellness", type: "select", options: ["Holistic/Alternative", "Traditional/Medical", "Fitness-focused", "Mind-body connection", "Spiritual wellness"] },
              { name: "setting_type", label: "Practice Setting", type: "select", options: ["Home studio", "Wellness center", "Private practice", "Spa/resort", "Gym/fitness center", "Mobile services"] }
            ]
          },
          2: {
            title: "Your Clients & Specializations",
            description: "Who do you serve and how?",
            fields: [
              { name: "client_focus", label: "Primary Client Types", type: "multiselect", options: ["Stress management", "Pain relief", "Athletes/fitness", "Chronic conditions", "Mental health", "Spiritual growth", "Weight management", "Seniors", "Pregnant women"] },
              { name: "session_types", label: "Session Formats", type: "multiselect", options: ["Individual sessions", "Group classes", "Workshops", "Retreats", "Online sessions", "Package deals"] },
              { name: "price_structure", label: "Pricing Model", type: "select", options: ["Per session", "Package deals", "Monthly memberships", "Sliding scale", "Insurance billing"] },
              { name: "session_duration", label: "Typical Session Length", type: "select", options: ["30 minutes", "60 minutes", "90 minutes", "2+ hours", "Varies"] }
            ]
          },
          3: {
            title: "Practice Management",
            description: "How you run your wellness business",
            fields: [
              { name: "intake_process", label: "New client intake includes", type: "multiselect", options: ["Health history", "Goals assessment", "Consultation", "Consent forms", "Payment setup"] },
              { name: "progress_tracking", label: "How do you track client progress?", type: "multiselect", options: ["Session notes", "Goal tracking", "Check-in surveys", "Measurements", "Photos", "Client journals"] },
              { name: "cancellation_policy", label: "Cancellation Policy", type: "select", options: ["24 hours notice", "Same day OK", "No refunds", "Credit for future"] },
              { name: "continuing_education", label: "How often do you update training?", type: "select", options: ["Annually", "Bi-annually", "Quarterly", "As needed", "Rarely"] }
            ]
          },
          4: {
            title: "Growth & Community",
            description: "Building your wellness community",
            fields: [
              { name: "growth_vision", label: "Practice Growth Goals", type: "multiselect", options: ["More clients", "Higher rates", "Expand modalities", "Group programs", "Online offerings", "Retreat hosting", "Teaching/training"] },
              { name: "community_building", label: "Community Engagement", type: "multiselect", options: ["Social media wellness tips", "Free workshops", "Referral network", "Wellness challenges", "Newsletter", "Collaboration with other practitioners"] },
              { name: "measurement_focus", label: "Success Metrics", type: "select", options: ["Client transformations", "Session bookings", "Revenue growth", "Community size", "Referrals", "Personal fulfillment"] },
              { name: "biggest_challenge", label: "Main Challenge", type: "select", options: ["Attracting ideal clients", "Pricing services", "Scheduling consistently", "Marketing authentically", "Avoiding burnout", "Managing boundaries"] }
            ]
          }
        };

      // Similar detailed flows for pet-care and creative...
      default:
        return {
          1: { title: "Business Details", description: "Tell us about your business", fields: [] }
        };
    }
  };

  const steps = getIndustrySteps();
  const currentStep = steps[step];

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              required={field.required}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Select onValueChange={(value) => setFormData({...formData, [field.name]: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {field.options?.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    onCheckedChange={(checked) => {
                      const current = formData[field.name] || [];
                      if (checked) {
                        setFormData({...formData, [field.name]: [...current, option]});
                      } else {
                        setFormData({...formData, [field.name]: current.filter(item => item !== option)});
                      }
                    }}
                  />
                  <Label htmlFor={`${field.name}-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              onCheckedChange={(checked) => setFormData({...formData, [field.name]: checked})}
            />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast({
        title: "Setup Complete!",
        description: `Your ${selectedIndustry.name} business profile has been configured.`
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-6 w-6 text-pink-600" />;
      case 'trades': return <Wrench className="h-6 w-6 text-orange-600" />;
      case 'wellness': return <Heart className="h-6 w-6 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-6 w-6 text-amber-600" />;
      case 'creative': return <Palette className="h-6 w-6 text-purple-600" />;
      default: return <Users className="h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {getIndustryIcon()}
          <h1 className="text-3xl font-bold">
            Welcome to Your {selectedIndustry.name} Setup
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let's customize Scheduled specifically for your {selectedIndustry.name} business. 
          This will only take a few minutes and will personalize everything for your needs.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {step}
            </span>
            {currentStep?.title}
          </CardTitle>
          <CardDescription>{currentStep?.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStep?.fields?.map(field => renderField(field))}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>

            <Button onClick={handleNext} className="flex items-center gap-2">
              {step === totalSteps ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Your data is secure</h3>
              <p className="text-sm text-muted-foreground">
                All information is encrypted and used only to personalize your {selectedIndustry.name} experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}