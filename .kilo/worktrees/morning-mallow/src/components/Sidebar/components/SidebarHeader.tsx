import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {SidebarCloseButton} from './SidebarCloseButton';
import {UserProfileSection} from './UserProfileSection';
import {GuestSection} from './GuestSection';
import type {SidebarProps} from '../types';
import {User} from '../../../types/global.types';
import type {Animated} from 'react-native';

interface SidebarHeaderProps {
  isAuthenticated: boolean;
  user?: User | null;
  onClose: () => void;
  onLogin: () => void;
  rotateAnim: Animated.Value;
  profileBorderAnim: Animated.Value;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isAuthenticated,
  user,
  onClose,
  onLogin,
  rotateAnim,
  profileBorderAnim,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        sidebarStyle.sidebarHeader,
        {borderBottomColor: colors.border.light},
      ]}>
      <SidebarCloseButton rotateAnim={rotateAnim} onPress={onClose} />
      {isAuthenticated && user ? (
        <UserProfileSection user={user} borderAnim={profileBorderAnim} />
      ) : (
        <GuestSection onLogin={onLogin} />
      )}
    </View>
  );
};
