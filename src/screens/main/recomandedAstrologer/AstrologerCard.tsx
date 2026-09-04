import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../../../components';
import images from '../../../assets/images';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { getAstrologerPrice, isFreeCurrentPrice } from '../astrologerProfile/utils/astrologerPricing';
import { getAstrologerStatus } from '../chat/utils/astrologerStatus';

interface PricingItem {
  type: string;
  price: number;
  offerPrice?: number;
  commissionPercent?: number;
}

interface AstrologerCardProps {
  item: any;
  style?: any;
  onPress?: () => void;
  onChatPress?: () => void;
  onCallPress?: () => void;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  item,
  style,
  onPress,
  onChatPress,
  onCallPress,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Basic Data
  |--------------------------------------------------------------------------
  */
  // console.log("itemitemitemitem", item)
  // console.log("item>>>>",item)
  const rating =
    item?.rating && item?.rating > 0 ? Number(item.rating).toFixed(1) : '4.8';

  const experience = item?.experience || 0;

  const skills =
    item?.skills?.length > 0 ? item.skills.join(', ') : 'Vedic Astrology';

  const languages =
    item?.languages?.length > 0 ? item.languages.join(', ') : 'Hindi';


  const profileImage = item?.profilePic
    ? {
      uri: item.profilePic.startsWith('http')
        ? item.profilePic
        : `${API_BASE_URL.DEVELOPMENT}${item.profilePic}`,
    }
    : images.Logo;

// console.log("profileImage", profileImage)
  const { currentPrice: chatPrice, oldPrice: oldChatPrice } = getAstrologerPrice(
    item,
    'CHAT',
  );

  const { currentPrice: callPrice, oldPrice: oldCallPrice } = getAstrologerPrice(
    item,
    'CALL',
  );

  const {
    status,
    color: indicatorColor,
    canChat,
    canCall,
  } = getAstrologerStatus(item);
  // console.log("item", item)
  // console.log("status", status)
  // console.log("color", indicatorColor)

  // console.log("canChat", canChat)
  // console.log("canCall", canCall)
  const isOffline = !canChat && !canCall;

  const displayStatus = isOffline ? 'offline' : status;
  const displayColor = isOffline ? '#EF4444' : indicatorColor;
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.card, style]}
      onPress={onPress}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={11} color="#F59E0B" library="Ionicons" />

          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image source={profileImage} style={styles.image} resizeMode="cover" />
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: displayColor

            },
          ]}
        />
        <View style={styles.experienceBadge}>
          <Text style={styles.experienceBadgeText}>{experience}+ yrs</Text>
        </View>
      </View>

      {/* Name */}
      <Text numberOfLines={1} style={styles.name}>
        {item?.displayName || item?.name || 'Astrologer'}
      </Text>
      <Text
        style={[
          styles.statusText,
          {
            color: displayColor,
          },
        ]}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </Text>
      {/* <Text
        style={[
          styles.statusText,
          {
            color: !isOnline
              ? '#9CA3AF'
              : isBusy
                ? '#F59E0B'
                : '#10B981',
          },
        ]}>
        {!isOnline ? 'Offline' : isBusy ? 'Busy' : 'Online'}
      </Text> */}

      {/* Skills */}
      <Text numberOfLines={2} style={styles.skills}>
        {skills}
      </Text>

      {/* Languages */}
      <View style={styles.languageRow}>
        <Icon
          name="language-outline"
          size={13}
          color="#6B7280"
          library="Ionicons"
        />

        <Text numberOfLines={1} style={styles.languageText}>
          {languages}
        </Text>
      </View>

      {/* Price Card */}
      <View style={styles.priceCard}>
        {/* Chat Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Chat</Text>

          <View style={styles.priceRow}>
            {!!oldChatPrice && (
              <Text style={styles.oldPrice}>₹{oldChatPrice}</Text>
            )}

            {isFreeCurrentPrice(chatPrice) ? (
              <Text style={styles.price}>Free</Text>
            ) : (
              <>
                <Text style={styles.price}>₹{chatPrice}</Text>

                <Text style={styles.perMin}>/min</Text>
              </>
            )}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Call Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Call</Text>

          <View style={styles.priceRow}>
            {!!oldCallPrice && (
              <Text style={styles.oldPrice}>₹{oldCallPrice}</Text>
            )}

            {isFreeCurrentPrice(callPrice) ? (
              <Text style={styles.price}>Free</Text>
            ) : (
              <>
                <Text style={styles.price}>₹{callPrice}</Text>

                <Text style={styles.perMin}>/min</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {/* Chat */}
        {/* <TouchableOpacity
          activeOpacity={0.85}
          style={styles.chatBtn}
          onPress={onChatPress}> */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canChat}
          style={[
            styles.chatBtn,
            !canChat && styles.disabledBtn,
          ]}
          onPress={onChatPress}>
          <Icon
            name="chatbubble-ellipses-outline"
            size={16}
            color={colors.primary.main}
            library="Ionicons"
          />

          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>

        {/* Call */}
        {/* <TouchableOpacity
          activeOpacity={0.85}
          style={styles.callBtn}
          onPress={onCallPress}> */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canCall}
          style={[
            styles.callBtn,
            !canCall && styles.disabledBtn,
          ]}
          onPress={onCallPress}>
          <Icon
            name="call-outline"
            size={16}
            color="#FFFFFF"
            library="Ionicons"
          />

          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default AstrologerCard;

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF7ED',

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 100,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },

  imageWrapper: {
    marginTop: -20,
    alignSelf: 'center',
  },

  image: {
    width: 78,
    height: 78,
    borderRadius: 100,

    borderWidth: 3,
    borderColor: '#F3E8FF',

    backgroundColor: '#F3F4F6',
  },

  experienceBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',

    backgroundColor: colors.primary.light,

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 100,
  },

  experienceBadgeText: {
    color: colors.common.black,
    fontSize: 10,
    fontWeight: '700',
  },

  name: {
    marginTop: 8,

    textAlign: 'center',

    fontSize: 15,
    fontWeight: '600',

    color: '#111827',
  },

  skills: {
    textAlign: 'center',

    fontSize: 12,

    color: '#6B7280',
  },

  languageRow: {
    marginTop: 4,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  languageText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },

  priceCard: {
    marginTop: 5,

    backgroundColor: '#FAF5FF',

    borderRadius: 16,

    paddingHorizontal: 5,
    paddingVertical: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceSection: {
    flex: 1,
    alignItems: 'center',
  },

  priceTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 4,
    marginBottom: 1,
    fontWeight: '700',
  },

  price: {
    fontSize: 15,
    color: colors.primary.main,
    fontWeight: '700',
  },

  perMin: {
    marginLeft: 2,
    marginBottom: 2,

    fontSize: 10,
    color: colors.primary.main,
    fontWeight: '700',
  },

  actionsRow: {
    marginTop: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  chatBtn: {
    flex: 1,

    height: 44,

    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: '#E9D5FF',

    backgroundColor: '#FAF5FF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,
  },

  chatBtnText: {
    color: colors.primary.main,
    fontSize: 13,
    fontWeight: '800',
  },

  callBtn: {
    flex: 1,

    height: 44,

    borderRadius: 14,

    backgroundColor: colors.primary.main,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,
  },

  callBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statusDot: {
    position: 'absolute',
    right: 2,
    bottom: 8,

    width: 14,
    height: 14,

    borderRadius: 100,

    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusText: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
