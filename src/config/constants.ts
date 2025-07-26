
import { WorkflowCategory, RatingLevel } from '../types/audit';

// API Configuration
export const API_CONFIG = {
  BASE_URL: '', // Use relative URLs - works with Vite proxy in dev
  ENDPOINTS: {
    SEND_REPORT: '/api/send-report',
    GENERATE_AI_SUMMARY: '/api/generateAiSummary'
  },
  TIMEOUTS: {
    AI_GENERATION: 60000, // 60 seconds
    EMAIL_SEND: 30000,    // 30 seconds
  }
} as const;

// Category Display Names (centralized)
export const CATEGORY_NAMES: Record<WorkflowCategory, string> = {
  'task-management': 'Task Management',
  'customer-communication': 'Customer Communication',
  'data-entry': 'Data Entry',
  'scheduling': 'Scheduling',
  'reporting': 'Reporting',
  'general': 'General Business Operations'
} as const;

// Rating CSS Classes (centralized)
export const RATING_STYLES: Record<RatingLevel, string> = {
  'Manual': 'bg-orange-100 text-orange-800 border-orange-200',
  'Partially Automated': 'bg-blue-100 text-blue-800 border-blue-200',
  'Fully Automated': 'bg-green-100 text-green-800 border-green-200'
} as const;

// Email Template Styles
export const EMAIL_STYLES = {
  CONTAINER: 'max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;',
  HEADER: 'background-color: #1B365D; color: white; padding: 20px; text-align: center;',
  SECTION: 'margin-bottom: 30px; padding: 0 20px;',
  CATEGORY: 'margin-bottom: 20px; border-left: 4px solid #00A8A8; padding-left: 15px;',
  BUTTON: 'background-color: #00A8A8; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'
} as const;

// Business Logic Constants
export const SCORING = {
  MAX_SCORE: 100,
  DOTS_COUNT: 5,
  DEFAULT_SCORE: 0
} as const;

// Application Metadata
export const APP_META = {
  COMPANY_NAME: 'Nomadic Liberty LLC',
  REPORT_FILENAME: 'nomadic_liberty_workflow_audit_report.pdf',
  BOOKING_URL: 'https://calendar.app.google/fDRgarRXA42zzqEo8',
  SUPPORT_EMAIL: 'jason@nomadicliberty.com'
} as const;
