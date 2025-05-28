
import React from 'react';
import { AuditReport, AuditAnswer } from '../types/audit';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

// Import our components
import PersonalizedSummary from './report/PersonalizedSummary';
import OverallSummary from './report/OverallSummary';
import BookCallSection from './report/BookCallSection';
import CategoryTabs from './report/CategoryTabs';
import ExportSection from './report/ExportSection';
import CallToAction from './report/CallToAction';
import AISummaryCard from './report/AISummaryCard';

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
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Workflow Audit Results</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your responses, we've analyzed your business operations and generated personalized recommendations.
        </p>
      </div>
      
      {/* AI-Generated Summary (if available) */}
      {report.aiGeneratedSummary && (
        <AISummaryCard aiSummary={report.aiGeneratedSummary} />
      )}
      
      {/* Personalized Summary (fallback if no AI summary) */}
      {!report.aiGeneratedSummary && (
        <PersonalizedSummary 
          painPointAnswer={painPointAnswer} 
          techReadinessAnswer={techReadinessAnswer} 
        />
      )}
      
      {/* Overall Summary Card */}
      <OverallSummary report={report} />
      
      {/* Book a Call Button */}
      <BookCallSection />
      
      {/* Detailed Category Results */}
      <CategoryTabs categories={report.categories} />
      
      {/* Export Options */}
      <ExportSection 
        report={report}
        userEmail={userEmail}
        painPointAnswer={painPointAnswer}
        techReadinessAnswer={techReadinessAnswer}
      />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* Restart Button */}
      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onRestart} className="text-gray-600">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Audit
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ReportView;
