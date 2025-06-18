
import { AuditReport } from "../types/audit";
import { API_CONFIG } from '../config/constants';
import { ErrorHandler } from '../utils/errorHandler';
import { validateEmail, sanitizeHtml } from '../utils/validation';

interface SendReportEmailParams {
  userEmail: string;
  userName?: string;
  report: AuditReport;
  painPoint?: string;
  techReadiness?: string;
}

/**
 * Sends an email with the audit report results via API endpoint with enhanced validation
 */
export const sendReportEmail = async ({ 
  userEmail, 
  userName,
  report, 
  painPoint,
  techReadiness
}: SendReportEmailParams): Promise<boolean> => {
  return ErrorHandler.withErrorHandling(async () => {
    // Validate email format
    if (!validateEmail(userEmail)) {
      throw new Error('Invalid email address format');
    }

    // Sanitize user inputs to prevent XSS
    const sanitizedData = {
      userEmail: userEmail.trim().toLowerCase(),
      userName: userName ? sanitizeHtml(userName.trim()) : undefined,
      report: {
        ...report,
        aiGeneratedSummary: report.aiGeneratedSummary ? sanitizeHtml(report.aiGeneratedSummary) : undefined
      },
      painPoint: painPoint ? sanitizeHtml(painPoint.trim()) : undefined,
      techReadiness: techReadiness ? sanitizeHtml(techReadiness.trim()) : undefined
    };

    // Trim AI summary if it's too large (over 5000 characters)
    if (sanitizedData.report.aiGeneratedSummary && sanitizedData.report.aiGeneratedSummary.length > 5000) {
      sanitizedData.report.aiGeneratedSummary = sanitizedData.report.aiGeneratedSummary.substring(0, 4900) + '...';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUTS.EMAIL_SEND);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_REPORT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return true;
  }, 'EMAIL_SEND') !== null;
};
