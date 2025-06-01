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

  private checkNewPage(requiredHeight: number = 20): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - this.margins.bottom - 10) {
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
      const lines = this.doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.4;
      
      lines.forEach((line: string, index: number) => {
        if (index > 0) {
          this.checkNewPage(lineHeight);
        }
        this.doc.text(line, x, this.currentY + (index * lineHeight));
      });
      
      return lines.length * lineHeight;
    } else {
      this.doc.text(text, x, this.currentY);
      return fontSize * 0.4;
    }
  }

  private addCenteredText(text: string, fontSize: number, color: number[] = [0, 0, 0]): number {
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...color);
    this.doc.text(text, this.pageWidth / 2, this.currentY, { align: "center" });
    return fontSize * 0.4;
  }

  private addCardBackground(width: number, height: number): void {
    this.doc.setFillColor(...designTokens.colors['nomadic-beige'].rgb);
    this.doc.setDrawColor(...designTokens.colors['nomadic-taupe'].rgb);
    this.doc.setLineWidth(0.2);
    this.doc.roundedRect(this.margins.left, this.currentY - 2, width, height, 2, 2, "FD");
  }

  renderHeader(section: ReportSection): void {
    // Add header background
    this.doc.setFillColor(...designTokens.colors['nomadic-navy'].rgb);
    this.doc.rect(0, 0, this.pageWidth, 40, "F");
    
    this.currentY = 15;
    
    // Main title - centered in white
    const mainTitleHeight = this.addCenteredText(section.content.title, 18, designTokens.colors['nomadic-white'].rgb);
    this.currentY += mainTitleHeight + 3;
    
    // Subtitle - centered in white
    const subtitleHeight = this.addCenteredText(section.content.subtitle, 11, designTokens.colors['nomadic-white'].rgb);
    this.currentY += subtitleHeight + 15;
  }

  renderSummary(section: ReportSection): void {
    if (section.content.isAI) {
      // Calculate disclaimer height for proper card sizing
      const disclaimerLines = section.content.disclaimer ? 
        this.doc.splitTextToSize(section.content.disclaimer, this.contentWidth - 6) : [];
      const cardHeight = 15 + (disclaimerLines.length * 4);
      
      // Only check for new page if we really need it (conservative check)
      this.checkNewPage(cardHeight + 5);
      
      // Add small beige card for title and disclaimer only
      this.addCardBackground(this.contentWidth, cardHeight);
      this.currentY += 3;
      
      // Section title
      const titleHeight = this.addText(section.title || 'AI Assessment', this.margins.left + 3, 14, designTokens.colors['nomadic-navy'].rgb);
      this.currentY += titleHeight + 4;
      
      // Disclaimer in the card
      if (section.content.disclaimer) {
        const disclaimerHeight = this.addText(section.content.disclaimer, this.margins.left + 3, 9, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 6);
        this.currentY += disclaimerHeight + 8;
      }
      
      // AI content as regular text (outside the card) - no forced page break
      const contentHeight = this.addText(section.content.text, this.margins.left, 10, designTokens.colors['nomadic-gray'].rgb, this.contentWidth);
      this.currentY += contentHeight + 15;
      
    } else {
      // Non-AI summaries - original logic
      const textLines = this.doc.splitTextToSize(section.content.text, this.contentWidth - 6);
      const estimatedHeight = Math.max(40, textLines.length * 4 + 25);
      
      this.checkNewPage(estimatedHeight);
      this.addCardBackground(this.contentWidth, estimatedHeight);
      this.currentY += 3;
      
      const titleHeight = this.addText(section.title || 'Assessment Summary', this.margins.left + 3, 14, designTokens.colors['nomadic-navy'].rgb);
      this.currentY += titleHeight + 4;
      
      const contentHeight = this.addText(section.content.text, this.margins.left + 3, 10, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 6);
      this.currentY += contentHeight + 15;
    }
  }

  renderMetrics(section: ReportSection): void {
    this.checkNewPage(80);
    
    const { rating, score, timeSavings, recommendations, ratingDescription } = section.content;
    
    // Add card background
    this.addCardBackground(this.contentWidth, 70);
    this.currentY += 3;
    
    // Section title with navy background
    this.doc.setFillColor(...designTokens.colors['nomadic-navy'].rgb);
    this.doc.rect(this.margins.left, this.currentY, this.contentWidth, 8, "F");
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(section.title, this.margins.left + 3, this.currentY + 6);
    this.currentY += 12;
    
    // Rating badge
    this.doc.setFillColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.setDrawColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.roundedRect(this.margins.left + 3, this.currentY, 35, 7, 2, 2, "FD");
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(rating, this.margins.left + 5, this.currentY + 5);
    this.currentY += 12;
    
    // Score with enhanced styling
    const scoreHeight = this.addText(`Automation Score: ${score}/100`, this.margins.left + 3, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += scoreHeight + 3;
    
    // Enhanced progress bar
    this.renderEnhancedProgressBar(score);
    this.currentY += 15;
    
    // Rating description if available
    if (ratingDescription) {
      const descHeight = this.addText(ratingDescription, this.margins.left + 3, 10, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 6);
      this.currentY += descHeight + 4;
    }
    
    // Time savings with highlight box
    this.doc.setFillColor(...designTokens.colors['nomadic-lightBlue'].rgb);
    this.doc.setDrawColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.roundedRect(this.margins.left + 3, this.currentY, this.contentWidth - 6, 10, 1, 1, "FD");
    this.doc.setFontSize(11);
    this.doc.setTextColor(...designTokens.colors['nomadic-navy'].rgb);
    this.doc.text("Estimated Time Savings", this.margins.left + 5, this.currentY + 4);
    this.doc.setFontSize(12);
    this.doc.setTextColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.text(timeSavings, this.margins.left + 5, this.currentY + 8);
    this.currentY += 15;
    
    // Top recommendations
    this.checkNewPage(25);
    const recTitleHeight = this.addText("Top Recommendations", this.margins.left + 3, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += recTitleHeight + 4;
    
    recommendations.forEach((rec: string, idx: number) => {
      this.checkNewPage(10);
      const bulletText = `${idx + 1}. ${rec}`;
      const recHeight = this.addText(bulletText, this.margins.left + 6, 10, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 10);
      this.currentY += recHeight + 3;
    });
    
    this.currentY += 10;
  }

  renderCategory(section: ReportSection): void {
    const { categoryName, rating, score, tools, improvements, timeSavings } = section.content;
    
    // Calculate improvements height for better space estimation
    const improvementsHeight = improvements.length * 5 + 10;
    const totalEstimatedHeight = Math.max(60, improvementsHeight + 40);
    
    this.checkNewPage(totalEstimatedHeight);
    
    // Add card background
    this.addCardBackground(this.contentWidth, totalEstimatedHeight);
    
    // Category header with teal accent
    this.doc.setFillColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.rect(this.margins.left, this.currentY, 4, totalEstimatedHeight, "F");
    this.currentY += 3;
    
    // Category title
    const titleHeight = this.addText(categoryName, this.margins.left + 8, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 4;
    
    // Rating and score in one line
    const ratingHeight = this.addText(`${rating} (Score: ${score}/100)`, this.margins.left + 8, 10, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += ratingHeight + 4;
    
    // Enhanced progress bar (smaller for categories)
    this.renderEnhancedProgressBar(score, 60);
    this.currentY += 12;
    
    // Time savings
    const timeSavingsHeight = this.addText(`Time Savings: ${timeSavings}`, this.margins.left + 8, 10, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += timeSavingsHeight + 4;
    
    // Tools
    const toolsText = `Tools: ${tools.join(", ")}`;
    const toolsHeight = this.addText(toolsText, this.margins.left + 8, 9, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 12);
    this.currentY += toolsHeight + 4;
    
    // Improvements
    const impTitleHeight = this.addText("Improvements:", this.margins.left + 8, 10, designTokens.colors['nomadic-gray'].rgb);
    this.currentY += impTitleHeight + 2;
    
    improvements.forEach((improvement: string) => {
      this.checkNewPage(8);
      const impText = `• ${improvement}`;
      const impHeight = this.addText(impText, this.margins.left + 10, 9, designTokens.colors['nomadic-gray'].rgb, this.contentWidth - 14);
      this.currentY += impHeight + 2;
    });
    
    this.currentY += 15;
  }

  renderCTA(section: ReportSection): void {
    this.checkNewPage(25);
    
    // Enhanced CTA background
    this.doc.setFillColor(...designTokens.colors['nomadic-lightBlue'].rgb);
    this.doc.setDrawColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(this.margins.left, this.currentY, this.contentWidth, 20, 3, 3, "FD");
    
    this.currentY += 6;
    
    // CTA title - centered
    const titleHeight = this.addCenteredText(section.content.title, 12, designTokens.colors['nomadic-navy'].rgb);
    this.currentY += titleHeight + 3;
    
    // CTA subtitle - centered (if exists)
    if (section.content.subtitle) {
      const subtitleHeight = this.addCenteredText(section.content.subtitle, 10, designTokens.colors['nomadic-gray'].rgb);
      this.currentY += subtitleHeight + 3;
    }
    
    // Link text only (no button graphic)
    const linkHeight = this.addCenteredText(section.content.linkText, 10, designTokens.colors['nomadic-teal'].rgb);
    this.currentY += linkHeight + 8;
  }

  renderFooter(section: ReportSection): void {
    // Add footer at bottom of page
    const footerY = this.pageHeight - this.margins.bottom + 5;
    this.doc.setFontSize(8);
    this.doc.setTextColor(...designTokens.colors['nomadic-taupe'].rgb);
    this.doc.text(`© ${section.content.year} ${section.content.companyName}. All rights reserved.`, this.pageWidth / 2, footerY, { align: "center" });
  }

  private renderEnhancedProgressBar(score: number, width: number = 80): void {
    const barHeight = 6;
    
    // Background bar with border
    this.doc.setFillColor(...designTokens.colors['nomadic-beige'].rgb);
    this.doc.setDrawColor(...designTokens.colors['nomadic-taupe'].rgb);
    this.doc.setLineWidth(0.2);
    this.doc.roundedRect(this.margins.left + 8, this.currentY, width, barHeight, 1, 1, "FD");
    
    // Progress fill
    const progressWidth = (score / 100) * width;
    this.doc.setFillColor(...designTokens.colors['nomadic-teal'].rgb);
    this.doc.roundedRect(this.margins.left + 8, this.currentY, progressWidth, barHeight, 1, 1, "F");
    
    // Move down for dots with proper spacing
    this.currentY += barHeight + 4;
    this.renderEnhancedDots(score);
  }

  private renderEnhancedDots(score: number): void {
    const totalDots = 5;
    const filledDots = Math.round((score / 100) * totalDots);
    const dotSpacing = 8;
    const dotRadius = 2;
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = this.margins.left + 8 + (i * dotSpacing);
      const color = i < filledDots ? designTokens.colors['nomadic-teal'].rgb : designTokens.colors['nomadic-taupe'].rgb;
      
      // Add border to dots
      this.doc.setDrawColor(...designTokens.colors['nomadic-gray'].rgb);
      this.doc.setLineWidth(0.1);
      this.doc.setFillColor(...color);
      this.doc.circle(dotX, this.currentY, dotRadius, "FD");
    }
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
        // CTA is commented out as requested
        // case 'cta':
        //   this.renderCTA(section);
        //   break;
        case 'footer':
          this.renderFooter(section);
          break;
      }
    });

    return this.doc;
  }
}