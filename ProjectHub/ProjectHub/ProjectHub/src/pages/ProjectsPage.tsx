import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Input,
  Dropdown,
  Option,
  Badge,
  Card,
} from '@fluentui/react-components';
import { Add20Regular, Search20Regular, Filter20Regular, CalendarMonth20Regular } from '@fluentui/react-icons';
import { ResponsiveDataGrid, ProgressCell } from '../components/common/ResponsiveDataGrid';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProjectDeleteConfirmationDialog } from '../components/projects/ProjectDeleteConfirmationDialog';
import { ClientLookup } from '../components/common/lookup/ClientLookup';
import { getProjectService, getClientService } from '../Services/ServiceFactory';
import type { Project, ProjectSearchParams, ProjectFormData, Client } from '../types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
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
  },

  searchSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  
  searchInput: {
    minWidth: '300px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      width: '100%',
    },
  },
  
  filterDropdown: {
    minWidth: '150px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      width: '100%',
    },
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  
  errorCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorPaletteRedBackground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    color: tokens.colorPaletteRedForeground1,
  },
  
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
  },
  
  paginationInfo: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  
  paginationControls: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
});

export const ProjectsPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<ProjectSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortColumn: 'name',
    sortDirection: 'asc',
    searchTerm: '',
    status: '',
    clientId: undefined,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // CRUD Dialog state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Load projects data
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projectService = getProjectService();
      const response = await projectService.searchProjects(searchParams);
      setProjects(response.data);
      setTotalRecords(response.totalRecords);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Load clients for dropdown
  const loadClients = useCallback(async () => {
    try {
      const clientService = getClientService();
      const response = await clientService.searchClients({ 
        pageNumber: 1, 
        pageSize: 100, 
        sortColumn: 'name', 
        sortDirection: 'asc',
        searchTerm: '',
        status: 'Active' 
      });
      setClients(response.data);
    } catch (err) {
      console.error('Failed to load clients:', err);
    }
  }, []);

  // Load data on mount and when search params change
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Event handlers
  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => ({
      ...prev,
      searchTerm,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: status,  // Now directly use the value (empty string for "All Status")
      pageNumber: 1, // Reset to first page
    }));
  };

  const handlePriorityFilter = (priority: string) => {
    setSearchParams(prev => ({
      ...prev,
      priority: priority,  // Now directly use the value (empty string for "All Priority")
      pageNumber: 1, // Reset to first page
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setSearchParams(prev => ({
      ...prev,
      pageNumber,
    }));
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  // Helper function for priority badge styling
  const getPriorityBadgeProps = (priority: unknown) => {
    const priorityValue = String(priority || 'Medium'); // Default to 'Medium' if undefined
    const priorityColors: Record<string, "subtle" | "brand" | "warning" | "danger"> = {
      'Low': 'subtle',
      'Medium': 'brand',
      'High': 'warning',
      'Critical': 'danger',
    };
    const color = priorityColors[priorityValue] || 'brand';
    return {
      color,
      text: priorityValue === 'undefined' || priorityValue === 'null' ? 'Medium' : priorityValue
    };
  };

  const handleSort = (columnKey: keyof Project, direction: 'asc' | 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sortColumn: String(columnKey),
      sortDirection: direction,
      pageNumber: 1, // Reset to first page when sorting
    }));
  };

  const handleViewGantt = (project: Project) => {
    navigate(`/projects/${project.id}/gantt`);
  };

  // CRUD operations
  const handleSaveProject = async (projectData: ProjectFormData) => {
    try {
      const projectService = getProjectService();
      if (editingProject) {
        // Update existing project
        await projectService.updateProject(editingProject.id, projectData);
      } else {
        // Create new project
        await projectService.createProject(projectData);
      }
      await loadProjects(); // Refresh the list
      setEditingProject(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to save project:', err);
      setError('Failed to save project. Please try again.');
      throw err; // Re-throw to let the dialog handle the error state
    }
  };

  const handleConfirmDelete = async (project: Project) => {
    try {
      const projectService = getProjectService();
      await projectService.deleteProject(project.id);
      await loadProjects(); // Refresh the list
      setDeletingProject(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project. Please try again.');
      throw err; // Re-throw to let the dialog handle the error state
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name' as keyof Project,
      header: 'Project Name',
      render: (value: unknown) => (
        <Text weight="semibold">{String(value)}</Text>
      ),
    },
    {
      key: 'clientName' as keyof Project,
      header: 'Client',
    },
    {
      key: 'status' as keyof Project,
      header: 'Status',
      render: (value: unknown) => {
        const statusColors: Record<string, "subtle" | "brand" | "warning" | "success" | "danger"> = {
          'Planning': 'subtle',
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
      key: 'priority' as keyof Project,
      header: 'Priority',
      render: (value: unknown) => {
        const priorityProps = getPriorityBadgeProps(value);
        return (
          <Badge 
            appearance="outline"
            color={priorityProps.color}
          >
            {priorityProps.text}
          </Badge>
        );
      },
    },
    {
      key: 'progress' as keyof Project,
      header: 'Progress',
      render: (value: unknown) => {
        const progressValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        return <ProgressCell value={progressValue} />;
      },
    },
    {
      key: 'endDate' as keyof Project,
      header: 'Due Date',
      render: (value: unknown) => {
        if (!value) return '';
        const date = new Date(String(value));
        return date.toLocaleDateString();
      },
    },
  ];

  // Mobile card fields
  const mobileCardFields = [
    {
      key: 'name' as keyof Project,
      label: 'Project',
      render: (value: unknown) => (
        <Text weight="semibold">{String(value)}</Text>
      ),
    },
    {
      key: 'clientName' as keyof Project,
      label: 'Client',
    },
    {
      key: 'status' as keyof Project,
      label: 'Status',
      render: (value: unknown) => {
        const statusColors: Record<string, "subtle" | "brand" | "warning" | "success" | "danger"> = {
          'Planning': 'subtle',
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
      key: 'priority' as keyof Project,
      label: 'Priority',
      render: (value: unknown) => {
        const priorityProps = getPriorityBadgeProps(value);
        return (
          <Badge 
            appearance="outline"
            color={priorityProps.color}
          >
            {priorityProps.text}
          </Badge>
        );
      },
    },
    {
      key: 'progress' as keyof Project,
      label: 'Progress',
      render: (value: unknown) => {
        const progressValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        return <ProgressCell value={progressValue} size="small" />;
      },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text className={styles.title}>
          Projects ({totalRecords} total)
        </Text>
        <Button 
          appearance="primary" 
          icon={<Add20Regular />}
          onClick={handleCreateNew}
        >
          New Project
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder="Search projects by name or description..."
          value={searchParams.searchTerm}
          onChange={(_, data) => handleSearch(data.value)}
          contentBefore={<Search20Regular />}
        />
        
        <Dropdown
          className={styles.filterDropdown}
          placeholder="Filter by status"
          value={searchParams.status || ''}
          selectedOptions={searchParams.status ? [searchParams.status] : ['']}
          onOptionSelect={(_, data) => handleStatusFilter(data.optionValue || '')}
        >
          <Option value="">All Status</Option>
          <Option value="Planning">Planning</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="On Hold">On Hold</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Dropdown>

        <Dropdown
          className={styles.filterDropdown}
          placeholder="Filter by priority"
          value={searchParams.priority || ''}
          selectedOptions={searchParams.priority ? [searchParams.priority] : ['']}
          onOptionSelect={(_, data) => handlePriorityFilter(data.optionValue || '')}
        >
          <Option value="">All Priority</Option>
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
          <Option value="Critical">Critical</Option>
        </Dropdown>

        <div className={styles.filterDropdown}>
          <ClientLookup
            selectedClientId={searchParams.clientId}
            onChange={(clientId) => {
              setSearchParams(prev => ({
                ...prev,
                clientId: clientId ? Number(clientId) : undefined,
                pageNumber: 1, // Reset to first page when filtering
              }));
            }}
            placeholder="Filter by client..."
          />
        </div>
        
        <Button
          appearance="outline"
          icon={<Filter20Regular />}
        >
          More Filters
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className={styles.errorCard}>
          <Text>{error}</Text>
          <Button 
            appearance="outline" 
            onClick={loadProjects}
            style={{ marginTop: tokens.spacingVerticalS }}
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Content */}
      <div className={styles.content}>
        {!error && (
          <ResponsiveDataGrid
            items={projects}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
            sortColumn={searchParams.sortColumn as keyof Project}
            sortDirection={searchParams.sortDirection}
            mobileCardFields={mobileCardFields}
            keyField="id"
            customActions={[
              {
                icon: <CalendarMonth20Regular />,
                label: "View Gantt",
                onClick: handleViewGantt,
                appearance: "outline",
              },
            ]}
          />
        )}

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className={styles.pagination}>
            <Text className={styles.paginationInfo}>
              Showing {((searchParams.pageNumber - 1) * searchParams.pageSize) + 1} to{' '}
              {Math.min(searchParams.pageNumber * searchParams.pageSize, totalRecords)} of{' '}
              {totalRecords} projects
            </Text>
            
            <div className={styles.paginationControls}>
              <Button
                appearance="outline"
                disabled={searchParams.pageNumber <= 1 || loading}
                onClick={() => handlePageChange(searchParams.pageNumber - 1)}
              >
                Previous
              </Button>
              
              <Text>{searchParams.pageNumber} of {totalPages}</Text>
              
              <Button
                appearance="outline"
                disabled={searchParams.pageNumber >= totalPages || loading}
                onClick={() => handlePageChange(searchParams.pageNumber + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <Card>
            <div className={styles.emptyState}>
              <Text>
                {searchParams.searchTerm || (searchParams.status && searchParams.status.trim() !== '') || searchParams.clientId
                  ? 'No projects found matching your search criteria.' 
                  : 'No projects yet. Create your first project to get started!'}
              </Text>
              {!searchParams.searchTerm && !(searchParams.status && searchParams.status.trim() !== '') && !searchParams.clientId && (
                <Button 
                  appearance="primary" 
                  onClick={handleCreateNew}
                  style={{ marginTop: tokens.spacingVerticalM }}
                >
                  Create Your First Project
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* CRUD Dialogs */}
      {showCreateForm && (
        <ProjectForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSave={handleSaveProject}
          mode="create"
          clients={clients}
        />
      )}

      {editingProject && (
        <ProjectForm
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
          project={editingProject}
          mode="edit"
          clients={clients}
        />
      )}

      {deletingProject && (
        <ProjectDeleteConfirmationDialog
          isOpen={!!deletingProject}
          onClose={() => setDeletingProject(null)}
          onConfirm={handleConfirmDelete}
          project={deletingProject}
          hasActiveTasks={false} // TODO: Check if project has active tasks
          activeTasksCount={0} // TODO: Get actual count
        />
      )}
    </div>
  );
};
