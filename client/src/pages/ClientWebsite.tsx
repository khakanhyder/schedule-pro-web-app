import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'wouter';
import LeadForm from '@/components/LeadForm';

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

interface WebsiteData {
  id?: string;
  clientId?: string;
  title?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  sections?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Reviews Carousel Component for Client Website
function ReviewsCarousel({ reviews, title, style }: { 
  reviews: Array<{
    id: string;
    name: string;
    rating: number;
    text: string;
    date?: string;
  }>;
  title?: string;
  style?: 'carousel' | 'grid';
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };
  
  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  if (!reviews.length) {
    return null;
  }

  if (style === 'grid') {
    return (
      <div className="py-8">
        {title && (
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{review.name}</p>
                {review.date && (
                  <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Carousel view (default)
  return (
    <div className="py-8 px-4">
      {title && (
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          {title}
        </h2>
      )}
      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center min-h-[300px] flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            {renderStars(reviews[currentIndex].rating)}
          </div>
          <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
            "{reviews[currentIndex].text}"
          </blockquote>
          <div>
            <p className="font-bold text-lg text-gray-900">{reviews[currentIndex].name}</p>
            {reviews[currentIndex].date && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(reviews[currentIndex].date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        {reviews.length > 1 && (
          <>
            <button
              onClick={prevReview}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ClientWebsite() {
  const { clientId } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ClientService | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    appointmentDate: '',
    startTime: '',
    notes: ''
  });
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const { data: client } = useQuery<Client>({
    queryKey: [`/api/public/client/${clientId}`]
  });

  const { data: websiteData } = useQuery<WebsiteData>({
    queryKey: [`/api/public/client/${clientId}/website`],
    enabled: !!clientId
  });

  // Fetch available time slots when date changes
  useEffect(() => {
    if (bookingForm.appointmentDate && bookingForm.serviceId && clientId) {
      fetch(`/api/public/client/${clientId}/available-slots?date=${bookingForm.appointmentDate}&serviceId=${bookingForm.serviceId}`)
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
  }, [bookingForm.appointmentDate, bookingForm.serviceId, clientId]);

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
        serviceId: '',
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
    setBookingForm(prev => ({ ...prev, serviceId: service.id }));
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!selectedService) return;
    
    const selectedServiceForBooking = services.find(s => s.id === bookingForm.serviceId);
    if (!selectedServiceForBooking) return;
    
    bookingMutation.mutate(bookingForm);
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

  // Helper functions for rendering sections
  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'small': return 'p-4';
      case 'large': return 'p-12';
      default: return 'p-8';
    }
  };

  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = (fontSize?: string) => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };

  // Parse website sections
  let websiteSections: any[] = [];
  if (websiteData?.sections) {
    try {
      websiteSections = JSON.parse(websiteData.sections);
    } catch (e) {
      console.error('Error parsing website sections:', e);
      websiteSections = [];
    }
  }

  // Render website sections from builder or default
  const renderWebsiteSections = () => {
    if (websiteSections.length === 0) {
      // Default hero section if no sections exist
      return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">{client.businessName}</h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 px-4">
                Professional {client.industry} services
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto" onClick={handleHeroBookingClick}>
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return websiteSections.map((section: any) => (
      <div
        key={section.id}
        className={`${getPaddingClass(section.settings?.padding)} ${getAlignmentClass(section.settings?.alignment)} min-h-[200px]`}
        style={{
          backgroundColor: section.settings?.backgroundColor || (section.type === 'hero' ? (websiteData?.primaryColor || '#3B82F6') : '#FFFFFF'),
          color: section.settings?.textColor || (section.type === 'hero' ? '#FFFFFF' : '#1F2937')
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {section.type === 'contact-info' ? (
            <>
              <h2 className="text-3xl font-bold mb-8 text-center">{section.title}</h2>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600">{section.data?.phone || client.phone || 'Contact for phone'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-600">{section.data?.email || client.email}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Visit Us</h3>
                    <p className="text-gray-600">{section.data?.address || client.businessAddress || 'Contact for address'}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : section.type === 'services' ? (
            <div id="services-section">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-4 ${getFontSizeClass(section.settings?.fontSize)}`} style={{ color: section.settings?.textColor || '#1F2937' }}>
                  {section.title}
                </h2>
                <p className="text-gray-600" style={{ color: section.settings?.textColor || '#6B7280' }}>
                  {section.content}
                </p>
              </div>
              
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Services will be available soon.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                            <span className="text-2xl font-bold" style={{ color: (websiteData?.primaryColor || '#3B82F6') }}>
                              ${service.price}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{service.durationMinutes}min</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          style={{ backgroundColor: (websiteData?.primaryColor || '#3B82F6') }}
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
          ) : section.type === 'contact-form' ? (
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message')
                  };
                  
                  fetch(`/api/public/client/${clientId}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactData)
                  }).then(() => {
                    alert('Thank you for your message! We will get back to you soon.');
                    (e.target as HTMLFormElement).reset();
                  }).catch(() => {
                    alert('Failed to send message. Please try again.');
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input name="name" id="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input name="email" id="email" type="email" placeholder="your@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input name="phone" id="phone" placeholder="(555) 123-4567" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea name="message" id="message" placeholder="How can we help you?" rows={4} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          ) : section.type === 'lead-form' ? (
            <Card>
              <CardContent className="p-6">
                <LeadForm
                  clientId={clientId || ''}
                  title={section.title}
                  description={section.content}
                  buttonText="Get My Quote"
                  buttonColor={(websiteData?.primaryColor || '#10B981')}
                />
              </CardContent>
            </Card>
          ) : section.type === 'about' ? (
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
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
          ) : (
            // Default section rendering with element support
            <>
              <h2 className={`font-bold mb-4 ${section.type === 'hero' ? 'text-3xl md:text-6xl' : 'text-2xl md:text-3xl'} ${getFontSizeClass(section.settings?.fontSize)}`}>
                {section.title}
              </h2>
              <div className={`${getFontSizeClass(section.settings?.fontSize)} whitespace-pre-wrap ${section.type === 'hero' ? 'text-lg md:text-xl opacity-90' : ''}`}>
                {section.content}
              </div>
              {section.type === 'hero' && (
                <div className="mt-6">
                  <Button 
                    size="lg" 
                    className="bg-white hover:bg-gray-100" 
                    style={{ color: (websiteData?.primaryColor || '#3B82F6') }}
                    onClick={handleHeroBookingClick}
                  >
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Render section columns and elements */}
              {section.columns && section.columns.length > 0 && (
                <div className={`grid gap-4 mt-6 ${section.columns.length === 1 ? 'grid-cols-1' : section.columns.length === 2 ? 'grid-cols-1 md:grid-cols-2' : section.columns.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                  {section.columns.map((column: any) => (
                    <div key={column.id} className="space-y-4">
                      {column.elements?.map((element: any) => (
                        <div key={element.id}>
                          {element.type === 'text' && (
                            <div 
                              style={{
                                fontSize: element.settings?.fontSize,
                                color: element.settings?.textColor,
                                backgroundColor: element.settings?.backgroundColor,
                                padding: element.settings?.padding,
                                margin: element.settings?.margin,
                                borderRadius: element.settings?.borderRadius,
                                textAlign: element.settings?.textAlign as any,
                                fontWeight: element.settings?.fontWeight
                              }}
                              className="whitespace-pre-wrap"
                            >
                              {element.content || 'Text element'}
                            </div>
                          )}
                          {element.type === 'button' && (
                            <Button 
                              style={{
                                backgroundColor: element.settings?.backgroundColor || '#3B82F6',
                                color: element.settings?.textColor || '#FFFFFF',
                                padding: element.settings?.padding || '12px 24px',
                                borderRadius: element.settings?.borderRadius || '6px'
                              }}
                              onClick={() => {
                                if (element.settings?.buttonLink) {
                                  if (element.settings.buttonLink.startsWith('http')) {
                                    window.open(element.settings.buttonLink, '_blank');
                                  } else {
                                    window.location.href = element.settings.buttonLink;
                                  }
                                }
                              }}
                            >
                              {element.content || 'Button'}
                            </Button>
                          )}
                          {element.type === 'image' && element.settings?.imageUrl && (
                            <img 
                              src={element.settings.imageUrl} 
                              alt={element.settings?.altText || element.content || ''}
                              style={{
                                width: element.settings?.width,
                                height: element.settings?.height,
                                borderRadius: element.settings?.borderRadius,
                                objectFit: element.settings?.objectFit as any || 'cover'
                              }}
                              className="max-w-full h-auto"
                            />
                          )}
                          {element.type === 'spacer' && (
                            <div 
                              style={{ 
                                backgroundColor: element.settings?.backgroundColor || 'transparent',
                                minHeight: element.settings?.height || '40px'
                              }} 
                              className="w-full"
                            />
                          )}
                          {element.type === 'reviews' && element.settings?.reviews && (
                            <ReviewsCarousel 
                              reviews={element.settings.reviews}
                              title={element.content}
                              style={element.settings.reviewStyle}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Render non-column elements directly in section */}
              {section.elements && section.elements.length > 0 && (
                <div className="mt-6 space-y-4">
                  {section.elements.map((element: any) => (
                    <div key={element.id}>
                      {element.type === 'reviews' && element.settings?.reviews && (
                        <ReviewsCarousel 
                          reviews={element.settings.reviews}
                          title={element.content}
                          style={element.settings.reviewStyle}
                        />
                      )}
                      {/* Add other element types as needed */}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render website sections from builder */}
      {renderWebsiteSections()}

      {/* Show legacy sections only when no website sections exist */}
      {websiteSections.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Contact Info */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8 sm:mb-12">
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
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="mb-12">
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
          
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // Handle contact form submission
                const formData = new FormData(e.target as HTMLFormElement);
                const contactData = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  message: formData.get('message')
                };
                
                // Submit contact form
                fetch(`/api/public/client/${clientId}/contact`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(contactData)
                }).then(() => {
                  alert('Thank you for your message! We will get back to you soon.');
                  (e.target as HTMLFormElement).reset();
                }).catch(() => {
                  alert('Failed to send message. Please try again.');
                });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input name="name" id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input name="email" id="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input name="phone" id="phone" placeholder="(555) 123-4567" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea name="message" id="message" placeholder="How can we help you?" rows={4} required />
                  </div>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md w-full mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">Service *</Label>
              <Select value={bookingForm.serviceId} onValueChange={(value) => {
                setBookingForm(prev => ({ ...prev, serviceId: value }));
                const service = services.find(s => s.id === value);
                setSelectedService(service || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price} ({service.durationMinutes}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {bookingForm.serviceId && (() => {
              const currentService = services.find(s => s.id === bookingForm.serviceId);
              return currentService && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{currentService.name}</span>
                    <span className="font-bold">${currentService.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Duration: {currentService.durationMinutes} minutes</p>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.serviceId || !bookingForm.appointmentDate || !bookingForm.startTime}
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