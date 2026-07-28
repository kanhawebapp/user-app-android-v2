import React from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {CustomImage} from '../../../../Image';
import {SPLASH_COLORS} from '../constants';

interface AnimatedLogoProps {
  logoSource: any;
  logoOpacity: Animated.Value;
  logoScale: Animated.Value;
  glowAnim: Animated.Value;
  showWaveRings?: boolean;
  waveAnimations?: {
    waveScale: Animated.Value;
    waveOpacity: Animated.Value;
    waveScale2: Animated.Value;
    waveOpacity2: Animated.Value;
    waveScale3: Animated.Value;
    waveOpacity3: Animated.Value;
  };
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  logoSource,
  logoOpacity,
  logoScale,
  glowAnim,
  showWaveRings = false,
  waveAnimations,
}) => (
  <View style={styles.logoContainer}>
    <Animated.View
      style={[
        styles.middleGlow,
        {
          opacity: glowAnim.interpolate({
            inputRange: [0.4, 1],
            outputRange: [0.3, 0.6],
          }),
        },
      ]}
    />
    <Animated.View style={[styles.innerGlow, {opacity: glowAnim}]} />

    {showWaveRings && waveAnimations && (
      <>
        <Animated.View
          style={[
            styles.waveRing,
            {
              opacity: waveAnimations.waveOpacity,
              transform: [{scale: waveAnimations.waveScale}],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.waveRing2,
            {
              opacity: waveAnimations.waveOpacity2,
              transform: [{scale: waveAnimations.waveScale2}],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.waveRing3,
            {
              opacity: waveAnimations.waveOpacity3,
              transform: [{scale: waveAnimations.waveScale3}],
            },
          ]}
        />
      </>
    )}

    <Animated.View
      style={[
        styles.logoWrapper,
        {
          opacity: logoOpacity,
          transform: [{scale: logoScale}],
        },
      ]}>
      <CustomImage
        source={logoSource}
        width={180}
        height={160}
        resizeMode="contain"
        showLoading={false}
      />
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  middleGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: SPLASH_COLORS.purpleLight,
    backgroundColor: SPLASH_COLORS.divineGlow,
  },
  innerGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: SPLASH_COLORS.glow,
  },
  waveRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 3,
    borderColor: SPLASH_COLORS.gold,
    shadowColor: SPLASH_COLORS.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },
  waveRing2: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: SPLASH_COLORS.goldLight,
    shadowColor: SPLASH_COLORS.goldLight,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  waveRing3: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1.5,
    borderColor: SPLASH_COLORS.goldDark,
    shadowColor: SPLASH_COLORS.goldDark,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  logoWrapper: {
    zIndex: 1,
  },
});
