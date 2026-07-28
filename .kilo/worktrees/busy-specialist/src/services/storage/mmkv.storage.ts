// ============================================
// DhwaniAstro - MMKV Storage Service
// ============================================

import { MMKV } from 'react-native-mmkv';

/**
 * MMKV Storage instance
 */
export const mmkv = new MMKV({
  id: 'dhwaniastro-storage',
  encryptionKey: 'dhwaniastro-secure-key', // Replace with secure key in production
});

/**
 * Service for non-sensitive data storage using MMKV
 * Used for app settings, cache, user preferences
 */
class MMKVStorageService {
  private mmkv: MMKV;

  constructor(mmkv: MMKV) {
    this.mmkv = mmkv;
  }

  /**
   * Save a string value
   */
  setItem(key: string, value: string): void {
    this.mmkv.set(key, value);
  }

  /**
   * Get a string value
   */
  getItem(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  /**
   * Save a number value
   */
  setNumber(key: string, value: number): void {
    this.mmkv.set(key, value);
  }

  /**
   * Get a number value
   */
  getNumber(key: string): number | undefined {
    return this.mmkv.getNumber(key);
  }

  /**
   * Save a boolean value
   */
  setBoolean(key: string, value: boolean): void {
    this.mmkv.set(key, value);
  }

  /**
   * Get a boolean value
   */
  getBoolean(key: string): boolean | undefined {
    return this.mmkv.getBoolean(key);
  }

  /**
   * Save an object (JSON stringified)
   */
  setObject<T>(key: string, value: T): void {
    const json = JSON.stringify(value);
    this.mmkv.set(key, json);
  }

  /**
   * Get an object (JSON parsed)
   */
  getObject<T>(key: string): T | undefined {
    const json = this.mmkv.getString(key);
    if (json) {
      try {
        return JSON.parse(json) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Delete a key (alias for deleteItem)
   */
  removeItem(key: string): void {
    this.mmkv.delete(key);
  }

  /**
   * Delete a key
   */
  deleteItem(key: string): void {
    this.mmkv.delete(key);
  }

  /**
   * Check if key exists
   */
  hasItem(key: string): boolean {
    return this.mmkv.contains(key);
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.mmkv.clearAll();
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    return this.mmkv.getAllKeys();
  }

  /**
   * Get multiple values as object
   */
  getMultiple(keys: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      if (this.hasItem(key)) {
        const value = this.getItem(key);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    }
    return result;
  }

  /**
   * Store array
   */
  setArray<T>(key: string, value: T[]): void {
    const json = JSON.stringify(value);
    this.mmkv.set(key, json);
  }

  /**
   * Get array
   */
  getArray<T>(key: string): T[] | undefined {
    const json = this.mmkv.getString(key);
    if (json) {
      try {
        return JSON.parse(json) as T[];
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

export const mmkvStorage = new MMKVStorageService(mmkv);

/**
 * Storage Keys - centralized key management
 */
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',

  // Session
  ACTIVE_SESSION: 'active_session',
  SESSION_HISTORY: 'session_history',
  CRASH_RECOVERY_STATE: 'crash_recovery_state',

  // Chat
  CHAT_CACHE: 'chat_cache',
  MESSAGE_QUEUE: 'message_queue',
  DRAFT_MESSAGES: 'draft_messages',

  // App State
  APP_STATE: 'app_state',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Cache
  ASTROLOGER_CACHE: 'astrologer_cache',
  USER_CACHE: 'user_cache',
  NOTIFICATION_CACHE: 'notification_cache',

  // Settings
  SETTINGS: 'settings',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
  FCM_TOKEN: 'fcm_token',

  // Analytics
  ANALYTICS_USER_ID: 'analytics_user_id',
  SESSION_START_TIME: 'session_start_time',

  // Debug
  DEBUG_LOGS: 'debug_logs',

  // User Preferences
  LAST_PHONE_NUMBER: 'last_phone_number',
} as const;

export default mmkvStorage;

