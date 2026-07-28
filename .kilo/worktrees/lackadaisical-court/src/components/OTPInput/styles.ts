import {StyleSheet} from 'react-native';

export const otpinputStyle = StyleSheet.create({
  container: {
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  otpText: {
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 12,
  },
});
