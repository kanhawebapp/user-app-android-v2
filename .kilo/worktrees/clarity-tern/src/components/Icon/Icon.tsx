/**
 * Icon Component
 * Reusable icon component with vector icons support
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme, typography } from '../../theme';
import { IconComponentProps, IconProps, Icon库 } from './iconType';
import { SkeletonLoader } from '../SkeletonLoader';
import { iconStyle } from './iconStyle';

const ICON_LIBRARIES: Record<Icon库, any> = {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
};

const DEFAULT_ICON_LIBRARY: Icon库 = 'MaterialIcons';


const IconComponent: React.FC<IconComponentProps> = ({
  name,
  size,
  color,
  library,
}) => {
  const Icon = ICON_LIBRARIES[library];
  return <Icon name={name} size={size} color={color} />;
};

export const Icon: React.FC<IconProps> = ({
  name,
  library = DEFAULT_ICON_LIBRARY,
  size = 24,
  color,
  style,
  onPress,
  disabled = false,
  testID = 'icon-component',
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();
  const styles = iconStyle(theme);

  const iconColor = useMemo((): string | undefined => {
    if (color) return color as string;
    if (disabled) return theme.colors.text.disabled;
    return theme.colors.text.primary;
  }, [color, disabled, theme.colors.text.disabled, theme.colors.text.primary]);

  const containerStyle: ViewStyle[] = [
    styles.container,
    { width: size, height: size },
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || name}
        accessibilityState={{ disabled }}
        activeOpacity={0.7}
        {...props}
      >
        <IconComponent
          name={name}
          size={size}
          color={iconColor}
          library={library}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID={testID}
      style={containerStyle}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || name}
      activeOpacity={1}
      disabled
    >
      <IconComponent
        name={name}
        size={size}
        color={iconColor}
        library={library}
      />
    </TouchableOpacity>
  );
};

export const IconLoading: React.FC<{
  size?: number;
  color?: string;
  style?: ViewStyle;
}> = ({ size = 24, color, style }) => {
  const theme = useTheme();
  return (
    <SkeletonLoader
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor={theme.colors.border.light}
      shimmerColor={color || theme.colors.primary.main}
      style={style}
      testID="icon-loading-skeleton"
    />
  );
};

export default Icon;

