import type { IProjectService } from '../interfaces/IProjectService';
import type { 
  Project, 
  PaginatedResponse, 
  ProjectSearchParams, 
  ProjectFormData 
} from '../../types';
import { logServiceOperation } from '../serviceLogger';

// Import the generated stored procedure services
import { projecthub_sp_SearchProjectsService } from '../projecthub_sp_SearchProjectsService';
import { projecthub_sp_GetAllProjectsService } from '../projecthub_sp_GetAllProjectsService';
import { projecthub_sp_GetProjectByIdService } from '../projecthub_sp_GetProjectByIdService';
import { projecthub_sp_CreateProjectService } from '../projecthub_sp_CreateProjectService';
import { projecthub_sp_UpdateProjectService } from '../projecthub_sp_UpdateProjectService';
import { projecthub_sp_DeleteProjectService } from '../projecthub_sp_DeleteProjectService';

/**
 * Real implementation of IProjectService using stored procedure services
 * This implementation uses the generated services from Power Apps Code Apps CLI
 */
export class SqlProjectService implements IProjectService {
  
  /**
   * Search projects with pagination and filtering
   */
  async searchProjects(params: ProjectSearchParams): Promise<PaginatedResponse<Project>> {
    logServiceOperation('project', 'SEARCH_PROJECTS', params);
    
    try {
      const result = await projecthub_sp_SearchProjectsService.projecthub_sp_SearchProjects(
        params.clientId,
        params.pageNumber || 1,
        params.pageSize || 25,
        params.priority,
        params.searchTerm,
        params.sortColumn || 'Name',
        params.sortDirection || 'asc',
        params.startDateFrom,
        params.startDateTo,
        params.status,
        0 // TotalRecords - output parameter
      );

      if (!result.success) {
        throw new Error(`Search projects failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const projectsData = data?.ResultSets?.Table1;
      
      // Handle both array and single object responses and map to Project interface
      let projects: Project[] = [];
      if (projectsData) {
        const rawProjects = Array.isArray(projectsData) ? projectsData : [projectsData];
        projects = rawProjects.map(p => ({
          id: p.Id || 0,
          name: p.Name || '',
          description: p.Description,
          clientId: p.ClientId || 0,
          clientName: p.ClientName,
          status: p.Status as Project['status'] || 'Planning',
          priority: p.Priority as Project['priority'] || 'Medium',
          startDate: p.StartDate,
          endDate: p.EndDate,
          estimatedHours: p.EstimatedHours,
          actualHours: p.ActualHours,
          budget: p.Budget,
          progress: p.Progress || 0,
          createdDate: p.CreatedDate || new Date().toISOString(),
          lastModified: p.LastModified,
          taskCount: p.TaskCount,
          completedTaskCount: p.CompletedTaskCount
        }));
      }

      // Get total count from output parameter
      const totalRecords = data?.outputparameters?.TotalRecords || projects.length;

      logServiceOperation('project', 'SEARCH_PROJECTS_SUCCESS', { 
        found: projects.length, 
        total: totalRecords,
        page: params.pageNumber || 1
      });

      return {
        data: projects,
        totalRecords,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 25,
        totalPages: Math.ceil(totalRecords / (params.pageSize || 25))
      };
    } catch (error) {
      logServiceOperation('project', 'SEARCH_PROJECTS_ERROR', { error });
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: ProjectFormData): Promise<Project> {
    logServiceOperation('project', 'CREATE_PROJECT', projectData);
    
    try {
      const result = await projecthub_sp_CreateProjectService.projecthub_sp_CreateProject(
        projectData.budget || 0,
        projectData.clientId,
        projectData.description || '',
        projectData.endDate,
        projectData.estimatedHours || 0,
        projectData.name,
        projectData.priority || 'Medium',
        projectData.startDate,
        projectData.status || 'Planning'
      );

      if (!result.success) {
        throw new Error(`Create project failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const projectData_result = data?.ResultSets?.Table1?.[0];
      
      // Map the response to Project interface
      const createdProject: Project = {
        id: projectData_result?.Id || 0,
        name: projectData_result?.Name || projectData.name,
        description: projectData_result?.Description || projectData.description,
        clientId: projectData_result?.ClientId || projectData.clientId,
        clientName: projectData_result?.ClientName,
        status: (projectData_result?.Status as Project['status']) || 'Planning',
        priority: (projectData_result?.Priority as Project['priority']) || 'Medium',
        startDate: projectData_result?.StartDate || projectData.startDate,
        endDate: projectData_result?.EndDate || projectData.endDate,
        estimatedHours: projectData_result?.EstimatedHours || projectData.estimatedHours,
        actualHours: projectData_result?.ActualHours || 0,
        budget: projectData_result?.Budget || projectData.budget,
        progress: projectData_result?.Progress || 0,
        createdDate: projectData_result?.CreatedDate || new Date().toISOString(),
        lastModified: projectData_result?.LastModified
      };

      logServiceOperation('project', 'CREATE_PROJECT_SUCCESS', createdProject);
      return createdProject;
    } catch (error) {
      logServiceOperation('project', 'CREATE_PROJECT_ERROR', { error });
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(id: number, projectData: ProjectFormData): Promise<Project> {
    logServiceOperation('project', 'UPDATE_PROJECT', { id, ...projectData });
    
    try {
      const result = await projecthub_sp_UpdateProjectService.projecthub_sp_UpdateProject(
        projectData.budget || 0,
        projectData.clientId,
        projectData.description || '',
        projectData.endDate,
        projectData.estimatedHours || 0,
        id,
        projectData.name,
        projectData.priority || 'Medium',
        projectData.startDate,
        projectData.status || 'Planning'
      );

      if (!result.success) {
        throw new Error(`Update project failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const projectData_result = data?.ResultSets?.Table1?.[0];
      
      // Map the response to Project interface
      const updatedProject: Project = {
        id: projectData_result?.Id || id,
        name: projectData_result?.Name || projectData.name,
        description: projectData_result?.Description || projectData.description,
        clientId: projectData_result?.ClientId || projectData.clientId,
        clientName: projectData_result?.ClientName,
        status: (projectData_result?.Status as Project['status']) || 'Planning',
        priority: (projectData_result?.Priority as Project['priority']) || 'Medium',
        startDate: projectData_result?.StartDate || projectData.startDate,
        endDate: projectData_result?.EndDate || projectData.endDate,
        estimatedHours: projectData_result?.EstimatedHours || projectData.estimatedHours,
        actualHours: projectData_result?.ActualHours || 0,
        budget: projectData_result?.Budget || projectData.budget,
        progress: projectData_result?.Progress || 0,
        createdDate: projectData_result?.CreatedDate || new Date().toISOString(),
        lastModified: projectData_result?.LastModified
      };

      logServiceOperation('project', 'UPDATE_PROJECT_SUCCESS', updatedProject);
      return updatedProject;
    } catch (error) {
      logServiceOperation('project', 'UPDATE_PROJECT_ERROR', { error });
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<void> {
    logServiceOperation('project', 'DELETE_PROJECT', { id });
    
    try {
      const result = await projecthub_sp_DeleteProjectService.projecthub_sp_DeleteProject(id);

      if (!result.success) {
        throw new Error(`Delete project failed: ${result.error?.message || 'Unknown error'}`);
      }

      logServiceOperation('project', 'DELETE_PROJECT_SUCCESS', { id });
    } catch (error) {
      logServiceOperation('project', 'DELETE_PROJECT_ERROR', { error });
      throw error;
    }
  }

  /**
   * Get all projects (for dropdown lists)
   */
  async getAllProjects(): Promise<Project[]> {
    logServiceOperation('project', 'GET_ALL_PROJECTS', {});
    
    try {
      const result = await projecthub_sp_GetAllProjectsService.projecthub_sp_GetAllProjects();

      if (!result.success) {
        throw new Error(`Get all projects failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const projectsData = data?.ResultSets?.Table1;
      
      // Handle both array and single object responses and map to Project interface
      let projects: Project[] = [];
      if (projectsData) {
        const rawProjects = Array.isArray(projectsData) ? projectsData : [projectsData];
        projects = rawProjects.map(p => ({
          id: p.Id || 0,
          name: p.Name || '',
          description: p.Description,
          clientId: p.ClientId || 0,
          clientName: p.ClientName,
          status: p.Status as Project['status'] || 'Planning',
          priority: p.Priority as Project['priority'] || 'Medium',
          startDate: p.StartDate,
          endDate: p.EndDate,
          estimatedHours: p.EstimatedHours,
          actualHours: p.ActualHours,
          budget: p.Budget,
          progress: p.Progress || 0,
          createdDate: p.CreatedDate || new Date().toISOString(),
          lastModified: p.LastModified,
          taskCount: p.TaskCount,
          completedTaskCount: p.CompletedTaskCount
        }));
      }

      logServiceOperation('project', 'GET_ALL_PROJECTS_SUCCESS', { count: projects.length });
      return projects;
    } catch (error) {
      logServiceOperation('project', 'GET_ALL_PROJECTS_ERROR', { error });
      throw error;
    }
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<Project> {
    logServiceOperation('project', 'GET_PROJECT', { id });
    
    try {
      const result = await projecthub_sp_GetProjectByIdService.projecthub_sp_GetProjectById(id);

      if (!result.success) {
        throw new Error(`Get project failed: ${result.error?.message || 'Unknown error'}`);
      }

      const projectsData = result.data?.ResultSets?.Table1?.[0];
      
      if (!projectsData) {
        throw new Error(`Project with ID ${id} not found`);
      }

      // Map the response to Project interface
      const project: Project = {
        id: projectsData.Id || 0,
        name: projectsData.Name || '',
        description: projectsData.Description,
        clientId: projectsData.ClientId || 0,
        clientName: projectsData.ClientName,
        status: projectsData.Status as Project['status'] || 'Planning',
        priority: projectsData.Priority as Project['priority'] || 'Medium',
        startDate: projectsData.StartDate,
        endDate: projectsData.EndDate,
        estimatedHours: projectsData.EstimatedHours,
        actualHours: projectsData.ActualHours,
        budget: projectsData.Budget,
        progress: projectsData.Progress || 0,
        createdDate: projectsData.CreatedDate || new Date().toISOString(),
        lastModified: projectsData.LastModified,
        taskCount: projectsData.TaskCount,
        completedTaskCount: projectsData.CompletedTaskCount
      };

      logServiceOperation('project', 'GET_PROJECT_SUCCESS', project);
      return project;
    } catch (error) {
      logServiceOperation('project', 'GET_PROJECT_ERROR', { error });
      throw error;
    }
  }
}
