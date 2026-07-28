/**
 * MainNavigator Custom Hooks
 * Contains all custom hooks used in MainNavigator for better code organization
 */

import {useState, useCallback, useEffect, useRef} from 'react';
import {useAuthStore, useAppStore, useProfileStore} from '../../stores';
import type {User} from '../../types/global.types';
import type {
  MainTabKey,
  SidebarScreenKey,
  GameScreenKey,
  SidebarMenuItem,
} from './mainNavigator.types';
import {DEFAULT_ACTIVE_TAB} from './mainNavigator.constants';
import {useProfile} from '../../services/api/profile/profile.hooks';

// =============================================================================
// Tab Navigation Hook
// =============================================================================

export interface UseTabNavigationProps {
  onShowGiftModal?: () => void;
}

export interface UseTabNavigationReturn {
  activeTab: MainTabKey;
  handleTabPress: (tabKey: string) => void;
  handleNavigateToTab: (tab: string) => void;
}

export const useTabNavigation = ({
  onShowGiftModal,
}: UseTabNavigationProps = {}): UseTabNavigationReturn => {
  const [activeTab, setActiveTab] = useState<MainTabKey>(DEFAULT_ACTIVE_TAB);

  const handleTabPress = useCallback((tabKey: string) => {
    setActiveTab(tabKey as MainTabKey);
    // Gift modal should only be shown once after login, not on every tab press
    // The modal will be triggered separately from the login flow
  }, []);

  const handleNavigateToTab = useCallback((tab: string) => {
    setActiveTab(tab as MainTabKey);
  }, []);

  return {
    activeTab,
    handleTabPress,
    handleNavigateToTab,
  };
};

// =============================================================================
// Sidebar Navigation Hook
// =============================================================================

export interface UseSidebarNavigationProps {
  onSetActiveTab?: (tab: string) => void;
}

export interface UseSidebarNavigationReturn {
  sidebarScreen: SidebarScreenKey;
  isSidebarVisible: boolean;
  handleMenuPress: () => void;
  handleSidebarClose: () => void;
  handleMenuItemPress: (item: SidebarMenuItem) => void;
  handleWalletPress: () => void;
  handleSidebarBack: () => void;
  setSidebarScreen: (screen: SidebarScreenKey) => void;
}

export const useSidebarNavigation = ({
  onSetActiveTab,
}: UseSidebarNavigationProps = {}): UseSidebarNavigationReturn => {
  const [sidebarScreen, setSidebarScreen] = useState<SidebarScreenKey>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleMenuPress = useCallback(() => {
    setIsSidebarVisible(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarVisible(false);
  }, []);

  const handleMenuItemPress = useCallback(
    (item: SidebarMenuItem) => {
      // Handle menu item navigation
      console.log('Menu item pressed:', item.key);
      switch (item.key) {
        case 'home':
          onSetActiveTab?.('home');
          break;
        case 'my_profile':
          setSidebarScreen('profile');
          break;
        case 'wallet':
          setSidebarScreen('wallet');
          break;
        case 'session_history':
          setSidebarScreen('session_history');
          break;
        case 'chat_history':
          setSidebarScreen('chat_history');
          break;
        case 'my_following':
          setSidebarScreen('my_following');
          break;
        case 'free_services':
          setSidebarScreen('free_services');
          break;
        case 'daily_puja':
          setSidebarScreen('daily_puja');
          break;
        case 'game':
          setSidebarScreen('game');
          break;
        case 'support':
          setSidebarScreen('support');
          break;
        case 'settings':
          setSidebarScreen('settings');
          break;
        case 'about':
          setSidebarScreen('about');
          break;
        default:
          break;
      }
      setIsSidebarVisible(false);
    },
    [onSetActiveTab],
  );

  const handleWalletPress = useCallback(() => {
    setSidebarScreen('wallet');
    setIsSidebarVisible(false);
  }, []);

  const handleSidebarBack = useCallback(() => {
    setSidebarScreen(null);
  }, []);

  return {
    sidebarScreen,
    isSidebarVisible,
    handleMenuPress,
    handleSidebarClose,
    handleMenuItemPress,
    handleWalletPress,
    handleSidebarBack,
    setSidebarScreen,
  };
};

// =============================================================================
// Gift Modal Hook
// =============================================================================

export interface UseGiftModalReturn {
  isGiftModalVisible: boolean;
  showGiftModalOnce: () => void;
  closeGiftModal: () => void;
}

export const useGiftModal = (): UseGiftModalReturn => {
  const [isGiftModalVisible, setIsGiftModalVisible] = useState(false);
  const hasShownGiftModal = useRef(false);

  const showGiftModalOnce = useCallback(() => {
    if (!hasShownGiftModal.current) {
      hasShownGiftModal.current = true;
      setIsGiftModalVisible(true);
    }
  }, []);

  const closeGiftModal = useCallback(() => {
    setIsGiftModalVisible(false);
  }, []);

  return {
    isGiftModalVisible,
    showGiftModalOnce,
    closeGiftModal,
  };
};

// =============================================================================
// Profile Initialization Hook
// =============================================================================

export interface UseProfileInitializationReturn {
  isRequestModalVisible: boolean;
  dismissProfileRequest: () => void;
  completeProfileRequest: () => void;
}

export const useProfileInitialization = (): UseProfileInitializationReturn => {
  const {isAuthenticated} = useAuthStore();
  const {isLoggedIn} = useAppStore();
  const {
    isRequestModalVisible,
    dismissProfileRequest,
    completeProfileRequest,
    initializeFromUser,
  } = useProfileStore();

  // Initialize profile completion when user logs in
  useEffect(() => {
    if (isAuthenticated && isLoggedIn) {
      initializeFromUser();
    }
  }, [isAuthenticated, isLoggedIn, initializeFromUser]);

  return {
    isRequestModalVisible,
    dismissProfileRequest,
    completeProfileRequest,
  };
};

// =============================================================================
// Game Navigation Hook
// =============================================================================

export interface UseGameNavigationReturn {
  currentGameScreen: GameScreenKey;
  handleGameNavigateToBlessing: () => void;
  handleGameNavigateToBattle: () => void;
  handleGameNavigateToResult: () => void;
  handleGameNavigateToBattleHome: () => void;
  handleGameBack: () => void;
  setCurrentGameScreen: (screen: GameScreenKey) => void;
}

export const useGameNavigation = (
  onGameBack: () => void,
): UseGameNavigationReturn => {
  const [currentGameScreen, setCurrentGameScreen] =
    useState<GameScreenKey>(null);

  const handleGameNavigateToBlessing = useCallback(() => {
    setCurrentGameScreen('blessing');
  }, []);

  const handleGameNavigateToBattle = useCallback(() => {
    setCurrentGameScreen('battle');
  }, []);

  const handleGameNavigateToResult = useCallback(() => {
    setCurrentGameScreen('result');
  }, []);

  const handleGameNavigateToBattleHome = useCallback(() => {
    setCurrentGameScreen('battleHome');
  }, []);

  const handleGameBack = useCallback(() => {
    setCurrentGameScreen(null);
    onGameBack();
  }, [onGameBack]);

  return {
    currentGameScreen,
    handleGameNavigateToBlessing,
    handleGameNavigateToBattle,
    handleGameNavigateToResult,
    handleGameNavigateToBattleHome,
    handleGameBack,
    setCurrentGameScreen,
  };
};

// =============================================================================
// Auth & User Hook
// =============================================================================

export interface UseAuthUserReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  handleLogout: () => void;
}

export interface UseAuthUserProps {
  onLogout?: () => void;
}

export const useAuthUser = ({
  onLogout,
}: UseAuthUserProps = {}): UseAuthUserReturn => {
  const authState = useAuthStore();
  const {profile, updateProfile, updating} = useProfile();

  // const authState = useAuthStore();
  const {isLoggedIn: appIsLoggedIn} = useAppStore();

  const handleLogout = useCallback(() => {
    authState.logout();
    useAppStore.getState().setIsLoggedIn(false);
    onLogout?.();
  }, [authState, onLogout]);

  return {
    user: profile,
    // user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoggedIn: appIsLoggedIn,
    handleLogout,
  };
};

// =============================================================================
// Notification Hook (Deprecated - use notification store instead)
// =============================================================================

// The notification count is now managed via useNotificationStore
// Keep this for backward compatibility if needed
