import React, {useMemo} from 'react';
import {StyleSheet, ViewStyle, StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {useTheme} from '../../theme';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  shimmerColor?: string;
  backgroundColor?: string;
  duration?: number;
  visible?: boolean;
  testID?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
  shimmerColor,
  backgroundColor,
  duration = 1200,
  visible = false,
  testID = 'skeleton-loader',
}) => {
  const theme = useTheme();

  const bgColor = backgroundColor ?? theme.colors.border.light;
  const highlightColor = shimmerColor ?? theme.colors.background.primary;

  const shimmerColors = useMemo(
    () => [bgColor, highlightColor, bgColor],
    [bgColor, highlightColor],
  );

  return (
    <ShimmerPlaceholder
      // testID={testID}
      visible={visible}
      shimmerColors={shimmerColors}
      duration={duration}
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: bgColor,
        },
        style,
      ]}
      location={[0.3, 0.5, 0.7]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default SkeletonLoader;
