import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {BackgroundLayout} from '../../../components/BackgroundLayout';
import {OTPModal} from '../../../components/OTPModal';
import {Button} from '../../../components/Button';
import {Icon} from '../../../components/Icon';
import {getBackgroundImageSource} from '../../../assets/images';
import {useBackgroundImageUrl} from '../../../stores/config.store';
import {usePhoneValidation, useLogin} from './hooks';
import {
  LogoSection,
  PhoneInputSection,
  SocialLoginSection,
  TermsAndConditions,
  GuestSkipButton,
  SignupButton,
} from './components';
import {LoginScreenProps} from './loginType';
import {
  AUTH_LABELS,
  COUNTRY_CODES,
  CountryCode,
} from '../../../constants/app.constants';

// Default country (India)
const DEFAULT_COUNTRY = COUNTRY_CODES[0];

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGuestLogin,
  onTermsPress,
  onPrivacyPress,
  onSignupPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  // Get background image from config
  const backgroundImageUrl = useBackgroundImageUrl();
  const bgImageSource = getBackgroundImageSource(backgroundImageUrl);

  // OTP Modal visibility state
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);

  // Selected country state
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode>(DEFAULT_COUNTRY);

  // Phone validation hook - adjust min length based on selected country
  const {
    phoneNumber,
    handlePhoneChange,
    isValid: isPhoneValid,
    error: phoneError,
  } = usePhoneValidation({
    minLength: 10,
    maxLength: 15,
  });

  // Login hook
  const {
    // OTP State
    isOTPRequested,
    isOTPVerifying,
    otpError,

    // Social Login State
    isGoogleLoading,
    isFacebookLoading,

    // Guest Login State
    isGuestLoading,

    // Actions
    requestOTP,
    verifyOTP,
    resendOTP,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    closeOTPModal,
  } = useLogin({
    phoneNumber,
    onLoginSuccess,
    onLoginError: error => {
      console.error('Login error:', error);
    },
  });

  // Handle country code change
  const handleCountryChange = useCallback((country: CountryCode) => {
    setSelectedCountry(country);
  }, []);

  // Handle Get OTP button press
  const handleGetOTP = useCallback(async () => {
    await requestOTP();
    setIsOTPModalVisible(true);
  }, [requestOTP]);

  // Handle OTP verification
  const handleOTPVerify = useCallback(
    async (otp: string) => {
      await verifyOTP(otp);
      // Close modal on successful verification (or keep it based on requirements)
      // The useLogin hook will call onLoginSuccess which can handle navigation
    },
    [verifyOTP],
  );

  // Handle resend OTP
  const handleResendOTP = useCallback(async () => {
    await resendOTP();
  }, [resendOTP]);

  // Handle modal close
  const handleCloseOTPModal = useCallback(() => {
    setIsOTPModalVisible(false);
    closeOTPModal();
  }, [closeOTPModal]);

  // Handle Google login
  const handleGoogleLogin = useCallback(async () => {
    await loginWithGoogle();
  }, [loginWithGoogle]);

  // Handle Facebook login
  const handleFacebookLogin = useCallback(async () => {
    await loginWithFacebook();
  }, [loginWithFacebook]);

  // Handle guest login
  const handleGuestLogin = useCallback(async () => {
    await loginAsGuest();
    onGuestLogin?.();
  }, [loginAsGuest, onGuestLogin]);

 
  return (
    <BackgroundLayout
      backgroundColor="black"
      gradientDirection="vertical"
      statusBarStyle={theme.isDark ? 'light-content' : 'light-content'}>
      <KeyboardAvoidingView
        style={[styles.container, {backgroundColor: colors.background.primary}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Logo Section */}
            {/* <AstroSpinner/> */}
            <LogoSection />
            
            {/* Phone Input Section */}
            <PhoneInputSection
              phoneNumber={phoneNumber}
              onPhoneChange={handlePhoneChange}
              isValid={isPhoneValid}
              error={phoneError}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
            {/* Get OTP Button */}
            <Button
              title={
                isOTPRequested
                  ? AUTH_LABELS.GET_OTP_LOADING
                  : AUTH_LABELS.GET_OTP_BUTTON
              }
              variant="primary"
              size="large"
              onPress={handleGetOTP}
              disabled={!isPhoneValid || isOTPRequested}
              loading={isOTPRequested}
              style={styles.getOTPButton}
              rightIcon={
                !isOTPRequested ? (
                  <Icon
                    name="arrow-forward"
                    size={20}
                    color={isPhoneValid ? colors.primary.contrastText : 'gray'}
                    library="MaterialIcons"
                  />
                ) : undefined
              }
            />
            {/* Social Login Section */}
            <SocialLoginSection
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
              isGoogleLoading={isGoogleLoading}
              isFacebookLoading={isFacebookLoading}
            />
            {/* Sign Up Button */}
            {/* <SignupButton onPress={() => onSignupPress?.()} /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={{
          backgroundColor: colors.background.primary,
          paddingBottom: Math.max(insets.bottom, 16),
        }}>
        {/* Guest Skip Button */}
        <GuestSkipButton
          onPress={handleGuestLogin}
          isLoading={isGuestLoading}
        />
        {/* Terms and Conditions */}
        <TermsAndConditions
          onTermsPress={onTermsPress}
          onPrivacyPress={onPrivacyPress}
        />
      </View>

      {/* OTP Modal */}
      <OTPModal
        visible={isOTPModalVisible}
        onClose={handleCloseOTPModal}
        onSubmit={handleOTPVerify}
        phoneNumber={phoneNumber}
        onResendOTP={handleResendOTP}
        loading={isOTPVerifying}
        title={AUTH_LABELS.OTP_VERIFY_BUTTON}
      />
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContainer: {
    padding: 24,
    height: '100%',
  },
  welcomeTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  getOTPButton: {
    marginTop: 4,
    marginBottom: 0,
  },
});

export default LoginScreen;
