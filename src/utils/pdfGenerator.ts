import { jsPDF } from "jspdf";
import { AuditReport } from "../types/audit";

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
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
      doc.text("AI-Generated Insights", 20, yPos);
      yPos += 10;
      
      // Add AI badge/indicator with Nomadic branding
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.roundedRect(20, yPos - 2, 25, 8, 2, 2, "F");
      doc.text("AI-POWERED", 22, yPos + 3);
      yPos += 15;
      
      // Split the AI summary into multiple lines
      const splitSummary = doc.splitTextToSize(report.aiGeneratedSummary, pageWidth - 40);
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(splitSummary, 20, yPos);
      yPos += (splitSummary.length * 7) + 15;
    } else if (painPoint || techReadiness) {
      // Fallback to personalized summary if no AI summary
      doc.setFontSize(16);
      doc.setTextColor(27, 54, 93); // Nomadic Navy
      doc.text("Personalized Assessment", 20, yPos);
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
      
      const splitText = doc.splitTextToSize(personalizedText, pageWidth - 40);
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(splitText, 20, yPos);
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
    doc.text("Overall Assessment", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    doc.text(`Rating: ${report.overallRating}`, 20, yPos);
    yPos += 8;
    doc.text(`Score: ${report.overallScore}/100`, 20, yPos);
    yPos += 8;
    
    // Add visual dots representation with Nomadic colors
    const totalDots = 5;
    const filledDots = Math.round((report.overallScore / 100) * totalDots);
    
    for (let i = 0; i < totalDots; i++) {
      const dotX = 20 + (i * 12);
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
    doc.rect(20, yPos, 150, 8, "F");
    doc.setFillColor(0, 168, 168); // Nomadic Teal for progress
    doc.rect(20, yPos, report.overallScore * 1.5, 8, "F");
    yPos += 15;
    
    // Time savings
    doc.setFontSize(14);
    doc.setTextColor(0, 168, 168); // Nomadic Teal for highlights
    doc.text(`Potential Time Savings: ${report.totalTimeSavings}`, 20, yPos);
    yPos += 20;
    
    // Top recommendations
    doc.setFontSize(16);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Top Recommendations:", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    report.topRecommendations.forEach((rec, idx) => {
      doc.text(`${idx + 1}. ${rec}`, 20, yPos);
      yPos += 8;
    });
    yPos += 15;
    
    // Category assessments with Nomadic Liberty branding
    doc.setFontSize(16);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    doc.text("Category Assessments", 20, yPos);
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
      doc.text(categoryName, 20, yPos);
      yPos += 8;
      
      // Rating and score
      doc.setFontSize(12);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      doc.text(`Rating: ${category.rating} (Score: ${category.score}/100)`, 20, yPos);
      yPos += 8;
      
      // Add visual dots for category with Nomadic colors
      const categoryFilledDots = Math.round((category.score / 100) * totalDots);
      for (let i = 0; i < totalDots; i++) {
        const dotX = 20 + (i * 12);
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
      doc.rect(20, yPos, 150, 5, "F");
      doc.setFillColor(0, 168, 168); // Nomadic Teal
      doc.rect(20, yPos, category.score * 1.5, 5, "F");
      yPos += 10;
      
      // Time savings
      doc.setTextColor(0, 168, 168); // Nomadic Teal
      doc.text(`Time Savings: ${category.timeSavings}`, 20, yPos);
      doc.setTextColor(77, 77, 77); // Nomadic Text Gray
      yPos += 8;
      
      // Recommended tools
      doc.text(`Recommended Tools: ${category.tools.join(", ")}`, 20, yPos);
      yPos += 10;
      
      // Improvements
      doc.setFontSize(12);
      doc.text("Suggested Improvements:", 20, yPos);
      yPos += 8;
      
      category.improvements.forEach((improvement, idx) => {
        const wrappedText = doc.splitTextToSize(`- ${improvement}`, pageWidth - 50);
        doc.text(wrappedText, 25, yPos);
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
    doc.rect(20, yPos, pageWidth - 40, 45, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(27, 54, 93); // Nomadic Navy
    yPos += 15;
    doc.text("Ready to transform your workflow?", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 12;
    doc.setFontSize(12);
    doc.setTextColor(77, 77, 77); // Nomadic Text Gray
    doc.text("Book a free consultation call", pageWidth / 2, yPos, { align: "center" });
    
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
