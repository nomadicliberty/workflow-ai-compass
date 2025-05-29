
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CallToAction: React.FC = () => {
  const { toast } = useToast();

  const handleBookCall = () => {
    // Updated booking URL
    window.open('https://calendar.app.google/fDRgarRXA42zzqEo8', '_blank');
    
    toast({
      title: "Opening booking calendar",
      description: "You'll be able to schedule a free consultation call.",
    });
  };

  return (
    <div className="mt-10 text-center bg-nomadic-lightBlue bg-opacity-10 p-6 rounded-lg border border-nomadic-teal">
      <h3 className="text-xl font-semibold mb-3">Ready to transform your workflow?</h3>
      <p className="text-gray-700 mb-5">
        Book a free consultation call to discuss how we can help implement these recommendations.
      </p>
      <Button 
        onClick={handleBookCall}
        size="lg"
        className="bg-nomadic-teal hover:bg-nomadic-navy text-white"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Schedule Your Free Consultation
      </Button>
    </div>
  );
};

export default CallToAction;
