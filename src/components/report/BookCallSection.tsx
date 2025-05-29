
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookCallSection: React.FC = () => {
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
    <div className="mb-8 bg-nomadic-lightBlue bg-opacity-20 p-6 rounded-lg border border-nomadic-teal flex flex-col md:flex-row justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold mb-2">Need help implementing these solutions?</h3>
        <p className="text-gray-600">Schedule a free consultation call with our automation experts at Nomadic Liberty LLC</p>
      </div>
      <Button 
        onClick={handleBookCall}
        className="mt-4 md:mt-0 bg-nomadic-teal hover:bg-nomadic-navy text-white"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Book a Free Call
      </Button>
    </div>
  );
};

export default BookCallSection;
