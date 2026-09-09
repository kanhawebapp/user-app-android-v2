import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, RefreshControl } from 'react-native';
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
  OngoingLive,
  UpcomingLive,
  ProblemCategories,
  FeatureHealings,
  Shop,
  Blog,
  Testimonials,
  TrustSection,
} from './home/components';
import FreeServicesRow from './home/components/FreeServicesRow';
import useScreenTracking from '../../services/analytics/hooks/useScreenTracking';
import { HomeScreenProps, ProblemCategory } from './home/types';
import HomeAstrologers from './home/components/RecommendedAstrologers';
import type { Astrologer } from '../../services/api/recomandedAstrologer/astrologer.types';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../context/ToastContext';
import { useAstrologers } from '../../services/api/recomandedAstrologer/astrologer.hooks';
import { useConsultationFlow } from './call/hooks/useConsultationFlow';
import { useBanners } from '../../services/api/banner/useBanners';
import { DEFAULT_API_CONFIG } from '../../constants/config.constants';
import { useServices } from '../../services/api/healingServices/getServices/useServices';
import { useCategories } from '../../services/api/healingServices/serviceCategory/useCategories';
import { useBlogs } from '../../services/api/blogs/useBlogs';
import useDoubleBackExit from '../../hooks/useDoubleBackExit';

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToChat,
  onNavigateToCall: _onNavigateToCall,
  onNavigateToLive,
  onNavigateToAstrologerProfile: onNavigateToAstrologerProfile,
  onNavigateToProduct,
  onNavigateToTestimonial,
  onNavigateToShopWebView,
  onNavigateToBlogPost,
  onNavigateToAstrologerList,
  onNavigateToProblemBaseAstroScreen,
  onNavigateToServiceDetails,
  onNavigateToBlogListing,
  onNavigateToFreeServices,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  useDoubleBackExit();
  const insets = useSafeAreaInsets();
  useScreenTracking('home_screen');
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const { data = [], refresh: refreshAstrologers } = useAstrologers();
  const {
    blogs,
    loading,
    error,
    refresh: refreshBlogs,
  } = useBlogs();

  const {
    // Auth
    handleRestrictedAction,

    // Data
    // heroBanners,
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
  const { data: bannerResponse = [], refresh: refreshBanners } = useBanners('en');

  const user = useAuthStore(state => state.user);
  const [chatTargetAstrologer, setChatTargetAstrologer] = useState<any>(null);
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [consultationType, setConsultationType] = useState<'chat' | 'call'>(
    'chat',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitConsultationRequest, loading: consultationLoading } =
    useConsultationFlow({
      onNavigateToTab,
    });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([
      refreshBanners(),
      refreshBlogs(),
      refreshServices(),
      refreshCategories(),
      refreshAstrologers(),
    ]);
    setRefreshing(false);
  }, [refreshAstrologers, refreshBanners, refreshBlogs, refreshCategories, refreshServices]);

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

  const handleAstrologerCardPress = useCallback(
    (astrologer: any) => {
      handleRestrictedAction('Please login to view astrologer profile', () => {
        onNavigateToAstrologerProfile?.(astrologer);
      });
    },
    [handleRestrictedAction, onNavigateToAstrologerProfile],
  );

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

  const handleViewAllAstrologers = useCallback(() => {
    onNavigateToAstrologerList?.();
  }, [onNavigateToAstrologerList]);

  const handleCategoryPress = useCallback(
    (category: ProblemCategory) => {
      onNavigateToProblemBaseAstroScreen?.(category);
    },
    [onNavigateToProblemBaseAstroScreen],
  );

  // const handleRemedyPress = useCallback(
  //   (remedy: any) => {
  //     onNavigateToProduct?.(remedy.id);
  //   },

  //   [onNavigateToProduct],
  // );

  const handleRemedyPress = (remedy: any) => {
    onNavigateToServiceDetails?.(remedy);
  };

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
    onNavigateToBlogListing?.();
  }, [onNavigateToBlogListing]);

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
  // if (selectedAstrologer) {
  //   return (
  //     <AstrologerProfileScreen
  //       astrologer={selectedAstrologer}
  //       onBack={handleBackFromProfile}
  //       onChatPress={handleProfileChatPress}
  //     />
  //   );
  // }

  const heroBanners = useMemo(() => {
    const BASE_IMAGE_URL = DEFAULT_API_CONFIG.baseUrl;
    // const BASE_IMAGE_URL = DEFAULT_API_CONFIG.baseUrl.replace('/api', '/images/');

    return bannerResponse.map((item: any) => ({
      id: item.id,
      title: item.heading || '',
      subtitle: item.subheading || '',
      ctaText: '',
      ctaAction: item.bannerlink || '',
      imageUrl: item.imageUrl?.startsWith('http')
        ? item.imageUrl
        : `${BASE_IMAGE_URL}${item.imageUrl}`,
    }));
  }, [bannerResponse]);

  //healing new
  const { services, refresh: refreshServices } = useServices();
  const { categories, refresh: refreshCategories } = useCategories();

  const healingRemedies = useMemo(() => {
    const healingCategory = categories?.find(
      item => item.slug?.toLowerCase() === 'healing',
    );

    if (!healingCategory) {
      return [];
    }

    return services.filter(
      service => service?.category?.id === healingCategory.id,
    );
  }, [services, categories]);
  //end healings
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }>
        {/* 1. Hero Banner */}
        <HeroBanner
          data={heroBanners}
          onCtaPress={handleCtaPress}
          style={styles.section}
        />

        {/* 4. Ongoing Live Sessions */}
        {/* <OngoingLive
          sessions={ongoingLives}
          onSessionPress={handleLiveSessionPress}
          onViewAllPress={handleViewAllLive}
          style={styles.section}
        /> */}

        {/* Free Services Row */}
        <FreeServicesRow
          onViewAllPress={onNavigateToFreeServices}
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
          data={data}
        />

        {/* 7. Problem Based Categories */}
        <ProblemCategories
          categories={problemCategories}
          onCategoryPress={handleCategoryPress}
          style={styles.section}

        />

        {/* 8. Feature Healings (Remedies) */}
        {/* <FeatureHealings
          remedies={remedies}
          onRemedyPress={handleRemedyPress}
          onViewAllPress={handleViewAllRemedies}
          style={styles.section}
        /> */}
        <FeatureHealings
          remedies={healingRemedies}
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
          posts={blogs}
          loading={loading}
          error={error}
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
        astrologer={chatTargetAstrologer}
        loading={consultationLoading}
        onClose={() => {
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
        }}
        onSubmit={async formData => {
          if (!chatTargetAstrologer) {
            return {success: false};
          }

          return submitConsultationRequest({
            astrologer: chatTargetAstrologer,
            consultationType,
            formData,
            onClose: () => {
              setShowChatRequestModal(false);
              setChatTargetAstrologer(null);
            },
          });
        }}
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
