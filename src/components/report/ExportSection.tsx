
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuditReport } from '../../types/audit';
import { generatePDF } from '../../utils/pdfGenerator';

interface ExportSectionProps {
  report: AuditReport;
  userEmail?: string;
  painPointAnswer: string;
  techReadinessAnswer: string;
}

const ExportSection: React.FC<ExportSectionProps> = ({ 
  report, 
  userEmail, 
  painPointAnswer, 
  techReadinessAnswer 
}) => {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    setIsPdfGenerating(true);
    try {
      await generatePDF(report, painPointAnswer, techReadinessAnswer);
      toast({
        title: "PDF generated!",
        description: "Your audit report has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Failed to generate PDF",
        description: "There was an error generating your PDF. Please try again.",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="mt-8 sm:mt-10 text-center bg-nomadic-beige p-4 sm:p-6 rounded-lg border border-nomadic-taupe">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Save Your Results</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Download your report</p>
      
      <Button 
        variant="outline" 
        onClick={handleGeneratePDF} 
        disabled={isPdfGenerating}
        className="bg-nomadic-teal hover:bg-nomadic-navy text-white border-nomadic-teal w-full sm:w-auto min-h-[48px] px-6 py-3 text-base touch-manipulation"
      >
        <FileDown className="mr-2 h-4 w-4" />
        {isPdfGenerating ? 'Generating PDF...' : 'Download as PDF'}
      </Button>
    </div>
  );
};

export default ExportSection;
