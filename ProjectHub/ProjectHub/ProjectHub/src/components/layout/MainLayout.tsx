import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import {
  Navigation20Regular,
  Dismiss20Regular,
} from '@fluentui/react-icons';
import { AppNavigation } from './AppNavigation';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { UserAvatar } from '../common/UserAvatar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    boxShadow: tokens.shadow4,
    zIndex: 1000,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    },
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  
  logo: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  
  mobileMenuButton: {
    display: 'none',
    color: tokens.colorNeutralForegroundOnBrand,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '@media (max-width: 1024px)': {
      display: 'flex',
    },
  },
  
  mainContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  
  sidebar: {
    width: '280px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 1024px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 1001,
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      boxShadow: tokens.shadow16,
    },
  },
  
  sidebarOpen: {
    width: '280px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 1024px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 1001,
      transform: 'translateX(0)',
      transition: 'transform 0.3s ease-in-out',
      boxShadow: tokens.shadow16,
    },
  },
  
  sidebarHeader: {
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'none',
    '@media (max-width: 1024px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    '& button': {
      color: tokens.colorNeutralForeground1,
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground3,
      },
    },
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  
  breadcrumbContainer: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    },
  },
  
  pageContent: {
    flex: 1,
    padding: tokens.spacingHorizontalL,
    overflow: 'auto',
    '@media (max-width: 768px)': {
      padding: tokens.spacingHorizontalM,
    },
  },
  
  overlay: {
    display: 'none',
    '@media (max-width: 1024px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease-in-out',
    },
  },
  
  overlayVisible: {
    display: 'none',
    '@media (max-width: 1024px)': {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      opacity: 1,
      pointerEvents: 'auto',
      transition: 'opacity 0.3s ease-in-out',
    },
  },
});

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const styles = useStyles();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page or show profile modal
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page or show settings modal
    console.log('Settings clicked');
  };

  const handleSignOutClick = () => {
    // TODO: Implement sign out logic
    console.log('Sign out clicked');
    // You might want to clear authentication state and redirect to login
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            appearance="subtle"
            icon={<Navigation20Regular />}
            className={styles.mobileMenuButton}
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          />
          <Text className={styles.logo}>ProjectHub</Text>
        </div>
        <div className={styles.headerRight}>
          <ThemeSwitcher />
          <UserAvatar
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
            onSignOutClick={handleSignOutClick}
          />
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <nav className={isSidebarOpen ? styles.sidebarOpen : styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Text weight="semibold">ProjectHub</Text>
            <Button
              appearance="subtle"
              icon={<Dismiss20Regular />}
              onClick={closeSidebar}
              aria-label="Close navigation"
            />
          </div>
          <AppNavigation onNavigate={closeSidebar} />
        </nav>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs />
          </div>
          <div className={styles.pageContent}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={isSidebarOpen ? styles.overlayVisible : styles.overlay}
        onClick={closeSidebar}
      />
    </div>
  );
};
