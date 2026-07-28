import {StyleSheet, Dimensions} from 'react-native';
import {typography} from '../../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const toastStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: typography.spacing.lg,
    right: typography.spacing.lg,
    borderRadius: typography.borderRadius.xl,
    ...typography.shadow['2xl'],
    zIndex: typography.zIndex[100],
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  containerTop: {
    top: typography.spacing['3xl'] + 10,
  },
  containerBottom: {
    bottom: typography.spacing['4xl'] + 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: typography.spacing.xl,
    paddingRight: typography.spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: typography.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: typography.spacing.lg,
  },
  icon: {
    width: 20,
    height: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: typography.spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  message: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
  },
  messageWithTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    opacity: 0.9,
  },
  closeButton: {
    padding: typography.spacing.md,
    borderRadius: typography.borderRadius.lg,
    marginLeft: typography.spacing.sm,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressBar: {
    height: '100%',
    borderRadius: typography.borderRadius.lg,
  },
  actionButton: {
    paddingHorizontal: typography.spacing.lg,
    paddingVertical: typography.spacing.md,
    borderRadius: typography.borderRadius.lg,
    marginLeft: typography.spacing.md,
  },
  actionButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
  // Icon background colors based on type
  successIconBg: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  errorIconBg: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  warningIconBg: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  infoIconBg: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
});
