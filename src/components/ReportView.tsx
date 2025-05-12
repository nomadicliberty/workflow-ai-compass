
import React, { useState } from 'react';
import { AuditReport, CategoryAssessment, categoryLabels, ratingDescriptions, getRatingColor } from '../types/audit';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportViewProps {
  report: AuditReport;
  onRestart: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onRestart }) => {
  const [emailInput, setEmailInput] = useState('');
  const { toast } = useToast();
  
  const handleDownload = () => {
    // Create a formatted report for download
    const reportContent = `
      Workflow AI Audit Results
      -------------------------
      Overall Rating: ${report.overallRating} (${report.overallScore}/100)
      
      Category Assessments:
      ${report.categories.map(category => `
        * ${categoryLabels[category.category]}: ${category.rating} (${category.score}/100)
          Recommended Tools: ${category.tools.join(', ')}
          Suggested Improvements:
          ${category.improvements.map(imp => `- ${imp}`).join('\n          ')}
      `).join('\n      ')}
      
      Top Recommendations:
      ${report.topRecommendations.map((rec, i) => `${i+1}. ${rec}`).join('\n      ')}
    `;
    
    // Create a download link
    const element = document.createElement("a");
    const file = new Blob([reportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "workflow_ai_audit_report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Report downloaded!",
      description: "Your audit report has been downloaded as a text file.",
    });
  };
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would connect to an email service
    toast({
      title: "Report sent!",
      description: `Your audit report has been sent to ${emailInput}`,
    });
    setEmailInput('');
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
            <div className="w-full bg-workflow-lightGray rounded-full h-2.5">
              <div 
                className="bg-workflow-purpleDark h-2.5 rounded-full"
                style={{ width: `${assessment.score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{assessment.score}/100</p>
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
            <div className="w-full bg-workflow-lightGray rounded-full h-3">
              <div 
                className="bg-workflow-purpleDark h-3 rounded-full transition-all duration-500"
                style={{ width: `${report.overallScore}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{report.overallScore}/100</p>
          </div>
          
          <p className="text-gray-700 mb-4">{ratingDescriptions[report.overallRating]}</p>
          
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
      
      {/* Detailed Category Results */}
      <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>
      
      <Tabs defaultValue={report.categories[0].category}>
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5">
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
          
          <form onSubmit={handleSendEmail} className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-workflow-purpleDark"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <Button type="submit">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </form>
        </div>
      </div>
      
      {/* Restart Button */}
      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onRestart} className="text-gray-600">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Audit
        </Button>
      </div>
    </div>
  );
};

export default ReportView;
