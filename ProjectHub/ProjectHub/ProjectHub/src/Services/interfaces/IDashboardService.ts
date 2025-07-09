/**
 * Interface for dashboard statistics
 * This abstraction allows swapping between mock and real implementations
 */
export interface IDashboardService {
  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Promise<{
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    pendingTasks: number;
    overdueTasks: number;
  }>;
}
