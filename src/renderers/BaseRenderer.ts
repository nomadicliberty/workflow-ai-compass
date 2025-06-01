
import { FormattedReport, ReportSection } from '../types/reportData';

export abstract class BaseRenderer {
  protected report: FormattedReport;

  constructor(report: FormattedReport) {
    this.report = report;
  }

  abstract renderHeader(section: ReportSection): any;
  abstract renderSummary(section: ReportSection): any;
  abstract renderMetrics(section: ReportSection): any;
  abstract renderCategory(section: ReportSection): any;
  abstract renderCTA(section: ReportSection): any;
  abstract renderFooter(section: ReportSection): any;

  render(): any {
    const renderedSections = this.report.sections.map(section => {
      switch (section.type) {
        case 'header':
          return this.renderHeader(section);
        case 'summary':
          return this.renderSummary(section);
        case 'metrics':
          return this.renderMetrics(section);
        case 'category':
          return this.renderCategory(section);
        case 'cta':
          return this.renderCTA(section);
        case 'footer':
          return this.renderFooter(section);
        default:
          return null;
      }
    }).filter(Boolean);

    return this.combineRenderedSections(renderedSections);
  }

  protected abstract combineRenderedSections(sections: any[]): any;
}
