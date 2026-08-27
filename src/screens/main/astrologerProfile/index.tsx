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
import { SessionPricingCard } from './components/SessionPricingCard';
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
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
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
    }
  }, [data?.id]);

  const {
    status,
    color: indicatorColor,
    canChat,
    canCall,
  } = getAstrologerStatus(data);


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
            astrologerData={astrologerData} imageUrl={imageUrl}
            followersCount={followersCount}
            indicatorColor={indicatorColor}
            status={status}
          />

          <SkillsSection skills={astrologerData?.skills} />

          <LanguagesSection languages={astrologerData?.languages} />
        </View>

        <View style={styles.infoSection}>

          <View style={styles.pricingContainer}>
            {!!chatPricing && (
              <SessionPricingCard
                pricing={chatPricing}
                onPress={handleChatPress}
                Currency={Currency}
                astrologer={astrologer}
              />
            )}

            {!!callPricing && (
              <SessionPricingCard
                pricing={callPricing}
                onPress={handleCallPress}
                Currency={Currency}
                astrologer={astrologer}
              />
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            About Astrologer
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.light,
              },
            ]}>
            <RenderHTML
              contentWidth={width}
              source={{
                html:
                    astrologerData?.about || '<p>No information available</p>',
              }}
              tagsStyles={{
                p: {
                  color: colors.text.secondary,
                  fontSize: 15,
                  lineHeight: 26,
                },
              }}
            />
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
            paddingBottom: 24,
          },
        ]}>


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
            <Icon
              name="call"
              size={20}
              color={colors.primary.main}
              library="Ionicons"
            />
            <Text style={styles.actionButtonText}>
              {/* Call {Currency}{callPricing?.offerPrice || callPricing?.price}/m */}
              {isFreeCurrentPrice(callPriceData.currentPrice) ? (
                'Call Free'
              ) : (
                <>
                  Call {Currency}
                  {callPriceData.currentPrice}/m
                </>
              )}
            </Text>
          </TouchableOpacity>
        )}

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
            <Icon
              name="chatbubble-ellipses"
              size={20}
              color={colors.primary.main}
              library="Ionicons"
            />
            <Text style={styles.actionButtonText}>
              {/* Chat {Currency}{chatPricing?.offerPrice || chatPricing?.price}/m */}
              {isFreeCurrentPrice(chatPriceData.currentPrice) ? (
                'Chat Free'
              ) : (
                <>
                  Chat {Currency}
                  {chatPriceData.currentPrice}/m
                </>
              )}
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
          <Icon
            name="gift"
            size={20}
            color={colors.primary.main}
            library="Ionicons"
          />
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