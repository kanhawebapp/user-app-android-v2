// ============================================
// DhwaniAstro - Secure Storage Service
// ============================================

import * as Keychain from 'react-native-keychain';
import {loggingService} from '../logging';

const STORAGE_SERVICE = 'dhwaniastro-secure';

class SecureStorageService {
  private memoryCache: Record<string, string> = {};
  private isInitialized: boolean = false;

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const result = await Keychain.getGenericPassword({
        service: STORAGE_SERVICE,
      });

      if (result && typeof result === 'object' && 'password' in result) {
        const storedData = result.password;
        try {
          const allCredentials = JSON.parse(storedData);
          if (allCredentials && typeof allCredentials === 'object') {
            this.memoryCache = allCredentials;
          }
        } catch {
          this.memoryCache = {};
        }
      }

      this.isInitialized = true;
    } catch (error) {
      loggingService.error('[SecureStorage] Failed to initialize', {error});
      this.isInitialized = true;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.initialize();

      this.memoryCache[key] = value;

      // console.log(
      //   `[SecureStorage] Saving token: ${key}, value: ${value.substring(
      //     0,
      //     20,
      //   )}...`,
      // );

      const allCredentials: Record<string, string> = {...this.memoryCache};
      const jsonString = JSON.stringify(allCredentials);

      await Keychain.setGenericPassword(STORAGE_SERVICE, jsonString, {
        service: STORAGE_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      loggingService.info(`[SecureStorage] Token saved: ${key}`);
    } catch (error) {
      loggingService.error('[SecureStorage] Error saving item', {key, error});
      throw new Error('Failed to save to secure storage');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      await this.initialize();

      if (this.memoryCache[key]) {
        // console.log(
        //   `[SecureStorage] Token found in cache: ${key}, value: ${this.memoryCache[
        //     key
        //   ].substring(0, 20)}...`,
        // );
        loggingService.info(`[SecureStorage] Token read from cache: ${key}`);
        return this.memoryCache[key];
      }

      const result = await Keychain.getGenericPassword({
        service: STORAGE_SERVICE,
      });

      if (result && typeof result === 'object' && 'password' in result) {
        const storedData = result.password;
        try {
          const allCredentials = JSON.parse(storedData);
          if (allCredentials && typeof allCredentials === 'object') {
            this.memoryCache = allCredentials;
            const value = allCredentials[key] || null;
            if (value) {
              // console.log(
              //   `[SecureStorage] Token found in Keychain: ${key}, value: ${value.substring(
              //     0,
              //     20,
              //   )}...`,
              // );
              loggingService.info(
                `[SecureStorage] Token read from Keychain: ${key}`,
              );
            } else {
              // console.log(`[SecureStorage] Key not found in Keychain: ${key}`);
            }
            return value;
          }
        } catch {
          return null;
        }
      }

      // console.log(`[SecureStorage] Token not found: ${key}`);
      loggingService.info(`[SecureStorage] Token not found: ${key}`);
      return null;
    } catch (error) {
      loggingService.error('[SecureStorage] Error getting item', {key, error});
      return null;
    }
  }

  async deleteItem(key: string): Promise<void> {
    try {
      await this.initialize();

      delete this.memoryCache[key];

      const allCredentials: Record<string, string> = {...this.memoryCache};
      if (Object.keys(allCredentials).length > 0) {
        const jsonString = JSON.stringify(allCredentials);
        await Keychain.setGenericPassword(STORAGE_SERVICE, jsonString, {
          service: STORAGE_SERVICE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      } else {
        await Keychain.resetGenericPassword({
          service: STORAGE_SERVICE,
        });
      }

      loggingService.info(`[SecureStorage] Token deleted: ${key}`);
    } catch (error) {
      loggingService.error('[SecureStorage] Error deleting item', {key, error});
      throw new Error('Failed to delete from secure storage');
    }
  }

  async clearAll(): Promise<void> {
    try {
      this.memoryCache = {};
      this.isInitialized = false;
      await Keychain.resetGenericPassword({
        service: STORAGE_SERVICE,
      });
      loggingService.info('[SecureStorage] All tokens cleared');
    } catch (error) {
      loggingService.error('[SecureStorage] Error clearing storage', {error});
      throw new Error('Failed to clear secure storage');
    }
  }

  async hasItem(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

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

  async setMultiple(items: Record<string, string>): Promise<void> {
    await this.initialize();

    for (const [key, value] of Object.entries(items)) {
      this.memoryCache[key] = value;
    }

    const allCredentials: Record<string, string> = {...this.memoryCache};
    const jsonString = JSON.stringify(allCredentials);

    await Keychain.setGenericPassword(STORAGE_SERVICE, jsonString, {
      service: STORAGE_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    loggingService.info('[SecureStorage] Multiple tokens saved', {
      keys: Object.keys(items),
    });
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.deleteItem(key);
    }
  }
}

export const secureStorage = new SecureStorageService();
export default secureStorage;
