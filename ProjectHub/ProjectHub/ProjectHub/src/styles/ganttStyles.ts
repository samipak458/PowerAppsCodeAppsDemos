import { makeStyles, tokens } from '@fluentui/react-components';

/**
 * Styles for the Gantt chart component
 */
export const useGanttStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: tokens.spacingVerticalM,
  },
  
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
  },
  
  toolbarSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
      justifyContent: 'center',
    },
  },
  
  ganttContainer: {
    flex: 1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '500px',
    height: '100%',
    '@media (max-width: 768px)': {
      minHeight: '400px',
    },
  },
  
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground3,
  },
  
  errorContainer: {
    marginBottom: tokens.spacingVerticalM,
  },
});
