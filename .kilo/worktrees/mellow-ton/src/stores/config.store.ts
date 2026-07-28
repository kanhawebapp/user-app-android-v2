// ============================================
// DhwaniAstro - Configuration Store
// ============================================

/**
 * Zustand store for managing customizable app configuration
 * Handles fetching, caching, and providing app configuration
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppConfiguration, ConfigStore } from '../types/config.types';
import {
  DEFAULT_APP_CONFIG,
  CONFIG_STORAGE_KEYS,
  CONFIG_CACHE_SETTINGS,
} from '../constants/config.constants';
import configApi from '../services/api/config.api';
import loggingService from '../services/logging';
import mmkvStorage from '../services/storage/mmkv.storage';

/**
 * Custom storage adapter for Zustand persist middleware
 * Uses MMKV storage for better performance in React Native
 */
const mmkvStorageAdapter = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.getItem(name);
    return value || null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.deleteItem(name);
  },
};

/**
 * Create the configuration store with persistence
 */
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // ============================================
      // Initial State
      // ============================================

      config: DEFAULT_APP_CONFIG,
      isLoaded: false,
      isLoading: false,
      error: null,
      lastFetchedAt: null,

      // ============================================
      // Actions
      // ============================================

      /**
       * Fetch configuration from API
       * Uses caching to avoid unnecessary network requests
       */
      fetchConfig: async () => {
        const { lastFetchedAt, isLoading } = get();

        // Prevent concurrent fetches
        if (isLoading) {
          loggingService.info('[ConfigStore] Fetch already in progress, skipping...');
          return;
        }

        // Check if we should skip fetch based on cache
        if (!configApi.shouldFetchConfig(lastFetchedAt)) {
          loggingService.info('[ConfigStore] Using cached configuration');
          set({ isLoaded: true, isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          loggingService.info('[ConfigStore] Fetching fresh configuration...');

          const config = await configApi.fetchAppConfig();

          set({
            config,
            isLoaded: true,
            isLoading: false,
            error: null,
            lastFetchedAt: new Date().toISOString(),
          });

          loggingService.info('[ConfigStore] Configuration updated successfully', {
            version: config.version,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch configuration';

          loggingService.error('[ConfigStore] Failed to fetch configuration', {
            error: errorMessage,
          });

          set({
            isLoading: false,
            error: errorMessage,
            // Keep existing config if available
            isLoaded: get().config !== null,
          });
        }
      },

      /**
       * Update specific configuration values
       * Useful for real-time updates without refetching
       */
      updateConfig: (updates: Partial<AppConfiguration>) => {
        const { config: currentConfig } = get();

        if (!currentConfig) {
          loggingService.warn('[ConfigStore] No configuration to update');
          return;
        }

        const updatedConfig = {
          ...currentConfig,
          ...updates,
          // Preserve nested objects when updating
          branding: updates.branding
            ? { ...currentConfig.branding, ...updates.branding }
            : currentConfig.branding,
          api: updates.api
            ? { ...currentConfig.api, ...updates.api }
            : currentConfig.api,
          texts: updates.texts
            ? { ...currentConfig.texts, ...updates.texts }
            : currentConfig.texts,
          features: updates.features
            ? { ...currentConfig.features, ...updates.features }
            : currentConfig.features,
          limits: updates.limits
            ? { ...currentConfig.limits, ...updates.limits }
            : currentConfig.limits,
          social: updates.social
            ? { ...currentConfig.social, ...updates.social }
            : currentConfig.social,
        };

        set({ config: updatedConfig });

        loggingService.info('[ConfigStore] Configuration updated', {
          updatedKeys: Object.keys(updates),
        });
      },

      /**
       * Reset configuration to defaults
       */
      resetConfig: () => {
        set({
          config: DEFAULT_APP_CONFIG,
          isLoaded: true,
          isLoading: false,
          error: null,
          lastFetchedAt: null,
        });

        loggingService.info('[ConfigStore] Configuration reset to defaults');
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: CONFIG_STORAGE_KEYS.APP_CONFIG,
      storage: createJSONStorage(() => mmkvStorageAdapter),
      // Only persist these fields
      partialize: (state: ConfigStore) => ({
        config: state.config,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);

/**
 * Selector hooks for convenient access to specific config sections
 */

// Select entire config
export const useConfig = () => useConfigStore((state) => state.config);

// Select branding
export const useBranding = () =>
  useConfigStore((state) => state.config?.branding);

// Select API config
export const useApiConfig = () =>
  useConfigStore((state) => state.config?.api);

// Select texts
export const useAppTexts = () =>
  useConfigStore((state) => state.config?.texts);

// Select feature flags
export const useFeatureFlags = () =>
  useConfigStore((state) => state.config?.features);

// Select limits
export const useAppLimits = () =>
  useConfigStore((state) => state.config?.limits);

// Select social links
export const useSocialLinks = () =>
  useConfigStore((state) => state.config?.social);

// Select loading state
export const useConfigLoading = () =>
  useConfigStore((state) => state.isLoading);

// Select error state
export const useConfigError = () =>
  useConfigStore((state) => state.error);

// ============================================
// Convenience hooks for specific values
// ============================================

export const useAppName = () =>
  useConfigStore((state) => state.config?.branding?.appName || DEFAULT_APP_CONFIG.branding.appName);

export const useAppTagline = () =>
  useConfigStore((state) => state.config?.branding?.tagline || DEFAULT_APP_CONFIG.branding.tagline);

export const useLogoUrl = () =>
  useConfigStore((state) => state.config?.branding?.logoUrl);

export const useSplashLogoUrl = () =>
  useConfigStore((state) => state.config?.branding?.splashLogoUrl);

export const useBackgroundImageUrl = () =>
  useConfigStore((state) => state.config?.branding?.backgroundImageUrl);

export const useSplashBackgroundImageUrl1 = () =>
  useConfigStore((state) => state.config?.branding?.splashBackgroundImageUrl1);

export const useSplashBackgroundImageUrl2 = () =>
  useConfigStore((state) => state.config?.branding?.splashBackgroundImageUrl2);

export const useCompanyName = () =>
  useConfigStore((state) => state.config?.branding?.companyName || DEFAULT_APP_CONFIG.branding.companyName);

export const usePrimaryColor = () =>
  useConfigStore((state) => state.config?.branding?.primaryColor || DEFAULT_APP_CONFIG.branding.primaryColor);

export const useSecondaryColor = () =>
  useConfigStore((state) => state.config?.branding?.secondaryColor || DEFAULT_APP_CONFIG.branding.secondaryColor);

export const useApiBaseUrl = () =>
  useConfigStore((state) => state.config?.api?.baseUrl || DEFAULT_APP_CONFIG.api.baseUrl);

export const useLoginTexts = () =>
  useConfigStore((state) => state.config?.texts || DEFAULT_APP_CONFIG.texts);

export const useFeatureEnabled = (feature: keyof typeof DEFAULT_APP_CONFIG.features) =>
  useConfigStore((state) => state.config?.features?.[feature] ?? DEFAULT_APP_CONFIG.features[feature]);

// ============================================
// Onboarding Configuration Hooks
// ============================================

export const useOnboardingTagline = () =>
  useConfigStore((state) => state.config?.texts?.onboardingTagline || DEFAULT_APP_CONFIG.texts.onboardingTagline);

export const useOnboardingHeadline = () =>
  useConfigStore((state) => state.config?.texts?.onboardingHeadline || DEFAULT_APP_CONFIG.texts.onboardingHeadline);

export const useOnboardingBenefits = () =>
  useConfigStore((state) => state.config?.texts?.onboardingBenefits || DEFAULT_APP_CONFIG.texts.onboardingBenefits);

// ============================================
// Splash Screen Configuration Hooks
// ============================================

export const useSplashAutoNavigateTimeout = () =>
  useConfigStore((state) => state.config?.texts?.splashAutoNavigateTimeout || DEFAULT_APP_CONFIG.texts.splashAutoNavigateTimeout);

// ============================================
// WebRTC Configuration Hooks
// ============================================

/**
 * Get the current API base URL based on environment
 * Uses config store if available, falls back to constants
 */
export const useCurrentApiBaseUrl = () => {
  const config = useConfigStore((state) => state.config);
  const environment = config?.api?.environment || 'development';
  
  // Return from config if set, otherwise use defaults based on environment
  if (config?.api?.baseUrl) {
    return config.api.baseUrl;
  }
  
  // Fallback to environment-based default
  switch (environment) {
    case 'production':
      return 'https://api.dhwaniastro.com';
    case 'staging':
      return 'https://staging-api.dhwaniastro.com';
    case 'development':
    default:
      return 'https://dev-api.dhwaniastro.com';
  }
};

/**
 * Get the current WebSocket URL based on environment
 */
export const useCurrentWsUrl = () => {
  const config = useConfigStore((state) => state.config);
  const environment = config?.api?.environment || 'development';
  
  if (config?.api?.wsUrl) {
    return config.api.wsUrl;
  }
  
  switch (environment) {
    case 'production':
      return 'wss://ws.dhwaniastro.com';
    case 'staging':
      return 'wss://staging-ws.dhwaniastro.com';
    case 'development':
    default:
      return 'wss://dev-ws.dhwaniastro.com';
  }
};

/**
 * Get WebRTC configuration
 */
export const useWebRtcConfig = () => {
  const config = useConfigStore((state) => state.config);
  
  return {
    stunServer: config?.api?.webRtcStunServer || DEFAULT_APP_CONFIG.api.webRtcStunServer,
    turnServer: config?.api?.webRtcTurnServer || DEFAULT_APP_CONFIG.api.webRtcTurnServer,
    turnUsername: config?.api?.webRtcTurnUsername || DEFAULT_APP_CONFIG.api.webRtcTurnUsername,
    turnPassword: config?.api?.webRtcTurnPassword || DEFAULT_APP_CONFIG.api.webRtcTurnPassword,
    signalingServerUrl: config?.api?.signalingServerUrl || DEFAULT_APP_CONFIG.api.signalingServerUrl,
  };
};

/**
 * Get Agora App ID based on environment
 */
export const useAgoraAppId = () => {
  const config = useConfigStore((state) => state.config);
  const environment = config?.api?.environment || 'development';
  
  if (config?.api?.agoraAppId) {
    return config.api.agoraAppId;
  }
  
  switch (environment) {
    case 'production':
      return 'YOUR_AGORA_APP_ID';
    case 'staging':
      return 'YOUR_STAGING_AGORA_APP_ID';
    case 'development':
    default:
      return 'YOUR_DEV_AGORA_APP_ID';
  }
};

/**
 * Get current environment
 */
export const useEnvironment = () =>
  useConfigStore((state) => state.config?.api?.environment || DEFAULT_APP_CONFIG.api.environment || 'development');

export default useConfigStore;

