import type { ITaskService } from '../interfaces/ITaskService';
import type { 
  Task, 
  PaginatedResponse, 
  TaskSearchParams, 
  TaskFormData,
  TaskReorderRequest,
  TaskOrderUpdateRequest 
} from '../../types';
import { MockDataService } from '../../utils/mockDataService';
import { logServiceOperation } from '../serviceLogger';

/**
 * Mock implementation of ITaskService
 * Uses MockDataService internally but provides a clean interface
 * that can be swapped with real implementations later
 */
export class MockTaskService implements ITaskService {
  async searchTasks(params: TaskSearchParams): Promise<PaginatedResponse<Task>> {
    logServiceOperation('task', 'SEARCH_TASKS', params);
    const result = await MockDataService.searchTasks(params);
    logServiceOperation('task', 'SEARCH_TASKS_RESULT', params, result.data);
    return result;
  }

  async getTaskById(id: number): Promise<Task | null> {
    logServiceOperation('task', 'GET_TASK_BY_ID', { id });
    // This method needs to be added to MockDataService
    const tasks = await MockDataService.searchTasks({
      pageNumber: 1,
      pageSize: 1000
    });
    
    const result = tasks.data.find(task => task.id === id) || null;
    logServiceOperation('task', 'GET_TASK_BY_ID_RESULT', { id }, result);
    return result;
  }

  async createTask(taskData: TaskFormData): Promise<Task> {
    logServiceOperation('task', 'CREATE_TASK', taskData);
    const result = await MockDataService.createTask(taskData);
    logServiceOperation('task', 'CREATE_TASK_RESULT', taskData, result);
    return result;
  }

  async updateTask(id: number, taskData: TaskFormData): Promise<Task> {
    logServiceOperation('task', 'UPDATE_TASK', { id, ...taskData });
    const result = await MockDataService.updateTask(id, taskData);
    logServiceOperation('task', 'UPDATE_TASK_RESULT', { id, ...taskData }, result);
    return result;
  }

  async deleteTask(id: number): Promise<void> {
    logServiceOperation('task', 'DELETE_TASK', { id });
    await MockDataService.deleteTask(id);
    logServiceOperation('task', 'DELETE_TASK_RESULT', { id }, 'deleted');
  }

  async reorderTask(request: TaskReorderRequest): Promise<Task> {
    logServiceOperation('task', 'REORDER_TASK', request);
    const result = await MockDataService.reorderTask(request);
    logServiceOperation('task', 'REORDER_TASK_RESULT', request, result);
    return result;
  }

  async updateTaskOrder(request: TaskOrderUpdateRequest): Promise<Task> {
    logServiceOperation('task', 'UPDATE_TASK_ORDER', request);
    const result = await MockDataService.updateTaskOrder(request);
    logServiceOperation('task', 'UPDATE_TASK_ORDER_RESULT', request, result);
    return result;
  }
}
