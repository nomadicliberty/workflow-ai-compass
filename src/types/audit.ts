
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
}

export interface AuditReport {
  categories: CategoryAssessment[];
  overallRating: RatingLevel;
  overallScore: number;
  topRecommendations: string[];
}

export const categoryLabels: Record<WorkflowCategory, string> = {
  'task-management': 'Task Management',
  'customer-communication': 'Customer Communication',
  'data-entry': 'Data Entry',
  'scheduling': 'Scheduling',
  'reporting': 'Reporting',
  'general': 'General Business Operations'
};

export const ratingDescriptions: Record<RatingLevel, string> = {
  'Manual': 'Processes are mostly done by hand with minimal technology assistance',
  'Partially Automated': 'Some technology and automation is in place, but with room for improvement',
  'Fully Automated': 'Processes are optimized with significant AI or automation technology'
};

export const getRatingColor = (rating: RatingLevel): string => {
  switch (rating) {
    case 'Manual':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Partially Automated':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Fully Automated':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
