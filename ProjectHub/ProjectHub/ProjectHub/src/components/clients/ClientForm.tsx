import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Field,
  Input,
  Textarea,
  Combobox,
  Option,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { Client, ClientFormData } from '../../types';

const useStyles = makeStyles({
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '500px',
    maxWidth: '600px',
    minHeight: '60vh',
    maxHeight: '90vh',
    '@media (max-width: 768px)': {
      width: '100vw !important',
      height: '100vh !important',
      maxWidth: '100vw !important',
      maxHeight: '100vh !important',
      borderRadius: '0 !important',
      margin: '0 !important',
      minHeight: '100vh',
      minWidth: 'unset',
    },
  },
  
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalM,
    },
  },
  
  dialogActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'flex-end',
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 768px)': {
      flexDirection: 'column-reverse',
      gap: tokens.spacingVerticalS,
      '& > button': {
        width: '100%',
        minHeight: '44px',
      },
    },
  },
  
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientFormData) => Promise<void>;
  client?: Client | null;
  mode: 'create' | 'edit';
}

export const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
  mode,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    industry: '',
    notes: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name,
        contactPerson: String(client.contactPerson || ''),
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: String(client.city || ''),
        state: String(client.state || ''),
        zipCode: String(client.zipCode || ''),
        country: String(client.country || ''),
        industry: String(client.industry || ''),
        notes: String(client.notes || ''),
        status: client.status,
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        industry: '',
        notes: '',
        status: 'Active',
      });
    }
    setErrors({});
  }, [client, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      // TODO: Show toast notification for error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Construction',
    'Education',
    'Government',
    'Non-Profit',
    'Other',
  ];

  const statusOptions = ['Active', 'Inactive', 'Prospect'];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>
          {mode === 'create' ? 'Create New Client' : 'Edit Client'}
        </DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          {/* Basic Information */}
          <Field 
            label="Client Name" 
            required 
            validationMessage={errors.name}
            validationState={errors.name ? 'error' : 'none'}
          >
            <Input
              value={formData.name}
              onChange={(_, data) => handleInputChange('name', data.value)}
              placeholder="Enter client name"
            />
          </Field>

          <div className={styles.formRow}>
            <Field 
              label="Contact Person" 
              required
              validationMessage={errors.contactPerson}
              validationState={errors.contactPerson ? 'error' : 'none'}
            >
              <Input
                value={formData.contactPerson}
                onChange={(_, data) => handleInputChange('contactPerson', data.value)}
                placeholder="Enter contact person"
              />
            </Field>

            <Field 
              label="Status" 
              required
            >
              <Combobox
                value={formData.status}
                onOptionSelect={(_, data) => handleInputChange('status', data.optionValue || 'Active')}
                placeholder="Select status"
              >
                {statusOptions.map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Combobox>
            </Field>
          </div>

          {/* Contact Information */}
          <div className={styles.formRow}>
            <Field 
              label="Email" 
              required
              validationMessage={errors.email}
              validationState={errors.email ? 'error' : 'none'}
            >
              <Input
                type="email"
                value={formData.email}
                onChange={(_, data) => handleInputChange('email', data.value)}
                placeholder="Enter email address"
              />
            </Field>

            <Field label="Phone">
              <Input
                type="tel"
                value={formData.phone}
                onChange={(_, data) => handleInputChange('phone', data.value)}
                placeholder="Enter phone number"
              />
            </Field>
          </div>

          {/* Address Information */}
          <Field label="Address">
            <Textarea
              value={formData.address}
              onChange={(_, data) => handleInputChange('address', data.value)}
              placeholder="Enter address"
              rows={2}
            />
          </Field>

          <div className={styles.formRow}>
            <Field label="City">
              <Input
                value={formData.city}
                onChange={(_, data) => handleInputChange('city', data.value)}
                placeholder="Enter city"
              />
            </Field>

            <Field label="State">
              <Input
                value={formData.state}
                onChange={(_, data) => handleInputChange('state', data.value)}
                placeholder="Enter state"
              />
            </Field>
          </div>

          <div className={styles.formRow}>
            <Field label="ZIP Code">
              <Input
                value={formData.zipCode}
                onChange={(_, data) => handleInputChange('zipCode', data.value)}
                placeholder="Enter ZIP code"
              />
            </Field>

            <Field label="Country">
              <Input
                value={formData.country}
                onChange={(_, data) => handleInputChange('country', data.value)}
                placeholder="Enter country"
              />
            </Field>
          </div>

          {/* Additional Information */}
          <Field label="Industry">
            <Combobox
              value={formData.industry}
              onOptionSelect={(_, data) => handleInputChange('industry', data.optionValue || '')}
              placeholder="Select industry"
              freeform
            >
              {industryOptions.map(industry => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Combobox>
          </Field>

          <Field label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(_, data) => handleInputChange('notes', data.value)}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </Field>
        </DialogBody>
        
        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            appearance="primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Spinner size="tiny" /> : (mode === 'create' ? 'Create Client' : 'Save Changes')}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
