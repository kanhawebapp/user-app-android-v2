/**
 * Auth Store - Zustand
 * Manages authentication state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '../services/storage/secure.storage';
import { STORAGE_KEYS } from '../constants/app.constants';
import type { User } from '../types/global.types';

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
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
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

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setIsGuest: (isGuest) => set({ isGuest }),

      setTokens: async (accessToken, refreshToken) => {
        await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        set({ accessToken, refreshToken });
      },

      setLoading: (isLoading) => set({ isLoading }),

      login: async (user, accessToken, refreshToken) => {
        await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });
      },

      loginAsGuest: async (user) => {
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        set({
          user,
          isAuthenticated: false,
          isGuest: true,
          isLoading: false,
        });
      },

      logout: async () => {
        await secureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
        await secureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
        await secureStorage.deleteItem(STORAGE_KEYS.USER_DATA);
        
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
          set({ isInitializing: true });
          
          const [accessToken, refreshToken, userData] = await Promise.all([
            secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
            secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
            secureStorage.getItem(STORAGE_KEYS.USER_DATA),
          ]);

          if (accessToken && userData) {
            const user = JSON.parse(userData) as User;
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isInitializing: false,
            });
          } else {
            set({ isInitializing: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isInitializing: false });
        }
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },

      updateWalletBalance: (balance) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, walletBalance: balance };
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      partialize: (state) => ({
        // Only persist these, tokens handled separately in secure storage
        isInitializing: state.isInitializing,
      }),
    }
  )
);

export default useAuthStore;

