
import { AuditAnswer, WorkflowCategory } from '../types/audit';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAnswers = (answers: AuditAnswer[]): boolean => {
  return answers.length > 0 && answers.every(answer => 
    answer.questionId && 
    answer.value && 
    answer.category
  );
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateCategory = (category: string): category is WorkflowCategory => {
  const validCategories: WorkflowCategory[] = [
    'task-management',
    'customer-communication', 
    'data-entry',
    'scheduling',
    'reporting',
    'general'
  ];
  return validCategories.includes(category as WorkflowCategory);
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
