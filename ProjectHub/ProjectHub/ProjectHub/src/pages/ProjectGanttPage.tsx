import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Spinner,
  Card,
} from '@fluentui/react-components';
import { 
  ArrowLeft20Regular,
  Grid20Regular,
  Add20Regular,
} from '@fluentui/react-icons';
import { GanttView } from '../components/common/GanttView';
import { TaskForm } from '../components/tasks/TaskForm';
import type { Task, TaskFormData, Project } from '../types';
import { getTaskService, getProjectService } from '../Services/ServiceFactory';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    height: '100%',
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalM,
      alignItems: 'stretch',
    },
  },
  
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  
  headerActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
      justifyContent: 'center',
    },
  },
  
  // Mobile-specific styles for icon-only buttons
  mobileButton: {
    '@media (max-width: 768px)': {
      minWidth: '44px',
      padding: tokens.spacingVerticalS,
    },
  },
  
  buttonText: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'hidden',
  },
  
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
  },
  
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    gap: tokens.spacingVerticalM,
    textAlign: 'center',
  },
});

export const ProjectGanttPage: React.FC = () => {
  const styles = useStyles();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Data state
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load project and tasks
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const projectService = getProjectService();
        const taskService = getTaskService();
        
        // Load project details
        const projectData = await projectService.getProject(parseInt(projectId));
        setProject(projectData);
        
        // Load tasks for this project
        const tasksResponse = await taskService.searchTasks({
          pageNumber: 1,
          pageSize: 1000, // Load all tasks for the project
          sortColumn: 'taskOrder',
          sortDirection: 'asc',
          projectId: parseInt(projectId),
          includeCompleted: true,
        });
        
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error('Failed to load project data:', err);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleViewGrid = () => {
    navigate(`/tasks?projectId=${projectId}`);
  };

  const handleTaskUpdate = async (taskId: number, updates: Partial<Task>) => {
    try {
      const taskFormData: TaskFormData = {
        title: updates.title,
        description: updates.description,
        projectId: updates.projectId || parseInt(projectId!),
        parentTaskId: updates.parentTaskId,
        assignedTo: updates.assignedTo,
        status: updates.status || 'Not Started',
        priority: updates.priority || 'Medium',
        startDate: updates.startDate,
        endDate: updates.endDate,
        dueDate: updates.dueDate,
        estimatedHours: updates.estimatedHours,
        progress: updates.progress,
        predecessorIds: updates.predecessorIds,
      };
      
      const taskService = getTaskService();
      await taskService.updateTask(taskId, taskFormData);
      
      // Refresh tasks data
      const tasksResponse = await taskService.searchTasks({
        pageNumber: 1,
        pageSize: 1000,
        sortColumn: 'taskOrder',
        sortDirection: 'asc',
        projectId: parseInt(projectId!),
        includeCompleted: true,
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const taskFormData: TaskFormData = {
        title: taskData.title || 'New Task',
        description: taskData.description,
        projectId: parseInt(projectId!),
        parentTaskId: taskData.parentTaskId,
        assignedTo: taskData.assignedTo,
        status: taskData.status || 'Not Started',
        priority: taskData.priority || 'Medium',
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours,
        progress: taskData.progress || 0,
      };
      
      const taskService = getTaskService();
      await taskService.createTask(taskFormData);
      
      // Refresh tasks data
      const tasksResponse = await taskService.searchTasks({
        pageNumber: 1,
        pageSize: 1000,
        sortColumn: 'taskOrder',
        sortDirection: 'asc',
        projectId: parseInt(projectId!),
        includeCompleted: true,
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    const taskService = getTaskService();
    await taskService.createTask(taskData);
    // Refresh the data
    const tasksResponse = await taskService.searchTasks({
      pageNumber: 1,
      pageSize: 1000,
      sortColumn: 'taskOrder',
      sortDirection: 'asc',
      projectId: parseInt(projectId!),
      includeCompleted: true,
    });
    setTasks(tasksResponse.data);
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (editingTask) {
      const taskService = getTaskService();
      await taskService.updateTask(editingTask.id, taskData);
      // Refresh the data
      const tasksResponse = await taskService.searchTasks({
        pageNumber: 1,
        pageSize: 1000,
        sortColumn: 'taskOrder',
        sortDirection: 'asc',
        projectId: parseInt(projectId!),
        includeCompleted: true,
      });
      setTasks(tasksResponse.data);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const taskService = getTaskService();
      await taskService.deleteTask(taskId);
      
      // Refresh tasks data
      const tasksResponse = await taskService.searchTasks({
        pageNumber: 1,
        pageSize: 1000,
        sortColumn: 'taskOrder',
        sortDirection: 'asc',
        projectId: parseInt(projectId!),
        includeCompleted: true,
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleTaskReorder = async (taskId: number, newPosition: number, parentTaskId?: number, reorderProjectId?: number) => {
    try {
      const taskService = getTaskService();
      await taskService.reorderTask({
        taskId,
        newPosition,
        parentTaskId,
        projectId: reorderProjectId || parseInt(projectId!),
      });
      
      // Refresh tasks data
      const tasksResponse = await taskService.searchTasks({
        pageNumber: 1,
        pageSize: 1000,
        sortColumn: 'taskOrder',
        sortDirection: 'asc',
        projectId: parseInt(projectId!),
        includeCompleted: true,
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Failed to reorder task:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer}>
          <Card>
            <div className={styles.emptyState}>
              <Text>{error}</Text>
              <Button appearance="primary" onClick={handleBackToProjects}>
                Back to Projects
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer}>
          <Card>
            <div className={styles.emptyState}>
              <Text>Project not found</Text>
              <Button appearance="primary" onClick={handleBackToProjects}>
                Back to Projects
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Text className={styles.title}>
            {project.name} - Gantt Chart
          </Text>
          <Text className={styles.subtitle}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {project.status}
          </Text>
        </div>
        <div className={styles.headerActions}>
          <Button
            appearance="primary"
            icon={<Add20Regular />}
            onClick={() => setShowCreateForm(true)}
            className={styles.mobileButton}
          >
            <span className={styles.buttonText}>Add New Task</span>
          </Button>
          <Button
            appearance="outline"
            icon={<Grid20Regular />}
            onClick={handleViewGrid}
            className={styles.mobileButton}
          >
            <span className={styles.buttonText}>View Grid</span>
          </Button>
          <Button
            appearance="outline"
            icon={<ArrowLeft20Regular />}
            onClick={handleBackToProjects}
            className={styles.mobileButton}
          >
            <span className={styles.buttonText}>Back to Projects</span>
          </Button>
        </div>
      </div>
      
      <div className={styles.content}>
        {tasks.length === 0 ? (
          <Card>
            <div className={styles.emptyState}>
              <Text>No tasks found for this project.</Text>
              <Text>Tasks will appear here once they are created.</Text>
            </div>
          </Card>
        ) : (
          <GanttView
            tasks={tasks}
            projects={[project]}
            loading={false}
            selectedProjectId={parseInt(projectId!)}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onTaskReorder={handleTaskReorder}
            onOpenTaskEdit={(task) => {
              setEditingTask(task);
            }}
            onOpenTaskCreate={() => {
              setShowCreateForm(true);
            }}
          />
        )}
      </div>

      {/* Create Task Dialog */}
      {showCreateForm && (
        <TaskForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSave={handleCreateTask}
          mode="create"
          defaultProjectId={parseInt(projectId!)}
        />
      )}

      {/* Edit Task Dialog */}
      {editingTask && (
        <TaskForm
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
          task={editingTask}
          mode="edit"
        />
      )}
    </div>
  );
};
