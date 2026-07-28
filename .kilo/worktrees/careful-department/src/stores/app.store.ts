/**
 * App Store - Zustand
 * Manages global app state, theme, language, network status
 */

import { create } from 'zustand';
import type { Mode } from '../theme/colors';
import type { AppStateStatus } from 'react-native';

interface AppState {
  // Theme
  themeMode: Mode;
  isDarkMode: boolean;
  
  // Language
  language: string;
  locale: string;
  
  // Network
  isOnline: boolean;
  isInternetReachable: boolean;
  
  // App State
  appState: AppStateStatus;
  isAppReady: boolean;
  isSplashComplete: boolean;
  
  // Onboarding State
  currentSplashIndex: number;
  onboardingCompleted: boolean;
  
  // Auth State - track if user is logged in or came from guest login
  isLoggedIn: boolean;
  
  // Feature Flags
  enableAnalytics: boolean;
  enablePushNotifications: boolean;
  
  // Actions
  setThemeMode: (mode: Mode) => void;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
  setLocale: (locale: string) => void;
  
  setOnline: (online: boolean) => void;
  setInternetReachable: (reachable: boolean) => void;
  
  setAppState: (state: AppStateStatus) => void;
  setAppReady: (ready: boolean) => void;
  setSplashComplete: (complete: boolean) => void;
  
  setCurrentSplashIndex: (index: number) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  
  setEnableAnalytics: (enabled: boolean) => void;
  setEnablePushNotifications: (enabled: boolean) => void;
  
  resetApp: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  themeMode: 'light',
  isDarkMode: false,
  language: 'en',
  locale: 'en-US',
  isOnline: true,
  isInternetReachable: true,
  appState: 'active',
  isAppReady: false,
  isSplashComplete: false,
  currentSplashIndex: 0,
  onboardingCompleted: false,
  isLoggedIn: false,
  enableAnalytics: true,
  enablePushNotifications: true,

  setThemeMode: (mode) => set({ themeMode: mode, isDarkMode: mode === 'dark' }),
  
  toggleTheme: () => set((state) => ({ 
    themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    isDarkMode: state.themeMode !== 'dark'
  })),
  
  setLanguage: (language) => set({ language }),
  setLocale: (locale) => set({ locale }),
  
  setOnline: (isOnline) => set({ isOnline }),
  setInternetReachable: (isInternetReachable) => set({ isInternetReachable: isInternetReachable }),
  
  setAppState: (appState) => set({ appState }),
  setAppReady: (isAppReady) => set({ isAppReady }),
  setSplashComplete: (isSplashComplete) => set({ isSplashComplete }),
  
  setCurrentSplashIndex: (index: number) => set({ currentSplashIndex: index }),
  setOnboardingCompleted: (completed: boolean) => set({ onboardingCompleted: completed }),
  
  setIsLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),
  
  setEnableAnalytics: (enableAnalytics) => set({ enableAnalytics }),
  setEnablePushNotifications: (enablePushNotifications) => set({ enablePushNotifications }),
  
  resetApp: () => set({
    themeMode: 'light',
    isDarkMode: false,
    language: 'en',
    locale: 'en-US',
    isOnline: true,
    isInternetReachable: true,
    appState: 'active',
    isAppReady: false,
    isSplashComplete: false,
    currentSplashIndex: 0,
    onboardingCompleted: false,
    isLoggedIn: false,
    enableAnalytics: true,
    enablePushNotifications: true,
  }),
}));

export default useAppStore;

