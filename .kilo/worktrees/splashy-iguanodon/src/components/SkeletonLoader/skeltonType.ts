import {ViewStyle} from 'react-native';

export interface SkeletonLoaderProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  shimmerColor?: string;
  backgroundColor?: string;
  testID?: string;
  duration?: number;
}
