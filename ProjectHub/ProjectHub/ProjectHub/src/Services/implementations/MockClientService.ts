import type { IClientService } from '../interfaces/IClientService';
import type { 
  Client, 
  PaginatedResponse, 
  ClientSearchParams, 
  ClientFormData 
} from '../../types';
import { MockDataService } from '../../utils/mockDataService';
import { logServiceOperation } from '../serviceLogger';

/**
 * Mock implementation of IClientService
 * Uses MockDataService internally but provides a clean interface
 * that can be swapped with real implementations later
 */
export class MockClientService implements IClientService {
  async searchClients(params: ClientSearchParams): Promise<PaginatedResponse<Client>> {
    logServiceOperation('client', 'SEARCH_CLIENTS', params);
    const result = await MockDataService.searchClients(params);
    logServiceOperation('client', 'SEARCH_CLIENTS_RESULT', params, result.data);
    return result;
  }

  async getClientById(id: number): Promise<Client | null> {
    logServiceOperation('client', 'GET_CLIENT_BY_ID', { id });
    const result = await MockDataService.getClientById(id);
    logServiceOperation('client', 'GET_CLIENT_BY_ID_RESULT', { id }, result);
    return result;
  }

  async createClient(clientData: ClientFormData): Promise<Client> {
    logServiceOperation('client', 'CREATE_CLIENT', clientData);
    const result = await MockDataService.createClient(clientData);
    logServiceOperation('client', 'CREATE_CLIENT_RESULT', clientData, result);
    return result;
  }

  async updateClient(id: number, clientData: ClientFormData): Promise<Client> {
    logServiceOperation('client', 'UPDATE_CLIENT', { id, ...clientData });
    const result = await MockDataService.updateClient(id, clientData);
    logServiceOperation('client', 'UPDATE_CLIENT_RESULT', { id, ...clientData }, result);
    return result;
  }

  async deleteClient(id: number): Promise<void> {
    logServiceOperation('client', 'DELETE_CLIENT', { id });
    await MockDataService.deleteClient(id);
    logServiceOperation('client', 'DELETE_CLIENT_RESULT', { id }, 'deleted');
  }

  async getAllClients(): Promise<Client[]> {
    logServiceOperation('client', 'GET_ALL_CLIENTS', {});
    const result = await MockDataService.getAllClients();
    logServiceOperation('client', 'GET_ALL_CLIENTS_RESULT', {}, result);
    return result;
  }
}
