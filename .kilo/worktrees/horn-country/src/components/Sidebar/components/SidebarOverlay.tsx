import React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';

interface SidebarOverlayProps {
  opacityAnim: Animated.Value;
  onPress: () => void;
}

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({
  opacityAnim,
  onPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Animated.View
      style={[
        sidebarStyle.overlay,
        {
          opacity: opacityAnim,
          backgroundColor: colors.overlay,
        },
      ]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
    </Animated.View>
  );
};
