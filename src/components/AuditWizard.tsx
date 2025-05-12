
import React, { useState } from 'react';
import { AuditQuestion, AuditAnswer, AuditReport } from '../types/audit';
import { auditQuestions, generateAuditReport } from '../data/auditQuestions';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ReportView from './ReportView';
import WelcomeScreen from './WelcomeScreen';
import EmailCollectionForm from './EmailCollectionForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuditWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen, 0-n for questions
  const [answers, setAnswers] = useState<AuditAnswer[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();

  const totalSteps = auditQuestions.length;

  const handleStartAudit = () => {
    setCurrentStep(0);
  };

  const handleNextQuestion = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show email collection form
      setShowEmailForm(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (answer: AuditAnswer) => {
    // Update answers
    setAnswers(prev => {
      // Check if we're updating an existing answer
      const existingIndex = prev.findIndex(a => a.questionId === answer.questionId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = answer;
        return updated;
      }
      // Add new answer
      return [...prev, answer];
    });
  };

  const handleRestartAudit = () => {
    setCurrentStep(-1);
    setAnswers([]);
    setReport(null);
    setUserEmail('');
    setShowEmailForm(false);
  };

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email);
    setIsGeneratingReport(true);
    
    try {
      // Generate report
      const generatedReport = generateAuditReport(answers);
      setReport(generatedReport);
      
      // In a real app, send email here
      await sendReportEmail(email, generatedReport);
      
      toast({
        title: "Report Sent!",
        description: "Your personalized workflow audit has been sent to your email.",
      });
    } catch (error) {
      console.error("Error generating or sending report:", error);
      toast({
        title: "Something went wrong",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
      setShowEmailForm(false);
    }
  };
  
  const sendReportEmail = async (email: string, report: AuditReport) => {
    // In a real implementation, this would be an API call to a backend
    console.log(`Sending report to ${email} and BCC to your-email@example.com`);
    console.log("Report content:", report);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (currentStep < 0 || currentStep >= totalSteps) return true;
    return answers.some(a => a.questionId === auditQuestions[currentStep].id);
  };

  // Render appropriate screen based on state
  const renderContent = () => {
    if (currentStep === -1) {
      return <WelcomeScreen onStart={handleStartAudit} />;
    }

    if (showEmailForm) {
      return <EmailCollectionForm onSubmit={handleEmailSubmit} isLoading={isGeneratingReport} />;
    }

    if (isGeneratingReport) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <span className="loader mb-8"></span>
          <h2 className="text-2xl font-semibold mb-4">Analyzing Your Workflow...</h2>
          <p className="text-gray-600 max-w-md text-center">
            Our AI is processing your responses and generating personalized recommendations.
          </p>
        </div>
      );
    }

    if (report) {
      return <ReportView report={report} onRestart={handleRestartAudit} userEmail={userEmail} />;
    }

    return (
      <div className="animate-fade-in">
        <ProgressBar 
          currentStep={currentStep + 1} 
          totalSteps={totalSteps} 
        />
        
        <QuestionCard
          question={auditQuestions[currentStep]}
          onAnswer={handleAnswer}
          currentAnswer={answers.find(a => a.questionId === auditQuestions[currentStep].id)?.value}
        />
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered()}
            className="bg-workflow-purpleDark hover:bg-purple-700"
          >
            {currentStep < totalSteps - 1 ? (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              'Continue to Report'
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {renderContent()}
    </div>
  );
};

export default AuditWizard;
