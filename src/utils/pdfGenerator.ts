
import { jsPDF } from "jspdf";
import { AuditReport } from "../types/audit";

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  try {
    // Create a new PDF document with better margins
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 20;
    const rightMargin = 20;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    let yPos = 20;
    
    // Add header with Nomadic Liberty branding
    doc.setFontSize(20);
    doc.setTextColor(0, 168, 168); // Nomadic Teal #00A8A8
    doc.text("Workflow AI Audit Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;
    
    doc.setFontSize(14);
    doc.setTextColor(27, 54, 93); // Nomadic Navy #1B365D
    doc.text("Nomadic Liberty LLC", pageWidth / 2, yPos, { align: "center" });
    yPos += 20;
    
    // Add AI-generated summary if available (prioritize over personalized assessment)
    if (report.aiGeneratedSummary) {
      doc.setFontSize(16);
      doc.setTextColor(27, 54, 93); // Nomadic Navy for section headers
      doc.text("AI-Generated Insights", leftMargin, yPos);
      yPos += 10;
      
      // Add AI badge/indicator with Nomadic branding
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.roundedRect(leftMargin, yPos - 2, 25, 8, 2, 2, "F");
      doc.text("AI-POWERED", leftMargin + 2, yPos + 3);
      yPos += 15;
      
      // Split the AI summary into multiple lines with proper margins
      const splitSummary = doc.splitTextToSize(report.aiGeneratedSummary, contentWidth);
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(splitSummary, leftMargin, yPos);
      yPos += (splitSummary.length * 7) + 15;
    } else if (painPoint || techReadiness) {
      // Fallback to personalized summary if no AI summary
      doc.setFontSize(16);
      doc.setTextColor(27, 54, 93); // Nomadic Navy
      doc.text("Personalized Assessment", leftMargin, yPos);
      yPos += 10;
      
      let personalizedText = "";
      if (painPoint) {
        personalizedText += `We understand that "${painPoint}" is your primary operational challenge. `;
      }
      
      if (techReadiness && techReadiness.includes("Very eager")) {
        personalizedText += "Your team's enthusiasm for new technology positions you well to implement the suggested automation solutions.";
      } else if (techReadiness && techReadiness.includes("resistant")) {
        personalizedText += "We've focused on solutions that are user-friendly and come with excellent support resources for teams that may need extra assistance with new technology.";
      } else {
        personalizedText += "Our recommendations are tailored to match your team's comfort level with technology adoption.";
      }
      
      const splitText = doc.splitTextToSize(personalizedText, contentWidth);
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(splitText, leftMargin, yPos);
      yPos += (splitText.length * 7) + 10;
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add overall assessment with Nomadic Liberty branding
    doc.setFontSize(16);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Overall Assessment", leftMargin, yPos);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    doc.text(`Rating: ${report.overallRating}`, leftMargin, yPos);
    yPos += 8;
    doc.text(`Score: ${report.overallScore}/100`, leftMargin, yPos);
    yPos += 8;
    
    // Add visual dots representation with Nomadic colors
    const totalDots = 5;
    const filledDots = Math.round((report.overallScore / 100) * totalDots);
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = leftMargin + (i * 12);
      if (i < filledDots) {
        doc.setFillColor(0, 168, 168); // Nomadic Teal for filled dots
      } else {
        doc.setFillColor(245, 241, 235); // Nomadic Beige for empty dots
      }
      doc.circle(dotX, yPos + 3, 3, "F");
    }
    yPos += 10;
    
    // Visual progress bar with Nomadic colors
    doc.setDrawColor(168, 153, 140); // Nomadic Taupe for border
    doc.setFillColor(245, 241, 235); // Nomadic Beige background
    doc.rect(leftMargin, yPos, 150, 8, "F");
    doc.setFillColor(0, 168, 168); // Nomadic Teal for progress
    doc.rect(leftMargin, yPos, report.overallScore * 1.5, 8, "F");
    yPos += 15;
    
    // Time savings
    doc.setFontSize(14);
    doc.setTextColor(0, 168, 168); // Nomadic Teal for highlights
    doc.text(`Potential Time Savings: ${report.totalTimeSavings}`, leftMargin, yPos);
    yPos += 20;
    
    // Top recommendations
    doc.setFontSize(16);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Top Recommendations:", leftMargin, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    report.topRecommendations.forEach((rec, idx) => {
      const wrappedRec = doc.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth);
      doc.text(wrappedRec, leftMargin, yPos);
      yPos += (wrappedRec.length * 7);
    });
    yPos += 15;
    
    // Category assessments with Nomadic Liberty branding
    doc.setFontSize(16);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Category Assessments", leftMargin, yPos);
    yPos += 15;
    
    for (const category of report.categories) {
      // Check if we need a new page
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      const categoryName = getCategoryName(category.category);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 168, 168); // Nomadic Teal
      doc.text(categoryName, leftMargin, yPos);
      yPos += 8;
      
      // Rating and score
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(`Rating: ${category.rating} (Score: ${category.score}/100)`, leftMargin, yPos);
      yPos += 8;
      
      // Add visual dots for category with Nomadic colors
      const categoryFilledDots = Math.round((category.score / 100) * totalDots);
      for (let i = 0; i < totalDots; i++) {
        const dotX = leftMargin + (i * 12);
        if (i < categoryFilledDots) {
          doc.setFillColor(0, 168, 168); // Nomadic Teal for filled dots
        } else {
          doc.setFillColor(245, 241, 235); // Nomadic Beige for empty dots
        }
        doc.circle(dotX, yPos + 3, 3, "F");
      }
      yPos += 10;
      
      // Visual progress bar for category with Nomadic colors
      doc.setDrawColor(168, 153, 140); // Nomadic Taupe
      doc.setFillColor(245, 241, 235); // Nomadic Beige
      doc.rect(leftMargin, yPos, 150, 5, "F");
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.rect(leftMargin, yPos, category.score * 1.5, 5, "F");
      yPos += 10;
      
      // Time savings
      doc.setTextColor(0, 168, 168); // Nomadic Teal
      doc.text(`Time Savings: ${category.timeSavings}`, leftMargin, yPos);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      yPos += 8;
      
      // Recommended tools
      const toolsText = doc.splitTextToSize(`Recommended Tools: ${category.tools.join(", ")}`, contentWidth);
      doc.text(toolsText, leftMargin, yPos);
      yPos += (toolsText.length * 7);
      
      // Improvements
      doc.setFontSize(12);
      doc.text("Suggested Improvements:", leftMargin, yPos);
      yPos += 8;
      
      category.improvements.forEach((improvement, idx) => {
        const wrappedText = doc.splitTextToSize(`- ${improvement}`, contentWidth - 10);
        doc.text(wrappedText, leftMargin + 5, yPos);
        yPos += (wrappedText.length * 7);
      });
      
      yPos += 15;
    }
    
    // Add call to action with Nomadic Liberty branding
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    // Create a colored rectangle for CTA with Nomadic colors
    doc.setFillColor(228, 238, 248); // Nomadic Light Blue
    doc.rect(leftMargin, yPos, contentWidth, 45, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    yPos += 15;
    doc.text("Ready to transform your workflow?", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 12;
    doc.setFontSize(12);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    doc.text("I'm here to help you implement these solutions", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 10;
    doc.setTextColor(0, 168, 168); // Nomadic Teal for link
    doc.text("https://calendar.app.google/fDRgarRXA42zzqEo8", pageWidth / 2, yPos, { align: "center" });
    
    // Add footer with Nomadic Liberty branding
    yPos = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setTextColor(168, 153, 140); // Nomadic Taupe
    doc.text(`© ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.`, pageWidth / 2, yPos, { align: "center" });
    
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
