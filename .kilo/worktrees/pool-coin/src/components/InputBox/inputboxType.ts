import { KeyboardType, TextInputProps, TextStyle, ViewStyle } from "react-native";
export type InputBoxSize = 'small' | 'medium' | 'large';

export interface InputBoxProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  size?: InputBoxSize;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  showClearButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  enableFloatingLabel?: boolean;
}
