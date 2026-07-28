import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SPLASH_COLORS} from '../constants';

export const BackgroundGradient: React.FC = () => (
  <>
    <LinearGradient
      colors={[
        SPLASH_COLORS.gradientStart,
        SPLASH_COLORS.gradientMid,
        SPLASH_COLORS.gradientEnd,
      ]}
      style={styles.gradient}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    />
    <View style={styles.overlay} />
  </>
);

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SPLASH_COLORS.nightOverlay,
  },
});
