/**
 * Dark Mystical Splash Screen Component
 * Premium dark theme with starry effect
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '../../../theme';
import { CustomImage } from '../../Image';
import { BackgroundLayout } from '../../BackgroundLayout';
import { Button } from '../../Button';
import { Text } from '../../Text';
import { images, getLogoSource, getBackgroundImageSource } from '../../../assets/images';
import { DarkMysticalSplashProps } from '../splashScreenType';
import { darkMysticalSplashStyle, splashScreenBaseStyle } from '../splashScreenStyle';
import { useAppName, useAppTagline, useSplashLogoUrl, useBackgroundImageUrl } from '../../../stores/config.store';
import { DEFAULT_TAGLINE } from '../splashScreenType';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


export const DarkMysticalSplash: React.FC<DarkMysticalSplashProps> = ({
  showTagline = true,
  tagline,
  onNext,
  isLastScreen = false,
  showSkip = false,
  onSkip,
}) => {
  // Get config values with fallback to defaults
  const configAppName = useAppName();
  const configTagline = useAppTagline();
  const splashLogoUrl = useSplashLogoUrl();
  const backgroundImageUrl = useBackgroundImageUrl();
  
  // Use prop tagline if provided, otherwise use config tagline, otherwise use default
  const displayTagline = tagline || configTagline || DEFAULT_TAGLINE;
  
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Get logo source - config URL OR local fallback
  const logoSource = getLogoSource(splashLogoUrl);
  // Get background image source - config URL OR undefined (will use gradient)
  const bgImageSource = getBackgroundImageSource(backgroundImageUrl);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(starOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, [fadeAnim, glowAnim, starOpacity, buttonOpacity]);

  // Generate stars
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * Dimensions.get('window').width,
    top: Math.random() * SCREEN_HEIGHT * 0.6,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 1000,
  }));

  // Gradient for dark mystical
  const gradientColors = ['#0D0D1A', '#1A1A2E', '#2D2D44'];

  return (
    <BackgroundLayout
      backgroundColor="#0D0D1A"
      backgroundImage={bgImageSource}
      gradientColors={gradientColors}
      gradientDirection="vertical"
      overlayOpacity={0.5}
      statusBarStyle="light-content"
    >
      {/* Stars */}
      {stars.map(star => (
        <Animated.View
          key={star.id}
          style={[
            darkMysticalSplashStyle.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              backgroundColor: colors.common.white,
              opacity: starOpacity,
            },
          ]}
        />
      ))}

      {/* Glowing orb behind logo */}
      <Animated.View
        style={[
          darkMysticalSplashStyle.glowOrb,
          {
            backgroundColor: colors.primary.main,
            opacity: glowAnim,
          },
        ]}
      />

      {/* Content */}
      <Animated.View
        style={[
          splashScreenBaseStyle.contentContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={splashScreenBaseStyle.logoContainerGlow}>
          <CustomImage
            source={logoSource}
            width={150}
            height={100}
            borderRadius={0}
            resizeMode="contain"
            showLoading={false}
          />
        </View>

        <Text
          variant="h1"
          weight="bold"
          color={colors.common.white}
          align="center"
          style={darkMysticalSplashStyle.darkTitleShadow}
        >
          {configAppName}
        </Text>

        {showTagline && (
          <Text
            variant="body"
            color={colors.primary.light}
            align="center"
            style={darkMysticalSplashStyle.darkTagline}
          >
            {displayTagline}
          </Text>
        )}

        {/* Decorative moon/star element */}
        <View style={darkMysticalSplashStyle.moonElement}>
          <View style={[darkMysticalSplashStyle.moon, { borderColor: colors.primary.light }]} />
        </View>
      </Animated.View>

      {/* Navigation Buttons */}
      <Animated.View
        style={[splashScreenBaseStyle.buttonContainerBottom, { opacity: buttonOpacity }]}
      >
        {showSkip && (
          <Button
            title={isLastScreen ? 'Get Started' : 'Next'}
            variant="primary"
            size="large"
            onPress={onNext}
            style={splashScreenBaseStyle.nextButton}
          />
        )}

        <Button
          title="Skip"
          variant="ghost"
          onPress={onSkip}
          textStyle={{ color: colors.common.white }}
        />
      </Animated.View>
    </BackgroundLayout>
  );
};

export default DarkMysticalSplash;

