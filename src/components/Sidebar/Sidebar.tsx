import React from 'react';
import {Animated, Dimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {sidebarStyle} from './sidebarStyle';
import {useSidebarAnimation} from './hooks/useSidebarAnimation';
import {SidebarOverlay} from './components/SidebarOverlay';
import {SidebarHeader} from './components/SidebarHeader';
import {SidebarMenuList} from './components/SidebarMenuList';
import {SidebarFooter} from './components/SidebarFooter';
import type {SidebarProps, SidebarMenuItem} from './types';
import {DEFAULT_MENU_ITEMS} from './constants';

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  user,
  isAuthenticated = false,
  menuItems = DEFAULT_MENU_ITEMS,
  onMenuItemPress,
  onLogout,
  onLogin,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {slideAnim, overlayAnim, rotateAnim, profileBorderAnim, shouldRender} =
    useSidebarAnimation(visible);

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    onMenuItemPress?.(item);
    onClose();
  };

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  const handleOverlayPress = () => {
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <View
      style={sidebarStyle.container}
      pointerEvents={visible ? 'box-none' : 'none'}>
      {/* Overlay */}
      <SidebarOverlay opacityAnim={overlayAnim} onPress={handleOverlayPress} />

      {/* Sidebar */}
      <Animated.View
        style={[
          sidebarStyle.sidebar,
          {
            transform: [{translateX: slideAnim}],
            backgroundColor: colors.background.primary,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 20,
          },
        ]}>
        <SidebarHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onClose={onClose}
          onLogin={onLogin ?? (() => {})}
          rotateAnim={rotateAnim}
          profileBorderAnim={profileBorderAnim}
        />

        <SidebarMenuList
          menuItems={menuItems}
          onMenuItemPress={handleMenuItemPress}
        />

        {/* Footer */}
        <SidebarFooter
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </Animated.View>
    </View>
  );
};

export default Sidebar;
