/**
 * Animation Configuration Constants
 * Contains predefined animation configs for different transition types
 */

/**
 * Available animation types
 */
export type AnimationType =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'fade'
  | 'zoom'
  | 'none';

/**
 * Animation configuration interface
 */
export interface AnimationConfig {
  animation: string;
  duration: number;
}

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  animation: 'slide_from_right',
  duration: 300,
};

/**
 * Animation presets for different navigation scenarios
 */
export const ANIMATION_PRESETS: Record<AnimationType, AnimationConfig> = {
  // Slide from right (default iOS style)
  slideFromRight: {
    animation: 'slide_from_right',
    duration: 300,
  },

  // Slide from bottom (modal style)
  slideFromBottom: {
    animation: 'slide_from_bottom',
    duration: 350,
  },

  // Fade animation
  fade: {
    animation: 'fade',
    duration: 250,
  },

  // Zoom animation (for modals)
  zoom: {
    animation: 'zoom',
    duration: 300,
  },

  // Slide from left
  slideFromLeft: {
    animation: 'slide_from_left',
    duration: 300,
  },

  // No animation (instant)
  none: {
    animation: 'none',
    duration: 0,
  },
};

/**
 * Screen-specific animation configurations
 * You can customize animations based on screen names
 */
export const SCREEN_ANIMATION_MAP: Record<string, AnimationType> = {
  // Auth screens - slide from bottom for modal-like feel
  Login: 'slideFromBottom',
  Signup: 'slideFromBottom',
  ForgotPasswordScreen: 'slideFromBottom',
  OTPScreen: 'slideFromBottom',

  // Detail screens - slide from right
  ProfileScreen: 'slideFromRight',
  AstrologerProfileScreen: 'slideFromRight',
  ChatScreen: 'slideFromRight',
  CallScreen: 'slideFromRight',
  LiveSessionScreen: 'slideFromRight',
  ProductDetailScreen: 'slideFromRight',
  BlogDetailScreen: 'slideFromRight',

  // Modal-like screens - slide from bottom
  WalletScreen: 'slideFromBottom',
  SettingsScreen: 'slideFromBottom',
  SupportScreen: 'slideFromBottom',

  // Other screens - default to slide from right
  default: 'slideFromRight',
};

/**
 * Get animation config for a specific screen
 * @param screenName - The name of the screen
 * @returns Animation configuration
 */
export const getAnimationConfigForScreen = (
  screenName: string,
): AnimationConfig => {
  const animationType = SCREEN_ANIMATION_MAP[screenName] || 'slideFromRight';
  return ANIMATION_PRESETS[animationType];
};
