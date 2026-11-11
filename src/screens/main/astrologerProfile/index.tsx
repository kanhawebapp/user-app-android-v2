import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, useTheme } from '../../../theme';
import { Icon } from '../../../components/Icon';
import { Text } from '../../../components/Text';
import { styles } from './styles';
import type { AstrologerProfileScreenProps } from './types';
import { useAstrologerDetails } from '../../../services/api/astrologerProfile/useAstrologerDetails';
import { useGifts } from '../../../services/api/gift/useGifts';
import { Gift } from '../../../services/api/gift/gift.types';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { SkillsSection } from './components/SkillsSection';
import { LanguagesSection } from './components/LanguagesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { useConsultationFlow } from '../call/hooks/useConsultationFlow';
import { ChatRequestModal } from '../../../components/Modal';
import { DEFAULTS } from '../../../constants/app.constants';
import { getAstrologerPrice, isFreeCurrentPrice } from './utils/astrologerPricing';
import { useSendGift } from '../../../services/api/sendGift/useSendGift';
import { useProfile } from '../../../services/api/profile/profile.hooks';
import { useFollowAstrologer } from '../../../services/api/followAstrologer/useFollowAstrologer';
import { useFollowersCount } from '../../../services/api/followersCount/followers-count.hook';
import { API_BASE_URL } from '../../../constants/api.constants';
import { getAstrologerStatus } from '../chat/utils/astrologerStatus';
import { useToast } from '../../../context/ToastContext';
import { applyWalletBalanceCoins } from '../../../services/api/wallet/wallet.hooks';
import { useAuthStore } from '../../../stores/auth.store';

const AstrologerProfileScreen: React.FC<AstrologerProfileScreenProps> = ({
  astrologer,
  onBack,
  onNavigateToSendGift,

}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [consultationType, setConsultationType] = useState<'chat' | 'call'>(
    'chat',
  );

  const { profile } = useProfile();
  const { data, loading } = useAstrologerDetails(astrologer?.id);
  const { data: gifts, loading: giftLoading } = useGifts();
  const { submitGift, loading: sendGiftLoading } =
    useSendGift();

  const { showSuccess, showError, showInfo } = useToast();

// console.log('ASTROLOGER DATA =>>>', data);

  const astrologerData = useMemo(() => {
    if (!data) {
      return astrologer;
    }

    return {
      ...data,
      displayName: (data as any).displayName || astrologer?.displayName,
    };
  }, [data, astrologer]);
  const { submitConsultationRequest, loading: consultationLoading } =
    useConsultationFlow();

  const chatPricing = useMemo(() => {
    return astrologerData?.pricing?.find(
      (item: any) => item.type === 'CHAT' && item.isActive,
    );
  }, [astrologerData]);

  const callPricing = useMemo(() => {
    return astrologerData?.pricing?.find(
      (item: any) => item.type === 'CALL' && item.isActive,
    );
  }, [astrologerData]);

  const handleChatPress = useCallback(() => {
    setConsultationType('chat');
    setShowChatRequestModal(true);
  }, []);

  const handleCallPress = useCallback(() => {
    setConsultationType('call');
    setShowChatRequestModal(true);
  }, []);

  const Currency = DEFAULTS.CURRENCY;

  const chatPriceData = useMemo(
    () => getAstrologerPrice(astrologer, 'CHAT'),
    [astrologerData],
  );


  console.log('CHAT PRICE DATA =>', chatPriceData);
  const callPriceData = useMemo(
    () => getAstrologerPrice(astrologer, 'CALL'),
    [astrologerData],
  );

  const imageUrl = astrologerData?.profilePic
    ? astrologerData?.profilePic?.startsWith('http')
      ? astrologerData?.profilePic
      : `${API_BASE_URL.DEVELOPMENT}${astrologerData?.profilePic}`
    : null;


  const {
    isFollowing,
    follow,
    unfollow,
    checkFollowStatus
  } = useFollowAstrologer();
  const {
    followersCount,
    fetchFollowersCount,
  } = useFollowersCount();

  useEffect(() => {
    if (data?.id) {
      fetchFollowersCount(data.id);
      checkFollowStatus(data.id);
    }
  }, [data?.id]);

  const handleFollow = useCallback(async () => {
    try {
      if (!data?.id) {
        showError('Astrologer not found');
        return;
      }

      if (isFollowing) {
        await unfollow(data.id);
        showSuccess(
          `You have unfollowed ${data?.displayName || data?.name || 'Astrologer'}`,
        );
      } else {
        await follow(data.id);
        showSuccess(
          `You are now following ${data?.displayName || data?.name || 'Astrologer'}`,
        );
      }

      await fetchFollowersCount(data.id);
    } catch (error: any) {
      console.log(error);
      showError(
        error?.message || 'Something went wrong. Please try again.',
      );
    }
  }, [
    data?.id,
    data?.displayName,
    data?.name,
    isFollowing,
    follow,
    unfollow,
    fetchFollowersCount,
    showSuccess,
    showError,
  ]);

  const {
    status,
    color: indicatorColor,
    canChat,
    canCall,
  } = getAstrologerStatus(data);

const isOffline = !canChat && !canCall;

const displayIndicatorColor = isOffline ? '#EF4444' : indicatorColor;

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      // Astrologer Details Refresh
      if (astrologer?.id) {
        await Promise.all([
          fetchFollowersCount(astrologer.id),
          checkFollowStatus(astrologer.id),
        ]);
      }

      showSuccess('Profile refreshed');
    } catch (error) {
      console.log('Refresh Error:', error);
      showError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [
    astrologer?.id,
    fetchFollowersCount,
    checkFollowStatus,
    showSuccess,
    showError,
  ]);

  const handleSendGiftApi = useCallback(
    async (gift: Gift, message: string): Promise<void> => {
      if (!data?.id) {
        showError('Astrologer not found');
        throw new Error('Astrologer not found');
      }

      if (!profile?.id) {
        showError('User not found');
        throw new Error('User not found');
      }

      showInfo(`Sending ${gift.name}...`);

      console.log('SEND GIFT:', gift, message);
      console.log('ASTROLOGER ID =>', data?.id);

      const response = await submitGift({
        astro_id: data.id,
        gift_id: gift.id,
        giftname: gift.name,
        giftprice: gift.amount,
        user_id: profile.id,
      });

      console.log('Gift Response:', response);

      if (!response?.success) {
        showError(response?.message || 'Failed to send gift');
        throw new Error(response?.message || 'Failed to send gift');
      }

      // Keep wallet UI + auth store in sync with mutation response
      if (typeof response.userBalance === 'number') {
        applyWalletBalanceCoins(response.userBalance);
        useAuthStore.getState().updateWalletBalance(response.userBalance);
      }

      showSuccess(`${gift.name} sent successfully 🎁`);
    },
    [
      data?.id,
      profile?.id,
      submitGift,
      showSuccess,
      showError,
      showInfo,
    ],
  );


  if (loading && !astrologerData) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.primary,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />

      {/* <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}> */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]} // Android
            tintColor={colors.primary.main} // iOS
          />
        }
      >
        <View style={styles.headerContainer}>
          <Header
            data={data}
            onBack={onBack}
            followersCount={followersCount}

          />

          <ProfileSection
            astrologerData={astrologerData}
            imageUrl={imageUrl}
            indicatorColor={displayIndicatorColor}
            status={status}
            isFollowing={isFollowing}
            onFollowPress={handleFollow}
          />

          <SkillsSection skills={astrologerData?.skills} />

          <LanguagesSection languages={astrologerData?.languages} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.pricingCard}>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    status === 'online'
                      ? '#D1FAE5'
                      : status === 'busy'
                        ? '#FEF3C7'
                        : '#F3F4F6',
                },
              ]}>
              <Text
                style={[
                  styles.statusPillText,
                  {
                    color:
                      status === 'online'
                        ? '#059669'
                        : status === 'busy'
                          ? '#D97706'
                          : '#6B7280',
                    textTransform: 'capitalize',
                  },
                ]}>
                {status}
              </Text>
            </View>

            <View style={styles.pricingRow}>
              {!!chatPricing && (
                <View style={styles.chatPriceRow}>
                  <Text
                    style={[
                      styles.pricingText,
                      styles.currentPriceText,
                      { color: colors.text.primary },
                    ]}>
                    {isFreeCurrentPrice(chatPriceData.currentPrice)
                      ? 'Free'
                      : `${Currency}${chatPriceData.currentPrice}/min`}
                  </Text>
                  {!!chatPriceData.oldPrice && (
                    <Text style={styles.oldPriceText}>
                      {Currency}
                      {chatPriceData.oldPrice}/min
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            About
          </Text>

          <View style={styles.infoCard}>
            <View
              style={
                aboutExpanded
                  ? undefined
                  : { maxHeight: 72, overflow: 'hidden' }
              }>
              <RenderHTML
                contentWidth={width - 64}
                source={{
                  html:
                    astrologerData?.about || '<p>No information available</p>',
                }}
                tagsStyles={{
                  p: {
                    color: colors.text.secondary,
                    fontSize: 15,
                    lineHeight: 24,
                    marginTop: 0,
                    marginBottom: 0,
                  },
                }}
              />
            </View>

            {!!astrologerData?.about && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAboutExpanded(prev => !prev)}
                style={styles.readMoreRow}>
                <Text style={styles.readMoreText}>
                  {aboutExpanded ? 'Read less' : 'Read more'}
                </Text>
                <Icon
                  name={aboutExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.primary.main}
                  library="Ionicons"
                />
              </TouchableOpacity>
            )}

            <View style={styles.aboutDivider} />

            <View style={styles.aboutStatsRow}>
              <View style={styles.aboutStatItem}>
                <Text
                  style={[
                    styles.aboutStatValue,
                    { color: colors.text.primary },
                  ]}>
                  {astrologerData?.experience || 0}+ Years
                </Text>
                <Text
                  style={[
                    styles.aboutStatLabel,
                    { color: colors.text.secondary },
                  ]}>
                  Experience
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ReviewsSection reviews={astrologerData?.reviews} />

        {/* <View style={{ height: 120 }} /> */}
      </ScrollView>

      <View
        style={[
          styles.actionContainer,
          {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.light,
            borderTopWidth: 1,
            flexDirection: 'row',
            gap: 12,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}>


        {!!chatPricing && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleChatPress}
            disabled={!canChat}
            style={[
              styles.actionButton,
              styles.chatActionButton,
              !canChat && styles.disabledBtn,
            ]}>
            <View style={styles.chatPriceRow}>
              <Text style={styles.actionButtonText}>
                {isFreeCurrentPrice(chatPriceData.currentPrice)
                ? 'Chat Free'
                : 'Chat'}
              </Text>
       
            </View>
          </TouchableOpacity>
        )}

        {!!callPricing && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleCallPress}
            disabled={!canCall}
            style={[
              styles.actionButton,
              styles.callActionButton,
              !canCall && styles.disabledBtn,
            ]}>
            <Text style={styles.actionButtonText}>
              {isFreeCurrentPrice(callPriceData.currentPrice)
                ? 'Call Free'
                : 'Call'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            if (onNavigateToSendGift) {
              onNavigateToSendGift({
                gifts: gifts || [],
                astrologerName:
                  astrologerData?.displayName ||
                  astrologerData?.name ||
                  'Astrologer',
                astrologerProfilePic: astrologerData?.profilePic,
                onSendGift: handleSendGiftApi,
                loading: giftLoading,
              });
            }
          }}
          style={[styles.actionButton, styles.chatActionButton]}>
          <Text style={styles.actionButtonText}>Send Gift</Text>
        </TouchableOpacity>
      </View>

      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        astrologer={astrologerData}
        loading={consultationLoading}
        onClose={() => {
          setShowChatRequestModal(false);
        }}
        onSubmit={async formData => {
          return submitConsultationRequest({
            astrologer: astrologerData,
            consultationType,
            formData,
            onClose: () => {
              setShowChatRequestModal(false);
            },
          });
        }}
      />
    </View>
  );
};

export default AstrologerProfileScreen;