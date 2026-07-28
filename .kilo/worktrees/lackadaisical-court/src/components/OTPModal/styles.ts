import {StyleSheet} from 'react-native';

export const otpModalStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  subtitle: {
    marginBottom: 24,
    lineHeight: 22,
  },
  otpSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  resendSection: {
    marginBottom: 24,
    minHeight: 24,
  },
  resendButton: {
    alignSelf: 'center',
    padding: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
