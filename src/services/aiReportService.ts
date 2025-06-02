
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';
import { getCategoryName } from '../constants/categories';

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
 * Sends assessment data to the AI backend for report generation
 */
export const generateAIReport = async (
  scores: ReportScores,
  keyChallenge?: string,
  techReadiness?: string,
  businessType?: string,
  teamSize?: string
): Promise<string> => {
  try {
    console.log('🤖 Sending assessment data to AI backend for report generation...');
    
    const requestData: AIReportRequest = {
      scores,
      keyChallenge: keyChallenge || 'workflow efficiency',
      techReadiness,
      painPoint: keyChallenge,
      businessType,
      teamSize
    };

    console.log('🌐 Making API call to:', API_ENDPOINTS.AI_REPORT);
    console.log('📊 Request data:', JSON.stringify(requestData, null, 2));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(API_ENDPOINTS.AI_REPORT, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ AI report generation error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to generate AI report: ${response.status} ${response.statusText}`);
    }

    const aiResponse: AIReportResponse = await response.json();
    console.log('✅ AI summary generated successfully, length:', aiResponse.summary?.length || 0);
    
    return aiResponse.summary;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("❌ AI generation timed out after 60 seconds");
      throw new Error('AI generation timed out after 60 seconds');
    }
    console.error("❌ Error generating AI report:", error);
    throw error;
  }
};

/**
 * Transforms audit report data into the format expected by the AI backend
 */
export const transformReportForAI = (report: any): ReportScores => {
  const byCategory: Record<string, CategoryScore> = {};
  
  report.categories.forEach((category: any) => {
    const categoryName = getCategoryName(category.category);
    byCategory[categoryName] = {
      score: category.score,
      level: category.rating
    };
  });

  return {
    overall: report.overallScore,
    totalTimeSavings: report.totalTimeSavings.split(' ')[0],
    byCategory
  };
};
