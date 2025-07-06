import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.resend.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 email requests per minute
  message: 'Too many email requests, please try again later.',
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: 'Too many AI requests, please try again later.',
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://yourdomain.com', 'https://www.yourdomain.com'] : 
    ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Validation middleware
const validateEmailRequest = [
  body('userEmail').isEmail().normalizeEmail(),
  body('userName').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('report').notEmpty().withMessage('Report is required'),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }
    next();
  }
];

const validateAIRequest = [
  body('scores').notEmpty().withMessage('Scores are required'),
  body('keyChallenge').optional().isLength({ max: 500 }).trim().escape(),
  body('techReadiness').optional().isLength({ max: 500 }).trim().escape(),
  body('painPoint').optional().isLength({ max: 500 }).trim().escape(),
  body('businessType').optional().isLength({ max: 100 }).trim().escape(),
  body('teamSize').optional().isLength({ max: 100 }).trim().escape(),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }
    next();
  }
];

app.post('/api/send-report', emailLimiter, validateEmailRequest, (req: Request, res: Response) => {
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

app.post('/api/generateAiSummary', aiLimiter, validateAIRequest, (req: Request, res: Response) => {
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
          model: "gpt-4.1-mini",
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
  // Add AI-generated summary section if available
  const aiSummarySection = report.aiGeneratedSummary ? `
    <div class="section">
      <h2>✨ AI-Generated Insights</h2>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #00A8A8;">
        <p style="white-space: pre-line; line-height: 1.6;">${report.aiGeneratedSummary}</p>
      </div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; }
        .header { background-color: #1B365D; color: white; padding: 20px; text-align: center; }
        .logo { max-width: 200px; margin-bottom: 10px; }
        .section { margin-bottom: 30px; padding: 0 20px; }
        .category { margin-bottom: 20px; border-left: 4px solid #00A8A8; padding-left: 15px; }
        .rating { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 5px 0; }
        .manual { background-color: #fff4e6; color: #ff8b00; }
        .partial { background-color: #e6f4ff; color: #0066cc; }
        .automated { background-color: #e6fff4; color: #00cc66; }
        .time-savings { font-weight: bold; color: #00A8A8; }
        .progress-bar { height: 8px; background-color: #f1f1f1; border-radius: 4px; margin: 10px 0; }
        .progress-fill { height: 100%; background-color: #00A8A8; border-radius: 4px; }
        .dots { display: flex; margin: 10px 0; }
        .dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
        .dot-filled { background-color: #00A8A8; }
        .dot-empty { background-color: #e0e0e0; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .button { background-color: #00A8A8; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Workflow AI Audit Results</h1>
        </div>

        ${aiSummarySection}

        <div class="section">
          <h2>Overall Workflow Automation Level</h2>
          <p>Your business is currently operating at a <span class="${getRatingClass(report.overallRating)}">${report.overallRating}</span> level of automation.</p>

          <div class="dots">
            ${generateDots(report.overallScore)}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${report.overallScore}%"></div>
          </div>
          <p>Score: ${report.overallScore}/100</p>

          <p>With targeted improvements, you could save approximately <span class="time-savings">${report.totalTimeSavings}</span>.</p>
        </div>

        <div class="section">
          <h2>Top Recommendations:</h2>
          <ul>
            ${report.topRecommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h2>Detailed Analysis by Area:</h2>
          ${report.categories.map((cat: any) => `
            <div class="category">
              <h3>${getCategoryName(cat.category)}</h3>
              <p>Current automation level: <span class="${getRatingClass(cat.rating)}">${cat.rating}</span></p>

              <div class="dots">
                ${generateDots(cat.score)}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${cat.score}%"></div>
              </div>
              <p>Score: ${cat.score}/100</p>

              <p>Potential time savings: <span class="time-savings">${cat.timeSavings}</span></p>
              <p><strong>Recommended tools:</strong> ${cat.tools.join(', ')}</p>
              <p><strong>Suggested improvements:</strong></p>
              <ul>
                ${cat.improvements.map((imp: string) => `<li>${imp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="section" style="text-align: center;">
          <p><strong>Ready to enhance your workflow?</strong></p>
          <a href="https://calendar.app.google/fDRgarRXA42zzqEo8" class="button" style="background-color: #00A8A8; color: #FFFFFF;">Book a Free 20-Minute Consultation</a>
        </div>

        <div class="footer">
          <p><strong>Nomadic Liberty LLC</strong></p>
          <p>This report was generated based on your inputs to the Workflow AI Audit tool.</p>
          <p>Have questions? Reply to this email for assistance.</p>
          <p>© ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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

const generateDots = (score: number): string => {
  const totalDots = 5;
  const filledDots = Math.round((score / 100) * totalDots);

  let dotsHtml = '';
  for (let i = 0; i < totalDots; i++) {
    dotsHtml += `<div class="dot ${i < filledDots ? 'dot-filled' : 'dot-empty'}"></div>`;
  }

  return dotsHtml;
};

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


CRITICAL FORMATTING REQUIREMENTS:
- This is an analytical report, NOT a letter or email
- Start directly with analysis content - no greetings like "Dear Business Owner" or "Hello"
- End with the Nomadic Liberty paragraph - no sign-offs like "Best regards" or "Sincerely"
- Use educational language like 'areas to explore' and 'you might consider' rather than prescriptive recommendations
- Avoid listing specific software tool names
- Keep the tone collaborative and helpful, not expert or authoritative
- Present as a direct business analysis without any personal communication formatting
`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
