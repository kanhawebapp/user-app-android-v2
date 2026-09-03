/**
 * MainNavigator Render Helpers
 * Contains all screen rendering functions for better code organization
 * Lazy loading implemented for all screens to improve initial load time
 * Uses Shimmer-based fallbacks for production-ready loading experience
 */

import React, {Suspense, lazy} from 'react';
import type {MainNavigatorProps, MainTabKey, SidebarScreenKey} from './mainNavigator.types';
// import type {MainNavigatorProps} from './mainNavigator.props';

// Import shimmer fallback system
import {
  ScreenFallbackMap,
  SidebarFallbackMap,
  DefaultFallback,
} from '../../components/Shimmer';
import {ProblemCategory} from '../../screens/main/home/types/index';

// =============================================================================
// Lazy-loaded Tab Screens
// =============================================================================
const HomeScreen = lazy(() =>
  import('../../screens/main/HomeScreen').then(module => ({
    default: module.default,
  })),
);
const ChatCallScreen = lazy(() =>
  import('../../screens/main/chatcall').then(module => ({
    default: module.default,
  })),
);
const LiveScreen = lazy(() =>
  import('../../screens/main/LiveScreen').then(module => ({
    default: module.default,
  })),
);
const ShopScreen = lazy(() =>
  import('../../screens/main/ShopScreen').then(module => ({
    default: module.default,
  })),
);
const RemediesScreen = lazy(() =>
  import('../../screens/main/RemediesScreen').then(module => ({
    default: module.default,
  })),
);
const MyBookingScreen = lazy(() =>
  import('../../screens/main/MyBookingScreen').then(module => ({
    default: module.default,
  })),
);




// =============================================================================
// Lazy-loaded Sidebar Screens
// =============================================================================
const ProfileScreen = lazy(() =>
  import('../../screens/main/ProfileScreen').then(module => ({
    default: module.default,
  })),
);
const WalletScreen = lazy(() =>
  import('../../screens/main/wallet/WalletScreen').then(module => ({
    default: module.default,
  })),
);
const SessionHistoryScreen = lazy(() =>
  import('../../screens/main/SessionHistoryScreen').then(module => ({
    default: module.default,
  })),
);
const ChatHistoryScreen = lazy(() =>
  import('../../screens/main/ChatHistoryScreen/ChatHistoryScreen').then(
    module => ({
      default: module.default,
    }),
  ),
);
const MyFollowingScreen = lazy(() =>
  import('../../features/my-following').then(module => ({
    default: module.MyFollowingScreen,
  })),
);
const DailyPujaScreen = lazy(() =>
  import('../../features/dailyPuja').then(module => ({
    default: module.DailyPujaScreen,
  })),
);
const FreeServicesScreen = lazy(() =>
  import('../../features/free-services').then(module => ({
    default: module.FreeServicesScreen,
  })),
);
const SupportScreen = lazy(() =>
  import('../../screens/main/SupportScreen').then(module => ({
    default: module.default,
  })),
);
const SettingsScreen = lazy(() =>
  import('../../screens/main/SettingsScreen').then(module => ({
    default: module.default,
  })),
);
const AboutScreen = lazy(() =>
  import('../../features/about').then(module => ({
    default: module.AboutScreen,
  })),
);
const FaqScreen = lazy(() =>
  import('../../features/faq/screens/FaqScreen').then(module => ({
    default: module.default,
  })),
);
const PrivacyPolicyScreen = lazy(() =>
  import('../../screens/legal/PrivacyPolicyScreen').then(module => ({
    default: module.default,
  })),
);
const UpdateProfileScreen = lazy(() =>
  import('../../screens/main/UpdateProfileScreen').then(module => ({
    default: module.default,
  })),
);
const BlogListingScreen = lazy(() =>
  import('../../screens/main/BlogListingScreen').then(module => ({
    default: module.default,
  })),
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
  sidebarKey: SidebarScreenKey,
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
  onNavigateToAstrologerList?: MainNavigatorProps['onNavigateToAstrologerList'];
  handleNavigateToTab: (tab: string) => void;
  onNavigateToProblemBaseAstroScreen?: (category: ProblemCategory) => void;
  onNavigateToAstrologerProfile?: (astrologer: any) => void;
  onNavigateToServiceDetails?: (service: any) => void;
  onNavigateToBlogListing?: () => void;
}

export const renderScreen = ({
  activeTab,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerList,
  handleNavigateToTab,
  onNavigateToProblemBaseAstroScreen,
  onNavigateToAstrologerProfile,
  onNavigateToServiceDetails,
  onNavigateToBlogListing,
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
            onNavigateToAstrologerList={onNavigateToAstrologerList}
            onNavigateToProblemBaseAstroScreen={
              onNavigateToProblemBaseAstroScreen
            }
            onNavigateToAstrologerProfile={onNavigateToAstrologerProfile}
            onNavigateToServiceDetails={onNavigateToServiceDetails}
            onNavigateToBlogListing={onNavigateToBlogListing}
          />
        </Suspense>
      );
    case 'chatCall':
      return (
        <Suspense fallback={shimmerFallback}>
          <ChatCallScreen
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
            onNavigateToAstrologerProfile={onNavigateToAstrologerProfile}
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
            onNavigateToMyBookings={() =>
              handleNavigateToTab('myBookings')
            }
            onNavigateToServiceDetails={onNavigateToServiceDetails}
          />
        </Suspense>
      );
    case 'myBookings':
      return (
        <Suspense fallback={shimmerFallback}>
          <MyBookingScreen />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={shimmerFallback}>
          <HomeScreen
            {...({
              onNavigateToTab: handleNavigateToTab,
              onNavigateToLogin,
              onNavigateToSignup,
            } as any)}
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
  handleNavigateToEditProfile?: () => void;
  onNavigateToLogin?: MainNavigatorProps['onNavigateToLogin'];
  onNavigateToSignup?: MainNavigatorProps['onNavigateToSignup'];
  onNavigateToAstrologerProfile?: (astrologer: any) => void;
}


export const renderSidebarScreen = ({
  sidebarScreen,
  handleSidebarBack,
  handleNavigateToEditProfile,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerProfile,
}: RenderSidebarScreenProps) => {

  // Get shimmer fallback for current sidebar screen
  const shimmerFallback = getSidebarShimmerFallback(sidebarScreen);

  switch (sidebarScreen) {
    case 'profile':
      return (
        <Suspense fallback={shimmerFallback}>
          <ProfileScreen
            onNavigateBack={handleSidebarBack}
            onNavigateToEditProfile={handleNavigateToEditProfile}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'wallet':
      return (
        <Suspense fallback={shimmerFallback}>
          <WalletScreen
            onNavigateBack={handleSidebarBack}
            onNavigateToRechargePack={handleSidebarBack}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
          />
        </Suspense>
      );
    case 'session_history':
      return (
        <Suspense fallback={shimmerFallback}>
          <SessionHistoryScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'chat_history':
      return (
        <Suspense fallback={shimmerFallback}>
          <ChatHistoryScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'my_following':
      return (
        <Suspense fallback={shimmerFallback}>
          <MyFollowingScreen
            onNavigateBack={handleSidebarBack}
            onAstrologerPress={onNavigateToAstrologerProfile}
          />
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
    case 'faq':
      return (
        <Suspense fallback={shimmerFallback}>
          <FaqScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    case 'privacy':
      return (
        <Suspense fallback={shimmerFallback}>
          <PrivacyPolicyScreen onBack={handleSidebarBack} />
        </Suspense>
      );
    case 'edit_profile':
      return (
        <Suspense fallback={shimmerFallback}>
          <UpdateProfileScreen onNavigateBack={handleSidebarBack} />
        </Suspense>
      );
    default:
      return null;
  }
};
