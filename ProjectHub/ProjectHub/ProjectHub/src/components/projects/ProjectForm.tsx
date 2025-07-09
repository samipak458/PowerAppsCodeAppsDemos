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
import { ClientLookup } from '../common/lookup/ClientLookup';
import type { Project, ProjectFormData, Client } from '../../types';

const useStyles = makeStyles({
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '600px',
    maxWidth: '700px',
    minHeight: '70vh',
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

  formRowThree: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectFormData) => Promise<void>;
  project?: Project | null;
  mode: 'create' | 'edit';
  clients: Client[];
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  mode,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    clientId: 0,
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    estimatedHours: 0,
    budget: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        name: project.name,
        description: project.description || '',
        clientId: project.clientId,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        estimatedHours: project.estimatedHours || 0,
        budget: project.budget || 0,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        clientId: 0,
        status: 'Planning',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        estimatedHours: 0,
        budget: 0,
      });
    }
    setErrors({});
  }, [project, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.clientId || formData.clientId === 0) {
      newErrors.clientId = 'Please select a client';
    }
    if (formData.estimatedHours && formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Estimated hours cannot be negative';
    }
    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
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

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const statusOptions = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>
          {mode === 'create' ? 'Create New Project' : 'Edit Project'}
        </DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          {/* Basic Information */}
          <Field 
            label="Project Name" 
            required 
            validationMessage={errors.name}
            validationState={errors.name ? 'error' : 'none'}
          >
            <Input
              value={formData.name}
              onChange={(_, data) => handleInputChange('name', data.value)}
              placeholder="Enter project name"
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={formData.description}
              onChange={(_, data) => handleInputChange('description', data.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </Field>

          <div className={styles.formRow}>
            <Field 
              label="Client" 
              required
              validationMessage={errors.clientId}
              validationState={errors.clientId ? 'error' : 'none'}
            >
              <ClientLookup
                selectedClientId={formData.clientId || undefined}
                onChange={(clientId, clientName) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    clientId: typeof clientId === 'string' ? parseInt(clientId, 10) : (clientId || 0),
                    clientName
                  }));
                  if (errors.clientId) {
                    setErrors(prev => ({ ...prev, clientId: undefined }));
                  }
                }}
                required={true}
                placeholder="Search for a client..."
              />
            </Field>

            <Field label="Priority">
              <Combobox
                value={formData.priority}
                onOptionSelect={(_, data) => handleInputChange('priority', data.optionValue || 'Medium')}
                placeholder="Select priority"
              >
                {priorityOptions.map(priority => (
                  <Option key={priority} value={priority}>
                    {priority}
                  </Option>
                ))}
              </Combobox>
            </Field>
          </div>

          <div className={styles.formRow}>
            <Field label="Status">
              <Combobox
                value={formData.status}
                onOptionSelect={(_, data) => handleInputChange('status', data.optionValue || 'Planning')}
                placeholder="Select status"
              >
                {statusOptions.map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Combobox>
            </Field>

            <Field 
              label="Budget" 
              validationMessage={errors.budget}
              validationState={errors.budget ? 'error' : 'none'}
            >
              <Input
                type="number"
                value={formData.budget?.toString() || ''}
                onChange={(_, data) => handleInputChange('budget', parseFloat(data.value) || 0)}
                placeholder="Enter budget"
                contentBefore="$"
              />
            </Field>
          </div>

          {/* Timeline */}
          <div className={styles.formRow}>
            <Field label="Start Date">
              <Input
                type="date"
                value={formData.startDate}
                onChange={(_, data) => handleInputChange('startDate', data.value)}
              />
            </Field>

            <Field 
              label="End Date"
              validationMessage={errors.endDate}
              validationState={errors.endDate ? 'error' : 'none'}
            >
              <Input
                type="date"
                value={formData.endDate}
                onChange={(_, data) => handleInputChange('endDate', data.value)}
              />
            </Field>
          </div>

          <Field 
            label="Estimated Hours" 
            validationMessage={errors.estimatedHours}
            validationState={errors.estimatedHours ? 'error' : 'none'}
          >
            <Input
              type="number"
              value={formData.estimatedHours?.toString() || ''}
              onChange={(_, data) => handleInputChange('estimatedHours', parseFloat(data.value) || 0)}
              placeholder="Enter estimated hours"
              contentAfter="hours"
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
            {loading ? <Spinner size="tiny" /> : (mode === 'create' ? 'Create Project' : 'Save Changes')}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
