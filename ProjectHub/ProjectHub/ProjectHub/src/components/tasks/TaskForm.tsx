import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
  Spinner,
  makeStyles,
  tokens,
  Slider,
  Text,
} from '@fluentui/react-components';
import type { Task, TaskFormData, Project } from '../../types';
import { getProjectService, getTaskService } from '../../Services/ServiceFactory';

const useStyles = makeStyles({
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '60vh',
    maxHeight: '90vh',
    minWidth: '500px',
    '@media (max-width: 768px)': {
      width: '100vw !important',
      height: '100vh !important',
      maxWidth: '100vw !important',
      maxHeight: '100vh !important',
      borderRadius: '0 !important',
      margin: '0 !important',
      minHeight: '100vh',
      minWidth: 'auto',
    },
  },
  
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalM,
    },
  },
  
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingVerticalM,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  
  fullWidth: {
    gridColumn: '1 / -1',
  },
  
  dialogActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'flex-end',
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 768px)': {
      flexDirection: 'column-reverse',
      gap: tokens.spacingVerticalS,
      '& > button': {
        width: '100%',
        minHeight: '44px',
      },
    },
  },
});

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => Promise<void>;
  task?: Task | null;
  mode: 'create' | 'edit';
  defaultProjectId?: number;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  mode,
  defaultProjectId,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId: defaultProjectId || 0,
    parentTaskId: undefined,
    predecessorIds: [],
    assignedTo: '',
    status: 'Not Started',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    dueDate: '',
    estimatedHours: undefined,
    progress: 0,
    taskOrder: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const projectService = getProjectService();
        const projectsData = await projectService.getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);
  
  // Load potential parent tasks when project changes
  useEffect(() => {
    const loadProjectTasks = async () => {
      if (!formData.projectId) return;
      
      try {
        setLoadingTasks(true);
        // Use the search tasks method with project ID filter
        const taskService = getTaskService();
        const response = await taskService.searchTasks({
          pageNumber: 1,
          pageSize: 100, // Get a large number to show all potential parent tasks
          projectId: formData.projectId
        });
        
        // Filter out the current task (if in edit mode) to prevent circular references
        let tasks = response.data;
        if (mode === 'edit' && task?.id) {
          tasks = tasks.filter(t => t.id !== task.id);
        }
        
        setAvailableTasks(tasks);
        console.log(`Loaded ${tasks.length} tasks for project ${formData.projectId}`);
      } catch (error) {
        console.error('Failed to load tasks for project:', error);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (formData.projectId) {
      loadProjectTasks();
    } else {
      setAvailableTasks([]);
    }
  }, [formData.projectId, mode, task?.id]);

  // Initialize form data when task changes
  useEffect(() => {
    if (task && mode === 'edit') {
      // Ensure predecessorIds is always an array
      let predecessorIdsArray: number[] = [];
      
      if (task.predecessorIds) {
        if (Array.isArray(task.predecessorIds)) {
          predecessorIdsArray = task.predecessorIds;
        } else if (typeof task.predecessorIds === 'string') {
          // Handle case where predecessorIds might be a comma-separated string
          predecessorIdsArray = (task.predecessorIds as string).split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        }
      }
      
      setFormData({
        title: task.title,
        description: task.description || '',
        projectId: task.projectId,
        parentTaskId: task.parentTaskId,
        predecessorIds: predecessorIdsArray,
        assignedTo: task.assignedTo || '',
        status: task.status,
        priority: task.priority,
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        dueDate: task.dueDate || '',
        estimatedHours: task.estimatedHours,
        progress: task.progress,
        taskOrder: task.taskOrder,
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        projectId: defaultProjectId || 0,
        parentTaskId: undefined,
        predecessorIds: [],
        assignedTo: '',
        status: 'Not Started',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        dueDate: '',
        estimatedHours: undefined,
        progress: 0,
        taskOrder: undefined,
      });
    }
    setErrors({});
  }, [task, mode, defaultProjectId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.projectId || formData.projectId === 0) {
      newErrors.projectId = 'Project is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.startDate && formData.dueDate && formData.startDate > formData.dueDate) {
      newErrors.dueDate = 'Due date must be after start date';
    }

    if (formData.estimatedHours !== undefined && formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Estimated hours must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof TaskFormData, value: string | number | boolean | undefined | number[]) => {
    if (field === 'progress' && typeof value === 'number') {
      // When progress reaches 100%, automatically set status to Completed
      if (value === 100) {
        setFormData(prev => ({
          ...prev,
          [field]: value,
          status: 'Completed'
        }));
      } else if (value < 100 && formData.status === 'Completed') {
        // If progress is reduced below 100% and status is Completed, change to In Progress
        setFormData(prev => ({
          ...prev,
          [field]: value,
          status: 'In Progress'
        }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'status' && value === 'Completed') {
      // When status is set to Completed, set progress to 100%
      setFormData(prev => ({
        ...prev,
        [field]: value,
        progress: 100
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          <div className={styles.formGrid}>
            <Field 
              label="Task Title" 
              required 
              validationMessage={errors.title}
              validationState={errors.title ? 'error' : 'none'}
              className={styles.fullWidth}
            >
              <Input
                value={formData.title}
                onChange={(_, data) => handleFieldChange('title', data.value)}
                placeholder="Enter task title"
              />
            </Field>

            <Field 
              label="Project" 
              required 
              validationMessage={errors.projectId}
              validationState={errors.projectId ? 'error' : 'none'}
            >
              <Dropdown
                value={projects.find(p => p.id === formData.projectId)?.name || ''}
                selectedOptions={formData.projectId ? [formData.projectId.toString()] : []}
                onOptionSelect={(_, data) => {
                  if (data.optionValue) {
                    handleFieldChange('projectId', parseInt(data.optionValue));
                    // Reset parent task when project changes
                    handleFieldChange('parentTaskId', undefined);
                  }
                }}
                placeholder={loadingProjects ? "Loading projects..." : "Select a project"}
                disabled={loadingProjects}
              >
                {projects
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((project) => (
                    <Option key={project.id} value={project.id.toString()} text={project.name}>
                      {project.name}
                    </Option>
                  ))}
              </Dropdown>
            </Field>

            <Field label="Parent Task">
              <Dropdown
                value={availableTasks.find(t => t.id === formData.parentTaskId)?.title || ''}
                selectedOptions={formData.parentTaskId ? [formData.parentTaskId.toString()] : []}
                onOptionSelect={(_, data) => {
                  if (data.optionValue) {
                    const newParentId = parseInt(data.optionValue);
                    handleFieldChange('parentTaskId', newParentId);
                    
                    // Check if the new parent is in the predecessors list
                    // If so, remove it from predecessors to avoid circular references
                    if (formData.predecessorIds && formData.predecessorIds.includes(newParentId)) {
                      const updatedPredecessorIds = formData.predecessorIds.filter(id => id !== newParentId);
                      handleFieldChange('predecessorIds', updatedPredecessorIds);
                    }
                  } else {
                    handleFieldChange('parentTaskId', undefined);
                  }
                }}
                placeholder={loadingTasks ? "Loading tasks..." : "Select a parent task (optional)"}
                disabled={loadingTasks || !formData.projectId}
              >
                <Option value="" text="None (Top Level Task)">None (Top Level Task)</Option>
                {/* Filter out tasks that can't be parents:
                    1. Can't be the current task itself
                    2. Can't be a child of this task (to avoid circular dependencies) */}
                {availableTasks
                  .filter(availableTask => {
                    // Can't be parent to itself
                    if (mode === 'edit' && task && availableTask.id === task.id) return false;
                    
                    // Don't allow child tasks as parents (would create circular dependencies)
                    if (mode === 'edit' && task && availableTask.parentTaskId === task.id) return false;
                    
                    return true;
                  })
                  .map((task) => (
                    <Option key={task.id} value={task.id.toString()} text={task.title || `Task ${task.id}`}>
                      {task.title || `Task ${task.id}`}
                    </Option>
                  ))
                }
              </Dropdown>
            </Field>
            
            <Field label="Predecessor Tasks" className={styles.fullWidth}>
              <Dropdown
                multiselect
                value={formData.predecessorIds && formData.predecessorIds.length > 0 ? 
                  formData.predecessorIds.map(id => {
                    const task = availableTasks.find(t => t.id === id);
                    return task ? (task.title || `Task ${task.id}`) : `Task ${id}`;
                  }).join(', ') : 
                  ''
                }
                selectedOptions={formData.predecessorIds?.map(id => id.toString()) || []}
                onOptionSelect={(_, data) => {
                  // Convert to numbers and filter out any that might match the parent task ID
                  const selectedIds = data.selectedOptions
                    .map(id => parseInt(id))
                    .filter(id => id !== formData.parentTaskId);
                  
                  handleFieldChange('predecessorIds', selectedIds);
                }}
                placeholder={loadingTasks ? "Loading tasks..." : "Select predecessor tasks (optional)"}
                disabled={loadingTasks || !formData.projectId}
              >
                {availableTasks.length === 0 ? (
                  <Option disabled value="no-tasks" text="No tasks available">
                    No tasks available
                  </Option>
                ) : (
                  // Filter out tasks that can't be predecessors:
                  // 1. Can't be the current task itself
                  // 2. Can't be a child of this task (to avoid circular dependencies)
                  // 3. Can't be the parent task
                  availableTasks
                    .filter(availableTask => {
                      // Can't be predecessor to itself
                      if (mode === 'edit' && task && availableTask.id === task.id) return false;
                      
                      // Can't be the parent task
                      if (availableTask.id === formData.parentTaskId) return false;
                      
                      // Don't allow child tasks as predecessors (would create circular dependencies)
                      if (mode === 'edit' && task && availableTask.parentTaskId === task.id) return false;
                      
                      return true;
                    })
                    .map((availableTask) => (
                      <Option key={availableTask.id} value={availableTask.id.toString()} text={availableTask.title || `Task ${availableTask.id}`}>
                        {availableTask.title || `Task ${availableTask.id}`}
                      </Option>
                    ))
                )}
              </Dropdown>
            </Field>

            <Field label="Assigned To">
              <Input
                value={formData.assignedTo}
                onChange={(_, data) => handleFieldChange('assignedTo', data.value)}
                placeholder="Enter assignee name"
              />
            </Field>

            <Field label="Status">
              <Dropdown
                value={formData.status}
                selectedOptions={[formData.status]}
                onOptionSelect={(_, data) => {
                  if (data.optionValue) {
                    handleFieldChange('status', data.optionValue as TaskFormData['status']);
                  }
                }}
              >
                <Option value="Not Started" text="Not Started">Not Started</Option>
                <Option value="In Progress" text="In Progress">In Progress</Option>
                <Option value="Completed" text="Completed">Completed</Option>
                <Option value="On Hold" text="On Hold">On Hold</Option>
                <Option value="Cancelled" text="Cancelled">Cancelled</Option>
              </Dropdown>
            </Field>

            <Field label="Priority">
              <Dropdown
                value={formData.priority}
                selectedOptions={[formData.priority]}
                onOptionSelect={(_, data) => {
                  if (data.optionValue) {
                    handleFieldChange('priority', data.optionValue as TaskFormData['priority']);
                  }
                }}
              >
                <Option value="Low" text="Low">Low</Option>
                <Option value="Medium" text="Medium">Medium</Option>
                <Option value="High" text="High">High</Option>
                <Option value="Critical" text="Critical">Critical</Option>
              </Dropdown>
            </Field>

            <Field label="Start Date">
              <Input
                type="date"
                value={formData.startDate}
                onChange={(_, data) => handleFieldChange('startDate', data.value)}
              />
            </Field>

            <Field 
              label="End Date"
              validationMessage={errors.endDate}
              validationState={errors.endDate ? 'error' : 'none'}
            >
              <Input
                type="date"
                value={formData.endDate}
                onChange={(_, data) => handleFieldChange('endDate', data.value)}
              />
            </Field>

            <Field 
              label="Due Date"
              validationMessage={errors.dueDate}
              validationState={errors.dueDate ? 'error' : 'none'}
            >
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(_, data) => handleFieldChange('dueDate', data.value)}
              />
            </Field>

            <Field 
              label="Estimated Hours"
              validationMessage={errors.estimatedHours}
              validationState={errors.estimatedHours ? 'error' : 'none'}
            >
              <Input
                type="number"
                min="0"
                step="0.25"
                value={formData.estimatedHours?.toString() || ''}
                onChange={(_, data) => handleFieldChange('estimatedHours', data.value ? parseFloat(data.value) : undefined)}
                placeholder="Enter estimated hours"
              />
            </Field>

            <Field 
              label="Progress" 
              className={styles.fullWidth}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: tokens.spacingVerticalXS
                }}>
                  <Text>
                    {formData.progress}% Complete
                  </Text>
                  {formData.status === 'Completed' && (
                    <Text style={{ color: tokens.colorPaletteGreenForeground1 }}>
                      Completed
                    </Text>
                  )}
                </div>
                <Slider
                  value={formData.progress}
                  onChange={(_, data) => handleFieldChange('progress', data.value)}
                  min={0}
                  max={100}
                  step={5}
                  size="medium"
                />
              </div>
            </Field>

            <Field 
              label="Description" 
              className={styles.fullWidth}
            >
              <Textarea
                value={formData.description}
                onChange={(_, data) => handleFieldChange('description', data.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </Field>
          </div>
        </DialogBody>
        
        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            appearance="primary" 
            onClick={handleSave}
            disabled={loading || loadingProjects}
          >
            {loading ? <Spinner size="tiny" /> : (mode === 'create' ? 'Create Task' : 'Save Changes')}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
