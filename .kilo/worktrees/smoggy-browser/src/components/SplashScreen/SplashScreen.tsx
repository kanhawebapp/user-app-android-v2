
import React from 'react';
import { ClassicSplash, DarkMysticalSplash, ModernSplash,
   OnboardingSplash1, OnboardingSplash2 } from './variants';
import { 
  SplashScreenProps, 
  DEFAULT_TAGLINE 
} from './splashScreenType';

const SplashScreen: React.FC<SplashScreenProps> = ({
  variant = 'classic',
  showTagline = true,
  customTagline,
  onNext,
  onContinue,
  isLastScreen = false,
  showSkip = false,
  onSkip,
  autoNavigateTimeout,
}) => {
  const tagline = customTagline || DEFAULT_TAGLINE;

  switch (variant) {
    case 'onboarding1':
      return (
        <OnboardingSplash1
          onNext={onNext || (() => {})}
          onSkip={onSkip || (() => {})}
          autoNavigateTimeout={autoNavigateTimeout}
        />
      );
    case 'onboarding2':
      return (
        <OnboardingSplash2
          onContinue={onContinue || onNext || (() => {})}
          onSkip={onSkip || (() => {})}
          autoNavigateTimeout={autoNavigateTimeout}
        />
      );
    case 'dark':
      return (
        <DarkMysticalSplash
          showTagline={showTagline}
          tagline={tagline}
          onNext={onNext}
          isLastScreen={isLastScreen}
          showSkip={showSkip}
          onSkip={onSkip}
          autoNavigateTimeout={autoNavigateTimeout}
        />
      );
    case 'modern':
      return (
        <ModernSplash
          showTagline={showTagline}
          tagline={tagline}
          onNext={onNext}
          isLastScreen={isLastScreen}
          showSkip={showSkip}
          onSkip={onSkip}
          autoNavigateTimeout={autoNavigateTimeout}
        />
      );
    case 'classic':
    default:
      return (
        <ClassicSplash
          showTagline={showTagline}
          tagline={tagline}
          onNext={onNext}
          isLastScreen={isLastScreen}
          showSkip={showSkip}
          onSkip={onSkip}
          autoNavigateTimeout={autoNavigateTimeout}
        />
      );
  }
};

export default SplashScreen;

// Named exports for flexible imports
export { 
  SplashScreen, 
  DEFAULT_TAGLINE 
};

// Re-export types from type file
export type { 
  SplashScreenProps,
  SplashScreenVariant,
  BaseSplashProps,
  ClassicSplashProps,
  DarkMysticalSplashProps,
  ModernSplashProps,
} from './splashScreenType';
