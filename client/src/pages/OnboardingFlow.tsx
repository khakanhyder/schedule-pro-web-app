import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, ArrowLeft, ArrowRight, Building, User, CreditCard, Settings, Sparkles } from "lucide-react";

interface OnboardingSession {
  id: string;
  sessionId: string;
  planId: string;
  currentStep: number;
  isCompleted: boolean;
  businessData: any;
  plan: {
    name: string;
    price: number;
    features: string[];
  };
}

const STEPS = [
  { id: 1, title: "Plan Selection", icon: CheckCircle },
  { id: 2, title: "Business Information", icon: Building },
  { id: 3, title: "Account Creation", icon: User },
  { id: 4, title: "Payment", icon: CreditCard },
  { id: 5, title: "Business Setup", icon: Settings },
  { id: 6, title: "Welcome", icon: Sparkles },
];

export default function OnboardingFlow() {
  const [, params] = useRoute("/onboarding/:sessionId?");
  const sessionId = params?.sessionId;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery<OnboardingSession>({
    queryKey: ['/api/onboarding', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID');
      const response = await fetch(`/api/onboarding/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      return response.json();
    },
    enabled: !!sessionId
  });

  const saveStepMutation = useMutation({
    mutationFn: async ({ step, data }: { step: number; data: any }) => {
      const response = await fetch(`/api/onboarding/${sessionId}/step/${step}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding', sessionId] });
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/onboarding/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to complete onboarding');
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/client/dashboard';
    }
  });

  useEffect(() => {
    if (session) {
      setCurrentStep(session.currentStep || 1);
      setFormData(session.businessData || {});
    }
  }, [session]);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertDescription>Invalid onboarding session. Please start over.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertDescription>Onboarding session not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleNext = async () => {
    // Save current step data
    await saveStepMutation.mutateAsync({
      step: currentStep,
      data: formData[`step${currentStep}`] || {}
    });

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      completeOnboardingMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateStepData = (data: any) => {
    setFormData({
      ...formData,
      [`step${currentStep}`]: { ...formData[`step${currentStep}`], ...data }
    });
  };

  const progress = (currentStep / 6) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of 6</span>
          </div>
          <Progress value={progress} className="mb-4" />
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && <Step1PlanSelection session={session} />}
            {currentStep === 2 && <Step2BusinessInfo formData={formData.step2 || {}} updateData={updateStepData} />}
            {currentStep === 3 && <Step3AccountCreation formData={formData.step3 || {}} updateData={updateStepData} />}
            {currentStep === 4 && <Step4Payment session={session} formData={formData} />}
            {currentStep === 5 && <Step5BusinessSetup formData={formData.step5 || {}} updateData={updateStepData} />}
            {currentStep === 6 && <Step6Welcome session={session} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={saveStepMutation.isPending || completeOnboardingMutation.isPending}
          >
            {currentStep === 6 ? 'Complete Setup' : 'Next Step'}
            {currentStep !== 6 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step Components
function Step1PlanSelection({ session }: { session: OnboardingSession }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">You've selected the {session.plan.name} Plan</h2>
      <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">{session.plan.name}</h3>
        <p className="text-3xl font-bold text-blue-600 mb-4">${session.plan.price}/month</p>
        <ul className="space-y-2 text-left">
          {session.plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Step2BusinessInfo({ formData, updateData }: { formData: any; updateData: (data: any) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tell us about your business</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName || ''}
            onChange={(e) => updateData({ businessName: e.target.value })}
            placeholder="Your Business Name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson || ''}
            onChange={(e) => updateData({ contactPerson: e.target.value })}
            placeholder="Your Full Name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="businessEmail">Business Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            value={formData.businessEmail || ''}
            onChange={(e) => updateData({ businessEmail: e.target.value })}
            placeholder="business@example.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            value={formData.businessAddress || ''}
            onChange={(e) => updateData({ businessAddress: e.target.value })}
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            className="w-full p-2 border rounded-md"
            value={formData.industry || ''}
            onChange={(e) => updateData({ industry: e.target.value })}
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Consulting">Consulting</option>
            <option value="Retail">Retail</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step3AccountCreation({ formData, updateData }: { formData: any; updateData: (data: any) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create your admin account</h2>
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="adminEmail">Admin Email *</Label>
          <Input
            id="adminEmail"
            type="email"
            value={formData.adminEmail || ''}
            onChange={(e) => updateData({ adminEmail: e.target.value })}
            placeholder="admin@yourbusiness.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password || ''}
            onChange={(e) => updateData({ password: e.target.value })}
            placeholder="Create a strong password"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword || ''}
            onChange={(e) => updateData({ confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted || false}
            onChange={(e) => updateData({ termsAccepted: e.target.checked })}
            required
          />
          <Label htmlFor="termsAccepted">
            I agree to the Terms & Conditions and Privacy Policy
          </Label>
        </div>
      </div>
    </div>
  );
}

function Step4Payment({ session, formData }: { session: OnboardingSession; formData: any }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="flex justify-between mt-2">
            <span>{session.plan.name} Plan</span>
            <span>${session.plan.price}/month</span>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            🚧 Payment integration demo mode<br />
            Click "Next Step" to continue with demo setup
          </p>
        </div>
      </div>
    </div>
  );
}

function Step5BusinessSetup({ formData, updateData }: { formData: any; updateData: (data: any) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customize your setup</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="businessDescription">Business Description</Label>
          <textarea
            id="businessDescription"
            className="w-full p-2 border rounded-md"
            rows={3}
            value={formData.businessDescription || ''}
            onChange={(e) => updateData({ businessDescription: e.target.value })}
            placeholder="Tell us about your business..."
          />
        </div>
        
        <div>
          <Label htmlFor="timeZone">Time Zone</Label>
          <select
            id="timeZone"
            className="w-full p-2 border rounded-md"
            value={formData.timeZone || ''}
            onChange={(e) => updateData({ timeZone: e.target.value })}
          >
            <option value="">Select Time Zone</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step6Welcome({ session }: { session: OnboardingSession }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Welcome to SaaS Platform!</h2>
      <p className="text-gray-600 mb-6">
        Your account has been created and you're all set to start using the {session.plan.name} plan.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          You'll be redirected to your dashboard where you can start managing your business.
        </p>
      </div>
    </div>
  );
}