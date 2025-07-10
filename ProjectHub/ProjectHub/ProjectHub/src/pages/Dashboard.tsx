import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  Button,
  Skeleton,
  SkeletonItem,
  Badge,
} from '@fluentui/react-components';
import {
  People20Regular,
  FolderList20Regular,
  CheckboxChecked20Regular,
  Add20Regular,
  Calendar20Regular,
  Warning20Regular,
  ChartMultiple20Regular,
  DataTrending20Regular,
} from '@fluentui/react-icons';
import { getDashboardService } from '../Services';
import { useUserProfile } from '../hooks/useUserProfile';

const useStyles = makeStyles({
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '100vh',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: tokens.spacingVerticalM,
      alignItems: 'stretch',
      padding: tokens.spacingVerticalM,
    },
  },
  
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundOnBrand,
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    letterSpacing: '-0.02em',
    '&::before': {
      content: '"🚀"',
      fontSize: tokens.fontSizeBase500,
    },
  },
  
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.85,
    marginTop: tokens.spacingVerticalXXS,
    fontWeight: tokens.fontWeightRegular,
  },
  
  quickActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  
  primaryButton: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    border: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
    },
  },
  
  secondaryButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
    },
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalL,
  },
  
  statCard: {
    padding: tokens.spacingVerticalL,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
    },
  },
  
  statCardClients: {
    backgroundColor: tokens.colorBrandBackground,
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  
  statCardProjects: {
    backgroundColor: tokens.colorPaletteMarigoldBackground1,
    border: `1px solid ${tokens.colorPaletteMarigoldBorder1}`,
  },
  
  statCardActive: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    border: `1px solid ${tokens.colorPaletteGreenBorder1}`,
  },
  
  statCardTasks: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  
  statCardWarning: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
  },
  
  statCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalM,
  },
  
  statIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  
  statIcon: {
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    fontSize: '16px',
  },
  
  statIconClients: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
  },
  
  statIconProjects: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    color: tokens.colorPaletteMarigoldForeground2,
  },
  
  statIconActive: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  
  statIconTasks: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  
  statIconWarning: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  statNumber: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXXS,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  
  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    marginTop: tokens.spacingVerticalXXS,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorPaletteGreenForeground2,
    fontWeight: tokens.fontWeightMedium,
  },
  
  progressSection: {
    marginTop: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  
  progressBar: {
    height: '4px',
    borderRadius: tokens.borderRadiusSmall,
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground3,
    marginTop: tokens.spacingVerticalXXS,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorPaletteGreenBackground2,
    transition: 'width 1.2s ease-out',
  },
  
  welcomeSection: {
    marginTop: tokens.spacingVerticalL,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: tokens.spacingVerticalM,
  },
  
  welcomeCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  
  welcomeText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForegroundOnBrand,
    marginBottom: tokens.spacingVerticalM,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: 1.5,
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  
  quickStartCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  quickStartTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    '&::before': {
      content: '"⚡"',
      fontSize: tokens.fontSizeBase300,
    },
  },
  
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalM,
  },
  
  actionButton: {
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    transition: 'all 0.2s ease',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  
  loadingCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.7 },
  },
});

interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  pendingTasks: number;
  overdueTasks: number;
}

// Animated counter hook for fancy number animations
const useAnimatedCounter = (endValue: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration]);
  
  return count;
};

export const Dashboard: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user profile for personalized greeting
  const { profile: userProfile } = useUserProfile();
  
  // Get the user's first name for personalized greeting
  const getPersonalizedTitle = () => {
    const firstName = userProfile?.givenName;
    return firstName ? `Welcome ${firstName}` : 'Welcome';
  };

  // Animated counters for fancy number animations
  const clientsCount = useAnimatedCounter(stats?.totalClients ?? 0, 1500);
  const projectsCount = useAnimatedCounter(stats?.totalProjects ?? 0, 1800);
  const activeProjectsCount = useAnimatedCounter(stats?.activeProjects ?? 0, 2000);
  const pendingTasksCount = useAnimatedCounter(stats?.pendingTasks ?? 0, 2200);
  const overdueTasksCount = useAnimatedCounter(stats?.overdueTasks ?? 0, 2500);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardService = getDashboardService();
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleNavigate = (path: string, filters?: Record<string, string | number>) => {
    if (filters) {
      // Navigate with state to pass filters
      navigate(path, { state: { filters } });
    } else {
      navigate(path);
    }
  };

  const getCardStyle = (id: string) => {
    switch (id) {
      case 'clients': return styles.statCardClients;
      case 'totalProjects': return styles.statCardProjects;
      case 'activeProjects': return styles.statCardActive;
      case 'pendingTasks': return styles.statCardTasks;
      case 'overdueTasks': return styles.statCardWarning;
      default: return styles.statCard;
    }
  };

  const getIconStyle = (id: string) => {
    switch (id) {
      case 'clients': return styles.statIconClients;
      case 'totalProjects': return styles.statIconProjects;
      case 'activeProjects': return styles.statIconActive;
      case 'pendingTasks': return styles.statIconTasks;
      case 'overdueTasks': return styles.statIconWarning;
      default: return styles.statIcon;
    }
  };

  const getAnimatedValue = (id: string) => {
    switch (id) {
      case 'clients': return clientsCount;
      case 'totalProjects': return projectsCount;
      case 'activeProjects': return activeProjectsCount;
      case 'pendingTasks': return pendingTasksCount;
      case 'overdueTasks': return overdueTasksCount;
      default: return 0;
    }
  };

  const statsConfig = [
    {
      id: 'clients',
      label: 'Active Clients',
      value: stats?.totalClients ?? 0,
      icon: <People20Regular />,
      path: '/clients',
      trend: '+12%',
      progress: 75,
    },
    {
      id: 'totalProjects',
      label: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: <FolderList20Regular />,
      path: '/projects',
      trend: '+8%',
      progress: 65,
    },
    {
      id: 'activeProjects',
      label: 'Active Projects',
      value: stats?.activeProjects ?? 0,
      icon: <Calendar20Regular />,
      path: '/projects',
      trend: '+15%',
      progress: 80,
      filters: { status: 'In Progress' },
    },
    {
      id: 'pendingTasks',
      label: 'Pending Tasks',
      value: stats?.pendingTasks ?? 0,
      icon: <CheckboxChecked20Regular />,
      path: '/tasks',
      trend: '-5%',
      progress: 45,
      filters: { status: 'Not Started' },
    },
    {
      id: 'overdueTasks',
      label: 'Overdue Tasks',
      value: stats?.overdueTasks ?? 0,
      icon: <Warning20Regular />,
      path: '/tasks',
      isWarning: true,
      trend: '-20%',
      progress: 25,
      filters: { status: 'Overdue' },
    },
  ];

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <Text className={styles.title}>{getPersonalizedTitle()}</Text>
            <Text className={styles.subtitle}>Loading your workspace...</Text>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className={styles.loadingCard}>
              <Skeleton>
                <SkeletonItem style={{ width: '100%', height: '120px' }} />
              </Skeleton>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <Text className={styles.title}>{getPersonalizedTitle()}</Text>
            <Text className={styles.subtitle}>Something went wrong</Text>
          </div>
        </div>
        <Card className={styles.welcomeCard}>
          <Text className={styles.welcomeText}>
            Error loading dashboard: {error}
          </Text>
          <Button 
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <Text className={styles.title}>{getPersonalizedTitle()}</Text>
          <Text className={styles.subtitle}>Here's what's happening with your projects</Text>
        </div>
        <div className={styles.quickActions}>
          <Button 
            className={styles.primaryButton}
            icon={<Add20Regular />}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
          <Button 
            className={styles.secondaryButton}
            icon={<Add20Regular />}
            onClick={() => navigate('/clients')}
          >
            New Client
          </Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statsConfig.map((stat) => (
          <Card 
            key={stat.id} 
            className={`${styles.statCard} ${getCardStyle(stat.id)}`}
            onClick={() => handleNavigate(stat.path, stat.filters)}
          >
            <div className={styles.statCardHeader}>
              <div className={styles.statIconContainer}>
                <div className={`${styles.statIcon} ${getIconStyle(stat.id)}`}>
                  {stat.icon}
                </div>
                <div className={styles.statContent}>
                  <Text className={styles.statNumber}>
                    {loading ? 0 : getAnimatedValue(stat.id)}
                  </Text>
                  <Text className={styles.statLabel}>{stat.label}</Text>
                  <div className={styles.statTrend}>
                    <DataTrending20Regular />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </div>
              <Badge appearance="outline" color={
                stat.id === 'overdueTasks' && stat.value > 0 ? 'danger' : 
                stat.id === 'pendingTasks' && stat.value > 0 ? 'warning' : 'brand'
              }>
                {stat.id === 'overdueTasks' && stat.value > 0 ? 'Action Needed' : 
                 stat.id === 'pendingTasks' && stat.value > 0 ? 'Action Needed' : 'On Track'}
              </Badge>
            </div>
            
            <div className={styles.progressSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacingVerticalXS }}>
                <Text size={200}>Progress</Text>
                <Text size={200}>{stat.progress}%</Text>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.welcomeSection}>
        <Card className={styles.welcomeCard}>
          <Text className={styles.welcomeText}>
            🎯 Ready to boost your productivity? Your dashboard shows {stats?.totalProjects} projects 
            with {stats?.activeProjects} currently active. Keep up the great work!
          </Text>
          <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              className={styles.primaryButton}
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </Button>
            <Button 
              className={styles.secondaryButton}
              onClick={() => navigate('/gantt')}
            >
              Project Timeline
            </Button>
          </div>
        </Card>

        <Card className={styles.quickStartCard}>
          <Text className={styles.quickStartTitle}>Quick Actions</Text>
          <div className={styles.actionGrid}>
            <Button 
              className={styles.actionButton}
              icon={<People20Regular />}
              onClick={() => navigate('/clients')}
            >
              Manage Clients
            </Button>
            <Button 
              className={styles.actionButton}
              icon={<FolderList20Regular />}
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
            <Button 
              className={styles.actionButton}
              icon={<CheckboxChecked20Regular />}
              onClick={() => navigate('/tasks')}
            >
              View Tasks
            </Button>
            <Button 
              className={styles.actionButton}
              icon={<ChartMultiple20Regular />}
              onClick={() => navigate('/gantt')}
            >
              Gantt Chart
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
