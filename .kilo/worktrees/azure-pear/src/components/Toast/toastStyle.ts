// import {StyleSheet, Dimensions} from 'react-native';
// import {typography} from '../../theme';

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// export const toastStyle = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     left: typography.spacing.lg,
//     right: typography.spacing.lg,
//     borderRadius: typography.borderRadius.xl,
//     ...typography.shadow['2xl'],
//     zIndex: typography.zIndex[100],
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//   },
//   containerTop: {
//     top: typography.spacing['3xl'] + 10,
//   },
//   containerBottom: {
//     bottom: typography.spacing['4xl'] + 20,
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: typography.spacing.xl,
//     paddingRight: typography.spacing.lg,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: typography.borderRadius.lg,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: typography.spacing.lg,
//   },
//   icon: {
//     width: 20,
//     height: 20,
//   },
//   textContainer: {
//     flex: 1,
//     marginRight: typography.spacing.md,
//   },
//   title: {
//     fontSize: typography.fontSize.lg,
//     fontWeight: typography.fontWeight.bold,
//     marginBottom: 4,
//   },
//   message: {
//     fontSize: typography.fontSize.base,
//     fontWeight: typography.fontWeight.regular,
//   },
//   messageWithTitle: {
//     fontSize: typography.fontSize.base,
//     fontWeight: typography.fontWeight.regular,
//     opacity: 0.9,
//   },
//   closeButton: {
//     padding: typography.spacing.md,
//     borderRadius: typography.borderRadius.lg,
//     marginLeft: typography.spacing.sm,
//   },
//   progressBarContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 2,
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//   },
//   progressBar: {
//     height: '100%',
//     borderRadius: typography.borderRadius.lg,
//   },
//   actionButton: {
//     paddingHorizontal: typography.spacing.lg,
//     paddingVertical: typography.spacing.md,
//     borderRadius: typography.borderRadius.lg,
//     marginLeft: typography.spacing.md,
//   },
//   actionButtonText: {
//     fontSize: typography.fontSize.base,
//     fontWeight: typography.fontWeight.semiBold,
//   },
//   // Icon background colors based on type
//   successIconBg: {
//     backgroundColor: 'rgba(76, 175, 80, 0.2)',
//   },
//   errorIconBg: {
//     backgroundColor: 'rgba(244, 67, 54, 0.2)',
//   },
//   warningIconBg: {
//     backgroundColor: 'rgba(255, 152, 0, 0.2)',
//   },
//   infoIconBg: {
//     backgroundColor: 'rgba(33, 150, 243, 0.2)',
//   },
// });

import {StyleSheet, Dimensions, Platform} from 'react-native';
import {typography} from '../../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const toastStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },

  containerTop: {
    top: Platform.OS === 'ios' ? 60 : 30,
  },

  containerBottom: {
    bottom: 40,
  },

  gradientContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,

    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    elevation: 12,
  },

  glowEffect: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 999,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },

  message: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },

  messageWithTitle: {
    color: '#CBD5E1',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  progressBarContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
});
