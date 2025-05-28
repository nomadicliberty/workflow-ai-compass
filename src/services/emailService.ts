
import { AuditReport } from "../types/audit";

interface SendReportEmailParams {
  userEmail: string;
  report: AuditReport;
  painPoint?: string;
  techReadiness?: string;
}

/**
 * Sends an email with the audit report results via API endpoint
 */
export const sendReportEmail = async ({ 
  userEmail, 
  report, 
  painPoint,
  techReadiness
}: SendReportEmailParams): Promise<boolean> => {
  try {
    console.log(`Sending report email to ${userEmail} via API endpoint`);
    
    // Include AI-generated summary in the email data
    const emailData = {
      userEmail,
      report: {
        ...report,
        // Ensure AI summary is included if available
        aiGeneratedSummary: report.aiGeneratedSummary
      },
      painPoint,
      techReadiness
    };
    
    console.log('Email payload size:', JSON.stringify(emailData).length, 'characters');
    
    // Trim AI summary if it's too large (over 5000 characters)
    if (emailData.report.aiGeneratedSummary && emailData.report.aiGeneratedSummary.length > 5000) {
      console.log('Trimming AI summary for email - original length:', emailData.report.aiGeneratedSummary.length);
      emailData.report.aiGeneratedSummary = emailData.report.aiGeneratedSummary.substring(0, 4900) + '...';
    }
    
    // Make API call to the correct backend endpoint
    const response = await fetch('https://workflow-ai-audit.onrender.com/api/send-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { error: 'Failed to parse error response' };
      }
      console.error("API error:", errorData);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
