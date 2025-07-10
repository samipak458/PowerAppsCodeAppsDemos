import type { ITaskService } from '../interfaces/ITaskService';
import type { 
  Task, 
  PaginatedResponse, 
  TaskSearchParams, 
  TaskFormData,
  TaskReorderRequest,
  TaskOrderUpdateRequest 
} from '../../types';
import { logServiceOperation } from '../serviceLogger';

// Import the generated stored procedure services
import { projecthub_sp_SearchTasksService } from '../projecthub_sp_SearchTasksService';
import { projecthub_sp_GetTaskByIdService } from '../projecthub_sp_GetTaskByIdService';
import { projecthub_sp_CreateTaskService } from '../projecthub_sp_CreateTaskService';
import { projecthub_sp_UpdateTaskService } from '../projecthub_sp_UpdateTaskService';
import { projecthub_sp_DeleteTaskService } from '../projecthub_sp_DeleteTaskService';
import { projecthub_sp_ReorderTaskService } from '../projecthub_sp_ReorderTaskService';

/**
 * Real implementation of ITaskService using stored procedure services
 * This implementation uses the generated services from Power Apps Code Apps CLI
 */
export class SqlTaskService implements ITaskService {
  
  /**
   * Search tasks with pagination and filtering
   */
  async searchTasks(params: TaskSearchParams): Promise<PaginatedResponse<Task>> {
    logServiceOperation('task', 'SEARCH_TASKS', params);
    
    try {
      const result = await projecthub_sp_SearchTasksService.projecthub_sp_SearchTasks(
        params.assignedTo,
        params.dueDateFrom,
        params.dueDateTo,
        params.includeCompleted,
        params.pageNumber || 1,
        params.pageSize || 25,
        params.priority,
        params.projectId,
        params.searchTerm,
        params.sortColumn || 'Title',
        params.sortDirection || 'asc',
        params.status,
        0 // TotalRecords - output parameter
      );

      if (!result.success) {
        throw new Error(`Search tasks failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const tasksData = data?.ResultSets?.Table1;
      
      // Handle both array and single object responses
      let tasks: Task[] = [];
      if (Array.isArray(tasksData)) {
        tasks = tasksData.map(this.mapToTask);
      } else if (tasksData) {
        tasks = [this.mapToTask(tasksData)];
      }
      
      const totalRecords = data?.outputparameters?.TotalRecords || tasks.length;
      
      const response: PaginatedResponse<Task> = {
        data: tasks,
        totalRecords,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 25,
        totalPages: Math.ceil(totalRecords / (params.pageSize || 25))
      };

      logServiceOperation('task', 'SEARCH_TASKS_RESULT', params, response);
      return response;
    } catch (error) {
      logServiceOperation('task', 'SEARCH_TASKS_ERROR', params, error);
      throw error;
    }
  }

  /**
   * Get a task by ID
   */
  async getTaskById(id: number): Promise<Task | null> {
    logServiceOperation('task', 'GET_TASK_BY_ID', { id });
    
    try {
      const result = await projecthub_sp_GetTaskByIdService.projecthub_sp_GetTaskById(id);

      if (!result.success) {
        throw new Error(`Get task by ID failed: ${result.error?.message || 'Unknown error'}`);
      }

      const taskData = result.data?.ResultSets?.Table1?.[0];
      const task = taskData ? this.mapToTask(taskData) : null;

      logServiceOperation('task', 'GET_TASK_BY_ID_RESULT', { id }, task);
      return task;
    } catch (error) {
      logServiceOperation('task', 'GET_TASK_BY_ID_ERROR', { id }, error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: TaskFormData): Promise<Task> {
    logServiceOperation('task', 'CREATE_TASK', taskData);
    
    try {
      const result = await projecthub_sp_CreateTaskService.projecthub_sp_CreateTask(
        taskData.assignedTo,
        taskData.description,
        taskData.dueDate,
        taskData.endDate,
        taskData.estimatedHours,
        taskData.parentTaskId,
        taskData.predecessorIds?.join(','), // Convert array to comma-separated string
        taskData.priority,
        taskData.progress || 0,
        taskData.projectId,
        taskData.startDate,
        taskData.status,
        taskData.taskOrder,
        taskData.title
      );

      if (!result.success) {
        throw new Error(`Create task failed: ${result.error?.message || 'Unknown error'}`);
      }

      const createdTaskData = result.data?.ResultSets?.Table1?.[0];
      if (!createdTaskData) {
        throw new Error('Created task data not returned from stored procedure');
      }

      const task = this.mapToTask(createdTaskData);
      logServiceOperation('task', 'CREATE_TASK_RESULT', taskData, task);
      return task;
    } catch (error) {
      logServiceOperation('task', 'CREATE_TASK_ERROR', taskData, error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: number, taskData: TaskFormData): Promise<Task> {
    logServiceOperation('task', 'UPDATE_TASK', { id, ...taskData });
    
    try {
      const result = await projecthub_sp_UpdateTaskService.projecthub_sp_UpdateTask(
        undefined, // ActualHours - not available in TaskFormData
        taskData.assignedTo,
        taskData.description,
        taskData.dueDate,
        taskData.endDate,
        taskData.estimatedHours,
        id,
        taskData.parentTaskId,
        taskData.predecessorIds?.join(','), // Convert array to comma-separated string
        taskData.priority,
        taskData.progress || 0,
        taskData.projectId,
        taskData.startDate,
        taskData.status,
        taskData.taskOrder,
        taskData.title
      );

      if (!result.success) {
        throw new Error(`Update task failed: ${result.error?.message || 'Unknown error'}`);
      }

      const updatedTaskData = result.data?.ResultSets?.Table1?.[0];
      if (!updatedTaskData) {
        throw new Error('Updated task data not returned from stored procedure');
      }

      const task = this.mapToTask(updatedTaskData);
      logServiceOperation('task', 'UPDATE_TASK_RESULT', { id, ...taskData }, task);
      return task;
    } catch (error) {
      logServiceOperation('task', 'UPDATE_TASK_ERROR', { id, ...taskData }, error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    logServiceOperation('task', 'DELETE_TASK', { id });
    
    try {
      const result = await projecthub_sp_DeleteTaskService.projecthub_sp_DeleteTask(id);

      if (!result.success) {
        throw new Error(`Delete task failed: ${result.error?.message || 'Unknown error'}`);
      }

      logServiceOperation('task', 'DELETE_TASK_RESULT', { id }, 'deleted');
    } catch (error) {
      logServiceOperation('task', 'DELETE_TASK_ERROR', { id }, error);
      throw error;
    }
  }

  /**
   * Reorder a task to a new position within its parent/project
   * Uses the dedicated stored procedure for proper task reordering
   */
  async reorderTask(request: TaskReorderRequest): Promise<Task> {
    logServiceOperation('task', 'REORDER_TASK', request);
    
    try {
      const result = await projecthub_sp_ReorderTaskService.projecthub_sp_ReorderTask(
        request.newPosition,
        request.parentTaskId,
        request.projectId,
        request.taskId
      );

      if (!result.success) {
        throw new Error(`Reorder task failed: ${result.error?.message || 'Unknown error'}`);
      }

      const reorderedTaskData = result.data?.ResultSets?.Table1?.[0];
      if (!reorderedTaskData) {
        throw new Error('Reordered task data not returned from stored procedure');
      }

      const task = this.mapToTask(reorderedTaskData);
      logServiceOperation('task', 'REORDER_TASK_RESULT', request, task);
      return task;
    } catch (error) {
      logServiceOperation('task', 'REORDER_TASK_ERROR', request, error);
      throw error;
    }
  }

  /**
   * Update task order directly (for advanced scenarios)
   */
  async updateTaskOrder(request: TaskOrderUpdateRequest): Promise<Task> {
    logServiceOperation('task', 'UPDATE_TASK_ORDER', request);
    
    try {
      // Get the current task
      const currentTask = await this.getTaskById(request.taskId);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Update the task with the new order
      const updatedTask = await this.updateTask(request.taskId, {
        ...currentTask,
        taskOrder: request.newTaskOrder
      });

      logServiceOperation('task', 'UPDATE_TASK_ORDER_RESULT', request, updatedTask);
      return updatedTask;
    } catch (error) {
      logServiceOperation('task', 'UPDATE_TASK_ORDER_ERROR', request, error);
      throw error;
    }
  }

  /**
   * Map stored procedure result to Task type
   */
  private mapToTask(data: Record<string, unknown>): Task {
    return {
      id: (data.Id as number) || 0,
      title: (data.Title as string) || '',
      description: (data.Description as string) || '',
      projectId: (data.ProjectId as number) || 0,
      projectName: data.ProjectName as string,
      parentTaskId: data.ParentTaskId as number,
      predecessorIds: data.PredecessorIds ? 
        (data.PredecessorIds as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : 
        [],
      assignedTo: data.AssignedTo as string,
      status: (data.Status as Task['status']) || 'Not Started',
      priority: (data.Priority as Task['priority']) || 'Medium',
      startDate: data.StartDate as string,
      endDate: data.EndDate as string,
      dueDate: data.DueDate as string,
      estimatedHours: data.EstimatedHours as number,
      actualHours: data.ActualHours as number,
      progress: (data.Progress as number) || 0,
      taskOrder: data.TaskOrder as number,
      createdDate: (data.CreatedDate as string) || new Date().toISOString(),
      lastModified: data.LastModified as string,
      level: data.Level as number,
      hasChildren: ((data.HasChildren as number) || 0) > 0,
    };
  }
}
