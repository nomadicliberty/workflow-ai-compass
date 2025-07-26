import React, { useState, useEffect } from 'react';
import { AuditQuestion, AuditAnswer } from '../types/audit';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionCardProps {
  question: AuditQuestion;
  onAnswer: (answer: AuditAnswer) => void;
  currentAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, currentAnswer }) => {
  // Initialize state with currentAnswer prop
  const [answer, setAnswer] = useState<string>(currentAnswer || '');

  // Update local state when currentAnswer prop changes (for navigation between questions)
  useEffect(() => {
    setAnswer(currentAnswer || '');
  }, [currentAnswer, question.id]); // Add question.id as dependency

  const handleRadioChange = (value: string) => {
    setAnswer(value);
    onAnswer({
      questionId: question.id,
      value,
      category: question.category
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAnswer(value);
    if (value.trim()) {
      onAnswer({
        questionId: question.id,
        value,
        category: question.category
      });
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="bg-workflow-blue bg-opacity-50 rounded-t-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">{question.text}</h2>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-6">
        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup 
            value={answer} 
            onValueChange={handleRadioChange}
            className="space-y-3 sm:space-y-4"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem 
                  value={option} 
                  id={`option-${question.id}-${index}`}
                  className="mt-0.5 min-w-[20px] h-5 w-5"
                />
                <Label 
                  htmlFor={`option-${question.id}-${index}`}
                  className="cursor-pointer text-sm sm:text-base leading-relaxed flex-1 min-h-[44px] flex items-center"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {question.type === 'text' && (
          <Textarea
            placeholder="Enter your response..."
            value={answer}
            onChange={handleTextChange}
            className="min-h-[120px] sm:min-h-[140px] mt-2 text-sm sm:text-base p-3 sm:p-4 resize-none"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;