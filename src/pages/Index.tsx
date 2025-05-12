
import AuditWizard from "@/components/AuditWizard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-workflow-blue bg-opacity-10 pb-16">
      <div className="max-w-screen-xl mx-auto">
        <header className="py-6 px-4 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="text-workflow-purpleDark mr-2">Workflow</span> AI Audit
            </h1>
            <div className="text-sm text-gray-600">
              For Small Business Owners
            </div>
          </div>
        </header>
        
        <main>
          <AuditWizard />
        </main>
      </div>
    </div>
  );
};

export default Index;
