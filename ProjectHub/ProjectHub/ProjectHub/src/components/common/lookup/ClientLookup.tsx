import { 
  Combobox, 
  Option, 
  useId,
  makeStyles,
  Spinner
} from '@fluentui/react-components';
import type { ComboboxOpenChangeData } from '@fluentui/react-components';
import { useState, useEffect, useMemo, useCallback } from 'react';

// Import the service factory to get client service
import { getClientService } from '../../../Services';

// Define client option interface
interface ClientOption {
  id: string | number;
  name: string;
}

// Define props interface
interface ClientLookupProps {
  selectedClientId?: string | number | null;
  onChange: (clientId: string | number | null, clientName?: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const useStyles = makeStyles({
  clientLookupContainer: {
    width: '100%',
  },
  
  comboboxDropdown: {
    maxHeight: '300px',
    overflowY: 'auto',
    '@media (max-width: 768px)': {
      maxHeight: '50vh',
      width: '100%',
    },
  },
});

export const ClientLookup: React.FC<ClientLookupProps> = ({
  selectedClientId,
  onChange,
  placeholder = "Search for a client...",
  required = false,
  className,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [inputValue, setInputValue] = useState('');
  const comboId = useId('client-lookup');
  const styles = useStyles();

  // Load selected client data when selectedClientId changes
  useEffect(() => {
    const fetchSelectedClient = async () => {
      if (!selectedClientId) {
        setSelectedClient(null);
        setInputValue('');
        return;
      }
      
      setIsLoading(true);
      try {
        const clientService = getClientService();
        const detailResponse = await clientService.getClientById(
          typeof selectedClientId === 'string' 
            ? parseInt(selectedClientId, 10) 
            : selectedClientId
        );
        
        if (detailResponse) {
          const clientDetail = {
            id: detailResponse.id,
            name: detailResponse.name
          };
          setSelectedClient(clientDetail);
          setInputValue(detailResponse.name);
        }
      } catch (error) {
        console.error('Error fetching client details:', error);
        setSelectedClient(null);
        setInputValue('');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSelectedClient();
  }, [selectedClientId]);
  
  // Helper function to sort clients alphabetically by name
  // Wrapped in useCallback to prevent it from changing on every render
  const sortClientsByName = useCallback((clientsToSort: ClientOption[]): ClientOption[] => {
    return [...clientsToSort].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, []);

  // Filter clients when search term changes
  useEffect(() => {
    // Don't search if empty - this prevents showing all clients when the dropdown first opens
    if (!searchTerm.trim() && clients.length === 0) {
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const clientService = getClientService();
        const response = await clientService.searchClients({
          pageNumber: 1,
          pageSize: 20,
          searchTerm: searchTerm,
          sortColumn: 'name',
          sortDirection: 'asc'
        });
        
        // Always ensure clients are sorted alphabetically by name
        const sortedClients = sortClientsByName(response.data || []);
        
        setClients(sortedClients);
      } catch (error) {
        console.error('Error searching clients:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce search for better performance
    
    return () => clearTimeout(timer);
  }, [searchTerm, clients.length, sortClientsByName]);

  // We don't need an extra effect here since we're already sorting in other places

  // Generate combobox options with sorted clients
  const options = useMemo(() => {
    // Don't show any options if the user hasn't searched yet and no client is selected
    if (clients.length === 0 && !searchTerm.trim() && !selectedClient) {
      return [];
    }
    
    // Ensure clients are always sorted when generating options
    const sortedClients = sortClientsByName(clients);
    
    return sortedClients.map((client: ClientOption) => (
      <Option key={client.id} value={client.id.toString()}>
        {client.name}
      </Option>
    ));
  }, [clients, searchTerm, selectedClient, sortClientsByName]);

  return (
    <div className={styles.clientLookupContainer}>
      <div style={{ position: 'relative' }}>
        {isLoading && (
          <div style={{ 
            position: 'absolute', 
            right: '8px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 1 
          }}>
            <Spinner size="tiny" />
          </div>
        )}
        <Combobox
          id={comboId}
          placeholder={placeholder}
          value={inputValue}
          selectedOptions={selectedClient ? [selectedClient.id.toString()] : []}
          onOptionSelect={(_, data) => {
            // Handle selection
            if (!data || !data.optionValue) {
              setSelectedClient(null);
              setInputValue('');
              onChange(null, '');
              return;
            }
            
            const selectedId = data.optionValue;
            const foundClient = clients.find(c => c.id.toString() === selectedId);
            
            if (foundClient) {
              setSelectedClient(foundClient);
              setInputValue(foundClient.name);
              onChange(foundClient.id, foundClient.name);
            } else {
              setSelectedClient(null);
              setInputValue('');
              onChange(null, '');
            }
          }}
          // For filtering as user types
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            const value = target.value;
            setInputValue(value);
            setSearchTerm(value);
            
            // Clear selection if the input doesn't match the selected client
            if (selectedClient && selectedClient.name !== value) {
              setSelectedClient(null);
              
              // Also notify parent about cleared selection
              if (!value.trim()) {
                onChange(null, '');
              }
            }              // No need to set dropdown state
            }}
            onOpenChange={useCallback((_event: React.SyntheticEvent, data: ComboboxOpenChangeData) => {
              // Load initial clients when dropdown opens
              if (data.open && clients.length === 0) {
                setSearchTerm(' '); // Trigger search with minimal term
              }
              
              // If the dropdown is opened and we already have clients, make sure they're sorted
              if (data.open && clients.length > 0) {
                setClients(sortClientsByName(clients));
              }
            }, [clients, setSearchTerm, setClients, sortClientsByName])}
          appearance="outline"
          className={className}
          disabled={disabled}
          autoComplete="off"
          required={required}
          freeform={true}
          listbox={{ className: styles.comboboxDropdown }}
        >
          {options}
        </Combobox>
      </div>
    </div>
  );
};
