import React from 'react';
import {
  View,
  Animated,
  StatusBar,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../../theme';
import {Button} from '../../Button';
import {CustomImage} from '../../Image';
import {
  useSplashAutoNavigateTimeout,
  useSplashLogoUrl,
} from '../../../stores/config.store';
import {getLogoSource} from '../../../assets/images';
import images from '../../../assets/images';
import {SPLASH_LABEL} from '../../../constants/app.constants';
import type {BaseSplashProps} from '../splashScreenType';
import {useSplashAnimations} from './shared';
import {SPLASH_COLORS} from './shared/constants';
import {
  BackgroundGradient,
  TwinklingStars,
  FloatingParticles,
  AnimatedLogo,
  BottomDecoration,
  BenefitCard,
} from './shared/components';

const {height} = Dimensions.get('window');

export const OnboardingSplash2: React.FC<
  BaseSplashProps & {
    onContinue: () => void;
    onSkip: () => void;
  }
> = ({onContinue, onSkip, autoNavigateTimeout}) => {
  const {colors} = useTheme();
  const splashLogoUrl = useSplashLogoUrl();
  const logoSource = getLogoSource(splashLogoUrl);
  const timeout = autoNavigateTimeout ?? useSplashAutoNavigateTimeout() ?? 4000;

  const animations = useSplashAnimations({timeout, onComplete: onContinue});

  const omTranslateY = animations.omStartPos.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.29],
  });

  const benefits = [
    {icon: images.TrustedGuidance, label: SPLASH_LABEL.TRUSTED_GUIDANCE},
    {icon: images.PersonalRemedies, label: SPLASH_LABEL.PERSONAL_REMEDIES},
    {icon: images.Shop, label: SPLASH_LABEL.SHOP_PRODUCTS},
  ];

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
          logoSource={logoSource}
          logoOpacity={animations.logoOpacity}
          logoScale={animations.logoScale}
          glowAnim={animations.glowAnim}
        />

        {/* <Animated.View
          style={[
            styles.headlineContainer,
            {
              opacity: animations.textAnim,
              transform: [{translateY: animations.textSlide}],
            },
          ]}>
          <Text style={styles.headline}>{SPLASH_LABEL.ASTROLOGY_GUIDANCE}</Text>
        </Animated.View> */}

        <BenefitCard
          textAnim={animations.textAnim}
          textSlide={animations.textSlide}
          benefits={benefits}
          iconTintColor={colors.common.white}
        />

        <View style={styles.buttonContainer}>
          <Button title="Continue" onPress={onContinue} />
          <Button
            title="Skip"
            variant="ghost"
            onPress={onSkip}
            textStyle={{color: SPLASH_COLORS.goldLight}}
            style={{marginTop: 20}}
          />
        </View>

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
    paddingHorizontal: 24,
  },
  omContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.06,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headline: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    color: SPLASH_COLORS.white,
    textShadowColor: SPLASH_COLORS.gold,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: '8%',
  },
});

export default OnboardingSplash2;
