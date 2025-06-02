
import { AuditReport } from "../types/audit";
import { buildFormattedReport } from '../services/ReportBuilder';
import { PDFRenderer } from '../renderers/PDFRenderer';

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  try {
    console.log('🔄 Generating PDF with new renderer...');
    
    // Build formatted report
    const formattedReport = buildFormattedReport(
      report,
      undefined, // userEmail - not needed for PDF
      undefined, // userName - not needed for PDF
      painPoint,
      techReadiness
    );
    
    // Render using PDFRenderer
    const renderer = new PDFRenderer(formattedReport);
    const doc = renderer.render();
    
    // Save the PDF
    doc.save("nomadic_liberty_workflow_audit_report.pdf");
    
    console.log('✅ PDF generated successfully with new renderer');
    
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    throw error;
  }
};
