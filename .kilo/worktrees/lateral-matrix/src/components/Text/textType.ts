
import { ColorValue, TextProps as RNTextProps, TextStyle } from "react-native";
import { TextVariant } from "../../theme";

export type CustomFontWeight = TextStyle['fontWeight'] | 'semibold' | 'medium' | 'regular';

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  fontSize?: number;
  weight?: CustomFontWeight;
  color?: ColorValue;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  align?: TextStyle['textAlign'];
  lineHeight?: number;
  selectable?: boolean;
  testID?: string;
  style?: TextStyle | TextStyle[];
}
