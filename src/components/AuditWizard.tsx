import React, { useState, useRef } from 'react';
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
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<AuditAnswer[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();
  
  // Prevent duplicate AI generation calls
  const aiGenerationInProgress = useRef(false);

  const totalSteps = auditQuestions.length;

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
    setShowEmailForm(false);
    aiGenerationInProgress.current = false;
  };

  const handleEmailSubmit = async (email: string) => {
    console.log('🔥 AuditWizard: handleEmailSubmit called with email:', email);
    console.log('🔥 AuditWizard: aiGenerationInProgress.current:', aiGenerationInProgress.current);
    
    // Prevent duplicate calls
    if (aiGenerationInProgress.current) {
      console.log('🔄 AI generation already in progress, skipping duplicate call');
      return;
    }

    setUserEmail(email);
    setIsGeneratingReport(true);
    setGenerationStatus('Analyzing your responses...');
    aiGenerationInProgress.current = true;
    
    try {
      console.log('🏁 Starting report generation process...');
      
      // Generate base report using existing logic
      const baseReport = generateAuditReport(answers);
      console.log('📊 Base report generated:', baseReport);
      
      // Get all user inputs for AI generation
      const painPointAnswer = answers.find(a => a.questionId === 'general-1')?.value || '';
      const techReadinessAnswer = answers.find(a => a.questionId === 'general-2')?.value || '';
      const businessTypeAnswer = answers.find(a => a.questionId === 'business-context-1')?.value || '';
      const teamSizeAnswer = answers.find(a => a.questionId === 'business-context-2')?.value || '';
      
      console.log('🔍 Extracted user inputs:');
      console.log('- Pain Point:', painPointAnswer);
      console.log('- Tech Readiness:', techReadinessAnswer);
      console.log('- Business Type:', businessTypeAnswer);
      console.log('- Team Size:', teamSizeAnswer);
      
      // Transform report data for AI backend
      const reportScores = transformReportForAI(baseReport);
      console.log('📈 Transformed scores for AI:', reportScores);
      
      // Try to get AI-generated summary
      try {
        setGenerationStatus('Generating AI-powered insights...');
        console.log('🤖 Calling AI generation service...');
        
        const aiSummary = await generateAIReport(
          reportScores, 
          painPointAnswer, 
          techReadinessAnswer,
          businessTypeAnswer,
          teamSizeAnswer
        );
        
        console.log('✅ AI summary received:', {
          length: aiSummary?.length || 0,
          preview: aiSummary?.substring(0, 100) + '...',
          hasContent: !!(aiSummary && aiSummary.trim())
        });
        
        if (aiSummary && aiSummary.trim()) {
          baseReport.aiGeneratedSummary = aiSummary.trim();
          console.log('🎯 AI summary successfully attached to report');
          
          toast({
            title: "AI Report Generated!",
            description: "Your personalized workflow assessment has been enhanced with AI insights.",
          });
        } else {
          console.warn('⚠️ AI summary is empty or invalid:', aiSummary);
          throw new Error('Empty AI response');
        }
      } catch (aiError) {
        console.error("❌ AI generation failed:", aiError);
        setGenerationStatus('Using standard analysis...');
        toast({
          title: "Report Generated",
          description: "Your workflow assessment is ready (using standard analysis).",
        });
      }
      
      console.log('📋 Final report object:', {
        hasAISummary: !!baseReport.aiGeneratedSummary,
        aiSummaryLength: baseReport.aiGeneratedSummary?.length || 0,
        overallScore: baseReport.overallScore,
        categoriesCount: baseReport.categories.length
      });
      
      // Set the report BEFORE trying to send email
      setReport(baseReport);
      
      // Send email with the report
      try {
        setGenerationStatus('Sending email report...');
        console.log('📧 Attempting to send email to:', email);
        
        const emailSent = await sendReportEmail({
          userEmail: email,
          report: baseReport,
          painPoint: painPointAnswer,
          techReadiness: techReadinessAnswer
        });
        
        if (emailSent) {
          console.log('✅ Email sent successfully');
          toast({
            title: "Report Sent!",
            description: "Your personalized workflow audit has been sent to your email.",
          });
        } else {
          console.warn('⚠️ Email sending returned false');
          toast({
            title: "Email Delivery Issue",
            description: "We generated your report but had trouble sending the email. You can still view it here.",
            variant: "destructive",
          });
        }
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError);
        toast({
          title: "Email Delivery Issue", 
          description: "We generated your report but had trouble sending the email. You can still view it here.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error in report generation flow:", error);
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
      console.log('🏁 Report generation process completed');
    }
  };

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
          <h2 className="text-2xl font-semibold mb-4 text-nomadic-navy">Analyzing Your Workflow...</h2>
          <p className="text-nomadic-gray max-w-md text-center mb-4">
            Our AI is processing your responses and generating personalized recommendations.
          </p>
          <p className="text-sm text-nomadic-teal font-medium mb-2">
            This may take up to 30 seconds.
          </p>
          <p className="text-sm text-nomadic-gray">
            Please don't refresh your browser.
          </p>
          {generationStatus && (
            <div className="text-sm text-nomadic-teal font-medium mt-4 bg-nomadic-lightBlue bg-opacity-20 px-4 py-2 rounded-lg">
              {generationStatus}
            </div>
          )}
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
