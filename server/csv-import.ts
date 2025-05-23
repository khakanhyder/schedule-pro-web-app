// Universal CSV Import for Scheduling Apps
// Handles importing appointments from any scheduling app via CSV upload

export interface CSVAppointment {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  date: string;
  time: string;
  duration?: number;
  price?: number;
  notes?: string;
  status?: string;
}

export interface ImportMapping {
  clientName: string[];
  clientEmail: string[];
  clientPhone: string[];
  serviceName: string[];
  date: string[];
  time: string[];
  duration: string[];
  price: string[];
  notes: string[];
  status: string[];
}

// Common field variations found in different scheduling apps
export const COMMON_FIELD_MAPPINGS: ImportMapping = {
  clientName: ['client_name', 'customer_name', 'name', 'client', 'customer', 'first_name', 'last_name', 'full_name'],
  clientEmail: ['email', 'client_email', 'customer_email', 'e_mail', 'email_address'],
  clientPhone: ['phone', 'phone_number', 'client_phone', 'customer_phone', 'mobile', 'cell'],
  serviceName: ['service', 'service_name', 'treatment', 'appointment_type', 'service_type'],
  date: ['date', 'appointment_date', 'start_date', 'booking_date', 'scheduled_date'],
  time: ['time', 'start_time', 'appointment_time', 'scheduled_time', 'booking_time'],
  duration: ['duration', 'length', 'appointment_length', 'service_duration', 'minutes'],
  price: ['price', 'cost', 'amount', 'total', 'service_price', 'charge'],
  notes: ['notes', 'comments', 'description', 'special_requests', 'remarks'],
  status: ['status', 'appointment_status', 'booking_status', 'state']
};

export class CSVImporter {
  
  // Parse CSV content and return rows
  parseCSV(csvContent: string): string[][] {
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
    return lines.map(line => this.parseCSVLine(line));
  }

  // Parse a single CSV line handling quotes and commas
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Auto-detect field mappings based on header row
  detectFieldMappings(headers: string[]): Partial<Record<keyof CSVAppointment, number>> {
    const mappings: Partial<Record<keyof CSVAppointment, number>> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      // Check each field type for matches
      Object.entries(COMMON_FIELD_MAPPINGS).forEach(([fieldName, variations]) => {
        if (variations.some(variation => normalizedHeader.includes(variation))) {
          mappings[fieldName as keyof CSVAppointment] = index;
        }
      });
    });
    
    return mappings;
  }

  // Convert parsed CSV data to appointment objects
  convertToAppointments(rows: string[][], mappings: Partial<Record<keyof CSVAppointment, number>>): CSVAppointment[] {
    return rows.slice(1).map(row => { // Skip header row
      const appointment: Partial<CSVAppointment> = {};
      
      Object.entries(mappings).forEach(([field, columnIndex]) => {
        if (columnIndex !== undefined && row[columnIndex]) {
          const value = row[columnIndex].trim();
          
          // Handle special field formatting
          switch (field) {
            case 'date':
              appointment.date = this.normalizeDate(value);
              break;
            case 'time':
              appointment.time = this.normalizeTime(value);
              break;
            case 'duration':
              appointment.duration = parseInt(value) || undefined;
              break;
            case 'price':
              appointment.price = parseFloat(value.replace(/[^0-9.]/g, '')) || undefined;
              break;
            default:
              (appointment as any)[field] = value;
          }
        }
      });
      
      return appointment as CSVAppointment;
    }).filter(apt => apt.clientName && apt.date && apt.time); // Only valid appointments
  }

  // Normalize date formats to YYYY-MM-DD
  private normalizeDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Try common formats
      const formats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
        /(\d{1,2})-(\d{1,2})-(\d{4})/, // MM-DD-YYYY
      ];
      
      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          const [, p1, p2, p3] = match;
          // Assume first format is MM/DD/YYYY
          const formattedDate = new Date(`${p3}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`);
          if (!isNaN(formattedDate.getTime())) {
            return formattedDate.toISOString().split('T')[0];
          }
        }
      }
      return dateStr; // Return original if can't parse
    }
    
    return date.toISOString().split('T')[0];
  }

  // Normalize time formats to HH:MM
  private normalizeTime(timeStr: string): string {
    // Remove AM/PM and normalize
    const cleaned = timeStr.replace(/[^\d:]/g, '');
    const timeParts = cleaned.split(':');
    
    if (timeParts.length >= 2) {
      const hours = timeParts[0].padStart(2, '0');
      const minutes = timeParts[1].padStart(2, '0');
      
      // Handle AM/PM conversion if needed
      if (timeStr.toLowerCase().includes('pm') && parseInt(hours) < 12) {
        return `${(parseInt(hours) + 12).toString().padStart(2, '0')}:${minutes}`;
      }
      
      return `${hours}:${minutes}`;
    }
    
    return timeStr;
  }

  // Generate import preview for user confirmation
  generatePreview(appointments: CSVAppointment[], limit: number = 5): {
    total: number;
    preview: CSVAppointment[];
    issues: string[];
  } {
    const issues: string[] = [];
    
    appointments.forEach((apt, index) => {
      if (!apt.clientName) issues.push(`Row ${index + 2}: Missing client name`);
      if (!apt.date) issues.push(`Row ${index + 2}: Missing or invalid date`);
      if (!apt.time) issues.push(`Row ${index + 2}: Missing or invalid time`);
    });
    
    return {
      total: appointments.length,
      preview: appointments.slice(0, limit),
      issues
    };
  }
}