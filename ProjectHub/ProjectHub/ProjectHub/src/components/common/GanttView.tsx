import React, { useState, useEffect, useRef } from 'react';
import { Gantt } from 'wx-react-gantt';
import 'wx-react-gantt/dist/gantt.css';
import '../../styles/gantt-custom.css';
import {
  Text,
  Button,
  Spinner,
  MessageBar,
} from '@fluentui/react-components';
import {
  ZoomIn20Regular,
  ZoomOut20Regular,
  CalendarMonth20Regular,
  Calendar3Day20Regular,
  CalendarDay20Regular,
} from '@fluentui/react-icons';
import type { Task, Project } from '../../types';
import {
  transformTasksToGantt
} from '../../utils/ganttDataTransform';
import { useTheme } from '../../contexts/useTheme';
import { useGanttStyles } from '../../styles/ganttStyles';
import type { GanttAPI, GanttEvent, GanttLink, GanttTask } from '../../types/wx-react-gantt';

/**
 * Props interface for the GanttView component
 */
export interface GanttViewProps {
  tasks: Task[];
  projects: Project[];
  loading?: boolean;
  selectedProjectId?: number;
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => Promise<void>;
  onTaskCreate?: (task: Partial<Task>) => Promise<void>;
  onTaskDelete?: (taskId: number) => Promise<void>;
  onTaskReorder?: (taskId: number, newPosition: number, parentTaskId?: number, projectId?: number) => Promise<void>;
  onOpenTaskEdit?: (task: Task) => void;
  onOpenTaskCreate?: (parentId?: number, projectId?: number) => void;
}

/**
 * Event type definitions based on SVAR Gantt API Documentation
 * See ../../types/ganttTypes.ts for detailed documentation
 */

// Gantt API interface moved to ../../types/ganttTypes.ts

// GanttViewProps interface moved to ../../types/ganttTypes.ts

export const GanttView: React.FC<GanttViewProps> = ({
  tasks,
  projects,
  loading = false,
  selectedProjectId,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onTaskReorder,
  onOpenTaskEdit,
  onOpenTaskCreate,
}) => {
  const styles = useGanttStyles();
  const ganttRef = useRef<GanttAPI | null>(null);
  const { themeMode } = useTheme();
  
  // State
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [ganttLinks, setGanttLinks] = useState<GanttLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(2); // Default to day/week view
  
  // Refs for tracking updates and initialization
  const isInitialLoadDone = useRef<boolean>(false);
  const tasksBeingUpdated = useRef<Record<string, boolean>>({});
  
  // Refs to always hold the latest tasks and ganttTasks values
  const latestTasksRef = useRef<Task[]>([]);
  const latestGanttTasksRef = useRef<GanttTask[]>([]);
  const latestProjectsRef = useRef<Project[]>([]);

  // Zoom configuration for project management
  const zoomConfig = {
    level: currentZoomLevel,
    minCellWidth: 50,
    maxCellWidth: 400,
    levels: [
      // Level 0: Year view
      {
        minCellWidth: 200,
        maxCellWidth: 400,
        scales: [
          { unit: 'year', step: 1, format: 'yyyy' }
        ]
      },
      // Level 1: Quarter view
      {
        minCellWidth: 150,
        maxCellWidth: 300,
        scales: [
          { unit: 'year', step: 1, format: 'yyyy' },
          { unit: 'quarter', step: 1, format: 'QQQQ' }
        ]
      },
      // Level 2: Month view
      {
        minCellWidth: 100,
        maxCellWidth: 200,
        scales: [
          { unit: 'month', step: 1, format: 'MMMM yyyy' },
          { unit: 'week', step: 1, format: "'week' w" }
        ]
      },
      // Level 3: Week/Day view (default)
      {
        minCellWidth: 80,
        maxCellWidth: 150,
        scales: [
          { unit: 'month', step: 1, format: 'MMMM yyyy' },
          { unit: 'day', step: 1, format: 'd' }
        ]
      },
      // Level 4: Day/Hour view
      {
        minCellWidth: 60,
        maxCellWidth: 120,
        scales: [
          { unit: 'day', step: 1, format: 'MMM d' },
          { unit: 'hour', step: 6, format: 'HH:mm' }
        ]
      },
      // Level 5: Hour view
      {
        minCellWidth: 40,
        maxCellWidth: 80,
        scales: [
          { unit: 'day', step: 1, format: 'MMM d' },
          { unit: 'hour', step: 1, format: 'HH:mm' }
        ]
      }
    ]
  };

  // Update refs whenever the corresponding values change
  useEffect(() => {
    latestTasksRef.current = tasks || [];
  }, [tasks]);

  useEffect(() => {
    latestProjectsRef.current = projects || [];
  }, [projects]);

  useEffect(() => {
    latestGanttTasksRef.current = ganttTasks;
  }, [ganttTasks]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (currentZoomLevel < zoomConfig.levels.length - 1) {
      const newLevel = currentZoomLevel + 1;
      setCurrentZoomLevel(newLevel);
      if (ganttRef.current) {
        ganttRef.current.exec('zoom', { level: newLevel });
      }
    }
  };

  const handleZoomOut = () => {
    if (currentZoomLevel > 0) {
      const newLevel = currentZoomLevel - 1;
      setCurrentZoomLevel(newLevel);
      if (ganttRef.current) {
        ganttRef.current.exec('zoom', { level: newLevel });
      }
    }
  };

  const handleScaleChange = (scaleType: 'day' | 'week' | 'month') => {
    let targetLevel: number;
    switch (scaleType) {
      case 'month':
        targetLevel = 2; // Month view
        break;
      case 'week':
        targetLevel = 3; // Week/Day view
        break;
      case 'day':
        targetLevel = 4; // Day/Hour view
        break;
      default:
        targetLevel = 3;
    }
    
    setCurrentZoomLevel(targetLevel);
    if (ganttRef.current) {
      ganttRef.current.exec('zoom', { level: targetLevel });
    }
  };

  // Transform data only on initial load or when data changes while not updating
  useEffect(() => {
    // Skip updates if we're currently updating a task to prevent reverting user changes
    if (updating && isInitialLoadDone.current) {
      return;
    }
    
    try {
      const transformed = transformTasksToGantt(tasks || []);
      
      // If we're updating, preserve the state of tasks being updated
      if (updating) {
        setGanttTasks(prevTasks => {
          return transformed.tasks.map(newTask => {
            // Check if this task is currently being modified by the user
            const taskIdStr = newTask.id.toString();
            if (tasksBeingUpdated.current[taskIdStr]) {
              // Preserve the current version in our state
              const currentTask = prevTasks.find(t => t.id === newTask.id);
              return currentTask || newTask;
            }
            return newTask;
          });
        });
      } else {
        setGanttTasks(transformed.tasks);
        setGanttLinks(transformed.links);
      }
      
      isInitialLoadDone.current = true;
      setError(null);
    } catch {
      // Error handled via setError state
      setError('Failed to prepare data for Gantt chart');
    }
  }, [tasks, projects, updating]);
  
  // Clean up event handlers when component unmounts
  useEffect(() => {
    return () => {
      // Note: The wx-react-gantt library doesn't provide a direct way to remove event handlers
      // If the library is updated in the future to include an off() method, we should use it here
      
      // Clear our refs to prevent memory leaks
      ganttRef.current = null;
      latestTasksRef.current = [];
      latestGanttTasksRef.current = [];
      latestProjectsRef.current = [];
      tasksBeingUpdated.current = {};
    };
  }, []);
  
  // Gantt API initialization
  const initGantt = (api: GanttAPI) => {
    ganttRef.current = api;
    
    // Also listen for any data changes to keep our state in sync
    api.on('data-change', (event: GanttEvent) => {
      // Convert ID to number if it's a string for comparison
      const eventId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
      const taskIdStr = eventId.toString();
      
      // Mark this task as being updated to prevent overwriting with old data
      tasksBeingUpdated.current[taskIdStr] = true;
      
      // Update our local ganttTasks state using the task property if available
      setGanttTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === eventId) {
            return {
              ...task,
              text: event.task?.text || event.text || task.text,
              start: event.task?.start || event.start || task.start,
              end: event.task?.end || event.end || task.end,
              progress: event.task?.progress !== undefined ? event.task.progress :
                        (event.progress !== undefined ? event.progress : task.progress),
            };
          }
          return task;
        })
      );
      
      // Remove the task from being tracked after a short delay
      // This allows time for any update-task events to be triggered
      setTimeout(() => {
        delete tasksBeingUpdated.current[taskIdStr];
      }, 500);
    });
    
    // Use api.intercept to override the show-editor action and use our custom form instead
    if (api.intercept) {
      api.intercept('show-editor', (data: GanttEvent) => {
        // Convert ID to number if it's a string
        const taskId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id as number;
        
        // Find the original task in our data for base properties
        const originalTask = latestTasksRef.current.find(t => t.id === taskId);
        
        // Get the most current task data from the Gantt chart
        const currentGanttTask = getCurrentTaskFromGantt(taskId);
        
        // Also check our local ganttTasks state for comparison
        const localGanttTask = latestGanttTasksRef.current.find(gt => gt.id === taskId);
        
        if (originalTask && onOpenTaskEdit) {
          // Prioritize Gantt's current state for visual properties while maintaining original task data
          // This ensures we always use the most recent visual state from the Gantt chart
          const updatedTask: Task = {
            ...originalTask, // Start with original task as the base
            
            // Update only the visual properties from the Gantt chart
            title: currentGanttTask?.text || localGanttTask?.text || originalTask.title,
            startDate: currentGanttTask?.start ? currentGanttTask.start.toISOString().split('T')[0] : 
                      (localGanttTask?.start ? localGanttTask.start.toISOString().split('T')[0] : originalTask.startDate),
            endDate: currentGanttTask?.end ? currentGanttTask.end.toISOString().split('T')[0] : 
                    (localGanttTask?.end ? localGanttTask.end.toISOString().split('T')[0] : originalTask.endDate),
            progress: currentGanttTask?.progress !== undefined ? currentGanttTask.progress : 
                     (localGanttTask?.progress !== undefined ? localGanttTask.progress : originalTask.progress),
            
            // All other properties are preserved from the original task
            // since we're spreading originalTask first
          };
          
          onOpenTaskEdit(updatedTask);
        }
        // Return false to prevent the default Gantt editor dialog
        return false;
      });
    }
    
    // Override task creation dialog if available
    if (api.intercept) {
      api.intercept('show-creation', (data: GanttEvent) => {
        if (onOpenTaskCreate) {
          // Convert parent ID to number if it's a string
          const parentId = data.parent !== undefined ? 
            (typeof data.parent === 'string' ? parseInt(data.parent, 10) : data.parent as number) : 
            undefined;
            
          // Use the selected project ID if available, otherwise determine from parent
          const projectId = selectedProjectId || getProjectIdFromParent(parentId || 0);
          
          onOpenTaskCreate(parentId, projectId);
        }
        // Return false to prevent the default Gantt creation dialog
        return false;
      });
    }
    
    // Handle task updates (when programmatically updating)
    api.on('update-task', async (event: GanttEvent) => {
      // Filter out || event.eventSource === 'move-task'
      if (event.eventSource === 'move-task') return;

      console.log(`GanttView: update-task event ${event.inProgress ? 'IN PROGRESS' : 'COMPLETE'}`, event);
      if (!onTaskUpdate || !event.task || event.inProgress===true ) {
        return;
      }
      
      // Convert ID to number if it's a string
      const taskId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
      const taskIdStr = taskId.toString();
      
      // Mark this task as being updated to prevent overwriting with old data
      tasksBeingUpdated.current[taskIdStr] = true;
      
      // Update our local state optimistically with the latest Gantt data
      setGanttTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId && event.task) {
            return {
              ...task,
              text: event.task.text || task.text,
              start: event.task.start || task.start,
              end: event.task.end || task.end,
              progress: event.task.progress !== undefined ? event.task.progress : task.progress
            };
          }
          return task;
        })
      );
      
      setUpdating(true);
      try {
        const originalTask = latestTasksRef.current.find(t => t.id === taskId);
        
        if (originalTask) {
          // Create a task update with just the visual properties from the Gantt chart
          // Non-visual properties are preserved from the original task
          const taskUpdates: Partial<Task> = {
            // Only update visual properties from Gantt
            title: event.task.text || originalTask.title,
            startDate: event.task.start ? event.task.start.toISOString().split('T')[0] : originalTask.startDate,
            endDate: event.task.end ? event.task.end.toISOString().split('T')[0] : originalTask.endDate,
            progress: event.task.progress !== undefined ? event.task.progress : originalTask.progress,
          };
          
          // Only include fields that have actually changed
          const filteredUpdates = Object.fromEntries(
            Object.entries(taskUpdates).filter(([key, value]) => 
              value !== undefined && value !== originalTask[key as keyof Task]
            )
          );
          
          if (Object.keys(filteredUpdates).length > 0) {
            await onTaskUpdate(taskId, filteredUpdates);
          }
        }
      } catch {
        setError('Failed to update task');
      } finally {
        // Remove this task from being tracked as updating
        delete tasksBeingUpdated.current[taskIdStr];
        
        // Only set updating to false if no more tasks are being updated
        if (Object.keys(tasksBeingUpdated.current).length === 0) {
          setUpdating(false);
        }
      }
    });
    
    // Handle task creation
    api.on('add-task', async (event: GanttEvent) => {
      console.log('GanttView: add-task event', event);
      if (!onTaskCreate || !event.task ) return;
      // Generate a temporary ID for optimistic update
      // Use a negative number to avoid conflicts with real IDs
      const tempId = -(Date.now());
      const tempIdStr = tempId.toString();
      
      // Mark this task as being updated
      tasksBeingUpdated.current[tempIdStr] = true;
      
      // Add the task to our local state optimistically
      if (event.task) {
        const optimisticTask: GanttTask = {
          id: tempId,
          text: event.task.text || 'New Task',
          start: event.task.start || new Date(),
          end: event.task.end || new Date(Date.now() + 24 * 60 * 60 * 1000),
          progress: event.task.progress !== undefined ? event.task.progress : 0,
          parent: event.task.parent,
          type: event.task.type || 'task',
        };
        
        setGanttTasks(prevTasks => [...prevTasks, optimisticTask]);
      }
      
      setUpdating(true);
      try {
        // Convert string IDs to numbers
        const targetId = event.target !== undefined ? 
          (typeof event.target === 'string' ? parseInt(event.target, 10) : event.target) : 0;
        
        const parentId = event.task.parent !== undefined ?
          (typeof event.task.parent === 'string' ? parseInt(event.task.parent as string, 10) : event.task.parent as number) : 
          targetId;
        
        // Use current Gantt event data for the new task
        const newTask: Partial<Task> = {
          title: event.task.text || 'New Task',
          startDate: event.task.start ? event.task.start.toISOString().split('T')[0] : 
                    new Date().toISOString().split('T')[0],
          endDate: event.task.end ? event.task.end.toISOString().split('T')[0] : 
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: event.task.progress !== undefined ? event.task.progress : 0,
          projectId: selectedProjectId || getProjectIdFromParent(parentId || targetId || 0),
          parentTaskId: isTaskId(parentId || targetId || 0) ? 
                       (parentId || targetId) : undefined,
          status: 'Not Started',
          priority: 'Medium',
        };
        
        await onTaskCreate(newTask);
      } catch {
        setError('Failed to create task');
        
        // Remove optimistic task on error
        setGanttTasks(prevTasks => prevTasks.filter(task => task.id !== tempId));
      } finally {
        // Remove this task from being tracked
        delete tasksBeingUpdated.current[tempIdStr];
        
        // Only set updating to false if no more tasks are being updated
        if (Object.keys(tasksBeingUpdated.current).length === 0) {
          setUpdating(false);
        }
      }
    });
    
    // Handle task deletion
    api.on('delete-task', async (event: GanttEvent) => {
      if (!onTaskDelete) return;
      
      // Convert ID to number if it's a string
      const taskId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
      const taskIdStr = taskId.toString();
      
      // Mark this task as being updated
      tasksBeingUpdated.current[taskIdStr] = true;
      
      // Update our local state optimistically - remove the task
      setGanttTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      setUpdating(true);
      try {
        await onTaskDelete(taskId);
      } catch {
        setError('Failed to delete task');
        
        // Restore the task if delete fails
        const originalTask = latestTasksRef.current.find(t => t.id === taskId);
        if (originalTask) {
          const restoredTask = latestGanttTasksRef.current.find(gt => gt.id === taskId);
          if (restoredTask) {
            setGanttTasks(prevTasks => [...prevTasks, restoredTask]);
          }
        }
      } finally {
        // Remove this task from being tracked
        delete tasksBeingUpdated.current[taskIdStr];
        
        // Only set updating to false if no more tasks are being updated
        if (Object.keys(tasksBeingUpdated.current).length === 0) {
          setUpdating(false);
        }
      }
    });

    // Handle link operations for predecessor relationships
    api.on('add-link', (event: GanttEvent) => {
      if (event.link) {
        const { source, target, type } = event.link;
        console.log(`Link added: Task ${source} -> Task ${target} (type: ${type})`);
        
        // Find the source and target tasks
        const sourceTask = latestGanttTasksRef.current.find(t => t.id === source);
        const targetTask = latestGanttTasksRef.current.find(t => t.id === target);
        
        console.log(`Predecessor relationship: "${sourceTask?.text}" -> "${targetTask?.text}"`);
        
        if (sourceTask && targetTask) {
          // Add to links collection
          const newLink: GanttLink = {
            id: Date.now(), // Generate a temporary unique ID
            source: typeof source === 'string' ? parseInt(source, 10) : source,
            target: typeof target === 'string' ? parseInt(target, 10) : target,
            type: type || 'e2s' // Default to end-to-start if not specified
          };
          
          // Add the link optimistically
          setGanttLinks(prevLinks => [...prevLinks, newLink]);
          
          // Find the actual Task object for the target task
          const targetTaskObj = latestTasksRef.current.find(t => t.id === target);
          if (targetTaskObj && onTaskUpdate) {
            // Add the predecessor to the target task - ensure we store the predecessor as a number
            const sourceNum = typeof source === 'string' ? parseInt(source, 10) : source;
            const predecessorIds = targetTaskObj.predecessorIds 
              ? [...targetTaskObj.predecessorIds, sourceNum] 
              : [sourceNum];
            
            // Update the target task with the new predecessor
            onTaskUpdate(targetTaskObj.id, {
              predecessorIds
            }).catch(() => {
              // Rollback on error
              setGanttLinks(prevLinks => prevLinks.filter(link => link.id !== newLink.id));
              setError('Failed to update task predecessor');
            });
          }
        }
      }
    });
    
    api.on('update-link', (event: GanttEvent) => {
      if (event.link && event.id !== undefined) {
        const { source, target, type } = event.link;
        const linkId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
        console.log(`Link updated: ${JSON.stringify(event.link)}`);
        
        // Find the source and target tasks
        const sourceTask = latestGanttTasksRef.current.find(t => t.id === source);
        const targetTask = latestGanttTasksRef.current.find(t => t.id === target);
        
        if (sourceTask && targetTask) {
          // Convert to numbers if needed
          const sourceNum = typeof source === 'string' ? parseInt(source, 10) : source;
          const targetNum = typeof target === 'string' ? parseInt(target, 10) : target;
          
          // Update the link optimistically
          setGanttLinks(prevLinks => 
            prevLinks.map(link => 
              link.id === linkId ? { ...link, source: sourceNum, target: targetNum, type } : link
            )
          );
          
          // Find old link to determine what changed
          const oldLink = ganttLinks.find(link => link.id === linkId);
          if (oldLink && onTaskUpdate) {
            // Find the task objects
            const oldTargetTask = latestTasksRef.current.find(t => t.id === oldLink.target);
            const newTargetTask = latestTasksRef.current.find(t => t.id === target);
            
            // If target task changed, update predecessors for both old and new target
            if (oldLink.target !== target && oldTargetTask && newTargetTask) {
              // Remove predecessor from old target
              const oldTargetPredecessors = oldTargetTask.predecessorIds?.filter(p => p !== oldLink.source) || [];
              
              // Add predecessor to new target
              const sourceNum = typeof source === 'string' ? parseInt(source, 10) : source;
              const newTargetPredecessors = newTargetTask.predecessorIds 
                ? [...newTargetTask.predecessorIds, sourceNum]
                : [sourceNum];
              
              // Update both tasks (should use Promise.all in production code)
              onTaskUpdate(oldTargetTask.id, {
                predecessorIds: oldTargetPredecessors
              }).catch(() => setError('Failed to update old target task'));
              
              onTaskUpdate(newTargetTask.id, {
                predecessorIds: newTargetPredecessors
              }).catch(() => {
                setError('Failed to update new target task');
                // Rollback on error
                setGanttLinks(prevLinks => 
                  prevLinks.map(link => 
                    link.id === linkId ? { ...oldLink } : link
                  )
                );
              });
            }
            // If only the source changed
            else if (oldLink.source !== source && newTargetTask) {
              // Update the target task's predecessors list
              const sourceNum = typeof source === 'string' ? parseInt(source, 10) : source;
              const updatedPredecessors = newTargetTask.predecessorIds?.map(p => 
                p === oldLink.source ? sourceNum : p
              ) || [sourceNum];
              
              onTaskUpdate(newTargetTask.id, {
                predecessorIds: updatedPredecessors
              }).catch(() => {
                setError('Failed to update task predecessor');
                // Rollback on error
                setGanttLinks(prevLinks => 
                  prevLinks.map(link => 
                    link.id === linkId ? { ...oldLink } : link
                  )
                );
              });
            }
          }
        }
      }
    });
    
    api.on('delete-link', (event: GanttEvent) => {
      const linkId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
      console.log(`Link deleted: ID ${linkId}`);
      
      // Find the link that's being deleted
      const deletedLink = ganttLinks.find(link => link.id === linkId);
      if (deletedLink && onTaskUpdate) {
        // Find the target task
        const targetTask = latestTasksRef.current.find(t => t.id === deletedLink.target);
        if (targetTask) {
          // Remove the predecessor from the target task
          const updatedPredecessors = targetTask.predecessorIds?.filter(id => id !== deletedLink.source) || [];
          
          // Remove the link optimistically
          setGanttLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
          
          // Update the task
          onTaskUpdate(targetTask.id, {
            predecessorIds: updatedPredecessors
          }).catch(() => {
            // Rollback on error
            if (deletedLink) {
              setGanttLinks(prevLinks => [...prevLinks, deletedLink]);
            }
            setError('Failed to update task predecessor');
          });
        }
      } else {
        // If we can't find the target task, just remove the link from state
        setGanttLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
      }
    });

    // Handle task reordering when tasks are moved in the Gantt chart
    api.on('move-task', async (event: GanttEvent) => {
      console.log(`GanttView: move-task event ${event.inProgress ? 'IN PROGRESS' : 'COMPLETE'}`, event);
      if (!onTaskReorder || event.inProgress === true) return;

      const taskId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id as number;
      const taskIdStr = taskId.toString();

      // Mark this task as being updated
      tasksBeingUpdated.current[taskIdStr] = true;

      try {
        const originalTask = latestTasksRef.current.find(t => t.id === taskId);
        if (!originalTask) return;

        // Extract move information from the event
        const moveMode = event.mode; // 'before', 'after', 'up', 'down', 'child'
        const targetId = event.target ? (typeof event.target === 'string' ? parseInt(event.target, 10) : event.target) : null;
        
        // Calculate new position based on mode and target
        let newPosition = -1;
        let newParentId = originalTask.parentTaskId;
        
        if (targetId && moveMode) {
          // Find the target task's position in the current task list
          const targetPosition = latestTasksRef.current.findIndex(t => t.id === targetId);
          const targetTask = latestTasksRef.current.find(t => t.id === targetId);
          
          switch (moveMode) {
            case 'before':
              newPosition = targetPosition;
              newParentId = targetTask?.parentTaskId;
              break;
            case 'after':
              newPosition = targetPosition + 1;
              newParentId = targetTask?.parentTaskId;
              break;
            case 'child':
              // Moving as a child of the target task
              newParentId = targetId;
              // Find the last child of the target task
              {
                const childTasks = latestTasksRef.current.filter(t => t.parentTaskId === targetId);
                if (childTasks.length > 0) {
                  const lastChildPosition = latestTasksRef.current.findIndex(t => t.id === childTasks[childTasks.length - 1].id);
                  newPosition = lastChildPosition + 1;
                } else {
                  newPosition = targetPosition + 1;
                }
              }
              break;
            case 'up':
              // Move up in the current parent's children
              {
                const siblingTasks = latestTasksRef.current.filter(t => t.parentTaskId === originalTask.parentTaskId);
                const currentIndex = siblingTasks.findIndex(t => t.id === taskId);
                if (currentIndex > 0) {
                  const previousSibling = siblingTasks[currentIndex - 1];
                  newPosition = latestTasksRef.current.findIndex(t => t.id === previousSibling.id);
                }
              }
              break;
            case 'down':
              // Move down in the current parent's children
              {
                const siblingTasksDown = latestTasksRef.current.filter(t => t.parentTaskId === originalTask.parentTaskId);
                const currentIndexDown = siblingTasksDown.findIndex(t => t.id === taskId);
                if (currentIndexDown < siblingTasksDown.length - 1) {
                  const nextSibling = siblingTasksDown[currentIndexDown + 1];
                  newPosition = latestTasksRef.current.findIndex(t => t.id === nextSibling.id) + 1;
                }
              }
              break;
            default:
              // Fallback to current position if mode is not recognized
              newPosition = latestTasksRef.current.findIndex(t => t.id === taskId);
          }
        } else {
          // Fallback: use current position if no target/mode information
          newPosition = latestTasksRef.current.findIndex(t => t.id === taskId);
        }

        if (newPosition >= 0) {
          await onTaskReorder(
            taskId, 
            newPosition, 
            newParentId, 
            originalTask.projectId
          );
        }
      } catch (error) {
        console.error('Failed to reorder task:', error);
        setError('Failed to reorder task');
      } finally {
        // Remove this task from being tracked
        delete tasksBeingUpdated.current[taskIdStr];
      }
    });
  };

  // Helper function to get current task data from Gantt API
  const getCurrentTaskFromGantt = (taskId: string | number): GanttTask | null => {
    // Convert to number if it's a string containing a number
    const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
    
    if (ganttRef.current?.getTask) {
      try {
        return ganttRef.current.getTask(numericId);
      } catch {
        // Failed to get task from API
      }
    }
    
    // Fallback to our local ganttTasks state
    return latestGanttTasksRef.current.find(gt => gt.id === numericId) || null;
  };

  // Helper functions
  const getProjectIdFromParent = (parentId: number): number => {
    // If we have a selected project, use it as the default
    if (selectedProjectId) {
      return selectedProjectId;
    }
    
    // If parent is a project (large ID), extract project ID
    if (parentId >= 1000) {
      return Math.floor(parentId / 1000);
    }
    // If parent is a task, find its project
    const parentTask = latestTasksRef.current.find(t => t.id === parentId);
    return parentTask?.projectId || latestProjectsRef.current[0]?.id || 1;
  };

  const isTaskId = (id: number): boolean => {
    return id < 1000; // Task IDs are smaller than project summary IDs
  };

  // Transform data when tasks or projects change
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <Text>Loading Gantt chart...</Text>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!tasks.length || !projects.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <CalendarMonth20Regular style={{ fontSize: '48px' }} />
          <Text size={500}>No tasks available</Text>
          <Text size={300}>Create some tasks to see them in the Gantt chart</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorContainer}>
          <MessageBar intent="error">
            {error}
          </MessageBar>
        </div>
      )}
      
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarSection}>
          <Text weight="semibold">Gantt Chart</Text>
          {updating && <Spinner size="tiny" />}
        </div>
        
        <div className={styles.toolbarSection}>
          {/* Zoom controls */}
          <Button
            appearance="subtle"
            icon={<ZoomOut20Regular />}
            onClick={handleZoomOut}
            title="Zoom Out"
          />
          <Button
            appearance="subtle"
            icon={<ZoomIn20Regular />}
            onClick={handleZoomIn}
            title="Zoom In"
          />
          
          {/* Scale controls */}
          <Button
            appearance="subtle"
            icon={<CalendarDay20Regular />}
            onClick={() => handleScaleChange('day')}
            title="Day View"
          />
          <Button
            appearance="subtle"
            icon={<Calendar3Day20Regular />}
            onClick={() => handleScaleChange('week')}
            title="Week View"
          />
          <Button
            appearance="subtle"
            icon={<CalendarMonth20Regular />}
            onClick={() => handleScaleChange('month')}
            title="Month View"
          />
        </div>
      </div>

      {/* Gantt Chart */}
      <div 
        className={`${styles.ganttContainer} gantt-container`}
      >
        {ganttTasks.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            <CalendarMonth20Regular style={{ fontSize: '48px' }} />
            <Text size={500} weight="semibold">No tasks to display</Text>
            <Text size={300}>Add some tasks to see them in the Gantt chart</Text>
          </div>
        ) : ganttTasks.length > 0 ? (
          // Only render Gantt if we have valid tasks
          (() => {
            // Validate all tasks have required properties
            const validTasks = ganttTasks.filter(task => 
              task && 
              typeof task.id === 'number' && 
              typeof task.text === 'string' && 
              task.start instanceof Date
            );
            
            // Validate all links have required properties
            const validLinks = ganttLinks.filter(link => 
              link && 
              typeof link.id === 'number' && 
              typeof link.source === 'number' && 
              typeof link.target === 'number'
            );
            
            if (validTasks.length === 0) {
              return (
                <div className={styles.emptyState}>
                  <CalendarMonth20Regular style={{ fontSize: '48px' }} />
                  <Text size={500} weight="semibold">No valid tasks found</Text>
                  <Text size={300}>Task data validation failed</Text>
                </div>
              );
            }
            
            // Additional validation to ensure all task properties are non-null
            const safeValidTasks = validTasks.map(task => ({
              ...task,
              end: task.end || new Date(task.start.getTime() + 24 * 60 * 60 * 1000), // Add 1 day if no end date
              progress: task.progress || 0,
              type: task.type || 'task'
            }));

            // Additional validation to ensure all link properties are non-null
            const safeValidLinks = validLinks.map(link => ({
              ...link,
              type: link.type || 'e2s'
            }));



            // Create a safer fallback for when real data is problematic
            const createSafeGanttData = () => {
              // If we have no valid tasks, provide minimal safe data
              if (safeValidTasks.length === 0) {
                return {
                  tasks: [
                    {
                      id: 1,
                      text: "Sample Task",
                      start: new Date(2025, 0, 1),
                      end: new Date(2025, 0, 5),
                      progress: 0,
                      type: 'task' as const
                    }
                  ],
                  links: []
                };
              }

              // Define a more complete task type that includes optional open property
              type CleanGanttTask = {
                id: number;
                text: string;
                start: Date;
                end: Date;
                progress: number;
                type: 'task' | 'summary' | 'milestone';
                parent?: number;
                open?: boolean;
                duration?: number;
              };
              
              // Clean the task data to ensure it's compatible with SVAR Gantt
              const cleanTasks: CleanGanttTask[] = safeValidTasks.map((task, index) => ({
                id: task.id || (index + 1),
                text: task.text || `Task ${task.id || (index + 1)}`,
                start: task.start instanceof Date ? task.start : new Date(),
                end: task.end instanceof Date ? task.end : new Date(task.start.getTime() + 24 * 60 * 60 * 1000),
                progress: typeof task.progress === 'number' ? Math.max(0, Math.min(100, task.progress)) : 0,
                type: (task.type === 'task' || task.type === 'milestone' || task.type === 'summary') ? task.type : 'task' as const,
                parent: task.parent,
                duration: task.duration
              }));
              
              // Set open=true for tasks that have children
              cleanTasks.forEach(task => {
                // Check if this task has any child tasks
                const hasChildren = cleanTasks.some(t => t.parent === task.id);
                if (hasChildren) {
                  task.open = true;
                }
              });

              // Clean the links data
              const cleanLinks = safeValidLinks
                .filter(link => 
                  link && 
                  typeof link.source === 'number' && 
                  typeof link.target === 'number' &&
                  link.source !== link.target &&
                  cleanTasks.some(t => t.id === link.source) &&
                  cleanTasks.some(t => t.id === link.target)
                )
                .map((link, index) => ({
                  id: link.id || (index + 1),
                  source: link.source,
                  target: link.target,
                  type: (link.type === 'e2s' || link.type === 's2s' || link.type === 'e2e' || link.type === 's2e') ? link.type : 'e2s' as const
                }));

              return { tasks: cleanTasks, links: cleanLinks };
            };

            const { tasks: finalTasks, links: finalLinks } = createSafeGanttData();
            
            // Final validation - commented out since we're directly using finalTasks/finalLinks
            // Uncomment these if needed for additional validation
            /*
            const validatedTasks = Array.isArray(finalTasks) ? finalTasks.filter(task => 
              task && 
              typeof task.id === 'number' && 
              typeof task.text === 'string' && 
              task.start instanceof Date &&
              !isNaN(task.start.getTime())
            ) : [];
            
            const validatedLinks = Array.isArray(finalLinks) ? finalLinks.filter(link => 
              link && 
              typeof link.id === 'number' && 
              typeof link.source === 'number' && 
              typeof link.target === 'number'
            ) : [];
            */
            

            
            // Use the real data from props
            const tasksForGantt = finalTasks;
            const linksForGantt = finalLinks;

            try {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    
                  
                      <div className={themeMode === 'dark' ? "wx-willow-dark-theme" :  "wx-willow-theme"} style={{ flex: 1, height: '100%', minHeight: '450px' }}>
                        <Gantt
                          init={initGantt}
                          zoom={zoomConfig}
                          tasks={tasksForGantt}
                          links={linksForGantt}
                          columns={[
                            { id: 'text', header: 'Task Name', flexgrow: 4 },
                            { id: 'start', header: 'Start Date', flexgrow: 1 },
                            { id: 'duration', header: 'Duration', flexgrow: 1 }
                           
                          ]}
                          // Additional configuration to enhance predecessor links display
                          config={{
                            links: {
                              color: "#1976d2",
                              width: 2,
                              highlightColor: "#2196f3"
                            }
                          }}
                        />
                     </div>
                  
                </div>
              );
            } catch {
              // Error handled in UI
              return (
                <div className={styles.emptyState}>
                  <CalendarMonth20Regular style={{ fontSize: '48px' }} />
                  <Text size={500} weight="semibold">Gantt Chart Error</Text>
                  <Text size={300}>Unable to render the chart. Please try refreshing the page.</Text>
                </div>
              );
            }
          })()
        ) : (
          <div className={styles.loadingContainer}>
            <Spinner size="large" />
            <Text>Preparing Gantt chart...</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttView;
