
import { AuditQuestion } from '../types/audit';

// Universal questions that apply to all industries
export const universalQuestions: AuditQuestion[] = [
  // Business Context Questions
  {
    id: 'business-context-1',
    text: 'What type of business do you run?',
    type: 'multiple-choice',
    category: 'general',
    options: [
      'Service-based business (consulting, marketing, etc.)',
      'E-commerce/retail business',
      'Professional services (legal, accounting, etc.)',
      'Healthcare/medical practice',
      'Real estate',
      'Manufacturing/logistics',
      'Other'
    ]
  },
  {
    id: 'business-context-2',
    text: 'How many people are on your team?',
    type: 'multiple-choice',
    category: 'general',
    options: [
      'Just me (solo entrepreneur)',
      '2-5 people',
      '6-15 people',
      '16-30 people',
      '30+ people'
    ]
  },

  // Task Management Questions
  {
    id: 'task-management-1',
    text: 'How do you currently track tasks and projects?',
    type: 'multiple-choice',
    category: 'task-management',
    options: [
      'Paper lists or sticky notes',
      'Basic digital tools (Excel, Google Sheets)',
      'Basic task apps (Apple Reminders, simple to-do apps)',
      'Project management software (Asana, Trello, Monday)',
      'Advanced project management with automation'
    ]
  },
  {
    id: 'task-management-2',
    text: 'How often do tasks fall through the cracks or get forgotten?',
    type: 'multiple-choice',
    category: 'task-management',
    options: [
      'Very frequently (multiple times per week)',
      'Occasionally (once or twice per week)',
      'Rarely (once or twice per month)',
      'Almost never',
      'Never - we have systems to prevent this'
    ]
  },
  {
    id: 'task-management-3',
    text: 'How much time do you spend each week on task coordination and status updates?',
    type: 'multiple-choice',
    category: 'task-management',
    options: [
      '5+ hours per week',
      '3-5 hours per week',
      '1-3 hours per week',
      'Less than 1 hour per week',
      'Almost no time - its automated'
    ]
  },

  // Customer Communication Questions
  {
    id: 'customer-communication-1',
    text: 'How do you handle customer inquiries and support?',
    type: 'multiple-choice',
    category: 'customer-communication',
    options: [
      'Manually via email/phone with no tracking',
      'Email with basic organization (folders/labels)',
      'Simple CRM or contact management',
      'Advanced CRM with automation features',
      'Fully automated customer service with AI'
    ]
  },
  {
    id: 'customer-communication-2',
    text: 'How long does it typically take to respond to customer inquiries?',
    type: 'multiple-choice',
    category: 'customer-communication',
    options: [
      'More than 24 hours',
      '12-24 hours',
      '4-12 hours',
      '1-4 hours',
      'Less than 1 hour (or automated)'
    ]
  },
  {
    id: 'customer-communication-3',
    text: 'Do you send regular updates or follow-ups to customers?',
    type: 'multiple-choice',
    category: 'customer-communication',
    options: [
      'No, only when they contact us',
      'Manually when I remember',
      'Scheduled manually in calendar',
      'Semi-automated reminders',
      'Fully automated communication sequences'
    ]
  },

  // Data Entry Questions
  {
    id: 'data-entry-1',
    text: 'How much time do you spend on repetitive data entry each week?',
    type: 'multiple-choice',
    category: 'data-entry',
    options: [
      '10+ hours per week',
      '5-10 hours per week',
      '2-5 hours per week',
      '1-2 hours per week',
      'Less than 1 hour (mostly automated)'
    ]
  },
  {
    id: 'data-entry-2',
    text: 'How often do you manually copy information between systems?',
    type: 'multiple-choice',
    category: 'data-entry',
    options: [
      'Multiple times daily',
      'Once daily',
      'A few times per week',
      'Rarely',
      'Never - systems are integrated'
    ]
  },
  {
    id: 'data-entry-3',
    text: 'How do you handle invoicing and billing?',
    type: 'multiple-choice',
    category: 'data-entry',
    options: [
      'Manual creation in Word/Excel',
      'Basic invoicing software',
      'Automated invoicing with manual follow-up',
      'Mostly automated with some manual oversight',
      'Fully automated billing and follow-up'
    ]
  },

  // Scheduling Questions
  {
    id: 'scheduling-1',
    text: 'How do you handle appointment scheduling?',
    type: 'multiple-choice',
    category: 'scheduling',
    options: [
      'Phone calls and manual calendar updates',
      'Email back-and-forth with manual booking',
      'Simple online booking (Calendly-style)',
      'Advanced scheduling with automation',
      'AI-powered scheduling with full integration'
    ]
  },
  {
    id: 'scheduling-2',
    text: 'How often do scheduling conflicts or double-bookings occur?',
    type: 'multiple-choice',
    category: 'scheduling',
    options: [
      'Frequently (multiple times per month)',
      'Occasionally (once per month)',
      'Rarely (few times per year)',
      'Almost never',
      'Never - prevented by automation'
    ]
  },

  // Reporting Questions
  {
    id: 'reporting-1',
    text: 'How do you track business metrics?',
    type: 'multiple-choice',
    category: 'reporting',
    options: [
      'Manual spreadsheets updated occasionally',
      'Regular manual data collection and analysis',
      'Semi-automated dashboards',
      'Mostly automated reporting with some manual input',
      'Fully automated real-time dashboards'
    ]
  },
  {
    id: 'reporting-2',
    text: 'How often do you generate business reports?',
    type: 'multiple-choice',
    category: 'reporting',
    options: [
      'Rarely or never',
      'Only when specifically needed',
      'Monthly with significant manual work',
      'Weekly with some automation',
      'Daily or real-time automated reports'
    ]
  },

  // General Questions
  {
    id: 'general-1',
    text: 'What is your biggest operational pain point right now?',
    type: 'text',
    category: 'general'
  },
  {
    id: 'general-2',
    text: 'How does your team typically react to new technology or process changes?',
    type: 'multiple-choice',
    category: 'general',
    options: [
      'Very resistant to change',
      'Somewhat hesitant but willing to try',
      'Open to new tools if they see clear benefits',
      'Eager to adopt new technology',
      'Very eager to try cutting-edge solutions'
    ]
  }
];

// Industry-specific questions
export const industrySpecificQuestions: Record<string, AuditQuestion[]> = {
  'Service-based business (consulting, marketing, etc.)': [
    {
      id: 'service-1',
      text: 'How do you track billable hours and project time?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Manual time tracking on paper or spreadsheets',
        'Basic time tracking apps (Toggl, RescueTime)',
        'Project management tools with time tracking',
        'Automated time tracking with client billing integration',
        'AI-powered time tracking with automatic categorization'
      ]
    },
    {
      id: 'service-2',
      text: 'How do you manage client proposals and contracts?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Custom documents created from scratch each time',
        'Template documents with manual customization',
        'Basic proposal software',
        'Advanced proposal tools with e-signatures',
        'Fully automated proposal generation and tracking'
      ]
    },
    {
      id: 'service-3',
      text: 'How do you handle client project updates and communication?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Email updates when I remember',
        'Scheduled email updates',
        'Client portal with manual updates',
        'Automated progress reports',
        'Real-time client dashboard with automatic updates'
      ]
    },
    {
      id: 'service-4',
      text: 'How do you manage your service delivery workflow?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Ad-hoc process, different each time',
        'Basic checklists and templates',
        'Standardized workflows in project management tool',
        'Automated workflow with notifications',
        'AI-optimized workflows with predictive scheduling'
      ]
    },
    {
      id: 'service-5',
      text: 'How do you handle recurring client work and retainers?',
      type: 'multiple-choice',
      category: 'scheduling',
      options: [
        'Manual scheduling and invoicing',
        'Calendar reminders with manual billing',
        'Automated recurring invoices',
        'Integrated recurring work and billing system',
        'Fully automated retainer management with scope tracking'
      ]
    }
  ],

  'E-commerce/retail business': [
    {
      id: 'ecommerce-1',
      text: 'How do you manage your product inventory?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Manual spreadsheets and counting',
        'Basic inventory management software',
        'Integrated inventory with sales channels',
        'Automated reordering and tracking',
        'AI-powered demand forecasting and inventory optimization'
      ]
    },
    {
      id: 'ecommerce-2',
      text: 'How do you handle order processing and fulfillment?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Manual order processing and shipping',
        'Basic e-commerce platform with manual fulfillment',
        'Semi-automated order processing',
        'Integrated fulfillment with tracking',
        'Fully automated order-to-ship process'
      ]
    },
    {
      id: 'ecommerce-3',
      text: 'How do you manage customer service and returns?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Manual email responses and return processing',
        'Basic helpdesk with manual handling',
        'Customer service software with templates',
        'Automated responses with return portal',
        'AI-powered customer service with automated returns'
      ]
    },
    {
      id: 'ecommerce-4',
      text: 'How do you track sales performance and analytics?',
      type: 'multiple-choice',
      category: 'reporting',
      options: [
        'Manual sales tracking in spreadsheets',
        'Basic e-commerce platform reports',
        'Integrated analytics dashboard',
        'Advanced analytics with forecasting',
        'AI-powered insights with automated recommendations'
      ]
    },
    {
      id: 'ecommerce-5',
      text: 'How do you manage product listings across channels?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Manual listing on each platform',
        'Copy-paste between platforms',
        'Basic multi-channel listing tool',
        'Automated synchronization across channels',
        'AI-optimized listings with dynamic pricing'
      ]
    },
    {
      id: 'ecommerce-6',
      text: 'How do you handle marketing and customer acquisition?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Manual social media and ad management',
        'Basic marketing tools and campaigns',
        'Marketing automation platform',
        'Integrated multi-channel marketing',
        'AI-driven personalized marketing automation'
      ]
    }
  ],

  'Professional services (legal, accounting, etc.)': [
    {
      id: 'professional-1',
      text: 'How do you manage client case/project files and documents?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Physical files and basic digital folders',
        'Simple document management system',
        'Client-specific digital workspaces',
        'Integrated case management system',
        'AI-powered document organization and retrieval'
      ]
    },
    {
      id: 'professional-2',
      text: 'How do you track billable time and expenses?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Manual timesheets and expense receipts',
        'Basic time tracking software',
        'Integrated time and expense tracking',
        'Automated time capture with expense integration',
        'AI-powered time tracking with automatic billing codes'
      ]
    },
    {
      id: 'professional-3',
      text: 'How do you handle client intake and onboarding?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Paper forms and manual data entry',
        'Digital forms with manual processing',
        'Online intake forms with basic automation',
        'Integrated client onboarding workflow',
        'Fully automated intake with document generation'
      ]
    },
    {
      id: 'professional-4',
      text: 'How do you manage compliance and deadline tracking?',
      type: 'multiple-choice',
      category: 'scheduling',
      options: [
        'Manual calendar and reminder system',
        'Basic deadline tracking in calendar app',
        'Specialized compliance tracking software',
        'Automated deadline monitoring with alerts',
        'AI-powered compliance management with predictive alerts'
      ]
    },
    {
      id: 'professional-5',
      text: 'How do you generate and manage client reports?',
      type: 'multiple-choice',
      category: 'reporting',
      options: [
        'Manual document creation each time',
        'Templates with manual data entry',
        'Semi-automated report generation',
        'Automated reports with data integration',
        'AI-generated insights with dynamic reporting'
      ]
    }
  ],

  'Healthcare/medical practice': [
    {
      id: 'healthcare-1',
      text: 'How do you manage patient appointments and scheduling?',
      type: 'multiple-choice',
      category: 'scheduling',
      options: [
        'Phone calls and manual appointment book',
        'Basic scheduling software',
        'Online booking with manual confirmation',
        'Integrated scheduling with reminders',
        'AI-optimized scheduling with automated confirmations'
      ]
    },
    {
      id: 'healthcare-2',
      text: 'How do you handle patient records and documentation?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Paper charts and manual filing',
        'Basic electronic health records (EHR)',
        'Integrated EHR with templates',
        'Advanced EHR with workflow automation',
        'AI-assisted documentation and coding'
      ]
    },
    {
      id: 'healthcare-3',
      text: 'How do you manage insurance verification and billing?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Manual insurance verification and claims',
        'Basic practice management software',
        'Integrated billing with insurance verification',
        'Automated claims processing and follow-up',
        'AI-powered revenue cycle management'
      ]
    },
    {
      id: 'healthcare-4',
      text: 'How do you handle patient communication and follow-up?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Phone calls and manual follow-up tracking',
        'Basic patient communication system',
        'Automated appointment reminders',
        'Integrated patient portal with messaging',
        'AI-powered patient engagement and care coordination'
      ]
    },
    {
      id: 'healthcare-5',
      text: 'How do you manage compliance and quality reporting?',
      type: 'multiple-choice',
      category: 'reporting',
      options: [
        'Manual data collection and reporting',
        'Basic compliance tracking system',
        'Semi-automated quality metrics',
        'Integrated compliance and quality dashboards',
        'AI-driven compliance monitoring and quality improvement'
      ]
    }
  ],

  'Real estate': [
    {
      id: 'realestate-1',
      text: 'How do you manage your property listings and marketing?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Manual listing creation and posting',
        'Basic MLS with manual syndication',
        'Multi-platform listing with templates',
        'Automated listing syndication and updates',
        'AI-powered listing optimization and marketing'
      ]
    },
    {
      id: 'realestate-2',
      text: 'How do you handle lead generation and follow-up?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Manual lead tracking in spreadsheets',
        'Basic CRM with manual follow-up',
        'Automated lead capture with email sequences',
        'Integrated lead nurturing system',
        'AI-powered lead scoring and personalized follow-up'
      ]
    },
    {
      id: 'realestate-3',
      text: 'How do you coordinate showings and appointments?',
      type: 'multiple-choice',
      category: 'scheduling',
      options: [
        'Phone coordination and manual scheduling',
        'Basic scheduling app with manual confirmation',
        'Online scheduling with automated confirmations',
        'Integrated showing management system',
        'AI-optimized scheduling with automatic coordination'
      ]
    },
    {
      id: 'realestate-4',
      text: 'How do you manage transaction paperwork and documents?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Paper documents and manual filing',
        'Basic digital document storage',
        'Transaction management software',
        'Integrated e-signature and document workflow',
        'AI-powered document generation and compliance checking'
      ]
    },
    {
      id: 'realestate-5',
      text: 'How do you track market data and create comparative market analyses?',
      type: 'multiple-choice',
      category: 'reporting',
      options: [
        'Manual research and spreadsheet creation',
        'Basic MLS data with manual analysis',
        'Semi-automated CMA tools',
        'Integrated market data with automated reports',
        'AI-powered market analysis and valuation tools'
      ]
    },
    {
      id: 'realestate-6',
      text: 'How do you manage client relationships and communication?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Manual contact tracking and communication',
        'Basic contact management system',
        'CRM with automated communication templates',
        'Integrated client portal with updates',
        'AI-driven client relationship management and insights'
      ]
    }
  ],

  'Manufacturing/logistics': [
    {
      id: 'manufacturing-1',
      text: 'How do you manage your supply chain and vendor relationships?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Manual vendor tracking and communication',
        'Basic supplier database',
        'Supply chain management software',
        'Integrated vendor portal and automation',
        'AI-powered supply chain optimization'
      ]
    },
    {
      id: 'manufacturing-2',
      text: 'How do you track production schedules and workflows?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Manual production planning and tracking',
        'Basic scheduling software',
        'Manufacturing execution system (MES)',
        'Integrated production planning and control',
        'AI-optimized production scheduling and predictive maintenance'
      ]
    },
    {
      id: 'manufacturing-3',
      text: 'How do you manage quality control and inspections?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Manual inspection logs and paper checklists',
        'Basic quality management system',
        'Digital quality control with templates',
        'Automated quality tracking and alerts',
        'AI-powered quality prediction and automated inspection'
      ]
    },
    {
      id: 'manufacturing-4',
      text: 'How do you handle inventory management and warehousing?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Manual inventory counts and spreadsheets',
        'Basic inventory management system',
        'Barcode scanning with inventory software',
        'RFID tracking with automated updates',
        'AI-powered inventory optimization and predictive restocking'
      ]
    },
    {
      id: 'manufacturing-5',
      text: 'How do you manage shipping and logistics coordination?',
      type: 'multiple-choice',
      category: 'scheduling',
      options: [
        'Manual shipping coordination and tracking',
        'Basic shipping software',
        'Integrated logistics management system',
        'Automated shipping optimization',
        'AI-powered logistics with predictive routing'
      ]
    }
  ],

  'Other': [
    {
      id: 'other-1',
      text: 'What are your main operational processes that consume the most time?',
      type: 'text',
      category: 'general'
    },
    {
      id: 'other-2',
      text: 'How do you currently manage your core business workflows?',
      type: 'multiple-choice',
      category: 'task-management',
      options: [
        'Mostly manual processes',
        'Basic digital tools and spreadsheets',
        'Some specialized software for key processes',
        'Integrated business management system',
        'Highly automated with AI assistance'
      ]
    },
    {
      id: 'other-3',
      text: 'What type of data do you work with most frequently?',
      type: 'multiple-choice',
      category: 'data-entry',
      options: [
        'Customer information and contacts',
        'Financial data and transactions',
        'Inventory or product data',
        'Project or task information',
        'Multiple types of business data'
      ]
    },
    {
      id: 'other-4',
      text: 'How do you typically communicate with your customers/clients?',
      type: 'multiple-choice',
      category: 'customer-communication',
      options: [
        'Primarily phone and in-person',
        'Email and basic messaging',
        'Multiple communication channels',
        'Integrated customer communication platform',
        'Automated and AI-assisted communication'
      ]
    },
    {
      id: 'other-5',
      text: 'What would have the biggest impact on your business efficiency?',
      type: 'multiple-choice',
      category: 'general',
      options: [
        'Reducing manual data entry',
        'Better customer communication tools',
        'Automated scheduling and coordination',
        'Improved reporting and analytics',
        'Streamlined workflow automation'
      ]
    }
  ]
};

// Function to get questions based on selected industry
export const getQuestionsForIndustry = (selectedIndustry: string): AuditQuestion[] => {
  const coreQuestions = universalQuestions.slice(2); // Skip the first two business context questions
  const industryQuestions = industrySpecificQuestions[selectedIndustry] || industrySpecificQuestions['Other'];
  
  return [
    universalQuestions[0], // Business type question
    ...industryQuestions,  // Industry-specific questions
    universalQuestions[1], // Team size question
    ...coreQuestions       // Remaining universal questions
  ];
};

// Maintain backward compatibility
export const auditQuestions = universalQuestions;
