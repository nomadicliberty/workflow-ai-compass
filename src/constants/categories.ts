
import { WorkflowCategory } from '../types/audit';

export const categoryLabels: Record<WorkflowCategory, string> = {
  'task-management': 'Task Management',
  'customer-communication': 'Customer Communication',
  'data-entry': 'Data Entry',
  'scheduling': 'Scheduling',
  'reporting': 'Reporting',
  'general': 'General Business Operations'
};

export const getCategoryName = (category: WorkflowCategory): string => {
  return categoryLabels[category] || category;
};
