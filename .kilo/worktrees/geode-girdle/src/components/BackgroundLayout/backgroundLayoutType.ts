import {ImageSourcePropType, ViewStyle, StyleProp} from 'react-native';
import {ReactNode} from 'react';

export interface BackgroundLayoutProps {
  children: ReactNode;

  backgroundImage?: ImageSourcePropType;
  backgroundColor?: string;
  overlayColor?: string;
  blurRadius?: number;
  gradientColors?: string[];
  gradientDirection?: 'vertical' | 'horizontal' | 'diagonal';
  overlayOpacity?: number;
  useSafeArea?: boolean;
  statusBarVisible?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface BackgroundLayoutDefaultProps {
  backgroundColor: string;
  overlayColor: string;
  overlayOpacity: number;
  useSafeArea: boolean;
  statusBarVisible: boolean;
  gradientDirection: 'vertical' | 'horizontal' | 'diagonal';
}
export type GradientDirection = 'vertical' | 'horizontal' | 'diagonal';
