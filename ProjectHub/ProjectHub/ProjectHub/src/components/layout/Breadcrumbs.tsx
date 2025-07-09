import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
} from '@fluentui/react-components';
import {
  Home20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  
  homeIcon: {
    color: tokens.colorNeutralForeground2,
  },
  
  breadcrumbText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  
  currentPage: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
});

interface BreadcrumbMapping {
  [key: string]: string;
}

const breadcrumbMapping: BreadcrumbMapping = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
};

export const Breadcrumbs: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // If we're on the home page, just show the home icon
  if (location.pathname === '/') {
    return (
      <div className={styles.breadcrumb}>
        <Home20Regular className={styles.homeIcon} />
        <Text className={styles.currentPage}>Dashboard</Text>
      </div>
    );
  }
  
  // Build breadcrumb path
  const breadcrumbItems = [];
  let currentPath = '';
  
  // Add home
  breadcrumbItems.push({
    path: '/',
    label: 'Dashboard',
    isHome: true,
    originalPath: '/', // Add unique identifier
  });
  
  // Add path segments
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Handle special cases for dynamic routes
    let label = breadcrumbMapping[currentPath] || segment;
    let linkPath = currentPath;
    
    // Handle project Gantt route: /projects/:projectId/gantt
    if (pathSegments[index - 1] === 'projects' && pathSegments[index + 1] === 'gantt') {
      // This is a project ID, skip it and let the gantt segment handle the label
      return;
    }
    
    if (segment === 'gantt' && pathSegments[index - 2] === 'projects') {
      label = 'Gantt Chart';
      // Make the breadcrumb link back to projects, not to the gantt page
      linkPath = '/projects';
    }
    
    breadcrumbItems.push({
      path: linkPath,
      label,
      isHome: false,
      originalPath: currentPath, // Add unique identifier
    });
  });

  return (
    <Breadcrumb className={styles.breadcrumb}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <React.Fragment key={item.originalPath}>
            <BreadcrumbItem>
              {isLast ? (
                <Text className={styles.currentPage}>
                  {item.isHome && <Home20Regular className={styles.homeIcon} />}
                  {item.label}
                </Text>
              ) : (
                <Link to={item.path} style={{ textDecoration: 'none' }}>
                  <BreadcrumbButton className={styles.breadcrumbText}>
                    {item.isHome && <Home20Regular className={styles.homeIcon} />}
                    {item.label}
                  </BreadcrumbButton>
                </Link>
              )}
            </BreadcrumbItem>
            {!isLast && (
              <BreadcrumbDivider>
                <ChevronRight20Regular />
              </BreadcrumbDivider>
            )}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};
