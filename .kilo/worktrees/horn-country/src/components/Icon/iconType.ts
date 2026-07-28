import {ColorValue, TouchableOpacityProps, ViewStyle} from 'react-native';

export type Icon库 =
  | 'MaterialIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'MaterialCommunityIcons'
  | 'Feather'
  | 'AntDesign';

export interface IconProps extends Omit<TouchableOpacityProps, 'style'> {
  name: string;
  library?: Icon库;
  size?: number;
  color?: ColorValue;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface IconComponentProps {
  name: string;
  size: number;
  color: string | undefined;
  library: Icon库;
}
