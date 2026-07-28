import React from 'react';
import {Text} from '../../Text';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {DEFAULT_APP_CONFIG} from '../constants';
import {useAppVersion} from '../../../services/api/appVersion/useAppVersion';

export const VersionInfo: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const {data, loading} = useAppVersion();

  const APP_VERSION = data?.latestVersion || DEFAULT_APP_CONFIG.version;

  return (
    <Text
      variant="captionSmall"
      style={[sidebarStyle.versionText, {color: colors.text.tertiary}]}>
      Version {APP_VERSION}
    </Text>
  );
};
