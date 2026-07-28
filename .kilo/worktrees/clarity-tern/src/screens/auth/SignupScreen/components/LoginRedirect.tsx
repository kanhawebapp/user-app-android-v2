import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { AUTH_LABELS } from '../../../../constants/app.constants';
import { loginRedirectStyles } from '../signupStyles';
import type { LoginRedirectProps } from '../signupType';

export const LoginRedirect: React.FC<LoginRedirectProps> = ({
  onPress,
  testID = 'login-redirect',
}) => { 
  const theme = useTheme();
  const colors = theme.colors;

  // Get styles
  const styles = loginRedirectStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      <Text
        variant="body"
        color={colors.text.secondary}
        align="center"
      >
        {AUTH_LABELS.ALREADY_HAVE_ACCOUNT}{' '}
        <Text
          variant="body"
          color={colors.primary.main}
          weight="semibold"
          style={styles.link}
          onPress={onPress}
        >
          {AUTH_LABELS.LOGIN_LINK}
        </Text>
      </Text>
    </View>
  );
};

export default LoginRedirect;

