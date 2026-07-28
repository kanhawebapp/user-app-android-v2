/**
 * Text Component
 * Custom typography component with global style integration
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {TextProps, CustomFontWeight} from './textType';

/**
 * Converts custom font weight names to React Native compatible values
 */
const normalizeFontWeight = (
  weight: CustomFontWeight,
): TextStyle['fontWeight'] => {
  switch (weight) {
    case 'semibold':
      return '600';
    case 'medium':
      return '500';
    case 'regular':
      return '400';
    default:
      return weight as TextStyle['fontWeight'];
  }
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  fontSize,
  weight,
  color,
  numberOfLines,
  ellipsizeMode = 'tail',
  align,
  lineHeight,
  selectable = false,
  style,
  testID = 'text-component',
  ...props
}) => {
  const theme = useTheme();

  const variantStyle = typography.variants[variant] || typography.variants.body;

  const normalizedWeight = weight ? normalizeFontWeight(weight) : undefined;

  const textStyle: TextStyle = {
    ...variantStyle,
    ...(fontSize && {fontSize}),
    ...(normalizedWeight && {fontWeight: normalizedWeight}),
    ...(color && {color}),
    ...(align && {textAlign: align}),
    ...(lineHeight && {lineHeight}),
    ...(Array.isArray(style) ? StyleSheet.flatten(style) : style),
  };

  return (
    <RNText
      testID={testID}
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      allowFontScaling={false}
      {...props}>
      {children}
    </RNText>
  );
};

export default Text;
