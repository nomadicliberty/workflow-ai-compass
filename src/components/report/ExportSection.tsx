import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuditReport } from '../../types/audit';
import { sendReportEmail } from '../../services/emailService';
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
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    // Create a formatted report for download
    const reportContent = `
      Nomadic Liberty LLC - Workflow AI Audit Results
      -------------------------
      Overall Rating: ${report.overallRating} (${report.overallScore}/100)
      Estimated Weekly Time Savings: ${report.totalTimeSavings}
      
      Category Assessments:
      ${report.categories.map(category => `
        * ${category.category}: ${category.rating} (${category.score}/100)
          Estimated Time Savings: ${category.timeSavings}
          Recommended Tools: ${category.tools.join(', ')}
          Suggested Improvements:
          ${category.improvements.map(imp => `- ${imp}`).join('\n          ')}
      `).join('\n      ')}
      
      Top Recommendations:
      ${report.topRecommendations.map((rec, i) => `${i+1}. ${rec}`).join('\n      ')}
      
      Book a free discovery call: https://calendly.com/workflow-ai/discovery
      
      © ${new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.
    `;
    
    // Create a download link
    const element = document.createElement("a");
    const file = new Blob([reportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "nomadic_liberty_workflow_audit_report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Report downloaded!",
      description: "Your audit report has been downloaded as a text file.",
    });
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    
    try {
      // Send email using the email service with pain point and tech readiness
      const success = await sendReportEmail({
        userEmail: emailInput,
        report: report,
        painPoint: painPointAnswer,
        techReadiness: techReadinessAnswer
      });
      
      if (success) {
        toast({
          title: "Report sent!",
          description: `Your audit report has been sent to ${emailInput}`,
        });
        setEmailInput('');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send email",
          description: "There was an error sending your report. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: "There was an error sending your report. Please try again.",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

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
    <div className="mt-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">Save Your Results</h3>
        <p className="text-gray-600 mb-4 md:mb-0">Download your report or have it sent to your email</p>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        
        <Button variant="outline" onClick={handleGeneratePDF} disabled={isPdfGenerating}>
          <FileDown className="mr-2 h-4 w-4" />
          {isPdfGenerating ? 'Generating PDF...' : 'Download as PDF'}
        </Button>
        
        <form onSubmit={handleSendEmail} className="flex space-x-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-workflow-purpleDark"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <Button type="submit" disabled={isEmailSending}>
            <Mail className="mr-2 h-4 w-4" />
            {isEmailSending ? 'Sending...' : 'Email'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExportSection;
