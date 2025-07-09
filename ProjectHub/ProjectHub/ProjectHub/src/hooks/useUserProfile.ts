import { useState, useEffect } from 'react';
import { Office365UsersService } from '../Services/Office365UsersService';
import type { GraphUser_V1 } from '../Models/Office365UsersModel';

interface UserProfileState {
  profile: GraphUser_V1 | null;
  photo: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserProfile = () => {
  const [state, setState] = useState<UserProfileState>({
    profile: null,
    photo: null,
    loading: true,
    error: null,
  });

  const fetchUserProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get user profile
      const profileResult = await Office365UsersService.MyProfile_V2(
        'displayName,givenName,surname,mail,userPrincipalName,jobTitle,department,companyName,id'
      );

      if (!profileResult.success) {
        throw new Error(profileResult.error?.message || 'Failed to fetch user profile');
      }

      setState(prev => ({ ...prev, profile: profileResult.data }));

      // Get user photo if user ID is available
      if (profileResult.data?.id) {
        try {
          const photoResult = await Office365UsersService.UserPhoto_V2(profileResult.data.id);
          if (photoResult.success && photoResult.data) {
            setState(prev => ({ 
              ...prev, 
              photo: `data:image/jpeg;base64,${photoResult.data}` 
            }));
          }
        } catch (photoError) {
          console.warn('Failed to fetch user photo:', photoError);
          // Don't set error state for photo failure
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to load user data' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const refetch = () => {
    fetchUserProfile();
  };

  return {
    ...state,
    refetch,
  };
};
