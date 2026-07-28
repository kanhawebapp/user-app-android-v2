// ============================================
// DhwaniAstro - Configuration API Service
// ============================================

/**
 * API service for fetching and managing app configuration
 */

import { api } from './axios.instance';
import { CONFIG_ENDPOINTS, CONFIG_CACHE_SETTINGS } from '../../constants/config.constants';
import type { AppConfiguration, ConfigApiResponse } from '../../types/config.types';
import loggingService from '../logging';

/**
 * Fetch app configuration from the server
 * @returns Promise resolving to app configuration
 */
export const fetchAppConfig = async (): Promise<AppConfiguration> => {
  try {
    loggingService.info('[ConfigAPI] Fetching app configuration...');

    const response = await api.get<ConfigApiResponse>(CONFIG_ENDPOINTS.CONFIG);

    if (response.data?.success && response.data?.data) {
      loggingService.info('[ConfigAPI] Configuration fetched successfully', {
        version: response.data.data.version,
      });
      return response.data.data;
    }

    // If API returns error, throw appropriate error
    throw new Error(response.data?.error?.message || 'Failed to fetch configuration');
  } catch (error) {
    loggingService.error('[ConfigAPI] Failed to fetch configuration', { error });
    throw error;
  }
};

/**
 * Fetch only branding configuration
 */
export const fetchBrandingConfig = async () => {
  try {
    const response = await api.get<ConfigApiResponse>(CONFIG_ENDPOINTS.BRANDING);
    return response.data?.data;
  } catch (error) {
    loggingService.error('[ConfigAPI] Failed to fetch branding config', { error });
    throw error;
  }
};

/**
 * Fetch only texts configuration
 */
export const fetchTextsConfig = async () => {
  try {
    const response = await api.get<ConfigApiResponse>(CONFIG_ENDPOINTS.TEXTS);
    return response.data?.data;
  } catch (error) {
    loggingService.error('[ConfigAPI] Failed to fetch texts config', { error });
    throw error;
  }
};

/**
 * Fetch only feature flags configuration
 */
export const fetchFeatureFlags = async () => {
  try {
    const response = await api.get<ConfigApiResponse>(CONFIG_ENDPOINTS.FEATURES);
    return response.data?.data;
  } catch (error) {
    loggingService.error('[ConfigAPI] Failed to fetch feature flags', { error });
    throw error;
  }
};

/**
 * Check if config cache is valid
 * @param lastFetchedAt - Timestamp of last successful fetch
 */
export const isCacheValid = (lastFetchedAt: string | null): boolean => {
  if (!lastFetchedAt) return false;

  const lastFetch = new Date(lastFetchedAt).getTime();
  const now = Date.now();
  const cacheAge = now - lastFetch;

  return cacheAge < CONFIG_CACHE_SETTINGS.CACHE_DURATION;
};

/**
 * Check if we should attempt to fetch config
 * @param lastFetchedAt - Timestamp of last successful fetch
 * @param retryCount - Number of consecutive failures
 */
export const shouldFetchConfig = (
  lastFetchedAt: string | null,
  retryCount: number = 0
): boolean => {
  // If cache is valid, don't fetch
  if (isCacheValid(lastFetchedAt)) {
    return false;
  }

  // If too many retries, don't fetch (will use cached/default)
  if (retryCount >= CONFIG_CACHE_SETTINGS.MAX_RETRY_ATTEMPTS) {
    return false;
  }

  return true;
};

export default {
  fetchAppConfig,
  fetchBrandingConfig,
  fetchTextsConfig,
  fetchFeatureFlags,
  isCacheValid,
  shouldFetchConfig,
};

