import React, {useMemo} from 'react';
import {
  View,
  Animated,
  StatusBar,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native';
import {images} from '../../../assets/images';
import type {BaseSplashProps} from '../splashScreenType';
import {useSplashAnimations, useWaveAnimations} from './shared';
import {SPLASH_COLORS} from './shared/constants';
import {
  BackgroundGradient,
  TwinklingStars,
  FloatingParticles,
  AnimatedLogo,
  BottomDecoration,
} from './shared/components';

const {height} = Dimensions.get('window');

interface Props extends BaseSplashProps {
  onNext: () => void;
}

export const OnboardingSplash1: React.FC<Props> = ({
  onNext,
  autoNavigateTimeout,
}) => {
  const timeout = autoNavigateTimeout ?? 4000;

  const animations = useSplashAnimations({timeout, onComplete: onNext});
  const waveAnimations = useWaveAnimations();

  const omTranslateY = animations.omStartPos.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.29],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <BackgroundGradient />

      <TwinklingStars
        starBlink1={animations.starBlink1}
        starBlink2={animations.starBlink2}
        starBlink3={animations.starBlink3}
        starBlink4={animations.starBlink4}
      />

      <FloatingParticles
        particle1Y={animations.particle1Y}
        particle2Y={animations.particle2Y}
        particle3Y={animations.particle3Y}
        particle4Y={animations.particle4Y}
        particle5Y={animations.particle5Y}
      />

      <Animated.View style={[styles.content, {opacity: animations.fadeAnim}]}>
        <Animated.View
          style={[
            styles.omContainer,
            {
              opacity: animations.omSymbolAnim,
              transform: [
                {translateY: omTranslateY},
                {
                  scale: animations.omSymbolAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.1, 1],
                  }),
                },
                {
                  rotate: animations.omSymbolRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />

        <AnimatedLogo
          logoSource={images.Logo}
          logoOpacity={animations.logoOpacity}
          logoScale={animations.logoScale}
          glowAnim={animations.glowAnim}
          showWaveRings
          waveAnimations={waveAnimations}
        />

        <Animated.View
          style={[
            styles.appNameContainer,
            {
              opacity: animations.textAnim,
              transform: [{translateY: animations.textSlide}],
            },
          ]}>
          <Text style={styles.appName}>Dhwani Astro</Text>
          <View style={styles.taglineContainer}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>Unlock your Destiny</Text>
            <View style={styles.taglineLine} />
          </View>
        </Animated.View>

        <BottomDecoration />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_COLORS.gradientStart,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  omContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 45,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: SPLASH_COLORS.white,
    letterSpacing: 3,
    textShadowColor: SPLASH_COLORS.gold,
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 15,
    marginTop: -30,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  taglineLine: {
    width: 40,
    height: 1.5,
    backgroundColor: SPLASH_COLORS.gold,
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 15,
    color: SPLASH_COLORS.goldLight,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});

export default OnboardingSplash1;
