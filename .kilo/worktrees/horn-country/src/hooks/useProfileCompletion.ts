/**
 * useProfileCompletion Hook
 * Custom hook for just-in-time profile data collection
 * Call this hook when user tries to use features that require profile data
 */

import {useCallback} from 'react';
import {useProfileStore} from '../stores';
import type {FeatureType} from '../types/profile.types';

interface UseProfileCompletionReturn {
  // Check if user can use a feature
  canUseFeature: (feature: FeatureType) => boolean;

  // Request profile data for a feature
  // Returns true if feature can be used immediately, false if profile data is needed
  requestProfileForFeature: (
    feature: FeatureType,
    onComplete?: () => void,
  ) => boolean;

  // Check if a specific feature requires profile completion
  requiresProfileCompletion: (feature: FeatureType) => boolean;

  // Get missing fields for a feature
  getMissingFields: (feature: FeatureType) => string[];

  // Get current completion percentage
  completionPercentage: number;

  // Check if user has any profile data
  hasAnyProfileData: boolean;

  // Check if profile is complete
  isProfileComplete: boolean;
}

export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const {
    requestProfileForFeature,
    hasRequiredFieldsForFeature,
    getMissingFieldsForFeature,
    getCompletionPercentage,
    completedFields,
  } = useProfileStore();

  // Check if user can use a feature without needing profile data
  const canUseFeature = useCallback(
    (feature: FeatureType): boolean => {
      return hasRequiredFieldsForFeature(feature);
    },
    [hasRequiredFieldsForFeature],
  );

  // Request profile data for a feature - shows modal if needed
  // Returns true if feature can be used immediately, false if modal is shown
  const requestProfileForFeatureWithCallback = useCallback(
    (feature: FeatureType, onComplete?: () => void): boolean => {
      return requestProfileForFeature(feature, onComplete);
    },
    [requestProfileForFeature],
  );

  // Check if a feature requires profile completion
  const requiresProfileCompletion = useCallback(
    (feature: FeatureType): boolean => {
      return !hasRequiredFieldsForFeature(feature);
    },
    [hasRequiredFieldsForFeature],
  );

  // Get missing fields for a feature
  const getMissingFields = useCallback(
    (feature: FeatureType): string[] => {
      return getMissingFieldsForFeature(feature);
    },
    [getMissingFieldsForFeature],
  );

  // Current completion percentage
  const completionPercentage = getCompletionPercentage();

  // Check if user has any profile data
  const hasAnyProfileData = completedFields.length > 0;

  // Check if profile is complete (100%)
  const isProfileComplete = completionPercentage === 100;

  return {
    canUseFeature,
    requestProfileForFeature: requestProfileForFeatureWithCallback,
    requiresProfileCompletion,
    getMissingFields,
    completionPercentage,
    hasAnyProfileData,
    isProfileComplete,
  };
};

export default useProfileCompletion;
