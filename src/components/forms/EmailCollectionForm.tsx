
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailCollectionFormProps {
  onSubmit: (data: { email: string; name: string }) => void;
  isLoading: boolean;
}

const EmailCollectionForm: React.FC<EmailCollectionFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to receive the report.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEmailValid(true);
    console.log('🔥 EmailCollectionForm: Submitting data:', { email, name });
    onSubmit({ email, name });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-nomadic-navy">
        Almost there!
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        Enter your details to receive your personalized workflow audit report with AI recommendations and estimated time savings.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name or Company
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name or company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!isEmailValid) setIsEmailValid(validateEmail(e.target.value));
            }}
            className={`w-full ${!isEmailValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            required
          />
          {!isEmailValid && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-nomadic-teal hover:bg-nomadic-navy text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Generating Report... This may take 30 seconds.
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Get My Report
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          We'll also receive a copy so we can help with any questions you might have.
        </p>
      </form>
    </div>
  );
};

export default EmailCollectionForm;
