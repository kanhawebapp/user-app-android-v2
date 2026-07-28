import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import {
  LoginRequiredModal,
  ChatRequestModal,
  ChatRequestData,
} from '../../components/Modal';
import { useHomeData } from './home/hooks/useHomeData';
import {
  HeroBanner,
  // AstrologyGuidance,
  // ServiceActions,
  OngoingLive,
  UpcomingLive,
  ProblemCategories,
  FeatureHealings,
  Shop,
  Blog,
  Testimonials,
  TrustSection,
} from './home/components';
import useScreenTracking from '../../services/analytics/hooks/useScreenTracking';
import { HomeScreenProps, ProblemCategory } from './home/types';
import HomeAstrologers from './home/components/RecommendedAstrologers';
import AstrologerProfileScreen from './astrologerProfile';
import type { Astrologer } from '../../services/api/recomandedAstrologer/astrologer.types';
import { useChatStore } from '../../services/chat/chat.store';
import { sendChatRequest } from '../../services/chat/chat.service';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { useToast } from '../../context/ToastContext';

const HomeScreen: React.FC<HomeScreenProps> = ({
    onNavigateToTab,
    onNavigateToLogin,
    onNavigateToSignup,
    onNavigateToChat,
    onNavigateToCall: _onNavigateToCall,
    onNavigateToLive,
    onNavigateToAstrologerProfile: _onNavigateToAstrologerProfile,
    onNavigateToProduct,
    onNavigateToTestimonial,
    onNavigateToShopWebView,
    onNavigateToBlogPost,
    onNavigateToAstrologerList,
    onNavigateToProblemBaseAstroScreen,
  }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  useScreenTracking('home_screen');
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();

  const {
    // Auth
    handleRestrictedAction,

    // Data
    heroBanners,
    ongoingLives,
    upcomingLives,
    problemCategories,
    remedies,
    testimonials,
    trustFeatures,
    shopItems,
    blogPosts,

    // Modal state
    showLoginModal,
    modalMessage,
    setShowLoginModal,
  } = useHomeData();

  const user = useAuthStore(state => state.user);

  // Astrologer profile overlay state
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<Astrologer | null>(null);

  // Chat request modal state
  // const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  // const [chatTargetAstrologer, setChatTargetAstrologer] =
  //   useState<Astrologer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  //new
  const [chatTargetAstrologer, setChatTargetAstrologer] = useState<any>(null);
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);

  const [consultationType, setConsultationType] = useState<'chat' | 'call'>(
    'chat',
  );

  // --- Handlers ---

  const handleCtaPress = useCallback(
    (action?: string) => {
      if (action === 'explore') {
        onNavigateToTab?.('explore');
      } else {
        handleRestrictedAction('Please login to explore', () => {
          onNavigateToTab?.('home');
        });
      }
    },
    [handleRestrictedAction, onNavigateToTab],
  );

  const handleLiveSessionPress = useCallback(
    (session: any) => {
      handleRestrictedAction('Please login to join live session', () => {
        onNavigateToLive?.(session.id);
      });
    },
    [handleRestrictedAction, onNavigateToLive],
  );

  const handleViewAllLive = useCallback(() => {
    onNavigateToTab?.('live');
  }, [onNavigateToTab]);

  // Astrologer card handlers
  const handleAstrologerCardPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to view astrologer profile', () => {
        setSelectedAstrologer(astrologer);
      });
    },
    [handleRestrictedAction],
  );

  // const handleAstrologerChatPress = useCallback(
  //   (astrologer: Astrologer) => {
  //     handleRestrictedAction('Please login to start a chat', () => {
  //       setChatTargetAstrologer(astrologer);
  //       setShowChatRequestModal(true);
  //     });
  //   },
  //   [handleRestrictedAction],
  // );

  const handleAstrologerChatPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to start a chat', () => {
        setConsultationType('chat');
        setChatTargetAstrologer(astrologer);
        setShowChatRequestModal(true);
      });
    },
    [handleRestrictedAction],
  );
  const handleAstrologerCallPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to start a call', () => {
        setConsultationType('call');
        setChatTargetAstrologer(astrologer);
        setShowChatRequestModal(true);
      });
    },
    [handleRestrictedAction],
  );

  const handleAstrologerAddPress = useCallback(
    (astrologer: Astrologer) => {
      handleRestrictedAction('Please login to follow astrologer', () => {
        console.log('Add/Follow astrologer:', astrologer.name);
      });
    },
    [handleRestrictedAction],
  );

  const handleBackFromProfile = useCallback(() => {
    setSelectedAstrologer(null);
  }, []);

  const handleProfileChatPress = useCallback((astrologer: Astrologer) => {
    setSelectedAstrologer(null);
    setChatTargetAstrologer(astrologer);
    setShowChatRequestModal(true);
  }, []);

  const handleChatRequestSubmit = useCallback(
    async (data: ChatRequestData) => {
      if (!chatTargetAstrologer) {
        return;
      }

      setIsSubmitting(true);
      submitLockRef.current = true;

      try {
        // Call the chat service with consultationType

        // console.log(
        //   '[CALL REQUEST PAYLOAD]',
        //   JSON.stringify(
        //     {
        //       astrologerId: chatTargetAstrologer.id,
        //       astrologerName: chatTargetAstrologer.name,
        //       userProfile: {
        //         id: user?.id || '',
        //         name: user?.name || '',
        //         mobile: user?.mobile || '',
        //         countryCode: user?.countryCode || '',
        //         profilePic: user?.profilePic || '',
        //         gender: user?.gender || 'male',
        //         birthDate: user?.dateOfBirth || '',
        //         birthTime: user?.birthTime || '',
        //         occupation: (user as any)?.occupation || '',
        //       },
        //       name: data.name,
        //       gender: data.gender,
        //       dateOfBirth: data.dateOfBirth,
        //       placeOfBirth: data.placeOfBirth,
        //       birthTime: data.birthTime,
        //       occupation: '',
        //       consultationType: consultationType,
        //     },
        //     null,
        //     2,
        //   ),
        // );

        const result = await sendChatRequest({
          astrologerId: chatTargetAstrologer.id,
          astrologerName: chatTargetAstrologer.name,
          userProfile: {
            id: user?.id || '',
            name: user?.name || '',
            mobile: user?.mobile || '',
            countryCode: user?.countryCode || '',
            profilePic: user?.profilePic || '',
            gender: user?.gender || 'male',
            birthDate: user?.dateOfBirth || '',
            birthTime: user?.birthTime || '',
            occupation: (user as any)?.occupation || '',
          },
          name: data.name,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          birthTime: data.birthTime,
          occupation: '',
          consultationType: consultationType,
        });

        console.log('[CallFlow] Chat request result:', result);

        if (!result.success) {
          console.error('[CallFlow] Request failed:', result.error);
          showError(
            result.error ||
            'Unable to connect with astrologer. Please try again.',
          );
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
          return;
        }

        showSuccess('Connecting you with astrologer...');

        const { isCall, isQueued, callId } = result;

        if (isCall) {
          console.log(
            isQueued
              ? '[CallFlow] Call is queued — QueueBubble visible (wait for queue to clear)'
              : '[CallFlow] Call direct — proceeding to CallScreen now',
          );

          // Close the request modal immediately; QueueBubble (AppContent) shows
          // for the queued-wait period.
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);

          // sendChatRequest resolves ONLY after queue has cleared (for queued calls)
          // or immediately for direct calls. Navigation to CallScreen is safe in
          // both cases — no queue means direct connect; cleared queue means the
          // astrologer is now available.
          if (isQueued) {
            console.log(
              '[CallFlow] CALLSCREEN_NAVIGATION_SKIPPED: wait for queue',
            );
            // QueueBubble is visible; do not open CallScreen.
            onNavigateToTab?.('chatCall');
          } else {
            console.log('CALL_FLOW_ALLOWED navigating to CallScreen');
            navigation.navigate(
              'Call' as never,
              {
                callId: callId || `call_${Date.now()}`,
                participant: {
                  id: chatTargetAstrologer.id,
                  name: chatTargetAstrologer.name,
                  image: chatTargetAstrologer.profilePic,
                },
                isIncoming: false,
              } as never,
            );
          }
        } else {
          // ── CHAT FLOW (existing, unchanged) ──────────────────────────────────
          console.log(
            '[HomeScreen] Chat flow initiated, navigating to chatCall tab',
          );
          setShowChatRequestModal(false);

          // Store selected astrologer globally for ChatScreen
          useChatStore.getState().setSelectedAstrologer({
            id: chatTargetAstrologer.id,
            name: chatTargetAstrologer.name,
            image: chatTargetAstrologer.profilePic,
            rating: chatTargetAstrologer.rating,
            experience: String(chatTargetAstrologer.experience),
            skills: chatTargetAstrologer.skills,
            isAvailableForChat: true,
          });

          // Navigate to chatCall tab to show queue status
          onNavigateToTab?.('chatCall');
          setChatTargetAstrologer(null);
        }
      } catch (error: any) {
        console.error('[CallFlow] Request error:', error);
        showError(
          error?.message ||
          'Unable to connect with astrologer. Please try again.',
        );
        setShowChatRequestModal(false);
        setChatTargetAstrologer(null);
      } finally {
        submitLockRef.current = false;
        setIsSubmitting(false);
      }
    },
    [
      chatTargetAstrologer,
      user,
      consultationType,
      setShowChatRequestModal,
      onNavigateToTab,
      navigation,
      showSuccess,
      showError,
    ],
  );

  const handleViewAllAstrologers = useCallback(() => {
    onNavigateToAstrologerList?.();
  }, [onNavigateToAstrologerList]);

const handleCategoryPress = useCallback(
    (category: ProblemCategory) => {
      onNavigateToProblemBaseAstroScreen?.(category);
    },
    [onNavigateToProblemBaseAstroScreen],
  );

  const handleRemedyPress = useCallback(
    (remedy: any) => {
      onNavigateToProduct?.(remedy.id);
    },
    [onNavigateToProduct],
  );

  const handleViewAllRemedies = useCallback(() => {
    onNavigateToTab?.('remedies');
  }, [onNavigateToTab]);

  const handleTestimonialPress = useCallback(
    (testimonial: any) => {
      onNavigateToTestimonial?.(testimonial.id);
    },
    [onNavigateToTestimonial],
  );

  const handleShopPress = useCallback(
    (item: any) => {
      onNavigateToShopWebView?.(item.webUrl);
    },
    [onNavigateToShopWebView],
  );

  const handleViewAllShop = useCallback(() => {
    onNavigateToTab?.('shop');
  }, [onNavigateToTab]);

  const handleBlogPress = useCallback(
    (post: any) => {
      onNavigateToBlogPost?.(post.id);
    },
    [onNavigateToBlogPost],
  );

  const handleViewAllBlog = useCallback(() => {
    onNavigateToTab?.('blog');
  }, [onNavigateToTab]);

  // Modal handlers
  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, [setShowLoginModal]);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [setShowLoginModal, onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [setShowLoginModal, onNavigateToSignup]);

  // If astrologer profile is open, render it as overlay
  if (selectedAstrologer) {
    return (
      <AstrologerProfileScreen
        astrologer={selectedAstrologer}
        onBack={handleBackFromProfile}
        onChatPress={handleProfileChatPress}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        translucent={false}
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: colors.background.primary,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 70 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 1. Hero Banner */}
        <HeroBanner
          data={heroBanners}
          onCtaPress={handleCtaPress}
          style={styles.section}
        />

        {/* 4. Ongoing Live Sessions */}
        <OngoingLive
          sessions={ongoingLives}
          onSessionPress={handleLiveSessionPress}
          onViewAllPress={handleViewAllLive}
          style={styles.section}
        />

        {/* 5. Upcoming Live Sessions */}
        <UpcomingLive
          sessions={upcomingLives}
          onSessionPress={handleLiveSessionPress}
          onViewAllPress={handleViewAllLive}
          style={styles.section}
        />

        {/* 6. Recommended Astrologers */}
        {/* <HomeAstrologers
          onViewAllPress={handleViewAllAstrologers}
          onAstrologerPress={handleAstrologerCardPress}
          onChatPress={handleAstrologerChatPress}
          onAddPress={handleAstrologerAddPress}
        /> */}
        <HomeAstrologers
          onViewAllPress={handleViewAllAstrologers}
          onAstrologerPress={handleAstrologerCardPress}
          onChatPress={handleAstrologerChatPress}
          onCallPress={handleAstrologerCallPress}
          onAddPress={handleAstrologerAddPress}
        />

        {/* 7. Problem Based Categories */}
        <ProblemCategories
          categories={problemCategories}
          onCategoryPress={handleCategoryPress}
          style={styles.section}
        />

        {/* 8. Feature Healings (Remedies) */}
        <FeatureHealings
          remedies={remedies}
          onRemedyPress={handleRemedyPress}
          onViewAllPress={handleViewAllRemedies}
          style={styles.section}
        />

        {/* 9. Shop Section (WebView) */}
        <Shop
          items={shopItems}
          onShopPress={handleShopPress}
          onViewAllPress={handleViewAllShop}
          style={styles.section}
        />

        {/* 10. Blog Section */}
        <Blog
          posts={blogPosts.map(post => ({ ...post, image: post.image || '' }))}
          onPostPress={handleBlogPress}
          onViewAllPress={handleViewAllBlog}
          style={styles.section}
        />

        {/* 11. Testimonials */}
        <Testimonials
          testimonials={testimonials}
          onTestimonialPress={handleTestimonialPress}
          style={styles.section}
        />

        {/* 12. Trust and Authority */}
        <TrustSection features={trustFeatures} style={styles.lastSection} />
      </ScrollView>

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />

      {/* Chat Request Modal */}
      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        onClose={() => {
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
        }}
        onSubmit={handleChatRequestSubmit}
        astrologer={chatTargetAstrologer ?? undefined}
        loading={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    marginTop: 5,
  },
  section: {},
  lastSection: {
    marginBottom: 0,
  },
});

export default HomeScreen;
