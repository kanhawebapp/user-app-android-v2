/**
 * SplashScreen Component Barrel Export
 * Unified export for SplashScreen component and its variants
 */

// Main component export
export {default as SplashScreen} from './SplashScreen';

// Variant components
export {ClassicSplash, DarkMysticalSplash} from './variants';

// Types and constants
export type {
  SplashScreenProps,
  SplashScreenVariant,
  BaseSplashProps,
  ClassicSplashProps,
  DarkMysticalSplashProps,
  ModernSplashProps,
} from './splashScreenType';

export {DEFAULT_TAGLINE} from './splashScreenType';
