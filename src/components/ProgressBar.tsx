
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-nomadic-gray mb-1">
        <span>Progress</span>
        <span>{currentStep} of {totalSteps}</span>
      </div>
      <div className="w-full bg-nomadic-beige rounded-full h-2.5 border border-nomadic-taupe/30">
        <div 
          className="bg-nomadic-teal h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
