
import React from 'react';
import { AuditReport, AuditAnswer } from '../types/audit';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { buildFormattedReport } from '../services/ReportBuilder';
import { ReactRenderer } from '../renderers/ReactRenderer';

// Import only the components we need (removing redundant ones)
import ExportSection from './report/ExportSection';

interface ReportViewProps {
  report: AuditReport;
  onRestart: () => void;
  userEmail?: string;
  allAnswers?: AuditAnswer[];
}

const ReportView: React.FC<ReportViewProps> = ({ report, onRestart, userEmail, allAnswers }) => {
  // Get pain point and tech readiness from answers
  const painPointAnswer = allAnswers?.find(a => a.questionId === 'general-1')?.value || '';
  const techReadinessAnswer = allAnswers?.find(a => a.questionId === 'general-2')?.value || '';
  
  // Build formatted report
  const formattedReport = buildFormattedReport(
    report,
    userEmail,
    undefined, // userName - we don't have this in ReportView
    painPointAnswer,
    techReadinessAnswer
  );
  
  // Render using ReactRenderer
  const renderer = new ReactRenderer(formattedReport);
  const renderedReport = renderer.render();
  
  console.log('📄 ReportView rendered with:', {
    hasReport: !!report,
    hasAISummary: !!report?.aiGeneratedSummary,
    aiSummaryLength: report?.aiGeneratedSummary?.length || 0,
    sectionsCount: formattedReport.sections.length
  });
  
  return (
    <div className="animate-fade-in">
      {/* Rendered report content (includes the CTA from renderer) */}
      {renderedReport}
      
      {/* Export Options */}
      <ExportSection 
        report={report}
        userEmail={userEmail}
        painPointAnswer={painPointAnswer}
        techReadinessAnswer={techReadinessAnswer}
      />
      
      {/* Restart Button */}
      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onRestart} className="text-nomadic-taupe hover:text-nomadic-navy hover:bg-nomadic-beige">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Audit
        </Button>
      </div>
    </div>
  );
};

export default ReportView;
