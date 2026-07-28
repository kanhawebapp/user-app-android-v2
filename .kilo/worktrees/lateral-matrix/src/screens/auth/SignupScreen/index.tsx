import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme, colors, typography } from '../../../theme';
import { BackgroundLayout } from '../../../components/BackgroundLayout';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Text } from '../../../components/Text';
import { getBackgroundImageSource } from '../../../assets/images';
import { useBackgroundImageUrl } from '../../../stores/config.store';
import { useSignupValidation, useSignup } from './hooks';
import {
  LogoSection,
  SignupFormSection,
  SocialLoginSection,
  TermsAndConditions,
  LoginRedirect,
} from './components';
import { signupScreenStyles } from './signupStyles';
import type { SignupScreenProps } from './signupType';
import { AUTH_LABELS } from '../../../constants/app.constants';

const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignupSuccess,
  onLoginPress,
  onTermsPress,
  onPrivacyPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const styles = signupScreenStyles(colors);
  
  const backgroundImageUrl = useBackgroundImageUrl();
  const bgImageSource = getBackgroundImageSource(backgroundImageUrl);

  const {
    name,
    handleNameChange,
    nameError,
    email,
    handleEmailChange,
    emailError,
    phone,
    handlePhoneChange,
    phoneError,
    password,
    handlePasswordChange,
    passwordError,
    confirmPassword,
    handleConfirmPasswordChange,
    confirmPasswordError,
    isValid,
  } = useSignupValidation();

  // Signup hook
  const {
    isSigningUp,
    signupError,
    isGoogleLoading,
    isFacebookLoading,
    signup,
    signupWithGoogle,
    signupWithFacebook,
    clearError,
  } = useSignup({
    name,
    email,
    phone,
    password,
    onSignupSuccess,
    onSignupError: (error) => {
      console.log('Signup error:', error);
    },
  });

  // Handle Signup button press
  const handleSignup = useCallback(async () => {
    await signup();
  }, [signup]);

  // Handle Google signup
  const handleGoogleSignup = useCallback(async () => {
    await signupWithGoogle();
  }, [signupWithGoogle]);

  // Handle Facebook signup
  const handleFacebookSignup = useCallback(async () => {
    await signupWithFacebook();
  }, [signupWithFacebook]);

  // Handle login redirect
  const handleLoginPress = useCallback(() => {
    onLoginPress?.();
  }, [onLoginPress]);

  return (
    <BackgroundLayout
      backgroundColor={colors.common.white}
      gradientDirection="vertical"
      statusBarStyle={theme.isDark ? 'light-content' : 'light-content'}
    >
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Logo Section */}
            <LogoSection />

            {/* Signup Form Section */}
            <SignupFormSection
              name={name}
              onNameChange={handleNameChange}
              nameError={nameError}
              email={email}
              onEmailChange={handleEmailChange}
              emailError={emailError}
              phone={phone}
              onPhoneChange={handlePhoneChange}
              phoneError={phoneError}
              password={password}
              onPasswordChange={handlePasswordChange}
              passwordError={passwordError}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={handleConfirmPasswordChange}
              confirmPasswordError={confirmPasswordError}
            />

            {/* Error Message */}
            {signupError && (
              <View style={styles.errorContainer}>
                <Text
                  variant="caption"
                  color={colors.error.main}
                  align="center"
                >
                  {signupError}
                </Text>
              </View>
            )}

            {/* Sign Up Button */}
            <Button
              title={isSigningUp ? AUTH_LABELS.CREATE_ACCOUNT_LOADING : AUTH_LABELS.CREATE_ACCOUNT_BUTTON}
              variant="primary"
              size="large"
              onPress={handleSignup}
              disabled={!isValid || isSigningUp}
              loading={isSigningUp}
              style={styles.signupButton}
              rightIcon={
                !isSigningUp ? (
                  <Icon
                    name="arrow-forward"
                    size={20}
                    color={isValid ? colors.primary.contrastText : 'gray'}
                    library="MaterialIcons"
                  />
                ) : undefined
              }
            />

            {/* Social Login Section */}
            <SocialLoginSection
              onGooglePress={handleGoogleSignup}
              onFacebookPress={handleFacebookSignup}
              isGoogleLoading={isGoogleLoading}
              isFacebookLoading={isFacebookLoading}
            />

            {/* Terms and Conditions */}
            <TermsAndConditions
              onTermsPress={onTermsPress}
              onPrivacyPress={onPrivacyPress}
            />

            {/* Login Redirect */}
            <LoginRedirect
              onPress={handleLoginPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
};

export default SignupScreen;

