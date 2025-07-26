# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start frontend development server (runs on port 8080)
- `vercel dev` - Start Vercel development server for API functions (runs on port 3000)
- `npm run build` - Build for production 
- `npm run build:dev` - Build for development mode
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Development Setup
For full local development with API functionality:
1. **Terminal 1**: Run `vercel dev` (starts API functions on localhost:3000)
2. **Terminal 2**: Run `npm run dev` (starts frontend on localhost:8080)
3. Frontend automatically proxies `/api/*` requests to the Vercel dev server

**Environment Variables**: Create `.env.local` file with `OPENAI_API_KEY` for AI functionality

### Testing
This project does not currently have a test suite configured. Any testing setup would need to be added.

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Tailwind CSS
- **State Management**: React hooks + TanStack Query
- **Routing**: React Router v6
- **PDF Generation**: jsPDF + jsPDF-autotable
- **Backend API**: Vercel serverless functions

### Project Structure

This is a workflow automation audit tool that helps small businesses assess their current automation level and provides AI-generated recommendations for improvement.

#### Core Application Flow
1. **Welcome Screen** - Introduction and audit start
2. **Audit Wizard** - Multi-step questionnaire covering different workflow categories
3. **Email Collection** - User contact information for report delivery
4. **AI Report Generation** - Server-side OpenAI integration for personalized recommendations
5. **Report View** - Interactive report with export capabilities (PDF/Email)

#### Key Domain Models
Located in `src/types/`:
- `AuditQuestion` - Individual questionnaire items with categories and types
- `AuditAnswer` - User responses to questions
- `CategoryAssessment` - Evaluation results per workflow category
- `AuditReport` - Complete audit results with AI-generated insights
- `WorkflowCategory` - Business process categories (task-management, customer-communication, etc.)
- `RatingLevel` - Automation maturity levels (Manual, Partially Automated, Fully Automated)

#### Workflow Categories
The audit evaluates businesses across these workflow areas:
- Task Management
- Customer Communication  
- Data Entry
- Scheduling
- Reporting
- General Business Operations

#### Component Architecture
- `src/components/AuditWizard.tsx` - Main orchestrator component managing wizard state
- `src/components/WelcomeScreen.tsx` - Landing page and audit introduction
- `src/components/wizard/WizardContent.tsx` - Question presentation and navigation
- `src/components/QuestionCard.tsx` - Individual question rendering with multiple input types
- `src/components/ReportView.tsx` - Final report display with export functionality
- `src/components/ui/` - Reusable UI components based on shadcn/ui

#### State Management Pattern
- **Custom Hooks**: `useWizardState.ts` and `useReportGeneration.ts` manage complex state
- **Wizard State**: Current step, answers collection, navigation logic
- **Report State**: AI generation status, final report data, export functionality
- **Optimized State**: `useOptimizedState.ts` provides performance-optimized state updates

#### Data Services
- `src/services/aiReportService.ts` - API integration for AI-powered report generation
- `src/services/emailService.ts` - Email delivery service for reports
- `src/services/ReportBuilder.ts` - Report data assembly and formatting
- `src/utils/reportGenerator.ts` - Scoring logic and assessment calculations
- `src/utils/pdfGenerator.ts` - PDF export functionality

#### API Integration
- **Vercel Functions**: Located in `/api/` directory
- `api/generateAiSummary.js` - OpenAI integration for personalized recommendations
- `api/send-report.js` - Email delivery service
- CORS-enabled for cross-origin requests

### Key Development Patterns

#### Path Aliases
- `@/` maps to `src/` directory for clean imports

#### TypeScript Configuration
- Standard React + TypeScript setup with Vite
- ESLint configuration with React hooks and refresh plugins
- Unused variables warnings disabled for development convenience

#### Component Patterns
- Heavy use of shadcn/ui components for consistent UI
- React Hook Form integration for form handling
- Error boundaries for graceful error handling
- Toast notifications for user feedback

#### Data Flow Architecture
1. **Question Definition**: Static question data in `src/data/questions.ts`
2. **Answer Collection**: User responses stored in wizard state
3. **Score Calculation**: Local scoring algorithms generate category assessments
4. **AI Enhancement**: Server-side OpenAI API adds personalized insights
5. **Report Generation**: Combined local + AI data creates final report
6. **Export Options**: PDF generation and email delivery

#### Error Handling
- Global error boundary in App.tsx with user-friendly fallback UI
- Centralized error handling in `src/utils/errorHandler.ts`
- Input validation and sanitization in `src/utils/validation.ts`
- Retry logic for API calls with exponential backoff

### Deployment Architecture
- **Platform**: Vercel for both frontend and serverless functions
- **Build Configuration**: Vite handles React app bundling
- **API Routes**: Node.js serverless functions for backend logic
- **Environment Variables**: API keys and configuration managed through Vercel

### Current Development Status
- Core audit wizard functionality complete
- AI report generation integrated
- PDF export working
- Email delivery functional
- Mobile-responsive design implemented
- Error handling and validation in place

### Development Workflow
This project integrates with Lovable.dev for collaborative development:
- Changes made via Lovable are automatically committed to the repository
- Local development supported with standard npm commands
- Vercel handles automatic deployments from git commits

### Production Deployment
**Critical**: Use minimal or empty `vercel.json` configuration. Vercel's auto-detection works best.
- ❌ **Avoid**: Custom `builds` configuration (deprecated and breaks API function deployment)
- ✅ **Use**: Empty `{}` or no `vercel.json` file
- API functions in `/api/` folder are automatically detected and deployed

### Security Features
- **Rate limiting**: 10 AI requests, 5 email requests per 15 minutes per IP
- **Input validation**: XSS protection, length limits, type checking on all user inputs
- **CORS protection**: Restricted to specific domains (`audit.nomadicliberty.com`, localhost)
- **Request size limits**: 10KB for AI, 50KB for email endpoints
- **Privacy compliance**: No user PII logged in production
- **Fallback system**: Generates reports even when AI service fails

### Known Issues & Solutions
- **PDF formatting**: Screen and email reports work perfectly; PDF has minor styling issues (acceptable for MVP)
- **API 404 errors**: Always caused by incorrect `vercel.json` configuration blocking function deployment