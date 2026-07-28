import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {SOCIAL_MEDIA} from '../constants';

export const SocialIcons: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={sidebarStyle.socialMediaContainer}>
      {SOCIAL_MEDIA.map(social => (
        <TouchableOpacity
          key={social.key}
          style={[
            sidebarStyle.socialIcon,
            {backgroundColor: colors.background.secondary},
          ]}
          onPress={() => {}} // TODO: Add social handlers
          activeOpacity={0.7}>
          <Icon
            name={social.icon}
            size={18}
            color={colors.icon.primary}
            library={social.library}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
