import React, { useState, useEffect, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Input,
  Dropdown,
  Option,
  Badge,
  Card,
} from '@fluentui/react-components';
import { Add20Regular, Search20Regular, Filter20Regular } from '@fluentui/react-icons';
import { ResponsiveDataGrid } from '../components/common/ResponsiveDataGrid';
import { ClientForm } from '../components/clients/ClientForm';
import { DeleteConfirmationDialog } from '../components/clients/DeleteConfirmationDialog';
import { getClientService } from '../Services/ServiceFactory';
import type { Client, ClientSearchParams, ClientFormData } from '../types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalM,
      alignItems: 'stretch',
    },
  },
  
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  
  searchSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  
  searchInput: {
    minWidth: '300px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      width: '100%',
    },
  },
  
  filterDropdown: {
    minWidth: '150px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      width: '100%',
    },
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  
  errorCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorPaletteRedBackground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    color: tokens.colorPaletteRedForeground1,
  },
  
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
  },
  
  paginationInfo: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  
  paginationControls: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
});

export const ClientsPage: React.FC = () => {
  const styles = useStyles();
  
  // State management
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<ClientSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortColumn: 'name',
    sortDirection: 'asc',
    searchTerm: '',
    status: '',
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // CRUD Dialog state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  // Load clients data
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const clientService = getClientService();
      const response = await clientService.searchClients(searchParams);
      setClients(response.data);
      setTotalRecords(response.totalRecords);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('Failed to load clients. Please try again.');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Load data on mount and when search params change
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Event handlers
  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => ({
      ...prev,
      searchTerm,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: status,  // Now directly use the value (empty string for "All Status")
      pageNumber: 1, // Reset to first page
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setSearchParams(prev => ({
      ...prev,
      pageNumber,
    }));
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleDelete = (client: Client) => {
    setDeletingClient(client);
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleSort = (columnKey: keyof Client, direction: 'asc' | 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sortColumn: String(columnKey),
      sortDirection: direction,
      pageNumber: 1, // Reset to first page when sorting
    }));
  };

  // Helper function for status badge styling
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case 'Active':
        return { 
          appearance: 'filled' as const, 
          color: 'brand' as const 
        };
      case 'Inactive':
        return { 
          appearance: 'outline' as const, 
          color: 'danger' as const 
        };
      case 'Prospect':
        return { 
          appearance: 'filled' as const, 
          color: 'warning' as const 
        };
      default:
        return { 
          appearance: 'outline' as const, 
          color: 'subtle' as const 
        };
    }
  };

  // CRUD operations
  const handleSaveClient = async (clientData: ClientFormData) => {
    try {
      const clientService = getClientService();
      if (editingClient) {
        // Update existing client
        await clientService.updateClient(editingClient.id, clientData);
      } else {
        // Create new client
        await clientService.createClient(clientData);
      }
      await loadClients(); // Refresh the list
      setEditingClient(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to save client:', err);
      setError('Failed to save client. Please try again.');
      throw err; // Re-throw to let the dialog handle the error state
    }
  };

  const handleConfirmDelete = async (client: Client) => {
    try {
      const clientService = getClientService();
      await clientService.deleteClient(client.id);
      await loadClients(); // Refresh the list
      setDeletingClient(null);
    } catch (err) {
      console.error('Failed to delete client:', err);
      setError('Failed to delete client. Please try again.');
      throw err; // Re-throw to let the dialog handle the error state
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name' as keyof Client,
      header: 'Name',
      render: (value: unknown) => (
        <Text weight="semibold">{String(value)}</Text>
      ),
    },
    {
      key: 'email' as keyof Client,
      header: 'Email',
    },
    {
      key: 'company' as keyof Client,
      header: 'Company',
    },
    {
      key: 'status' as keyof Client,
      header: 'Status',
      render: (value: unknown) => {
        const statusProps = getStatusBadgeProps(String(value));
        return (
          <Badge 
            appearance={statusProps.appearance}
            color={statusProps.color}
          >
            {String(value)}
          </Badge>
        );
      },
    },
    {
      key: 'projectCount' as keyof Client,
      header: 'Projects',
      render: (value: unknown) => (
        <Text>{value ? String(value) : '0'}</Text>
      ),
    },
    {
      key: 'createdDate' as keyof Client,
      header: 'Created',
      render: (value: unknown) => {
        if (!value) return '';
        const date = new Date(String(value));
        return date.toLocaleDateString();
      },
    },
  ];

  // Mobile card fields
  const mobileCardFields = [
    {
      key: 'name' as keyof Client,
      label: 'Name',
      render: (value: unknown) => (
        <Text weight="semibold">{String(value)}</Text>
      ),
    },
    {
      key: 'email' as keyof Client,
      label: 'Email',
    },
    {
      key: 'company' as keyof Client,
      label: 'Company',
    },
    {
      key: 'status' as keyof Client,
      label: 'Status',
      render: (value: unknown) => {
        const statusProps = getStatusBadgeProps(String(value));
        return (
          <Badge 
            appearance={statusProps.appearance}
            color={statusProps.color}
          >
            {String(value)}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text className={styles.title}>
          Clients ({totalRecords} total)
        </Text>
        <Button 
          appearance="primary" 
          icon={<Add20Regular />}
          onClick={handleCreateNew}
        >
          New Client
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder="Search clients by name, email, or company..."
          value={searchParams.searchTerm}
          onChange={(_, data) => handleSearch(data.value)}
          contentBefore={<Search20Regular />}
        />
        
        <Dropdown
          className={styles.filterDropdown}
          placeholder="Filter by status"
          value={searchParams.status || ''}
          selectedOptions={searchParams.status ? [searchParams.status] : ['']}
          onOptionSelect={(_, data) => handleStatusFilter(data.optionValue || '')}
        >
          <Option value="">All Status</Option>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
          <Option value="Prospect">Prospect</Option>
        </Dropdown>
        
        <Button
          appearance="outline"
          icon={<Filter20Regular />}
        >
          More Filters
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className={styles.errorCard}>
          <Text>{error}</Text>
          <Button 
            appearance="outline" 
            onClick={loadClients}
            style={{ marginTop: tokens.spacingVerticalS }}
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Content */}
      <div className={styles.content}>
        {!error && (
          <ResponsiveDataGrid
            items={clients}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
            sortColumn={searchParams.sortColumn as keyof Client}
            sortDirection={searchParams.sortDirection}
            mobileCardFields={mobileCardFields}
            keyField="id"
          />
        )}

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className={styles.pagination}>
            <Text className={styles.paginationInfo}>
              Showing {((searchParams.pageNumber - 1) * searchParams.pageSize) + 1} to{' '}
              {Math.min(searchParams.pageNumber * searchParams.pageSize, totalRecords)} of{' '}
              {totalRecords} clients
            </Text>
            
            <div className={styles.paginationControls}>
              <Button
                appearance="outline"
                disabled={searchParams.pageNumber <= 1 || loading}
                onClick={() => handlePageChange(searchParams.pageNumber - 1)}
              >
                Previous
              </Button>
              
              <Text>{searchParams.pageNumber} of {totalPages}</Text>
              
              <Button
                appearance="outline"
                disabled={searchParams.pageNumber >= totalPages || loading}
                onClick={() => handlePageChange(searchParams.pageNumber + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && clients.length === 0 && (
          <Card>
            <div className={styles.emptyState}>
              <Text>
                {searchParams.searchTerm || (searchParams.status && searchParams.status.trim() !== '')
                  ? 'No clients found matching your search criteria.' 
                  : 'No clients yet. Create your first client to get started!'}
              </Text>
              {!searchParams.searchTerm && !(searchParams.status && searchParams.status.trim() !== '') && (
                <Button 
                  appearance="primary" 
                  onClick={handleCreateNew}
                  style={{ marginTop: tokens.spacingVerticalM }}
                >
                  Create Your First Client
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* CRUD Dialogs */}
      {showCreateForm && (
        <ClientForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSave={handleSaveClient}
          mode="create"
        />
      )}

      {editingClient && (
        <ClientForm
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleSaveClient}
          client={editingClient}
          mode="edit"
        />
      )}

      {deletingClient && (
        <DeleteConfirmationDialog
          isOpen={!!deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleConfirmDelete}
          client={deletingClient}
          hasActiveProjects={false} // TODO: Check if client has active projects
          activeProjectsCount={0} // TODO: Get actual count
        />
      )}
    </div>
  );
};
