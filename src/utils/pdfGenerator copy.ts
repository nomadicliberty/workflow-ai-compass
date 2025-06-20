
import { AuditReport } from "../types/audit";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CATEGORY_NAMES, APP_META } from '../config/constants';
import { ErrorHandler } from './errorHandler';

// Define types for jsPDF with autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  return ErrorHandler.withErrorHandling(async () => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 15;
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(110, 70, 199); // Purple color
    doc.text("Workflow AI Audit Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text(APP_META.COMPANY_NAME, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;
    
    // Add personalized summary if available
    if (painPoint || techReadiness) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Personalized Assessment", 14, yPos);
      yPos += 7;
      
      let personalizedText = "";
      if (painPoint) {
        personalizedText += `We understand that "${painPoint}" is your primary operational challenge. `;
      }
      
      if (techReadiness?.includes("Very eager")) {
        personalizedText += "Your team's enthusiasm for new technology positions you well to implement the suggested automation solutions.";
      } else if (techReadiness?.includes("resistant")) {
        personalizedText += "We've focused on solutions that are user-friendly and come with excellent support resources for teams that may need extra assistance with new technology.";
      } else {
        personalizedText += "Our recommendations are tailored to match your team's comfort level with technology adoption.";
      }
      
      const splitText = doc.splitTextToSize(personalizedText, pageWidth - 28);
      doc.setFontSize(10);
      doc.text(splitText, 14, yPos);
      yPos += (splitText.length * 5) + 10;
    }
    
    // Add overall assessment
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Overall Assessment", 14, yPos);
    yPos += 7;
    
    doc.setFontSize(12);
    doc.text(`Rating: ${report.overallRating} (Score: ${report.overallScore}/100)`, 14, yPos);
    yPos += 7;
    
    // Visual representation of score
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(230, 230, 230);
    doc.rect(14, yPos, 100, 5, "F");
    doc.setFillColor(110, 70, 199);
    doc.rect(14, yPos, report.overallScore, 5, "F");
    yPos += 10;
    
    // Time savings
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 0);
    doc.text(`Potential Time Savings: ${report.totalTimeSavings}`, 14, yPos);
    yPos += 15;
    
    // Top recommendations
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Top Recommendations:", 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    report.topRecommendations.forEach((rec, idx) => {
      doc.text(`${idx + 1}. ${rec}`, 14, yPos);
      yPos += 7;
    });
    yPos += 10;
    
    // Category assessments - create tables for each category
    doc.setFontSize(14);
    doc.text("Category Assessments", 14, yPos);
    yPos += 10;
    
    for (const category of report.categories) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      const categoryName = CATEGORY_NAMES[category.category] || category.category;
      
      doc.setFontSize(12);
      doc.text(categoryName, 14, yPos);
      yPos += 7;
      
      // Rating and score
      doc.setFontSize(10);
      doc.text(`Rating: ${category.rating} (Score: ${category.score}/100)`, 14, yPos);
      yPos += 7;
      
      // Visual representation of score
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(230, 230, 230);
      doc.rect(14, yPos, 100, 3, "F");
      doc.setFillColor(110, 70, 199);
      doc.rect(14, yPos, category.score, 3, "F");
      yPos += 7;
      
      // Time savings
      doc.setTextColor(0, 128, 0);
      doc.text(`Time Savings: ${category.timeSavings}`, 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 7;
      
      // Recommended tools
      doc.text(`Recommended Tools: ${category.tools.join(", ")}`, 14, yPos);
      yPos += 10;
      
      // Use autoTable for improvements
      doc.autoTable({
        startY: yPos,
        head: [["Suggested Improvements"]],
        body: category.improvements.map(imp => [imp]),
        margin: { left: 14 },
        headStyles: { fillColor: [110, 70, 199], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
        tableWidth: pageWidth - 28,
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Add footer
    yPos = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`© ${new Date().getFullYear()} ${APP_META.COMPANY_NAME}. All rights reserved.`, pageWidth / 2, yPos, { align: "center" });
    
    // Save the PDF
    doc.save(APP_META.REPORT_FILENAME);
    
  },  'PDF_GENERATION_LEGACY');
};
