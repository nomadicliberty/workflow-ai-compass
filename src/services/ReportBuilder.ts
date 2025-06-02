import { AuditReport } from '../types/audit';
import { FormattedReport, ReportSection, CategoryData } from '../types/reportData';
import { getCategoryName } from '../constants/categories';

const generatePersonalizedIntro = (painPoint?: string, techReadiness?: string): string => {
  let personalizedIntro = "";
  
  if (painPoint || techReadiness) {
    if (painPoint) {
      personalizedIntro += `We understand that "${painPoint}" is your primary operational challenge. `;
    }
    
    if (techReadiness) {
      if (techReadiness.includes("very eager") || techReadiness.includes("open to")) {
        personalizedIntro += "Your team's enthusiasm for new technology positions you well to implement the suggested automation solutions.";
      } else if (techReadiness.includes("resistant") || techReadiness.includes("hesitant")) {
        personalizedIntro += "We've focused on solutions that are user-friendly and come with excellent support resources for teams that may need extra assistance with new technology.";
      } else {
        personalizedIntro += "Our recommendations are tailored to match your team's comfort level with technology adoption.";
      }
    }
  }
  
  return personalizedIntro || "Based on your responses, we've prepared a customized workflow assessment for your business.";
};

export const buildFormattedReport = (
  auditReport: AuditReport,
  userEmail?: string,
  userName?: string,
  painPoint?: string,
  techReadiness?: string
): FormattedReport => {
  const sections: ReportSection[] = [];

  sections.push({
    id: 'header',
    type: 'header',
    content: {
      title: 'Your Workflow Audit Results',
      subtitle: 'Personalized automation recommendations for your business',
      companyName: 'Nomadic Liberty LLC'
    }
  });

  if (auditReport.aiGeneratedSummary && auditReport.aiGeneratedSummary.trim().length > 0) {
    sections.push({
      id: 'ai-summary',
      type: 'summary',
      title: 'AI-Powered Assessment - Discussion Guide',
      content: {
        text: auditReport.aiGeneratedSummary,
        isAI: true,
        disclaimer: 'This analysis identifies common workflow patterns and provides general guidance. All recommendations should be explored together during our consultation.'
      }
    });
  } else {
    const personalizedIntro = generatePersonalizedIntro(painPoint, techReadiness);
    sections.push({
      id: 'personalized-summary',
      type: 'summary',
      title: 'Personalized Assessment',
      content: {
        text: personalizedIntro,
        isAI: false
      }
    });
  }

  sections.push({
    id: 'overall-metrics',
    type: 'metrics',
    title: 'Overall Assessment',
    content: {
      rating: auditReport.overallRating,
      score: auditReport.overallScore,
      timeSavings: auditReport.totalTimeSavings,
      recommendations: auditReport.topRecommendations,
      ratingDescription: getRatingDescription(auditReport.overallRating)
    }
  });

  auditReport.categories.forEach((category, index) => {
    const categoryData: CategoryData = {
      category: category.category,
      categoryName: getCategoryName(category.category),
      rating: category.rating,
      score: category.score,
      tools: category.tools,
      improvements: category.improvements,
      timeSavings: category.timeSavings
    };

    sections.push({
      id: `category-${index}`,
      type: 'category',
      title: categoryData.categoryName,
      content: categoryData
    });
  });

  sections.push({
    id: 'cta',
    type: 'cta',
    content: {
      title: 'Ready to transform your workflow?',
      subtitle: 'Schedule your free consultation today',
      link: 'https://calendar.app.google/fDRgarRXA42zzqEo8',
      linkText: 'Book a Free 20-Minute Consultation'
    }
  });

  sections.push({
    id: 'footer',
    type: 'footer',
    content: {
      companyName: 'Nomadic Liberty LLC',
      year: new Date().getFullYear(),
      disclaimer: 'This report was generated based on your inputs to the Workflow AI Audit tool.'
    }
  });

  return {
    sections,
    metadata: {
      userEmail,
      userName,
      painPoint,
      techReadiness,
      generatedDate: new Date(),
      overallScore: auditReport.overallScore,
      overallRating: auditReport.overallRating,
      totalTimeSavings: auditReport.totalTimeSavings
    }
  };
};

const getRatingDescription = (rating: string): string => {
  const descriptions: Record<string, string> = {
    'Manual': 'Processes are mostly done by hand with minimal technology assistance',
    'Partially Automated': 'Some technology and automation is in place, but with room for improvement',
    'Fully Automated': 'Processes are optimized with significant AI or automation technology'
  };
  return descriptions[rating] || '';
};
