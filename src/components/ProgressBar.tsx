
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6 sm:mb-8 px-1">
      <div className="flex justify-between text-xs sm:text-sm text-nomadic-gray mb-2">
        <span className="font-medium">Progress</span>
        <span className="font-medium">{currentStep} of {totalSteps}</span>
      </div>
      <div className="w-full bg-nomadic-beige rounded-full h-3 sm:h-2.5 border border-nomadic-taupe/30 shadow-inner">
        <div 
          className="bg-nomadic-teal h-3 sm:h-2.5 rounded-full transition-all duration-300 ease-in-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
