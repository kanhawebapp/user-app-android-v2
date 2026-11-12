import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Icon} from '../../../components';
import images from '../../../assets/images';
import {colors} from '../../../theme';
import {API_BASE_URL} from '../../../constants/api.constants';
import {
  getAstrologerPrice,
  isFreeCurrentPrice,
} from '../astrologerProfile/utils/astrologerPricing';
import {getAstrologerStatus} from '../chat/utils/astrologerStatus';

interface AstrologerCardProps {
  item: {
    id?: string;
    name?: string;
    displayName?: string | null;
    profilePic?: string | null;
    rating?: number | null;
    experience?: number | string | null;
    skills?: string[];
    languages?: string[];
    [key: string]: unknown;
  };
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onChatPress?: () => void;
  onCallPress?: () => void;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  item,
  style,
  onPress,
  onChatPress,
}) => {
  const rating =
    item?.rating && item.rating > 0 ? Number(item.rating).toFixed(1) : '4.8';

  const skillsList =
    item?.skills && item.skills.length > 0
      ? item.skills
      : ['Vedic Astrology'];

  const profileImage = item?.profilePic
    ? {
        uri: item.profilePic.startsWith('http')
          ? item.profilePic
          : `${API_BASE_URL.DEVELOPMENT}${item.profilePic}`,
      }
    : images.Logo;

  const {currentPrice: chatPrice} = getAstrologerPrice(item, 'CHAT');

  const {color: indicatorColor, canChat, canCall} = getAstrologerStatus(item);

  const isOffline = !canChat && !canCall;
  const displayColor = isOffline ? '#EF4444' : indicatorColor;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.card, style]}
      onPress={onPress}>
      <View style={styles.imageWrapper}>
        <View style={styles.imageBorder}>
          <Image source={profileImage} style={styles.image} resizeMode="cover" />
        </View>
        <View style={[styles.statusDot, {backgroundColor: displayColor}]} />
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {item?.displayName || item?.name || 'Astrologer'}
      </Text>

      <Text numberOfLines={1} style={styles.skills}>
        {skillsList.slice(0, 2).join(', ')}
        {skillsList.length > 2 ? '...' : ''}
      </Text>

      <View style={styles.metaRow}>
        {isFreeCurrentPrice(chatPrice) ? (
          <Text style={styles.price}>Free</Text>
        ) : (
          <Text style={styles.price}>₹{chatPrice}/min</Text>
        )}
        <Text style={styles.metaSeparator}>|</Text>
        <Icon name="star-outline" size={13} color="#F59E0B" library="Ionicons" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!canChat}
        style={[styles.chatBtn, !canChat && styles.disabledBtn]}
        onPress={onChatPress}>
        <Text style={styles.chatBtnText}>Chat</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AstrologerCard;

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  imageBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#D6C6F0',
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    width: '100%',
  },
  skills: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8A8A9A',
    marginBottom: 8,
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  metaSeparator: {
    fontSize: 13,
    color: '#C5C5D0',
    marginHorizontal: 6,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chatBtn: {
    width: '90%',
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary.main,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
