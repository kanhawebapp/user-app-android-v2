import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {SocialIcons} from './SocialIcons';
import {VersionInfo} from './VersionInfo';
import {LogoutButton} from './LogoutButton';
import type {SidebarProps} from '../types';

interface SidebarFooterProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isAuthenticated,
  onLogout,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[sidebarStyle.footer, {borderTopColor: colors.border.light}]}>
      <SocialIcons />
      <VersionInfo />
      {
        isAuthenticated && <LogoutButton onPress={onLogout} />
      }
    </View>
  );
};
