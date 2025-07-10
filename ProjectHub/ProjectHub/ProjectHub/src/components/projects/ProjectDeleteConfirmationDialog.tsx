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
import type { Project } from '../../types';

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
  
  projectInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  projectName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  
  projectDetails: {
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
  
  tasksWarning: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
  },
  
  tasksWarningText: {
    color: tokens.colorPaletteRedForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
  },
});

interface ProjectDeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (project: Project) => Promise<void>;
  project: Project;
  hasActiveTasks?: boolean;
  activeTasksCount?: number;
}

export const ProjectDeleteConfirmationDialog: React.FC<ProjectDeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  project,
  hasActiveTasks = false,
  activeTasksCount = 0,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(project);
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
        <DialogTitle>Confirm Delete Project</DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          <div className={styles.warningContainer}>
            <WarningRegular className={styles.warningIcon} />
            <Text className={styles.warningText}>
              This action cannot be undone. Are you sure you want to delete this project?
            </Text>
          </div>
          
          <div className={styles.projectInfo}>
            <Text className={styles.projectName}>{project.name}</Text>
            <Text className={styles.projectDetails}>
              Client: {project.clientName} • Status: {project.status}
            </Text>
            <Text className={styles.projectDetails}>
              Priority: {project.priority} • Budget: ${project.budget?.toLocaleString() || '0'}
            </Text>
            <Text className={styles.projectDetails}>
              Progress: {project.progress}% • Created: {new Date(String(project.createdDate)).toLocaleDateString()}
            </Text>
          </div>

          {hasActiveTasks && (
            <div className={styles.tasksWarning}>
              <Text className={styles.tasksWarningText}>
                ⚠️ Warning: This project has {activeTasksCount} active task{activeTasksCount !== 1 ? 's' : ''}. 
                Deleting this project will also delete all associated tasks.
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
            {loading ? <Spinner size="tiny" /> : 'Delete Project'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
