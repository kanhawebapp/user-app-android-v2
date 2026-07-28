/**
 * SplashScreen Type Definitions
 * Type definitions for SplashScreen component and its variants
 */

import {ViewStyle, TextStyle} from 'react-native';

/**
 * Splash Screen Variants
 */
export type SplashScreenVariant =
  | 'classic'
  | 'dark'
  | 'modern'
  | 'onboarding1'
  | 'onboarding2';

/**
 * Main Splash Screen Props
 */
export interface SplashScreenProps {
  variant?: SplashScreenVariant;
  showTagline?: boolean;
  customTagline?: string;
  onNext?: () => void;
  onContinue?: () => void;
  isLastScreen?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  autoNavigateTimeout?: number;
}

/**
 * Default tagline constant
 */
export const DEFAULT_TAGLINE = 'Your Cosmic Guide to Life';

/**
 * Base props for all splash variants
 */
export interface BaseSplashProps {
  showTagline?: boolean;
  tagline?: string;
  onNext?: () => void;
  isLastScreen?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  autoNavigateTimeout?: number;
}

/**
 * Classic Splash Props
 */
export interface ClassicSplashProps extends BaseSplashProps {}

/**
 * Dark Mystical Splash Props
 */
export interface DarkMysticalSplashProps extends BaseSplashProps {}

/**
 * Modern Splash Props
 */
export interface ModernSplashProps extends BaseSplashProps {}

/**
 * Style types for splash components
 */
export interface SplashScreenStyles {
  // Base container styles
  contentContainer: ViewStyle;
  logoContainer: ViewStyle;
  logoContainerGlow: ViewStyle;

  // Classic splash styles
  classicCircle1: ViewStyle;
  classicCircle2: ViewStyle;
  classicCircle3: ViewStyle;
  classicTagline: TextStyle;
  titleShadow: TextStyle;

  // Dark mystical splash styles
  star: ViewStyle;
  glowOrb: ViewStyle;
  darkTagline: TextStyle;
  darkTitleShadow: TextStyle;
  moonElement: ViewStyle;
  moon: ViewStyle;

  // Modern splash styles
  modernOrb1: ViewStyle;
  modernOrb2: ViewStyle;
  modernOrb3: ViewStyle;
  modernLogoFrame: ViewStyle;
  modernTitle: TextStyle;
  modernTagline: TextStyle;
  modernLine: ViewStyle;
  modernLineInner: ViewStyle;

  // Button styles
  buttonContainer: ViewStyle;
  buttonContainerBottom: ViewStyle;
  nextButton: ViewStyle;
}
