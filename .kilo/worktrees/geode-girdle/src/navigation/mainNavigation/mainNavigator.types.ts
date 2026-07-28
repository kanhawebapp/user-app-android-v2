/**
 * MainNavigator Type Definitions
 * Contains all types used in MainNavigator component
 */

// Tab navigation keys
export type MainTabKey = 'home' | 'chatCall' | 'live' | 'shop' | 'remedies';

// Sidebar screen navigation keys
export type SidebarScreenKey =
  | 'profile'
  | 'wallet'
  | 'session_history'
  | 'chat_history'
  | 'my_following'
  | 'free_services'
  | 'support'
  | 'settings'
  | 'about'
  | 'daily_puja'
  | 'game'
  | 'edit_profile'
  | null;

// Game screen navigation keys
export type GameScreenKey =
  | 'battleHome'
  | 'blessing'
  | 'battle'
  | 'result'
  | null;

// Props interface for MainNavigator
export interface MainNavigatorProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToAstrologerList?: () => void;
  onNavigateToEditProfile?: () => void;
  onLogout?: () => void;
}

// Navigation handler types
export interface TabNavigationHandlers {
  activeTab: MainTabKey;
  handleTabPress: (tabKey: string) => void;
  handleNavigateToTab: (tab: string) => void;
}

export interface SidebarNavigationHandlers {
  sidebarScreen: SidebarScreenKey;
  handleMenuPress: () => void;
  handleSidebarClose: () => void;
  handleMenuItemPress: (item: SidebarMenuItem) => void;
  handleWalletPress: () => void;
  handleSidebarBack: () => void;
  isSidebarVisible: boolean;
}

export interface GameNavigationHandlers {
  currentGameScreen: GameScreenKey;
  handleGameNavigateToBlessing: () => void;
  handleGameNavigateToBattle: () => void;
  handleGameNavigateToResult: () => void;
  handleGameNavigateToBattleHome: () => void;
  handleGameBack: () => void;
}

// Sidebar menu item type (imported from Sidebar component)
import type {SidebarMenuItem} from '../../components/Sidebar/types';
export type {SidebarMenuItem};
