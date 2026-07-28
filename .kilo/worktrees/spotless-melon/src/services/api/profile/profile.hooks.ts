import {useEffect} from 'react';
import type {UpdateUserInput} from './profile.types';
import useProfileStore from '../../../stores/profile.store';

export const useProfile = () => {
  const {
    profile,
    isLoading: loading,
    isUpdating: updating,
    fetchProfile,
    updateProfileData,
  } = useProfileStore();

  const updateProfile = async (input: UpdateUserInput) => {
    return updateProfileData(input);
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
