
import { z } from 'zod';

// Email validation schema
export const emailSchema = z.string().email('Please enter a valid email address');

// Text input validation schema with XSS protection
export const textInputSchema = z.string()
  .min(1, 'This field is required')
  .max(500, 'Input too long')
  .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), 
    'Invalid characters detected');

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Validate text input
export const validateTextInput = (text: string): { isValid: boolean; error?: string } => {
  try {
    textInputSchema.parse(text);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid input' };
  }
};
