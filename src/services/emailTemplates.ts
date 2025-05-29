import { AuditReport, WorkflowCategory, RatingLevel } from "../types/audit";

/**
 * Generates styled HTML content for the email report with Nomadic Liberty branding
 */
export const generateReportHtml = (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): string => {
  // Get personalized intro based on answers
  const personalizedIntro = generatePersonalizedIntro(painPoint, techReadiness);
  function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


  // Build HTML email template with Nomadic Liberty branding
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4D4D4D; margin: 0; padding: 0; background-color: #FFFFFF; }
        .container { max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; }
        .header { background-color: #1B365D; color: #FFFFFF; padding: 30px 20px; text-align: center; }
        .logo { max-width: 200px; margin-bottom: 15px; color: #FFFFFF; font-size: 24px; font-weight: bold; }
        .section { margin-bottom: 30px; padding: 0 20px; }
        .category { margin-bottom: 25px; border-left: 4px solid #00A8A8; padding-left: 15px; background-color: #F5F1EB; padding: 15px; border-radius: 8px; }
        .rating { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 5px 0; }
        .manual { background-color: #F5F1EB; color: #1B365D; border: 2px solid #A8998C; }
        .partial { background-color: #E4EEF8; color: #1B365D; border: 2px solid #00A8A8; }
        .automated { background-color: #E4EEF8; color: #1B365D; border: 2px solid #00A8A8; }
        .time-savings { font-weight: bold; color: #00A8A8; }
        .progress-bar { height: 12px; background-color: #F5F1EB; border-radius: 6px; margin: 15px 0; border: 1px solid #A8998C; }
        .progress-fill { height: 100%; background-color: #00A8A8; border-radius: 6px; }
        .dots { display: flex; margin: 15px 0; }
        .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .dot-filled { background-color: #00A8A8; }
        .dot-empty { background-color: #A8998C; }
        .footer { background-color: #1B365D; color: #FFFFFF; padding: 25px; text-align: center; font-size: 12px; }
        .button { background-color: #00A8A8; color: #FFFFFF; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 15px 0; }
        .ai-section { background-color: #E4EEF8; border: 2px solid #00A8A8; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .ai-badge { background-color: #00A8A8; color: #FFFFFF; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
        .brand-highlight { color: #00A8A8; font-weight: bold; }
        .section-bg { background-color: #F5F1EB; padding: 20px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Nomadic Liberty LLC</div>
          <h1 style="margin: 0; font-size: 28px;">Your Workflow AI Audit Results</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personalized automation recommendations for your business</p>
        </div>
        
        ${report.aiGeneratedSummary ? `
        <div class="section">
          <div class="ai-section">
            <div class="ai-badge">AI-POWERED INSIGHTS</div>
            <h2 style="color: #1B365D; margin-top: 0;">Personalized Analysis</h2>
            <p style="color: #4D4D4D; line-height: 1.6;">${escapeHtml(report.aiGeneratedSummary).replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
        ` : ''}
        
        ${personalizedIntro ? `
        <div class="section">
          <div class="section-bg">
            <h2 style="color: #1B365D;">Personalized Assessment</h2>
            <p style="color: #4D4D4D;">${personalizedIntro}</p>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-bg">
            <h2 style="color: #1B365D;">Overall Workflow Automation Level</h2>
            <p style="color: #4D4D4D;">Your business is currently operating at a <span class="${getRatingClass(report.overallRating)}">${report.overallRating}</span> level of automation.</p>
            
            <div class="dots">
              ${generateDots(report.overallScore)}
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${report.overallScore}%"></div>
            </div>
            <p style="color: #4D4D4D;">Score: <span class="brand-highlight">${report.overallScore}/100</span></p>
            
            <p style="color: #4D4D4D;">With targeted improvements, you could save approximately <span class="time-savings">${report.totalTimeSavings}</span>.</p>
          </div>
        </div>
        
        <div class="section">
          <h2 style="color: #1B365D;">Top Recommendations:</h2>
          <ul style="color: #4D4D4D;">
            ${report.topRecommendations.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2 style="color: #1B365D;">Detailed Analysis by Area:</h2>
          ${report.categories.map(cat => `
            <div class="category">
              <h3 style="color: #1B365D; margin-top: 0;">${getCategoryName(cat.category)}</h3>
              <p style="color: #4D4D4D;">Current automation level: <span class="${getRatingClass(cat.rating)}">${cat.rating}</span></p>
              
              <div class="dots">
                ${generateDots(cat.score)}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${cat.score}%"></div>
              </div>
              <p style="color: #4D4D4D;">Score: <span class="brand-highlight">${cat.score}/100</span></p>
              
              <p style="color: #4D4D4D;">Potential time savings: <span class="time-savings">${cat.timeSavings}</span></p>
              <p style="color: #4D4D4D;"><strong>Recommended tools:</strong> ${cat.tools.join(', ')}</p>
              <p style="color: #4D4D4D;"><strong>Suggested improvements:</strong></p>
              <ul style="color: #4D4D4D;">
                ${cat.improvements.map(imp => `<li style="margin-bottom: 5px;">${imp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <div class="section" style="text-align: center;">
          <div class="section-bg">
            <p style="color: #1B365D; font-size: 18px; font-weight: bold;">Ready to enhance your workflow?</p>
            <a href="https://calendar.app.google/fDRgarRXA42zzqEo8" class="button">Book a Free Consultation</a>
            <p style="color: #A8998C; font-size: 14px; margin-top: 10px;">No commitment required • Expert guidance included</p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>Nomadic Liberty LLC</strong></p>
          <p style="margin: 0 0 10px 0;">Transforming businesses through intelligent automation</p>
          <p style="margin: 0 0 10px 0;">This report was generated based on your inputs to the Workflow AI Audit tool.</p>
          <p style="margin: 0 0 10px 0;">Have questions? Reply to this email for assistance.</p>
          <p style="margin: 0; opacity: 0.8;">© ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate personalized intro based on user responses
const generatePersonalizedIntro = (painPoint?: string, techReadiness?: string): string => {
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
  
  return personalizedIntro;
};

// Generate visual dots based on score
export const generateDots = (score: number): string => {
  const totalDots = 5;
  const filledDots = Math.round((score / 100) * totalDots);
  
  let dotsHtml = '';
  for (let i = 0; i < totalDots; i++) {
    if (i < filledDots) {
      dotsHtml += '<div class="dot dot-filled"></div>';
    } else {
      dotsHtml += '<div class="dot dot-empty"></div>';
    }
  }
  
  return dotsHtml;
};

// Utility functions for email formatting
export const getRatingClass = (rating: string): string => {
  switch (rating) {
    case 'Manual': return 'manual';
    case 'Partially Automated': return 'partial';
    case 'Fully Automated': return 'automated';
    default: return '';
  }
};

export const getCategoryName = (category: string): string => {
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
