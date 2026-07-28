/**
 * MainNavigator - Main navigation component for the app
 * This is a clean, modular version with code separated into:
 * - mainNavigator.types.ts: Type definitions
 * - mainNavigator.constants.ts: Static constants
 * - mainNavigator.hooks.ts: Custom hooks for state logic
 * - renderHelpers.tsx: Screen rendering functions
 */

import React, {useCallback, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Header} from '../../components/Header';
import {Sidebar} from '../../components/Sidebar';
import {
  ProfileCompletionModal,
  GiftModal,
  LoginRequiredModal,
} from '../../components/Modal';
import {SafeAreaView} from 'react-native-safe-area-context';

// Types
import type {MainNavigatorProps} from './mainNavigator.types';

// Hooks
import {
  useTabNavigation,
  useSidebarNavigation,
  useGiftModal,
  useProfileInitialization,
  useAuthUser,
  useNotificationCount,
} from './mainNavigator.hooks';

// Render Helpers
import {renderScreen, renderSidebarScreen} from './renderHelpers';

// Constants
import {
  WELCOME_BONUS_AMOUNT,
  WELCOME_BONUS_TITLE,
  WELCOME_BONUS_DESCRIPTION,
  CLAIM_BONUS_BUTTON_TEXT,
  OFFER_TYPE_BONUS,
} from './mainNavigator.constants';
import {BottomNavigation} from '../BottomNavigation';

// Chat store for navigation on chat acceptance
import {useChatStore} from '../../services/chat/chat.store';

const MainNavigator: React.FC<MainNavigatorProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerList,
  onNavigateToEditProfile,
  onLogout,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Custom hooks for state management
  const {isGiftModalVisible, showGiftModalOnce, closeGiftModal} =
    useGiftModal();
  const {isRequestModalVisible, dismissProfileRequest, completeProfileRequest} =
    useProfileInitialization();
  const {user, isAuthenticated, isLoggedIn, handleLogout} = useAuthUser({
    onLogout,
  });
  const notificationCount = useNotificationCount();

  // Tab navigation
  const {activeTab, handleTabPress, handleNavigateToTab} = useTabNavigation();

  // Global navigation: switch to chatCall tab when chat is accepted
  const shouldNavigateToChat = useChatStore(
    state => state.shouldNavigateToChat,
  );
  const chatRoomId = useChatStore(state => state.roomId);

  useEffect(() => {
    if (shouldNavigateToChat && chatRoomId) {
      console.log('[MainNavigator] Chat accepted, navigating to chatCall tab');
      handleNavigateToTab('chatCall');
      // Note: Do NOT reset flag here; ChatCallScreen will reset after rendering ChatScreen
    }
  }, [shouldNavigateToChat, chatRoomId, handleNavigateToTab]);

  // Note: Gift modal is available but not automatically shown on every navigation
  // It can be triggered manually when needed (e.g., after a purchase or special event)

  // Login required modal state
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const handleCloseLoginModal = useCallback(() => {
    setShowLoginRequiredModal(false);
  }, []);

  const handleLoginFromModal = useCallback(() => {
    setShowLoginRequiredModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupFromModal = useCallback(() => {
    setShowLoginRequiredModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  // Sidebar navigation
  const {
    sidebarScreen,
    isSidebarVisible,
    handleMenuPress,
    handleSidebarClose,
    handleMenuItemPress: handleMenuItemPressBase,
    handleWalletPress,
    handleSidebarBack,
    setSidebarScreen,
  } = useSidebarNavigation({
    onSetActiveTab: handleNavigateToTab,
  });

  // Wrap menu item press to show login modal for guest users
  const authRequiredMenuItems = [
    'my_profile',
    'wallet',
    'session_history',
    'my_following',
  ];
  const handleMenuItemPress = useCallback(
    (item: any) => {
      if (
        authRequiredMenuItems.includes(item.key) &&
        !(isAuthenticated && isLoggedIn)
      ) {
        setShowLoginRequiredModal(true);
        return;
      }
      handleMenuItemPressBase(item);
    },
    [isAuthenticated, isLoggedIn, handleMenuItemPressBase],
  );

  // Handler for edit profile navigation
  const handleNavigateToEditProfile = useCallback(() => {
    setSidebarScreen('edit_profile');
  }, []);

  // Handler for notification press
  const handleNotificationPress = useCallback(() => {
    // Navigate to notifications
    console.log('Notification pressed');
  }, []);

  // If a sidebar screen is active, render it instead of tab screens
  if (sidebarScreen) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        {renderSidebarScreen({
          sidebarScreen,
          handleSidebarBack,
          handleNavigateToEditProfile,
          onNavigateToLogin,
          onNavigateToSignup,
        })}
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <Header
        user={user}
        isAuthenticated={isAuthenticated && isLoggedIn}
        onMenuPress={handleMenuPress}
        onWalletPress={handleWalletPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
      />

      {/* Main content */}
      <View style={styles.screenContainer}>
        {renderScreen({
          activeTab,
          onNavigateToLogin,
          onNavigateToSignup,
          onNavigateToAstrologerList,
          handleNavigateToTab,
        })}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        style={undefined}
      />
      {/* <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} /> */}

      {/* Sidebar */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={handleSidebarClose}
        user={user}
        isAuthenticated={isAuthenticated && isLoggedIn}
        onMenuItemPress={handleMenuItemPress}
        onLogout={handleLogout}
      />

      {/* Login Required Modal - for guest users accessing restricted sidebar items */}
      <LoginRequiredModal
        visible={showLoginRequiredModal}
        onClose={handleCloseLoginModal}
        onLoginPress={handleLoginFromModal}
        onSignupPress={handleSignupFromModal}
      />

      {/* Profile Completion Modal - Just-in-time data collection */}
      <ProfileCompletionModal
        visible={isRequestModalVisible}
        onClose={dismissProfileRequest}
        onComplete={completeProfileRequest}
      />

      {/* Gift Modal - Show special offer when user navigates to bottom navigation */}
      <GiftModal
        visible={isGiftModalVisible}
        onClose={closeGiftModal}
        onClaim={() => {
          // Handle claim action - could navigate to wallet or add bonus
          console.log('Gift claimed!');
        }}
        title={WELCOME_BONUS_TITLE}
        description={WELCOME_BONUS_DESCRIPTION}
        offerAmount={WELCOME_BONUS_AMOUNT}
        offerType={OFFER_TYPE_BONUS}
        claimButtonText={CLAIM_BONUS_BUTTON_TEXT}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screenContainer: {
    flex: 1,
  },
});

export default MainNavigator;
