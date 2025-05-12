
import { AuditQuestion, WorkflowCategory } from '../types/audit';

// All the questions that make up the audit
export const auditQuestions: AuditQuestion[] = [
  {
    id: 'task-mgmt-1',
    text: 'How do you currently manage and assign tasks within your team?',
    options: [
      'Verbal communication or physical notes',
      'Email or messaging apps',
      'Spreadsheets or shared documents',
      'Dedicated task management software',
      'Automated system with workflows'
    ],
    type: 'multiple-choice',
    category: 'task-management'
  },
  {
    id: 'task-mgmt-2',
    text: 'How do you track the progress of ongoing tasks?',
    options: [
      'Manual check-ins with team members',
      'Status update meetings',
      'Shared spreadsheets or documents',
      'Task management software with status tracking',
      'Automated reporting and notifications'
    ],
    type: 'multiple-choice',
    category: 'task-management'
  },
  {
    id: 'customer-comm-1',
    text: 'How do you primarily communicate with your customers?',
    options: [
      'In-person or phone calls only',
      'Email or basic messaging',
      'Mix of channels without integration',
      'Multi-channel with some integration',
      'Fully integrated customer communication platform'
    ],
    type: 'multiple-choice',
    category: 'customer-communication'
  },
  {
    id: 'customer-comm-2',
    text: 'How do you handle customer inquiries or support requests?',
    options: [
      'Ad-hoc responses when time permits',
      'Designated person handles all inquiries manually',
      'Shared inbox with manual assignment',
      'Ticketing system with some automation',
      'AI-powered response system with human oversight'
    ],
    type: 'multiple-choice',
    category: 'customer-communication'
  },
  {
    id: 'data-entry-1',
    text: 'How is data typically entered into your business systems?',
    options: [
      'Manual entry for all data',
      'Manual entry with templates',
      'Some import functionality, but mostly manual',
      'Digital forms with automatic import',
      'Automated data capture with minimal human intervention'
    ],
    type: 'multiple-choice',
    category: 'data-entry'
  },
  {
    id: 'data-entry-2',
    text: 'How do you verify data accuracy in your systems?',
    options: [
      'Manual review by staff',
      'Spot checks and random sampling',
      'Spreadsheet formulas for validation',
      'Automated validation with error flagging',
      'AI-powered data verification with anomaly detection'
    ],
    type: 'multiple-choice',
    category: 'data-entry'
  },
  {
    id: 'scheduling-1',
    text: 'How do you manage appointments and scheduling?',
    options: [
      'Paper calendar or planner',
      'Digital calendar without integration',
      'Shared digital calendar',
      'Dedicated scheduling software',
      'Automated scheduling with customer self-service'
    ],
    type: 'multiple-choice',
    category: 'scheduling'
  },
  {
    id: 'scheduling-2',
    text: 'How do you handle resource allocation for projects or tasks?',
    options: [
      'Manual assignment based on manager knowledge',
      'Discussion and consensus in meetings',
      'Spreadsheet tracking of availability',
      'Resource management software',
      'AI-powered resource optimization'
    ],
    type: 'multiple-choice',
    category: 'scheduling'
  },
  {
    id: 'reporting-1',
    text: 'How do you generate business reports?',
    options: [
      'Manual calculations and presentations',
      'Spreadsheets with basic formulas',
      'Database queries with manual analysis',
      'Business intelligence tools with some automation',
      'Automated reporting with AI-powered insights'
    ],
    type: 'multiple-choice',
    category: 'reporting'
  },
  {
    id: 'reporting-2',
    text: 'How frequently are you able to review key business metrics?',
    options: [
      'Rarely or on an ad-hoc basis',
      'Monthly or quarterly reviews',
      'Weekly reviews of limited metrics',
      'Daily access to dashboards',
      'Real-time metrics with automated alerts'
    ],
    type: 'multiple-choice',
    category: 'reporting'
  },
  {
    id: 'general-1',
    text: 'What is your biggest operational pain point right now?',
    type: 'text',
    category: 'general'
  },
  {
    id: 'general-2',
    text: 'How comfortable is your team with adopting new technology?',
    options: [
      'Very resistant to change',
      'Somewhat hesitant but willing with proper training',
      'Neutral - neither resistant nor enthusiastic',
      'Generally open to new tools',
      'Very eager to adopt new technologies'
    ],
    type: 'multiple-choice',
    category: 'general'
  }
];
