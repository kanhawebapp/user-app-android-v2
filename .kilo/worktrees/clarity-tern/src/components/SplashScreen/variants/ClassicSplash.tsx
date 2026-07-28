import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTheme } from '../../../theme';
import { CustomImage } from '../../Image';
import { BackgroundLayout } from '../../BackgroundLayout';
import { Button } from '../../Button';
import { Text } from '../../Text';
import { images, getLogoSource, getBackgroundImageSource } from '../../../assets/images';
import { ClassicSplashProps } from '../splashScreenType';
import { classicSplashStyle, splashScreenBaseStyle } from '../splashScreenStyle';
import { useAppName, useAppTagline, useSplashLogoUrl, useBackgroundImageUrl } from '../../../stores/config.store';
import { DEFAULT_TAGLINE } from '../splashScreenType';


export const ClassicSplash: React.FC<ClassicSplashProps> = ({
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
  
  const { colors, typography: themeTypography } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Get logo source - config URL OR local fallback
  const logoSource = getLogoSource(splashLogoUrl);
  // Get background image source - config URL OR undefined (will use gradient)
  const bgImageSource = getBackgroundImageSource(backgroundImageUrl);

  

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, taglineOpacity, buttonOpacity]);

  // Gradient colors for classic splash
  const gradientColors = [
    colors.primary.main,
    colors.primary.light,
    colors.secondary.main,
  ];

  return (
    <BackgroundLayout
      backgroundColor={colors.primary.main}
      backgroundImage={bgImageSource}
      gradientColors={gradientColors}
      gradientDirection="vertical"
      overlayOpacity={0.3}
      statusBarStyle="light-content"
    >
      {/* Decorative circles - using absolute positioning */}
      <View
        style={[
          classicSplashStyle.classicCircle1,
          { backgroundColor: colors.primary.light },
        ]}
      />
      <View
        style={[
          classicSplashStyle.classicCircle2,
          { backgroundColor: colors.secondary.main },
        ]}
      />
      <View
        style={[
          classicSplashStyle.classicCircle3,
          { backgroundColor: colors.primary.dark },
        ]}
      />

      {/* Content */}
      <Animated.View
        style={[
          splashScreenBaseStyle.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={splashScreenBaseStyle.logoContainer}>
          <CustomImage
            source={logoSource}
            width={150}
            height={100}
            borderRadius={0}
            resizeMode="contain"
            showLoading={false}
          />
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            variant="h1"
            weight="bold"
            color={colors.common.white}
            align="center"
            style={classicSplashStyle.titleShadow}
          >
            {configAppName}
          </Text>
        </Animated.View>

        {showTagline && (
          <Animated.Text
            style={[
              classicSplashStyle.classicTagline,
              {
                color: colors.common.white,
                fontSize: themeTypography.fontSize.md,
                opacity: taglineOpacity,
              },
            ]}
          >
            {displayTagline}
          </Animated.Text>
        )}
      </Animated.View>

      {/* Navigation Buttons */}
      <Animated.View
        style={[splashScreenBaseStyle.buttonContainer, { opacity: buttonOpacity }]}
      >
        {showSkip && (
          <Button
            title={isLastScreen ? 'Get Started' : 'Next'}
            variant="secondary"
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

export default ClassicSplash;

