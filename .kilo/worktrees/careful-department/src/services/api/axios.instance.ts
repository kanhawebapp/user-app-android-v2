// ============================================
// DhwaniAstro - Axios Instance
// ============================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { 
  API_BASE_URL, 
  TIMEOUT, 
  CONTENT_TYPES,
  HTTP_STATUS,
  RETRY_CONFIG,
} from '../../constants/api.constants';
import { STORAGE_KEYS } from '../../constants/app.constants';
import type { ApiResponse, ApiError } from '../../types/global.types';
import secureStorage from '../storage/secure.storage';
import loggingService from '../logging';
import { useConfigStore } from '../../stores/config.store';

/**
 * Extended Axios request config with retry tracking properties
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

/**
 * Get current API base URL from config store
 * Falls back to development URL if config not available
 */
const getCurrentBaseUrl = (): string => {
  try {
    const state = useConfigStore.getState();
    const config = state.config;
    
    if (config?.api?.baseUrl) {
      return config.api.baseUrl;
    }
    
    const environment = config?.api?.environment || 'development';
    switch (environment) {
      case 'production':
        return API_BASE_URL.PRODUCTION;
      case 'staging':
        return API_BASE_URL.STAGING;
      case 'development':
      default:
        return API_BASE_URL.DEVELOPMENT;
    }
  } catch {
    // If store not initialized, use default
    return API_BASE_URL.DEVELOPMENT;
  }
};

/**
 * Create and configure axios instance with interceptors
 */
export const createAxiosInstance = (): AxiosInstance => {
  const currentBaseUrl = getCurrentBaseUrl();
  
  const axiosInstance = axios.create({
    baseURL: currentBaseUrl,
    timeout: TIMEOUT.DEFAULT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
      'Accept': CONTENT_TYPES.JSON,
    },
    validateStatus: (status) => {
      return status >= 200 && status < 300;
    },
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
      try {
        // Get tokens from secure storage
        const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add device info
        const deviceId = await secureStorage.getItem(STORAGE_KEYS.DEVICE_ID);
        if (deviceId) {
          config.headers['X-Device-ID'] = deviceId;
        }

        // Add timestamp
        config.headers['X-Request-Time'] = new Date().toISOString();

        loggingService.info(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          url: config.url,
          method: config.method,
        });

        return config;
      } catch (error) {
        loggingService.error('[API] Request interceptor error', { error });
        return config;
      }
    },
    (error: AxiosError) => {
      loggingService.error('[API] Request interceptor error', { error });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      loggingService.info(`[API] Response ${response.status}`, {
        url: response.config.url,
        status: response.status,
      });

      return response;
    },
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Handle 401 Unauthorized - Token refresh
      if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          if (refreshToken) {
            const currentBaseUrl = getCurrentBaseUrl();
            const response = await axios.post(`${currentBaseUrl}/v1/auth/refresh-token`, {
              refreshToken,
            });

            if (response.data?.data) {
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;

              await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
              await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return axiosInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          // Clear auth data and redirect to login
          await secureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
          await secureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
          await secureStorage.deleteItem(STORAGE_KEYS.USER_DATA);

          loggingService.warn('[API] Token refresh failed, logging out');

          // Dispatch logout event
          return Promise.reject({ 
            code: 'SESSION_EXPIRED', 
            message: 'Session expired. Please login again.',
            requiresLogout: true,
          });
        }
      }

      // Handle retry logic for server errors
      const statusCode = error.response?.status;
      if (
        statusCode &&
        (RETRY_CONFIG.RETRYABLE_STATUS_CODES as readonly number[]).includes(statusCode) &&
        originalRequest
      ) {
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        if (originalRequest._retryCount < RETRY_CONFIG.MAX_ATTEMPTS) {
          const delay = Math.min(
            RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, originalRequest._retryCount),
            RETRY_CONFIG.MAX_DELAY
          );

          await new Promise<void>(resolve => setTimeout(resolve, delay));

          loggingService.info(`[API] Retrying request (${originalRequest._retryCount})`, {
            url: originalRequest.url,
            attempt: originalRequest._retryCount,
          });

          return axiosInstance(originalRequest);
        }
      }

      // Format error response
      const apiError: ApiError = {
        code: error.response?.data?.error?.code || 'UNKNOWN',
        message: error.response?.data?.error?.message || error.message || 'An unknown error occurred',
        details: error.response?.data?.error?.details,
      };

      loggingService.error('[API] Request failed', {
        url: error.config?.url,
        status: error.response?.status,
        error: apiError,
      });

      return Promise.reject(apiError);
    }
  );

  return axiosInstance;
};

/**
 * API instance singleton
 */
export const api = createAxiosInstance();

/**
 * Create API instance for file uploads
 */
export const createUploadAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: getCurrentBaseUrl(),
    timeout: TIMEOUT.UPLOAD,
    headers: {
      'Content-Type': CONTENT_TYPES.MULTIPART_FORM,
    },
  });
};

/**
 * Create API instance for downloads
 */
export const createDownloadAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: getCurrentBaseUrl(),
    timeout: TIMEOUT.DOWNLOAD,
    responseType: 'blob',
  });
};

export default api;