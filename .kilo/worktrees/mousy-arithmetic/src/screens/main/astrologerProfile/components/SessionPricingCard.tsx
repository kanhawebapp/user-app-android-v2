import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { AstrologerPricing } from '../../../../services/api/astrologerProfile/astrologer-details.types';
import { useTheme } from '../../../../theme';
import { Icon, Text } from '../../../../components';
// import {useTheme} from '../../../theme';
// import {Icon} from '../../../components/Icon';
// import {Text} from '../../../components/Text';
// import type {AstrologerPricing} from '../../../services/api/astrologerProfile/astrologer-details.types';

type SessionPricingCardProps = {
  pricing: AstrologerPricing;
  onPress?: () => void;
};

const getSessionConfig = (type: AstrologerPricing['type']) => {
  const configs = {
    CHAT: {
      icon: 'chatbubble-ellipses',
      color: '#8B5CF6',
      label: 'Chat',
      bgColor: '#8B5CF620',
    },
    CALL: {
      icon: 'call',
      color: '#10B981',
      label: 'Voice Call',
      bgColor: '#10B98120',
    },
    VIDEO: {
      icon: 'videocam',
      color: '#EC4899',
      label: 'Video Call',
      bgColor: '#EC489920',
    },
    AUDIO: {
      icon: 'headset',
      color: '#3B82F6',
      label: 'Audio',
      bgColor: '#3B82F620',
    },
  };
  return configs[type] || configs.CHAT;
};

export const SessionPricingCard: React.FC<SessionPricingCardProps> = ({
  pricing,
  onPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const config = getSessionConfig(pricing.type);

  const displayPrice = pricing.offerPrice || pricing.price;
  const hasDiscount = pricing.offerPrice && pricing.offerPrice !== pricing.price;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}>
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: config.bgColor},
          ]}>
          <Icon
            name={config.icon}
            size={26}
            color={config.color}
            library="Ionicons"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.sessionLabel, {color: colors.text.primary}]}>
            {config.label} Consultation
          </Text>
          <Text style={[styles.sessionDesc, {color: colors.text.secondary}]}>
            {pricing.type === 'CHAT' && 'Instant messaging consultation'}
            {pricing.type === 'CALL' && 'Talk directly with astrologer'}
            {pricing.type === 'VIDEO' && 'Face-to-face live guidance'}
            {pricing.type === 'AUDIO' && 'Audio consultation'}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, {color: config.color}]}>
            ₹{displayPrice}
          </Text>
          <Text style={[styles.priceLabel, {color: colors.text.secondary}]}>
            per minute
          </Text>
          {hasDiscount && (
            <Text style={[styles.originalPrice, {color: colors.text.tertiary}]}>
              ₹{pricing.price}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  sessionLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  sessionDesc: {
    marginTop: 4,
    fontSize: 13,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: '900',
    fontSize: 20,
  },
  priceLabel: {
    marginTop: 2,
    fontSize: 12,
  },
  originalPrice: {
    marginTop: 2,
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
});

export default SessionPricingCard;