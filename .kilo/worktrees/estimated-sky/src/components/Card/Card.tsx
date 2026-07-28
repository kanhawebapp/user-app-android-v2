/**
 * Card Component - Container with shadow and border
 */

import React from 'react';
import {View, ViewStyle, TouchableOpacity} from 'react-native';
import {useTheme} from '../../theme';
import {CardProps} from './cardType';
import {cardStyles} from './cardStyle';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  onPress,
  disabled = false,
}) => {
  const {colors, typography} = useTheme();
  const styles = cardStyles;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background.primary,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          backgroundColor: colors.background.primary,
          borderWidth: typography.borderWidth.thin,
          borderColor: colors.border.light,
        };
      case 'filled':
        return {
          backgroundColor: colors.background.secondary,
        };
      default:
        return {};
    }
  };

  const cardStyle = [
    styles.card,
    {
      borderRadius: typography.borderRadius.md,
      padding: typography.padding.xl,
      marginVertical: typography.margin.md,
    },
    getVariantStyle(),
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export default Card;
