/**
 * SplashScreen Styles
 * Shared styles for SplashScreen component
 */

import {StyleSheet, ViewStyle, TextStyle, Dimensions} from 'react-native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * Base shared styles for all splash variants
 */
export const splashScreenBaseStyle = StyleSheet.create({
  // Base container styles
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  logoContainerGlow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle,

  // Button styles - shared across variants
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  } as ViewStyle,
  buttonContainerBottom: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  } as ViewStyle,
  nextButton: {
    width: '80%',
    height: 50,
  } as ViewStyle,
});

/**
 * Classic Splash Styles
 */
export const classicSplashStyle = StyleSheet.create({
  classicCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
    opacity: 0.3,
  } as ViewStyle,
  classicCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: 50,
    left: -30,
    opacity: 0.2,
  } as ViewStyle,
  classicCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: SCREEN_HEIGHT * 0.3,
    left: 30,
    opacity: 0.15,
  } as ViewStyle,
  classicTagline: {
    textAlign: 'center',
    marginTop: 8,
  } as TextStyle,
  titleShadow: {
    marginTop: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  } as TextStyle,
});

/**
 * Dark Mystical Splash Styles
 */
export const darkMysticalSplashStyle = StyleSheet.create({
  star: {
    position: 'absolute',
  } as ViewStyle,
  glowOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: SCREEN_HEIGHT * 0.15,
  } as ViewStyle,
  darkTagline: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  } as TextStyle,
  darkTitleShadow: {
    marginTop: 24,
    textShadowColor: 'rgba(187, 134, 252, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  } as TextStyle,
  moonElement: {
    marginTop: 30,
  } as ViewStyle,
  moon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    opacity: 0.5,
  } as ViewStyle,
});

/**
 * Modern Splash Styles
 */
export const modernSplashStyle = StyleSheet.create({
  modernOrb1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    top: -100,
    left: -100,
    opacity: 0.6,
  } as ViewStyle,
  modernOrb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -80,
    right: -80,
    opacity: 0.5,
  } as ViewStyle,
  modernOrb3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: SCREEN_HEIGHT * 0.2,
    right: 40,
    opacity: 0.3,
  } as ViewStyle,
  modernLogoFrame: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  modernTitle: {
    marginTop: 32,
    letterSpacing: 1,
  } as TextStyle,
  modernTagline: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  } as TextStyle,
  modernLine: {
    marginTop: 24,
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  } as ViewStyle,
  modernLineInner: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  } as ViewStyle,
});

/**
 * Combined export for convenience
 */
export const splashScreenStyle = {
  ...splashScreenBaseStyle,
  ...classicSplashStyle,
  ...darkMysticalSplashStyle,
  ...modernSplashStyle,
};

export default splashScreenStyle;
