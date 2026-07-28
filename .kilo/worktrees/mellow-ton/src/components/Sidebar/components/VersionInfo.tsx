import React from 'react';
import {Text} from '../../Text';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {DEFAULT_APP_CONFIG} from '../constants';

const APP_VERSION = DEFAULT_APP_CONFIG.version || '1.0.0';

export const VersionInfo: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Text
      variant="captionSmall"
      style={[sidebarStyle.versionText, {color: colors.text.tertiary}]}>
      Version {APP_VERSION}
    </Text>
  );
};
