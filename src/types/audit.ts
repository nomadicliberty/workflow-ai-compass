
export type RatingLevel = 'Manual' | 'Partially Automated' | 'Fully Automated';

export interface AuditQuestion {
  id: string;
  text: string;
  options?: string[];
  type: 'multiple-choice' | 'text' | 'rating';
  category: WorkflowCategory;
}

export type WorkflowCategory = 
  | 'task-management' 
  | 'customer-communication' 
  | 'data-entry' 
  | 'scheduling' 
  | 'reporting' 
  | 'general';

export interface AuditAnswer {
  questionId: string;
  value: string;
  category: WorkflowCategory;
}

export interface CategoryAssessment {
  category: WorkflowCategory;
  rating: RatingLevel;
  score: number;
  tools: string[];
  improvements: string[];
  timeSavings: string;
}

export interface AuditReport {
  categories: CategoryAssessment[];
  overallRating: RatingLevel;
  overallScore: number;
  topRecommendations: string[];
  totalTimeSavings: string;
  aiGeneratedSummary?: string;
}

// Enhanced type safety for category labels
export const categoryLabels: Record<WorkflowCategory, string> = {
  'task-management': 'Task Management',
  'customer-communication': 'Customer Communication',
  'data-entry': 'Data Entry',
  'scheduling': 'Scheduling',
  'reporting': 'Reporting',
  'general': 'General Business Operations'
} as const;

export const ratingDescriptions: Record<RatingLevel, string> = {
  'Manual': 'Processes are mostly done by hand with minimal technology assistance',
  'Partially Automated': 'Some technology and automation is in place, but with room for improvement',
  'Fully Automated': 'Processes are optimized with significant AI or automation technology'
} as const;

export const getRatingColor = (rating: RatingLevel): string => {
  const colorMap: Record<RatingLevel, string> = {
    'Manual': 'bg-orange-100 text-orange-800 border-orange-200',
    'Partially Automated': 'bg-blue-100 text-blue-800 border-blue-200',
    'Fully Automated': 'bg-green-100 text-green-800 border-green-200'
  };
  
  return colorMap[rating] || 'bg-gray-100 text-gray-800 border-gray-200';
};
