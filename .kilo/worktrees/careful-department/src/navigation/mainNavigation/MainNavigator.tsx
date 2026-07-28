/**
 * MainNavigator - Main navigation component for the app
 * This is a clean, modular version with code separated into:
 * - mainNavigator.types.ts: Type definitions
 * - mainNavigator.constants.ts: Static constants
 * - mainNavigator.hooks.ts: Custom hooks for state logic
 * - renderHelpers.tsx: Screen rendering functions
 */

import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
// import {BottomNavigation} from '../../components/BottomNavigation';
import {Header} from '../../components/Header';
import {Sidebar} from '../../components/Sidebar';
import {ProfileCompletionModal, GiftModal} from '../../components/Modal';
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
import { BottomNavigation } from '../BottomNavigation';

const MainNavigator: React.FC<MainNavigatorProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Custom hooks for state management
  const {isGiftModalVisible, showGiftModalOnce, closeGiftModal} = useGiftModal();
  const {isRequestModalVisible, dismissProfileRequest, completeProfileRequest} =
    useProfileInitialization();
  const {user, isAuthenticated, isLoggedIn, handleLogout} = useAuthUser({onLogout});
  const notificationCount = useNotificationCount();

  // Tab navigation
  const {activeTab, handleTabPress, handleNavigateToTab} = useTabNavigation();

  // Note: Gift modal is available but not automatically shown on every navigation
  // It can be triggered manually when needed (e.g., after a purchase or special event)

  // Sidebar navigation
  const {
    sidebarScreen,
    isSidebarVisible,
    handleMenuPress,
    handleSidebarClose,
    handleMenuItemPress,
    handleWalletPress,
    handleSidebarBack,
  } = useSidebarNavigation({
    onSetActiveTab: handleNavigateToTab,
  });

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
          handleNavigateToTab,
        })}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Sidebar */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={handleSidebarClose}
        user={user}
        isAuthenticated={isAuthenticated && isLoggedIn}
        onMenuItemPress={handleMenuItemPress}
        onLogout={handleLogout}
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

