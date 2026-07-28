// /**
//  * InputBox Component
//  * Custom text input with validation, error display, and accessibility
//  * Features floating label animation on focus
//  */

// import React, {useState, useRef, useEffect} from 'react';
// import {
//   TextInput,
//   View,
//   TouchableWithoutFeedback,
//   Animated,
//   TextInputProps,
//   Easing,
// } from 'react-native';
// import {useTheme, typography} from '../../theme';
// import {Text} from '../Text';
// import {InputBoxProps, InputBoxSize} from './inputboxType';
// import {inputStyle} from './inputStyle';
// export type {KeyboardType} from 'react-native';
// export type {InputBoxSize} from './inputboxType';

// const getInputSize = (
//   size: InputBoxSize,
//   theme: ReturnType<typeof useTheme>,
// ) => {
//   const sizes = {
//     small: {
//       height: 36,
//       fontSize: typography.fontSize.sm,
//       padding: typography.padding.xs,
//     },
//     medium: {
//       height: 44,
//       fontSize: typography.fontSize.md,
//       padding: typography.padding.sm,
//     },
//     large: {
//       height: 52,
//       fontSize: typography.fontSize.lg,
//       padding: typography.padding.md,
//     },
//   };
//   return sizes[size];
// };

// export const InputBox: React.FC<InputBoxProps> = ({
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   size = 'medium',
//   error,
//   label,
//   helperText,
//   required = false,
//   containerStyle,
//   inputStyle: customInputStyle,
//   showClearButton = false,
//   leftIcon,
//   rightIcon,
//   testID = 'inputbox-component',
//   accessibilityLabel,
//   enableFloatingLabel = true,
//   ...props
// }) => {
//   const theme = useTheme();
//   const styles = inputStyle(theme);
//   const dimensions = getInputSize(size, theme);
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef<TextInput>(null);

//   // Animated value for floating label - use native driver for smooth animation
//   const labelAnimation = useRef(
//     new Animated.Value(value && value.length > 0 ? 1 : 0),
//   ).current;

//   // Animated value for border color transition
//   const borderAnimation = useRef(new Animated.Value(0)).current;

//   // Determine if label should be floating
//   const isLabelFloating = isFocused || (value && value.length > 0);

//   // Use placeholder as floating label text if no explicit label provided
//   const floatingLabelText = label || placeholder;

//   // Animate label position based on focus/value state - smooth animation without vibration
//   useEffect(() => {
//     Animated.timing(labelAnimation, {
//       toValue: isLabelFloating ? 1 : 0,
//       duration: 200,
//       easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design standard easing
//       useNativeDriver: false, // Cannot use native driver for fontSize animation
//     }).start();
//   }, [isLabelFloating]);

//   // Animate border color on focus
//   useEffect(() => {
//     Animated.timing(borderAnimation, {
//       toValue: isFocused ? 1 : 0,
//       duration: 200,
//       useNativeDriver: false, // Cannot use native driver for color
//     }).start();
//   }, [isFocused]);

//   const hasError = Boolean(error);
//   const shouldShowClear = showClearButton && value.length > 0;

//   // Animated border color based on focus state
//   const animatedBorderColor = borderAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [
//       hasError ? theme.colors.border.error : theme.colors.border.main,
//       hasError ? theme.colors.border.error : theme.colors.border.focus,
//     ],
//   });

//   const containerBorderColor = hasError
//     ? theme.colors.border.error
//     : isFocused
//     ? theme.colors.border.focus
//     : theme.colors.border.main;

//   const containerBackgroundColor =
//     props.editable === false
//       ? theme.colors.background.tertiary
//       : theme.colors.background.primary;

//   // Interpolate label position - optimized for smooth animation
//   const labelFontSize = labelAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [typography.fontSize.md, typography.fontSize.xs],
//   });

//   const labelColor = labelAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [
//       theme.colors.text.tertiary,
//       isFocused ? theme.colors.border.focus : theme.colors.text.secondary,
//     ],
//   });

//   // Calculate label position with proper offset
//   const labelTranslateY = labelAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -22],
//   });

//   // Determine if we should show the native placeholder
//   // Only show native placeholder when:
//   // 1. Floating label is disabled, OR
//   // 2. There's no floating label text to display
//   const showNativePlaceholder = !enableFloatingLabel || !floatingLabelText;

//   // When floating label is shown, we use empty string for native placeholder to avoid duplication
//   const nativePlaceholder = showNativePlaceholder ? placeholder : '';

//   const handleClear = () => {
//     onChangeText('');
//     inputRef.current?.focus();
//   };

//   const handleFocus = (e: any) => {
//     setIsFocused(true);
//     props.onFocus?.(e);
//   };

//   const handleBlur = (e: any) => {
//     setIsFocused(false);
//     props.onBlur?.(e);
//   };

//   // Don't show floating label if no text provided and no placeholder
//   const shouldShowFloatingLabel = enableFloatingLabel && floatingLabelText;

//   return (
//     <View style={[styles.container, containerStyle]} testID={testID}>
//       {shouldShowFloatingLabel && (
//         <View style={styles.labelContainer} pointerEvents="none">
//           <Animated.Text
//             style={[
//               styles.floatingLabel,
//               {
//                 transform: [
//                   {
//                     translateY: labelTranslateY,
//                   },
//                 ],
//                 fontSize: labelFontSize,
//                 color: hasError ? theme.colors.error.main : labelColor,
//                 backgroundColor: isLabelFloating
//                   ? theme.colors.background.primary
//                   : 'transparent',
//                 paddingHorizontal: isLabelFloating ? 4 : 0,
//               },
//             ]}
//             testID="inputbox-label">
//             {floatingLabelText}
//             {required && isLabelFloating && ' *'}
//           </Animated.Text>
//         </View>
//       )}

//       <Animated.View
//         style={[
//           styles.inputContainer,
//           {
//             height: dimensions.height,
//             borderColor: animatedBorderColor,
//             backgroundColor: containerBackgroundColor,
//             borderRadius: typography.borderRadius.sm,
//           },
//           hasError && styles.errorContainer,
//         ]}
//         testID="inputbox-wrapper">
//         {leftIcon && (
//           <View style={styles.iconLeft} testID="inputbox-left-icon">
//             {leftIcon}
//           </View>
//         )}

//         <TextInput
//           ref={inputRef}
//           style={[
//             styles.input,
//             {
//               fontSize: dimensions.fontSize,
//               paddingHorizontal: dimensions.padding,
//               color: theme.colors.text.primary,
//               textAlignVertical: 'center', // FIX
//               paddingVertical: 0, // FIX
//             },
//             // leftIcon && {paddingLeft: typography.padding.md},
//             customInputStyle,
//           ]}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={nativePlaceholder}
//           placeholderTextColor={theme.colors.text.tertiary}
//           secureTextEntry={secureTextEntry}
//           keyboardType={keyboardType}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           editable={props.editable !== false}
//           accessibilityLabel={accessibilityLabel || label || placeholder}
//           accessibilityHint={helperText}
//           cursorColor={theme.colors.primary.main}
//           selectionColor={theme.colors.primary.light}
//           {...props}
//         />

//         {shouldShowClear && (
//           <TouchableWithoutFeedback
//             onPress={handleClear}
//             testID="inputbox-clear-button"
//             accessibilityLabel="Clear text">
//             <View style={styles.iconRight}>
//               <Text color={theme.colors.text.tertiary} style={styles.clearText}>
//                 ✕
//               </Text>
//             </View>
//           </TouchableWithoutFeedback>
//         )}

//         {rightIcon && !shouldShowClear && (
//           <View style={styles.iconRight} testID="inputbox-right-icon">
//             {rightIcon}
//           </View>
//         )}
//       </Animated.View>

//       {(error || helperText) && (
//         <Text
//           variant="caption"
//           color={
//             hasError ? theme.colors.error.main : theme.colors.text.secondary
//           }
//           style={styles.helperText}
//           testID="inputbox-helper">
//           {error || helperText}
//         </Text>
//       )}
//     </View>
//   );
// };

// export default InputBox;

/**
 * InputBox Component
 * Fixed cursor + placeholder alignment
 */

import React, {useRef} from 'react';
import {TextInput, View, TouchableWithoutFeedback} from 'react-native';

import {useTheme, typography} from '../../theme';
import {Text} from '../Text';
import {InputBoxProps, InputBoxSize} from './inputboxType';
import {inputStyle} from './inputStyle';

const getInputSize = (size: InputBoxSize) => {
  const sizes = {
    small: {
      height: 36,
      fontSize: typography.fontSize.sm,
    },
    medium: {
      height: 44,
      fontSize: typography.fontSize.md,
    },
    large: {
      height: 52,
      fontSize: typography.fontSize.lg,
    },
  };

  return sizes[size];
};

export const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  size = 'medium',
  error,
  helperText,
  showClearButton = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle: customInputStyle,
  ...props
}) => {
  const theme = useTheme();
  const styles = inputStyle(theme);
  const dimensions = getInputSize(size);

  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  const shouldShowClear = showClearButton && value?.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          {
            height: dimensions.height,
            borderColor: error
              ? theme.colors.error.main
              : theme.colors.border.main,
          },
        ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              fontSize: dimensions.fontSize,
              color: theme.colors.text.primary,
            
            },
            customInputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          cursorColor={theme.colors.primary.main}
          selectionColor={theme.colors.primary.light}
          {...props}
        />

        {shouldShowClear && (
          <TouchableWithoutFeedback onPress={handleClear}>
            <View style={styles.iconRight}>
              <Text color={theme.colors.text.tertiary}>✕</Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {rightIcon && !shouldShowClear && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? theme.colors.error.main : theme.colors.text.secondary}
          style={styles.helperText}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default InputBox;
