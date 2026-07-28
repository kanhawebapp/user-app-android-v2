// /**
//  * GoBack Component Styles
//  */

// import {StyleSheet} from 'react-native';
// import {colors, typography} from '../../theme';

// export const goBackStyle = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: typography.padding.xl,
//     paddingBottom: typography.padding.lg,
//     borderBottomLeftRadius: typography.borderRadius.xl,
//     borderBottomRightRadius: typography.borderRadius.xl,

//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: typography.spacing.lg,
//   },
//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: typography.borderRadius.lg,
//     backgroundColor: colors.primary.light,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: typography.spacing.lg,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: typography.spacing.sm,
//   },
//   title: {
//     fontSize: typography.fontSize.lg,
//     fontWeight: typography.fontWeight.extraBold,
//     color: '#111827',
//   },
//   subtitle: {
//     marginTop: typography.spacing.xs,
//     fontSize: typography.fontSize.sm,
//     color: '#6B7280',
//     fontWeight: typography.fontWeight.medium,
//   },
//   rightSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
// });

/**
 * GoBack Component Styles
 */

import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export const goBackStyle = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: typography.padding.xl,
    paddingBottom: typography.padding.lg,
    borderBottomLeftRadius: typography.borderRadius.xl,
    borderBottomRightRadius: typography.borderRadius.xl,

    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 4},
    // shadowOpacity: 0.04,
    // shadowRadius: 8,
    // elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // minHeight: 48,
    position: 'relative',
    marginBottom: typography.spacing.lg,
  },

  leftSection: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
  },

  backButton: {
    // width: 42,
    // height: 42,
    borderRadius: typography.borderRadius.lg,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Default Center Alignment
   */
  titleContainerCenter: {
    position: 'absolute',
    left: 60,
    right: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Left Alignment
   */
  titleContainerLeft: {
    flex: 1,
    marginLeft: typography.spacing.md,
    marginRight: typography.spacing.md,
  },

  /**
   * Right Alignment
   */
  titleContainerRight: {
    flex: 1,
    marginLeft: typography.spacing.md,
    marginRight: typography.spacing.md,
    alignItems: 'flex-end',
  },

  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
    color: '#111827',
  },

  subtitle: {
    marginTop: typography.spacing.xs,
    fontSize: typography.fontSize.sm,
    color: '#6B7280',
    fontWeight: typography.fontWeight.medium,
  },

  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
});

