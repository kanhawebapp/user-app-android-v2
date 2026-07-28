import {StyleSheet} from 'react-native';
import {typography, useTheme} from '../../theme';

export const buttonStyle = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: typography.align.center,
      justifyContent: typography.justify.center,
      borderRadius: typography.borderRadius.md,
      shadowColor: theme.colors.common.black,
      shadowOffset: {width: 0, height: 2},
      // shadowOpacity: 0.1,
      // shadowRadius: 4,
      // elevation: 3,
    },
    disabled: {
      opacity: 0.6,
      shadowOpacity: 0,
      elevation: 0,
    },
    text: {
      textAlign: typography.textAlign.center,
    },
    iconLeft: {
      marginRight: typography.spacing.sm,
    },
    iconRight: {
      marginLeft: typography.spacing.sm,
    },
  });
