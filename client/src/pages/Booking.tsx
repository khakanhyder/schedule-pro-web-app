import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import BookingForm from "@/components/booking/BookingForm";
import Calendar from "@/components/booking/Calendar";
import TimeSlots from "@/components/booking/TimeSlots";
import ConfirmationModal from "@/components/booking/ConfirmationModal";
import SmartSchedulingSuggestions from "@/components/booking/SmartSchedulingSuggestions";
import { type ClientService, type Stylist, type Appointment } from "@shared/schema";

export interface SelectedBooking {
  date: Date | null;
  timeSlot: string | null;
  serviceId: string | null;
  stylistId: string | null;
}

export default function Booking() {
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking>({
    date: null,
    timeSlot: null,
    serviceId: null,
    stylistId: null,
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    appointment: Appointment;
    service: ClientService | undefined;
    stylist: Stylist | undefined;
    confirmations: string[];
  } | null>(null);

  // Fetch services and stylists data
  const { data: services } = useQuery<ClientService[]>({
    queryKey: ["/api/public/client/client_1/services"],
  });
  
  const { data: stylists } = useQuery<Stylist[]>({
    queryKey: ["/api/public/clients/client_1/website-staff"],
  });

  // Get selected service and stylist objects
  const selectedService = services?.find(service => service.id === selectedBooking.serviceId);
  const selectedStylist = stylists?.find(stylist => stylist.id === selectedBooking.stylistId);

  // Handle appointment confirmation
  const handleConfirmation = (data: {
    appointment: Appointment;
    service: ClientService | undefined;
    stylist: Stylist | undefined;
    confirmations: string[];
  }) => {
    setConfirmationData(data);
    setShowConfirmation(true);
  };

  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Book Your Appointment</h2>
          <p className="text-muted-foreground text-lg">
            Follow these simple steps to schedule your appointment
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="hidden md:flex justify-center items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedBooking.serviceId ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Choose Service</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedBooking.stylistId ? 'bg-green-600 text-white' : 
                selectedBooking.serviceId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Choose Staff</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedBooking.date ? 'bg-green-600 text-white' : 
                selectedBooking.stylistId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Pick Date & Time</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedBooking.timeSlot ? 'bg-green-600 text-white' : 
                selectedBooking.date ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                4
              </div>
              <span className="ml-2 text-sm font-medium">Confirm Details</span>
            </div>
          </div>
          
          {/* Mobile Progress */}
          <div className="md:hidden text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Step {selectedBooking.timeSlot ? 4 : selectedBooking.date ? 3 : selectedBooking.stylistId ? 2 : 1} of 4
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`w-3 h-3 rounded-full ${
                  step === 1 || 
                  (step === 2 && selectedBooking.serviceId) || 
                  (step === 3 && selectedBooking.stylistId) || 
                  (step === 4 && selectedBooking.date)
                    ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              ))}
            </div>
          </div>
        </div>
        
        <Card className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - Form */}
            <div className="md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <BookingForm 
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
                services={services}
                stylists={stylists}
                onConfirmation={handleConfirmation}
              />
            </div>
            
            {/* Right side - Calendar */}
            <div className="md:w-1/2 p-6 md:p-8 bg-neutral">
              <Calendar 
                selectedDate={selectedBooking.date}
                onSelectDate={(date) => setSelectedBooking({...selectedBooking, date, timeSlot: null})}
              />
              
              <TimeSlots 
                selectedDate={selectedBooking.date}
                selectedStylistId={selectedBooking.stylistId}
                selectedTimeSlot={selectedBooking.timeSlot}
                onSelectTimeSlot={(timeSlot) => setSelectedBooking({...selectedBooking, timeSlot})}
              />
              
              <SmartSchedulingSuggestions
                selectedDate={selectedBooking.date}
                selectedServiceId={selectedBooking.serviceId}
                selectedStylistId={selectedBooking.stylistId}
                onTimeSlotSelect={(timeSlot) => setSelectedBooking({...selectedBooking, timeSlot})}
              />
            </div>
          </div>
        </Card>
      </div>
      
      {showConfirmation && confirmationData && (
        <ConfirmationModal 
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          data={confirmationData}
        />
      )}
    </section>
  );
}
