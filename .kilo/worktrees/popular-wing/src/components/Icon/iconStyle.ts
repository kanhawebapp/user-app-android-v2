import {StyleSheet} from 'react-native';
import {typography, useTheme} from '../../theme';

export const iconStyle = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: typography.align.center,
      justifyContent: typography.justify.center,
    },
    loading: {
      alignItems: typography.align.center,
      justifyContent: typography.justify.center,
    },
  });
