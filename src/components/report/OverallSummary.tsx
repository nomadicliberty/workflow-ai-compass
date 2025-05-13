
import React from 'react';
import { AuditReport, ratingDescriptions, getRatingColor } from '../../types/audit';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OverallSummaryProps {
  report: AuditReport;
}

const OverallSummary: React.FC<OverallSummaryProps> = ({ report }) => {
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

  return (
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
  );
};

export default OverallSummary;
