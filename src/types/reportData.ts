
export interface ReportSection {
  id: string;
  title?: string;
  content: any;
  type: 'header' | 'summary' | 'metrics' | 'category' | 'cta' | 'footer';
  data?: any;
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export interface FormattedReport {
  sections: ReportSection[];
  metadata: {
    userEmail?: string;
    userName?: string;
    painPoint?: string;
    techReadiness?: string;
    generatedDate: Date;
    overallScore: number;
    overallRating: string;
    totalTimeSavings: string;
  };
}

export interface CategoryData {
  category: string;
  categoryName: string;
  rating: string;
  score: number;
  tools: string[];
  improvements: string[];
  timeSavings: string;
}
