import React from 'react';
import {Animated, View} from 'react-native';
import {Text} from '../../Text';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import {getUserInitials} from '../utils/getUserInitials';
import type {User} from '../../../types/global.types';
import type {UserProfileProps} from '../types';
import {AstroAvatar} from '../../../screens/main/profile/components/AstroAvatar';

export const UserProfileSection: React.FC<UserProfileProps> = ({
  user,
  borderAnim,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const initials = getUserInitials(user.name);

  return (
    <View style={sidebarStyle.userInfo}>
      <View
        style={[
          sidebarStyle.avatarWrapper,
          {borderColor: colors.primary.main},
        ]}>
        <Animated.View
          style={[
            sidebarStyle.avatarBorder,
            {
              borderColor: colors.primary.main,
              transform: [
                {
                  rotate: borderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        {/* <View
          style={[
            sidebarStyle.avatar,
            {backgroundColor: colors.primary.light + '30'},
          ]}>
          {user.profilePic ? (
            <Icon
              name="person"
              size={28}
              color={colors.primary.main}
              library="MaterialIcons"
            />
          ) : (
            <Text
              variant="h6"
              weight="bold"
              style={{color: colors.primary.main}}>
              {initials}
            </Text>
          )}
        </View> */}
        <AstroAvatar user={user} size={60} />
      </View>
      <View style={sidebarStyle.userDetails}>
        <Text
          variant="h4"
          color={colors.primary.main}
          weight="semibold"
          numberOfLines={1}>
          Hi, {user.name}
        </Text>
        <Text variant="caption" style={{color: colors.text.secondary}}>
          {user.countryCode}
          {user.email || user.mobile}
        </Text>
      </View>
    </View>
  );
};
