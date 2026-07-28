import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../../Text';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({onPress}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      style={[sidebarStyle.logoutButton, {borderTopColor: colors.border.light}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Icon
        name="logout"
        size={22}
        color={colors.error.main}
        library="MaterialIcons"
      />
      <Text
        variant="body"
        weight="medium"
        style={{color: colors.error.main, marginLeft: 12}}>
        Logout
      </Text>
    </TouchableOpacity>
  );
};
