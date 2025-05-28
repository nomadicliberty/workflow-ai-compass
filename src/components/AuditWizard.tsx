
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
import { sendReportEmail } from '../services/emailService';
import { generateAIReport, transformReportForAI } from '../services/aiReportService';

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
      // Generate base report using existing logic
      const baseReport = generateAuditReport(answers);
      
      // Get pain point for AI generation
      const painPointAnswer = answers.find(a => a.questionId === 'general-1')?.value || '';
      const techReadinessAnswer = answers.find(a => a.questionId === 'general-2')?.value || '';
      
      // Transform report data for AI backend
      const reportScores = transformReportForAI(baseReport);
      
      try {
        // Try to get AI-generated summary with timeout
        console.log('Attempting to generate AI summary...');
        const aiSummary = await Promise.race([
          generateAIReport(reportScores, painPointAnswer),
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('AI generation timeout')), 15000)
          )
        ]);
        
        baseReport.aiGeneratedSummary = aiSummary;
        console.log('AI summary generated successfully, length:', aiSummary.length);
        
        toast({
          title: "AI Report Generated!",
          description: "Your personalized workflow assessment has been enhanced with AI insights.",
        });
      } catch (aiError) {
        console.warn("Failed to generate AI summary, using fallback:", aiError);
        toast({
          title: "Report Generated",
          description: "Your workflow assessment is ready (using standard analysis).",
        });
      }
      
      setReport(baseReport);
      
      // Send email with the report (including AI summary if available) with timeout
      try {
        console.log('Attempting to send email...');
        const emailSent = await Promise.race([
          sendReportEmail({
            userEmail: email,
            report: baseReport,
            painPoint: painPointAnswer,
            techReadiness: techReadinessAnswer
          }),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Email sending timeout')), 20000)
          )
        ]);
        
        if (emailSent) {
          toast({
            title: "Report Sent!",
            description: "Your personalized workflow audit has been sent to your email.",
          });
        } else {
          toast({
            title: "Email Delivery Issue",
            description: "We generated your report but had trouble sending the email. You can still view it here.",
            variant: "destructive",
          });
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        toast({
          title: "Email Delivery Issue",
          description: "We generated your report but had trouble sending the email. You can still view it here.",
          variant: "destructive",
        });
      }
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
      return <ReportView 
        report={report} 
        onRestart={handleRestartAudit} 
        userEmail={userEmail} 
        allAnswers={answers} 
      />;
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
