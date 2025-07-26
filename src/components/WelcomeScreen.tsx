
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 animate-fade-in bg-nomadic-white">
      {/* Header with Navy background */}
      <div className="w-full bg-nomadic-navy text-nomadic-white text-center py-6 sm:py-8 mb-6 sm:mb-8 rounded-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">Workflow AI Audit</h1>
        <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
          Discover opportunities to save time and improve efficiency with AI and automation
        </p>
        <div className="mt-3 sm:mt-4">
          <p className="text-xs sm:text-sm opacity-90">Powered by Nomadic Liberty LLC</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl w-full">
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-beige">
          <CardHeader className="pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-nomadic-navy">Quick Assessment</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm sm:text-base text-nomadic-gray leading-relaxed">
              Answer a series of simple questions about your current business workflows
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-lightBlue">
          <CardHeader className="pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-nomadic-navy">Personalized Insights</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm sm:text-base text-nomadic-gray leading-relaxed">
              Get AI-powered recommendations tailored to your specific business needs
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-beige sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-nomadic-navy">Actionable Steps</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm sm:text-base text-nomadic-gray leading-relaxed">
              Receive practical suggestions for tools and improvements you can implement
            </p>
          </CardContent>
        </Card>
      </div>
      
      <CardFooter className="pb-0">
        <Button 
          onClick={onStart} 
          className="bg-nomadic-teal hover:bg-nomadic-teal/90 text-nomadic-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg border-0 min-h-[48px] touch-manipulation"
          size="lg"
        >
          Start Your Audit <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </CardFooter>
      
      <p className="text-nomadic-taupe mt-6 sm:mt-8 text-xs sm:text-sm text-center px-4">
        Takes approximately 3 minutes to complete
      </p>
    </div>
  );
};

export default WelcomeScreen;
