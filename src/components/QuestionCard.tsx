
import React, { useState } from 'react';
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
  const [answer, setAnswer] = useState<string>('');

  const handleRadioChange = (value: string) => {
    setAnswer(value);
    onAnswer({
      questionId: question.id,
      value,
      category: question.category
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    if (e.target.value.trim()) {
      onAnswer({
        questionId: question.id,
        value: e.target.value,
        category: question.category
      });
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="bg-workflow-blue bg-opacity-50 rounded-t-lg">
        <h2 className="text-xl font-semibold">{question.text}</h2>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup 
            value={answer} 
            onValueChange={handleRadioChange}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${question.id}-${index}`} />
                <Label 
                  htmlFor={`option-${question.id}-${index}`}
                  className="cursor-pointer text-base"
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
            className="min-h-[120px] mt-2"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
