import type { IClientService, IProjectService, ITaskService, IDashboardService } from './interfaces';
import { MockClientService } from './implementations/MockClientService';
import { MockProjectService } from './implementations/MockProjectService';
import { MockTaskService } from './implementations/MockTaskService';
import { MockDashboardService } from './implementations/MockDashboardService';

/**
 * Service configuration type
 * This allows easy switching between different implementations
 */
export type ServiceConfig = {
  clientService: IClientService;
  projectService: IProjectService;
  taskService: ITaskService;
  dashboardService: IDashboardService;
};

/**
 * Service factory to create and manage service instances
 * This provides a single point to configure which implementations to use
 */
export class ServiceFactory {
  private static _instance: ServiceFactory;
  private _config: ServiceConfig;

  private constructor() {
    // Use service configuration to determine which implementations to use
    this._config = {
      clientService: new MockClientService(),
      projectService: new MockProjectService(), 
      taskService: new MockTaskService(),       
      dashboardService: new MockDashboardService(),
    };
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ServiceFactory {
    if (!ServiceFactory._instance) {
      ServiceFactory._instance = new ServiceFactory();
    }
    return ServiceFactory._instance;
  }

  /**
   * Configure services (useful for testing or switching implementations)
   */
  public configure(config: Partial<ServiceConfig>): void {
    this._config = { ...this._config, ...config };
  }

  /**
   * Get client service
   */
  public getClientService(): IClientService {
    return this._config.clientService;
  }

  /**
   * Get project service
   */
  public getProjectService(): IProjectService {
    return this._config.projectService;
  }

  /**
   * Get task service
   */
  public getTaskService(): ITaskService {
    return this._config.taskService;
  }

  /**
   * Get dashboard service
   */
  public getDashboardService(): IDashboardService {
    return this._config.dashboardService;
  }
}

/**
 * Convenience functions to get services
 * These provide a simple API for components to use
 */
export const getClientService = (): IClientService => ServiceFactory.getInstance().getClientService();
export const getProjectService = (): IProjectService => ServiceFactory.getInstance().getProjectService();
export const getTaskService = (): ITaskService => ServiceFactory.getInstance().getTaskService();
export const getDashboardService = (): IDashboardService => ServiceFactory.getInstance().getDashboardService();
