
import { jsPDF } from "jspdf";
import { BaseRenderer } from './BaseRenderer';
import { ReportSection } from '../types/reportData';
import { designTokens } from '../constants/designTokens';

export class PDFRenderer extends BaseRenderer {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margins = {
    left: 20, // 20mm
    right: 20, // 20mm  
    top: 20, // 20mm
    bottom: 25 // 25mm for footer
  };
  private currentY: number;
  private contentWidth: number;

  constructor(report: any) {
    super(report);
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
    this.currentY = this.margins.top;
  }

  private checkNewPage(requiredHeight: number = 15): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - this.margins.bottom) {
      this.doc.addPage();
      this.currentY = this.margins.top;
      return true;
    }
    return false;
  }

  private addText(text: string, x: number, fontSize: number, color: number[] = [0, 0, 0], maxWidth?: number): number {
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...color);
    
    if (maxWidth) {
      // Use jsPDF's built-in text wrapping
      const lines = this.doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.35; // Convert points to mm
      
      lines.forEach((line: string, index: number) => {
        if (index > 0) {
          this.checkNewPage(lineHeight);
        }
        this.doc.text(line, x, this.currentY + (index * lineHeight));
      });
      
      return lines.length * lineHeight;
    } else {
      this.doc.text(text, x, this.currentY);
      return fontSize * 0.35;
    }
  }

  private addCenteredText(text: string, fontSize: number, color: number[] = [0, 0, 0]): number {
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...color);
    this.doc.text(text, this.pageWidth / 2, this.currentY, { align: "center" });
    return fontSize * 0.35;
  }

  renderHeader(section: ReportSection): void {
    // Company name - centered
    const titleHeight = this.addCenteredText(section.content.companyName, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 3;
    
    // Main title - centered  
    const mainTitleHeight = this.addCenteredText(section.content.title, 18, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += mainTitleHeight + 2;
    
    // Subtitle - centered
    const subtitleHeight = this.addCenteredText(section.content.subtitle, 10, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += subtitleHeight + 8;
  }

  renderSummary(section: ReportSection): void {
    this.checkNewPage(30);
    
    // Section title
    const titleHeight = this.addText(section.title || 'Summary', this.margins.left, 14, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 3;
    
    if (section.content.isAI) {
      // AI badge
      this.doc.setFillColor(...designTokens.colors['nomadic-teal'].rgb);
      this.doc.roundedRect(this.margins.left, this.currentY, 25, 6, 1, 1, "F");
      this.doc.setFontSize(8);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text("AI-POWERED", this.margins.left + 1, this.currentY + 4);
      this.currentY += 8;
      
      // Disclaimer
      if (section.content.disclaimer) {
        const disclaimerHeight = this.addText(section.content.disclaimer, this.margins.left, 8, designTokens.colors['nomadic-gray'].rgb, this.contentWidth);
        this.currentY += disclaimerHeight + 3;
      }
    }
    
    // Main content
    const contentHeight = this.addText(section.content.text, this.margins.left, 10, designTokens.colors['nomadic-gray'].rgb, this.contentWidth);
    this.currentY += contentHeight + 8;
  }

  renderMetrics(section: ReportSection): void {
    this.checkNewPage(50);
    
    const { rating, score, timeSavings, recommendations } = section.content;
    
    // Section title
    const titleHeight = this.addText(section.title, this.margins.left, 14, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 5;
    
    // Rating and score
    const ratingHeight = this.addText(`Rating: ${rating}`, this.margins.left, 10, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += ratingHeight + 2;
    
    const scoreHeight = this.addText(`Score: ${score}/100`, this.margins.left, 10, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += scoreHeight + 5;
    
    // Visual dots
    this.renderDots(score);
    this.currentY += 8;
    
    // Progress bar
    this.renderProgressBar(score);
    this.currentY += 8;
    
    // Time savings
    const timeSavingsHeight = this.addText(`Potential Time Savings: ${timeSavings}`, this.margins.left, 10, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += timeSavingsHeight + 8;
    
    // Top recommendations
    this.checkNewPage(20);
    const recTitleHeight = this.addText("Top Recommendations", this.margins.left, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += recTitleHeight + 3;
    
    recommendations.forEach((rec: string, idx: number) => {
      this.checkNewPage(10);
      const recText = `${idx + 1}. ${rec}`;
      const recHeight = this.addText(recText, this.margins.left, 9, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 5);
      this.currentY += recHeight + 2;
    });
    
    this.currentY += 8;
  }

  renderCategory(section: ReportSection): void {
    this.checkNewPage(40);
    
    const { categoryName, rating, score, tools, improvements, timeSavings } = section.content;
    
    // Category title
    const titleHeight = this.addText(categoryName, this.margins.left, 12, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += titleHeight + 3;
    
    // Rating and score
    const ratingHeight = this.addText(`Rating: ${rating} (Score: ${score}/100)`, this.margins.left, 9, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += ratingHeight + 3;
    
    // Visual dots
    this.renderDots(score);
    this.currentY += 6;
    
    // Progress bar
    this.renderProgressBar(score, 80); // Smaller progress bar for categories
    this.currentY += 6;
    
    // Time savings
    const timeSavingsHeight = this.addText(`Time Savings: ${timeSavings}`, this.margins.left, 9, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += timeSavingsHeight + 3;
    
    // Tools
    const toolsText = `Recommended Tools: ${tools.join(", ")}`;
    const toolsHeight = this.addText(toolsText, this.margins.left, 8, designTokens.colors['nomadic-gray'].rgb, this.contentWidth);
    this.currentY += toolsHeight + 3;
    
    // Improvements
    const impTitleHeight = this.addText("Suggested Improvements:", this.margins.left, 9, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += impTitleHeight + 2;
    
    improvements.forEach((improvement: string) => {
      this.checkNewPage(8);
      const impText = `• ${improvement}`;
      const impHeight = this.addText(impText, this.margins.left + 3, 8, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 6);
      this.currentY += impHeight + 1;
    });
    
    this.currentY += 8;
  }

  renderCTA(section: ReportSection): void {
    this.checkNewPage(25);
    
    // Background rectangle
    this.doc.setFillColor(...designTokens.colors['nomadic-lightBlue'].rgb);
    this.doc.rect(this.margins.left, this.currentY - 2, this.contentWidth, 20, "F");
    
    this.currentY += 5;
    
    // CTA title - centered
    const titleHeight = this.addCenteredText(section.content.title, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 3;
    
    // CTA subtitle - centered
    const subtitleHeight = this.addCenteredText(section.content.subtitle, 9, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += subtitleHeight + 3;
    
    // Link - centered
    const linkHeight = this.addCenteredText(section.content.link, 9, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += linkHeight + 8;
  }

  renderFooter(section: ReportSection): void {
    // Add footer at bottom of page
    const footerY = this.pageHeight - this.margins.bottom + 5;
    this.doc.setFontSize(7);
    this.doc.setTextColor(...designTokens.colors['nomadic-taupe'].rgb);
    this.doc.text(`© ${section.content.year} ${section.content.companyName}. All rights reserved.`, this.pageWidth / 2, footerY, { align: "center" });
  }

  private renderDots(score: number): void {
    const totalDots = 5;
    const filledDots = Math.round((score / 100) * totalDots);
    const dotSpacing = 8;
    const dotRadius = 2;
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = this.margins.left + (i * dotSpacing);
      const color = i < filledDots ? designTokens.colors['nomadic-teal'].rgb : designTokens.colors['nomadic-taupe'].rgb;
      this.doc.setFillColor(...color);
      this.doc.circle(dotX, this.currentY + 2, dotRadius, "F");
    }
  }

  private renderProgressBar(score: number, width: number = 100): void {
    const barHeight = 4;
    
    // Background bar
    this.doc.setFillColor(...designTokens.colors['nomadic-beige'].rgb);
    this.doc.rect(this.margins.left, this.currentY, width, barHeight, "F");
    
    // Progress fill
    const progressWidth = (score / 100) * width;
    this.doc.setFillColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.rect(this.margins.left, this.currentY, progressWidth, barHeight, "F");
  }

  protected combineRenderedSections(): void {
    // All rendering is done directly to the PDF document
    // No need to combine sections like with HTML/React
  }

  render(): jsPDF {
    // Render each section
    this.report.sections.forEach(section => {
      switch (section.type) {
        case 'header':
          this.renderHeader(section);
          break;
        case 'summary':
          this.renderSummary(section);
          break;
        case 'metrics':
          this.renderMetrics(section);
          break;
        case 'category':
          this.renderCategory(section);
          break;
        case 'cta':
          this.renderCTA(section);
          break;
        case 'footer':
          this.renderFooter(section);
          break;
      }
    });

    return this.doc;
  }
}
