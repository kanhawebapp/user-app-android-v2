import {Platform, TextStyle, ViewStyle} from 'react-native';

const BASE_SIZE = 4;
const scale = (multiplier: number) => BASE_SIZE * multiplier;
const fontFamilyBase = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'sans-serif',
});

/**
 * IMPORTANT:
 * On iOS, fontWeight works.
 * On Android, fontWeight works only if font supports it.
 * Avoid mixing "Roboto-medium" + fontWeight together.
 */

export const typography = {
  fontFamily: {
    regular: fontFamilyBase,
  },

  fontSize: {
    xs: scale(3), // 12
    sm: scale(3.5), // 14
    md: scale(4), // 16
    lg: scale(4.5), // 18
    xl: scale(5), // 20
    '2xl': scale(6), // 24
    '3xl': scale(7), // 28
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  fontWeight: {
    thin: '100' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 52,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    widest: 1.5,
  },

  // Border radius values
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Border width values
  borderWidth: {
    none: 0,
    thin: 1,
    small: 1.5,
    medium: 2,
    thick: 3,
    heavy: 4,
  },

  // Flex values
  flex: {
    none: 0,
    auto: 1,
    grow: 1,
    noGrow: 0,
    basis: {
      auto: 'auto' as const,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
    },
  },

  // Justify content values
  justify: {
    start: 'flex-start' as const,
    end: 'flex-end' as const,
    center: 'center' as const,
    between: 'space-between' as const,
    around: 'space-around' as const,
    evenly: 'space-evenly' as const,
  },

  // Align items values
  align: {
    start: 'flex-start' as const,
    end: 'flex-end' as const,
    center: 'center' as const,
    stretch: 'stretch' as const,
    baseline: 'baseline' as const,
  },

  // Position values
  position: {
    relative: 'relative' as const,
    absolute: 'absolute' as const,
    sticky: 'sticky' as const,
  },

  // Position coordinates
  top: {
    0: 0,
    1: scale(1),
    2: scale(2),
    3: scale(3),
    4: scale(4),
    5: scale(5),
    6: scale(6),
    7: scale(7),
    8: scale(8),
    9: scale(9),
    10: scale(10),
    auto: 'auto' as const,
  },

  bottom: {
    0: 0,
    1: scale(1),
    2: scale(2),
    3: scale(3),
    4: scale(4),
    5: scale(5),
    6: scale(6),
    7: scale(7),
    8: scale(8),
    9: scale(9),
    10: scale(10),
    auto: 'auto' as const,
  },

  left: {
    0: 0,
    1: scale(1),
    2: scale(2),
    3: scale(3),
    4: scale(4),
    5: scale(5),
    6: scale(6),
    7: scale(7),
    8: scale(8),
    9: scale(9),
    10: scale(10),
    auto: 'auto' as const,
  },

  right: {
    0: 0,
    1: scale(1),
    2: scale(2),
    3: scale(3),
    4: scale(4),
    5: scale(5),
    6: scale(6),
    7: scale(7),
    8: scale(8),
    9: scale(9),
    10: scale(10),
    auto: 'auto' as const,
  },

  // Spacing values (padding/margin)
  spacing: {
    none: 0,
    xs: scale(0.5), // 2
    sm: scale(1), // 4
    md: scale(2), // 8
    lg: scale(3), // 12
    xl: scale(4), // 16
    '2xl': scale(5), // 20
    '3xl': scale(6), // 24
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  // Padding values
  padding: {
    none: 0,
    xs: scale(0.5), // 2
    sm: scale(1), // 4
    md: scale(2), // 8
    lg: scale(3), // 12
    xl: scale(4), // 16
    '2xl': scale(5), // 20
    '3xl': scale(6), // 24
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  // Margin values
  margin: {
    none: 0,
    xs: scale(0.5), // 2
    sm: scale(1), // 4
    md: scale(2), // 8
    lg: scale(3), // 12
    xl: scale(4), // 16
    '2xl': scale(5), // 20
    '3xl': scale(6), // 24
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  // Horizontal padding (left/right)
  paddingX: {
    none: 0,
    xs: scale(0.5), // 2
    sm: scale(1), // 4
    md: scale(2), // 8
    lg: scale(3), // 12
    xl: scale(4), // 16
    '2xl': scale(5), // 20
    '3xl': scale(6), // 24
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  // Vertical padding (top/bottom)
  paddingY: {
    none: 0,
    xs: scale(0.5), // 2
    sm: scale(1), // 4
    md: scale(2), // 8
    lg: scale(3), // 12
    xl: scale(4), // 16
    '2xl': scale(5), // 20
    '3xl': scale(6), // 24
    '4xl': scale(8), // 32
    '5xl': scale(10), // 40
  },

  // Width values
  width: {
    auto: 'auto' as const,
    full: '100%' as const,
    half: '50%' as const,
    third: '33.333%' as const,
    screen: '100vw' as const,
    1: scale(1) * 4,
    2: scale(2) * 4,
    2.5: scale(2.5),
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    7: scale(7) * 4,
    8: scale(8) * 4,
    9: scale(9) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    14: scale(14) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    24: scale(24) * 4,
    28: scale(28) * 4,
    32: scale(32) * 4,
    36: scale(36) * 4,
    40: scale(40) * 4,
  },

  // Height values
  height: {
    auto: 'auto' as const,
    full: '100%' as const,
    half: '50%' as const,
    screen: '100vh' as const,
    1: scale(1) * 4,
    2: scale(2) * 4,
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    7: scale(7) * 4,
    8: scale(8) * 4,
    9: scale(9) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    14: scale(14) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    24: scale(24) * 4,
    28: scale(28) * 4,
    32: scale(32) * 4,
    36: scale(36) * 4,
    40: scale(40) * 4,
  },

  // Min height values
  minHeight: {
    0: 0,
    1: scale(1) * 4,
    2: scale(2) * 4,
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    8: scale(8) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    full: '100%' as const,
    screen: '100vh' as const,
  },

  // Max height values
  maxHeight: {
    0: 0,
    1: scale(1) * 4,
    2: scale(2) * 4,
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    8: scale(8) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    full: '100%' as const,
    screen: '100vh' as const,
  },

  // Min width values
  minWidth: {
    0: 0,
    1: scale(1) * 4,
    2: scale(2) * 4,
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    8: scale(8) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    full: '100%' as const,
  },

  // Max width values
  maxWidth: {
    0: 0,
    1: scale(1) * 4,
    2: scale(2) * 4,
    3: scale(3) * 4,
    4: scale(4) * 4,
    5: scale(5) * 4,
    6: scale(6) * 4,
    8: scale(8) * 4,
    10: scale(10) * 4,
    12: scale(12) * 4,
    16: scale(16) * 4,
    20: scale(20) * 4,
    full: '100%' as const,
    screen: '100vw' as const,
  },

  // Z-index values
  zIndex: {
    0: 0,
    1: 1,
    2: 2,
    5: 5,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    100: 100,
    auto: 'auto' as const,
  },

  // Overflow values
  overflow: {
    visible: 'visible' as const,
    hidden: 'hidden' as const,
    scroll: 'scroll' as const,
    auto: 'auto' as const,
  },

  // Shadow values
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8,
    },
    '2xl': {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },
  },

  // Gap values for flex layouts
  gap: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    '5xl': 40,
  },

  // Row gap values
  rowGap: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    '5xl': 40,
  },

  // Column gap values
  columnGap: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    '5xl': 40,
  },

  // Text align values
  textAlign: {
    left: 'left' as const,
    center: 'center' as const,
    right: 'right' as const,
    justify: 'justify' as const,
    auto: 'auto' as const,
  },

  // Text variants
  variants: {
    display: {
      fontSize: scale(10),
      lineHeight: 52,
      fontWeight: '700',
      letterSpacing: -0.5,
    },

    h1: {
      fontSize: scale(8),
      lineHeight: 44,
      fontWeight: '700',
    },

    h2: {
      fontSize: scale(7),
      lineHeight: 40,
      fontWeight: '600',
    },

    h3: {
      fontSize: scale(6),
      lineHeight: 36,
      fontWeight: '600',
    },

    h4: {
      fontSize: scale(5.5),
      lineHeight: 34,
      fontWeight: '600',
    },

    h5: {
      fontSize: scale(5),
      lineHeight: 32,
      fontWeight: '600',
    },

    h6: {
      fontSize: scale(4.5),
      lineHeight: 30,
      fontWeight: '600',
    },

    subtitle: {
      fontSize: scale(5),
      lineHeight: 32,
      fontWeight: '500',
    },

    body: {
      fontSize: scale(4),
      lineHeight: 24,
      fontWeight: '400',
    },

    bodySmall: {
      fontSize: scale(3.5),
      lineHeight: 20,
      fontWeight: '400',
    },

    caption: {
      fontSize: scale(3),
      lineHeight: 16,
      fontWeight: '400',
    },

    captionSmall: {
      fontSize: scale(2.5),
      lineHeight: 14,
      fontWeight: '400',
    },

    overline: {
      fontSize: scale(2.5),
      lineHeight: 14,
      fontWeight: '600',
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },

    button: {
      fontSize: scale(4),
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: 0.5,
    },

    label: {
      fontSize: scale(3.5),
      lineHeight: 20,
      fontWeight: '500',
    },

    link: {
      fontSize: scale(4),
      lineHeight: 24,
      fontWeight: '500',
      textDecorationLine: 'underline' as const,
    },
  },
} as const;

export type Typography = typeof typography;
export type TextVariant = keyof typeof typography.variants;
export type FontWeight = keyof typeof typography.fontWeight;
export type BorderRadius = keyof typeof typography.borderRadius;

export const getTextStyle = (variant: TextVariant): TextStyle => {
  return {
    fontFamily: typography.fontFamily.regular,
    ...typography.variants[variant],
  };
};
