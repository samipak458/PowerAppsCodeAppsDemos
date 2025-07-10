import React, { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Text,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { WarningRegular } from '@fluentui/react-icons';
import type { Client } from '../../types';

const useStyles = makeStyles({
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      width: '100vw !important',
      height: '100vh !important',
      maxWidth: '100vw !important',
      maxHeight: '100vh !important',
      borderRadius: '0 !important',
      margin: '0 !important',
      minWidth: 'unset',
    },
  },
  
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalM,
      flex: 1,
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
  
  warningContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  
  warningIcon: {
    color: tokens.colorPaletteYellowForeground3,
    fontSize: '20px',
    marginTop: '2px',
  },
  
  warningText: {
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  
  clientInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  clientName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  
  clientDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  
  deleteButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorPaletteRedForeground3,
    '&:hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
    '@media (max-width: 768px)': {
      fontWeight: tokens.fontWeightMedium,
    },
  },
  
  projectsWarning: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
  },
  
  projectsWarningText: {
    color: tokens.colorPaletteRedForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
  },
});

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (client: Client) => Promise<void>;
  client: Client;
  hasActiveProjects?: boolean;
  activeProjectsCount?: number;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  client,
  hasActiveProjects = false,
  activeProjectsCount = 0,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(client);
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      // TODO: Show toast notification for error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>Confirm Delete Client</DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          <div className={styles.warningContainer}>
            <WarningRegular className={styles.warningIcon} />
            <Text className={styles.warningText}>
              This action cannot be undone. Are you sure you want to delete this client?
            </Text>
          </div>
          
          <div className={styles.clientInfo}>
            <Text className={styles.clientName}>{client.name}</Text>
            <Text className={styles.clientDetails}>
              Contact: {client.contactPerson} • {client.email}
            </Text>
            <Text className={styles.clientDetails}>
              Status: {client.status} • Created: {new Date(String(client.createdAt)).toLocaleDateString()}
            </Text>
          </div>

          {hasActiveProjects && (
            <div className={styles.projectsWarning}>
              <Text className={styles.projectsWarningText}>
                ⚠️ Warning: This client has {activeProjectsCount} active project{activeProjectsCount !== 1 ? 's' : ''}. 
                Deleting this client will also affect related project data.
              </Text>
            </div>
          )}
        </DialogBody>
        
        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            appearance="primary"
            onClick={handleConfirm}
            disabled={loading}
            className={styles.deleteButton}
          >
            {loading ? <Spinner size="tiny" /> : 'Delete Client'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
