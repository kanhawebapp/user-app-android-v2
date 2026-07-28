// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { useTheme } from '../../theme';
// import { Modal } from '../Modal';
// import { Text } from '../Text';
// import { Button } from '../Button';
// import { OTPInput } from '../OTPInput';
// import { Icon } from '../Icon';
// import { AUTH_LABELS, TIMEOUTS } from '../../constants/app.constants';
// import { otpModalStyle } from './styles';
// import { OTPModalProps } from './type';

// export const OTPModal: React.FC<OTPModalProps> = ({
//   visible,
//   onClose,
//   onSubmit,
//   phoneNumber = '',
//   onResendOTP,
//   loading = false,
//   title = AUTH_LABELS.OTP_TITLE,
//   subtitle,
//   testID = 'otp-modal-component',
// }) => {
//   const theme = useTheme();
//   const [otpValue, setOtpValue] = useState('');
//   const [error, setError] = useState<string>('');
//   const [resendTimer, setResendTimer] = useState(TIMEOUTS.OTP_RESEND);
//   const [canResend, setCanResend] = React.useState(false);
//   const styles = otpModalStyle

//   // Timer for resend OTP
//   React.useEffect(() => {
//     if (visible && resendTimer > 0) {
//       const timer = setTimeout(() => {
//         setResendTimer(prev => prev - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (resendTimer === 0) {
//       setCanResend(true);
//     }
//   }, [visible, resendTimer]);

//   // Reset state when modal opens
//   React.useEffect(() => {
//     if (visible) {
//       setOtpValue('');
//       setError('');
//       setResendTimer(30);
//       setCanResend(false);
//     }
//   }, [visible]);

//   const handleSubmit = () => {
//     if (otpValue.length < 4) {
//       setError(AUTH_LABELS.OTP_ERROR_INCOMPLETE);
//       return;
//     }
//     setError('');
//     onSubmit(otpValue);
//   };

//   const handleResend = () => {
//     if (canResend && onResendOTP) {
//       onResendOTP();
//       setResendTimer(30);
//       setCanResend(false);
//       setOtpValue('');
//       setError('');
//     }
//   };

//   const handleClose = () => {
//     setOtpValue('');
//     setError('');
//     onClose();
//   };

//   const defaultSubtitle = phoneNumber
//     ? AUTH_LABELS.OTP_SUBTITLE_PHONE(phoneNumber)
//     : AUTH_LABELS.OTP_SUBTITLE_DEFAULT;

//   return (
//     <Modal
//       visible={visible}
//       onClose={handleClose}
//       showBackdrop={true}
//       dismissOnBackdropPress={false}
//       showCloseButton={false}
//       animationType="slide"
//       testID={testID}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <Text variant="h6" weight="semibold" color={theme.colors.text.primary}>
//           {title}
//         </Text>

//         <TouchableOpacity onPress={handleClose} testID={`${testID}-close`}>
//           <Icon name="close" size={22} color={theme.colors.text.primary} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.container}>
//         {/* Subtitle */}
//         <Text
//           variant="body"
//           color={theme.colors.text.secondary}
//           align="center"
//           style={styles.subtitle}
//         >
//           {subtitle || defaultSubtitle}
//         </Text>

//         {/* OTP Input */}
//         <View style={styles.otpSection}>
//           <OTPInput
//             length={4}
//             value={otpValue}
//             onChange={value => {
//               setOtpValue(value);
//               if (error) setError('');
//             }}
//             error={error}
//             autoFocus={true}
//             keyboardType="number-pad"
//             testID={`${testID}-input`}
//           />
//         </View>

//         {/* Resend Section */}
//         <View style={styles.resendSection}>
//           {resendTimer > 0 ? (
//             <Text
//               variant="bodySmall"
//               color={theme.colors.text.tertiary}
//               align="center"
//             >
//               {AUTH_LABELS.OTP_RESEND_TIMER(resendTimer)}
//             </Text>
//           ) : (
//             <TouchableOpacity
//               onPress={handleResend}
//               disabled={!canResend}
//               style={styles.resendButton}
//               testID={`${testID}-resend`}
//             >
//               <Text
//                 variant="bodySmall"
//                 color={
//                   canResend
//                     ? theme.colors.primary.main
//                     : theme.colors.text.tertiary
//                 }
//                 weight={canResend ? 'semibold' : 'regular'}
//               >
//                 {AUTH_LABELS.OTP_RESEND_BUTTON}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Submit Button */}
//         <Button
//           title={loading ? AUTH_LABELS.OTP_VERIFY_LOADING : AUTH_LABELS.OTP_VERIFY_BUTTON}
//           variant="primary"
//           size="large"
//           onPress={handleSubmit}
//           disabled={otpValue.length < 4}
//           loading={loading}
//           style={styles.submitButton}
//           testID={`${testID}-submit`}
//         />
//       </View>
//     </Modal>
//   );
// };

// export default OTPModal;

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
} from 'react-native';
import {colors, useTheme} from '../../theme';
import {Text} from '../Text';
import {Button} from '../Button';
import {OTPInput} from '../OTPInput';
import {Icon} from '../Icon';
import {AUTH_LABELS, TIMEOUTS} from '../../constants/app.constants';
import {OTPModalProps} from './type';
import images from '../../assets/images';
import VerifyOtp from '../../assets/images/verifyOtp.svg';

const {height} = Dimensions.get('window');

export const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onSubmit,
  phoneNumber = '',
  onResendOTP,
  loading = false,
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
    }
  }, [visible]);

  /* auto submit when OTP filled */
  useEffect(() => {
    if (otpValue.length === 4 && !loading && !error) {
      // Small delay to feel natural
      const timeoutId = setTimeout(() => {
        handleSubmit();
      }, 500);
      submitTimeoutRef.current = timeoutId;

      return () => {
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
        }
      };
    }
  }, [otpValue, loading, error]);

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
