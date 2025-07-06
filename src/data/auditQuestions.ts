
// This file is now just a re-export file for backward compatibility
import { auditQuestions, getQuestionsForIndustry } from './questions';
import { generateCategoryAssessment, generateAuditReport } from '../utils/reportGenerator';

// Re-export everything to maintain backward compatibility
export { auditQuestions, getQuestionsForIndustry, generateCategoryAssessment, generateAuditReport };
