import { AuditReport, WorkflowCategory, RatingLevel } from "../types/audit";
import { buildFormattedReport } from './ReportBuilder';
import { EmailRenderer } from '../renderers/EmailRenderer';

/**
 * Generates styled HTML content for the email report with Nomadic Liberty branding
 */
export const generateReportHtml = (
  report: AuditReport, 
  painPoint?: string,
  techReadiness?: string
): string => {
  // Build formatted report
  const formattedReport = buildFormattedReport(
    report,
    undefined, // userEmail - not needed for email template
    undefined, // userName - not needed for email template  
    painPoint,
    techReadiness
  );
  
  // Render using EmailRenderer
  const renderer = new EmailRenderer(formattedReport);
  return renderer.render();
};

// Keep existing utility functions for backward compatibility
export const generateDots = (score: number): string => {
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
};

export const getRatingClass = (rating: string): string => {
  switch (rating) {
    case 'Manual': return 'manual';
    case 'Partially Automated': return 'partial';
    case 'Fully Automated': return 'automated';
    default: return '';
  }
};

export const getCategoryName = (category: string): string => {
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
