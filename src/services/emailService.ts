
import { AuditReport } from "../types/audit";
import { generateReportHtml } from "./emailTemplates";
import { RESEND_API_KEY, DEFAULT_SENDER, DEFAULT_BCC } from "../config/emailConfig";

interface SendReportEmailParams {
  userEmail: string;
  report: AuditReport;
  bccEmail?: string;
  painPoint?: string;
  techReadiness?: string;
}

/**
 * Sends an email with the audit report results
 */
export const sendReportEmail = async ({ 
  userEmail, 
  report, 
  bccEmail = DEFAULT_BCC, 
  painPoint,
  techReadiness
}: SendReportEmailParams): Promise<boolean> => {
  try {
    console.log(`Sending report email to ${userEmail} with BCC to ${bccEmail}`);
    
    // Create the HTML content for the email
    const emailHtml = generateReportHtml(report, painPoint, techReadiness);
    
    // Make API call to Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: DEFAULT_SENDER,
        to: userEmail,
        bcc: bccEmail,
        subject: 'Your Workflow AI Audit Results',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
