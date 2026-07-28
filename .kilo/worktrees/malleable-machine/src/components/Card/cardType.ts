import { ViewStyle } from "react-native";

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: any;
  onPress?: () => void;
  disabled?: boolean;
}