/**
 * Profile Store - Zustand
 * Manages profile completion state and just-in-time data collection
 * Also serves as the global source of truth for user profile data
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {secureStorage} from '../services/storage/secure.storage';
import {STORAGE_KEYS} from '../constants/app.constants';
import type {
  ProfileFieldKey,
  ProfileCompletionState,
  PendingProfileRequest,
  FeatureType,
  ProfileUpdatePayload,
} from '../types/profile.types';
import {
  calculateCompletionPercentage,
  getMissingFields,
  hasRequiredFields,
  FEATURE_REQUIREMENTS,
} from '../types/profile.types';
import {useAuthStore} from './auth.store';
import {
  getUserProfile,
  updateUserProfile,
} from '../services/api/profile/profile.api';
import type {
  UserProfile,
  UpdateUserInput,
} from '../services/api/profile/profile.types';

// All tracked profile fields
const ALL_PROFILE_FIELDS: ProfileFieldKey[] = [
  'name',
  'email',
  'dateOfBirth',
  'birthTime',
  'birthPlace',
  'gender',
  'languagePreference',
];

interface ProfileState {
  // Profile completion tracking
  completedFields: ProfileFieldKey[];
  lastUpdated: string | null;

  // Profile data - global source of truth
  profile: UserProfile | null;

  // Pending profile requests (from feature usage)
  pendingRequests: PendingProfileRequest[];
  isRequestModalVisible: boolean;
  currentRequest: PendingProfileRequest | null;

  // Loading state
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Actions
  initializeFromUser: () => void;
  updateProfileField: (field: ProfileFieldKey, value: string) => void;
  updateProfileFields: (fields: ProfileUpdatePayload) => Promise<void>;
  requestProfileForFeature: (
    feature: FeatureType,
    callback?: () => void,
  ) => boolean;
  dismissProfileRequest: () => void;
  completeProfileRequest: () => void;
  getCompletionPercentage: () => number;
  getMissingFieldsForFeature: (feature: FeatureType) => ProfileFieldKey[];
  hasRequiredFieldsForFeature: (feature: FeatureType) => boolean;
  isFieldCompleted: (field: ProfileFieldKey) => boolean;
  resetProfileState: () => void;
  setError: (error: string | null) => void;

  // Profile data actions
  fetchProfile: () => Promise<void>;
  updateProfileData: (input: UpdateUserInput) => Promise<UserProfile>;
}

// Custom storage for secure storage
const secureStorageAdapter = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await secureStorage.getItem(name);
    return value || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await secureStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await secureStorage.deleteItem(name);
  },
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      completedFields: [],
      lastUpdated: null,
      profile: null,
      pendingRequests: [],
      isRequestModalVisible: false,
      currentRequest: null,
      isLoading: false,
      isUpdating: false,
      error: null,

      // Fetch profile
      fetchProfile: async () => {
        try {
          set({isLoading: true, error: null});
          const res = await getUserProfile();
          set({profile: res, isLoading: false});
        } catch (error) {
          console.log('PROFILE FETCH ERROR:', error);
          set({isLoading: false, error: 'Failed to fetch profile'});
        }
      },

      // Update profile data
      updateProfileData: async (input: UpdateUserInput) => {
        try {
          set({isUpdating: true, error: null});
          await updateUserProfile(input);
          // Refetch full profile to get all updated fields
          const res = await getUserProfile();
          set({profile: res, isUpdating: false});
          // Also update auth store user with new profile data
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            const {name, gender, birthDate, birthTime, occupation, profilePic} =
              res;
            useAuthStore.getState().updateUser({
              name,
              gender,
              dateOfBirth: birthDate,
              birthTime,
              ...(currentUser as any),
            });
          }
          return res;
        } catch (error) {
          console.log('PROFILE UPDATE ERROR:', error);
          set({isUpdating: false, error: 'Failed to update profile'});
          throw error;
        }
      },

      // Initialize from user data in auth store
      initializeFromUser: () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({completedFields: [], lastUpdated: null, profile: null});
          return;
        }

        const completed: ProfileFieldKey[] = [];

        // Check each field
        if (user.name && user.name.trim().length > 0) {
          completed.push('name');
        }
        if (user.email && user.email.trim().length > 0) {
          completed.push('email');
        }
        if (user.dateOfBirth) {
          completed.push('dateOfBirth');
        }
        if (user.birthTime) {
          completed.push('birthTime');
        }
        if (user.placeOfBirth) {
          completed.push('birthPlace');
        }
        if (user.gender) {
          completed.push('gender');
        }
        if (user.languagePreference) {
          completed.push('languagePreference');
        }

        // Build profile from user
        const profile: UserProfile = {
          id: user.id,
          name: user.name,
          mobile: user.mobile ?? '',
          countryCode: user.countryCode ?? '',
          gender: user.gender,
          birthDate: user.dateOfBirth,
          birthTime: user.birthTime,
          occupation: user.astrologerProfile?.bio,
          profilePic: user.profilePic ?? '',
        };

        set({
          completedFields: completed,
          lastUpdated: new Date().toISOString(),
          profile,
        });
      },

      // Update a single profile field
      updateProfileField: (field: ProfileFieldKey, value: string) => {
        const {completedFields} = get();

        if (
          value &&
          value.trim().length > 0 &&
          !completedFields.includes(field)
        ) {
          const newCompletedFields = [...completedFields, field];

          // Update user in auth store
          const authUpdate: Record<string, string> = {};
          if (field === 'name') {
            authUpdate.name = value;
          } else if (field === 'email') {
            authUpdate.email = value;
          } else if (field === 'dateOfBirth') {
            authUpdate.dateOfBirth = value;
          } else if (field === 'birthTime') {
            authUpdate.birthTime = value;
          } else if (field === 'birthPlace') {
            authUpdate.birthPlace = value;
          } else if (field === 'gender') {
            authUpdate.gender = value;
          } else if (field === 'languagePreference') {
            authUpdate.languagePreference = value;
          }

          useAuthStore.getState().updateUser(authUpdate);

          set({
            completedFields: newCompletedFields,
            lastUpdated: new Date().toISOString(),
          });
        }
      },

      // Update multiple profile fields at once
      updateProfileFields: async (fields: ProfileUpdatePayload) => {
        set({isUpdating: true, error: null});

        try {
          const {completedFields} = get();
          const newCompletedFields = [...completedFields];

          // Process each field
          Object.entries(fields).forEach(([key, value]) => {
            const field = key as ProfileFieldKey;
            if (
              value &&
              value.trim().length > 0 &&
              !newCompletedFields.includes(field)
            ) {
              newCompletedFields.push(field);
            }
          });

          // Update user in auth store
          const authUpdate: Record<string, string> = {};
          Object.entries(fields).forEach(([key, value]) => {
            if (value) {
              authUpdate[key] = value;
            }
          });

          useAuthStore.getState().updateUser(authUpdate);

          set({
            completedFields: newCompletedFields,
            lastUpdated: new Date().toISOString(),
            isUpdating: false,
          });
        } catch (error) {
          const err =
            error instanceof Error
              ? error
              : new Error('Failed to update profile');
          set({
            isUpdating: false,
            error: err.message,
          });
          throw error;
        }
      },

      // Request profile data for a specific feature
      requestProfileForFeature: (
        feature: FeatureType,
        callback?: () => void,
      ): boolean => {
        const {completedFields} = get();

        // Check if we have required fields for this feature
        if (hasRequiredFields(completedFields, feature)) {
          // Already have required fields, proceed with feature
          return true;
        }

        // Get requirement for this feature
        const requirement = FEATURE_REQUIREMENTS.find(
          r => r.feature === feature,
        );
        if (!requirement) {
          // No requirements defined, allow feature
          return true;
        }

        // Get missing required fields
        const missingFields = getMissingFields(completedFields, feature);

        if (missingFields.length > 0) {
          // Create pending request
          const request: PendingProfileRequest = {
            id: `req_${Date.now()}`,
            feature,
            requiredFields: missingFields,
            optionalFields: requirement.optionalFields.filter(
              f => !completedFields.includes(f),
            ),
            reason: requirement.reason,
            callback,
          };

          set({
            pendingRequests: [...get().pendingRequests, request],
            isRequestModalVisible: true,
            currentRequest: request,
          });

          return false;
        }

        return true;
      },

      // Dismiss current profile request
      dismissProfileRequest: () => {
        const {pendingRequests} = get();
        set({
          pendingRequests: pendingRequests.slice(1),
          isRequestModalVisible: false,
          currentRequest: null,
        });
      },

      // Complete the current profile request
      completeProfileRequest: () => {
        const {currentRequest, completedFields} = get();

        if (currentRequest) {
          // Check if we now have the required fields
          if (hasRequiredFields(completedFields, currentRequest.feature)) {
            // Execute the callback if provided
            currentRequest.callback?.();
          }
        }

        // Clear the request
        const {pendingRequests} = get();
        set({
          pendingRequests: pendingRequests.slice(1),
          isRequestModalVisible: false,
          currentRequest: null,
        });
      },

      // Get current completion percentage
      getCompletionPercentage: () => {
        const {completedFields} = get();
        return calculateCompletionPercentage(
          completedFields,
          ALL_PROFILE_FIELDS,
        );
      },

      // Get missing fields for a feature
      getMissingFieldsForFeature: (feature: FeatureType) => {
        const {completedFields} = get();
        return getMissingFields(completedFields, feature);
      },

      // Check if user has required fields for a feature
      hasRequiredFieldsForFeature: (feature: FeatureType) => {
        const {completedFields} = get();
        return hasRequiredFields(completedFields, feature);
      },

      // Check if a specific field is completed
      isFieldCompleted: (field: ProfileFieldKey) => {
        const {completedFields} = get();
        return completedFields.includes(field);
      },

      // Reset profile state
      resetProfileState: () => {
        set({
          completedFields: [],
          lastUpdated: null,
          profile: null,
          pendingRequests: [],
          isRequestModalVisible: false,
          currentRequest: null,
          isUpdating: false,
          isLoading: false,
          error: null,
        });
      },

      // Set error message
      setError: (error: string | null) => {
        set({error});
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      partialize: state => ({
        completedFields: state.completedFields,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);

export default useProfileStore;
