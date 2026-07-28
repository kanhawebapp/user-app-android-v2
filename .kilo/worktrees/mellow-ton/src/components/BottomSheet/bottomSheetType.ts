import { DimensionValue, ViewStyle } from "react-native";

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: DimensionValue;
  backgroundColor?: string;
  showBackdrop?: boolean;
  dismissOnBackdropPress?: boolean;
  swipeToClose?: boolean;
  swipeThreshold?: number;
  cornerRadius?: number;
  style?: ViewStyle;
  showHandle?: boolean;
  title?: string;
  testID?: string;
  accessibilityLabel?: string;
  pointerEvents?: 'auto' | 'box-none' | 'box-only' | 'none';
}
