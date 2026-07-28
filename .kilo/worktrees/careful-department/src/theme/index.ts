/**
 * Theme Exports
 * Unified export for all theme-related files
 */

export { colors, createColors, type Colors, type ColorMode, isDarkMode } from './colors';
export { typography, type Typography, type TextVariant, type FontWeight, type BorderRadius } from './typography';
export {
  ThemeProvider,
  useTheme,
  useColors,
  useTypography,
  useThemeMode,
  useIsDarkMode,
  ThemeContext as ThemeContextType,
  type ThemeProviderProps,
} from './ThemeContext';

// Re-export for convenience
export type { Colors as ThemeColors } from './colors';
export type { Typography as ThemeTypography } from './typography';
export type { Mode } from './colors';

// Import directly from source files to avoid require cycle
import { colors as appColors, createColors } from './colors';
import { typography as appTypography } from './typography';

export const theme = {
  colors: appColors,
  typography: appTypography,
} as const;

export type Theme = typeof theme;

export type FlexValue = keyof typeof appTypography.flex;
export type JustifyValue = keyof typeof appTypography.justify;
export type AlignValue = keyof typeof appTypography.align;
export type PositionValue = keyof typeof appTypography.position;
export type SpacingValue = keyof typeof appTypography.spacing;
export type PaddingValue = keyof typeof appTypography.padding;
export type MarginValue = keyof typeof appTypography.margin;
export type WidthValue = keyof typeof appTypography.width;
export type HeightValue = keyof typeof appTypography.height;
export type ZIndexValue = keyof typeof appTypography.zIndex;
export type OverflowValue = keyof typeof appTypography.overflow;
export type ShadowValue = keyof typeof appTypography.shadow;
export type GapValue = keyof typeof appTypography.gap;
export type TextAlignValue = keyof typeof appTypography.textAlign;

