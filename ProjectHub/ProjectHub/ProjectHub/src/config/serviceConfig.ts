import { ServiceFactory, SqlClientService, SqlProjectService, SqlTaskService, SqlDashboardService } from '../Services';
import { configureServiceLogging } from '../Services/serviceLogger';

/**
 * Service configuration - modify these constants to configure the app
 */
const CONFIG = {
  useRealApi: true,     // Set to true to use real API services (not implemented yet)
  
  // Logging configuration - flexible for any service
  logging: {
    enabled: true,          // Set to false to disable all logging
    logLevel: 'detailed' as const,      // 'basic' or 'detailed'
    services: {
      client: true,         // Enable/disable client service logging
      project: true,        // Enable/disable project service logging
      task: true,           // Enable/disable task service logging
      dashboard: true,      // Enable/disable dashboard service logging
      // Add any new services here as needed
    }
  }
};

// Export the configuration for use in ServiceFactory
export const SERVICE_CONFIG = CONFIG;

// Export the logging configuration for use in the logger
export const DEFAULT_LOG_CONFIG = CONFIG.logging;

/**
 * Configure services based on the CONFIG constant
 */
export const configureServices = () => {
  // Configure logging first
  configureServiceLogging(CONFIG.logging);
  
  // If use real apis, then configure the service client with the real SQL Client service
  if (CONFIG.useRealApi) {
     ServiceFactory.getInstance().configure({
      clientService: new SqlClientService(),
      projectService: new SqlProjectService(),
      taskService: new SqlTaskService(),
      dashboardService: new SqlDashboardService(),
     });
  }
}