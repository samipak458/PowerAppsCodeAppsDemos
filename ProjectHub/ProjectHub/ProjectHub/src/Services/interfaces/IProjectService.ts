import type { 
  Project, 
  PaginatedResponse, 
  ProjectSearchParams, 
  ProjectFormData 
} from '../../types';

/**
 * Interface for project data operations
 * This abstraction allows swapping between mock and real implementations
 */
export interface IProjectService {
  /**
   * Search projects with pagination and filtering
   */
  searchProjects(params: ProjectSearchParams): Promise<PaginatedResponse<Project>>;
  
  /**
   * Create a new project
   */
  createProject(projectData: ProjectFormData): Promise<Project>;
  
  /**
   * Update an existing project
   */
  updateProject(id: number, projectData: ProjectFormData): Promise<Project>;
  
  /**
   * Delete a project
   */
  deleteProject(id: number): Promise<void>;
  
  /**
   * Get all projects (for dropdown lists)
   */
  getAllProjects(): Promise<Project[]>;
  
  /**
   * Get a single project by ID
   */
  getProject(id: number): Promise<Project>;
}
