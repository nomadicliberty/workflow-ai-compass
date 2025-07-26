import { useState, useRef, useCallback, useEffect } from 'react';
import { AuditReport, AuditAnswer } from '../types/audit';
import { useToast } from '@/hooks/use-toast';
import { generateAuditReport } from '../data/auditQuestions';
import { sendReportEmail } from '../services/emailService';
import { generateAIReport, transformReportForAI } from '../services/aiReportService';
import { ErrorHandler } from '../utils/errorHandler';

export const useReportGeneration = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const { toast } = useToast();
  
  // Prevent duplicate AI generation calls and track component mount state
  const aiGenerationInProgress = useRef(false);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Debounced email submission to prevent rapid-fire calls
  const handleEmailSubmit = useCallback(async (data: { email: string; name: string }, answers: AuditAnswer[]) => {
    // Prevent duplicate calls
    if (aiGenerationInProgress.current) {
      return;
    }

    // Check if component is still mounted
    if (!isMountedRef.current) {
      return;
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    setUserEmail(data.email);
    setUserName(data.name);
    setIsGeneratingReport(true);
    setGenerationStatus('Analyzing your responses...');
    aiGenerationInProgress.current = true;
    
    try {
      // Generate base report using existing logic
      const baseReport = generateAuditReport(answers);
      
      // Check if still mounted before continuing
      if (!isMountedRef.current) return;
      
      // Get all user inputs for AI generation
      const painPointAnswer = answers.find(a => a.questionId === 'general-1')?.value || '';
      const techReadinessAnswer = answers.find(a => a.questionId === 'general-2')?.value || '';
      const businessTypeAnswer = answers.find(a => a.questionId === 'business-context-1')?.value || '';
      const teamSizeAnswer = answers.find(a => a.questionId === 'business-context-2')?.value || '';
      
      // Transform report data for AI backend
      const reportScores = transformReportForAI(baseReport);
      
      // Try to get AI-generated summary with retry logic
      try {
        if (!isMountedRef.current) return;
        setGenerationStatus('Generating AI-powered insights...');
        
        const aiSummary = await generateAIReport(
          reportScores, 
          painPointAnswer, 
          techReadinessAnswer,
          businessTypeAnswer,
          teamSizeAnswer
        );
        
        if (!isMountedRef.current) return;
        
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
        if (!isMountedRef.current) return;
        ErrorHandler.logError(aiError as Error, 'AI_GENERATION_FAILED');
        setGenerationStatus('Using standard analysis...');
        toast({
          title: "Report Generated",
          description: "Your workflow assessment is ready (using standard analysis).",
        });
      }
      
      // Check if still mounted before setting report
      if (!isMountedRef.current) return;
      
      // Set the report BEFORE trying to send email
      setReport(baseReport);
      
      // Send email with the report with retry logic
      try {
        if (!isMountedRef.current) return;
        setGenerationStatus('Sending email report...');
        
        const emailSent = await sendReportEmail({
          userEmail: data.email,
          userName: data.name,
          report: baseReport,
          painPoint: painPointAnswer,
          techReadiness: techReadinessAnswer
        });
        
        if (!isMountedRef.current) return;
        
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
        if (!isMountedRef.current) return;
        ErrorHandler.logError(emailError as Error, 'EMAIL_SEND_FAILED');
        toast({
          title: "Email Delivery Issue", 
          description: "We generated your report but had trouble sending the email. You can still view it here.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      ErrorHandler.logError(error as Error, 'REPORT_GENERATION_FAILED');
      toast({
        title: "Something went wrong",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (isMountedRef.current) {
        setIsGeneratingReport(false);
        setGenerationStatus('');
      }
      aiGenerationInProgress.current = false;
      abortControllerRef.current = null;
    }
  }, [toast]);

  const resetReport = () => {
    setReport(null);
    setUserEmail('');
    setUserName('');
    aiGenerationInProgress.current = false;
  };

  return {
    report,
    isGeneratingReport,
    generationStatus,
    userEmail,
    userName,
    handleEmailSubmit,
    resetReport
  };
};