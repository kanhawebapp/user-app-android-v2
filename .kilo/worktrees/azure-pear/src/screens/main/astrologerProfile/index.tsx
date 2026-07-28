import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
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
import { SessionPricingCard } from './components/SessionPricingCard';
import { SendGiftModal } from './components/SendGiftModal';
import { useConsultationFlow } from '../call/hooks/useConsultationFlow';
import { ChatRequestModal } from '../../../components/Modal';
import { DEFAULTS } from '../../../constants/app.constants';
import { getAstrologerPrice } from './utils/astrologerPricing';
import { useSendGift } from '../../../services/api/sendGift/useSendGift';
import { useProfile } from '../../../services/api/profile/profile.hooks';
import { useFollowAstrologer } from '../../../services/api/followAstrologer/useFollowAstrologer';
import { useFollowersCount } from '../../../services/api/followersCount/followers-count.hook';

const AstrologerProfileScreen: React.FC<AstrologerProfileScreenProps> = ({
  astrologer,
  onBack,
 
}) => {
  console.log('[AstrologerProfileScreen] mount with astrologer:', {
    astrologerId: astrologer?.id,
    astrologerName: astrologer?.displayName || astrologer?.name,
  });
  const theme = useTheme();
  const colors = theme.colors;
  const { width } = useWindowDimensions();
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [consultationType, setConsultationType] = useState<'chat' | 'call'>(
    'chat',
  );

  const { profile } = useProfile();
  const { data, loading } = useAstrologerDetails(astrologer?.id);
  const { data: gifts, loading: giftLoading } = useGifts();
  const { submitGift, loading: sendGiftLoading } =
    useSendGift();

  const [isFollowingg, setIsFollowing] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  // console.log('ASTROLOGER DETAILS =>', data?.id);
  // console.log("my profile datatatataa",profile?.id)


  const astrologerData = useMemo(() => {
    return data || astrologer;
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

  const handleSendGift = useCallback(
    async (gift: Gift, message: string) => {
      try {
        console.log('SEND GIFT:', gift, message);
        console.log('ASTROLOGER ID =>', data?.id);

        const response = await submitGift({
          astro_id: data?.id,
          gift_id: gift.id,
          giftname: gift.name,
          giftprice: gift.amount,
          user_id: profile?.id
        });

        setShowGiftModal(false);
      } catch (error) {
        console.log(
          'Gift Send Failed:',
          error,
        );
      }
    },
    [data?.id, submitGift],
  );

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
      : `https://dhwaniastro.com${astrologerData?.profilePic}`
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Header
            data={data}
            onBack={onBack}
            // isFollowing={isFollowingg}
            // setIsFollowing={setIsFollowing}
            // onSendGiftPress={() => setShowGiftModal(true)}
            // checkFollowStatus={checkFollowStatus}
            followersCount={followersCount}

          />

          <ProfileSection 
          astrologerData={astrologerData} imageUrl={imageUrl}
          followersCount={followersCount}
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

        <View style={{ height: 120 }} />
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
            style={[styles.actionButton, styles.callActionButton]}>
            <Icon
              name="call"
              size={20}
              color={colors.primary.main}
              library="Ionicons"
            />
            <Text style={styles.actionButtonText}>
              {/* Call {Currency}{callPricing?.offerPrice || callPricing?.price}/m */}
              Call {Currency}
              {callPriceData.currentPrice}/m
            </Text>
          </TouchableOpacity>
        )}

        {!!chatPricing && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleChatPress}
            style={[styles.actionButton, styles.chatActionButton]}>
            <Icon
              name="chatbubble-ellipses"
              size={20}
              color={colors.primary.main}
              library="Ionicons"
            />
            <Text style={styles.actionButtonText}>
              {/* Chat {Currency}{chatPricing?.offerPrice || chatPricing?.price}/m */}
              Chat {Currency}
              {chatPriceData.currentPrice}/m
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => setShowGiftModal(true)}
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

      <SendGiftModal
        visible={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        gifts={gifts || []}
        astrologerName={astrologerData?.name}
        astrologerProfilePic={astrologerData?.profilePic}
        onSendGift={handleSendGift}
        loading={giftLoading}
      />

      <ChatRequestModal
        visible={showChatRequestModal}
        type={consultationType}
        astrologer={astrologerData}
        loading={consultationLoading}
        onClose={() => {
          setShowChatRequestModal(false);
        }}
        onSubmit={formData => {
          submitConsultationRequest({
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
