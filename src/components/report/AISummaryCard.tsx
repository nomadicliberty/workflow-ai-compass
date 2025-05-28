
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface AISummaryCardProps {
  aiSummary: string;
}

const AISummaryCard: React.FC<AISummaryCardProps> = ({ aiSummary }) => {
  return (
    <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">
            AI-Powered Analysis
          </h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Personalized
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-gray max-w-none">
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br>') }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AISummaryCard;
