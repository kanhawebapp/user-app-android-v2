/**
 * ShimmerWrapper Types
 * TypeScript interfaces for the ShimmerWrapper component
 */

import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';

export interface ShimmerWrapperProps {
  /**
   * Whether content is loading
   */
  isLoading: boolean;
  
  /**
   * The shimmer/skeleton component to display when loading
   */
  ShimmerComponent?: React.ReactNode;
  
  /**
   * The actual content to display when not loading
   */
  children: React.ReactNode;
  
  /**
   * Optional container style
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export interface ShimmerItemProps {
  /**
   * Width of the shimmer element
   */
  width?: number | string;
  
  /**
   * Height of the shimmer element
   */
  height?: number;
  
  /**
   * Border radius of the shimmer element
   */
  borderRadius?: number;
  
  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

