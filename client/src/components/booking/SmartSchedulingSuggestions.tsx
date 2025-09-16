import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Clock, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SmartSchedulingSuggestionsProps {
  selectedDate: Date | null;
  selectedServiceId: string | null;
  selectedStylistId: string | null;
  onTimeSlotSelect?: (timeSlot: string) => void;
}

export default function SmartSchedulingSuggestions({
  selectedDate,
  selectedServiceId,
  selectedStylistId,
  onTimeSlotSelect
}: SmartSchedulingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch AI scheduling suggestions when inputs change
  const { data: aiSuggestions, isLoading } = useQuery({
    queryKey: ['/api/ai/scheduling-suggestions', selectedDate?.toISOString(), selectedServiceId, selectedStylistId],
    queryFn: () => {
      if (!selectedDate || !selectedServiceId) return Promise.resolve({ suggestions: [] });
      
      const params = new URLSearchParams({
        date: selectedDate.toISOString(),
        serviceId: selectedServiceId,
        ...(selectedStylistId && { stylistId: selectedStylistId })
      });
      
      return apiRequest('GET', `/api/ai/scheduling-suggestions?${params}`).then(res => res.json());
    },
    enabled: !!selectedDate && !!selectedServiceId
  });

  useEffect(() => {
    if (aiSuggestions?.suggestions) {
      setSuggestions(aiSuggestions.suggestions);
    }
  }, [aiSuggestions]);

  if (!selectedDate || !selectedServiceId || isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <Lightbulb className="h-5 w-5 mr-2" />
            <span className="text-sm">AI suggestions will appear after selecting date and service</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-blue-600" />
            Smart Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            Perfect choice! This time slot has optimal availability with minimal wait times.
          </p>
        </CardContent>
      </Card>
    );
  }

  const extractTimeSlots = (suggestion: string): string[] => {
    const timePattern = /\b\d{1,2}:\d{2}(?:\s*[AP]M)?\b/gi;
    return suggestion.match(timePattern) || [];
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          AI Scheduling Recommendations
          <Badge variant="outline" className="text-xs">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const timeSlots = extractTimeSlots(suggestion);
          const isOptimalTime = suggestion.toLowerCase().includes('best availability');
          const isPeakHour = suggestion.toLowerCase().includes('peak hours');
          
          return (
            <div key={index} className={`p-3 rounded-lg border ${
              isOptimalTime ? 'bg-green-50 border-green-200' : 
              isPeakHour ? 'bg-orange-50 border-orange-200' : 
              'bg-white border-gray-200'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {isOptimalTime && <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />}
                {isPeakHour && <Clock className="h-4 w-4 text-orange-600 mt-0.5" />}
                <p className="text-sm font-medium flex-1">{suggestion}</p>
              </div>
              
              {timeSlots.length > 0 && onTimeSlotSelect && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {timeSlots.slice(0, 3).map((timeSlot, timeIndex) => (
                    <Button
                      key={timeIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => onTimeSlotSelect(timeSlot)}
                      className={`text-xs ${
                        isOptimalTime ? 'border-green-300 hover:bg-green-100' :
                        isPeakHour ? 'border-orange-300 hover:bg-orange-100' :
                        'hover:bg-gray-100'
                      }`}
                    >
                      Select {timeSlot}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Why these suggestions?</h4>
          <p className="text-xs text-blue-600">
            AI analyzes booking patterns, travel time optimization, and demand forecasting to recommend the best appointment times for both client convenience and business efficiency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}