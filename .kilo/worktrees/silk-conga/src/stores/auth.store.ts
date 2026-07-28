/**
 * Auth Store - Zustand
 * Manages authentication state
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {secureStorage} from '../services/storage/secure.storage';
import {STORAGE_KEYS} from '../constants/app.constants';
import {loggingService} from '../services/logging';
import type {User} from '../types/global.types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  loginAsGuest: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateWalletBalance: (balance: number) => void;
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

// Persisted state keys (stored in MMKV via zustand persist)
const PERSISTED_STATE_KEYS = ['isInitializing'] as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      isInitializing: true,
      accessToken: null,
      refreshToken: null,

      setUser: user => set({user, isAuthenticated: !!user}),

      setIsGuest: isGuest => set({isGuest}),

      setTokens: async (accessToken, refreshToken) => {
        await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        set({accessToken, refreshToken});
      },

      setLoading: isLoading => set({isLoading}),

      login: async (user, accessToken, refreshToken) => {
        loggingService.info('[AuthStore] Saving tokens...', {
          userId: user.id,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        });

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        await secureStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(user),
        );

        loggingService.info('[AuthStore] Tokens saved successfully', {
          userId: user.id,
        });

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });
      },

      loginAsGuest: async user => {
        await secureStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(user),
        );

        set({
          user,
          isAuthenticated: false,
          isGuest: true,
          isLoading: false,
        });
      },

      logout: async () => {
        loggingService.info('[AuthStore] Logging out...');

        await secureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
        await secureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
        await secureStorage.deleteItem(STORAGE_KEYS.USER_DATA);

        loggingService.info('[AuthStore] Logged out successfully');

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isGuest: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        try {
          set({isInitializing: true});
          loggingService.info('[AuthStore] Starting initialization...');

          const [accessToken, refreshToken, userData] = await Promise.all([
            secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
            secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
            secureStorage.getItem(STORAGE_KEYS.USER_DATA),
          ]);

          loggingService.info('[AuthStore] Tokens read from storage', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasUserData: !!userData,
          });

          if (accessToken && userData) {
            console.log('Access Token (from storage):', accessToken);
            console.log('Refresh Token (from storage):', refreshToken);
            const user = JSON.parse(userData) as User;
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isInitializing: false,
            });
            loggingService.info('[AuthStore] Auth restored from storage', {
              userId: user.id,
              userName: user.name,
            });
          } else if (accessToken) {
            set({
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isInitializing: false,
            });
            loggingService.info(
              '[AuthStore] Auth restored (token only, no user data)',
              {
                hasAccessToken: !!accessToken,
              },
            );
          } else {
            set({isInitializing: false});
            loggingService.info(
              '[AuthStore] No auth tokens found, user not authenticated',
            );
          }
        } catch (error) {
          loggingService.error('[AuthStore] Initialization failed', {error});
          set({isInitializing: false});
        }
      },

      updateUser: (updates: Partial<User>) => {
        const {user} = get();
        if (user) {
          const updatedUser = {...user, ...updates};
          secureStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUser),
          );
          set({user: updatedUser});
          loggingService.info('[AuthStore] User updated', {updates});
        }
      },

      updateWalletBalance: (balance: number) => {
        const {user} = get();
        if (user) {
          const updatedUser = {...user, walletBalance: balance};
          secureStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUser),
          );
          set({user: updatedUser});
          loggingService.info('[AuthStore] Wallet balance updated', {balance});
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      partialize: state => ({
        isInitializing: state.isInitializing,
      }),
    },
  ),
);

export default useAuthStore;
