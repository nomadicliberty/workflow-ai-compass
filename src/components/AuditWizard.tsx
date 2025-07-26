
import React, { useState, useRef, useMemo } from 'react';
import { AuditQuestion, AuditAnswer, AuditReport } from '../types/audit';
import { getQuestionsForIndustry, generateAuditReport } from '../data/auditQuestions';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ReportView from './ReportView';
import WelcomeScreen from './WelcomeScreen';
import EmailCollectionForm from './forms/EmailCollectionForm';
import LoadingScreen from './ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendReportEmail } from '../services/emailService';
import { generateAIReport, transformReportForAI } from '../services/aiReportService';
import { ErrorHandler } from '../utils/errorHandler';

const AuditWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<AuditAnswer[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();
  
  // Prevent duplicate AI generation calls
  const aiGenerationInProgress = useRef(false);

  // Get selected industry from answers to determine question set
  const selectedIndustry = answers.find(a => a.questionId === 'business-context-1')?.value || '';
  
  // Memoize questions based on selected industry
  const currentQuestions = useMemo(() => {
    if (selectedIndustry) {
      return getQuestionsForIndustry(selectedIndustry);
    }
    // Default to universal questions if no industry selected yet
    return getQuestionsForIndustry('Other'); 
  }, [selectedIndustry]);

  const totalSteps = currentQuestions.length;

  const handleStartAudit = () => {
    setCurrentStep(0);
  };

  const handleNextQuestion = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowEmailForm(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (answer: AuditAnswer) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === answer.questionId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  const handleRestartAudit = () => {
    setCurrentStep(-1);
    setAnswers([]);
    setReport(null);
    setUserEmail('');
    setUserName('');
    setShowEmailForm(false);
    aiGenerationInProgress.current = false;
  };

  const handleEmailSubmit = async (data: { email: string; name: string }) => {
    // Prevent duplicate calls
    if (aiGenerationInProgress.current) {
      return;
    }

    setUserEmail(data.email);
    setUserName(data.name);
    setIsGeneratingReport(true);
    setGenerationStatus('Analyzing your responses...');
    aiGenerationInProgress.current = true;
    
    try {
      // Generate base report using existing logic
      const baseReport = generateAuditReport(answers);
      
      // Get all user inputs for AI generation
      const painPointAnswer = answers.find(a => a.questionId === 'general-1')?.value || '';
      const techReadinessAnswer = answers.find(a => a.questionId === 'general-2')?.value || '';
      const businessTypeAnswer = answers.find(a => a.questionId === 'business-context-1')?.value || '';
      const teamSizeAnswer = answers.find(a => a.questionId === 'business-context-2')?.value || '';
      
      // Transform report data for AI backend
      const reportScores = transformReportForAI(baseReport);
      
      // Try to get AI-generated summary
      try {
        setGenerationStatus('Generating AI-powered insights...');
        
        const aiSummary = await generateAIReport(
          reportScores, 
          painPointAnswer, 
          techReadinessAnswer,
          businessTypeAnswer,
          teamSizeAnswer
        );
        
        if (aiSummary && aiSummary.trim()) {
          baseReport.aiGeneratedSummary = aiSummary.trim();
          
          toast({
            title: "AI Report Generated!",
            description: "Your personalized workflow assessment has been enhanced with AI insights.",
          });
        } else {
          throw new Error('Empty AI response');
        }
      } catch (aiError) {
        ErrorHandler.logError(aiError as Error, 'AI_GENERATION_FAILED');
        setGenerationStatus('Using standard analysis...');
        toast({
          title: "Report Generated",
          description: "Your workflow assessment is ready (using standard analysis).",
        });
      }
      
      // Set the report BEFORE trying to send email
      setReport(baseReport);
      
      // Send email with the report
      try {
        setGenerationStatus('Sending email report...');
        
        const emailSent = await sendReportEmail({
          userEmail: data.email,
          userName: data.name,
          report: baseReport,
          painPoint: painPointAnswer,
          techReadiness: techReadinessAnswer
        });
        
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
        ErrorHandler.logError(emailError as Error, 'EMAIL_SEND_FAILED');
        toast({
          title: "Email Delivery Issue", 
          description: "We generated your report but had trouble sending the email. You can still view it here.",
          variant: "destructive",
        });
      }
    } catch (error) {
      ErrorHandler.logError(error as Error, 'REPORT_GENERATION_FAILED');
      toast({
        title: "Something went wrong",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
      setGenerationStatus('');
      setShowEmailForm(false);
      aiGenerationInProgress.current = false;
    }
  };

  const isCurrentQuestionAnswered = () => {
    if (currentStep < 0 || currentStep >= totalSteps) return true;
    return answers.some(a => a.questionId === currentQuestions[currentStep].id);
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
      return <LoadingScreen status={generationStatus} />;
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
          question={currentQuestions[currentStep]}
          onAnswer={handleAnswer}
          currentAnswer={answers.find(a => a.questionId === currentQuestions[currentStep].id)?.value}
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
            className="bg-nomadic-teal hover:bg-nomadic-navy text-white"
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
