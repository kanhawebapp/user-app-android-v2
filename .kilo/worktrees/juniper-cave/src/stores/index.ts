/**
 * Stores Index - Export all Zustand stores
 */

export {useAuthStore} from './auth.store';
export {useChatStore} from './chat.store';
export {useWalletStore} from './wallet.store';

// App store for global app state
export {useAppStore} from './app.store';

// Profile store for progressive profiling
export {useProfileStore} from './profile.store';

// Call store is now in services/call/call.store.ts

// Notification store
export {useNotificationStore} from './notification.store';

// Config store for customizable app configuration
export {useConfigStore} from './config.store';
export {
  useConfig,
  useBranding,
  useApiConfig,
  useAppTexts,
  useFeatureFlags,
  useAppLimits,
  useSocialLinks,
  useConfigLoading,
  useConfigError,
  useAppName,
  useCompanyName,
  usePrimaryColor,
  useSecondaryColor,
  useApiBaseUrl,
  useLoginTexts,
  useFeatureEnabled,
} from './config.store';
