import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import {
  Home20Regular,
  Home20Filled,
  People20Regular,
  People20Filled,
  FolderList20Regular,
  FolderList20Filled,
  CheckboxChecked20Regular,
  CheckboxChecked20Filled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingVerticalXS,
  },
  
  navItem: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    minHeight: '44px',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  
  navItemActive: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    border: 'none',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    minHeight: '44px',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  
  navItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    width: '100%',
  },
  
  section: {
    marginTop: tokens.spacingVerticalL,
    '&:first-child': {
      marginTop: 0,
    },
  },
  
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
});

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  activeIcon: React.ReactElement;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <Home20Regular />,
    activeIcon: <Home20Filled />,
  },
  {
    path: '/clients',
    label: 'Clients',
    icon: <People20Regular />,
    activeIcon: <People20Filled />,
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: <FolderList20Regular />,
    activeIcon: <FolderList20Filled />,
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: <CheckboxChecked20Regular />,
    activeIcon: <CheckboxChecked20Filled />,
  },
];

interface AppNavigationProps {
  onNavigate?: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ onNavigate }) => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Menu</Text>
        {navigationItems.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <Button
              key={item.path}
              appearance="subtle"
              className={isActive ? styles.navItemActive : styles.navItem}
              onClick={() => handleNavigation(item.path)}
            >
              <div className={styles.navItemContent}>
                {isActive ? item.activeIcon : item.icon}
                <Text>{item.label}</Text>
              </div>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
