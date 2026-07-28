// import React from 'react';
// import {Text as RNText, StyleSheet, TextStyle} from 'react-native';
// import {useTheme, typography} from '../../theme';
// import {TextProps, CustomFontWeight} from './textType';

// /**
//  * Map weight to Inter font family (IMPORTANT for React Native)
//  */
// const getFontFamily = (weight?: CustomFontWeight): string => {
//   switch (weight) {
//     case 'medium':
//       return 'Inter-Medium';
//     case 'semibold':
//       return 'Inter-SemiBold';
//     case 'regular':
//     default:
//       return 'Inter-Regular';
//   }
// };

// export const Text: React.FC<TextProps> = ({
//   children,
//   variant = 'body',
//   fontSize,
//   weight = 'regular',
//   color,
//   numberOfLines,
//   ellipsizeMode = 'tail',
//   align,
//   lineHeight,
//   selectable = false,
//   style,
//   testID = 'text-component',
//   ...props
// }) => {
//   const theme = useTheme();

//   const variantStyle = typography.variants[variant] || typography.variants.body;

//   const textStyle: TextStyle = {
//     // ✅ Correct: weight handled via fontFamily
//     fontFamily: getFontFamily(weight),

//     // Variant styles
//     ...variantStyle,

//     // Props overrides
//     ...(fontSize && {fontSize}),
//     ...(color ? {color} : {color: theme.colors.text.primary}),
//     ...(align && {textAlign: align}),
//     ...(lineHeight && {lineHeight}),

//     // Final override (highest priority)
//     ...(Array.isArray(style) ? StyleSheet.flatten(style) : style),
//   };

//   return (
//     <RNText
//       testID={testID}
//       style={textStyle}
//       numberOfLines={numberOfLines}
//       ellipsizeMode={ellipsizeMode}
//       selectable={selectable}
//       allowFontScaling={false}
//       {...props}>
//       {children}
//     </RNText>
//   );
// };

// export default Text;


import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useTheme, typography } from '../../theme';
import { TextProps, CustomFontWeight } from './textType';

/**
 * Map weight to Inter font family
 */
const getFontFamily = (weight?: CustomFontWeight): string => {
  switch (weight) {
    case 'medium':
      return 'Inter-Medium';
    case 'semibold':
      return 'Inter-SemiBold';
    case 'regular':
    default:
      return 'Inter-Regular';
  }
};

/**
 * Responsive Font Size
 * Base Design Width = 375 (iPhone 11 / Figma Standard)
 */
const { width } = Dimensions.get('window');

const scaleFont = (size: number) => {
  const scale = width / 375;

  // Limit scaling so fonts don't become too big or too small
  const newSize = size * Math.min(scale, 1.08);

  return PixelRatio.roundToNearestPixel(newSize);
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  fontSize,
  weight = 'regular',
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

  const variantStyle =
    typography.variants[variant] || typography.variants.body;

  const finalFontSize = scaleFont(
    fontSize ?? (variantStyle.fontSize as number),
  );

  const finalLineHeight = lineHeight
    ? scaleFont(lineHeight)
    : variantStyle.lineHeight
    ? scaleFont(variantStyle.lineHeight as number)
    : undefined;

  const textStyle: TextStyle = {
    fontFamily: getFontFamily(weight),

    ...variantStyle,

    fontSize: finalFontSize,

    lineHeight: finalLineHeight,

    color: color || theme.colors.text.primary,

    ...(align && {
      textAlign: align,
    }),

    ...(Array.isArray(style)
      ? StyleSheet.flatten(style)
      : style),
  };

  return (
    <RNText
      testID={testID}
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}>
      {children}
    </RNText>
  );
};

export default Text;
