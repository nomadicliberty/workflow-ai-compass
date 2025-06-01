
import React from 'react';
import { BaseRenderer } from './BaseRenderer';
import { ReportSection } from '../types/reportData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CircleDot, Sparkles, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export class ReactRenderer extends BaseRenderer {
  renderHeader(section: ReportSection): React.ReactElement {
    return (
      <div key={section.id} className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-nomadic-navy">{section.content.title}</h1>
        <p className="text-nomadic-gray max-w-2xl mx-auto">
          {section.content.subtitle}
        </p>
      </div>
    );
  }

  renderSummary(section: ReportSection): React.ReactElement {
    if (section.content.isAI) {
      return (
        <Card key={section.id} className="mb-8 border-2 border-nomadic-teal bg-gradient-to-br from-nomadic-beige to-nomadic-lightBlue">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-nomadic-teal" />
              <h2 className="text-2xl font-semibold text-nomadic-navy">
                {section.title}
              </h2>
            </div>
            <p className="text-sm text-nomadic-gray mt-2 italic">
              {section.content.disclaimer}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <div 
                className="text-nomadic-gray leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: section.content.text.replace(/\n/g, '<br>') }}
              />
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card key={section.id} className="mb-8 border border-workflow-blue bg-workflow-blue bg-opacity-10">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <p className="text-gray-700">{section.content.text}</p>
          </CardContent>
        </Card>
      );
    }
  }

  renderMetrics(section: ReportSection): React.ReactElement {
    const { rating, score, timeSavings, recommendations, ratingDescription } = section.content;
    
    const renderAutomationDots = (score: number) => {
      const totalDots = 5;
      const filledDots = Math.round((score / 100) * totalDots);
      
      return (
        <div className="flex space-x-1">
          {[...Array(totalDots)].map((_, i) => (
            <CircleDot 
              key={i} 
              className={`h-4 w-4 ${i < filledDots ? 'text-nomadic-teal' : 'text-nomadic-taupe'}`} 
              fill={i < filledDots ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      );
    };

    return (
      <Card key={section.id} className="mb-8 border-2 border-nomadic-teal bg-nomadic-beige">
        <CardHeader className="bg-nomadic-navy text-nomadic-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <Badge className="bg-nomadic-teal text-nomadic-white font-medium py-1.5 px-3 text-lg border-0">
              {rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-nomadic-taupe">Automation Level:</div>
              {renderAutomationDots(score)}
            </div>
            <Progress
              value={score}
              className="h-3 bg-nomadic-beige border border-nomadic-taupe"
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-nomadic-taupe">Manual</div>
              <div className="text-sm font-medium text-nomadic-gray">{score}/100</div>
              <div className="text-xs text-nomadic-taupe">Automated</div>
            </div>
          </div>
          
          <p className="text-nomadic-gray mb-4">{ratingDescription}</p>
          
          <div className="bg-nomadic-lightBlue border-2 border-nomadic-teal rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-nomadic-navy mb-2">Estimated Time Savings</h3>
            <p className="text-nomadic-teal font-bold text-xl">{timeSavings}</p>
            <p className="text-nomadic-gray text-sm mt-1">
              by implementing the recommended automation solutions
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-nomadic-navy">Top Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-nomadic-teal text-nomadic-white rounded-full w-6 h-6 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-nomadic-gray">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  renderCategory(section: ReportSection): React.ReactElement {
    // For React, we'll render all categories in tabs
    return null; // Will be handled specially in combineRenderedSections
  }

  renderCTA(section: ReportSection): React.ReactElement {
    return (
      <div key={section.id} className="text-center mb-8 p-8 bg-nomadic-lightBlue border-2 border-nomadic-teal rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-nomadic-navy">{section.content.title}</h2>
        <p className="text-nomadic-gray mb-6">{section.content.subtitle}</p>
        <Button asChild className="bg-nomadic-teal hover:bg-nomadic-navy text-white px-8 py-3 text-lg">
          <a href={section.content.link} target="_blank" rel="noopener noreferrer">
            {section.content.linkText}
          </a>
        </Button>
      </div>
    );
  }

  renderFooter(section: ReportSection): React.ReactElement {
    return (
      <div key={section.id} className="mt-8 text-center">
        <p className="text-xs text-nomadic-taupe mt-4">
          © {section.content.year} {section.content.companyName}. All rights reserved.
        </p>
      </div>
    );
  }

  protected combineRenderedSections(sections: any[]): React.ReactElement {
    // Filter out category sections for special handling
    const nonCategorySections = sections.filter(Boolean);
    const categorySections = this.report.sections.filter(s => s.type === 'category');

    // Find where to insert categories (after metrics)
    const metricsIndex = nonCategorySections.findIndex(section => 
      section.key === 'overall-metrics'
    );

    // Render categories as tabs
    const categoryTabs = categorySections.length > 0 ? (
      <div key="categories" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>
        <Tabs defaultValue={categorySections[0].content.category}>
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categorySections.map((section) => (
              <TabsTrigger key={section.content.category} value={section.content.category}>
                {section.content.categoryName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categorySections.map((section) => (
            <TabsContent key={section.content.category} value={section.content.category}>
              {this.renderSingleCategory(section)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    ) : null;

    // Insert category tabs after metrics
    const finalSections = [...nonCategorySections];
    if (categoryTabs && metricsIndex >= 0) {
      finalSections.splice(metricsIndex + 1, 0, categoryTabs);
    }

    return <div className="animate-fade-in">{finalSections}</div>;
  }

  private renderSingleCategory(section: ReportSection): React.ReactElement {
    const { categoryName, rating, score, tools, improvements, timeSavings } = section.content;
    
    const getRatingColor = (rating: string): string => {
      switch (rating) {
        case 'Manual':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Partially Automated':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Fully Automated':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

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
            <Badge className={`${getRatingColor(rating)} font-medium py-1 px-3 border`}>
              {rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Automation Level:</div>
              {renderAutomationDots(score)}
            </div>
            <Progress value={score} className="h-2.5 bg-workflow-lightGray" />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">Manual</div>
              <div className="text-sm font-medium">{score}/100</div>
              <div className="text-xs text-gray-500">Automated</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Estimated Time Savings:</h4>
            <p className="text-green-600 font-medium">{timeSavings}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Recommended Tools:</h4>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <Badge key={index} variant="outline" className="bg-workflow-blue bg-opacity-20">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Suggested Improvements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700">{improvement}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }
}
