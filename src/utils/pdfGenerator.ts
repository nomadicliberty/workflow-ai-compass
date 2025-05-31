// src/utils/pdfGenerator.ts - Fixed version with consistent margins

import { jsPDF } from "jspdf";
import { AuditReport } from "../types/audit";

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Consistent margins and positioning
    const margins = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    };
    
    const contentWidth = pageWidth - margins.left - margins.right;
    const centerX = pageWidth / 2;
    let yPos = margins.top;
    
    // Helper function to check if we need a new page
    const checkNewPage = (nextContentHeight: number = 20) => {
      if (yPos + nextContentHeight > pageHeight - margins.bottom) {
        doc.addPage();
        yPos = margins.top;
        return true;
      }
      return false;
    };
    
    // Helper function for centered text
    const addCenteredText = (text: string, fontSize: number, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      doc.text(text, centerX, yPos, { align: "center" });
    };
    
    // Helper function for left-aligned text
    const addLeftText = (text: string, fontSize: number, color: number[] = [0, 0, 0], wrap: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      
      if (wrap) {
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margins.left, yPos);
        return splitText.length * (fontSize * 0.4); // Approximate line height
      } else {
        doc.text(text, margins.left, yPos);
        return fontSize * 0.4;
      }
    };
    
    // HEADER SECTION
    addCenteredText("Workflow AI Audit Report", 18, [0, 168, 168]); // Nomadic Teal
    yPos += 15;
    
    addCenteredText("Nomadic Liberty LLC", 11, [27, 54, 93]); // Nomadic Navy
    yPos += 25;
    
    // AI SUMMARY SECTION
    if (report.aiGeneratedSummary) {
      checkNewPage(40);
      
      addLeftText("AI-Generated Insights", 14, [27, 54, 93]);
      yPos += 12;
      
      // AI badge
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.roundedRect(margins.left, yPos - 3, 30, 10, 2, 2, "F");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("AI-POWERED", margins.left + 2, yPos + 4);
      yPos += 18;
      
      // AI summary text with proper wrapping
      const summaryLines = doc.splitTextToSize(report.aiGeneratedSummary, contentWidth);
      doc.setFontSize(10);
      doc.setTextColor(77, 77, 77);
      
      summaryLines.forEach((line: string, index: number) => {
        checkNewPage();
        doc.text(line, margins.left, yPos);
        yPos += 5;
      });
      yPos += 15;
    }
    
    // OVERALL ASSESSMENT SECTION
    checkNewPage(60);
    
    addLeftText("Overall Assessment", 14, [27, 54, 93]);
    yPos += 12;
    
    addLeftText(`Rating: ${report.overallRating}`, 11, [77, 77, 77]);
    yPos += 8;
    
    addLeftText(`Score: ${report.overallScore}/100`, 11, [77, 77, 77]);
    yPos += 12;
    
    // Visual dots (consistently positioned)
    const totalDots = 5;
    const filledDots = Math.round((report.overallScore / 100) * totalDots);
    const dotSpacing = 15;
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = margins.left + (i * dotSpacing);
      const color = i < filledDots ? [0, 168, 168] : [245, 241, 235];
      doc.setFillColor(...color);
      doc.circle(dotX, yPos + 3, 4, "F");
    }
    yPos += 15;
    
    // Progress bar (consistently positioned)
    const progressBarWidth = 120;
    doc.setFillColor(245, 241, 235); // Background
    doc.rect(margins.left, yPos, progressBarWidth, 8, "F");
    doc.setFillColor(0, 168, 168); // Progress
    const progressWidth = (report.overallScore / 100) * progressBarWidth;
    doc.rect(margins.left, yPos, progressWidth, 8, "F");
    yPos += 18;
    
    // Time savings
    addLeftText(`Potential Time Savings: ${report.totalTimeSavings}`, 11, [0, 168, 168]);
    yPos += 20;
    
    // TOP RECOMMENDATIONS SECTION
    checkNewPage(40);
    
    addLeftText("Top Recommendations", 14, [27, 54, 93]);
    yPos += 12;
    
    report.topRecommendations.forEach((rec, idx) => {
      checkNewPage();
      const recommendationText = `${idx + 1}. ${rec}`;
      const lineHeight = addLeftText(recommendationText, 10, [77, 77, 77], true);
      yPos += lineHeight + 2;
    });
    yPos += 15;
    
    // CATEGORY ASSESSMENTS SECTION
    checkNewPage(40);
    
    addLeftText("Category Assessments", 14, [27, 54, 93]);
    yPos += 15;
    
    for (const category of report.categories) {
      checkNewPage(80); // Need more space for each category
      
      const categoryName = getCategoryName(category.category);
      addLeftText(categoryName, 12, [0, 168, 168]);
      yPos += 10;
      
      addLeftText(`Rating: ${category.rating} (Score: ${category.score}/100)`, 10, [77, 77, 77]);
      yPos += 8;
      
      // Category dots
      const categoryFilledDots = Math.round((category.score / 100) * totalDots);
      for (let i = 0; i < totalDots; i++) {
        const dotX = margins.left + (i * dotSpacing);
        const color = i < categoryFilledDots ? [0, 168, 168] : [245, 241, 235];
        doc.setFillColor(...color);
        doc.circle(dotX, yPos + 3, 4, "F");
      }
      yPos += 12;
      
      // Category progress bar
      doc.setFillColor(245, 241, 235);
      doc.rect(margins.left, yPos, progressBarWidth, 6, "F");
      doc.setFillColor(0, 168, 168);
      const categoryProgressWidth = (category.score / 100) * progressBarWidth;
      doc.rect(margins.left, yPos, categoryProgressWidth, 6, "F");
      yPos += 12;
      
      addLeftText(`Time Savings: ${category.timeSavings}`, 10, [0, 168, 168]);
      yPos += 8;
      
      const toolsText = `Recommended Tools: ${category.tools.join(", ")}`;
      const toolsLineHeight = addLeftText(toolsText, 9, [77, 77, 77], true);
      yPos += toolsLineHeight + 5;
      
      addLeftText("Suggested Improvements:", 10, [77, 77, 77]);
      yPos += 8;
      
      category.improvements.forEach((improvement) => {
        checkNewPage();
        const improvementText = `• ${improvement}`;
        const lineHeight = addLeftText(improvementText, 9, [77, 77, 77], true);
        yPos += lineHeight + 2;
      });
      
      yPos += 15;
    }
    
    // CALL TO ACTION SECTION
    checkNewPage(50);
    
    // CTA background
    doc.setFillColor(228, 238, 248); // Nomadic Light Blue
    doc.rect(margins.left, yPos, contentWidth, 40, "F");
    
    yPos += 15;
    addCenteredText("Ready to transform your workflow?", 12, [27, 54, 93]);
    yPos += 10;
    
    addCenteredText("Schedule your free consultation today", 10, [77, 77, 77]);
    yPos += 8;
    
    addCenteredText("calendar.app.google/fDRgarRXA42zzqEo8", 10, [0, 168, 168]);
    yPos += 25;
    
    // FOOTER
    const footerY = pageHeight - margins.bottom;
    addCenteredText(`© ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.`, 8, [168, 153, 140]);
    
    // Save the PDF
    doc.save("nomadic_liberty_workflow_audit_report.pdf");
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Helper function remains the same
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