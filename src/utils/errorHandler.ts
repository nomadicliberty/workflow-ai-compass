
import { toast } from '@/hooks/use-toast';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  timestamp: Date;
}

export class ErrorHandler {
  private static logError(error: AppError): void {
    // Only log in development - removed console.log for production
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.code}] ${error.message}`, {
        timestamp: error.timestamp,
        userMessage: error.userMessage
      });
    }
  }

  static handleApiError(error: unknown, context: string): AppError {
    const appError: AppError = {
      code: `API_ERROR_${context.toUpperCase()}`,
      message: error instanceof Error ? error.message : 'Unknown API error',
      userMessage: 'We encountered an issue processing your request. Please try again.',
      timestamp: new Date()
    };

    this.logError(appError);
    this.showUserError(appError.userMessage);
    return appError;
  }

  static handleValidationError(field: string, message: string): AppError {
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: `Validation failed for ${field}: ${message}`,
      userMessage: message,
      timestamp: new Date()
    };

    this.logError(appError);
    this.showUserError(appError.userMessage);
    return appError;
  }

  static handleNetworkError(): AppError {
    const appError: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Network request failed',
      userMessage: 'Unable to connect to our servers. Please check your internet connection and try again.',
      timestamp: new Date()
    };

    this.logError(appError);
    this.showUserError(appError.userMessage);
    return appError;
  }

  static handleTimeoutError(operation: string): AppError {
    const appError: AppError = {
      code: 'TIMEOUT_ERROR',
      message: `Timeout during ${operation}`,
      userMessage: `The ${operation} is taking longer than expected. Please try again.`,
      timestamp: new Date()
    };

    this.logError(appError);
    this.showUserError(appError.userMessage);
    return appError;
  }

  private static showUserError(message: string): void {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleApiError(error, context);
      return null;
    }
  }

  // Enhanced retry logic with exponential backoff
  static async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T | null> {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on validation errors or client errors (4xx)
        if (error instanceof Error && error.message.includes('400')) {
          this.handleApiError(error, context);
          return null;
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    this.handleApiError(lastError, context);
    return null;
  }

  // Silent error logging for non-critical errors
  static logSilentError(error: Error, context: string): void {
    const appError: AppError = {
      code: context.toUpperCase(),
      message: error.message,
      userMessage: '',
      timestamp: new Date()
    };
    this.logError(appError);
  }
}
