import React from 'react';
import {
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Person20Regular,
  Settings20Regular,
  SignOut20Regular,
  ChevronDown20Regular,
} from '@fluentui/react-icons';
import { useUserProfile } from '../../hooks/useUserProfile';

const useStyles = makeStyles({
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForegroundOnBrand,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    minHeight: '40px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px',
    },
  },
  
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '140px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForegroundOnBrand,
    lineHeight: tokens.lineHeightBase300,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  
  userRole: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.85,
    lineHeight: tokens.lineHeightBase200,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  
  chevron: {
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.8,
    fontSize: tokens.fontSizeBase200,
    transition: 'transform 0.2s ease-in-out',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  menuPopover: {
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: tokens.shadow16,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  
  menuHeader: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  
  menuHeaderAvatar: {
    width: '56px',
    height: '56px',
    flexShrink: 0,
  },
  
  menuHeaderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    flex: 1,
  },
  
  menuHeaderName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  menuHeaderEmail: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  menuHeaderTitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  menuSection: {
    padding: `${tokens.spacingVerticalXS} 0`,
  },
  
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    minHeight: '40px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    '&:active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },
  
  menuItemIcon: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase400,
    flexShrink: 0,
  },
  
  menuItemText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightRegular,
  },
  
  skeletonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    minHeight: '40px',
  },
  
  skeletonInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

interface UserAvatarProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onSignOutClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  onProfileClick,
  onSettingsClick,
  onSignOutClick,
}) => {
  const styles = useStyles();
  const { profile: userProfile, photo: userPhoto, loading, error } = useUserProfile();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleSignOutClick = () => {
    if (onSignOutClick) {
      onSignOutClick();
    }
  };

  if (loading) {
    return (
      <div className={styles.skeletonContainer}>
        <Skeleton>
          <SkeletonItem shape="circle" size={32} />
        </Skeleton>
        <div className={styles.skeletonInfo}>
          <Skeleton>
            <SkeletonItem style={{ width: '80px', height: '14px' }} />
          </Skeleton>
          <Skeleton>
            <SkeletonItem style={{ width: '60px', height: '12px' }} />
          </Skeleton>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.userSection}>
        <Avatar
          size={32}
          icon={<Person20Regular />}
          color="colorful"
        />
        <div className={styles.userInfo}>
          <Text className={styles.userName}>User</Text>
          <Text className={styles.userRole}>Not available</Text>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.displayName || 
    (userProfile?.givenName && userProfile?.surname ? 
      `${userProfile.givenName} ${userProfile.surname}` : 
      'User');
  
  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={styles.userSection}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          <button className={styles.userButton}>
            <Avatar
              size={32}
              name={displayName}
              image={userPhoto ? { src: userPhoto } : undefined}
              initials={initials}
              color="colorful"
            />
            <div className={styles.userInfo}>
              <Text className={styles.userName}>{displayName}</Text>
              <Text className={styles.userRole}>
                {userProfile?.jobTitle || userProfile?.department || 'Team Member'}
              </Text>
            </div>
            <ChevronDown20Regular className={styles.chevron} />
          </button>
        </MenuTrigger>
        
        <MenuPopover className={styles.menuPopover}>
          <MenuList>
            {/* User Header */}
            <div className={styles.menuHeader}>
              <Avatar
                size={48}
                name={displayName}
                image={userPhoto ? { src: userPhoto } : undefined}
                initials={initials}
                color="colorful"
                className={styles.menuHeaderAvatar}
              />
              <div className={styles.menuHeaderInfo}>
                <Text className={styles.menuHeaderName}>{displayName}</Text>
                <Text className={styles.menuHeaderEmail}>
                  {userProfile?.mail || userProfile?.userPrincipalName}
                </Text>
                {userProfile?.jobTitle && (
                  <Text className={styles.menuHeaderTitle}>
                    {userProfile.jobTitle}
                    {userProfile.department && ` • ${userProfile.department}`}
                  </Text>
                )}
              </div>
            </div>
            
            <MenuDivider />
            
            {/* Menu Items */}
            <div className={styles.menuSection}>
              <MenuItem onClick={handleProfileClick} className={styles.menuItem}>
                <Person20Regular className={styles.menuItemIcon} />
                <Text className={styles.menuItemText}>My Profile</Text>
              </MenuItem>
              
              <MenuItem onClick={handleSettingsClick} className={styles.menuItem}>
                <Settings20Regular className={styles.menuItemIcon} />
                <Text className={styles.menuItemText}>Settings</Text>
              </MenuItem>
            </div>
            
            <MenuDivider />
            
            <div className={styles.menuSection}>
              <MenuItem onClick={handleSignOutClick} className={styles.menuItem}>
                <SignOut20Regular className={styles.menuItemIcon} />
                <Text className={styles.menuItemText}>Sign Out</Text>
              </MenuItem>
            </div>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
