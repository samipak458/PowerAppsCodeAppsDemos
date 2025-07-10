import type { 
  Client, 
  PaginatedResponse, 
  ClientSearchParams, 
  ClientFormData 
} from '../../types';

/**
 * Interface for client data operations
 * This abstraction allows swapping between mock and real implementations
 */
export interface IClientService {
  /**
   * Search clients with pagination and filtering
   */
  searchClients(params: ClientSearchParams): Promise<PaginatedResponse<Client>>;
  
  /**
   * Get a client by ID
   */
  getClientById(id: number): Promise<Client | null>;
  
  /**
   * Create a new client
   */
  createClient(clientData: ClientFormData): Promise<Client>;
  
  /**
   * Update an existing client
   */
  updateClient(id: number, clientData: ClientFormData): Promise<Client>;
  
  /**
   * Delete a client
   */
  deleteClient(id: number): Promise<void>;
  
  /**
   * Get all active clients (for dropdown lists)
   */
  getAllClients(): Promise<Client[]>;
}
