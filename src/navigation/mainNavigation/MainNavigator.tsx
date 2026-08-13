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

// Types for SendGiftScreen
import {Gift} from '../../services/api/gift/gift.types';

// Hooks
import {
  useTabNavigation,
  useSidebarNavigation,
  useGiftModal,
  useProfileInitialization,
  useAuthUser,
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

// Notification store
import {useNotificationStore} from '../../stores/notification.store';

// Notification Screen
import NotificationsScreen from '../../screens/main/NotificationsScreen';
// Problem Base Astro Screen
import {ProblemBaseAstroScreen} from '../../screens/main/ProblemBaseAstroScreen';
import type {ProblemCategory} from '../../screens/main/home/types/index';
import AstrologerProfileScreen from '../../screens/main/astrologerProfile';

// Healing Screens
import ServiceDetailsScreen from '../../screens/main/healings/ServiceDetailsScreen';
import BookingFormScreen, {BookingFormData} from '../../screens/main/healings/BookingFormScreen';
import SelectAstrologerScreen from '../../screens/main/healings/SelectAstrologerScreen';
import BlogListingScreen from '../../screens/main/BlogListingScreen';

// Send Gift Screen
import SendGiftScreen from '../../screens/main/SendGiftScreen';

type HealingScreenKey = 'serviceDetails' | 'bookingForm' | 'selectAstrologer';

const MainNavigator: React.FC<MainNavigatorProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToAstrologerList,
  onNavigateToEditProfile,
  onLogout,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  //new
  const chatStatus = useChatStore(state => state.chatStatus);

  // Custom hooks for state management
  const {isGiftModalVisible, showGiftModalOnce, closeGiftModal} =
    useGiftModal();
  const {isRequestModalVisible, dismissProfileRequest, completeProfileRequest} =
    useProfileInitialization();
  const {user, isAuthenticated, isLoggedIn, handleLogout} = useAuthUser({
    onLogout,
  });

  // Get notification count from store
  const notificationCount = useNotificationStore(state => state.unreadCount);

  // Fetch notifications on app start if authenticated
  useEffect(() => {
    if (isAuthenticated && isLoggedIn) {
      useNotificationStore.getState().fetchNotifications();
    }
  }, [isAuthenticated, isLoggedIn]);

  // Notification screen visibility state
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  // Problem Base Astro Screen visibility state
  const [isProblemBaseAstroScreenVisible, setIsProblemBaseAstroScreenVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProblemCategory | null>(null);
  const [isAstrologerProfileVisible, setIsAstrologerProfileVisible] =
    useState(false);

  const [selectedAstrologer, setSelectedAstrologer] = useState<any>(null);

  // Send Gift Screen visibility state
  const [isSendGiftScreenVisible, setIsSendGiftScreenVisible] =
    useState(false);
  const [sendGiftScreenParams, setSendGiftScreenParams] = useState<{
    gifts: Gift[];
    astrologerName?: string;
    astrologerProfilePic?: string;
    onSendGift: (gift: Gift, message: string) => void;
    loading?: boolean;
  } | null>(null);

  // Healing flow state
  const [healingScreen, setHealingScreen] = useState<HealingScreenKey | null>(null);
  const [healingSelectedService, setHealingSelectedService] = useState<any>(null);
  const [healingBookingResponse, setHealingBookingResponse] = useState<any>(null);

  // Blog listing visibility state
  const [isBlogListingVisible, setIsBlogListingVisible] = useState(false);

  // Tab navigation
  const {activeTab, handleTabPress, handleNavigateToTab} = useTabNavigation();

  //new
  const isChatActive = activeTab === 'chatCall' && chatStatus === 'active';

  // Global navigation: switch to chatCall tab when chat is accepted
  const shouldNavigateToChat = useChatStore(
    state => state.shouldNavigateToChat,
  );
  const chatRoomId = useChatStore(state => state.roomId);

  useEffect(() => {
    if (shouldNavigateToChat && chatRoomId) {
      console.log('[MainNavigator] Chat accepted, navigating to chatCall tab');
      setIsProblemBaseAstroScreenVisible(false);
      setSelectedCategory(null);
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
    'chat_history',
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
    setIsNotificationVisible(true);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setIsNotificationVisible(false);
  }, []);

  // Handler for navigating to Problem Base Astro Screen
  const handleNavigateToProblemBaseAstroScreen = useCallback(
    (category: ProblemCategory) => {
      setSelectedCategory(category);
      setIsProblemBaseAstroScreenVisible(true);
    },
    [],
  );

  const handleNavigateToAstrologerProfile = useCallback((astrologer: any) => {
    console.log('[MainNavigator] onNavigateToAstrologerProfile called:', {
      astrologerId: astrologer?.id,
      astrologerName:
        astrologer?.displayName || astrologer?.name,
    });
    setSidebarScreen(null);
    setSelectedAstrologer(astrologer);
    setIsAstrologerProfileVisible(true);
  }, [setSidebarScreen]);

  // Handler for navigating to SendGiftScreen
  const handleNavigateToSendGiftScreen = useCallback((params: {
    gifts: Gift[];
    astrologerName?: string;
    astrologerProfilePic?: string;
    onSendGift: (gift: Gift, message: string) => void;
    loading?: boolean;
  }) => {
    // navigation-only fix: ensure profile screen is fully unmounted
    setIsAstrologerProfileVisible(false);
    setSelectedAstrologer(null);

    setSendGiftScreenParams(params);
    setIsSendGiftScreenVisible(true);
  }, []);

  // Healing flow handlers
  const handleNavigateToServiceDetails = useCallback((service: any) => {
    setHealingSelectedService(service);
    setHealingScreen('serviceDetails');
  }, []);

  const handleHealingBack = useCallback(() => {
    setHealingScreen(null);
    setHealingSelectedService(null);
    setHealingBookingResponse(null);
  }, []);

  const handleConfirmBooking = useCallback(() => {
    setHealingScreen('bookingForm');
  }, []);

  const handleBookingSubmit = useCallback(async (response: any) => {
    setHealingBookingResponse(response);
    setHealingScreen('selectAstrologer');
  }, []);

  const handleHealingComplete = useCallback(() => {
    setHealingScreen(null);
    setHealingSelectedService(null);
    setHealingBookingResponse(null);
  }, []);

  const handleNavigateToBlogListing = useCallback(() => {
    setIsBlogListingVisible(true);
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
          onNavigateToAstrologerProfile:
          handleNavigateToAstrologerProfile,
        })}

      </View>
    );
  }

  // If notification screen is active, render it
  if (isNotificationVisible) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <NotificationsScreen onNavigateBack={handleCloseNotification} />
      </View>
    );
  }

  // If Problem Base Astro Screen is active, render it
  if (isProblemBaseAstroScreenVisible && selectedCategory) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <ProblemBaseAstroScreen
          category={selectedCategory}
          onBack={() => {
            setIsProblemBaseAstroScreenVisible(false);
            setSelectedCategory(null);
          }}
        />
      </View>
    );
  }

  if (isAstrologerProfileVisible && selectedAstrologer) {
    console.log('[MainNavigator] Rendering AstrologerProfileScreen with:', {
      astrologerId: selectedAstrologer?.id,
      astrologerName:
        selectedAstrologer?.displayName || selectedAstrologer?.name,
    });
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <AstrologerProfileScreen
          astrologer={selectedAstrologer}
          onBack={() => {
            setIsAstrologerProfileVisible(false);
            setSelectedAstrologer(null);
          }}
          onNavigateToSendGift={handleNavigateToSendGiftScreen}
        />
      </View>
    );
  }

  // Send Gift Screen
  if (isSendGiftScreenVisible && sendGiftScreenParams) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <SendGiftScreen
          gifts={sendGiftScreenParams.gifts}
          astrologerName={sendGiftScreenParams.astrologerName}
          astrologerProfilePic={sendGiftScreenParams.astrologerProfilePic}
          onSendGift={sendGiftScreenParams.onSendGift}
          loading={sendGiftScreenParams.loading}
          onGoBack={() => {
            setIsSendGiftScreenVisible(false);
            setSendGiftScreenParams(null);
          }}
        />
      </View>
    );
  }

  // Healing flow screens
  if (healingScreen === 'serviceDetails' && healingSelectedService) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <ServiceDetailsScreen
          service={healingSelectedService}
          onBack={handleHealingBack}
          onConfirmBooking={handleConfirmBooking}
        />
      </View>
    );
  }

  if (healingScreen === 'bookingForm' && healingSelectedService) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <BookingFormScreen
          service={healingSelectedService}
          onBack={handleHealingBack}
          onSubmit={handleBookingSubmit}
        />
      </View>
    );
  }

  if (healingScreen === 'selectAstrologer') {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <SelectAstrologerScreen
          bookingResponse={healingBookingResponse}
          onBack={handleHealingBack}
          onComplete={handleHealingComplete}
        />
      </View>
    );
  }

  if (isBlogListingVisible) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <BlogListingScreen onBack={() => setIsBlogListingVisible(false)} />
      </View>
    );
  }

  return (
    // <SafeAreaView
    //   edges={['left', 'right']}
    //   style={[styles.container, {backgroundColor: colors.background.primary}]}>
    <SafeAreaView
      edges={isChatActive ? [] : ['left', 'right']}
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      {/* <Header
        user={user}
        isAuthenticated={isAuthenticated && isLoggedIn}
        onMenuPress={handleMenuPress}
        onWalletPress={handleWalletPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
      /> */}

      {!isChatActive && (
        <Header
          user={user}
          isAuthenticated={isAuthenticated && isLoggedIn}
          onMenuPress={handleMenuPress}
          onWalletPress={handleWalletPress}
          onNotificationPress={handleNotificationPress}
          notificationCount={notificationCount}
        />
      )}

      {/* Main content */}
      <View style={styles.screenContainer}>
        {renderScreen({
          activeTab,
          onNavigateToLogin,
          onNavigateToSignup,
          onNavigateToAstrologerList,
          handleNavigateToTab,
          onNavigateToProblemBaseAstroScreen:
            handleNavigateToProblemBaseAstroScreen,
          onNavigateToAstrologerProfile: handleNavigateToAstrologerProfile,
          onNavigateToServiceDetails: handleNavigateToServiceDetails,
          onNavigateToBlogListing: handleNavigateToBlogListing,
        })}
      </View>

      {/* Bottom Navigation */}
      {/* <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        style={undefined}
      /> */}
      {/* //new */}
      {!isChatActive && (
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
          style={undefined}
        />
      )}
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