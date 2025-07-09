import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Field,
  Input,
  Dropdown,
  Option,
  Spinner,
  Badge,
} from '@fluentui/react-components';
import { 
  Add20Regular, 
  Search20Regular, 
  Filter20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
} from '@fluentui/react-icons';
import { ResponsiveDataGrid, ProgressCell } from '../components/common/ResponsiveDataGrid';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDeleteConfirmationDialog } from '../components/tasks/TaskDeleteConfirmationDialog';
import type { Task, TaskFormData, TaskSearchParams, Project } from '../types';
import { getTaskService, getProjectService } from '../Services/ServiceFactory';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    height: '100%',
    maxHeight: '100vh', // Prevent page from exceeding viewport
    overflow: 'hidden', // Ensure no page-level scrolling
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
  
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    '@media (max-width: 768px)': {
      textAlign: 'center',
    },
  },
  
  searchAndFilters: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  searchRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-end',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
  },
  
  searchField: {
    flex: 1,
    minWidth: '200px',
  },
  
  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingVerticalS,
    },
  },
  
  filterToggle: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacingVerticalS,
    },
  },
  
  mobileFilters: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  mobileFiltersShow: {
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: 'calc(100vh - 200px)', // Prevent content from exceeding viewport
    overflow: 'hidden', // Ensure no overflow at page level
  },
  
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
  },
  
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
});

export const TasksPage: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  
  // Get filters from navigation state (from dashboard)
  const incomingFilters = location.state?.filters as Record<string, string> | undefined;
  
  // Data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Search and filter state
  const [searchParams, setSearchParams] = useState<TaskSearchParams>({
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'taskOrder',
    sortDirection: 'asc',
    searchTerm: '',
    projectId: undefined,
    status: incomingFilters?.status || '',
    priority: '',
    assignedTo: '',
    includeCompleted: true,
  });
  
  // UI state
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);
  
  // Dialog state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [newTaskProjectId, setNewTaskProjectId] = useState<number | undefined>(undefined);

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectService = getProjectService();
        const projectsData = await projectService.getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProjects();
  }, []);
  // Load tasks when search params change
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const taskService = getTaskService();
        const response = await taskService.searchTasks(searchParams);
        setTasks(response.data);
        setTotalRecords(response.totalRecords);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [searchParams]);

  const handleSearch = () => {
    setSearchParams(prev => ({
      ...prev,
      pageNumber: 1,
    }));
  };

  const handleFilterChange = (field: keyof TaskSearchParams, value: string | number | boolean | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      pageNumber: 1,
    }));
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    const taskService = getTaskService();
    await taskService.createTask(taskData);
    // Refresh the data
    const response = await taskService.searchTasks(searchParams);
    setTasks(response.data);
    setTotalRecords(response.totalRecords);
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (editingTask) {
      const taskService = getTaskService();
      await taskService.updateTask(editingTask.id, taskData);
      // Refresh the data
      const response = await taskService.searchTasks(searchParams);
      setTasks(response.data);
      setTotalRecords(response.totalRecords);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const taskService = getTaskService();
    await taskService.deleteTask(task.id);
    // Refresh the data
    const response = await taskService.searchTasks(searchParams);
    setTasks(response.data);
    setTotalRecords(response.totalRecords);
  };

  // Helper function to get parent task information
  const getParentTaskTitle = (parentTaskId?: number): string => {
    if (!parentTaskId) return '-';
    const parentTask = tasks.find(t => t.id === parentTaskId);
    return parentTask ? parentTask.title || `Task ${parentTaskId}` : `Task ${parentTaskId}`;
  };

  const columns = [
    {
      key: 'taskOrder' as keyof Task,
      header: 'Order',
      render: (value: unknown) => {
        const orderValue = typeof value === 'number' ? value : 0;
        return <Text style={{ fontFamily: 'monospace' }}>{orderValue}</Text>;
      },
    },
    {
      key: 'title' as keyof Task,
      header: 'Task Title',
    },
    {
      key: 'projectName' as keyof Task,
      header: 'Project',
    },
    {
      key: 'parentTaskId' as keyof Task,
      header: 'Parent Task',
      render: (_value: unknown, item: Task) => {
        if (!item.parentTaskId) return '-';
        return getParentTaskTitle(item.parentTaskId);
      },
    },
    {
      key: 'assignedTo' as keyof Task,
      header: 'Assigned To',
    },
    {
      key: 'status' as keyof Task,
      header: 'Status',
    },
    {
      key: 'priority' as keyof Task,
      header: 'Priority',
    },
    {
      key: 'dueDate' as keyof Task,
      header: 'Due Date',
      render: (_value: unknown, item: Task) => {
        if (!item.dueDate) return 'Not set';
        return new Date(item.dueDate).toLocaleDateString();
      },
    },
    {
      key: 'progress' as keyof Task,
      header: 'Progress',
      render: (value: unknown) => {
        const progressValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        return <ProgressCell value={progressValue} />;
      },
    },
  ];

  // Mobile card fields
  const mobileCardFields = [
    {
      key: 'title' as keyof Task,
      label: 'Task',
      render: (value: unknown) => (
        <Text weight="semibold">{String(value)}</Text>
      ),
    },
    {
      key: 'taskOrder' as keyof Task,
      label: 'Order',
      render: (value: unknown) => {
        const orderValue = typeof value === 'number' ? value : 0;
        return <Text style={{ fontFamily: 'monospace' }}>{orderValue}</Text>;
      },
    },
    {
      key: 'projectName' as keyof Task,
      label: 'Project',
    },
    {
      key: 'parentTaskId' as keyof Task,
      label: 'Parent Task',
      render: (value: unknown) => {
        if (!value) return '-';
        return getParentTaskTitle(value as number);
      },
    },
    {
      key: 'assignedTo' as keyof Task,
      label: 'Assigned To',
    },
    {
      key: 'status' as keyof Task,
      label: 'Status',
      render: (value: unknown) => {
        const statusColors: Record<string, "subtle" | "brand" | "warning" | "success" | "danger"> = {
          'Not Started': 'subtle',
          'In Progress': 'brand',
          'On Hold': 'warning',
          'Completed': 'success',
          'Cancelled': 'danger',
        };
        const color = statusColors[value as string] || 'subtle';
        return (
          <Badge 
            appearance="filled"
            color={color}
          >
            {String(value)}
          </Badge>
        );
      },
    },
    {
      key: 'priority' as keyof Task,
      label: 'Priority',
    },
    {
      key: 'dueDate' as keyof Task,
      label: 'Due Date',
      render: (value: unknown) => {
        if (!value) return 'Not set';
        return new Date(value as string).toLocaleDateString();
      },
    },
    {
      key: 'progress' as keyof Task,
      label: 'Progress',
      render: (value: unknown) => {
        const progressValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        return (
          <div className={styles.progressContainer}>
            <ProgressCell value={progressValue} />
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text className={styles.title}>
          Tasks ({totalRecords} total)
        </Text>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'center' }}>
          <Button 
            appearance="primary" 
            icon={<Add20Regular />}
            onClick={() => {
              setShowCreateForm(true);
              setNewTaskProjectId(searchParams.projectId);
            }}
          >
            New Task
          </Button>
        </div>
      </div>
      
      <div className={styles.searchAndFilters}>
        <div className={styles.filterToggle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Filter20Regular />
            <Text weight="semibold">Search & Filters</Text>
          </div>
          <Button
            appearance="subtle"
            icon={showFiltersOnMobile ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
            onClick={() => setShowFiltersOnMobile(!showFiltersOnMobile)}
          />
        </div>

        <div className={showFiltersOnMobile ? styles.mobileFiltersShow : styles.mobileFilters}>
          <div className={styles.searchRow}>
            <Field label="Search Tasks" className={styles.searchField}>
              <Input
                value={searchParams.searchTerm}
                onChange={(_, data) => handleFilterChange('searchTerm', data.value)}
                placeholder="Search by title, description, or assignee..."
                contentBefore={<Search20Regular />}
              />
            </Field>
            <Button appearance="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          
          <div className={styles.filtersRow}>
            <Field label="Project">
              <Dropdown
                value={projects.find(p => p.id === searchParams.projectId)?.name || ''}
                selectedOptions={searchParams.projectId ? [searchParams.projectId.toString()] : []}
                onOptionSelect={(_, data) => {
                  const value = data.optionValue === 'all' ? undefined : parseInt(data.optionValue || '0');
                  handleFilterChange('projectId', value);
                }}
                placeholder="All Projects"
              >
                <Option value="all">All Projects</Option>
                {projects
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((project) => (
                    <Option key={project.id} value={project.id.toString()}>
                      {project.name}
                    </Option>
                  ))}
              </Dropdown>
            </Field>

            <Field label="Status">
              <Dropdown
                value={searchParams.status}
                selectedOptions={searchParams.status ? [searchParams.status] : []}
                onOptionSelect={(_, data) => handleFilterChange('status', data.optionValue)}
                placeholder="All Statuses"
              >
                <Option value="">All Statuses</Option>
                <Option value="Not Started">Not Started</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="On Hold">On Hold</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Dropdown>
            </Field>

            <Field label="Priority">
              <Dropdown
                value={searchParams.priority}
                selectedOptions={searchParams.priority ? [searchParams.priority] : []}
                onOptionSelect={(_, data) => handleFilterChange('priority', data.optionValue)}
                placeholder="All Priorities"
              >
                <Option value="">All Priorities</Option>
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
                <Option value="Critical">Critical</Option>
              </Dropdown>
            </Field>

            <Field label="Assigned To">
              <Input
                value={searchParams.assignedTo}
                onChange={(_, data) => handleFilterChange('assignedTo', data.value)}
                placeholder="Filter by assignee"
              />
            </Field>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spinner size="large" />
          </div>
        ) : (
          <ResponsiveDataGrid
            items={tasks}
            columns={columns}
            onEdit={setEditingTask}
            onDelete={setDeletingTask}
            loading={loading}
            mobileCardFields={mobileCardFields}
          />
        )}
      </div>

      {/* Create Task Dialog */}
      {showCreateForm && (
        <TaskForm
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setNewTaskProjectId(undefined);
          }}
          onSave={handleCreateTask}
          mode="create"
          defaultProjectId={newTaskProjectId}
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

      {/* Delete Confirmation Dialog */}
      {deletingTask && (
        <TaskDeleteConfirmationDialog
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteTask}
          task={deletingTask}
        />
      )}
    </div>
  );
};
