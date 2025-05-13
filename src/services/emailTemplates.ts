
import { AuditReport, WorkflowCategory, RatingLevel } from "../types/audit";

/**
 * Generates styled HTML content for the email report
 */
export const generateReportHtml = (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): string => {
  // Get personalized intro based on answers
  const personalizedIntro = generatePersonalizedIntro(painPoint, techReadiness);
  
  // Build HTML email template
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
          <img class="logo" src="https://via.placeholder.com/200x50?text=Nomadic+Liberty" alt="Nomadic Liberty LLC" />
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
            ${report.topRecommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>Detailed Analysis by Area:</h2>
          ${report.categories.map(cat => `
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
                ${cat.improvements.map(imp => `<li>${imp}</li>`).join('')}
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
