// GlossGenius API Integration
// This will handle importing appointments and client data from GlossGenius

export interface GlossGeniusConfig {
  apiKey: string;
  businessId: string;
  baseUrl: string;
}

export interface GlossGeniusAppointment {
  id: string;
  client_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  price: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_name: string;
  staff_name: string;
}

export interface GlossGeniusClient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes?: string;
  created_at: string;
}

export interface GlossGeniusService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export class GlossGeniusIntegration {
  private config: GlossGeniusConfig;

  constructor(config: GlossGeniusConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GlossGenius API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAppointments(startDate?: string, endDate?: string): Promise<GlossGeniusAppointment[]> {
    let endpoint = `/v1/businesses/${this.config.businessId}/appointments`;
    
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const data = await this.makeRequest(endpoint);
    return data.appointments || [];
  }

  async getClients(): Promise<GlossGeniusClient[]> {
    const endpoint = `/v1/businesses/${this.config.businessId}/clients`;
    const data = await this.makeRequest(endpoint);
    return data.clients || [];
  }

  async getServices(): Promise<GlossGeniusService[]> {
    const endpoint = `/v1/businesses/${this.config.businessId}/services`;
    const data = await this.makeRequest(endpoint);
    return data.services || [];
  }

  // Convert GlossGenius appointments to our app format
  convertAppointments(ggAppointments: GlossGeniusAppointment[]) {
    return ggAppointments.map(appointment => ({
      clientName: appointment.client_name,
      clientEmail: appointment.client_email,
      clientPhone: appointment.client_phone,
      serviceName: appointment.service_name,
      stylistName: appointment.staff_name,
      date: new Date(appointment.start_time).toISOString().split('T')[0],
      time: new Date(appointment.start_time).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: Math.round((new Date(appointment.end_time).getTime() - new Date(appointment.start_time).getTime()) / (1000 * 60)),
      price: appointment.price,
      status: appointment.status,
      notes: appointment.notes || '',
      originalId: appointment.id
    }));
  }
}

// Helper function to validate GlossGenius API credentials
export async function validateGlossGeniusCredentials(config: GlossGeniusConfig): Promise<boolean> {
  try {
    const integration = new GlossGeniusIntegration(config);
    await integration.getServices(); // Simple test call
    return true;
  } catch (error) {
    console.error('GlossGenius validation failed:', error);
    return false;
  }
}