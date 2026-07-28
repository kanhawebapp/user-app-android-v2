/**
 * Onboarding Splash Screen 1
 * Shows logo, app name, and tagline with Next/Skip buttons
 * Auto-navigates after configurable timeout
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, StatusBar, Platform } from 'react-native';
import { useTheme } from '../../../theme';
import { CustomImage } from '../../Image';
import { BackgroundLayout } from '../../BackgroundLayout';
import { Button } from '../../Button';
import { Text } from '../../Text';
import { images, getLogoSource, getSplashBackgroundSource } from '../../../assets/images';
import { useAppName, useOnboardingTagline, useSplashLogoUrl, useSplashAutoNavigateTimeout, useSplashBackgroundImageUrl1 } from '../../../stores/config.store';
import type { BaseSplashProps } from '../splashScreenType';

interface OnboardingSplash1Props extends BaseSplashProps {
  onNext: () => void;
  onSkip: () => void;
}

/**
 * First Onboarding Splash Screen
 * Displays logo, app name, and tagline with auto-navigation
 */
export const OnboardingSplash1: React.FC<OnboardingSplash1Props> = ({
  onNext,
  onSkip,
  autoNavigateTimeout,
}) => {
  const { colors } = useTheme();
  
  // Get config values
  const appName = useAppName();
  const tagline = useOnboardingTagline();
  const splashLogoUrl = useSplashLogoUrl();
  const splashBackgroundImageUrl1 = useSplashBackgroundImageUrl1();
  // Get timeout from config, fallback to prop or default 2000ms
  const configTimeout = useSplashAutoNavigateTimeout();
  const timeout = autoNavigateTimeout ?? configTimeout ?? 2000;
  
  // Get logo source - config URL OR local fallback
  const logoSource = getLogoSource(splashLogoUrl);
  
  // Get background image source - config URL OR local fallback (splash1.webp)
  const backgroundImageSource = getSplashBackgroundSource(splashBackgroundImageUrl1, images.Splash1);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  
  // Auto-navigation timer ref
  const autoNavigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto-navigate after configured timeout
    autoNavigateTimer.current = setTimeout(() => {
      onNext();
    }, timeout);
    
    // Cleanup timer on unmount
    return () => {
      if (autoNavigateTimer.current) {
        clearTimeout(autoNavigateTimer.current);
      }
    };
  }, [fadeAnim, slideAnim, scaleAnim, buttonOpacity, onNext, timeout]);
  
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
      
      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <CustomImage
            source={logoSource}
            width={240}
            height={140}
            borderRadius={0}
            resizeMode="contain"
            showLoading={false}
          />
        </Animated.View>
        
        {/* App Name */}
        <Text
          variant="display"
          weight="bold"
          color={colors.common.white}
          align="center"
          style={styles.appName}
        >
          {appName}
        </Text>
        
        {/* Tagline */}
        <Text
          variant="body"
          weight="regular"
          color={colors.common.white}
          align="center"
          style={[styles.tagline, { opacity: 0.9 }]}
        >
          {tagline}
        </Text>
        
        {/* Decorative line */}
        <View style={styles.lineContainer}>
          <View
            style={[
              styles.line,
              { backgroundColor: colors.secondary.main },
            ]}
          />
        </View>
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
          title="Next"
          variant="secondary"
          size="large"
          onPress={onNext}
          style={styles.nextButton}
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
    paddingHorizontal: 32,
  },
  logoContainer: {
    // marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  lineContainer: {
    marginTop: 32,
    width: 60,
    height: 3,
  },
  line: {
    width: '100%',
    height: 3,
    borderRadius: 2,
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
  nextButton: {
    flex: 1,
    marginLeft: 12,
  },
});

export default OnboardingSplash1;

