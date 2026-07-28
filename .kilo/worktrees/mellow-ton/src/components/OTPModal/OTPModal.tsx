import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
  Keyboard,
} from 'react-native';
import {colors, useTheme} from '../../theme';
import {Text} from '../Text';
import {Button} from '../Button';
import {OTPInput} from '../OTPInput';
import {AUTH_LABELS, TIMEOUTS} from '../../constants/app.constants';
import {OTPModalProps} from './type';
import VerifyOtp from '../../assets/images/verifyOtp.svg';

const {height} = Dimensions.get('window');

export const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onSubmit,
  phoneNumber = '',
  onResendOTP,
  loading = false,
  error: errorProp = '',
  title = AUTH_LABELS.OTP_TITLE,
  subtitle,
  testID = 'otp-bottom-sheet',
}) => {
  const theme = useTheme();

  const translateY = useRef(new Animated.Value(height)).current;

  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(TIMEOUTS.OTP_RESEND);
  const [canResend, setCanResend] = useState(false);
  const [hasAttemptedAutoSubmit, setHasAttemptedAutoSubmit] = useState(false);
  const [disableAutoVerify, setDisableAutoVerify] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);
  const [prevOtpValue, setPrevOtpValue] = useState('');

  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultSubtitle = phoneNumber
    ? AUTH_LABELS.OTP_SUBTITLE_PHONE(phoneNumber)
    : AUTH_LABELS.OTP_SUBTITLE_DEFAULT;

  /* open / close animation */
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  /* reset state */
  useEffect(() => {
    if (visible) {
      setOtpValue('');
      setError('');
      setResendTimer(30);
      setCanResend(false);
      setHasAttemptedAutoSubmit(false);
      setDisableAutoVerify(false);
      setWasLoading(false);
      setPrevOtpValue('');
    }
  }, [visible]);

  /* auto submit when OTP filled - only on first attempt */
  useEffect(() => {
    const isSubsequentAttempt =
      hasAttemptedAutoSubmit && otpValue !== prevOtpValue;
    const canAutoVerify =
      otpValue.length === 4 && !loading && !disableAutoVerify;

    if (canAutoVerify && !hasAttemptedAutoSubmit) {
      Keyboard.dismiss();
      setHasAttemptedAutoSubmit(true);
      setPrevOtpValue(otpValue);
      const timeoutId = setTimeout(() => {
        handleSubmit();
      }, 500);
      submitTimeoutRef.current = timeoutId;

      return () => {
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
        }
      };
    } else if (canAutoVerify && isSubsequentAttempt) {
      setPrevOtpValue(otpValue);
    }
  }, [
    otpValue,
    loading,
    disableAutoVerify,
    hasAttemptedAutoSubmit,
    prevOtpValue,
  ]);

  /* disable auto-verify after first attempt completes (whether correct or incorrect) */
  useEffect(() => {
    if (wasLoading && !loading && hasAttemptedAutoSubmit) {
      setDisableAutoVerify(true);
    }
    setWasLoading(loading);
  }, [loading, wasLoading, hasAttemptedAutoSubmit]);

  /* check for incorrect OTP from API and disable auto-verify */
  useEffect(() => {
    if (errorProp) {
      setDisableAutoVerify(true);
      setError(errorProp);
    }
  }, [errorProp]);

  /* resend timer */
  useEffect(() => {
    if (visible && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev: number) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [visible, resendTimer]);

  const handleSubmit = () => {
    if (otpValue.length < 4) {
      setError(AUTH_LABELS.OTP_ERROR_INCOMPLETE);
      return;
    }

    setError('');
    onSubmit(otpValue);
  };

  const handleResend = () => {
    if (canResend && onResendOTP) {
      onResendOTP();
      setResendTimer(30);
      setCanResend(false);
      setOtpValue('');
      setError('');
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.background.primary,
            transform: [{translateY}],
          },
        ]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}>
            {/* Drag indicator */}
            <View style={styles.dragIndicator} />
            <View style={styles.headerIcon}>
              {/* <Image source={images.VerifyOtp} style={styles.headerIconImage} /> */}
              <VerifyOtp />
            </View>
            {/* Header */}
            <View style={styles.header}>
              <Text
                variant="h5"
                weight="semibold"
                style={{textAlign: 'center', color: colors.text.primary}}>
                {/* {title} */}
                Verify Otp
              </Text>

              {/* <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={22} />
              </TouchableOpacity> */}
            </View>

            {/* Subtitle */}
            <Text
              variant="body"
              align="center"
              color={theme.colors.text.tertiary}
              style={styles.subtitle}>
              {AUTH_LABELS.OTP_SUBTITLE_DEFAULT}
            </Text>
            <Text style={styles.phoneNum} variant="h6">
              +91{phoneNumber}
            </Text>

            {/* OTP */}
            <View style={styles.otpSection}>
              <OTPInput
                length={4}
                value={otpValue}
                onChange={value => {
                  setOtpValue(value);
                  if (error) setError('');
                }}
                error={error}
              />
            </View>
            <Button
              title={
                loading
                  ? AUTH_LABELS.OTP_VERIFY_LOADING
                  : AUTH_LABELS.OTP_VERIFY_BUTTON
              }
              variant="primary"
              size="large"
              onPress={handleSubmit}
              disabled={otpValue.length < 4}
              loading={loading}
              style={styles.submitButton}
            />

            {/* Resend */}

            <View style={styles.resendSection}>
              <Text style={styles.dontReseave}>
                {AUTH_LABELS.OTP_DIDNT_RECEIVE}
              </Text>
              {resendTimer > 0 ? (
                <Text
                  variant="bodySmall"
                  color={theme.colors.primary.main}
                  align="center">
                  {AUTH_LABELS.OTP_RESEND_TIMER(resendTimer)}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text
                    variant="bodySmall"
                    color={theme.colors.primary.main}
                    weight="semibold">
                    {AUTH_LABELS.OTP_RESEND_BUTTON}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Button */}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default OTPModal;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '75%',
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },

  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    marginVertical: 40,
  },

  subtitle: {
    marginTop: -20,
  },

  otpSection: {
    marginTop: 30,
  },

  resendSection: {
    marginTop: 20,
    alignItems: 'center',
  },

  submitButton: {
    marginTop: 30,
  },
  headerIcon: {
    alignSelf: 'center',
    padding: 15,
    borderRadius: 30,
    right: 0,
    top: 10,
    zIndex: 1,
    backgroundColor: colors.primary.light,
  },
  headerIconImage: {
    width: 26,
    height: 26,
    // tintColor: '#333'
  },
  dontReseave: {
    fontFamily: 'Inter',
    fontWeight: '400', // Regular
    fontSize: 15,
    color: colors.text.tertiary,
    lineHeight: 15, // 100%
    textAlign: 'center',

    alignSelf: 'center', // keeps it centered in layout
    marginBottom: 10,
  },
  phoneNum: {
    textAlign: 'center',
    color: colors.text.primary,
  },
});
