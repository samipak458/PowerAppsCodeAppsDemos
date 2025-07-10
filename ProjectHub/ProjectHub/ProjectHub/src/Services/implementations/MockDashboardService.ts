import type { IDashboardService } from '../interfaces/IDashboardService';
import { MockDataService } from '../../utils/mockDataService';
import { logServiceOperation } from '../serviceLogger';

/**
 * Mock implementation of IDashboardService
 * Uses MockDataService internally but provides a clean interface
 * that can be swapped with real implementations later
 */
export class MockDashboardService implements IDashboardService {
  async getDashboardStats(): Promise<{
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    pendingTasks: number;
    overdueTasks: number;
  }> {
    logServiceOperation('dashboard', 'GET_DASHBOARD_STATS', {});
    const result = await MockDataService.getDashboardStats();
    logServiceOperation('dashboard', 'GET_DASHBOARD_STATS_RESULT', {}, result);
    return result;
  }
}
