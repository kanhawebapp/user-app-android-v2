import { StyleSheet } from "react-native";
import { typography, useTheme } from "../../theme";

export const bottomSheetStyle = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    justifyContent: typography.justify.end,
    overflow: typography.overflow.hidden,
  },
  backdrop: {
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    width: typography.width.full,
    overflow: typography.overflow.hidden,
  },
  handleContainer: {
    alignItems: typography.align.center,
    paddingVertical: typography.padding.lg,
  },
  handle: {
    width: typography.width[10],
    height: typography.height[1],
    borderRadius: typography.borderRadius.xs,
  },
  handleTitle: {
    marginTop: typography.spacing.sm,
  },
  content: {
    flex: typography.flex.auto,
    paddingBottom: typography.padding.xl,
  },
});