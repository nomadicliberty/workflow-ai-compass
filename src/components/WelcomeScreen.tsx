
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in bg-nomadic-white">
      {/* Header with Navy background */}
      <div className="w-full bg-nomadic-navy text-nomadic-white text-center py-8 mb-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Workflow AI Audit</h1>
        <p className="text-xl max-w-2xl mx-auto px-4">
          Discover opportunities to save time and improve efficiency with AI and automation
        </p>
        <div className="mt-4">
          <p className="text-sm opacity-90">Powered by Nomadic Liberty LLC</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl">
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-beige">
          <CardHeader>
            <h3 className="text-lg font-semibold text-nomadic-navy">Quick Assessment</h3>
          </CardHeader>
          <CardContent>
            <p className="text-nomadic-gray">
              Answer a series of simple questions about your current business workflows
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-lightBlue">
          <CardHeader>
            <h3 className="text-lg font-semibold text-nomadic-navy">Personalized Insights</h3>
          </CardHeader>
          <CardContent>
            <p className="text-nomadic-gray">
              Get AI-powered recommendations tailored to your specific business needs
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border border-nomadic-taupe bg-nomadic-beige">
          <CardHeader>
            <h3 className="text-lg font-semibold text-nomadic-navy">Actionable Steps</h3>
          </CardHeader>
          <CardContent>
            <p className="text-nomadic-gray">
              Receive practical suggestions for tools and improvements you can implement
            </p>
          </CardContent>
        </Card>
      </div>
      
      <CardFooter>
        <Button 
          onClick={onStart} 
          className="bg-nomadic-teal hover:bg-nomadic-teal/90 text-nomadic-white px-8 py-6 text-lg border-0"
          size="lg"
        >
          Start Your Audit <ArrowRight className="ml-2" />
        </Button>
      </CardFooter>
      
      <p className="text-nomadic-taupe mt-8 text-sm">
        Takes approximately 5 minutes to complete
      </p>
    </div>
  );
};

export default WelcomeScreen;
