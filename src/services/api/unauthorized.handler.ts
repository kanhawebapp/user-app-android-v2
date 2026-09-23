// ============================================
// DhwaniAstro - Centralized Unauthorized Handler
// ============================================

import {HTTP_STATUS} from '../../constants/api.constants';
import {useAuthStore} from '../../stores/auth.store';
import {useAppStore} from '../../stores/app.store';
import loggingService from '../logging';

/** In-flight logout promise — coalesces concurrent 401s into one logout. */
let logoutInFlight: Promise<void> | null = null;

const isUnauthorizedMessage = (message: unknown): boolean => {
  if (typeof message !== 'string') {
    return false;
  }
  return message.trim().toLowerCase() === 'unauthorized';
};

/**
 * Detect HTTP 401 / Unauthorized across Axios, GraphQL, and plain Error shapes.
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  if (typeof error === 'string') {
    return isUnauthorizedMessage(error);
  }

  if (typeof error !== 'object') {
    return false;
  }

  const err = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        errors?: Array<{message?: string}>;
        error?: {message?: string};
        message?: string;
      };
    };
  };

  if (err.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    return true;
  }

  if (isUnauthorizedMessage(err.message)) {
    return true;
  }

  const gqlErrors = err.response?.data?.errors;
  if (
    Array.isArray(gqlErrors) &&
    gqlErrors.some(e => isUnauthorizedMessage(e?.message))
  ) {
    return true;
  }

  if (isUnauthorizedMessage(err.response?.data?.error?.message)) {
    return true;
  }

  if (isUnauthorizedMessage(err.response?.data?.message)) {
    return true;
  }

  return false;
};

const hasActiveSession = (): boolean => {
  const {isAuthenticated, accessToken} = useAuthStore.getState();
  const {isLoggedIn} = useAppStore.getState();
  return isAuthenticated || isLoggedIn || !!accessToken;
};

/**
 * Single entry point for session expiry / 401 Unauthorized.
 * Reuses existing auth.store.logout() + app.store.setIsLoggedIn(false)
 * (same path as handleLogout / Settings delete-account).
 * Navigation to Login follows automatically via AppContent when isLoggedIn becomes false.
 */
export const handleUnauthorized = (): Promise<void> => {
  if (logoutInFlight) {
    return logoutInFlight;
  }

  if (!hasActiveSession()) {
    return Promise.resolve();
  }

  logoutInFlight = (async () => {
    try {
      loggingService.warn(
        '[API] Unauthorized response — logging out via existing auth flow',
      );

      // Existing logout: clears ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA + auth state
      await useAuthStore.getState().logout();

      // Existing nav gate: AppContent switches to Login stack when false
      useAppStore.getState().setIsLoggedIn(false);
    } catch (error) {
      loggingService.error('[API] Unauthorized logout failed', {error});
    } finally {
      // Absorb concurrent 401s from in-flight requests after logout started
      setTimeout(() => {
        logoutInFlight = null;
      }, 2000);
    }
  })();

  return logoutInFlight;
};

export default handleUnauthorized;
