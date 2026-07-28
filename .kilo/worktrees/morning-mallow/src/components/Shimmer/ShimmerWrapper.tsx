/**
 * ShimmerWrapper Component
 * A reusable wrapper that shows shimmer loading or actual content
 * Use this with Suspense or any other loading state management
 */

import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {ShimmerWrapperProps} from './ShimmerWrapper.types';
import {useTheme} from '../../theme';

export const ShimmerWrapper: React.FC<ShimmerWrapperProps> = ({
  isLoading,
  ShimmerComponent,
  children,
  style,
  testID = 'shimmer-wrapper',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {backgroundColor: colors.background.primary},
        style,
      ]}>
      {isLoading ? (
        <View style={styles.shimmerContainer}>{ShimmerComponent}</View>
      ) : (
        <View style={styles.contentContainer}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shimmerContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ShimmerWrapper;
