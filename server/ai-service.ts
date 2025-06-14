import { storage } from "./storage";
import type { Appointment, Service, Stylist, MarketingCampaign, ClientInsight, SchedulingSuggestion } from "@shared/schema";

export class AISchedulingService {
  
  /**
   * Smart Scheduling Optimization
   * Analyzes existing appointments to suggest optimal scheduling
   */
  async optimizeScheduling(date: Date, serviceId: number, stylistId?: number): Promise<string[]> {
    const appointments = await storage.getAppointmentsByDate(date);
    const service = await storage.getService(serviceId);
    const stylists = await storage.getStylists();
    
    if (!service) return [];
    
    const suggestions: string[] = [];
    const serviceDuration = service.durationMinutes || 60;
    
    // Analyze existing bookings for patterns
    const busyHours = this.analyzeBusyHours(appointments);
    const optimalTimes = this.findOptimalTimeSlots(appointments, serviceDuration);
    
    // Generate intelligent suggestions
    if (optimalTimes.length > 0) {
      suggestions.push(`Best availability: ${optimalTimes.slice(0, 3).join(', ')} - based on booking patterns`);
    }
    
    if (busyHours.length > 0) {
      suggestions.push(`Peak hours: ${busyHours.join(', ')} - consider premium pricing`);
    }
    
    // Travel time optimization for mobile services
    if (service.name.toLowerCase().includes('home') || service.name.toLowerCase().includes('mobile')) {
      const travelOptimization = this.optimizeTravel(appointments);
      if (travelOptimization) {
        suggestions.push(travelOptimization);
      }
    }
    
    return suggestions;
  }

  /**
   * Predictive Rebooking Suggestions
   * Uses booking history to predict when clients will need to rebook
   */
  async generateRebookingSuggestions(): Promise<SchedulingSuggestion[]> {
    const appointments = await storage.getAppointments();
    const suggestions: SchedulingSuggestion[] = [];
    
    // Group appointments by client email
    const clientHistory = new Map<string, Appointment[]>();
    appointments.forEach(apt => {
      const existing = clientHistory.get(apt.clientEmail) || [];
      existing.push(apt);
      clientHistory.set(apt.clientEmail, existing);
    });
    
    // Analyze patterns for each client
    for (const [clientEmail, history] of Array.from(clientHistory.entries())) {
      if (history.length >= 2) {
        const pattern = this.analyzeRebookingPattern(history);
        if (pattern) {
          const suggestion = await storage.createSchedulingSuggestion({
            suggestionType: 'rebooking',
            suggestion: `${clientEmail} typically rebooks every ${pattern.averageDays} days`,
            reasoning: `Based on ${history.length} previous appointments`,
            priority: pattern.confidence
          });
          suggestions.push(suggestion);
        }
      }
    }
    
    return suggestions;
  }

  /**
   * Dynamic Pricing Suggestions
   * Analyzes demand patterns to suggest optimal pricing
   */
  async generatePricingSuggestions(serviceId: number): Promise<SchedulingSuggestion[]> {
    const appointments = await storage.getAppointments();
    const service = await storage.getService(serviceId);
    
    if (!service) return [];
    
    const serviceAppointments = appointments.filter(apt => apt.serviceId === serviceId);
    const demandAnalysis = this.analyzeDemandPatterns(serviceAppointments);
    
    const suggestions: SchedulingSuggestion[] = [];
    
    if (demandAnalysis.highDemandHours.length > 0) {
      const suggestion = await storage.createSchedulingSuggestion({
        suggestionType: 'pricing',
        suggestion: `Consider 20% premium pricing during peak hours: ${demandAnalysis.highDemandHours.join(', ')}`,
        reasoning: `${demandAnalysis.totalBookings} bookings show consistent high demand`,
        priority: 4
      });
      suggestions.push(suggestion);
    }
    
    return suggestions;
  }

  private analyzeBusyHours(appointments: Appointment[]): string[] {
    const hourCounts = new Map<number, number>();
    
    appointments.forEach(apt => {
      const hour = new Date(apt.date).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    // Find hours with more than average bookings
    const avgBookings = Array.from(hourCounts.values()).reduce((a, b) => a + b, 0) / hourCounts.size;
    const busyHours: string[] = [];
    
    hourCounts.forEach((count, hour) => {
      if (count > avgBookings * 1.5) {
        busyHours.push(`${hour}:00`);
      }
    });
    
    return busyHours.sort();
  }

  private findOptimalTimeSlots(appointments: Appointment[], duration: number): string[] {
    // Business hours: 9 AM to 7 PM
    const businessHours = Array.from({length: 10}, (_, i) => i + 9);
    const bookedHours = new Set(appointments.map(apt => new Date(apt.date).getHours()));
    
    // Find available slots with buffer time
    const optimalSlots: string[] = [];
    businessHours.forEach(hour => {
      if (!bookedHours.has(hour) && !bookedHours.has(hour - 1) && !bookedHours.has(hour + 1)) {
        optimalSlots.push(`${hour}:00`);
      }
    });
    
    return optimalSlots;
  }

  private optimizeTravel(appointments: Appointment[]): string | null {
    // Simple travel optimization logic
    if (appointments.length >= 2) {
      return "Group nearby appointments to minimize travel time";
    }
    return null;
  }

  private analyzeRebookingPattern(history: Appointment[]): { averageDays: number; confidence: number } | null {
    if (history.length < 2) return null;
    
    const sortedHistory = history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const intervals: number[] = [];
    
    for (let i = 1; i < sortedHistory.length; i++) {
      const daysDiff = Math.floor(
        (new Date(sortedHistory[i].date).getTime() - new Date(sortedHistory[i-1].date).getTime()) / (1000 * 60 * 60 * 24)
      );
      intervals.push(daysDiff);
    }
    
    const averageDays = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    const consistency = this.calculateConsistency(intervals);
    
    return {
      averageDays,
      confidence: Math.min(5, Math.floor(consistency * 5))
    };
  }

  private analyzeDemandPatterns(appointments: Appointment[]) {
    const hourCounts = new Map<number, number>();
    appointments.forEach(apt => {
      const hour = new Date(apt.date).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    const avgDemand = Array.from(hourCounts.values()).reduce((a, b) => a + b, 0) / hourCounts.size;
    const highDemandHours: string[] = [];
    
    hourCounts.forEach((count, hour) => {
      if (count > avgDemand * 1.3) {
        highDemandHours.push(`${hour}:00`);
      }
    });
    
    return {
      totalBookings: appointments.length,
      highDemandHours,
      averageDemand: Math.round(avgDemand)
    };
  }

  private calculateConsistency(values: number[]): number {
    if (values.length <= 1) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 1 - (stdDev / mean));
  }
}

export class MarketingAutomationService {
  
  /**
   * Generate personalized marketing content based on client history
   */
  async generateMarketingContent(type: string, clientEmail?: string): Promise<string> {
    const templates = {
      review_request: this.getReviewRequestTemplates(),
      rebook_reminder: this.getRebookReminderTemplates(),
      promotional: this.getPromotionalTemplates(),
      follow_up: this.getFollowUpTemplates()
    };
    
    const templateSet = templates[type as keyof typeof templates] || templates.promotional;
    const randomTemplate = templateSet[Math.floor(Math.random() * templateSet.length)];
    
    // Personalize based on client history if email provided
    if (clientEmail) {
      const insights = await storage.getClientInsights(clientEmail);
      return this.personalizeContent(randomTemplate, insights);
    }
    
    return randomTemplate;
  }

  /**
   * Create automated marketing campaigns
   */
  async createAutomatedCampaign(type: string, targetCriteria: any): Promise<MarketingCampaign> {
    const content = await this.generateMarketingContent(type);
    
    const campaign = await storage.createMarketingCampaign({
      name: `${type.replace('_', ' ').toUpperCase()} - ${new Date().toLocaleDateString()}`,
      type,
      targetAudience: JSON.stringify(targetCriteria),
      content,
      schedule: JSON.stringify({
        frequency: 'weekly',
        dayOfWeek: 1, // Monday
        time: '10:00'
      })
    });
    
    return campaign;
  }

  /**
   * Generate client insights for better targeting
   */
  async generateClientInsights(clientEmail: string): Promise<ClientInsight[]> {
    const appointments = await storage.getAppointments();
    const clientAppointments = appointments.filter(apt => apt.clientEmail === clientEmail);
    
    if (clientAppointments.length === 0) return [];
    
    const insights: ClientInsight[] = [];
    
    // Loyalty Score
    const loyaltyScore = this.calculateLoyaltyScore(clientAppointments);
    insights.push(await storage.createClientInsight({
      clientEmail,
      insightType: 'loyalty_score',
      data: JSON.stringify({ score: loyaltyScore, level: this.getLoyaltyLevel(loyaltyScore) }),
      confidence: 0.9
    }));
    
    // Service Preferences
    const preferences = this.analyzeServicePreferences(clientAppointments);
    insights.push(await storage.createClientInsight({
      clientEmail,
      insightType: 'preferences',
      data: JSON.stringify(preferences),
      confidence: 0.8
    }));
    
    // Lifetime Value
    const lifetimeValue = this.calculateLifetimeValue(clientAppointments);
    insights.push(await storage.createClientInsight({
      clientEmail,
      insightType: 'lifetime_value',
      data: JSON.stringify({ value: lifetimeValue, segment: this.getValueSegment(lifetimeValue) }),
      confidence: 0.85
    }));
    
    return insights;
  }

  private getReviewRequestTemplates(): string[] {
    return [
      "Hi {name}! We hope you loved your recent {service}. Your feedback means the world to us - would you mind leaving a quick review?",
      "Thank you for choosing us for your {service}! We'd be grateful if you could share your experience with others.",
      "How was your {service} with us? We'd love to hear about your experience and help others discover our services!"
    ];
  }

  private getRebookReminderTemplates(): string[] {
    return [
      "Hi {name}! It's been a while since your last {service}. Ready to book your next appointment?",
      "Time for your next {service}! We have some great availability this week.",
      "Your {service} is probably due for a refresh! Book now and maintain that perfect look."
    ];
  }

  private getPromotionalTemplates(): string[] {
    return [
      "🌟 Special offer just for you! 20% off your next {service}. Book this week only!",
      "New client special: First {service} at 15% off. Share with friends!",
      "Limited time: Book any {service} and get a complimentary consultation."
    ];
  }

  private getFollowUpTemplates(): string[] {
    return [
      "Hi {name}! How are you loving your new {service}? Any questions or touch-ups needed?",
      "Thanks for visiting us! Here are some tips to maintain your {service}...",
      "Your {service} should be settling in nicely! Any concerns or questions?"
    ];
  }

  private personalizeContent(template: string, insights: ClientInsight[]): string {
    let personalized = template;
    
    // Extract preferences for personalization
    const preferences = insights.find(i => i.insightType === 'preferences');
    if (preferences) {
      const prefData = JSON.parse(preferences.data);
      if (prefData.favoriteService) {
        personalized = personalized.replace('{service}', prefData.favoriteService);
      }
    }
    
    return personalized;
  }

  private calculateLoyaltyScore(appointments: Appointment[]): number {
    const factors = {
      frequency: Math.min(appointments.length / 12, 1), // Normalize to 1 year
      recency: this.calculateRecencyScore(appointments),
      consistency: this.calculateConsistencyScore(appointments)
    };
    
    return Math.round((factors.frequency * 0.4 + factors.recency * 0.3 + factors.consistency * 0.3) * 100);
  }

  private getLoyaltyLevel(score: number): string {
    if (score >= 80) return 'VIP';
    if (score >= 60) return 'Loyal';
    if (score >= 40) return 'Regular';
    return 'New';
  }

  private analyzeServicePreferences(appointments: Appointment[]): any {
    const serviceCounts = new Map<number, number>();
    appointments.forEach(apt => {
      serviceCounts.set(apt.serviceId, (serviceCounts.get(apt.serviceId) || 0) + 1);
    });
    
    const mostFrequentService = Array.from(serviceCounts.entries())
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      favoriteServiceId: mostFrequentService?.[0],
      serviceFrequency: Object.fromEntries(serviceCounts),
      totalServices: serviceCounts.size
    };
  }

  private calculateLifetimeValue(appointments: Appointment[]): number {
    // Simplified LTV calculation - in real app would use actual pricing
    const avgServiceValue = 75; // Placeholder average
    return appointments.length * avgServiceValue;
  }

  private getValueSegment(value: number): string {
    if (value >= 1000) return 'High Value';
    if (value >= 500) return 'Medium Value';
    return 'Growing';
  }

  private calculateRecencyScore(appointments: Appointment[]): number {
    if (appointments.length === 0) return 0;
    
    const lastAppointment = appointments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    const daysSinceLastVisit = Math.floor(
      (Date.now() - new Date(lastAppointment.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Score decreases as days increase
    return Math.max(0, 1 - (daysSinceLastVisit / 365));
  }

  private calculateConsistencyScore(appointments: Appointment[]): number {
    if (appointments.length < 2) return 0;
    
    const intervals: number[] = [];
    const sorted = appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 1; i < sorted.length; i++) {
      const days = Math.floor(
        (new Date(sorted[i].date).getTime() - new Date(sorted[i-1].date).getTime()) / (1000 * 60 * 60 * 24)
      );
      intervals.push(days);
    }
    
    // Calculate consistency based on standard deviation
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 1 - (stdDev / mean));
  }
}

export const aiSchedulingService = new AISchedulingService();
export const marketingAutomationService = new MarketingAutomationService();