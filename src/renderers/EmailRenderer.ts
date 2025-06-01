
import { BaseRenderer } from './BaseRenderer';
import { ReportSection } from '../types/reportData';
import { designTokens } from '../constants/designTokens';

export class EmailRenderer extends BaseRenderer {
  renderHeader(section: ReportSection): string {
    return `
      <div class="header">
        <div class="logo">${section.content.companyName}</div>
        <h1 style="margin: 0; font-size: 28px;">${section.content.title}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${section.content.subtitle}</p>
      </div>
    `;
  }

  renderSummary(section: ReportSection): string {
    if (section.content.isAI) {
      return `
        <div class="section">
          <div class="ai-section">
            <div class="ai-badge">AI-POWERED INSIGHTS</div>
            <h2 style="color: #1B365D; margin-top: 0;">${section.title}</h2>
            <p style="color: #4D4D4D; line-height: 1.6;">${this.escapeHtml(section.content.text).replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="section">
          <div class="section-bg">
            <h2 style="color: #1B365D;">${section.title}</h2>
            <p style="color: #4D4D4D;">${section.content.text}</p>
          </div>
        </div>
      `;
    }
  }

  renderMetrics(section: ReportSection): string {
    const { rating, score, timeSavings, recommendations, ratingDescription } = section.content;
    
    return `
      <div class="section">
        <div class="section-bg">
          <h2 style="color: #1B365D;">${section.title}</h2>
          <p style="color: #4D4D4D;">Your business is currently operating at a <span class="${this.getRatingClass(rating)}">${rating}</span> level of automation.</p>
          
          <div class="dots">
            ${this.generateDots(score)}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score}%"></div>
          </div>
          <p style="color: #4D4D4D;">Score: <span class="brand-highlight">${score}/100</span></p>
          
          <p style="color: #4D4D4D;">With targeted improvements, you could save approximately <span class="time-savings">${timeSavings}</span>.</p>
        </div>
      </div>
      
      <div class="section">
        <h2 style="color: #1B365D;">Top Recommendations:</h2>
        <ul style="color: #4D4D4D;">
          ${recommendations.map((rec: string) => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  renderCategory(section: ReportSection): string {
    const { categoryName, rating, score, tools, improvements, timeSavings } = section.content;
    
    return `
      <div class="category">
        <h3 style="color: #1B365D; margin-top: 0;">${categoryName}</h3>
        <p style="color: #4D4D4D;">Current automation level: <span class="${this.getRatingClass(rating)}">${rating}</span></p>
        
        <div class="dots">
          ${this.generateDots(score)}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${score}%"></div>
        </div>
        <p style="color: #4D4D4D;">Score: <span class="brand-highlight">${score}/100</span></p>
        
        <p style="color: #4D4D4D;">Potential time savings: <span class="time-savings">${timeSavings}</span></p>
        <p style="color: #4D4D4D;"><strong>Recommended tools:</strong> ${tools.join(', ')}</p>
        <p style="color: #4D4D4D;"><strong>Suggested improvements:</strong></p>
        <ul style="color: #4D4D4D;">
          ${improvements.map((imp: string) => `<li style="margin-bottom: 5px;">${imp}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  renderCTA(section: ReportSection): string {
    return `
      <div class="section" style="text-align: center;">
        <div class="section-bg">
          <p style="color: #1B365D; font-size: 18px; font-weight: bold;">${section.content.title}</p>
          <a href="${section.content.link}" class="button">${section.content.linkText}</a>
          <p style="color: #A8998C; font-size: 14px; margin-top: 10px;">No commitment required • Personalized guidance included</p>
        </div>
      </div>
    `;
  }

  renderFooter(section: ReportSection): string {
    return `
      <div class="footer">
        <p style="margin: 0 0 10px 0;"><strong>${section.content.companyName}</strong></p>
        <p style="margin: 0 0 10px 0;">Transforming businesses through intelligent automation</p>
        <p style="margin: 0 0 10px 0;">${section.content.disclaimer}</p>
        <p style="margin: 0 0 10px 0;">Have questions? Reply to this email for assistance.</p>
        <p style="margin: 0 0 15px 0;">Best regards,<br/>Jason Henry<br/>${section.content.companyName}</p>
        <p style="margin: 0; opacity: 0.8;">© ${section.content.year} ${section.content.companyName}. All rights reserved.</p>
      </div>
    `;
  }

  protected combineRenderedSections(sections: string[]): string {
    // Simply render sections in order - no custom category logic
    return `
      <!DOCTYPE html>
      <html>
      <head>
        ${this.getEmailStyles()}
      </head>
      <body>
        <div class="container">
          ${sections.join('')}
        </div>
      </body>
      </html>
    `;
  }

  private getEmailStyles(): string {
    return `
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
    `;
  }

  private generateDots(score: number): string {
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
  }

  private getRatingClass(rating: string): string {
    switch (rating) {
      case 'Manual': return 'manual';
      case 'Partially Automated': return 'partial';
      case 'Fully Automated': return 'automated';
      default: return '';
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
