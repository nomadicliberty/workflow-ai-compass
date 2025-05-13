
import React, { useState } from 'react';
import { AuditReport, CategoryAssessment, categoryLabels, ratingDescriptions, getRatingColor, AuditAnswer } from '../types/audit';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw, Mail, Calendar, CircleDot, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { sendReportEmail } from '../services/emailService';
import { generatePDF } from '../utils/pdfGenerator';

interface ReportViewProps {
  report: AuditReport;
  onRestart: () => void;
  userEmail?: string;
  allAnswers?: AuditAnswer[];
}

const ReportView: React.FC<ReportViewProps> = ({ report, onRestart, userEmail, allAnswers }) => {
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();
  
  // Get pain point and tech readiness from answers
  const painPointAnswer = allAnswers?.find(a => a.questionId === 'general-1')?.value || '';
  const techReadinessAnswer = allAnswers?.find(a => a.questionId === 'general-2')?.value || '';
  
  // Generate personalized intro based on answers
  const getPersonalizedIntro = () => {
    let techReadinessLevel = "neutral";
    
    // Determine tech readiness level
    if (techReadinessAnswer.includes('Very resistant') || techReadinessAnswer.includes('Somewhat hesitant')) {
      techReadinessLevel = "cautious";
    } else if (techReadinessAnswer.includes('open') || techReadinessAnswer.includes('eager')) {
      techReadinessLevel = "enthusiastic";
    }
    
    // Create personalized message
    let intro = "";
    
    if (painPointAnswer) {
      intro += `Based on your feedback, we see that "${painPointAnswer}" is your primary operational challenge. `;
    }
    
    if (techReadinessLevel === "cautious") {
      intro += `We understand your team may need extra support with new technologies, so we've focused on solutions that offer excellent training resources and simple interfaces.`;
    } else if (techReadinessLevel === "enthusiastic") {
      intro += `Your team's enthusiasm for new technology is a strength! We've suggested cutting-edge tools that can significantly boost your efficiency.`;
    } else {
      intro += `We've tailored our recommendations to match your team's comfort level with technology while addressing your workflow needs.`;
    }
    
    return intro || "Based on your responses, we've prepared a customized workflow assessment for your business.";
  };
  
  const handleDownload = () => {
    // Create a formatted report for download
    const reportContent = `
      Nomadic Liberty LLC - Workflow AI Audit Results
      -------------------------
      Overall Rating: ${report.overallRating} (${report.overallScore}/100)
      Estimated Weekly Time Savings: ${report.totalTimeSavings}
      
      Category Assessments:
      ${report.categories.map(category => `
        * ${categoryLabels[category.category]}: ${category.rating} (${category.score}/100)
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
  
  const handleBookCall = () => {
    // In a real app, this would open the booking calendar
    window.open('https://calendly.com/workflow-ai/discovery', '_blank');
    
    toast({
      title: "Opening booking calendar",
      description: "You'll be able to schedule a free 20-minute AI consultation call.",
    });
  };
  
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    
    try {
      // Send email using emailService
      const success = await sendReportEmail({
        userEmail: emailInput,
        report: report,
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
  
  // Helper function to render automation level dots
  const renderAutomationDots = (score: number) => {
    const totalDots = 5;
    const filledDots = Math.round((score / 100) * totalDots);
    
    return (
      <div className="flex space-x-1">
        {[...Array(totalDots)].map((_, i) => (
          <CircleDot 
            key={i} 
            className={`h-4 w-4 ${i < filledDots ? 'text-workflow-purpleDark' : 'text-gray-300'}`} 
            fill={i < filledDots ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };
  
  // Helper component for rendering category assessment
  const CategoryCard: React.FC<{ assessment: CategoryAssessment }> = ({ assessment }) => {
    const categoryName = categoryLabels[assessment.category];
    const ratingClass = getRatingColor(assessment.rating);
    
    return (
      <Card className="mb-6 border border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{categoryName}</h3>
            <Badge className={`${ratingClass} font-medium py-1 px-3 border`}>
              {assessment.rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Automation Level:</div>
              {renderAutomationDots(assessment.score)}
            </div>
            <Progress value={assessment.score} className="h-2.5 bg-workflow-lightGray" />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">Manual</div>
              <div className="text-sm font-medium">{assessment.score}/100</div>
              <div className="text-xs text-gray-500">Automated</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Estimated Time Savings:</h4>
            <p className="text-green-600 font-medium">{assessment.timeSavings}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Recommended Tools:</h4>
            <div className="flex flex-wrap gap-2">
              {assessment.tools.map((tool, index) => (
                <Badge key={index} variant="outline" className="bg-workflow-blue bg-opacity-20">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Suggested Improvements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {assessment.improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700">{improvement}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Workflow Audit Results</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your responses, we've identified specific areas where AI and automation can help improve your business operations.
        </p>
      </div>
      
      {/* Personalized Summary */}
      <Card className="mb-8 border border-workflow-blue bg-workflow-blue bg-opacity-10">
        <CardContent className="pt-6 pb-6">
          <h3 className="text-xl font-semibold mb-2">Personalized Assessment</h3>
          <p className="text-gray-700">{getPersonalizedIntro()}</p>
        </CardContent>
      </Card>
      
      {/* Overall Summary Card */}
      <Card className="mb-8 border-2 border-workflow-purpleDark">
        <CardHeader className="bg-workflow-purple bg-opacity-30">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Overall Assessment</h2>
            <Badge className={`${getRatingColor(report.overallRating)} font-medium py-1.5 px-3 text-lg border`}>
              {report.overallRating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Automation Level:</div>
              {renderAutomationDots(report.overallScore)}
            </div>
            <Progress
              value={report.overallScore}
              className="h-3 bg-workflow-lightGray"
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">Manual</div>
              <div className="text-sm font-medium">{report.overallScore}/100</div>
              <div className="text-xs text-gray-500">Automated</div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{ratingDescriptions[report.overallRating]}</p>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Estimated Time Savings</h3>
            <p className="text-green-700 font-bold text-xl">{report.totalTimeSavings}</p>
            <p className="text-green-600 text-sm mt-1">
              by implementing the recommended automation solutions
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Top Recommendations</h3>
            <ul className="space-y-3">
              {report.topRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-workflow-purpleDark text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Book a Call Button */}
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
      
      {/* Detailed Category Results */}
      <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>
      
      <Tabs defaultValue={report.categories[0].category}>
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {report.categories.map((category) => (
            <TabsTrigger key={category.category} value={category.category}>
              {categoryLabels[category.category]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {report.categories.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <CategoryCard assessment={category} />
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Export Options */}
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
      
      {/* Call to Action */}
      <div className="mt-10 text-center bg-workflow-purpleDark bg-opacity-10 p-6 rounded-lg border border-workflow-purpleDark">
        <h3 className="text-xl font-semibold mb-3">Ready to transform your workflow?</h3>
        <p className="text-gray-700 mb-5">
          Book a free 20-minute AI consultation call to discuss how we can help implement these recommendations.
        </p>
        <Button 
          onClick={handleBookCall}
          size="lg"
          className="bg-workflow-purpleDark hover:bg-purple-700"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Your Free Consultation
        </Button>
      </div>
      
      {/* Restart Button */}
      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onRestart} className="text-gray-600">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Audit
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Nomadic Liberty LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ReportView;
