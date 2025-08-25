import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'wouter';

interface Client {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  industry: string;
}

interface ClientService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

export default function ClientWebsite() {
  const { clientId } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ClientService | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    appointmentDate: '',
    startTime: '',
    notes: ''
  });
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const { data: client } = useQuery<Client>({
    queryKey: [`/api/public/client/${clientId}`]
  });

  // Fetch available time slots when date changes
  useEffect(() => {
    if (bookingForm.appointmentDate && selectedService && clientId) {
      fetch(`/api/public/client/${clientId}/available-slots?date=${bookingForm.appointmentDate}&serviceId=${selectedService.id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Available slots response:', data);
          if (Array.isArray(data)) {
            setAvailableTimeSlots(data);
          } else if (data.timeSlots) {
            setAvailableTimeSlots(data.timeSlots);
          }
        })
        .catch((error) => {
          console.error('Error fetching time slots:', error);
          setAvailableTimeSlots([]);
        });
    } else {
      setAvailableTimeSlots([]);
    }
  }, [bookingForm.appointmentDate, selectedService, clientId]);

  const { data: services = [] } = useQuery<ClientService[]>({
    queryKey: [`/api/public/client/${clientId}/services`]
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/public/client/${clientId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to book appointment');
      return response.json();
    },
    onSuccess: () => {
      setIsBookingModalOpen(false);
      setBookingForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        appointmentDate: '',
        startTime: '',
        notes: ''
      });
      alert('Appointment booked successfully! You will receive a confirmation email.');
    },
    onError: () => {
      alert('Failed to book appointment. Please try again.');
    }
  });

  const handleBooking = (service: ClientService) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!selectedService) return;
    
    bookingMutation.mutate({
      serviceId: selectedService.id,
      ...bookingForm
    });
  };

  const handleHeroBookingClick = () => {
    if (services.length === 1) {
      // If only one service, directly open booking modal
      handleBooking(services[0]);
    } else if (services.length > 1) {
      // If multiple services, scroll to services section
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // No services available
      alert('No services are currently available for booking. Please contact us directly.');
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600">This business page is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{client.businessName}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Professional {client.industry} services
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleHeroBookingClick}>
              Book Appointment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact Info */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">{client.phone || 'Contact for phone'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">{client.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">{client.businessAddress || 'Contact for address'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div id="services-section" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600">Choose from our professional services</p>
          </div>
          
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Services will be available soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.filter(service => service.isActive).map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{service.durationMinutes}min</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleBooking(service)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About {client.businessName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              Welcome to {client.businessName}, your trusted partner for professional {client.industry.toLowerCase()} services. 
              Led by {client.contactPerson}, we are committed to providing exceptional service and ensuring your complete satisfaction.
              Book an appointment today and experience the difference our expertise makes.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-gray-600">5.0 rating</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {selectedService?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={bookingForm.customerName}
                onChange={(e) => setBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={bookingForm.customerEmail}
                onChange={(e) => setBookingForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={bookingForm.customerPhone}
                onChange={(e) => setBookingForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={bookingForm.appointmentDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Time *</Label>
                <Select value={bookingForm.startTime} onValueChange={(value) => setBookingForm(prev => ({ ...prev, startTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        {bookingForm.appointmentDate ? 'No available slots for this date' : 'Please select a date first'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
            {selectedService && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{selectedService.name}</span>
                  <span className="font-bold">${selectedService.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Duration: {selectedService.durationMinutes} minutes</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.appointmentDate || !bookingForm.startTime}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}