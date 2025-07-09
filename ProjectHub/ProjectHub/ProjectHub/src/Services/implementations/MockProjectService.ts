import type { IProjectService } from '../interfaces/IProjectService';
import type { 
  Project, 
  PaginatedResponse, 
  ProjectSearchParams, 
  ProjectFormData 
} from '../../types';
import { MockDataService } from '../../utils/mockDataService';
import { logServiceOperation } from '../serviceLogger';

/**
 * Mock implementation of IProjectService
 * Uses MockDataService internally but provides a clean interface
 * that can be swapped with real implementations later
 */
export class MockProjectService implements IProjectService {
  async searchProjects(params: ProjectSearchParams): Promise<PaginatedResponse<Project>> {
    logServiceOperation('project', 'SEARCH_PROJECTS', params);
    const result = await MockDataService.searchProjects(params);
    logServiceOperation('project', 'SEARCH_PROJECTS_RESULT', params, result.data);
    return result;
  }

  async createProject(projectData: ProjectFormData): Promise<Project> {
    logServiceOperation('project', 'CREATE_PROJECT', projectData);
    const result = await MockDataService.createProject(projectData);
    logServiceOperation('project', 'CREATE_PROJECT_RESULT', projectData, result);
    return result;
  }

  async updateProject(id: number, projectData: ProjectFormData): Promise<Project> {
    logServiceOperation('project', 'UPDATE_PROJECT', { id, ...projectData });
    const result = await MockDataService.updateProject(id, projectData);
    logServiceOperation('project', 'UPDATE_PROJECT_RESULT', { id, ...projectData }, result);
    return result;
  }

  async deleteProject(id: number): Promise<void> {
    logServiceOperation('project', 'DELETE_PROJECT', { id });
    await MockDataService.deleteProject(id);
    logServiceOperation('project', 'DELETE_PROJECT_RESULT', { id }, 'deleted');
  }

  async getProject(id: number): Promise<Project> {
    logServiceOperation('project', 'GET_PROJECT', { id });
    const result = await MockDataService.getProject(id);
    logServiceOperation('project', 'GET_PROJECT_RESULT', { id }, result);
    return result;
  }

  async getAllProjects(): Promise<Project[]> {
    logServiceOperation('project', 'GET_ALL_PROJECTS', {});
    const result = await MockDataService.getAllProjects();
    logServiceOperation('project', 'GET_ALL_PROJECTS_RESULT', {}, result);
    return result;
  }
}
