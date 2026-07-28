import React, {useEffect, useState, Suspense, lazy} from 'react';
import {View, StatusBar, StyleSheet, ActivityIndicator} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, typography, useTheme} from '../../theme';
import {useAuthStore, useAppStore} from '../../stores';
import {loggingService} from '../../services/logging';
import {NetworkStatus} from '../NetworkStatus';
import {SplashScreen, SplashScreenVariant} from '../SplashScreen';
import {useToast} from '../../context/ToastContext';
import {MainNavigator} from '../../screens/main';
import SkeletonLoader from '../SkeletonLoader';
import {QueueBubble} from '../QueueBubble';
import {setNavigator} from '../../services/navigation/NavigationService';

// Lazy load auth and legal screens (NOT splash screen - keep splash screen as-is)
// const LoginScreen = lazy(() =>
//   import('../../screens/auth/LoginScreen').then(module => ({
//     default: module.default,
//   })),
// );
// const SignupScreen = lazy(() =>
//   import('../../screens/auth/SignupScreen').then(module => ({
//     default: module.default,
//   })),
// );
const PrivacyPolicyScreen = lazy(() =>
  import('../../screens/legal/PrivacyPolicyScreen').then(module => ({
    default: module.default,
  })),
);
const TermsOfServiceScreen = lazy(() =>
  import('../../screens/legal/TermsOfServiceScreen').then(module => ({
    default: module.default,
  })),
);
const AstrologerListScreen = lazy(() =>
  import('../../screens/main/recomandedAstrologer/AstrologerListScreen').then(
    module => ({
      default: module.default,
    }),
  ),
);

// Loading fallback component for lazy-loaded screens
const LoadingFallback: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary.main} />
  </View>
);

// Import animation configurations
import {getAnimationConfigForScreen} from '../../navigation/AnimatedNavigator/animatedNavigator.constants';
import LoginScreen from '../../screens/auth/LoginScreen';
import SignupScreen from '../../screens/auth/SignupScreen';

const CallScreen = lazy(() =>
  import('../../screens/main/call').then(module => ({
    default: module.CallScreen,
  })),
);

// Create stack navigator for animated transitions
const Stack = createNativeStackNavigator();

// Splash screen variants for onboarding
const ONBOARDING_VARIANTS: SplashScreenVariant[] = [
  'onboarding1',
  'onboarding2',
];

// Screen names for navigation
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Terms: undefined;
  Privacy: undefined;
  Main: undefined;
  Call: {
    callId: string;
    participant: {
      id: string;
      name: string;
      image?: string;
    };
    isIncoming?: boolean;
  };
};

const AppContent: React.FC = () => {
  const {colors, mode} = useTheme();
  const {isInitializing, isAuthenticated} = useAuthStore();
  const {
    setSplashComplete,
    setAppReady,
    currentSplashIndex,
    setCurrentSplashIndex,
    onboardingCompleted,
    setOnboardingCompleted,
    isLoggedIn,
    setIsLoggedIn,
  } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Toast hook for showing welcome message
  const {showSuccess} = useToast();

  // Get splash variant based on current index
  const getSplashVariant = (): SplashScreenVariant => {
    return ONBOARDING_VARIANTS[currentSplashIndex] || 'onboarding1';
  };

  // Handle next button press
  const handleNext = () => {
    if (currentSplashIndex < ONBOARDING_VARIANTS.length - 1) {
      setCurrentSplashIndex(currentSplashIndex + 1);
    } else {
      setOnboardingCompleted(true);
      setShowSplash(false);
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    setOnboardingCompleted(true);
    setShowSplash(false);
  };

  // Handle skip button press
  const handleSkip = () => {
    setOnboardingCompleted(true);
    setShowSplash(false);
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        loggingService.initialize();

        const authState = useAuthStore.getState();

        await authState.initialize();

        const updatedAuthState = useAuthStore.getState();
        loggingService.info('[App] Auth initialization complete', {
          isAuthenticated: updatedAuthState.isAuthenticated,
          hasUser: !!updatedAuthState.user,
          hasAccessToken: !!updatedAuthState.accessToken,
        });

        if (updatedAuthState.isAuthenticated) {
          setIsLoggedIn(true);
          loggingService.info(
            '[App] User is authenticated, navigating to home',
          );
        } else {
          loggingService.info(
            '[App] User is not authenticated, navigating to login',
          );
        }

        setHasInitialized(true);

        if (onboardingCompleted) {
          setTimeout(() => {
            setShowSplash(false);
            setSplashComplete(true);
            setAppReady(true);
          }, 500);
        }
      } catch (error) {
        loggingService.error('[App] Initialization failed', {error});
        setShowSplash(false);
        setSplashComplete(true);
        setAppReady(true);
      }
    };

    initApp();
  }, []);

  // Show onboarding splash screens
  if (showSplash && !onboardingCompleted) {
    const currentVariant = getSplashVariant();
    const isLastScreen = currentSplashIndex === ONBOARDING_VARIANTS.length - 1;

    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SplashScreen
          variant={currentVariant}
          showTagline={true}
          onNext={handleNext}
          onContinue={handleContinue}
          isLastScreen={isLastScreen}
          showSkip={!isLastScreen}
          onSkip={handleSkip}
        />
      </>
    );
  }

  // Show main app with animated navigation after onboarding
  if (onboardingCompleted && hasInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background.primary}
        />
        <NetworkStatus />
        <AnimatedAppContent
          isLoggedIn={isLoggedIn}
          onLoginSuccess={() => {
            showSuccess('Welcome to Dhwani Astro!');
          }}
          onLogout={() => {
            setIsLoggedIn(false);
          }}
        />
      </View>
    );
  }

  // Show loading while initializing
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <NetworkStatus />
      <SkeletonLoader />
    </View>
  );
};

/**
 * AnimatedAppContent - Wraps the main app content with animated navigation
 * Handles all screen transitions with smooth animations
 */
interface AnimatedAppContentProps {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

const AnimatedAppContent: React.FC<AnimatedAppContentProps> = ({
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const navigationRef = React.useRef(null);
  const [showAstrologerList, setShowAstrologerList] = useState(false);

  React.useEffect(() => {
    if (navigationRef.current) {
      setNavigator(navigationRef.current);
    }
  }, []);

  // Get screen options based on the current screen name
  const getScreenOptions = (screenName: string) => {
    const config = getAnimationConfigForScreen(screenName);
    return {
      animation: config.animation as any,
      animationDuration: config.duration,
      gestureEnabled: true,
      headerShown: false,
    };
  };

  if (isLoggedIn) {
    if (showAstrologerList) {
      return (
        <NavigationContainer ref={navigationRef}>
          <Suspense fallback={<LoadingFallback />}>
            <AstrologerListScreen onBack={() => setShowAstrologerList(false)} />
          </Suspense>
        </NavigationContainer>
      );
    }
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Main"
            children={() => (
              <MainNavigator
                onLogout={onLogout}
                onNavigateToLogin={() => {}}
                onNavigateToSignup={() => {}}
                onNavigateToAstrologerList={() => setShowAstrologerList(true)}
                onNavigateToEditProfile={() => {}}
              />
            )}
          />
          <Stack.Screen name="Call" component={CallScreen} />
        </Stack.Navigator>
        <QueueBubble />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" options={getScreenOptions('Login')}>
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <LoginScreenWithNavigation onLoginSuccess={onLoginSuccess} />
            </Suspense>
          )}
        </Stack.Screen>

        <Stack.Screen name="Signup" options={getScreenOptions('Signup')}>
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <SignupScreenWithNavigation onSignupSuccess={onLoginSuccess} />
            </Suspense>
          )}
        </Stack.Screen>

        <Stack.Screen name="Terms" options={getScreenOptions('Terms')}>
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <TermsOfServiceScreenWithNavigation />
            </Suspense>
          )}
        </Stack.Screen>

        <Stack.Screen name="Privacy" options={getScreenOptions('Privacy')}>
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <PrivacyPolicyScreenWithNavigation />
            </Suspense>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Login screen wrapper with navigation
 */
interface LoginScreenWrapperProps {
  onLoginSuccess: () => void;
}

const LoginScreenWithNavigation: React.FC<LoginScreenWrapperProps> = ({
  onLoginSuccess,
}) => {
  const navigation = useNavigation<any>();

  return (
    <LoginScreen
      onTermsPress={() => navigation.navigate('Terms')}
      onPrivacyPress={() => navigation.navigate('Privacy')}
      onLoginSuccess={() => {
        navigation.navigate('Main');
        onLoginSuccess();
      }}
      onSignupPress={() => navigation.navigate('Signup')}
    />
  );
};

/**
 * Signup screen wrapper with navigation
 */
interface SignupScreenWrapperProps {
  onSignupSuccess: () => void;
}

const SignupScreenWithNavigation: React.FC<SignupScreenWrapperProps> = ({
  onSignupSuccess,
}) => {
  const navigation = useNavigation<any>();

  return (
    <SignupScreen
      onLoginPress={() => navigation.navigate('Login')}
      onTermsPress={() => navigation.navigate('Terms')}
      onPrivacyPress={() => navigation.navigate('Privacy')}
      onSignupSuccess={() => {
        navigation.navigate('Main');
        onSignupSuccess();
      }}
    />
  );
};

/**
 * Terms of Service screen wrapper with navigation
 */
const TermsOfServiceScreenWithNavigation: React.FC = () => {
  const navigation = useNavigation<any>();

  return <TermsOfServiceScreen onBack={() => navigation.goBack()} />;
};

/**
 * Privacy Policy screen wrapper with navigation
 */
const PrivacyPolicyScreenWithNavigation: React.FC = () => {
  const navigation = useNavigation<any>();

  return <PrivacyPolicyScreen onBack={() => navigation.goBack()} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    flex: 1,
    justifyContent: typography.align.center,
    alignItems: typography.align.center,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AppContent;
