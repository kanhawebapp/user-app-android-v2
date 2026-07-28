/**
 * Global Colors Theme
 * Defines all application colors for both light and dark modes
 * Smart approach: colors automatically switch based on theme mode
 */

/**
 * Theme mode type
 */
export type Mode = 'light' | 'dark';

/**
 * Color Palette for Light Mode
 */
const lightColors = {
  // Primary colors
  primary: {
    main: '#6200EE',
    light: '#BB86FC',
    dark: '#3700B3',
    contrastText: '#FFFFFF',
  },

  // Secondary colors
  secondary: {
    main: '#03DAC6',
    light: '#66FFF9',
    dark: '#00A896',
    contrastText: '#000000',
  },

  // Common/Base colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    // Gray scale
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // Red scale
    red: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    // Blue scale
    blue: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    // Green scale
    green: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    // Yellow scale
    yellow: {
      50: '#FFFDE7',
      100: '#FFF9C4',
      200: '#FFF59D',
      300: '#FFF176',
      400: '#FFEE58',
      500: '#FFEB3B',
      600: '#FDD835',
      700: '#FBC02D',
      800: '#F9A825',
      900: '#F57F17',
    },
    // Orange scale
    orange: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    // Purple scale
    purple: {
      50: '#F3E5F5',
      100: '#E1BEE7',
      200: '#CE93D8',
      300: '#BA68C8',
      400: '#AB47BC',
      500: '#9C27B0',
      600: '#8E24AA',
      700: '#7B1FA2',
      800: '#6A1B9A',
      900: '#4A148C',
    },
    // Cyan scale
    cyan: {
      50: '#E0F7FA',
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      400: '#26C6DA',
      500: '#00BCD4',
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064',
    },
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#E0E0E0',
    dark: '#121212',
  },

  // Text colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    link: '#2196F3',
  },

  // Status colors
  error: {
    main: '#B00020',
    light: '#EF5350',
    dark: '#7F0000',
    background: '#FDECEA',
  },

  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#2E7D32',
    background: '#E8F5E9',
  },

  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    background: '#FFF3E0',
  },

  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1565C0',
    background: '#E3F2FD',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    main: '#CCCCCC',
    dark: '#999999',
    focus: '#6200EE',
    error: '#B00020',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Divider
  divider: 'rgba(0, 0, 0, 0.12)',

  // Card colors
  card: {
    background: '#FFFFFF',
    border: '#E0E0E0',
  },

  // Input colors
  input: {
    background: '#FFFFFF',
    border: '#CCCCCC',
    placeholder: '#999999',
    text: '#000000',
  },

  // Surface colors for dark surfaces in light mode
  surface: {
    elevated: '#FFFFFF',
    overlay: '#F5F5F5',
  },

  // Icon colors
  icon: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },

  // Skeleton/Loading colors
  skeleton: {
    base: '#E0E0E0',
    highlight: '#F5F5F5',
  },

  // Status bar
  statusBar: 'dark-content' as const,
};

/**
 * Color Palette for Dark Mode
 */
const darkColors = {
  // Primary colors - slightly adjusted for dark mode
  primary: {
    main: '#BB86FC',
    light: '#E1BEE7',
    dark: '#6200EE',
    contrastText: '#000000',
  },

  // Secondary colors
  secondary: {
    main: '#03DAC6',
    light: '#66FFF9',
    dark: '#018786',
    contrastText: '#000000',
  },

  // Common/Base colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    // Gray scale
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // Red scale
    red: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    // Blue scale
    blue: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    // Green scale
    green: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    // Yellow scale
    yellow: {
      50: '#FFFDE7',
      100: '#FFF9C4',
      200: '#FFF59D',
      300: '#FFF176',
      400: '#FFEE58',
      500: '#FFEB3B',
      600: '#FDD835',
      700: '#FBC02D',
      800: '#F9A825',
      900: '#F57F17',
    },
    // Orange scale
    orange: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    // Purple scale
    purple: {
      50: '#F3E5F5',
      100: '#E1BEE7',
      200: '#CE93D8',
      300: '#BA68C8',
      400: '#AB47BC',
      500: '#9C27B0',
      600: '#8E24AA',
      700: '#7B1FA2',
      800: '#6A1B9A',
      900: '#4A148C',
    },
    // Cyan scale
    cyan: {
      50: '#E0F7FA',
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      400: '#26C6DA',
      500: '#00BCD4',
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064',
    },
  },

  // Background colors
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    dark: '#000000',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    disabled: '#4D4D4D',
    inverse: '#000000',
    link: '#64B5F6',
  },

  // Status colors - lighter variants for dark mode
  error: {
    main: '#CF6679',
    light: '#EF5350',
    dark: '#B00020',
    background: '#3D2021',
  },

  success: {
    main: '#81C784',
    light: '#A5D6A7',
    dark: '#4CAF50',
    background: '#1B3A1D',
  },

  warning: {
    main: '#FFB74D',
    light: '#FFCC80',
    dark: '#FF9800',
    background: '#3D2E1A',
  },

  info: {
    main: '#64B5F6',
    light: '#90CAF9',
    dark: '#2196F3',
    background: '#1A2D3D',
  },

  // Border colors
  border: {
    light: '#2C2C2C',
    main: '#404040',
    dark: '#5C5C5C',
    focus: '#BB86FC',
    error: '#CF6679',
  },

  // Overlay - lighter for dark mode
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Divider
  divider: 'rgba(255, 255, 255, 0.12)',

  // Card colors
  card: {
    background: '#1E1E1E',
    border: '#2C2C2C',
  },

  // Input colors
  input: {
    background: '#1E1E1E',
    border: '#404040',
    placeholder: '#808080',
    text: '#FFFFFF',
  },

  // Surface colors for dark mode
  surface: {
    elevated: '#2C2C2C',
    overlay: '#1E1E1E',
  },

  // Icon colors
  icon: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    inverse: '#000000',
  },

  // Skeleton/Loading colors - inverted for dark mode
  skeleton: {
    base: '#2C2C2C',
    highlight: '#3D3D3D',
  },

  // Status bar
  statusBar: 'light-content' as const,
};

/**
 * Factory function to create colors based on mode
 * This is the smart approach - components don't need to handle mode
 */
export const createColors = (mode: Mode) => {
  return mode === 'dark' ? darkColors : lightColors;
};

/**
 * Default export - returns light colors for backward compatibility
 * Use useTheme().colors or useColors() hook for dynamic colors
 */
export const colors = lightColors;

export type Colors = typeof lightColors;

/**
 * Type for color mode
 */
export type ColorMode = 'light' | 'dark';

/**
 * Helper to check if colors are dark mode
 */
export const isDarkMode = (colors: Colors): boolean => {
  return colors.background.primary === darkColors.background.primary;
};

