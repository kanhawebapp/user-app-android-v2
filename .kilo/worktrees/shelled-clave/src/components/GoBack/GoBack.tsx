
// import React from 'react';
// import { View, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../../theme';
// import { Icon } from '../Icon';
// import { Text } from '../Text';
// import type { GoBackProps } from './goBackType';
// import { goBackStyle } from './goBackStyle';

// const GoBack: React.FC<GoBackProps> = ({
//   onBack,
//   title,
//   subtitle,
//   rightComponent,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const insets = useSafeAreaInsets();

//   const showText = !!title;

//   return (
//     <View
//       style={[
//         goBackStyle.container,
//         {
//           paddingTop: insets.top + 1,
//           backgroundColor: colors.background.primary,
//         },
//       ]}>
//       <View style={goBackStyle.topRow}>
//         {onBack && (
//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={onBack}
//             style={goBackStyle.backButton}
//             accessibilityRole="button"
//             accessibilityLabel="Go back"
//             hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//             <Icon
//               name="arrow-back"
//               size={20}
//               color={colors.primary.main}
//               library="Ionicons"
//             />
//           </TouchableOpacity>
//         )}

//         {showText && (
//           <View style={goBackStyle.titleContainer}>
//             <Text style={[goBackStyle.title, { color: colors.text.secondary }]}>
//               {title}
//             </Text>
//             {subtitle && (
//               <Text
//                 style={[goBackStyle.subtitle, { color: colors.text.tertiary }]}>
//                 {subtitle}
//               </Text>
//             )}
//           </View>
//         )}

//         {rightComponent && (
//           <View style={goBackStyle.rightSection}>{rightComponent}</View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default GoBack;


/**
 * GoBack Component
 * Reusable back-navigation header used across the app.
 *
 * Supports:
 *  - back icon (Ionicons arrow-back)
 *  - optional title + subtitle
 *  - optional custom right action/component
 *  - configurable title alignment
 *  - safe-area padding via react-native-safe-area-context
 */

import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Icon} from '../Icon';
import {Text} from '../Text';
import type {GoBackProps} from './goBackType';
import {goBackStyle} from './goBackStyle';

const GoBack: React.FC<GoBackProps> = ({
  onBack,
  title,
  subtitle,
  rightComponent,
  titleAlign = 'center',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const showText = !!title;

  const getTitleContainerStyle = () => {
    switch (titleAlign) {
      case 'left':
        return goBackStyle.titleContainerLeft;

      case 'right':
        return goBackStyle.titleContainerRight;

      case 'center':
      default:
        return goBackStyle.titleContainerCenter;
    }
  };

  const getTextAlign = () => {
    switch (titleAlign) {
      case 'left':
        return 'left';

      case 'right':
        return 'right';

      case 'center':
      default:
        return 'center';
    }
  };

  return (
    <View
      style={[
        goBackStyle.container,
        {
          // paddingTop: insets.top + 1,
          backgroundColor: colors.background.primary,
        },
      ]}>
      <View style={goBackStyle.topRow}>
        {/* Left Section */}
        <View style={goBackStyle.leftSection}>
          {onBack && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={goBackStyle.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon
                name="arrow-back"
                size={20}
                color={colors.primary.main}
                library="Ionicons"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        {showText && (
          <View style={getTitleContainerStyle()}>
            <Text
              style={[
                goBackStyle.title,
                {
                  color: colors.text.secondary,
                  textAlign: getTextAlign(),
                },
              ]}
              numberOfLines={1}>
              {title}
            </Text>

            {subtitle && (
              <Text
                style={[
                  goBackStyle.subtitle,
                  {
                    color: colors.text.tertiary,
                    textAlign: getTextAlign(),
                  },
                ]}
                numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Right Section */}
        <View style={goBackStyle.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

export default GoBack;

