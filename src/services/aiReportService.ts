
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
  techReadiness?: string
): Promise<string> => {
  try {
    console.log('🤖 Sending assessment data to AI backend for report generation...');
    console.log('Data being sent:', { scores, keyChallenge, techReadiness });
    
    const requestData: AIReportRequest = {
      scores,
      keyChallenge: keyChallenge || 'workflow efficiency',
      techReadiness,
      painPoint: keyChallenge // Also send as painPoint for backward compatibility
    };

    console.log('🌐 Making API call to:', 'https://workflow-ai-audit.onrender.com/api/generateAiSummary');
    
    // Increased timeout to 60 seconds for GPT-4 API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch('https://workflow-ai-audit.onrender.com/api/generateAiSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ AI report generation error:", errorData);
      throw new Error('Failed to generate AI report');
    }

    const aiResponse: AIReportResponse = await response.json();
    console.log('✅ AI summary generated successfully, length:', aiResponse.summary.length);
    console.log('Preview:', aiResponse.summary.substring(0, 200) + '...');
    
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
    const categoryName = getCategoryDisplayName(category.category);
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

// Helper function to get display names for categories
const getCategoryDisplayName = (category: string): string => {
  const names: Record<string, string> = {
    'task-management': 'Task Management',
    'customer-communication': 'Customer Communication',
    'data-entry': 'Data Entry',
    'scheduling': 'Scheduling',
    'reporting': 'Reporting',
    'general': 'General Business Operations'
  };
  
  return names[category] || category;
};
