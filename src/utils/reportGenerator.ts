
import { AuditQuestion, AuditAnswer, CategoryAssessment, AuditReport, RatingLevel, WorkflowCategory } from '../types/audit';
import { calculateScoreFromOption, getRatingFromScore, calculateTimeSavings } from './scoringUtils';
import { auditQuestions } from '../data/questions';
import { getRecommendations } from '../data/recommendations';

// Generate assessment for a specific category based on answers
export const generateCategoryAssessment = (
  answers: AuditAnswer[],
  category: WorkflowCategory
): CategoryAssessment => {
  // Filter answers for this category
  const categoryAnswers = answers.filter(a => a.category === category);
  
  if (categoryAnswers.length === 0) {
    // Default assessment if no answers
    const defaultRating: RatingLevel = 'Manual';
    const defaultScore = 0;
    const { tools, improvements } = getRecommendations(category, defaultRating);
    const timeSavings = calculateTimeSavings(category, defaultScore);
    
    return {
      category,
      rating: defaultRating,
      score: defaultScore,
      tools,
      improvements,
      timeSavings
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
    timeSavings
  };
};

// Generate the complete audit report from all answers
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
    totalTimeSavings
  };
};
