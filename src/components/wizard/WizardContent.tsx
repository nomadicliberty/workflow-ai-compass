import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import QuestionCard from '../QuestionCard';
import ProgressBar from '../ProgressBar';
import { AuditQuestion, AuditAnswer } from '../../types/audit';

interface WizardContentProps {
  currentStep: number;
  totalSteps: number;
  currentQuestions: AuditQuestion[];
  answers: AuditAnswer[];
  onAnswer: (answer: AuditAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
  isCurrentQuestionAnswered: () => boolean;
}

const WizardContent: React.FC<WizardContentProps> = ({
  currentStep,
  totalSteps,
  currentQuestions,
  answers,
  onAnswer,
  onNext,
  onPrevious,
  isCurrentQuestionAnswered
}) => {
  return (
    <div className="animate-fade-in">
      <ProgressBar 
        currentStep={currentStep + 1} 
        totalSteps={totalSteps} 
      />
      
      <QuestionCard
        question={currentQuestions[currentStep]}
        onAnswer={onAnswer}
        currentAnswer={answers.find(a => a.questionId === currentQuestions[currentStep].id)?.value}
      />
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="order-2 sm:order-1 min-h-[48px] touch-manipulation"
        >
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!isCurrentQuestionAnswered()}
          className="bg-nomadic-teal hover:bg-nomadic-navy text-white order-1 sm:order-2 min-h-[48px] touch-manipulation"
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

export default WizardContent;