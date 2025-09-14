import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface LeadFormProps {
  clientId: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  className?: string;
}

interface ClientService {
  id: string;
  name: string;
  price: string;
  description: string;
  durationMinutes: number;
}

export default function LeadForm({ 
  clientId, 
  title = "Get Your Quote", 
  description = "Tell us about your needs and we'll contact you with a personalized quote.",
  buttonText = "Get My Quote",
  buttonColor = "#10B981",
  className = ""
}: LeadFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client services for the source dropdown
  const { data: clientServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: [`/api/public/client/${clientId}/services`],
    queryFn: async () => {
      const response = await fetch(`/api/public/client/${clientId}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    }
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: '',
    estimatedBudget: '',
    contactMethod: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/public/client/${clientId}/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: result.message || "We'll contact you within 24 hours with your personalized quote.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceInterest: '',
          estimatedBudget: '',
          contactMethod: '',
          notes: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit lead form');
      }
    } catch (error) {
      console.error('Lead form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lead-name">Your Name *</Label>
          <Input
            id="lead-name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lead-email">Email Address *</Label>
          <Input
            id="lead-email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lead-phone">Phone Number</Label>
          <Input
            id="lead-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lead-service">Service Interest</Label>
          <Select 
            value={formData.serviceInterest || ''} 
            onValueChange={(value) => handleInputChange('serviceInterest', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a service (optional)" />
            </SelectTrigger>
            <SelectContent>
              {servicesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading services...
                </SelectItem>
              ) : clientServices.length > 0 ? (
                clientServices.map((service: ClientService) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.price}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="full-service">Full Service</SelectItem>
                  <SelectItem value="custom-project">Custom Project</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="lead-budget">Estimated Budget</Label>
          <Input
            id="lead-budget"
            type="text"
            placeholder="$1,000 - $5,000"
            value={formData.estimatedBudget}
            onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lead-contact">Preferred Contact Method</Label>
          <Select 
            value={formData.contactMethod || ''} 
            onValueChange={(value) => handleInputChange('contactMethod', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="How should we contact you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="text">Text Message</SelectItem>
              <SelectItem value="any">Any Method</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="sm:col-span-2">
          <Label htmlFor="lead-notes">Project Details</Label>
          <Textarea
            id="lead-notes"
            placeholder="Tell us about your project, timeline, specific requirements, or any questions you have..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-medium py-3"
            style={{ backgroundColor: buttonColor }}
          >
            {isSubmitting ? 'Submitting...' : buttonText}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            We'll contact you within 24 hours with a personalized quote
          </p>
        </div>
      </form>
    </div>
  );
}