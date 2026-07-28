import { ColorValue, DimensionValue, ImageSourcePropType, ImageStyle } from "react-native";

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

export interface ImageProps extends Omit<any, 'source' | 'style'> {
  source: ImageSourcePropType;
  size?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  resizeMode?: ImageResizeMode;
  placeholder?: ImageSourcePropType;
  showLoading?: boolean;
  loadingColor?: ColorValue;
  style?: ImageStyle;
  onPress?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  testID?: string;
  accessibilityLabel?: string;
}