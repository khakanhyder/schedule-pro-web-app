import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotsProps {
  selectedDate: Date | null;
  selectedStylistId: string | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string) => void;
  clientId: string;
}

export default function TimeSlots({ 
  selectedDate, 
  selectedStylistId, 
  selectedTimeSlot, 
  onSelectTimeSlot,
  clientId
}: TimeSlotsProps) {
  const { data: timeSlots, isLoading } = useQuery<string[]>({
    queryKey: [
      `/api/public/client/${clientId}/available-slots`, 
      selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
    ],
    enabled: !!selectedDate,
  });

  if (!selectedDate) {
    return null;
  }

  const formattedDate = format(selectedDate, "MMM d, yyyy");

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-3">
        Available Times for {formattedDate}
      </h4>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : !timeSlots || timeSlots.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          No available time slots for this date.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {timeSlots.map((timeSlot) => {
            const isSelected = selectedTimeSlot === timeSlot;
            
            return (
              <button
                key={timeSlot}
                data-testid={`time-slot-${timeSlot.replace(':', '')}`}
                onClick={() => onSelectTimeSlot(timeSlot)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isSelected 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {timeSlot}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
