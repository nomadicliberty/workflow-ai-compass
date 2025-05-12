
import { AuditReport } from "../types/audit";

interface SendReportEmailParams {
  userEmail: string;
  report: AuditReport;
  bccEmail?: string;
}

export const sendReportEmail = async ({ 
  userEmail, 
  report, 
  bccEmail = "your-email@example.com" // Default BCC email
}: SendReportEmailParams): Promise<boolean> => {
  try {
    console.log(`Sending report email to ${userEmail} with BCC to ${bccEmail}`);
    console.log("Report content:", report);

    // In production, this would use Resend's API
    // For now we're just simulating the API call
    // Will be replaced with actual implementation once API key is provided
    
    // Simulate API call
    // In real implementation with Resend API key:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Workflow AI Audit <workflow@yourdomain.com>',
        to: userEmail,
        bcc: bccEmail,
        subject: 'Your Workflow AI Audit Report',
        html: generateReportHtml(report),
      }),
    });

    return response.ok;
    */

    // Simulation for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Helper function to generate HTML content for the email
const generateReportHtml = (report: AuditReport): string => {
  // Build HTML email template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6e46c7; color: white; padding: 20px; text-align: center; }
        .section { margin-bottom: 30px; }
        .category { margin-bottom: 20px; border-left: 4px solid #6e46c7; padding-left: 15px; }
        .rating { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 5px 0; }
        .manual { background-color: #fff4e6; color: #ff8b00; }
        .partial { background-color: #e6f4ff; color: #0066cc; }
        .automated { background-color: #e6fff4; color: #00cc66; }
        .time-savings { font-weight: bold; color: #6e46c7; }
        .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
        .button { background-color: #6e46c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Workflow AI Audit Results</h1>
        </div>
        
        <div class="section">
          <h2>Overall Workflow Automation Level</h2>
          <p>Your business is currently operating at a <span class="${getRatingClass(report.overallRating)}">${report.overallRating}</span> level of automation.</p>
          <p>With targeted improvements, you could save approximately <span class="time-savings">${report.totalTimeSavings}</span>.</p>
        </div>
        
        <div class="section">
          <h2>Top Recommendations:</h2>
          <ul>
            ${report.topRecommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>Detailed Analysis by Area:</h2>
          ${report.categories.map(cat => `
            <div class="category">
              <h3>${getCategoryName(cat.category)}</h3>
              <p>Current automation level: <span class="${getRatingClass(cat.rating)}">${cat.rating}</span></p>
              <p>Potential time savings: <span class="time-savings">${cat.timeSavings}</span></p>
              <p><strong>Recommended tools:</strong> ${cat.tools.join(', ')}</p>
              <p><strong>Suggested improvements:</strong></p>
              <ul>
                ${cat.improvements.map(imp => `<li>${imp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <div class="section" style="text-align: center;">
          <p><strong>Ready to enhance your workflow?</strong></p>
          <a href="https://calendly.com/yourbusiness/discovery" class="button">Book a Free Discovery Call</a>
        </div>
        
        <div class="footer">
          <p>This report was generated based on your inputs to the Workflow AI Audit tool.</p>
          <p>Have questions? Reply to this email for assistance.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper functions
const getRatingClass = (rating: string): string => {
  switch (rating) {
    case 'Manual': return 'manual';
    case 'Partially Automated': return 'partial';
    case 'Fully Automated': return 'automated';
    default: return '';
  }
};

const getCategoryName = (category: string): string => {
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
