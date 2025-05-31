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
    
    // Conservative margins to prevent text cutoff
    const margins = {
      left: 25,
      right: 25,
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
    
    // Helper function for left-aligned text with manual wrapping
    const addLeftText = (text: string, fontSize: number, color: number[] = [0, 0, 0], maxCharsPerLine: number = 0) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      
      if (maxCharsPerLine > 0) {
        // Manual text wrapping to prevent cutoff
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + word).length <= maxCharsPerLine) {
            currentLine += word + ' ';
          } else {
            if (currentLine) lines.push(currentLine.trim());
            currentLine = word + ' ';
          }
        });
        if (currentLine) lines.push(currentLine.trim());
        
        lines.forEach((line, index) => {
          checkNewPage();
          doc.text(line, margins.left, yPos + (index * 5));
        });
        return lines.length * 5; // Return total height used
      } else {
        doc.text(text, margins.left, yPos);
        return 5; // Single line height
      }
    };
    
    // HEADER SECTION
    addCenteredText("Workflow AI Audit Report", 16, [0, 168, 168]); // Nomadic Teal
    yPos += 12;
    
    addCenteredText("Nomadic Liberty LLC", 10, [27, 54, 93]); // Nomadic Navy
    yPos += 20;
    
    // AI SUMMARY SECTION
    if (report.aiGeneratedSummary) {
      checkNewPage(40);
      
      doc.setFontSize(12);
      doc.setTextColor(27, 54, 93); // Nomadic Navy
      doc.text("AI-Generated Insights", margins.left, yPos);
      yPos += 10;
      
      // AI badge
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.roundedRect(margins.left, yPos - 2, 25, 8, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("AI-POWERED", margins.left + 1, yPos + 3);
      yPos += 12;
      
      // AI summary with MANUAL text wrapping (NO doc.splitTextToSize)
      const summaryHeight = addLeftText(report.aiGeneratedSummary, 9, [77, 77, 77], 70);
      yPos += summaryHeight + 10;
    }
    
    // OVERALL ASSESSMENT SECTION
    checkNewPage(50);
    
    doc.setFontSize(12);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Overall Assessment", margins.left, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(77, 77, 77);
    doc.text(`Rating: ${report.overallRating}`, margins.left, yPos);
    yPos += 7;
    doc.text(`Score: ${report.overallScore}/100`, margins.left, yPos);
    yPos += 10;
    
    // Visual dots
    const totalDots = 5;
    const filledDots = Math.round((report.overallScore / 100) * totalDots);
    const dotSpacing = 12;
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = margins.left + (i * dotSpacing);
      const color = i < filledDots ? [0, 168, 168] : [245, 241, 235];
      doc.setFillColor(...color);
      doc.circle(dotX, yPos + 3, 3, "F");
    }
    yPos += 12;
    
    // Progress bar
    const progressBarWidth = 100;
    doc.setFillColor(245, 241, 235); // Background
    doc.rect(margins.left, yPos, progressBarWidth, 6, "F");
    doc.setFillColor(0, 168, 168); // Progress
    const progressWidth = (report.overallScore / 100) * progressBarWidth;
    doc.rect(margins.left, yPos, progressWidth, 6, "F");
    yPos += 12;
    
    // Time savings
    doc.setFontSize(10);
    doc.setTextColor(0, 168, 168);
    doc.text(`Potential Time Savings: ${report.totalTimeSavings}`, margins.left, yPos);
    yPos += 15;
    
    // TOP RECOMMENDATIONS SECTION
    checkNewPage(30);
    
    doc.setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text("Top Recommendations", margins.left, yPos);
    yPos += 10;
    
    report.topRecommendations.forEach((rec, idx) => {
      checkNewPage();
      const recommendationText = `${idx + 1}. ${rec}`;
      const recHeight = addLeftText(recommendationText, 9, [77, 77, 77], 65);
      yPos += recHeight + 2;
    });
    yPos += 10;
    
    // CATEGORY ASSESSMENTS SECTION
    checkNewPage(30);
    
    doc.setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text("Category Assessments", margins.left, yPos);
    yPos += 12;
    
    for (const category of report.categories) {
      checkNewPage(60); // Need space for each category
      
      const categoryName = getCategoryName(category.category);
      doc.setFontSize(11);
      doc.setTextColor(0, 168, 168);
      doc.text(categoryName, margins.left, yPos);
      yPos += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(77, 77, 77);
      doc.text(`Rating: ${category.rating} (Score: ${category.score}/100)`, margins.left, yPos);
      yPos += 8;
      
      // Category dots
      const categoryFilledDots = Math.round((category.score / 100) * totalDots);
      for (let i = 0; i < totalDots; i++) {
        const dotX = margins.left + (i * dotSpacing);
        const color = i < categoryFilledDots ? [0, 168, 168] : [245, 241, 235];
        doc.setFillColor(...color);
        doc.circle(dotX, yPos + 3, 3, "F");
      }
      yPos += 10;
      
      // Category progress bar
      doc.setFillColor(245, 241, 235);
      doc.rect(margins.left, yPos, progressBarWidth, 5, "F");
      doc.setFillColor(0, 168, 168);
      const categoryProgressWidth = (category.score / 100) * progressBarWidth;
      doc.rect(margins.left, yPos, categoryProgressWidth, 5, "F");
      yPos += 10;
      
      doc.setTextColor(0, 168, 168);
      doc.text(`Time Savings: ${category.timeSavings}`, margins.left, yPos);
      yPos += 7;
      
      doc.setTextColor(77, 77, 77);
      const toolsText = `Recommended Tools: ${category.tools.join(", ")}`;
      const toolsHeight = addLeftText(toolsText, 8, [77, 77, 77], 70);
      yPos += toolsHeight + 5;
      
      doc.text("Suggested Improvements:", margins.left, yPos);
      yPos += 7;
      
      category.improvements.forEach((improvement) => {
        checkNewPage();
        const improvementText = `• ${improvement}`;
        const impHeight = addLeftText(improvementText, 8, [77, 77, 77], 65);
        yPos += impHeight + 2;
      });
      
      yPos += 10;
    }
    
    // CALL TO ACTION SECTION
    checkNewPage(40);
    
    // CTA background
    doc.setFillColor(228, 238, 248); // Nomadic Light Blue
    doc.rect(margins.left, yPos, contentWidth, 35, "F");
    
    yPos += 12;
    addCenteredText("Ready to transform your workflow?", 11, [27, 54, 93]);
    yPos += 8;
    
    addCenteredText("Schedule your free consultation today", 9, [77, 77, 77]);
    yPos += 7;
    
    addCenteredText("calendar.app.google/fDRgarRXA42zzqEo8", 9, [0, 168, 168]);
    yPos += 20;
    
    // FOOTER
    const footerY = pageHeight - margins.bottom;
    doc.setFontSize(7);
    doc.setTextColor(168, 153, 140);
    doc.text(`© ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.`, centerX, footerY, { align: "center" });
    
    // Save the PDF
    doc.save("nomadic_liberty_workflow_audit_report.pdf");
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Helper function
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