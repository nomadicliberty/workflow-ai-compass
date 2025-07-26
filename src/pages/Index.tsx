
import AuditWizard from "@/components/AuditWizard";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleBookCall = () => {
    window.open('https://calendar.app.google/fDRgarRXA42zzqEo8', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-nomadic-lightBlue bg-opacity-10 pb-16">
      <div className="max-w-screen-xl mx-auto">
        <header className="py-4 px-4 sm:py-6 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center">
              <span className="text-nomadic-teal mr-1 sm:mr-2">Workflow</span> 
              <span className="hidden xs:inline">AI Audit</span>
              <span className="xs:hidden">Audit</span>
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:block text-sm text-gray-600">
                For Small Business Owners
              </div>
              <Button 
                variant="outline" 
                onClick={handleBookCall}
                className="text-nomadic-teal border-nomadic-teal hover:bg-nomadic-teal hover:text-white text-xs sm:text-sm px-2 sm:px-4 py-2"
                size="sm"
              >
                <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Free Consultation</span>
                <span className="sm:hidden">Book Call</span>
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
                <span className="text-nomadic-teal mr-2">Workflow</span> AI Audit
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Helping small businesses save time with AI & automation
              </p>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
