import type { 
  Task, 
  PaginatedResponse, 
  TaskSearchParams, 
  TaskFormData,
  TaskReorderRequest,
  TaskOrderUpdateRequest 
} from '../../types';

/**
 * Interface for task data operations
 * This abstraction allows swapping between mock and real implementations
 */
export interface ITaskService {
  /**
   * Search tasks with pagination and filtering
   */
  searchTasks(params: TaskSearchParams): Promise<PaginatedResponse<Task>>;
  
  /**
   * Get a task by ID
   */
  getTaskById(id: number): Promise<Task | null>;
  
  /**
   * Create a new task
   */
  createTask(taskData: TaskFormData): Promise<Task>;
  
  /**
   * Update an existing task
   */
  updateTask(id: number, taskData: TaskFormData): Promise<Task>;
  
  /**
   * Delete a task
   */
  deleteTask(id: number): Promise<void>;

  /**
   * Reorder a task to a new position within its parent/project
   * Uses gap-based strategy to avoid cascading updates
   */
  reorderTask(request: TaskReorderRequest): Promise<Task>;

  /**
   * Update task order directly (for advanced scenarios)
   */
  updateTaskOrder(request: TaskOrderUpdateRequest): Promise<Task>;
}
