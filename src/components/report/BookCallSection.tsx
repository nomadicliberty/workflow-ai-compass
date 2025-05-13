
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookCallSection: React.FC = () => {
  const { toast } = useToast();

  const handleBookCall = () => {
    // In a real app, this would open the booking calendar
    window.open('https://calendly.com/workflow-ai/discovery', '_blank');
    
    toast({
      title: "Opening booking calendar",
      description: "You'll be able to schedule a free 20-minute AI consultation call.",
    });
  };

  return (
    <div className="mb-8 bg-workflow-purple bg-opacity-20 p-6 rounded-lg border border-workflow-purple flex flex-col md:flex-row justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold mb-2">Need help implementing these solutions?</h3>
        <p className="text-gray-600">Schedule a free 30-minute discovery call with our automation experts at Nomadic Liberty LLC</p>
      </div>
      <Button 
        onClick={handleBookCall}
        className="mt-4 md:mt-0 bg-workflow-purpleDark hover:bg-purple-700"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Book a Free Call
      </Button>
    </div>
  );
};

export default BookCallSection;
