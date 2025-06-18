
import { AuditReport } from "../types/audit";
import { buildFormattedReport } from '../services/ReportBuilder';
import { PDFRenderer } from '../renderers/PDFRenderer';
import { ErrorHandler } from './errorHandler';
import { APP_META } from '../config/constants';

export const generatePDF = async (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): Promise<void> => {
  return ErrorHandler.withErrorHandling(async () => {
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
    doc.save(APP_META.REPORT_FILENAME);
    
  }, 'PDF_GENERATION');
};
