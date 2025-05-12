
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Workflow AI Audit</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Discover opportunities to save time and improve efficiency with AI and automation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl">
        <Card className="shadow-md border border-gray-200 bg-workflow-blue bg-opacity-30">
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Assessment</h3>
          </CardHeader>
          <CardContent>
            <p>
              Answer a series of simple questions about your current business workflows
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-gray-200 bg-workflow-purple bg-opacity-30">
          <CardHeader>
            <h3 className="text-lg font-semibold">Personalized Insights</h3>
          </CardHeader>
          <CardContent>
            <p>
              Get AI-powered recommendations tailored to your specific business needs
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-gray-200 bg-workflow-green bg-opacity-30">
          <CardHeader>
            <h3 className="text-lg font-semibold">Actionable Steps</h3>
          </CardHeader>
          <CardContent>
            <p>
              Receive practical suggestions for tools and improvements you can implement
            </p>
          </CardContent>
        </Card>
      </div>
      
      <CardFooter>
        <Button 
          onClick={onStart} 
          className="bg-workflow-purpleDark hover:bg-purple-700 text-white px-8 py-6 text-lg"
          size="lg"
        >
          Start Your Audit <ArrowRight className="ml-2" />
        </Button>
      </CardFooter>
      
      <p className="text-gray-500 mt-8 text-sm">
        Takes approximately 5 minutes to complete
      </p>
    </div>
  );
};

export default WelcomeScreen;
