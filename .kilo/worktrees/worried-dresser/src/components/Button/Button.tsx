/**
 * Button Component
 * Custom button with variants, loading state, and accessibility
 */

import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../Text';
import { ButtonProps } from './buttonType';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';


const getButtonSize = (size: ButtonSize) => {
  const sizes = {
    small: { height: 36, paddingHorizontal: 12, fontSize: 14 },
    medium: { height: 48, paddingHorizontal: 16, fontSize: 16 },
    large: { height: 56, paddingHorizontal: 24, fontSize: 18 },
  };
  return sizes[size];
};

const getButtonColors = (
  variant: ButtonVariant,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>
) => {
  const { colors } = theme;
  
  if (disabled) {
    return {
      backgroundColor: colors.border.light,
      textColor: colors.text.disabled,
      borderColor: 'transparent',
    };
  }

  const variants = {
    primary: {
      backgroundColor: colors.primary.main,
      textColor: colors.primary.contrastText,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      textColor: colors.secondary.contrastText,
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: colors.primary.main,
      borderColor: 'transparent',
    },
  };

  return variants[variant];
};


export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  textStyle,
  style,
  testID = 'button-component',
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();
  const dimensions = getButtonSize(size);
  const colors = getButtonColors(variant, disabled, theme);

  const containerStyle = [
    styles.container,
    {
      height: dimensions.height,
      paddingHorizontal: dimensions.paddingHorizontal,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: variant === 'outline' ? 1 : 0,
    },
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    {
      fontSize: dimensions.fontSize,
      color: colors.textColor,
    },
    textStyle,
  ];

  const accessibilityState = {
    busy: loading,
    disabled: disabled || loading,
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={accessibilityState}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.textColor}
          testID="button-loading-indicator"
        />
      ) : (
        <>
          {leftIcon && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}
          <Text
            style={buttonTextStyle}
            weight="medium"
            testID="button-title"
          >
            {title}
          </Text>
          {rightIcon && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const View: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => <>{children}</>;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;

