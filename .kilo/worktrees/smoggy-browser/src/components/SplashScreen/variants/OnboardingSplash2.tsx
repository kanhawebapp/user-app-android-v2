/**
 * Onboarding Splash Screen 2
 * Shows headline, 3 benefits with icons, and Continue/Skip buttons
 * Auto-navigates after configurable timeout
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../../theme';
import { BackgroundLayout } from '../../BackgroundLayout';
import { Button } from '../../Button';
import { Text } from '../../Text';
import { Icon } from '../../Icon';
import { images, getSplashBackgroundSource } from '../../../assets/images';
import { useOnboardingHeadline, useOnboardingBenefits, useSplashAutoNavigateTimeout, useSplashBackgroundImageUrl2 } from '../../../stores/config.store';
import type { OnboardingBenefit } from '../../../types/config.types';
import type { BaseSplashProps } from '../splashScreenType';

interface OnboardingSplash2Props extends BaseSplashProps {
  onContinue: () => void;
  onSkip: () => void;
}

/**
 * Benefit Item Component
 */
const BenefitItem: React.FC<{
  benefit: OnboardingBenefit;
  index: number;
  fadeAnim: Animated.Value;
}> = ({ benefit, index, fadeAnim }) => {
  const { colors } = useTheme();
  
  return (
    <Animated.View
      style={[
        styles.benefitItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.secondary.main },
        ]}
      >
        <Icon
          name={benefit.icon}
          size={28}
          color={colors.common.white}
          library={benefit.iconLibrary || 'MaterialIcons' || 'Ionicons'}
        />
      </View>
      <View style={styles.benefitContent}>
        <Text
          variant="subtitle"
          weight="semibold"
          color={colors.common.white}
          style={styles.benefitTitle}
        >
          {benefit.title}
        </Text>
        <Text
          variant="body"
          weight="regular"
          color={colors.common.white}
          style={[styles.benefitDescription, { opacity: 0.8 }]}
        >
          {benefit.description}
        </Text>
      </View>
    </Animated.View>
  );
};

/**
 * Second Onboarding Splash Screen
 * Displays headline, benefits, and navigation buttons with auto-navigation
 */
export const OnboardingSplash2: React.FC<OnboardingSplash2Props> = ({
  onContinue,
  onSkip,
  autoNavigateTimeout,
}) => {
  const { colors } = useTheme();
  
  // Get config values
  const headline = useOnboardingHeadline();
  const benefits = useOnboardingBenefits() || [];
  const splashBackgroundImageUrl2 = useSplashBackgroundImageUrl2();
  // Get timeout from config, fallback to prop or default 2000ms
  const configTimeout = useSplashAutoNavigateTimeout();
  const timeout = autoNavigateTimeout ?? configTimeout ?? 2000;
  
  // Get background image source - config URL OR local fallback (splash2.jpeg)
  const backgroundImageSource = getSplashBackgroundSource(splashBackgroundImageUrl2, images.Splash2);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const benefitsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  
  // Auto-navigation timer ref
  const autoNavigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Entry animations with staggered delays
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(headlineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(benefitsOpacity, {
          toValue: 1,
          duration: 400,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Auto-navigate after configured timeout
    autoNavigateTimer.current = setTimeout(() => {
      onContinue();
    }, timeout);
    
    // Cleanup timer on unmount
    return () => {
      if (autoNavigateTimer.current) {
        clearTimeout(autoNavigateTimer.current);
      }
    };
  }, [fadeAnim, headlineOpacity, benefitsOpacity, buttonOpacity, onContinue, timeout]);
  
  // Gradient colors
  const gradientColors = [
    colors.primary.dark || '#1A1A2E',
    colors.primary.main,
    colors.secondary.main,
  ];
  
  return (
    <BackgroundLayout
      backgroundImage={backgroundImageSource}
      backgroundColor={colors.primary.dark || '#1A1A2E'}
      gradientColors={gradientColors}
      gradientDirection="diagonal"
      overlayOpacity={0.3}
      statusBarStyle="light-content"
      useSafeArea={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      
      {/* Main Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          { opacity: fadeAnim },
        ]}
      >
        {/* Headline */}
        <Animated.View style={{ opacity: headlineOpacity }}>
          <Text
            variant="display"
            weight="bold"
            color={colors.common.white}
            align="center"
            style={styles.headline}
          >
            {headline}
          </Text>
        </Animated.View>
        
        {/* Benefits List */}
        <Animated.View style={[styles.benefitsContainer, { opacity: benefitsOpacity }]}>
          {benefits.slice(0, 3).map((benefit, index) => (
            <BenefitItem
              key={index}
              benefit={benefit}
              index={index}
              fadeAnim={benefitsOpacity}
            />
          ))}
        </Animated.View>
      </Animated.View>
      
      {/* Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: buttonOpacity },
        ]}
      >
        <Button
          title="Skip"
          variant="ghost"
          size="large"
          onPress={onSkip}
          textStyle={{ color: colors.common.white }}
          style={styles.skipButton}
        />
        <Button
          title="Continue"
          variant="secondary"
          size="large"
          onPress={onContinue}
          style={styles.continueButton}
        />
      </Animated.View>
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  benefitsContainer: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  skipButton: {
    flex: 1,
    marginRight: 12,
  },
  continueButton: {
    flex: 1,
    marginLeft: 12,
  },
});

export default OnboardingSplash2;

