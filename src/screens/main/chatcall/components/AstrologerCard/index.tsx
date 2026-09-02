import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useTheme } from '../../../../../theme';
import { AstrologerCardProps } from './types';
import { styles } from './styles';
import { AstrologerAvailability } from '../../types';
import {
  CHAT_CALL_LABELS,
  DEFAULTS,
} from '../../../../../constants/app.constants';
import { Card, Icon } from '../../../../../components';
import images from '../../../../../assets/images';
import { API_BASE_URL } from '../../../../../constants/api.constants';
import { getAstrologerPrice, isFreeCurrentPrice } from '../../../astrologerProfile/utils/astrologerPricing';
import { getAstrologerStatus } from '../../../chat/utils/astrologerStatus';
import AstrologerStatusBadge from '../../../chat/utils/AstrologerStatusBadge';

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

  // const isOnline = availability === 'online';
  // const isBusy = availability === 'busy' || availability === 'on_call';
  // console.log("astrologerastrologer", astrologer)
  const {
    status,
    color: indicatorColor,
    canChat,
    canCall,
  } = getAstrologerStatus(astrologer);

  const isOffline = !canChat && !canCall;

  const displayIndicatorColor = isOffline ? '#EF4444' : indicatorColor;

  // const canTakeConsultation = isOnline && !isBusy;

  const profileImage = astrologer.image
    ? {
      uri: astrologer.image.startsWith('http')
        ? astrologer.image
        : `${API_BASE_URL.DEVELOPMENT}${astrologer.image}`,
    }
    : images.Logo;

  const chatPriceData = getAstrologerPrice(astrologer, 'CHAT');

  const callPriceData = getAstrologerPrice(astrologer, 'CALL');

  const chatRate = chatPriceData.currentPrice;
  const callRate = callPriceData.currentPrice;

  return (
    <Card style={[styles.card]}>
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log('CARD CLICKED');
              onCardPress?.(astrologer);
            }}
            activeOpacity={0.8}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary.light + '20' },
              ]}>
              <Image
                source={profileImage}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 50,
                }}
              />
            </View>
          </TouchableOpacity>
          {/* <AstrologerStatusBadge status={status} /> */}

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
          {/* Name and Rating */}
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {astrologer.displayName || astrologer.name || 'Astrologer'}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.starIcon, { color: colors.warning.main }]}>
                ★
              </Text>
              <Text style={[styles.rating, { color: colors.text.primary }]}>
                {rating.toFixed(1)}
              </Text>
              {/* <Text
                style={[styles.reviewCount, { color: colors.text.secondary }]}>
                ({reviewCount})
              </Text> */}
            </View>
          </View>

          {/* Experience */}
          <View style={styles.experienceContainer}>
            <Text style={[styles.experience, { color: colors.text.secondary }]}>
              {experience} {CHAT_CALL_LABELS.CARD_EXPERIENCE}
            </Text>
          </View>

          {/* Languages */}
          <View style={styles.languageContainer}>
            <Text
              style={[styles.language, { color: colors.text.secondary }]}
              numberOfLines={1}>
              Languages: {languages.join(', ')}
            </Text>
          </View>

          {/* Price per minute */}
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>
                Chat:
              </Text>
              <Text style={[styles.priceValue, { color: colors.primary.main }]}>
                {isFreeCurrentPrice(chatRate) ? (
                  'Free'
                ) : (
                  <>
                    {DEFAULTS.CURRENCY}
                    {chatRate}
                    {CHAT_CALL_LABELS.CARD_PER_MINUTE}
                  </>
                )}
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>
                Call:
              </Text>
              <Text style={[styles.priceValue, { color: colors.primary.main }]}>
                {isFreeCurrentPrice(callRate) ? (
                  'Free'
                ) : (
                  <>
                    {DEFAULTS.CURRENCY}
                    {callRate}
                    {CHAT_CALL_LABELS.CARD_PER_MINUTE}
                  </>
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {skills.slice(0, 4).map((skill, index) => (
          <View
            key={index}
            style={[
              styles.skillBadge,
              { backgroundColor: colors.primary.light + '20' },
            ]}>
            <Text style={[styles.skillText, { color: colors.primary.main }]}>
              {skill}
            </Text>
          </View>
        ))}
        {skills.length > 4 && (
          <View
            style={[
              styles.skillBadge,
              { backgroundColor: colors.primary.light + '20' },
            ]}>
            <Text style={[styles.skillText, { color: colors.primary.main }]}>
              +{skills.length - 4}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Chat Button */}
        <TouchableOpacity
          style={[
            styles.chatButton,
            // !isAvailableForChat
            //   ? { backgroundColor: colors.common.gray[400] }
            //   : { backgroundColor: colors.common.white },
            !canChat
              ? { backgroundColor: colors.common.gray[400] }
              : { backgroundColor: colors.common.white }
            // : {backgroundColor: colors.primary.main},
          ]}
          onPress={() => onChatPress?.(astrologer)}
          disabled={!canChat}
          // disabled={!isAvailableForChat}
          activeOpacity={0.7}>
          <Icon
            name="chatbubble-ellipses-outline"
            library="Ionicons"
            color={colors.primary.main}
          />
          <Text style={[styles.buttonText, { color: colors.primary.main }]}>
            {CHAT_CALL_LABELS.CARD_CHAT}
          </Text>
        </TouchableOpacity>

        {/* Call Button */}
        <TouchableOpacity
          style={[
            styles.callButton,
            // !isAvailableForCall
            //   ? {
            //     borderColor: colors.common.gray[400],
            //     backgroundColor: colors.background.secondary,
            //   }
            //   : { borderColor: colors.primary.main },
            !canCall
              ? {
                borderColor: colors.common.gray[400],
                backgroundColor: colors.background.secondary,
              }
              : {
                borderColor: colors.primary.main,
              }
          ]}
          onPress={() => onCallPress?.(astrologer)}
          // disabled={!isAvailableForCall}
          disabled={!canCall}
          activeOpacity={0.7}>
          <Icon name="call" size={22} color={colors.primary.main} />
          <Text
            style={[
              styles.buttonText,
              !isAvailableForCall
                ? { color: colors.primary.main }
                : { color: colors.primary.main },
            ]}>
            {CHAT_CALL_LABELS.CARD_CALL}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default AstrologerCard;