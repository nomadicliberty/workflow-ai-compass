
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
}
