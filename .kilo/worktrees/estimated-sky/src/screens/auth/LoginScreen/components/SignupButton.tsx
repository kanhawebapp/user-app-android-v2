import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, typography } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { AUTH_LABELS } from '../../../../constants/app.constants';
import { SignupButtonProps } from '../loginType';
import { signupButtonStyles } from '../loginStyle';

export const SignupButton: React.FC<SignupButtonProps> = ({
  onPress,
  disabled = false,
  testID = 'signup-button',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = signupButtonStyles(colors)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Don't have an account? Sign up"
      accessibilityState={{ disabled }}
    >
      <Text variant="body" color={colors.text.secondary} weight="medium">
        {AUTH_LABELS.DONT_HAVE_ACCOUNT}{' '}
        <Text
          variant="body"
          color={colors.primary.main}
          style={styles.link}
          weight="bold"
        >
          {AUTH_LABELS.SIGNUP_LINK}
        </Text>
      </Text>
    </TouchableOpacity>
  );
};


export default SignupButton;
