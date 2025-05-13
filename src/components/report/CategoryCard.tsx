
import React from 'react';
import { CategoryAssessment, categoryLabels, getRatingColor } from '../../types/audit';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CategoryCardProps {
  assessment: CategoryAssessment;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ assessment }) => {
  const categoryName = categoryLabels[assessment.category];
  const ratingClass = getRatingColor(assessment.rating);
  
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

export default CategoryCard;
