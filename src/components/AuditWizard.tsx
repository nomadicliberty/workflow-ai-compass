
import React from 'react';
import ReportView from './ReportView';
import WelcomeScreen from './WelcomeScreen';
import EmailCollectionForm from './forms/EmailCollectionForm';
import LoadingScreen from './ui/LoadingScreen';
import WizardContent from './wizard/WizardContent';
import { useWizardState } from '../hooks/useWizardState';
import { useReportGeneration } from '../hooks/useReportGeneration';

const AuditWizard: React.FC = () => {
  const wizardState = useWizardState();
  const reportGeneration = useReportGeneration();

  const handleRestartAudit = () => {
    wizardState.handleRestart();
    reportGeneration.resetReport();
  };

  const handleEmailSubmit = async (data: { email: string; name: string }) => {
    await reportGeneration.handleEmailSubmit(data, wizardState.answers);
    wizardState.setShowEmailForm(false);
  };

  // Render appropriate screen based on state
  const renderContent = () => {
    if (wizardState.currentStep === -1) {
      return <WelcomeScreen onStart={wizardState.handleStartAudit} />;
    }

    if (wizardState.showEmailForm) {
      return <EmailCollectionForm onSubmit={handleEmailSubmit} isLoading={reportGeneration.isGeneratingReport} />;
    }

    if (reportGeneration.isGeneratingReport) {
      return <LoadingScreen status={reportGeneration.generationStatus} />;
    }

    if (reportGeneration.report) {
      return <ReportView 
        report={reportGeneration.report} 
        onRestart={handleRestartAudit} 
        userEmail={reportGeneration.userEmail} 
        allAnswers={wizardState.answers} 
      />;
    }

    return (
      <WizardContent
        currentStep={wizardState.currentStep}
        totalSteps={wizardState.totalSteps}
        currentQuestions={wizardState.currentQuestions}
        answers={wizardState.answers}
        onAnswer={wizardState.handleAnswer}
        onNext={wizardState.handleNextQuestion}
        onPrevious={wizardState.handlePreviousQuestion}
        isCurrentQuestionAnswered={wizardState.isCurrentQuestionAnswered}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:px-8">
      {renderContent()}
    </div>
  );
};

export default AuditWizard;
