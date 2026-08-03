import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {ZodiacSign} from '../constants/zodiacSigns';

export interface HoroscopeHeaderProps {
  sign: ZodiacSign;
  onBack: () => void;
}

export const HoroscopeHeader: React.FC<HoroscopeHeaderProps> = ({
  sign,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          paddingTop: insets.top,
        },
      ]}>
      <TouchableOpacity
        style={[styles.backButton, {top: insets.top + 8}]}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Icon
          name="arrow-back"
          size={22}
          color={colors.text.primary}
          library="Ionicons"
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text
          variant="h5"
          weight="bold"
          style={{color: colors.text.primary}}
          numberOfLines={1}>
          {sign.name || '-'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
});

export default HoroscopeHeader;
