// import {StyleSheet, ViewStyle, TextStyle, Dimensions} from 'react-native';
// import {typography, useTheme} from '../../theme';

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// export const inputStyle = (theme: ReturnType<typeof useTheme>) =>
//   StyleSheet.create({
//     container: {
//       width: '100%',
//       minWidth: 200,
//       maxWidth: SCREEN_WIDTH - 48,
//     },
//     labelContainer: {
//       position: 'absolute',
//       left: typography.padding.md,
//       top: 0,
//       bottom: 0,
//       justifyContent: 'center',
//       zIndex: 2,
//     },
//     label: {
//       marginBottom: typography.spacing.xs,
//       fontWeight: typography.fontWeight.medium,
//     },
//     floatingLabel: {
//       position: 'absolute',
//       left: 30,
//       paddingHorizontal: 6,
//       zIndex: 10,
//       backgroundColor: theme.colors.background.primary,
//     },
//     inputContainer: {
//       flexDirection: 'row',
//       alignItems: typography.align.center,
//       borderWidth: typography.borderWidth.thin,
//       borderRadius: typography.borderRadius.md,
//       backgroundColor: theme.colors.input.background,
//       shadowColor: theme.colors.common.black,
//       shadowOffset: {width: 0, height: 1},
//       shadowOpacity: 0.05,
//       shadowRadius: 2,
//       elevation: 1,
//       position: 'relative',
//       width: '100%',
//     },
//     errorContainer: {
//       borderWidth: typography.borderWidth.small,
//     },
//     input: {
//       flex: 1,
//       backgroundColor: 'transparent',
//       zIndex: 1,
//       minWidth: 0,
//       paddingHorizontal: typography.padding.md,
//       // Fix: Add left padding to align with floating label position (left: 30 + paddingHorizontal: 6 = 36)
//       paddingLeft: 30,
//     },
//     inputWithLabel: {
//       paddingTop: typography.padding.sm,
//     },
//     iconLeft: {
//       marginLeft: typography.padding.md,
//     },
//     iconRight: {
//       marginRight: typography.padding.md,
//     },
//     helperText: {
//       marginTop: typography.spacing.xs,
//       marginLeft: typography.spacing.xs,
//     },
//     clearText: {
//       fontSize: typography.fontSize.md,
//       lineHeight: typography.lineHeight.md,
//     },
//   });

import {StyleSheet, Dimensions} from 'react-native';
import {typography, useTheme} from '../../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const INPUT_PADDING = 16;

export const inputStyle = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      width: '100%',
      minWidth: 200,
      maxWidth: SCREEN_WIDTH - 48,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: typography.borderWidth.thin,
      borderRadius: typography.borderRadius.md,
      backgroundColor: theme.colors.input.background,
      width: '100%',
    },

    input: {
      flex: 1,
      paddingHorizontal: INPUT_PADDING,
      paddingVertical: 0,
    },

    iconLeft: {
      marginLeft: INPUT_PADDING,
      marginRight: 6,
    },

    iconRight: {
      marginRight: INPUT_PADDING,
    },

    helperText: {
      marginTop: typography.spacing.xs,
      marginLeft: typography.spacing.xs,
    },
  });
