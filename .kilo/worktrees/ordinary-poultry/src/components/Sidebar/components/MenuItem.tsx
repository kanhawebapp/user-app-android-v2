import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '../../Text';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import type {SidebarMenuItem} from '../types';

interface MenuItemProps {
  item: SidebarMenuItem;
  onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({item, onPress}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      style={[sidebarStyle.menuItem, {borderBottomColor: colors.border.light}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View
        style={[
          sidebarStyle.menuIconWrapper,
          {backgroundColor: colors.primary.main + '15'},
        ]}>
        <Icon
          name={item.icon}
          size={18}
          color={colors.primary.main}
          library={item.iconLibrary || 'MaterialIcons'}
        />
      </View>
      <Text
        variant="body"
        style={[sidebarStyle.menuLabel, {color: colors.text.primary}]}>
        {item.label}
      </Text>
      {item.badge ? (
        <View
          style={[sidebarStyle.badge, {backgroundColor: colors.error.main}]}>
          <Text
            variant="captionSmall"
            weight="bold"
            style={{color: colors.common.white}}>
            {item.badge}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
