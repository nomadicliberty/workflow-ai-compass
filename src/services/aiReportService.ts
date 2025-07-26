import { API_CONFIG } from '../config/constants';
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
 * Sends assessment data to the AI backend for report generation with enhanced error handling and retry logic
 */
export const generateAIReport = async (
  scores: ReportScores,
  keyChallenge?: string,
  techReadiness?: string,
  businessType?: string,
  teamSize?: string
): Promise<string> => {
  return ErrorHandler.withRetry(async () => {
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

    try {
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
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('AI generation timeout');
      }
      throw error;
    }
  }, 'AI_REPORT_GENERATION', 2, 3000) || generateFallbackReport(scores, businessType); // 2 retries with 3s base delay
};

/**
 * Generates a fallback report when AI service is unavailable
 */
const generateFallbackReport = (scores: ReportScores, businessType?: string): string => {
  const businessContext = businessType && businessType !== 'Other' ? ` for ${businessType} businesses` : '';
  
  return `Based on your workflow audit results, here's an analysis of your current automation level:

**Overall Assessment**: Your business scored ${scores.overall}/100 for workflow automation, which means you have significant opportunities to streamline your operations and save time.

**Time Savings Potential**: With the right improvements, you could save approximately ${scores.totalTimeSavings} hours per week.

**Key Areas for Improvement**:
${Object.entries(scores.byCategory).map(([category, data]) => 
  `• **${category}**: Currently ${data.level} (${data.score}/100) - Consider implementing automation tools to reduce manual work and improve efficiency.`
).join('\n')}

**Next Steps${businessContext}**:
1. **Start Small**: Begin with the category that scored lowest, as it likely offers the quickest wins
2. **Evaluate Tools**: Research automation platforms that integrate well with your current systems
3. **Plan Implementation**: Roll out changes gradually to ensure smooth adoption by your team
4. **Measure Results**: Track time savings and efficiency improvements after each implementation

**Professional Support**: If you'd like personalized guidance on implementing these improvements, Nomadic Liberty specializes in helping businesses like yours adopt AI and automation solutions. Our consultants can provide hands-on support tailored to your specific needs, budget, and comfort level with new technology.

This assessment provides a starting point for your automation journey. Each small step toward automation will compound over time, leading to significant productivity gains and allowing you to focus on growing your business rather than managing repetitive tasks.`;
};

/**
 * Transforms audit report data into the format expected by the AI backend
 */
export const transformReportForAI = (report: any): ReportScores => {
  const byCategory: Record<string, CategoryScore> = {};

  report.categories.forEach((category: any) => {
    // Use internal backend key, not display name
    byCategory[category.category] = {
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