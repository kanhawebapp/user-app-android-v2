/**
 * AnimatedNavigator Module
 * A clean, modular navigation component with smooth animated transitions
 *
 * Exports:
 * - AnimatedNavigator: Main navigator component
 * - useAnimatedNavigation: Hook for navigation helpers
 * - AnimatedScreen: Screen wrapper for individual animations
 * - ANIMATION_PRESETS: Pre-defined animation configurations
 * - getAnimationConfigForScreen: Get animation config for specific screen
 * - AnimationType: Type definitions for animation types
 */

import React from 'react';
import type {
  AnimationType,
  AnimationConfig,
} from './animatedNavigator.constants';

export {
  default as AnimatedNavigator,
  useAnimatedNavigation,
  AnimatedScreen,
} from './AnimatedNavigator';
export {
  ANIMATION_PRESETS,
  DEFAULT_ANIMATION_CONFIG,
  getAnimationConfigForScreen,
  SCREEN_ANIMATION_MAP,
} from './animatedNavigator.constants';
export type {AnimationType, AnimationConfig};

export interface AnimatedScreenProps {
  children: React.ReactNode;
  animationType?: AnimationType;
}
