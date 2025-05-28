
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
    
    // Make API call to our backend endpoint
    const response = await fetch('/api/send-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
