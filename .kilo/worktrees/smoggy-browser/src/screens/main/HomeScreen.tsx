import React, {useCallback} from 'react';
import {View, StyleSheet, ScrollView, Alert, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {LoginRequiredModal} from '../../components/Modal';
import {useHomeData} from './home/hooks/useHomeData';
import {
  HeroBanner,
  AstrologyGuidance,
  ServiceActions,
  OngoingLive,
  UpcomingLive,
  RecommendedAstrologers,
  ProblemCategories,
  FeatureHealings,
  Shop,
  Blog,
  Testimonials,
  TrustSection,
} from './home/components';
import useScreenTracking from '../../services/analytics/hooks/useScreenTracking';

interface HomeScreenProps {
  onNavigateToTab?: (tab: string) => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToChat?: (astrologerId?: string) => void;
  onNavigateToCall?: (astrologerId?: string) => void;
  onNavigateToLive?: (liveId?: string) => void;
  onNavigateToRemedies?: () => void;
  onNavigateToAstrologerProfile?: (astrologerId: string) => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToTestimonial?: (testimonialId: string) => void;
  onNavigateToShopWebView?: (url: string) => void;
  onNavigateToBlogPost?: (postId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToChat,
  onNavigateToCall,
  onNavigateToLive,
  onNavigateToRemedies,
  onNavigateToAstrologerProfile,
  onNavigateToCategory,
  onNavigateToProduct,
  onNavigateToTestimonial,
  onNavigateToShopWebView,
  onNavigateToBlogPost,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  useScreenTracking('home_screen');

  const {
    // Auth
    handleRestrictedAction,

    // Data
    heroBanners,
    guidanceItems,
    quickServices,
    ongoingLives,
    upcomingLives,
    astrologers,
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

  // --- Handlers ---

  const handleCtaPress = useCallback(
    (action?: string) => {
      // Determine action based on banner CTA
      if (action === 'explore') {
        onNavigateToTab?.('explore'); // Assuming 'explore' tab exists
      } else {
        // Default action
        handleRestrictedAction('Please login to explore', () => {
          onNavigateToTab?.('home');
        });
      }
    },
    [handleRestrictedAction, onNavigateToTab],
  );

  const handleGuidancePress = useCallback(
    (item: any) => {
      handleRestrictedAction(
        `Please login to get guidance on ${item.title}`,
        () => {
          // Navigate to specific guidance or chat
          onNavigateToChat?.();
        },
      );
    },
    [handleRestrictedAction, onNavigateToChat],
  );

  const handleServiceActionPress = useCallback(
    (action: 'chat' | 'call' | 'live') => {
      const messages = {
        chat: 'Please login to start a chat',
        call: 'Please login to make a call',
        live: 'Please login to join live healings',
      };

      handleRestrictedAction(messages[action], () => {
        if (action === 'chat') onNavigateToChat?.();
        else if (action === 'call') onNavigateToCall?.();
        else if (action === 'live') onNavigateToLive?.();
      });
    },
    [
      handleRestrictedAction,
      onNavigateToChat,
      onNavigateToCall,
      onNavigateToLive,
    ],
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

  const handleAstrologerPress = useCallback(
    (astrologer: any) => {
      onNavigateToAstrologerProfile?.(astrologer.id);
    },
    [onNavigateToAstrologerProfile],
  );

  const handleViewAllAstrologers = useCallback(() => {
    onNavigateToTab?.('astrologers'); // Assuming tab exists
  }, [onNavigateToTab]);

  const handleCategoryPress = useCallback(
    (category: any) => {
      onNavigateToCategory?.(category.id);
    },
    [onNavigateToCategory],
  );

  const handleRemedyPress = useCallback(
    (remedy: any) => {
      onNavigateToProduct?.(remedy.id);
    },
    [onNavigateToProduct],
  );

  const handleViewAllRemedies = useCallback(() => {
    onNavigateToRemedies?.();
  }, [onNavigateToRemedies]);

  const handleTestimonialPress = useCallback(
    (testimonial: any) => {
      onNavigateToTestimonial?.(testimonial.id);
    },
    [onNavigateToTestimonial],
  );

  const handleShopPress = useCallback(
    (item: any) => {
      // The Shop component handles WebView internally, but we can also navigate if needed
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

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 70},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 1. Hero Banner */}
        <HeroBanner
          data={heroBanners}
          onCtaPress={handleCtaPress}
          style={styles.section}
        />

        {/* 2. Astrology Guidance (Life Problems) */}
        <AstrologyGuidance
          items={guidanceItems}
          onItemPress={handleGuidancePress}
          style={styles.section}
        />

        {/* 3. Service Actions (Call, Chat, Live Healings) */}
        <ServiceActions
          onChatPress={() => handleServiceActionPress('chat')}
          onCallPress={() => handleServiceActionPress('call')}
          onLivePress={() => handleServiceActionPress('live')}
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
          onSessionPress={handleLiveSessionPress} // Or specific handler for upcoming
          onViewAllPress={handleViewAllLive}
          style={styles.section}
        />

        {/* 6. Recommended Astrologers */}
        <RecommendedAstrologers
          astrologers={astrologers}
          onAstrologerPress={handleAstrologerPress}
          onViewAllPress={handleViewAllAstrologers}
          style={styles.section}
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
          posts={blogPosts}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  section: {
    // marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
});

export default HomeScreen;
