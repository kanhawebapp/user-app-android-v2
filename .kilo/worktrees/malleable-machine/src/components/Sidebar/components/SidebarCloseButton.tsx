import React from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';

interface SidebarCloseButtonProps {
  rotateAnim: Animated.Value;
  onPress: () => void;
}

export const SidebarCloseButton: React.FC<SidebarCloseButtonProps> = ({
  rotateAnim,
  onPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Animated.View
      style={[
        sidebarStyle.closeButtonWrapper,
        {
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-90deg', '0deg'],
              }),
            },
          ],
        },
      ]}>
      <TouchableOpacity
        style={[
          sidebarStyle.closeButton,
          {backgroundColor: colors.background.secondary},
        ]}
        onPress={onPress}
        activeOpacity={0.7}>
        <Icon
          name="close"
          size={20}
          color={colors.icon.primary}
          library="MaterialIcons"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
