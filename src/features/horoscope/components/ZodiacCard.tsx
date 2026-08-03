import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {CustomImage} from '../../../components/Image';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {ZodiacSign} from '../constants/zodiacSigns';

export interface ZodiacCardProps {
  sign: ZodiacSign;
  onPress: (sign: ZodiacSign) => void;
}

export const ZodiacCard: React.FC<ZodiacCardProps> = ({sign, onPress}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(sign)}
      style={[
        styles.card,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={sign.name}>
      <View style={styles.imageContainer}>
        <CustomImage
          source={sign.image}
          size={64}
          borderRadius={32}
          resizeMode="cover"
          showLoading={false}
        />
        <View
          style={[
            styles.symbolBadge,
            {backgroundColor: colors.primary.light + '30'},
          ]}>
          <Text variant="h4" weight="bold" style={{color: colors.primary.main}}>
            {sign.symbol}
          </Text>
        </View>
      </View>

      <Text
        variant="body"
        weight="bold"
        style={{color: colors.text.primary, marginTop: 12}}
        numberOfLines={1}>
        {sign.name || '-'}
      </Text>

      <Text
        variant="captionSmall"
        style={{color: colors.text.secondary, marginTop: 4}}>
        {sign.dateRange || '-'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolBadge: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

export default ZodiacCard;
