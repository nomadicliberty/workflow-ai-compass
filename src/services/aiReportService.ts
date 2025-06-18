
import { API_CONFIG, CATEGORY_NAMES } from '../config/constants';
import { ErrorHandler } from '../utils/errorHandler';
import { validateTextInput } from '../utils/validation';

interface CategoryScore {
  score: number;
  level: string;
}

interface ReportScores {
  overall: number;
  totalTimeSavings: string;
  byCategory: Record<string, CategoryScore>;
}

interface AIReportRequest {
  scores: ReportScores;
  keyChallenge?: string;
  techReadiness?: string;
  painPoint?: string;
  businessType?: string;
  teamSize?: string;
}

interface AIReportResponse {
  summary: string;
}

/**
 * Sends assessment data to the AI backend for report generation with enhanced error handling
 */
export const generateAIReport = async (
  scores: ReportScores,
  keyChallenge?: string,
  techReadiness?: string,
  businessType?: string,
  teamSize?: string
): Promise<string> => {
  return ErrorHandler.withErrorHandling(async () => {
    // Validate inputs
    if (keyChallenge) {
      const validation = validateTextInput(keyChallenge);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid key challenge input');
      }
    }

    if (techReadiness) {
      const validation = validateTextInput(techReadiness);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid tech readiness input');
      }
    }

    const requestData: AIReportRequest = {
      scores,
      keyChallenge: keyChallenge || 'workflow efficiency',
      techReadiness,
      painPoint: keyChallenge,
      businessType,
      teamSize
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUTS.AI_GENERATION);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_AI_SUMMARY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const aiResponse: AIReportResponse = await response.json();
    
    if (!aiResponse.summary) {
      throw new Error('No summary received from AI service');
    }
    
    return aiResponse.summary;
  }, 'AI_REPORT_GENERATION') || '';
};

/**
 * Transforms audit report data into the format expected by the AI backend
 */
export const transformReportForAI = (report: any): ReportScores => {
  const byCategory: Record<string, CategoryScore> = {};
  
  report.categories.forEach((category: any) => {
    const categoryName = CATEGORY_NAMES[category.category as keyof typeof CATEGORY_NAMES] || category.category;
    byCategory[categoryName] = {
      score: category.score,
      level: category.rating
    };
  });

  return {
    overall: report.overallScore,
    totalTimeSavings: report.totalTimeSavings.split(' ')[0], // Extract just the number
    byCategory
  };
};
