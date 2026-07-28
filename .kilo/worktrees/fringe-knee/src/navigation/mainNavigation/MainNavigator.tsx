/**
 * MainNavigator - Main navigation component for the app
 * This is a clean, modular version with code separated into:
 * - mainNavigator.types.ts: Type definitions
 * - mainNavigator.constants.ts: Static constants
 * - mainNavigator.hooks.ts: Custom hooks for state logic
 * - renderHelpers.tsx: Screen rendering functions
 */

import React,{useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Header} from '../../components/Header';
import {Sidebar} from '../../components/Sidebar';
import {ProfileCompletionModal, GiftModal} from '../../components/Modal';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {MainNavigatorProps} from './mainNavigator.types';

import {
  useTabNavigation,
  useSidebarNavigation,
  useGiftModal,
  useProfileInitialization,
  useAuthUser,
  useNotificationCount,
} from './mainNavigator.hooks';

import {renderScreen, renderSidebarScreen} from './renderHelpers';

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

  const {isGiftModalVisible, showGiftModalOnce, closeGiftModal} = useGiftModal();
  const {isRequestModalVisible, dismissProfileRequest, completeProfileRequest} =
    useProfileInitialization();
  const {user, isAuthenticated, isLoggedIn, handleLogout} = useAuthUser({onLogout});
  const notificationCount = useNotificationCount();

  const {activeTab, handleTabPress, handleNavigateToTab} = useTabNavigation();

  const {
    sidebarScreen,
    isSidebarVisible,
    handleMenuPress,
    handleSidebarClose,
    handleMenuItemPress,
    handleWalletPress,
    handleSidebarBack,
    handleNavigateToAstrologerProfile,
    selectedAstrologerId,
  } = useSidebarNavigation({
    onSetActiveTab: handleNavigateToTab,
  });

  const handleNotificationPress = useCallback(() => {
    console.log('Notification pressed');
  }, []);

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
          selectedAstrologerId,
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

      <View style={styles.screenContainer}>
        {renderScreen({
          activeTab,
          onNavigateToLogin,
          onNavigateToSignup,
          handleNavigateToTab,
          onNavigateToAstrologerProfile: handleNavigateToAstrologerProfile,
        })}
      </View>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      <Sidebar
        visible={isSidebarVisible}
        onClose={handleSidebarClose}
        user={user}
        isAuthenticated={isAuthenticated && isLoggedIn}
        onMenuItemPress={handleMenuItemPress}
        onLogout={handleLogout}
      />

      <ProfileCompletionModal
        visible={isRequestModalVisible}
        onClose={dismissProfileRequest}
        onComplete={completeProfileRequest}
      />

      <GiftModal
        visible={isGiftModalVisible}
        onClose={closeGiftModal}
        onClaim={() => {
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
