/**
 * MainNavigator Render Helpers
 * Contains all screen rendering functions for better code organization
 * Lazy loading implemented for all screens to improve initial load time
 * Uses Shimmer-based fallbacks for production-ready loading experience
 */

import React, {Suspense, lazy} from 'react';
import {View} from 'react-native';
import type {MainTabKey, SidebarScreenKey} from './mainNavigator.types';
import type {MainNavigatorProps} from './mainNavigator.types';

// Import shimmer fallback system
import {
  ScreenFallbackMap,
  SidebarFallbackMap,
  DefaultFallback,
} from '../../components/Shimmer';

// =============================================================================
// Lazy-loaded Tab Screens
// =============================================================================
const HomeScreen = lazy(() =>
  import('../../screens/main/HomeScreen').then(module => ({default: module.default})),
);
const ChatCallScreen = lazy(() =>
  import('../../screens/main/chatcall').then(module => ({default: module.default})),
);
const LiveScreen = lazy(() =>
  import('../../screens/main/LiveScreen').then(module => ({default: module.default})),
);
const ShopScreen = lazy(() =>
  import('../../screens/main/ShopScreen').then(module => ({default: module.default})),
);
const RemediesScreen = lazy(() =>
  import('../../screens/main/RemediesScreen').then(module => ({default: module.default})),
);

// =============================================================================
// Lazy-loaded Sidebar Screens
// =============================================================================
const ProfileScreen = lazy(() =>
  import('../../screens/main/ProfileScreen').then(module => ({default: module.default})),
);
const WalletScreen = lazy(() =>
  import('../../screens/main/wallet/WalletScreen').then(module => ({default: module.default})),
);
const SessionHistoryScreen = lazy(() =>
  import('../../screens/main/SessionHistoryScreen').then(module => ({default: module.default})),
);
const MyFollowingScreen = lazy(() =>
import('../../features/my-following').then(module => ({default: module.MyFollowingScreen})),
);
const DailyPujaScreen = lazy(() =>
  import('../../features/dailyPuja').then(module => ({default: module.DailyPujaScreen})),
);
const FreeServicesScreen = lazy(() =>
import('../../features/free-services').then(module => ({default: module.FreeServicesScreen})),
);
const SupportScreen = lazy(() =>
  import('../../screens/main/SupportScreen').then(module => ({default: module.default})),
);
const SettingsScreen = lazy(() =>
  import('../../screens/main/SettingsScreen').then(module => ({default: module.default})),
);
const AboutScreen = lazy(() =>
import('../../features/about').then(module => ({default: module.AboutScreen})),
);

// =============================================================================
// Helper to get shimmer fallback for tabs
// =============================================================================
const getTabShimmerFallback = (tabKey: MainTabKey): React.ReactNode => {
  return ScreenFallbackMap[tabKey] ?? <DefaultFallback />;
};

// =============================================================================
// Helper to get shimmer fallback for sidebar screens
// =============================================================================
const getSidebarShimmerFallback = (
  sidebarKey: SidebarScreenKey
): React.ReactNode => {
  if (!sidebarKey) {
    return <DefaultFallback />;
  }
  return SidebarFallbackMap[sidebarKey] ?? <DefaultFallback />;
};

// =============================================================================
// Tab Screen Rendering
// =============================================================================

export interface RenderScreenProps {
  activeTab: MainTabKey;
  onNavigateToLogin?: MainNavigatorProps['onNavigateToLogin'];
  onNavigateToSignup?: MainNavigatorProps['onNavigateToSignup'];
  handleNavigateToTab: (tab: string) => void;
}

export const renderScreen = ({
  activeTab,
  onNavigateToLogin,
  onNavigateToSignup,
  handleNavigateToTab,
}: RenderScreenProps) => {
  // Get shimmer fallback for current tab
  const shimmerFallback = getTabShimmerFallback(activeTab);

  switch (activeTab) {
    case 'home':
      return (
        <Suspense fallback={shimmerFallback}>
          <HomeScreen
            onNavigateToTab={handleNavigateToTab}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'chatCall':
      return (
        <Suspense fallback={shimmerFallback}>
          <ChatCallScreen
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'live':
      return (
        <Suspense fallback={shimmerFallback}>
          <LiveScreen
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'shop':
      return (
        <Suspense fallback={shimmerFallback}>
          <ShopScreen
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'remedies':
      return (
        <Suspense fallback={shimmerFallback}>
          <RemediesScreen
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    default:
      return (
        <Suspense fallback={shimmerFallback}>
          <HomeScreen
            onNavigateToTab={handleNavigateToTab}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
  }
};

// =============================================================================
// Sidebar Screen Rendering
// =============================================================================

export interface RenderSidebarScreenProps {
  sidebarScreen: SidebarScreenKey;
  handleSidebarBack: () => void;
}

export const renderSidebarScreen = ({
  sidebarScreen,
  handleSidebarBack,
}: RenderSidebarScreenProps) => {
  // Get shimmer fallback for current sidebar screen
  const shimmerFallback = getSidebarShimmerFallback(sidebarScreen);

  switch (sidebarScreen) {
    case 'profile':
      return (
        <Suspense fallback={shimmerFallback}>
          <ProfileScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'wallet':
      return (
        <Suspense fallback={shimmerFallback}>
          <WalletScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'session_history':
      return (
        <Suspense fallback={shimmerFallback}>
          <SessionHistoryScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'my_following':
      return (
        <Suspense fallback={shimmerFallback}>
          <MyFollowingScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'daily_puja':
      return (
        <Suspense fallback={shimmerFallback}>
          <DailyPujaScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'free_services':
      return (
        <Suspense fallback={shimmerFallback}>
          <FreeServicesScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'support':
      return (
        <Suspense fallback={shimmerFallback}>
          <SupportScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'settings':
      return (
        <Suspense fallback={shimmerFallback}>
          <SettingsScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'about':
      return (
        <Suspense fallback={shimmerFallback}>
          <AboutScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    default:
      return null;
  }
};

