
import { AuditReport } from "../types/audit";
import { API_ENDPOINTS, API_CONFIG } from "../constants/api";

interface SendReportEmailParams {
  userEmail: string;
  userName?: string;
  report: AuditReport;
  painPoint?: string;
  techReadiness?: string;
}

export const sendReportEmail = async ({ 
  userEmail, 
  userName,
  report, 
  painPoint,
  techReadiness
}: SendReportEmailParams): Promise<boolean> => {
  try {
    console.log(`📧 Sending report email to ${userEmail} via API endpoint`);
    
    const emailData = {
      userEmail,
      userName,
      report: {
        ...report,
        aiGeneratedSummary: report.aiGeneratedSummary
      },
      painPoint,
      techReadiness
    };
    
    console.log('📄 Email payload size:', JSON.stringify(emailData).length, 'characters');
    
    // Trim AI summary if it's too large
    if (emailData.report.aiGeneratedSummary && emailData.report.aiGeneratedSummary.length > API_CONFIG.MAX_AI_SUMMARY_LENGTH) {
      console.log('✂️ Trimming AI summary for email - original length:', emailData.report.aiGeneratedSummary.length);
      emailData.report.aiGeneratedSummary = emailData.report.aiGeneratedSummary.substring(0, API_CONFIG.TRIMMED_AI_SUMMARY_LENGTH) + '...';
    }
    
    console.log('🌐 Making API call to:', API_ENDPOINTS.SEND_REPORT);
    
    const response = await fetch(API_ENDPOINTS.SEND_REPORT, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { error: 'Failed to parse error response' };
      }
      console.error("❌ Email API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return false;
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};
