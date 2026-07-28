/**
 * AnimatedNavigator Component
 * A clean, modular navigation component with smooth animated transitions
 * 
 * Features:
 * - Pre-configured animation presets
 * - Custom animation configurations
 * - Gesture-enabled navigation
 * - Type-safe props
 */

import React, {useCallback, useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {
  DEFAULT_ANIMATION_CONFIG,
  ANIMATION_PRESETS,
  getAnimationConfigForScreen,
  type AnimationConfig,
  type AnimationType,
} from './animatedNavigator.constants';

// Create the stack navigator
const Stack = createNativeStackNavigator();

/**
 * Props for AnimatedNavigator component
 */
export interface AnimatedNavigatorProps {
  children: React.ReactNode;
  initialRouteName?: string;
  animationConfig?: AnimationConfig;
  gestureEnabled?: boolean;
  screenOptions?: NativeStackNavigationOptions;
}

/**
 * Converts animation type string to React Navigation animation
 */
const getAnimation = (animationType: AnimationType): any => {
  const animationMap: Record<AnimationType, any> = {
    slideFromRight: 'slide_from_right',
    slideFromLeft: 'slide_from_left',
    slideFromBottom: 'slide_from_bottom',
    fade: 'fade_from_tooltip',
    zoom: 'default',
    none: 'none',
  };
  return animationMap[animationType] || 'slide_from_right';
};

/**
 * Creates screen options with animation
 */
const createScreenOptions = (
  config: AnimationConfig,
  gestureEnabled: boolean = true,
): NativeStackNavigationOptions => {
  const animationType = (Object.entries(ANIMATION_PRESETS) as [AnimationType, AnimationConfig][]).find(
    ([, value]) =>
      value.animation === config.animation &&
      value.duration === config.duration,
  )?.[0] || 'slideFromRight';

  return {
    animation: getAnimation(animationType),
    animationDuration: config.duration,
    gestureEnabled,
    headerShown: false,
  };
};

/**
 * AnimatedNavigator - Main component for animated navigation
 * 
 * @example
 * ```tsx
 * import AnimatedNavigator from './navigation/AnimatedNavigator';
 * 
 * const AppNavigator = () => (
 *   <AnimatedNavigator
 *     initialRouteName="Home"
 *     animationType="slideFromRight"
 *   >
 *     <Stack.Screen name="Home" component={HomeScreen} />
 *     <Stack.Screen name="Details" component={DetailsScreen} />
 *   </AnimatedNavigator>
 * );
 * ```
 */
const AnimatedNavigator: React.FC<AnimatedNavigatorProps> = ({
  children,
  initialRouteName,
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  gestureEnabled = true,
  screenOptions,
}) => {
  // Create default screen options with animation
  const defaultScreenOptions = useMemo(
    () => createScreenOptions(animationConfig, gestureEnabled),
    [animationConfig, gestureEnabled],
  );

  // Merge default options with custom options
  const mergedOptions = useMemo(
    () => ({
      ...defaultScreenOptions,
      ...screenOptions,
    }),
    [defaultScreenOptions, screenOptions],
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={mergedOptions}>
      {children}
    </Stack.Navigator>
  );
};

/**
 * Navigation helper return type
 */
export interface AnimatedNavigationHelper {
  navigate: (screen: string, params?: object) => void;
  goBack: () => void;
  replace: (screen: string, params?: object) => void;
  reset: (state: any) => void;
  push: (screen: string, params?: object) => void;
  popToTop: () => void;
  pop: (count?: number) => void;
}

/**
 * Custom hook for animated navigation with helper methods
 * 
 * @example
 * ```tsx
 * const {navigate, goBack, replace, push, popToTop} = useAnimatedNavigation();
 * 
 * // Navigate with animation
 * navigate('Profile', {userId: '123'});
 * 
 * // Go back
 * goBack();
 * 
 * // Replace current screen
 * replace('Login');
 * 
 * // Push new screen
 * push('Chat', {astrologerId: '456'});
 * 
 * // Pop to top
 * popToTop();
 * ```
 */
export const useAnimatedNavigation = (): AnimatedNavigationHelper => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  // Get screen-specific animation config
  const screenName = route.name;
  const _screenConfig = getAnimationConfigForScreen(screenName);

  const navigate = useCallback(
    (screen: string, params?: object) => {
      navigation.navigate(screen, params);
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const replace = useCallback(
    (screen: string, params?: object) => {
      navigation.replace(screen, params);
    },
    [navigation],
  );

  const reset = useCallback(
    (state: any) => {
      navigation.reset(state);
    },
    [navigation],
  );

  const push = useCallback(
    (screen: string, params?: object) => {
      navigation.push(screen, params);
    },
    [navigation],
  );

  const popToTop = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const pop = useCallback(
    (count: number = 1) => {
      navigation.pop(count);
    },
    [navigation],
  );

  return {
    navigate,
    goBack,
    replace,
    reset,
    push,
    popToTop,
    pop,
  };
};

/**
 * Screen wrapper component for individual screen animation settings
 * 
 * @example
 * ```tsx
 * <Stack.Screen name="Profile">
 *   {(props) => (
 *     <AnimatedScreen {...props} animationType="slideFromBottom" />
 *   )}
 * </Stack.Screen>
 * ```
 */
export interface AnimatedScreenProps {
  children: React.ReactNode;
  animationType?: AnimationType;
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({
  children,
  animationType = 'slideFromRight',
}) => {
  const navigation = useNavigation();
  const config = ANIMATION_PRESETS[animationType];

  React.useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        animation: getAnimation(animationType),
        animationDuration: config.duration,
      });
    }
  }, [navigation, animationType, config.duration]);

  return <>{children}</>;
};

export default AnimatedNavigator;

