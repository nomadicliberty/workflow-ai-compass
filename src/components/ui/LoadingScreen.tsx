
import React from 'react';

interface LoadingScreenProps {
  status?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-16 h-16 border-4 border-nomadic-teal border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-semibold mb-4 text-nomadic-navy">Analyzing Your Workflow...</h2>
      <p className="text-nomadic-gray max-w-md text-center mb-4">
        Generating your personalized report... This may take up to 30 seconds.
      </p>
      <p className="text-sm text-nomadic-teal font-medium mb-2">
        Please don't refresh your browser.
      </p>
      <p className="text-sm text-nomadic-gray mb-4">
        Our AI is processing your responses and creating tailored recommendations.
      </p>
      {status && (
        <div className="text-sm text-nomadic-teal font-medium mt-4 bg-nomadic-lightBlue bg-opacity-20 px-4 py-2 rounded-lg">
          {status}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
