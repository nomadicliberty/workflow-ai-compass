
import { RatingLevel, WorkflowCategory } from '../types/audit';

// Helper function to calculate score based on multiple-choice index
export const calculateScoreFromOption = (optionIndex: number): number => {
  // Options are arranged from least automated (0) to most automated (4)
  return optionIndex * 25; // 0, 25, 50, 75, 100
};

// Get rating level based on numeric score
export const getRatingFromScore = (score: number): RatingLevel => {
  if (score < 40) return 'Manual';
  if (score < 75) return 'Partially Automated';
  return 'Fully Automated';
};

// Calculate estimated time savings based on score and category
export const calculateTimeSavings = (category: WorkflowCategory, score: number): string => {
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
