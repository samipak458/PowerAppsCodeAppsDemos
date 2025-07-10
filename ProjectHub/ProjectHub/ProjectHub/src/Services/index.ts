// Service interfaces
export type { IClientService, IProjectService, ITaskService, IDashboardService } from './interfaces';

// Service factory and convenience functions
export { ServiceFactory, getClientService, getProjectService, getTaskService, getDashboardService } from './ServiceFactory';

// Service logging (for development and debugging)
export { serviceLogger, logServiceOperation, configureServiceLogging } from './serviceLogger';

// Real implementations
export { SqlClientService } from './implementations/SqlClientService';
export { SqlProjectService } from './implementations/SqlProjectService';
export { SqlTaskService } from './implementations/SqlTaskService';
export { SqlDashboardService } from './implementations/SqlDashboardService';

// Mock implementations (for testing and development)
export { MockClientService } from './implementations/MockClientService';
export { MockProjectService } from './implementations/MockProjectService';
export { MockTaskService } from './implementations/MockTaskService';
export { MockDashboardService } from './implementations/MockDashboardService';
