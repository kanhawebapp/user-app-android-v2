import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {BackgroundLayout} from '../../../components/BackgroundLayout';
import {OTPModal} from '../../../components/OTPModal';
import {Button} from '../../../components/Button';
import {getBackgroundImageSource} from '../../../assets/images';
import {useBackgroundImageUrl} from '../../../stores/config.store';
import {usePhoneValidation, useLogin} from './hooks';
import {
  LogoSection,
  PhoneInputSection,
  TermsAndConditions,
  GuestSkipButton,
} from './components';
import {loginScreenStyles} from './loginStyle';
import {LoginScreenProps} from './loginType';
import {
  AUTH_LABELS,
  COUNTRY_CODES,
  CountryCode,
} from '../../../constants/app.constants';
import {Card} from '../../../components';

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
    // Guest Login State
    isGuestLoading,

    // Actions
    requestOTP,
    verifyOTP,
    resendOTP,
    loginAsGuest,
    closeOTPModal,
  } = useLogin({
    phoneNumber,
    onLoginSuccess,
    onLoginError: error => {
      console.log('Login error:', error);
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

  // Handle guest login
  const handleGuestLogin = useCallback(async () => {
    await loginAsGuest();
    onGuestLogin?.();
  }, [loginAsGuest, onGuestLogin]);

  return (
    <BackgroundLayout
    // backgroundColor="black"
    // gradientDirection="vertical"
    // statusBarStyle={theme.isDark ? 'light-content' : 'light-content'}
    >
      <KeyboardAvoidingView
        style={[styles.container, {backgroundColor: colors.background.primary}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <LogoSection />

          {/* <View style={styles.cardContainer}> */}
          <Card style={loginScreenStyles(colors)}>
            <Text
              style={[
                styles.heading,
                {
                  color: colors.text.primary,
                  marginBottom: 20,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                },
              ]}>
              {AUTH_LABELS.LOGIN_OR_SIGNUP ||
                'Enter your phone number to continue'}
            </Text>
            {/* Phone Input */}
            <PhoneInputSection
              phoneNumber={phoneNumber}
              onPhoneChange={handlePhoneChange}
              // isValid={isPhoneValid}
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
            />

            {/* OR */}
            <View style={styles.orContainer}>
              <View
                style={[styles.line, {backgroundColor: colors.primary.light}]}
              />

              <Text style={[styles.orText, {color: '#A5A5B8'}]}>OR</Text>

              <View
                style={[styles.line, {backgroundColor: colors.primary.light}]}
              />
            </View>

            <View
              style={{
                paddingBottom: Math.max(insets.bottom, 16),
              }}>
              <GuestSkipButton
                onPress={handleGuestLogin}
                isLoading={isGuestLoading}
              />

              <TermsAndConditions
                onTermsPress={onTermsPress}
                onPrivacyPress={onPrivacyPress}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP Modal */}
      <OTPModal
        visible={isOTPModalVisible}
        onClose={handleCloseOTPModal}
        onSubmit={handleOTPVerify}
        phoneNumber={phoneNumber}
        onResendOTP={handleResendOTP}
        loading={isOTPVerifying}
        error={otpError || undefined}
        title={AUTH_LABELS.OTP_VERIFY_BUTTON}
      />
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    // paddingHorizontal: 20,
    marginTop: -60,
  },

  cardContainer: {
    // borderRadius: 24,
    // padding: 10,
    // marginTop: 10,
    // shadowColor: '#000',
    // shadowOpacity: 0.15,
    // shadowRadius: 20,
    // shadowOffset: {width: 10, height: 10},
    // elevation: 10,
  },

  getOTPButton: {
    marginTop: 10,
    width: '100%',
  },

  guestButton: {
    marginTop: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 18,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heading: {
    fontFamily: 'Inter',
    fontWeight: '600', // Medium (fixed)
    fontSize: 20, // fixed

    // lineHeight: 18, // 100% of fontSize
    textAlign: 'center', // fixed

    marginBottom: 10,
  },
});

export default LoginScreen;
