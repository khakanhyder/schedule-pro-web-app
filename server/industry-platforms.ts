// Industry-Specific Scheduling Platform Data
// Research-based mapping of popular scheduling apps by industry

export interface SchedulingPlatform {
  id: string;
  name: string;
  description: string;
  category: string;
  marketShare: number; // Percentage of market using this platform
  exportMethod: 'csv' | 'api' | 'manual';
  apiAvailable: boolean;
  exportInstructions: string[];
  csvFields?: string[]; // Common CSV field names for this platform
  icon?: string;
  website?: string;
}

export const industryPlatforms: Record<string, SchedulingPlatform[]> = {
  // Beauty Industry
  beauty: [
    {
      id: 'glossgenius',
      name: 'GlossGenius',
      description: 'All-in-one beauty business management platform',
      category: 'Beauty Specialist',
      marketShare: 35,
      exportMethod: 'api',
      apiAvailable: true,
      exportInstructions: [
        'Log into your GlossGenius account',
        'Go to Settings → API Access',
        'Generate an API key',
        'Copy your Business ID from account settings'
      ],
      icon: '✨',
      website: 'https://glossgenius.com'
    },
    {
      id: 'vagaro',
      name: 'Vagaro',
      description: 'Salon & spa management software',
      category: 'Beauty Specialist',
      marketShare: 25,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Vagaro Business',
        'Go to Reports → Appointment History',
        'Select date range',
        'Click Export → CSV',
        'Download the file'
      ],
      csvFields: ['Client Name', 'Service', 'Date', 'Time', 'Staff', 'Price', 'Status'],
      icon: '💇‍♀️'
    },
    {
      id: 'booksy',
      name: 'Booksy',
      description: 'Online booking for beauty professionals',
      category: 'Beauty Specialist',
      marketShare: 20,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Open Booksy Business app',
        'Go to Analytics → Appointments',
        'Select "Export Data"',
        'Choose CSV format',
        'Download the export file'
      ],
      csvFields: ['Customer', 'Service', 'Date', 'Time', 'Employee', 'Price', 'Status'],
      icon: '📱'
    },
    {
      id: 'square-appointments',
      name: 'Square Appointments',
      description: 'Free appointment scheduling by Square',
      category: 'Beauty Specialist',
      marketShare: 15,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into Square Dashboard',
        'Go to Appointments → Reports',
        'Select date range',
        'Click Export',
        'Choose CSV format'
      ],
      csvFields: ['Customer Name', 'Service Name', 'Date', 'Time', 'Staff', 'Amount', 'Status'],
      icon: '⬜'
    },
    {
      id: 'fresha',
      name: 'Fresha',
      description: 'Free booking software for beauty businesses',
      category: 'Beauty Specialist',
      marketShare: 12,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Fresha Business',
        'Go to Insights → Appointments',
        'Click "Export Data"',
        'Select CSV format',
        'Download the file'
      ],
      csvFields: ['Client', 'Service', 'Date', 'Time', 'Staff Member', 'Price', 'Status'],
      icon: '🌟'
    }
  ],

  // Wellness Industry  
  wellness: [
    {
      id: 'mindbody',
      name: 'MindBody',
      description: 'Leading wellness business management platform',
      category: 'Wellness',
      marketShare: 45,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into MindBody Business',
        'Go to Reports → Visit Reports',
        'Select "Appointments" and date range',
        'Export to CSV format'
      ],
      csvFields: ['Client', 'Class/Service', 'Date', 'Time', 'Status', 'Price', 'Instructor'],
      icon: '🧘',
      website: 'https://mindbodyonline.com'
    },
    {
      id: 'acuity',
      name: 'Acuity Scheduling',
      description: 'Professional appointment scheduling software',
      category: 'Wellness',
      marketShare: 25,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Access Acuity admin panel',
        'Navigate to Business Tools → Export',
        'Select "Appointments" data type',
        'Download CSV export'
      ],
      csvFields: ['Name', 'Appointment Type', 'Date', 'Time', 'Status', 'Amount', 'Provider'],
      icon: '📋',
      website: 'https://acuityscheduling.com'
    },
    {
      id: 'schedulicity',
      name: 'Schedulicity',
      description: 'Online appointment booking for wellness',
      category: 'Wellness',
      marketShare: 18,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Schedulicity dashboard',
        'Go to Reports section',
        'Select "Appointment Export"',
        'Choose date range and download'
      ],
      csvFields: ['Client Name', 'Service', 'Date', 'Time', 'Status', 'Fee', 'Provider'],
      icon: '⏰',
      website: 'https://schedulicity.com'
    }
  ],

  // Pet Care Industry
  pet_care: [
    {
      id: 'gingr',
      name: 'Gingr',
      description: 'Pet boarding and daycare management software',
      category: 'Pet Care',
      marketShare: 40,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Gingr admin panel',
        'Go to Reports → Reservation Reports',
        'Select date range for export',
        'Download reservations CSV file'
      ],
      csvFields: ['Pet Owner', 'Pet Name', 'Service', 'Check-in', 'Check-out', 'Status', 'Rate'],
      icon: '🐕',
      website: 'https://gingrapp.com'
    },
    {
      id: 'pet-sitter-plus',
      name: 'Pet Sitter Plus',
      description: 'Professional pet sitting management',
      category: 'Pet Care',
      marketShare: 25,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Access Pet Sitter Plus dashboard',
        'Navigate to Reports section',
        'Select "Booking Export"',
        'Choose dates and download CSV'
      ],
      csvFields: ['Client', 'Pet', 'Service Type', 'Start Date', 'End Date', 'Status', 'Total'],
      icon: '🐾',
      website: 'https://petsitterplus.com'
    },
    {
      id: 'pawloyalty',
      name: 'PawLoyalty',
      description: 'Pet care business management platform',
      category: 'Pet Care',
      marketShare: 20,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Open PawLoyalty business portal',
        'Go to Data Management',
        'Select "Export Appointments"',
        'Download appointment data as CSV'
      ],
      csvFields: ['Owner Name', 'Pet Name', 'Service', 'Date', 'Time', 'Status', 'Price'],
      icon: '🎾',
      website: 'https://pawloyalty.com'
    }
  ],

  // Creative Services Industry
  creative: [
    {
      id: 'honeybook',
      name: 'HoneyBook',
      description: 'All-in-one creative business management',
      category: 'Creative Services',
      marketShare: 45,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into HoneyBook account',
        'Go to Projects section',
        'Use "Export Projects" feature',
        'Download CSV with project details'
      ],
      csvFields: ['Client', 'Project Type', 'Event Date', 'Status', 'Contract Value', 'Photographer'],
      icon: '📸',
      website: 'https://honeybook.com'
    },
    {
      id: 'pixieset',
      name: 'Pixieset',
      description: 'Photography business management platform',
      category: 'Creative Services',
      marketShare: 30,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Access Pixieset studio dashboard',
        'Navigate to Client Management',
        'Export client and session data',
        'Download CSV file'
      ],
      csvFields: ['Client Name', 'Session Type', 'Date', 'Status', 'Package', 'Total'],
      icon: '🖼️',
      website: 'https://pixieset.com'
    },
    {
      id: 'studio-ninja',
      name: 'Studio Ninja',
      description: 'Photography studio management software',
      category: 'Creative Services',
      marketShare: 25,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Open Studio Ninja dashboard',
        'Go to Leads & Jobs section',
        'Use export functionality',
        'Download jobs CSV file'
      ],
      csvFields: ['Client', 'Job Type', 'Shoot Date', 'Status', 'Quote Value', 'Photographer'],
      icon: '🥷',
      website: 'https://studioninja.co'
    }
  ],

  // Custom/General Industry
  custom: [
    {
      id: 'calendly',
      name: 'Calendly',
      description: 'General purpose appointment scheduling',
      category: 'General Scheduling',
      marketShare: 40,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into Calendly account',
        'Go to Analytics & Reports',
        'Select "Export Scheduled Events"',
        'Download CSV file'
      ],
      csvFields: ['Invitee', 'Event Type', 'Start Time', 'End Time', 'Status', 'Location'],
      icon: '📅',
      website: 'https://calendly.com'
    },
    {
      id: 'setmore',
      name: 'Setmore',
      description: 'Free appointment scheduling software',
      category: 'General Scheduling',
      marketShare: 25,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Access Setmore dashboard',
        'Navigate to Reports',
        'Select "Appointment Report"',
        'Export to CSV format'
      ],
      csvFields: ['Customer', 'Service', 'Date', 'Time', 'Status', 'Staff', 'Notes'],
      icon: '⚙️',
      website: 'https://setmore.com'
    },
    {
      id: 'simplybook',
      name: 'SimplyBook.me',
      description: 'Online booking and scheduling system',
      category: 'General Scheduling',
      marketShare: 20,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into SimplyBook admin',
        'Go to Reports section',
        'Select booking export options',
        'Download CSV report'
      ],
      csvFields: ['Client Name', 'Service', 'Date', 'Time', 'Status', 'Provider', 'Price'],
      icon: '📖',
      website: 'https://simplybook.me'
    }
  ],

  // Pet Services Industry
  pets: [
    {
      id: 'rover',
      name: 'Rover',
      description: 'Leading pet sitting and dog walking platform',
      category: 'Pet Services',
      marketShare: 45,
      exportMethod: 'manual',
      apiAvailable: false,
      exportInstructions: [
        'Log into Rover Sitter Dashboard',
        'Go to Bookings → Booking History',
        'Manually copy appointment details',
        'Create CSV with: Pet Name, Service, Date, Time, Owner Contact, Rate'
      ],
      csvFields: ['Pet Name', 'Service Type', 'Date', 'Time', 'Owner Name', 'Owner Email', 'Rate', 'Notes'],
      icon: '🐕',
      website: 'https://rover.com'
    },
    {
      id: 'wag',
      name: 'Wag',
      description: 'On-demand dog walking and pet care',
      category: 'Pet Services',
      marketShare: 25,
      exportMethod: 'manual',
      apiAvailable: false,
      exportInstructions: [
        'Open Wag Walker app',
        'Go to Walk History',
        'Screenshot or manually record walks',
        'Create CSV with walk details'
      ],
      csvFields: ['Dog Name', 'Service', 'Date', 'Time', 'Owner', 'Duration', 'Rate'],
      icon: '🐾'
    },
    {
      id: 'petdesk',
      name: 'PetDesk',
      description: 'Veterinary practice management software',
      category: 'Pet Services',
      marketShare: 15,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into PetDesk Practice',
        'Go to Reports → Appointments',
        'Select export date range',
        'Download CSV file'
      ],
      csvFields: ['Pet Name', 'Owner Name', 'Service', 'Date', 'Time', 'Veterinarian', 'Cost'],
      icon: '🏥'
    },
    {
      id: 'time-to-pet',
      name: 'Time To Pet',
      description: 'Pet sitting business management software',
      category: 'Pet Services',
      marketShare: 12,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Time To Pet',
        'Go to Reports → Visit Report',
        'Select date range',
        'Export as CSV'
      ],
      csvFields: ['Client', 'Pet', 'Service', 'Date', 'Time', 'Sitter', 'Rate'],
      icon: '⏰'
    }
  ],

  // Skilled Trades Industry
  trades: [
    {
      id: 'servicetitan',
      name: 'ServiceTitan',
      description: 'Complete business software for home services',
      category: 'Home Services',
      marketShare: 35,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into ServiceTitan',
        'Go to Reports → Jobs Report',
        'Select date range',
        'Export to CSV'
      ],
      csvFields: ['Customer', 'Job Type', 'Date', 'Time', 'Technician', 'Amount', 'Status'],
      icon: '🔧',
      website: 'https://servicetitan.com'
    },
    {
      id: 'housecall-pro',
      name: 'Housecall Pro',
      description: 'Field service management for home services',
      category: 'Home Services',
      marketShare: 28,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into Housecall Pro',
        'Go to Reports → Job Reports',
        'Select export options',
        'Download CSV'
      ],
      csvFields: ['Customer Name', 'Service', 'Scheduled Date', 'Time', 'Pro', 'Total', 'Status'],
      icon: '🏠'
    },
    {
      id: 'jobber',
      name: 'Jobber',
      description: 'Home service business management',
      category: 'Home Services',
      marketShare: 22,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into Jobber',
        'Go to Reports → Jobs',
        'Apply filters',
        'Export as CSV'
      ],
      csvFields: ['Client', 'Job', 'Date', 'Time', 'Team Member', 'Value', 'Status'],
      icon: '👷‍♂️'
    },
    {
      id: 'fieldedge',
      name: 'FieldEdge',
      description: 'Field service management software',
      category: 'Home Services',
      marketShare: 18,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Access FieldEdge dashboard',
        'Go to Reports → Work Orders',
        'Set date parameters',
        'Export to CSV'
      ],
      csvFields: ['Customer', 'Work Order', 'Date', 'Time', 'Technician', 'Amount', 'Status'],
      icon: '⚡'
    },
    {
      id: 'simpleservice',
      name: 'SimPRO',
      description: 'Trade contractor management software',
      category: 'Home Services',
      marketShare: 12,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into SimPRO',
        'Go to Reports → Job Cards',
        'Select criteria',
        'Export data'
      ],
      csvFields: ['Customer', 'Job Description', 'Date', 'Time', 'Contractor', 'Cost', 'Status'],
      icon: '🔨'
    }
  ],

  // Wellness Industry
  wellness: [
    {
      id: 'mindbody',
      name: 'MINDBODY',
      description: 'Wellness business management platform',
      category: 'Wellness',
      marketShare: 40,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into MINDBODY Business',
        'Go to Reports → Visits',
        'Select date range',
        'Export as CSV'
      ],
      csvFields: ['Client', 'Service', 'Date', 'Time', 'Staff', 'Price', 'Status'],
      icon: '🧘‍♀️'
    },
    {
      id: 'acuity',
      name: 'Acuity Scheduling',
      description: 'Online appointment scheduling',
      category: 'Wellness',
      marketShare: 30,
      exportMethod: 'csv',
      apiAvailable: true,
      exportInstructions: [
        'Log into Acuity',
        'Go to Business → Export Data',
        'Select Appointments',
        'Choose CSV format'
      ],
      csvFields: ['Name', 'Email', 'Phone', 'Appointment Type', 'Date', 'Time', 'Price'],
      icon: '📅'
    },
    {
      id: 'schedulicity',
      name: 'Schedulicity',
      description: 'Appointment scheduling for wellness',
      category: 'Wellness',
      marketShare: 20,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into Schedulicity',
        'Go to Reports → Appointments',
        'Select date range',
        'Export to CSV'
      ],
      csvFields: ['Client Name', 'Service', 'Date', 'Time', 'Provider', 'Amount', 'Status'],
      icon: '💆‍♀️'
    },
    {
      id: 'massage-book',
      name: 'MassageBook',
      description: 'Massage therapy practice management',
      category: 'Wellness',
      marketShare: 15,
      exportMethod: 'csv',
      apiAvailable: false,
      exportInstructions: [
        'Log into MassageBook',
        'Go to Reports → Appointment History',
        'Select date range',
        'Export as CSV'
      ],
      csvFields: ['Client', 'Service Type', 'Date', 'Time', 'Therapist', 'Rate', 'Status'],
      icon: '🤲'
    }
  ],

  // Home Services (General)
  home: [
    {
      id: 'thumbtack',
      name: 'Thumbtack',
      description: 'Home service marketplace',
      category: 'Home Services',
      marketShare: 25,
      exportMethod: 'manual',
      apiAvailable: false,
      exportInstructions: [
        'Log into Thumbtack Pro',
        'Go to Jobs → Completed Jobs',
        'Manually export job details',
        'Create CSV with job information'
      ],
      csvFields: ['Customer Name', 'Service', 'Date', 'Time', 'Location', 'Amount', 'Status'],
      icon: '👍'
    },
    {
      id: 'angi',
      name: 'Angi (Angie\'s List)',
      description: 'Home services platform',
      category: 'Home Services',
      marketShare: 20,
      exportMethod: 'manual',
      apiAvailable: false,
      exportInstructions: [
        'Access Angi Pro dashboard',
        'Go to Job History',
        'Export job details manually',
        'Format as CSV'
      ],
      csvFields: ['Customer', 'Service Type', 'Date', 'Time', 'Location', 'Cost', 'Rating'],
      icon: '🏡'
    },
    {
      id: 'taskrabbit',
      name: 'TaskRabbit',
      description: 'On-demand task services',
      category: 'Home Services',
      marketShare: 18,
      exportMethod: 'manual',
      apiAvailable: false,
      exportInstructions: [
        'Log into TaskRabbit Tasker app',
        'Go to Task History',
        'Manually record completed tasks',
        'Create CSV with task details'
      ],
      csvFields: ['Client', 'Task Type', 'Date', 'Time', 'Duration', 'Rate', 'Status'],
      icon: '🐰'
    }
  ]
};

// Helper function to get platforms by industry
export function getPlatformsByIndustry(industryId: string): SchedulingPlatform[] {
  const platforms = industryPlatforms[industryId];
  return platforms || [];
}

// Helper function to get platform by ID
export function getPlatformById(platformId: string): SchedulingPlatform | undefined {
  for (const industryKey of Object.keys(industryPlatforms)) {
    const platforms = industryPlatforms[industryKey];
    const platform = platforms.find(p => p.id === platformId);
    if (platform) return platform;
  }
  return undefined;
}

// Helper function to check if platform supports API integration
export function isPlatformApiSupported(platformId: string): boolean {
  const platform = getPlatformById(platformId);
  return platform?.apiAvailable || false;
}