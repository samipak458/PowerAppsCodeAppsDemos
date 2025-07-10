// Common types for the ProjectHub application

export interface Client extends Record<string, unknown> {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  industry?: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  createdDate: string;
  lastModified?: string;
  projectCount?: number;
  createdAt?: string; // For compatibility with existing code
}

export interface Project extends Record<string, unknown> {
  id: number;
  name: string;
  description?: string;
  clientId: number;
  clientName?: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
  progress: number;
  createdDate: string;
  lastModified?: string;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface Task extends Record<string, unknown> {
  id: number;
  title?: string;
  description?: string;
  projectId: number;
  projectName?: string;
  parentTaskId?: number;
  predecessorIds?: number[]; // Added for task dependencies
  assignedTo?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  taskOrder?: number; // Controls sort order within project/parent task
  createdDate: string;
  lastModified?: string;
  level?: number; // For hierarchy display
  hasChildren?: boolean;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  pageNumber: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface ClientSearchParams extends SearchParams {
  status?: string;
  companyFilter?: string;
}

export interface ProjectSearchParams extends SearchParams {
  clientId?: number;
  status?: string;
  priority?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface TaskSearchParams extends SearchParams {
  projectId?: number;
  assignedTo?: string;
  status?: string;
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  includeCompleted?: boolean;
}

// Form data types
export interface ClientFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  industry?: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
}

export interface ProjectFormData {
  name: string;
  description?: string;
  clientId: number;
  clientName?: string; // Added for client lookup usage
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  budget?: number;
}

export interface TaskFormData {
  title?: string;
  description?: string;
  projectId?: number;
  parentTaskId?: number;
  predecessorIds?: number[]; // Added for task dependencies
  assignedTo?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  progress?: number; // Progress percentage (0-100)
  taskOrder?: number; // Optional - will be auto-calculated if not provided
}

// Task reordering types
export interface TaskReorderRequest {
  taskId: number;
  newPosition: number; // 0-based position within the parent/project
  parentTaskId?: number; // null for root tasks
  projectId: number;
}

export interface TaskOrderUpdateRequest {
  taskId: number;
  newTaskOrder: number;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Navigation and breadcrumb types
export interface BreadcrumbItem {
  path: string;
  label: string;
  isActive?: boolean;
}

// Common enums
export const ClientStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
} as const;

export const ProjectStatus = {
  Planning: 'Planning',
  InProgress: 'In Progress',
  OnHold: 'On Hold',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
} as const;

export const TaskStatus = {
  NotStarted: 'Not Started',
  InProgress: 'In Progress',
  Completed: 'Completed',
  OnHold: 'On Hold',
  Cancelled: 'Cancelled',
} as const;

export const Priority = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
} as const;
