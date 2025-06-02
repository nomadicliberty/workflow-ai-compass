
export const API_ENDPOINTS = {
  SEND_REPORT: 'https://workflow-ai-audit.onrender.com/api/send-report',
  AI_REPORT: 'https://workflow-ai-audit.onrender.com/api/generateAiSummary'
};

export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  MAX_AI_SUMMARY_LENGTH: 5000,
  TRIMMED_AI_SUMMARY_LENGTH: 4900
};
