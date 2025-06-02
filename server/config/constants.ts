
export const EMAIL_CONFIG = {
  FROM_CUSTOMER: 'Jason Henry <jason@nomadicliberty.com>',
  FROM_ADMIN: 'Workflow Audit <jason@nomadicliberty.com>',
  TO_ADMIN: 'jason@nomadicliberty.com',
  RESEND_API_URL: 'https://api.resend.com/emails',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'gpt-4o-mini'
};

export const RATING_CLASSES = {
  'Manual': 'manual',
  'Partially Automated': 'partial', 
  'Fully Automated': 'automated'
} as const;

export const CATEGORY_NAMES = {
  'task-management': 'Task Management',
  'customer-communication': 'Customer Communication',
  'data-entry': 'Data Entry',
  'scheduling': 'Scheduling',
  'reporting': 'Reporting',
  'general': 'General Business Operations'
} as const;
