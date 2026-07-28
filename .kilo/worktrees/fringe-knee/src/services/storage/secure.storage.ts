// ============================================
// DhwaniAstro - Secure Storage Service
// ============================================

import * as Keychain from 'react-native-keychain';

/**
 * Service for secure storage operations using Keychain
 * Used for sensitive data like tokens, credentials
 */
class SecureStorageService {
  /**
   * Save a value to secure storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, {
        service: 'dhwaniastro-secure',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error('[SecureStorage] Error saving item:', error);
      throw new Error('Failed to save to secure storage');
    }
  }

  /**
   * Get a value from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: 'dhwaniastro-secure',
      });

      if (result && typeof result === 'object') {
        // Check if it's a username/password pair
        if ('password' in result && 'username' in result) {
          const credentials = result as { username: string; password: string };
          if (credentials.username === key) {
            return credentials.password;
          }
        }
        // If it's an object but not credentials, return null
        return null;
      }

      // If result is a string (raw password), return null as it's not what we expect
      if (typeof result === 'string') {
        return null;
      }

      return null;
    } catch (error) {
      console.error('[SecureStorage] Error getting item:', error);
      return null;
    }
  }

  /**
   * Delete a value from secure storage
   */
  async deleteItem(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({
        service: 'dhwaniastro-secure',
      });
    } catch (error) {
      console.error('[SecureStorage] Error deleting item:', error);
      throw new Error('Failed to delete from secure storage');
    }
  }

  /**
   * Clear all secure storage
   */
  async clearAll(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({
        service: 'dhwaniastro-secure',
      });
    } catch (error) {
      console.error('[SecureStorage] Error clearing storage:', error);
      throw new Error('Failed to clear secure storage');
    }
  }

  /**
   * Check if key exists
   */
  async hasItem(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

  /**
   * Get multiple values
   */
  async getMultiple(keys: string[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    for (const key of keys) {
      const value = await this.getItem(key);
      if (value !== null) {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Set multiple values
   */
  async setMultiple(items: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(items)) {
      await this.setItem(key, value);
    }
  }

  /**
   * Delete multiple values
   */
  async deleteMultiple(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.deleteItem(key);
    }
  }
}

export const secureStorage = new SecureStorageService();
export default secureStorage;

