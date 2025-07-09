import type { Task } from '../types';
import type { GanttLink, GanttTask } from '../types/wx-react-gantt';

/**
 * Transform tasks and projects into Gantt-compatible format
 */
export const transformTasksToGantt = (
  tasks: Task[]
): { tasks: GanttTask[]; links: GanttLink[] } => {

  // Safety checks for null/undefined data
  const safeTasks = Array.isArray(tasks) ? tasks.filter(task => task && task.id) : [];
  
  
  const ganttTasks: GanttTask[] = [];
  const ganttLinks: GanttLink[] = [];

  // Early return if no data
  if (safeTasks.length === 0) {
    return { tasks: ganttTasks, links: ganttLinks };
  }
  
  // Track all task IDs for validation
  const taskIds = new Set(safeTasks.map(task => task.id));

  // First, add all tasks without project grouping to simplify
  // Sort tasks by order first, then by ID as fallback
  safeTasks.sort((a, b) => {
    // If both tasks have order, sort by order
    if (a.taskOrder !== undefined && b.taskOrder !== undefined) {
      return a.taskOrder - b.taskOrder;
    }
    // If only one has order, prioritize it
    if (a.taskOrder !== undefined) return -1;
    if (b.taskOrder !== undefined) return 1;
    // If neither has order, sort by ID
    return a.id - b.id;
  }).forEach((task) => {
    try {
      // Ensure we have valid dates
      const taskStartDate = task.startDate 
        ? new Date(task.startDate) 
        : new Date();
      
      // Validate the date
      if (isNaN(taskStartDate.getTime())) {
       
        return; // Skip this task
      }
      
      const taskEndDate = task.endDate 
        ? new Date(task.endDate) 
        : task.dueDate 
          ? new Date(task.dueDate)
          : calculateTaskEndDate(taskStartDate, task.estimatedHours || 8);

      // Validate end date
      if (isNaN(taskEndDate.getTime())) {
        
        return; // Skip this task
      }

      // Ensure progress is a valid number
      const progress = typeof task.progress === 'number' && !isNaN(task.progress) 
        ? Math.max(0, Math.min(100, task.progress)) 
        : 0;

      // Determine task type
      let taskType: 'task' | 'summary' | 'milestone' = 'task';
      if (task.hasChildren) {
        taskType = 'summary';
      } else if (task.estimatedHours && task.estimatedHours <= 1) {
        taskType = 'milestone';
      }

      const ganttTask: GanttTask = {
        id: task.id,
        text: task.title || `Task ${task.id}`,
        start: taskStartDate,
        end: taskEndDate,
        progress: progress,
        type: taskType,
        parent: task.parentTaskId || undefined,
        // Only set open=true for tasks that actually have children
        open: task.hasChildren === true
        // We no longer need custom_data since we're using refs to keep track of task data
      };

      // Validate the gantt task before adding
      if (ganttTask.id && ganttTask.text && ganttTask.start) {
        ganttTasks.push(ganttTask);
       
        // Process task dependencies (predecessors)
        if (task.predecessorIds && Array.isArray(task.predecessorIds) && task.predecessorIds.length > 0) {
          // Create links for each predecessor
          task.predecessorIds.forEach((predecessorId, index) => {
            // Validate that the predecessor task exists
            if (taskIds.has(predecessorId)) {
              ganttLinks.push({
                id: (task.id * 1000) + index, // Generate unique link ID
                source: predecessorId, // Source task (predecessor)
                target: task.id, // Target task (current task)
                type: 'e2s' // End-to-start is the most common dependency type
              });
            }
          });
        }
      } else {
        console.warn('transformTasksToGantt: Skipping invalid task', task.id, ganttTask);
      }

    } catch (error) {
      console.error('transformTasksToGantt: Error processing task', task.id, error);
    }
  });


  return { tasks: ganttTasks, links: ganttLinks };
};


/**
 * Calculate task end date based on start date and estimated hours
 */
const calculateTaskEndDate = (startDate: Date, estimatedHours: number): Date => {
  // Assume 8 working hours per day
  const daysNeeded = Math.ceil(estimatedHours / 8);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + daysNeeded);
  return endDate;
};



