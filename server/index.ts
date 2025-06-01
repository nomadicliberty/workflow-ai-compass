import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { buildFormattedReport } from '../src/services/ReportBuilder';
import { EmailRenderer } from '../src/renderers/EmailRenderer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-report', (req: Request, res: Response) => {
  (async () => {
    const { userEmail, userName, report, painPoint, techReadiness } = req.body;

    if (!userEmail || !report) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      res.status(500).json({ error: 'Email service configuration error' });
      return;
    }

    console.log('📧 Preparing to send email with Resend API...');
    console.log('- User email:', userEmail);
    console.log('- User name:', userName || 'Not provided');
    console.log('- Has AI summary:', !!report.aiGeneratedSummary);
    console.log('- API key length:', resendApiKey.length);

    const customerEmailHtml = generateReportHtml(report, painPoint, techReadiness);
    const adminEmailHtml = generateAdminReportHtml(userEmail, userName, report, painPoint, techReadiness);

    try {
      // Send email to customer
      const customerResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Jason Henry <jason@nomadicliberty.com>',
          to: userEmail,
          subject: 'Your Workflow AI Audit Results',
          html: customerEmailHtml,
        }),
      });

      // Send copy to admin with customer details
      const adminResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Workflow Audit <jason@nomadicliberty.com>',
          to: 'jason@nomadicliberty.com',
          subject: `New Workflow Audit - ${userName || 'No Name'} - ${userEmail}`,
          html: adminEmailHtml,
        }),
      });

      if (!customerResponse.ok) {
        const error = await customerResponse.json();
        console.error('❌ Customer email error:', error);
        res.status(500).json({ error: 'Failed to send customer email' });
        return;
      }

      if (!adminResponse.ok) {
        const error = await adminResponse.json();
        console.error('❌ Admin email error:', error);
        // Continue even if admin email fails
      }

      const result = await customerResponse.json();
      console.log('✅ Emails sent successfully:', result);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Server error sending email:', err);
      res.status(500).json({ error: 'Server error' });
    }
  })();
});

app.post('/api/generateAiSummary', (req: Request, res: Response) => {
  (async () => {
    const { scores, keyChallenge = 'workflow efficiency', techReadiness, painPoint } = req.body;

    console.log('🤖 Received AI summary request with data:', {
      scores: scores ? 'present' : 'missing',
      keyChallenge,
      techReadiness: techReadiness ? 'present' : 'not provided',
      painPoint: painPoint ? 'present' : 'not provided'
    });

    if (!scores || !scores.byCategory) {
      console.error('❌ Missing scores data in request');
      res.status(400).json({ error: 'Missing scores data' });
      return;
    }

    const prompt = buildPrompt(scores, keyChallenge, techReadiness, painPoint);
    console.log('📝 Generated prompt length:', prompt.length);

    try {
      console.log('🚀 Calling OpenAI API...');
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY?.trim()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        const err = await openaiResponse.json();
        console.error("❌ OpenAI error:", err);
        res.status(500).json({ error: 'Failed to get summary from GPT' });
        return;
      }

      const json = await openaiResponse.json() as {
      choices: { message: { content: string } }[];
      };

      const summary = json.choices?.[0]?.message?.content || 'No summary returned.';
      console.log('✅ OpenAI response received, summary length:', summary.length);
      res.json({ summary });
    } catch (error) {
      console.error("❌ GPT error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })();
});

const generateReportHtml = (
  report: any,
  painPoint?: string,
  techReadiness?: string
): string => {
  const formattedReport = buildFormattedReport(report, undefined, undefined, painPoint, techReadiness);
  const renderer = new EmailRenderer(formattedReport);
  return renderer.render();
};

const generateAdminReportHtml = (
  userEmail: string,
  userName: string | undefined,
  report: any,
  painPoint?: string,
  techReadiness?: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .header { background-color: #1B365D; color: white; padding: 20px; margin-bottom: 20px; }
        .customer-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00A8A8; }
        .score-highlight { font-size: 18px; font-weight: bold; color: #00A8A8; }
        .section { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Workflow Audit Submission</h1>
      </div>

      <div class="customer-info">
        <h2>Customer Details</h2>
        <p><strong>Name/Company:</strong> ${userName || 'Not provided'}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Pain Point:</strong> ${painPoint || 'Not provided'}</p>
        <p><strong>Tech Readiness:</strong> ${techReadiness || 'Not provided'}</p>
        <p class="score-highlight">Overall Score: ${report.overallScore}/100</p>
        <p><strong>Rating:</strong> ${report.overallRating}</p>
        <p><strong>Time Savings:</strong> ${report.totalTimeSavings}</p>
      </div>

      <div class="section">
        <h2>Category Breakdown</h2>
        ${report.categories.map((cat: any) => `
          <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <h3>${getCategoryName(cat.category)}</h3>
            <p>Score: ${cat.score}/100 (${cat.rating})</p>
            <p>Time Savings: ${cat.timeSavings}</p>
            <p>Tools: ${cat.tools.join(', ')}</p>
          </div>
        `).join('')}
      </div>

      ${report.aiGeneratedSummary ? `
      <div class="section">
        <h2>AI-Generated Summary</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p style="white-space: pre-line;">${report.aiGeneratedSummary}</p>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2>Top Recommendations</h2>
        <ul>
          ${report.topRecommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `;
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

function buildPrompt(scores: any, keyChallenge: string, techReadiness?: string, painPoint?: string): string {
  const { overall, totalTimeSavings, byCategory } = scores;

  const categories = Object.entries(byCategory)
    .map(([name, data]: any) => `- ${name}: ${data.score}/100 (${data.level})`)
    .join('\n');

  // Build personalized context
  let personalContext = '';
  const challenge = painPoint || keyChallenge;
  
  if (challenge) {
    personalContext += `Their biggest operational challenge is: ${challenge}\n`;
  }
  
  if (techReadiness) {
    personalContext += `Their team's attitude toward new technology: ${techReadiness}\n`;
  }

  return `
You are an AI automation consultant generating a friendly, human-readable report for a small business owner who just completed a workflow audit.

${personalContext}
Their overall automation score is ${overall}/100  
They could save about ${totalTimeSavings} hours per week with improvements.

Category breakdown:
${categories}

Please write a comprehensive, personalized report that:

1. Addresses their specific challenge ("${challenge}") in the opening
2. ${techReadiness ? `Considers their team's technology comfort level (${techReadiness}) when making recommendations` : 'Uses accessible, non-technical language'}
3. For each category, explains what the score means and offers 2–3 specific improvement suggestions
4. Recommends practical tools or platforms they could try
5. Maintains an encouraging, supportive tone throughout

End with a paragraph explaining how Nomadic Liberty, the consultancy that provided this audit, can help implement these improvements with hands-on support tailored to their specific needs and comfort level.

Frame this as an AI-generated analysis, not a personal communication. Use educational language like 'areas to explore' and 'you might consider' rather than prescriptive recommendations like 'we recommend' or 'you should implement'. Avoid listing specific software tool names. Keep the tone collaborative and helpful, not expert or authoritative. Do not include email formatting like subject lines, greetings, or signatures.
`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
