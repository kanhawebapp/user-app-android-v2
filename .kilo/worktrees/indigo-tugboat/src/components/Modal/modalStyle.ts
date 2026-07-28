import { StyleSheet } from "react-native";
import { typography, useTheme } from "../../theme";


export const modalStyle = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: typography.flex.auto,
    justifyContent: typography.justify.center,
    alignItems: typography.align.center,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: typography.flex.auto,
    justifyContent: typography.justify.center,
    alignItems: typography.align.center,
    width: typography.width.full,
    height: typography.height.full,
  },
  modalContent: {
    width: '85%',
    maxWidth: typography.width[40],
    maxHeight: '80%',
    overflow: typography.overflow.hidden,
  },
  header: {
    flexDirection: 'row',
    alignItems: typography.align.center,
    paddingHorizontal: typography.padding.xl,
    paddingVertical: typography.padding.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.divider,
    position: 'relative',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: typography.width[8],
    height: typography.height[8],
    justifyContent: typography.justify.center,
    alignItems: typography.align.center,
    borderRadius: typography.borderRadius.full,
    position: 'absolute',
    right: typography.padding.lg,
    top: '50%',
    transform: [{ translateY: -typography.height[4] }],
  },
  closeIcon: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  childrenContainer: {
    padding: typography.padding.xl,
  },
});
