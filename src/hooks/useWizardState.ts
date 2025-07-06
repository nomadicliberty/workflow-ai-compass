import { useState, useMemo } from 'react';
import { AuditAnswer } from '../types/audit';
import { getQuestionsForIndustry } from '../data/auditQuestions';

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<AuditAnswer[]>([]);
  const [showEmailForm, setShowEmailForm] = useState(false);

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

  const handleRestart = () => {
    setCurrentStep(-1);
    setAnswers([]);
    setShowEmailForm(false);
  };

  const isCurrentQuestionAnswered = () => {
    if (currentStep < 0 || currentStep >= totalSteps) return true;
    return answers.some(a => a.questionId === currentQuestions[currentStep].id);
  };

  return {
    currentStep,
    answers,
    showEmailForm,
    currentQuestions,
    totalSteps,
    selectedIndustry,
    handleStartAudit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleAnswer,
    handleRestart,
    isCurrentQuestionAnswered,
    setShowEmailForm
  };
};