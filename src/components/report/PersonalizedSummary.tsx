
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalizedSummaryProps {
  painPointAnswer: string;
  techReadinessAnswer: string;
}

const PersonalizedSummary: React.FC<PersonalizedSummaryProps> = ({ painPointAnswer, techReadinessAnswer }) => {
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

  return (
    <Card className="mb-8 border border-workflow-blue bg-workflow-blue bg-opacity-10">
      <CardContent className="pt-6 pb-6">
        <h3 className="text-xl font-semibold mb-2">Personalized Assessment</h3>
        <p className="text-gray-700">{getPersonalizedIntro()}</p>
      </CardContent>
    </Card>
  );
};

export default PersonalizedSummary;
