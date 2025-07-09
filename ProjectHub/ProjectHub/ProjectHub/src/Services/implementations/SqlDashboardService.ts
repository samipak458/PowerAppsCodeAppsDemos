import type { IDashboardService } from '../interfaces/IDashboardService';
import { logServiceOperation } from '../serviceLogger';
import { projecthub_sp_GetDashboardStatsService } from '../projecthub_sp_GetDashboardStatsService';

/**
 * SQL implementation of IDashboardService
 * Uses real Power Apps stored procedures for dashboard data
 */
export class SqlDashboardService implements IDashboardService {
  
  async getDashboardStats(): Promise<{
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    pendingTasks: number;
    overdueTasks: number;
  }> {
    logServiceOperation('dashboard', 'GET_DASHBOARD_STATS', {});
    
    try {
      // Call the generated stored procedure service
      const result = await projecthub_sp_GetDashboardStatsService.projecthub_sp_GetDashboardStats();
      
      if (!result.success) {
        throw new Error(`Get dashboard stats failed: ${result.error?.message || 'Unknown error'}`);
      }
      
      // Extract the data from the response
      const statsData = result.data?.ResultSets?.Table1?.[0];
      
      if (!statsData) {
        throw new Error('No dashboard stats data returned');
      }
      
      // Map the database response to our interface
      const dashboardStats = {
        totalClients: statsData.ActiveClients || 0,
        totalProjects: statsData.ActiveProjects || 0,
        activeProjects: statsData.ActiveProjects || 0,
        pendingTasks: statsData.PendingTasks || 0,
        overdueTasks: 0 // This field doesn't exist in the current stored procedure response
      };
      
      logServiceOperation('dashboard', 'GET_DASHBOARD_STATS_RESULT', {}, dashboardStats);
      
      return dashboardStats;
      
    } catch (error) {
      logServiceOperation('dashboard', 'GET_DASHBOARD_STATS_ERROR', {}, error);
      throw error;
    }
  }
}
