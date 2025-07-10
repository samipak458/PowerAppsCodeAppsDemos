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
import { Warning20Regular } from '@fluentui/react-icons';
import type { Task } from '../../types';

const useStyles = makeStyles({
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      width: '100vw !important',
      height: '100vh !important',
      maxWidth: '100vw !important',
      maxHeight: '100vh !important',
      borderRadius: '0 !important',
      margin: '0 !important',
      minHeight: '100vh',
    },
  },
  
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalM,
    },
  },
  
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  
  warningIcon: {
    color: tokens.colorPaletteYellowForeground3,
    fontSize: '20px',
    flexShrink: 0,
  },
  
  warningText: {
    color: tokens.colorPaletteYellowForeground3,
    fontWeight: tokens.fontWeightMedium,
  },
  
  taskInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  taskTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  
  taskDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  
  taskMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
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
});

interface TaskDeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (task: Task) => Promise<void>;
  task: Task;
}

export const TaskDeleteConfirmationDialog: React.FC<TaskDeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  task,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(task);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return tokens.colorPaletteGreenForeground3;
      case 'In Progress':
        return tokens.colorPaletteBlueForeground2;
      case 'On Hold':
        return tokens.colorPaletteYellowForeground3;
      case 'Cancelled':
        return tokens.colorPaletteRedForeground3;
      default:
        return tokens.colorNeutralForeground2;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return tokens.colorPaletteRedForeground3;
      case 'High':
        return tokens.colorPaletteDarkOrangeForeground3;
      case 'Medium':
        return tokens.colorPaletteBlueForeground2;
      case 'Low':
        return tokens.colorNeutralForeground2;
      default:
        return tokens.colorNeutralForeground2;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>Confirm Task Deletion</DialogTitle>
        
        <DialogBody className={styles.dialogBody}>
          <div className={styles.warningContainer}>
            <Warning20Regular className={styles.warningIcon} />
            <Text className={styles.warningText}>
              This action cannot be undone. Are you sure you want to delete this task?
            </Text>
          </div>
          
          <div className={styles.taskInfo}>
            <Text className={styles.taskTitle}>{task.title}</Text>
            
            {task.description && (
              <Text className={styles.taskDetails}>{task.description}</Text>
            )}
            
            <div className={styles.taskMeta}>
              <Text>Project: {task.projectName || `Project ${task.projectId}`}</Text>
              {task.assignedTo && <Text>Assigned to: {task.assignedTo}</Text>}
              <Text>
                Status: <span style={{ color: getStatusColor(task.status) }}>{task.status}</span>
              </Text>
              <Text>
                Priority: <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span>
              </Text>
              {task.dueDate && <Text>Due Date: {formatDate(task.dueDate)}</Text>}
              {task.estimatedHours && <Text>Estimated Hours: {task.estimatedHours}</Text>}
              <Text>Progress: {task.progress}%</Text>
            </div>
          </div>
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
            {loading ? <Spinner size="tiny" /> : 'Delete Task'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};
