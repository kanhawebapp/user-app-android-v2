import {useEffect} from 'react';
// import {useProfileStore} from '../../stores';
import type {UpdateUserInput} from './profile.types';
import useProfileStore from '../../../stores/profile.store';

export const useProfile = () => {
  const {
    profile,
    isLoading: loading,
    isUpdating: updating,
    fetchProfile,
    updateProfileData,
    error,
  } = useProfileStore();

  const updateProfile = async (input: UpdateUserInput) => {
    try {
      const res = await updateProfileData(input);
      return res;
    } catch (error) {
      console.log('PROFILE UPDATE ERROR:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updating,
    refresh: fetchProfile,
    updateProfile,
  };
};
