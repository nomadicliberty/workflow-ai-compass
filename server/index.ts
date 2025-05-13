import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-report', async (req, res) => {
  const { userEmail, report, painPoint, techReadiness } = req.body;

  if (!userEmail || !report) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailHtml = generateReportHtml(report, painPoint, techReadiness);
  console.log("EMAIL HTML OUTPUT:\n", emailHtml);


  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jason Henry <jason@nomadicliberty.com>',
        to: userEmail,
        bcc: 'jason@nomadicliberty.com',
        subject: 'Your Workflow AI Audit Results',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', JSON.stringify(error, null, 2));

      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
const generateReportHtml = (
  report: any,
  painPoint?: string,
  techReadiness?: string
): string => {
  let personalizedIntro = "";
  if (painPoint || techReadiness) {
    if (painPoint) {
      personalizedIntro += `We understand that "${painPoint}" is your primary operational challenge. `;
    }

    if (techReadiness) {
      if (techReadiness.includes("very eager") || techReadiness.includes("open to")) {
        personalizedIntro += "Your team's enthusiasm for new technology positions you well to implement the suggested automation solutions.";
      } else if (techReadiness.includes("resistant") || techReadiness.includes("hesitant")) {
        personalizedIntro += "We've focused on solutions that are user-friendly and come with excellent support resources for teams that may need extra assistance with new technology.";
      } else {
        personalizedIntro += "Our recommendations are tailored to match your team's comfort level with technology adoption.";
      }
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; }
        .header { background-color: #6e46c7; color: white; padding: 20px; text-align: center; }
        .logo { max-width: 200px; margin-bottom: 10px; }
        .section { margin-bottom: 30px; padding: 0 20px; }
        .category { margin-bottom: 20px; border-left: 4px solid #6e46c7; padding-left: 15px; }
        .rating { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 5px 0; }
        .manual { background-color: #fff4e6; color: #ff8b00; }
        .partial { background-color: #e6f4ff; color: #0066cc; }
        .automated { background-color: #e6fff4; color: #00cc66; }
        .time-savings { font-weight: bold; color: #6e46c7; }
        .progress-bar { height: 8px; background-color: #f1f1f1; border-radius: 4px; margin: 10px 0; }
        .progress-fill { height: 100%; background-color: #6e46c7; border-radius: 4px; }
        .dots { display: flex; margin: 10px 0; }
        .dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
        .dot-filled { background-color: #6e46c7; }
        .dot-empty { background-color: #e0e0e0; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .button { background-color: #6e46c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
        <img class="logo" src="https://i.ibb.co/WpNwhk1v/Nomadic-Liberty-logo-cropped.jpg" alt="Nomadic Liberty LLC" />
          <h1>Your Workflow AI Audit Results</h1>
        </div>

        ${personalizedIntro ? `
        <div class="section">
          <h2>Personalized Assessment</h2>
          <p>${personalizedIntro}</p>
        </div>
        ` : ''}

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
          <a href="https://calendly.com/workflow-ai/discovery" class="button">Book a Free 20-Minute Consultation</a>
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
