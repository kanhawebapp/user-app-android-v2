import React from 'react';
import {View} from 'react-native';
import {Button} from '../../Button';
import {Text} from '../../Text';
import {Icon} from '../../Icon';
import {useTheme} from '../../../theme';
import {sidebarStyle} from '../sidebarStyle';
import type {GuestSectionProps} from '../types';
import {useAuthUser} from '../../../navigation/mainNavigation';

export const GuestSection: React.FC<GuestSectionProps> = ({onLogin}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {handleLogout} = useAuthUser({});

  return (
    <View
      style={[
        sidebarStyle.guestInfo,
        {
          backgroundColor: colors.primary.main + '10',
          borderRadius: 12,
          padding: 16,
        },
      ]}>
      <View
        style={[
          sidebarStyle.guestIconWrapper,
          {backgroundColor: colors.primary.main + '20'},
        ]}>
        <Icon
          name="person"
          size={24}
          color={colors.primary.main}
          library="MaterialIcons"
        />
      </View>
      <Text
        variant="body"
        style={{
          color: colors.text.primary,
          fontWeight: '600',
          marginTop: 8,
        }}>
        Welcome to Dhwani Astro
      </Text>
      <Text
        variant="caption"
        style={{color: colors.text.secondary, marginTop: 4}}>
        Guest User
      </Text>
      <Button
        title="Login"
        variant="primary"
        onPress={handleLogout}
        // onPress={onLogin}
        style={{marginTop: 12, width: '100%'}}
      />
    </View>
  );
};
