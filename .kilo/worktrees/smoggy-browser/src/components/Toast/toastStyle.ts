import { StyleSheet, Dimensions } from "react-native";
import { typography } from "../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const toastStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: typography.spacing.xl,
    right: typography.spacing.xl,
    borderRadius: typography.borderRadius.lg,
    ...typography.shadow.xl,
    zIndex: typography.zIndex[50],
    overflow: 'hidden',
  },
  containerTop: {
    top: typography.spacing['4xl'] + 20,
  },
  containerBottom: {
    bottom: typography.spacing['5xl'] + 60,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: typography.spacing.lg,
    paddingRight: typography.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: typography.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: typography.spacing.md,
  },
  icon: {
    marginRight: typography.spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: typography.spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: 2,
  },
  message: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  messageWithTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    opacity: 0.9,
  },
  closeButton: {
    padding: typography.spacing.sm,
    borderRadius: typography.borderRadius.full,
    marginLeft: typography.spacing.xs,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressBar: {
    height: '100%',
    borderRadius: typography.borderRadius.full,
  },
  actionButton: {
    paddingHorizontal: typography.spacing.md,
    paddingVertical: typography.spacing.sm,
    borderRadius: typography.borderRadius.md,
    marginLeft: typography.spacing.sm,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  // Icon background colors based on type
  successIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  warningIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },


})