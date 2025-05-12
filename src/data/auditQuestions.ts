
import { AuditQuestion, AuditAnswer, CategoryAssessment, AuditReport, RatingLevel, WorkflowCategory } from '../types/audit';

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

// Helper function to calculate score based on multiple-choice index
const calculateScoreFromOption = (optionIndex: number): number => {
  // Options are arranged from least automated (0) to most automated (4)
  return optionIndex * 25; // 0, 25, 50, 75, 100
};

const getRatingFromScore = (score: number): RatingLevel => {
  if (score < 40) return 'Manual';
  if (score < 75) return 'Partially Automated';
  return 'Fully Automated';
};

// Calculate estimated time savings based on score and category
const calculateTimeSavings = (category: WorkflowCategory, score: number): string => {
  // Base values in hours per week
  const baseSavings = {
    'task-management': 4,
    'customer-communication': 5,
    'data-entry': 6,
    'scheduling': 3,
    'reporting': 4,
    'general': 2
  };
  
  // Higher score = more potential time savings from automation
  const potentialFactor = score / 100;
  
  // Low score means more time savings potential because there's more to automate
  const inverseFactor = 1 - (potentialFactor * 0.7);
  
  // Calculate hours saved (more manual = more potential hours saved)
  const hoursSaved = Math.round(baseSavings[category] * inverseFactor * 10) / 10;
  
  return `${hoursSaved} hours/week`;
};

// Tools and improvement suggestions for each category based on automation level
const recommendationsByCategory: Record<WorkflowCategory, {
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

const getRecommendations = (category: WorkflowCategory, rating: RatingLevel) => {
  const level = rating === 'Manual' ? 'manual' : 
                rating === 'Partially Automated' ? 'partial' : 'automated';
  
  return {
    tools: recommendationsByCategory[category][level].tools,
    improvements: recommendationsByCategory[category][level].improvements
  };
};

export const generateCategoryAssessment = (
  answers: AuditAnswer[],
  category: WorkflowCategory
): CategoryAssessment => {
  // Filter answers for this category
  const categoryAnswers = answers.filter(a => a.category === category);
  
  if (categoryAnswers.length === 0) {
    // Default assessment if no answers
    return {
      category,
      rating: 'Manual',
      score: 0,
      tools: recommendationsByCategory[category]['manual'].tools,
      improvements: recommendationsByCategory[category]['manual'].improvements,
      timeSavings: '0 hours/week' // Adding missing timeSavings property
    };
  }
  
  // Calculate score based on multiple choice answers
  let totalScore = 0;
  let countedAnswers = 0;
  
  categoryAnswers.forEach(answer => {
    const question = auditQuestions.find(q => q.id === answer.questionId);
    
    if (question?.type === 'multiple-choice' && question.options) {
      const optionIndex = question.options.findIndex(opt => opt === answer.value);
      if (optionIndex !== -1) {
        totalScore += calculateScoreFromOption(optionIndex);
        countedAnswers++;
      }
    }
    // Text answers don't contribute to automation score
  });
  
  const averageScore = countedAnswers > 0 ? totalScore / countedAnswers : 0;
  const roundedScore = Math.round(averageScore);
  const rating = getRatingFromScore(roundedScore);
  const { tools, improvements } = getRecommendations(category, rating);
  const timeSavings = calculateTimeSavings(category, roundedScore);
  
  return {
    category,
    rating,
    score: roundedScore,
    tools,
    improvements,
    timeSavings // Adding the missing timeSavings property
  };
};

export const generateAuditReport = (answers: AuditAnswer[]): AuditReport => {
  // Generate assessments for each category
  const categories: WorkflowCategory[] = [
    'task-management',
    'customer-communication',
    'data-entry',
    'scheduling',
    'reporting'
  ];
  
  const categoryAssessments = categories.map(category => 
    generateCategoryAssessment(answers, category)
  );
  
  // Calculate overall score and rating
  const totalScore = categoryAssessments.reduce((sum, assessment) => sum + assessment.score, 0);
  const averageScore = totalScore / categoryAssessments.length;
  const overallRating = getRatingFromScore(Math.round(averageScore));
  
  // Calculate total time savings across all categories
  const totalHours = categoryAssessments.reduce((sum, assessment) => {
    const hours = parseFloat(assessment.timeSavings.split(' ')[0]);
    return sum + hours;
  }, 0);
  const totalTimeSavings = `${Math.round(totalHours * 10) / 10} hours/week`;
  
  // Get top recommendations across all categories
  // Prioritize recommendations from lower-rated areas
  const sortedAssessments = [...categoryAssessments].sort((a, b) => a.score - b.score);
  
  // Take 1 improvement from each of the 3 lowest-scored categories
  const topRecommendations = sortedAssessments
    .slice(0, 3)
    .map(assessment => assessment.improvements[0]);
  
  return {
    categories: categoryAssessments,
    overallRating,
    overallScore: Math.round(averageScore),
    topRecommendations,
    totalTimeSavings // Adding the missing totalTimeSavings property
  };
};
