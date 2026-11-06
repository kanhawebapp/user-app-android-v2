import React from 'react';
import { View, TouchableOpacity, Text, Image, Pressable } from 'react-native';
import { useTheme } from '../../../../../theme';
import { AstrologerCardProps } from './types';
import { styles } from './styles';
import { AstrologerAvailability } from '../../types';
import {
  CHAT_CALL_LABELS,
  DEFAULTS,
} from '../../../../../constants/app.constants';
import { Card } from '../../../../../components';
import images from '../../../../../assets/images';
import { API_BASE_URL } from '../../../../../constants/api.constants';
import { getAstrologerPrice, isFreeCurrentPrice } from '../../../astrologerProfile/utils/astrologerPricing';
import { getAstrologerStatus } from '../../../chat/utils/astrologerStatus';

const getAvailabilityColor = (
  availability: AstrologerAvailability,
  colors: any,
): string => {
  switch (availability) {
    case 'online':
      return colors.success.main;
    case 'busy':
    case 'on_call':
      return colors.warning.main;
    case 'offline':
    default:
      return colors.common.gray[500];
  }
};

const getAvailabilityIndicatorStyle = (
  availability: AstrologerAvailability,
): 'onlineIndicator' | 'offlineIndicator' | 'busyIndicator' => {
  switch (availability) {
    case 'online':
      return 'onlineIndicator';
    case 'busy':
    case 'on_call':
      return 'busyIndicator';
    case 'offline':
    default:
      return 'offlineIndicator';
  }
};


export const AstrologerCard: React.FC<AstrologerCardProps> = ({
  astrologer,
  activeTab,
  onChatPress,
  onCallPress,
  onProfilePress,
  onCardPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const {
    rating,
    reviewCount,
    experience,
    languages,
    skills,
    availability,
    isAvailableForChat,
    isAvailableForCall,
  } = astrologer;
  const indicatorStyle = getAvailabilityIndicatorStyle(availability);

  const availabilityColor = getAvailabilityColor(availability, colors);
  const {
    status,
    color: indicatorColor,
    canChat,
    canCall,
  } = getAstrologerStatus(astrologer);

  const isOffline = !canChat && !canCall;

  const displayIndicatorColor = isOffline ? '#EF4444' : indicatorColor;

  const profileImage = astrologer.profilePic
    ? {
      uri: astrologer.profilePic.startsWith('http')
        ? astrologer.profilePic
        : `${API_BASE_URL.DEVELOPMENT}${astrologer.profilePic}`,
    }
    : images.Logo;

  const chatPriceData = getAstrologerPrice(astrologer, 'CHAT');
  const callPriceData = getAstrologerPrice(astrologer, 'CALL');

  const displayPriceData =
    activeTab === 'call' ? callPriceData : chatPriceData;
  const displayRate = displayPriceData.currentPrice;
  const displayOldPrice = displayPriceData.oldPrice;

  const disabledColor = '#D1D5DB';
  const disabledTextColor = '#9CA3AF';

  const skillsDisplay = skills.slice(0, 3).join(', ');

  return (
    <Pressable onPress={() => onCardPress?.(astrologer)}>
      <Card style={[styles.card]}>
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary.light + '20' },
              ]}>
              <Image
                source={profileImage}
                style={styles.avatarImage}
              />
            </View>

            <View
              style={[
                styles[indicatorStyle],
                {
                  backgroundColor: displayIndicatorColor,
                  borderColor: colors.common.white,
                },
              ]}
            />

          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text
              style={[styles.name, { color: colors.primary.main }]}
              numberOfLines={1}>
              {astrologer.displayName || astrologer.name || 'Astrologer'}
            </Text>

            <View style={styles.statsRow}>
              <Text style={[styles.starIcon, { color: colors.warning.main }]}>
                ★
              </Text>
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              <Text style={styles.statsSeparator}>|</Text>
              <Text style={styles.statsText}>{reviewCount} orders</Text>
              <Text style={styles.statsSeparator}>|</Text>
              <Text style={styles.statsText}>
                {CHAT_CALL_LABELS.CARD_EXPERIENCE} {experience}
              </Text>
            </View>

            <View style={styles.languageContainer}>
              <Text
                style={styles.language}
                numberOfLines={1}>
                {languages.join(', ')}
              </Text>
            </View>

            {skillsDisplay.length > 0 && (
              <Text style={styles.skillsText} numberOfLines={1}>
                {skillsDisplay}
              </Text>
            )}
          </View>
        </View>

        {/* Footer: Price + Action Buttons */}
        <View style={styles.footerRow}>
          <View style={styles.priceBlock}>
            {isFreeCurrentPrice(displayRate) ? (
              <Text style={[styles.currentPrice, { color: colors.primary.main }]}>
                Free
              </Text>
            ) : (
              <Text style={styles.currentPrice}>
                {DEFAULTS.CURRENCY}
                {displayRate}
                {CHAT_CALL_LABELS.CARD_PER_MINUTE}
              </Text>
            )}
            {!!displayOldPrice && !isFreeCurrentPrice(displayRate) && (
              <Text style={styles.oldPrice}>
                {DEFAULTS.CURRENCY}
                {displayOldPrice}
                {CHAT_CALL_LABELS.CARD_PER_MINUTE}
              </Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.chatButton,
                {
                  borderColor: canChat
                    ? colors.primary.main
                    : disabledColor,

                  backgroundColor: canChat
                    ? colors.common.white
                    : '#F3F4F6',
                },
              ]}
              onPress={() => onChatPress?.(astrologer)}
              disabled={!canChat}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: canChat
                      ? colors.primary.main
                      : disabledTextColor,
                  },
                ]}>
                {CHAT_CALL_LABELS.CARD_CHAT}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.callButton,
                {
                  borderColor: canCall
                    ? colors.primary.main
                    : disabledColor,

                  backgroundColor: canCall
                    ? colors.common.white
                    : '#F3F4F6',
                },
              ]}
              onPress={() => onCallPress?.(astrologer)}
              disabled={!canCall}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: canCall
                      ? colors.primary.main
                      : disabledTextColor,
                  },
                ]}>
                {CHAT_CALL_LABELS.CARD_CALL}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export default AstrologerCard;
