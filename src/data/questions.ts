
import { AuditQuestion } from '../types/audit';

export const auditQuestions: AuditQuestion[] = [
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
