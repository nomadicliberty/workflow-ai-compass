
// Environment configuration for deployment readiness
export const ENV_CONFIG = {
  // API Base URL - defaults to production, can be overridden for development
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://workflow-ai-audit.onrender.com',
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Feature flags (can be controlled via environment variables)
  FEATURES: {
    AI_GENERATION: import.meta.env.VITE_ENABLE_AI_GENERATION !== 'false', // Default enabled
    EMAIL_NOTIFICATIONS: import.meta.env.VITE_ENABLE_EMAIL !== 'false', // Default enabled
    PDF_GENERATION: import.meta.env.VITE_ENABLE_PDF !== 'false', // Default enabled
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true', // Default disabled
  },
  
  // External service URLs
  BOOKING_URL: import.meta.env.VITE_BOOKING_URL || 'https://calendar.app.google/fDRgarRXA42zzqEo8',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'jason@nomadicliberty.com',
} as const;

// Validate critical environment variables at startup
export const validateEnvironment = (): void => {
  const requiredVars = [];
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0 && ENV_CONFIG.IS_PRODUCTION) {
    console.warn(`Missing environment variables in production: ${missingVars.join(', ')}`);
  }
};

// Call validation on module load
validateEnvironment();
