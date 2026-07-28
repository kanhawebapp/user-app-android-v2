import React from 'react';
import { StyleSheet, View } from 'react-native';
import { typography, useTheme } from '../../../../theme';
import { InputBox } from '../../../../components/InputBox';
import { Text } from '../../../../components/Text';
import { AUTH_LABELS } from '../../../../constants/app.constants';
import { signupFormSectionStyles } from '../signupStyles';
import type { SignupFormSectionProps } from '../signupType';

export const SignupFormSection: React.FC<SignupFormSectionProps> = ({
  name,
  onNameChange,
  nameError,
  isNameValid,
  email,
  onEmailChange,
  emailError,
  isEmailValid,
  phone,
  onPhoneChange,
  phoneError,
  isPhoneValid,
  password,
  onPasswordChange,
  passwordError,
  isPasswordValid,
  confirmPassword,
  onConfirmPasswordChange,
  confirmPasswordError,
  isConfirmPasswordValid,
  testID = 'signup-form-section',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const styles = signupFormSectionStyles(colors);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.inputGroup}>
        <Text
          variant="label"
          color={colors.text.secondary}
          style={styles.label}
        >
          {AUTH_LABELS.NAME_LABEL}
        </Text>
        <InputBox
          value={name}
          onChangeText={onNameChange}
          placeholder={AUTH_LABELS.NAME_PLACEHOLDER}
          keyboardType="default"
          autoCapitalize="words"
          size="large"
          error={nameError || undefined}
          leftIcon={
            <Text variant="body" color={colors.text.tertiary}>
              👤
            </Text>
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text
          variant="label"
          color={colors.text.secondary}
          style={styles.label}
        >
          {AUTH_LABELS.EMAIL_LABEL}
        </Text>
        <InputBox
          value={email}
          onChangeText={onEmailChange}
          placeholder={AUTH_LABELS.EMAIL_PLACEHOLDER}
          keyboardType="email-address"
          autoCapitalize="none"
          size="large"
          error={emailError || undefined}
          leftIcon={
            <Text variant="body" color={colors.text.tertiary}>
              ✉️
            </Text>
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text
          variant="label"
          color={colors.text.secondary}
          style={styles.label}
        >
          {AUTH_LABELS.PHONE_LABEL}
        </Text>
        <InputBox
          value={phone}
          onChangeText={onPhoneChange}
          placeholder={AUTH_LABELS.PHONE_PLACEHOLDER}
          keyboardType="phone-pad"
          maxLength={10}
          size="large"
          error={phoneError || undefined}
          leftIcon={
            <Text variant="body" color={colors.text.tertiary}>
              {AUTH_LABELS.PHONE_COUNTRY_CODE}
            </Text>
          }
        />
    
      </View>

      <View style={styles.inputGroup}>
        <Text
          variant="label"
          color={colors.text.secondary}
          style={styles.label}
        >
          {AUTH_LABELS.PASSWORD_LABEL}
        </Text>
        <InputBox
          value={password}
          onChangeText={onPasswordChange}
          placeholder={AUTH_LABELS.PASSWORD_PLACEHOLDER}
          secureTextEntry
          size="large"
          error={passwordError || undefined}
          leftIcon={
            <Text variant="body" color={colors.text.tertiary}>
              🔒
            </Text>
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text
          variant="label"
          color={colors.text.secondary}
          style={styles.label}
        >
          {AUTH_LABELS.CONFIRM_PASSWORD_LABEL}
        </Text>
        <InputBox
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          placeholder={AUTH_LABELS.CONFIRM_PASSWORD_PLACEHOLDER}
          secureTextEntry
          size="large"
          error={confirmPasswordError || undefined}
          leftIcon={
            <Text variant="body" color={colors.text.tertiary}>
              🔐
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default SignupFormSection;
