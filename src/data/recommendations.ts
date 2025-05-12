
import { WorkflowCategory, RatingLevel } from '../types/audit';

// Tools and improvement suggestions for each category based on automation level
export const recommendationsByCategory: Record<WorkflowCategory, {
  manual: { tools: string[], improvements: string[] },
  partial: { tools: string[], improvements: string[] },
  automated: { tools: string[], improvements: string[] },
}> = {
  'task-management': {
    manual: {
      tools: ['Trello', 'Asana', 'Monday.com'],
      improvements: [
        'Implement a basic task management system',
        'Create standard templates for recurring tasks',
        'Establish clear task assignment protocols'
      ]
    },
    partial: {
      tools: ['ClickUp', 'Notion', 'Airtable'],
      improvements: [
        'Set up automated notifications for task updates',
        'Implement task prioritization system',
        'Create automated workflows for repetitive tasks'
      ]
    },
    automated: {
      tools: ['Zapier integrations', 'Make.com', 'AI task assistants'],
      improvements: [
        'Explore AI-powered task allocation',
        'Implement predictive analytics for resource planning',
        'Develop custom automations for your specific workflows'
      ]
    }
  },
  'customer-communication': {
    manual: {
      tools: ['HubSpot CRM (free tier)', 'Mailchimp', 'Zendesk'],
      improvements: [
        'Centralize customer information in a CRM',
        'Create email templates for common responses',
        'Implement a shared inbox for customer inquiries'
      ]
    },
    partial: {
      tools: ['Intercom', 'Front', 'Help Scout'],
      improvements: [
        'Set up automated follow-up sequences',
        'Implement chatbots for basic inquiries',
        'Create customer segmentation for targeted communication'
      ]
    },
    automated: {
      tools: ['Gong.io', 'Drift', 'ChatGPT API integration'],
      improvements: [
        'Implement AI-powered chat solutions',
        'Create personalized automated communication flows',
        'Develop omnichannel communication strategy with unified data'
      ]
    }
  },
  'data-entry': {
    manual: {
      tools: ['Google Forms', 'Airtable', 'Microsoft Forms'],
      improvements: [
        'Switch from paper to digital forms',
        'Create standardized templates for data collection',
        'Implement basic validation rules'
      ]
    },
    partial: {
      tools: ['Zapier', 'Formstack', 'DocuSign'],
      improvements: [
        'Set up automated data transfer between systems',
        'Implement OCR for document processing',
        'Create data validation workflows'
      ]
    },
    automated: {
      tools: ['UiPath', 'Automation Anywhere', 'Custom AI data processing'],
      improvements: [
        'Implement AI-powered data extraction',
        'Create continuous data quality monitoring',
        'Develop predictive data entry with AI suggestions'
      ]
    }
  },
  'scheduling': {
    manual: {
      tools: ['Calendly', 'Google Calendar', 'Microsoft Bookings'],
      improvements: [
        'Implement shared calendar system',
        'Create booking links for external appointments',
        'Establish resource allocation procedures'
      ]
    },
    partial: {
      tools: ['Acuity Scheduling', 'Doodle', 'When I Work'],
      improvements: [
        'Set up automated reminders for appointments',
        'Implement conflict detection for scheduling',
        'Create resource utilization reports'
      ]
    },
    automated: {
      tools: ['Reclaim.ai', 'Motion', 'AI scheduling assistants'],
      improvements: [
        'Implement AI-powered scheduling optimization',
        'Create predictive resource allocation',
        'Develop fully automated scheduling with preference learning'
      ]
    }
  },
  'reporting': {
    manual: {
      tools: ['Google Data Studio', 'Microsoft Power BI (free)', 'Tableau Public'],
      improvements: [
        'Establish key performance indicators (KPIs)',
        'Create basic dashboards for critical metrics',
        'Schedule regular reporting reviews'
      ]
    },
    partial: {
      tools: ['Databox', 'Klipfolio', 'Full Power BI'],
      improvements: [
        'Set up automated report generation',
        'Implement cross-data source integration',
        'Create alert thresholds for key metrics'
      ]
    },
    automated: {
      tools: ['Sisense', 'Domo', 'ThoughtSpot'],
      improvements: [
        'Implement AI-powered business insights',
        'Create predictive analytics models',
        'Develop automated decision support systems'
      ]
    }
  },
  'general': {
    manual: {
      tools: ['Slack', 'Microsoft Teams', 'Zoom'],
      improvements: [
        'Create a digital transformation roadmap',
        'Assess team training needs for new tools',
        'Identify most critical processes to automate first'
      ]
    },
    partial: {
      tools: ['ClickUp', 'Notion', 'Process Street'],
      improvements: [
        'Create standard operating procedures (SOPs)',
        'Implement process documentation strategy',
        'Develop automation testing framework'
      ]
    },
    automated: {
      tools: ['AI consulting services', 'Integration platforms', 'Custom development'],
      improvements: [
        'Create an AI strategy aligned with business goals',
        'Implement continuous improvement framework',
        'Develop internal AI literacy program'
      ]
    }
  }
};

// Helper to get recommendations based on category and rating
export const getRecommendations = (category: WorkflowCategory, rating: RatingLevel) => {
  const level = rating === 'Manual' ? 'manual' : 
                rating === 'Partially Automated' ? 'partial' : 'automated';
  
  return {
    tools: recommendationsByCategory[category][level].tools,
    improvements: recommendationsByCategory[category][level].improvements
  };
};
