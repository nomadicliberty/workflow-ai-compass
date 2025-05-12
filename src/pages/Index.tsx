
import AuditWizard from "@/components/AuditWizard";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleBookCall = () => {
    window.open('https://calendly.com/workflow-ai/discovery', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-workflow-blue bg-opacity-10 pb-16">
      <div className="max-w-screen-xl mx-auto">
        <header className="py-6 px-4 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="text-workflow-purpleDark mr-2">Workflow</span> AI Audit
            </h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-600">
                For Small Business Owners
              </div>
              <Button 
                variant="outline" 
                onClick={handleBookCall}
                className="text-workflow-purpleDark border-workflow-purpleDark"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book a Demo
              </Button>
            </div>
          </div>
        </header>
        
        <main>
          <AuditWizard />
        </main>
        
        <footer className="mt-16 border-t border-gray-200 py-8 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-workflow-purpleDark mr-2">Workflow</span> AI Audit
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Helping small businesses save time with AI & automation
              </p>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Workflow AI. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
