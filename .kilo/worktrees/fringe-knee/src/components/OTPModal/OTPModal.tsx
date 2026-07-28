import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Modal } from '../Modal';
import { Text } from '../Text';
import { Button } from '../Button';
import { OTPInput } from '../OTPInput';
import { Icon } from '../Icon';
import { AUTH_LABELS, TIMEOUTS } from '../../constants/app.constants';
import { otpModalStyle } from './styles';
import { OTPModalProps } from './type';


export const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onSubmit,
  phoneNumber = '',
  onResendOTP,
  loading = false,
  title = AUTH_LABELS.OTP_TITLE,
  subtitle,
  testID = 'otp-modal-component',
}) => {
  const theme = useTheme();
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState(TIMEOUTS.OTP_RESEND);
  const [canResend, setCanResend] = React.useState(false);
  const styles = otpModalStyle

  // Timer for resend OTP
  React.useEffect(() => {
    if (visible && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [visible, resendTimer]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (visible) {
      setOtpValue('');
      setError('');
      setResendTimer(30);
      setCanResend(false);
    }
  }, [visible]);

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

  const handleClose = () => {
    setOtpValue('');
    setError('');
    onClose();
  };

  const defaultSubtitle = phoneNumber
    ? AUTH_LABELS.OTP_SUBTITLE_PHONE(phoneNumber)
    : AUTH_LABELS.OTP_SUBTITLE_DEFAULT;

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      showBackdrop={true}
      dismissOnBackdropPress={false}
      showCloseButton={false}
      animationType="slide"
      testID={testID}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h6" weight="semibold" color={theme.colors.text.primary}>
          {title}
        </Text>

        <TouchableOpacity onPress={handleClose} testID={`${testID}-close`}>
          <Icon name="close" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Subtitle */}
        <Text
          variant="body"
          color={theme.colors.text.secondary}
          align="center"
          style={styles.subtitle}
        >
          {subtitle || defaultSubtitle}
        </Text>

        {/* OTP Input */}
        <View style={styles.otpSection}>
          <OTPInput
            length={4}
            value={otpValue}
            onChange={value => {
              setOtpValue(value);
              if (error) setError('');
            }}
            error={error}
            autoFocus={true}
            keyboardType="number-pad"
            testID={`${testID}-input`}
          />
        </View>

        {/* Resend Section */}
        <View style={styles.resendSection}>
          {resendTimer > 0 ? (
            <Text
              variant="bodySmall"
              color={theme.colors.text.tertiary}
              align="center"
            >
              {AUTH_LABELS.OTP_RESEND_TIMER(resendTimer)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend}
              style={styles.resendButton}
              testID={`${testID}-resend`}
            >
              <Text
                variant="bodySmall"
                color={
                  canResend
                    ? theme.colors.primary.main
                    : theme.colors.text.tertiary
                }
                weight={canResend ? 'semibold' : 'regular'}
              >
                {AUTH_LABELS.OTP_RESEND_BUTTON}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <Button
          title={loading ? AUTH_LABELS.OTP_VERIFY_LOADING : AUTH_LABELS.OTP_VERIFY_BUTTON}
          variant="primary"
          size="large"
          onPress={handleSubmit}
          disabled={otpValue.length < 4}
          loading={loading}
          style={styles.submitButton}
          testID={`${testID}-submit`}
        />
      </View>
    </Modal>
  );
};


export default OTPModal;

