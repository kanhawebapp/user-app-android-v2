import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
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
import { StatsCard } from './components/StatsCard';
import { SessionPricingCard } from './components/SessionPricingCard';
import { SendGiftModal } from './components/SendGiftModal';
import { useNavigation } from '@react-navigation/native';
import { useConsultationFlow } from '../call/hooks/useConsultationFlow';
import { ChatRequestModal } from '../../../components/Modal';

const AstrologerProfileScreen: React.FC<AstrologerProfileScreenProps> = ({
  astrologer,
  onBack,
  onChatPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { width } = useWindowDimensions();
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [consultationType, setConsultationType] =
    useState<'chat' | 'call'>('chat');

  const { data, loading } = useAstrologerDetails(astrologer?.id);
  const { data: gifts, loading: giftLoading } = useGifts();

  const [isFollowing, setIsFollowing] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const astrologerData = useMemo(() => {
    return data || astrologer;
  }, [data, astrologer]);

  const {
    submitConsultationRequest,
    loading: consultationLoading,
  } = useConsultationFlow();

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
    (_gift: Gift, _message: string) => {
      console.log('SEND GIFT:', _gift, _message);
      setShowGiftModal(false);
    },
    [],
  );


  const imageUrl = astrologerData?.profilePic
    ? astrologerData?.profilePic?.startsWith('http')
      ? astrologerData?.profilePic
      : `https://dhwaniastro.com${astrologerData?.profilePic}`
    : null;

  // const statsData = [
  //   { label: 'Chats', value: '12K+' },
  //   { label: 'Followers', value: '8.5K' },
  //   { label: 'Response', value: '99%' },
  // ];

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
      style={[
        styles.container,
        { backgroundColor: colors.background.primary },
      ]}>
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
            onBack={onBack}
            isFollowing={isFollowing}
            setIsFollowing={setIsFollowing}
            onSendGiftPress={() => setShowGiftModal(true)}
          />

          <ProfileSection
            astrologerData={astrologerData}
            imageUrl={imageUrl}
          />

          <SkillsSection skills={astrologerData?.skills} />

          <LanguagesSection languages={astrologerData?.languages} />
        </View>

        {/* <StatsCard stats={statsData} /> */}

        <View style={styles.infoSection}>
          {/* <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Consultation Services
          </Text> */}

          <View style={styles.pricingContainer}>
            {!!chatPricing && (
              <SessionPricingCard pricing={chatPricing} onPress={handleChatPress} />
            )}

            {!!callPricing && (
              <SessionPricingCard pricing={callPricing} onPress={handleCallPress} />
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
                  astrologerData?.about ||
                  '<p>No information available</p>',
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
              Call ₹{callPricing?.offerPrice || callPricing?.price}/m
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
              Chat ₹{chatPricing?.offerPrice || chatPricing?.price}/m
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
          <Text style={styles.actionButtonText}>
            Send Gift
          </Text>
        </TouchableOpacity>

      </View>

      <SendGiftModal
        visible={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        gifts={gifts || []}
        astrologerName={astrologerData?.name}
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
        onSubmit={(formData) => {
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