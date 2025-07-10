import type { IClientService } from '../interfaces/IClientService';
import type { 
  Client, 
  PaginatedResponse, 
  ClientSearchParams, 
  ClientFormData 
} from '../../types';
import { logServiceOperation } from '../serviceLogger';

// Import the generated stored procedure services
import { projecthub_sp_SearchClientsService } from '../projecthub_sp_SearchClientsService';
import { projecthub_sp_GetAllClientsService } from '../projecthub_sp_GetAllClientsService';
import { projecthub_sp_GetClientByIdService } from '../projecthub_sp_GetClientByIdService';
import { projecthub_sp_CreateClientService } from '../projecthub_sp_CreateClientService';
import { projecthub_sp_UpdateClientService } from '../projecthub_sp_UpdateClientService';
import { projecthub_sp_DeleteClientService } from '../projecthub_sp_DeleteClientService';

/**
 * Real implementation of IClientService using stored procedure services
 * This implementation uses the generated services from Power Apps Code Apps CLI
 */
export class SqlClientService implements IClientService {
  
  /**
   * Search clients with pagination and filtering
   */
  async searchClients(params: ClientSearchParams): Promise<PaginatedResponse<Client>> {
    logServiceOperation('client', 'SEARCH_CLIENTS', params);
    
    try {
      const result = await projecthub_sp_SearchClientsService.projecthub_sp_SearchClients(
        params.companyFilter,
        params.pageNumber || 1,
        params.pageSize || 25,
        params.searchTerm,
        params.sortColumn || 'Name',
        params.sortDirection || 'asc',
        params.status,
        0 // TotalRecords - output parameter
      );

      if (!result.success) {
        throw new Error(`Search clients failed: ${result.error?.message || 'Unknown error'}`);
      }

      const data = result.data;
      const clientsData = data?.ResultSets?.Table1;
      
      // Handle both array and single object responses
      let clients: Client[] = [];
      if (Array.isArray(clientsData)) {
        clients = clientsData.map(this.mapToClient);
      } else if (clientsData) {
        clients = [this.mapToClient(clientsData)];
      }
      
      const totalRecords = data?.outputparameters?.TotalRecords || clients.length;
      
      const response: PaginatedResponse<Client> = {
        data: clients,
        totalRecords,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 25,
        totalPages: Math.ceil(totalRecords / (params.pageSize || 25))
      };

      logServiceOperation('client', 'SEARCH_CLIENTS_RESULT', params, response);
      return response;
    } catch (error) {
      logServiceOperation('client', 'SEARCH_CLIENTS_ERROR', params, error);
      throw error;
    }
  }

  /**
   * Get a client by ID
   */
  async getClientById(id: number): Promise<Client | null> {
    logServiceOperation('client', 'GET_CLIENT_BY_ID', { id });
    
    try {
      const result = await projecthub_sp_GetClientByIdService.projecthub_sp_GetClientById(id);

      if (!result.success) {
        throw new Error(`Get client by ID failed: ${result.error?.message || 'Unknown error'}`);
      }

      const clientData = result.data?.ResultSets?.Table1?.[0];
      const client = clientData ? this.mapToClient(clientData) : null;

      logServiceOperation('client', 'GET_CLIENT_BY_ID_RESULT', { id }, client);
      return client;
    } catch (error) {
      logServiceOperation('client', 'GET_CLIENT_BY_ID_ERROR', { id }, error);
      throw error;
    }
  }

  /**
   * Create a new client
   */
  async createClient(clientData: ClientFormData): Promise<Client> {
    logServiceOperation('client', 'CREATE_CLIENT', clientData);
    
    try {
      const result = await projecthub_sp_CreateClientService.projecthub_sp_CreateClient(
        clientData.address,
        clientData.city,
        clientData.name, // Use name as company
        clientData.contactPerson,
        clientData.country,
        clientData.email,
        clientData.industry,
        clientData.name,
        clientData.notes,
        clientData.phone,
        clientData.state,
        clientData.status,
        clientData.zipCode
      );

      if (!result.success) {
        throw new Error(`Create client failed: ${result.error?.message || 'Unknown error'}`);
      }

      const createdClientData = result.data?.ResultSets?.Table1?.[0];
      if (!createdClientData) {
        throw new Error('Created client data not returned from stored procedure');
      }

      const client = this.mapToClient(createdClientData);
      logServiceOperation('client', 'CREATE_CLIENT_RESULT', clientData, client);
      return client;
    } catch (error) {
      logServiceOperation('client', 'CREATE_CLIENT_ERROR', clientData, error);
      throw error;
    }
  }

  /**
   * Update an existing client
   */
  async updateClient(id: number, clientData: ClientFormData): Promise<Client> {
    logServiceOperation('client', 'UPDATE_CLIENT', { id, ...clientData });
    
    try {
      const result = await projecthub_sp_UpdateClientService.projecthub_sp_UpdateClient(
        clientData.address,
        clientData.city,
        clientData.name, // Use name as company
        clientData.contactPerson,
        clientData.country,
        clientData.email,
        id,
        clientData.industry,
        clientData.name,
        clientData.notes,
        clientData.phone,
        clientData.state,
        clientData.status,
        clientData.zipCode
      );

      if (!result.success) {
        throw new Error(`Update client failed: ${result.error?.message || 'Unknown error'}`);
      }

      const updatedClientData = result.data?.ResultSets?.Table1?.[0];
      if (!updatedClientData) {
        throw new Error('Updated client data not returned from stored procedure');
      }

      const client = this.mapToClient(updatedClientData);
      logServiceOperation('client', 'UPDATE_CLIENT_RESULT', { id, ...clientData }, client);
      return client;
    } catch (error) {
      logServiceOperation('client', 'UPDATE_CLIENT_ERROR', { id, ...clientData }, error);
      throw error;
    }
  }

  /**
   * Delete a client
   */
  async deleteClient(id: number): Promise<void> {
    logServiceOperation('client', 'DELETE_CLIENT', { id });
    
    try {
      const result = await projecthub_sp_DeleteClientService.projecthub_sp_DeleteClient(id);

      if (!result.success) {
        throw new Error(`Delete client failed: ${result.error?.message || 'Unknown error'}`);
      }

      logServiceOperation('client', 'DELETE_CLIENT_RESULT', { id }, 'deleted');
    } catch (error) {
      logServiceOperation('client', 'DELETE_CLIENT_ERROR', { id }, error);
      throw error;
    }
  }

  /**
   * Get all active clients (for dropdown lists)
   */
  async getAllClients(): Promise<Client[]> {
    logServiceOperation('client', 'GET_ALL_CLIENTS', {});
    
    try {
      const result = await projecthub_sp_GetAllClientsService.projecthub_sp_GetAllClients();

      if (!result.success) {
        throw new Error(`Get all clients failed: ${result.error?.message || 'Unknown error'}`);
      }

      const clients = result.data?.ResultSets?.Table1;
      
      // Handle both array and single object responses
      let clientList: Client[] = [];
      if (Array.isArray(clients)) {
        clientList = clients.map(this.mapToClient);
      } else if (clients) {
        clientList = [this.mapToClient(clients)];
      }
      
      logServiceOperation('client', 'GET_ALL_CLIENTS_RESULT', {}, clientList);
      return clientList;
    } catch (error) {
      logServiceOperation('client', 'GET_ALL_CLIENTS_ERROR', {}, error);
      throw error;
    }
  }

  /**
   * Map stored procedure result to Client type
   */
  private mapToClient(data: Record<string, unknown>): Client {
    return {
      id: (data.Id as number) || 0,
      name: (data.Name as string) || '',
      contactPerson: (data.ContactPerson as string) || '',
      email: (data.Email as string) || '',
      phone: data.Phone as string,
      company: data.Company as string,
      address: data.Address as string,
      city: data.City as string,
      state: data.State as string,
      zipCode: data.ZipCode as string,
      country: data.Country as string,
      industry: data.Industry as string,
      notes: data.Notes as string,
      status: (data.Status as Client['status']) || 'Active',
      createdDate: (data.CreatedDate as string) || new Date().toISOString(),
      lastModified: data.LastModified as string,
      projectCount: (data.ProjectCount as number) || 0,
      createdAt: (data.CreatedDate as string) || new Date().toISOString(), // For compatibility
    };
  }
}
