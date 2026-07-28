import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { Gift } from '../../../../../../services/api/gift/gift.types';
import { Text, useTheme } from '../../../../../../components';
import { DEFAULTS } from '../../../../../../constants/app.constants';
import { API_BASE_URL } from '../../../../../../constants/api.constants';


interface GiftCardProps {
  gift: Gift;
  isSelected: boolean;
  onPress: (gift: Gift) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({gift, isSelected, onPress}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(gift)}
      style={[
        styles.giftCard,
        {
          backgroundColor: isSelected
            ? colors.card.background
            : colors.card.background,
          borderColor: isSelected ? colors.primary.main : colors.border.light,
          transform: [{scale: isSelected ? 1.05 : 1}],
        },
      ]}>
      <FastImage
        source={{uri: `${API_BASE_URL.DEVELOPMENT}${gift.image}`}}
        style={styles.giftImage}
        resizeMode="contain"
      />
      <Text
        variant="caption"
        weight="semibold"
        color={colors.text.primary}
        style={styles.giftName}
        numberOfLines={1}>
        {gift.name}
      </Text>
      <Text
        variant="caption"
        weight="bold"
        color={isSelected ? colors.primary.main : colors.text.secondary}
        style={styles.giftPrice}>
        {DEFAULTS.CURRENCY} {gift.amount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  giftCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: '33%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginTop:10
  } as ViewStyle,
  giftImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
  } as ViewStyle,
  giftName: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: 80,
  } as TextStyle,
  giftPrice: {
    fontSize: 12,
    letterSpacing: 0.3,
  } as TextStyle,
});