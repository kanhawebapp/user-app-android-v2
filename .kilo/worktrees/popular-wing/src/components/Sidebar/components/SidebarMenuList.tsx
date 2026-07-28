import React from 'react';
import {ScrollView} from 'react-native';
import {sidebarStyle} from '../sidebarStyle';
import {MenuItem} from './MenuItem';
import type {SidebarMenuItem} from '../types';

interface SidebarMenuListProps {
  menuItems: SidebarMenuItem[];
  onMenuItemPress: (item: SidebarMenuItem) => void;
}

export const SidebarMenuList: React.FC<SidebarMenuListProps> = ({
  menuItems,
  onMenuItemPress,
}) => {
  const handlePress = (item: SidebarMenuItem) => {
    onMenuItemPress(item);
  };

  return (
    <ScrollView
      style={sidebarStyle.menuContainer}
      showsVerticalScrollIndicator={false}>
      {menuItems.map(item => (
        <MenuItem
          key={item.key}
          item={item}
          onPress={() => handlePress(item)}
        />
      ))}
    </ScrollView>
  );
};
