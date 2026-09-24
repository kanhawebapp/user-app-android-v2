import React from 'react';
import {Text} from '../../Text';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {version as APP_VERSION} from '../../../../package.json';

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
