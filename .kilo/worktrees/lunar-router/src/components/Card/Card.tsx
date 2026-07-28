// /**
//  * Card Component - Container with shadow and border
//  */

// import React from 'react';
// import {View, ViewStyle, TouchableOpacity} from 'react-native';
// import {useTheme} from '../../theme';
// import {CardProps} from './cardType';
// import {cardStyles} from './cardStyle';

// export const Card: React.FC<CardProps> = ({
//   children,
//   variant = 'elevated',
//   style,
//   onPress,
//   disabled = false,
// }) => {
//   const {colors, typography} = useTheme();
//   const styles = cardStyles;

//   const getVariantStyle = (): ViewStyle => {
//     switch (variant) {
//       case 'elevated':
//         return {
//           backgroundColor: colors.common.white,
//           shadowColor: '#000',
//           shadowOffset: {width: 0, height: 2},
//           shadowOpacity: 0.1,
//           shadowRadius: 4,
//           elevation: 0.5,
//         };
//       case 'outlined':
//         return {
//           backgroundColor: colors.background.primary,
//           borderWidth: typography.borderWidth.thin,
//           borderColor: colors.border.light,
//         };
//       case 'filled':
//         return {
//           backgroundColor: colors.background.secondary,
//         };
//       default:
//         return {};
//     }
//   };

//   const cardStyle = [
//     styles.card,
//     {
//       borderRadius: typography.borderRadius.md,
//       padding: typography.padding.xl,
//       marginVertical: typography.margin.md,
//     },
//     getVariantStyle(),
//     disabled && styles.disabled,
//     style,
//   ];

//   if (onPress) {
//     return (
//       <TouchableOpacity
//         style={cardStyle}
//         onPress={onPress}
//         disabled={disabled}
//         activeOpacity={0.7}>
//         {children}
//       </TouchableOpacity>
//     );
//   }

//   return <View style={cardStyle}>{children}</View>;
// };

// export default Card;

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
  const {colors} = useTheme();
  const styles = cardStyles;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.common.white,

          // ✅ FIGMA SHADOW MATCH
          // shadowColor: '#000',
          // shadowOffset: {width: 0, height: 4},
          // shadowOpacity: 0.04, // #0000000A ≈ 4%
          // shadowRadius: 16,
          // elevation: 0.3,

          // ✨ premium shadow
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: {width: 0, height: 6},
          elevation: 0.3,

          // subtle border
          borderWidth: 0.2,
          borderColor: 'rgba(0,0,0,0.04)',
        };

      case 'outlined':
        return {
          backgroundColor: colors.common.white,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.08)',
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
      borderRadius: 16, // ✅ exact figma
      padding: 16, // balanced spacing
      width: '100%', // responsive instead of fixed 342
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
        activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export default Card;
