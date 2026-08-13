import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme';
import { Icon } from '../../../Icon';
import type { Astrologer } from '../types';
import { DEFAULTS, ICONS } from '../../../../constants/app.constants';
import { API_BASE_URL } from '../../../../constants/api.constants';
import { getAstrologerPrice } from '../../../../screens/main/astrologerProfile/utils/astrologerPricing';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface HeaderSectionProps {
  astrologer?: Astrologer;
  onClose: () => void;
  type: 'chat' | 'call';
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  astrologer,
  onClose,
  type,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [imageError, setImageError] = useState(false);

  const getImageSource = () => {
    if (astrologer?.profilePic && !imageError) {
      return {
        uri: `${API_BASE_URL.DEVELOPMENT}${astrologer.profilePic}`,
      };
    }
    return require('../../../../assets/images/Logo.png');
  };

  const priceData = getAstrologerPrice(
    astrologer,
    type === 'call' ? 'CALL' : 'CHAT',
  );

  const currentPrice = priceData.currentPrice;

  return (
    <View style={styles.container}>
      <View style={styles.astrologerInfo}>
        {/* IMAGE FIXED */}
        <View style={styles.imageWrapper}>
          <Image
            source={getImageSource()}
            style={styles.astrologerImage}
            onError={() => setImageError(true)}
          />
        </View>

        <View style={styles.astrologerDetails}>
          <Text
            numberOfLines={1}
            style={[styles.headerTitle, { color: colors.text.primary }]}>
            {type === 'call' ? 'Call' : 'Chat'} with{' '}
            <Text style={{ color: colors.primary.main }}>
              {astrologer?.displayName || astrologer?.name || 'Astrologer'}
            </Text>
          </Text>

          <View style={styles.astrologerMeta}>
            <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
              {astrologer?.rating != null
                ? astrologer.rating.toFixed(2)
                : '0.00'}{' '}
              <AntDesign name='star' size={18} color='gold' />

            </Text>
            <Text style={[styles.priceText, { color: colors.secondary.main }]}>
              {/* ₹{astrologer?.price || 0}/min */}
              {DEFAULTS.CURRENCY}
              {currentPrice}/min
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close" size={22} color={colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  astrologerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  astrologerImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },

  astrologerDetails: {
    flex: 1,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  astrologerMeta: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },

  ratingText: {
    fontSize: 13,
  },

  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },

  closeButton: {
    padding: 8,
  },
});
