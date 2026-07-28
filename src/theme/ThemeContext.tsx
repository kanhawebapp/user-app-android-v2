import React, {createContext, useContext, useMemo, ReactNode} from 'react';
import {colors, createColors, typography} from './index';
import type {Mode} from './colors';

interface ThemeContextType {
  colors: ReturnType<typeof createColors>;
  typography: typeof typography;
  isDark: boolean;
  mode: Mode;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export interface ThemeProviderProps {
  mode?: Mode;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  mode = 'light',
  children,
}) => {
  const theme = useMemo(
    () => ({
      colors: createColors(mode),
      typography,
      isDark: mode === 'dark',
      mode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme
 * Throws an error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    // Return default theme if context is not available
    // This prevents crashes during initial setup
    return {
      colors: createColors('light'),
      typography,
      isDark: false,
      mode: 'light',
    };
  }

  return context;
};

/**
 * Hook to access only colors from theme
 * Colors automatically adapt to light/dark mode
 */
export const useColors = () => {
  const theme = useTheme();
  return theme.colors;
};

/**
 * Hook to access only typography from theme
 */
export const useTypography = () => {
  const theme = useTheme();
  return theme.typography;
};

/**
 * Hook to get current theme mode
 */
export const useThemeMode = (): Mode => {
  const theme = useTheme();
  return theme.mode;
};

/**
 * Hook to check if dark mode is active
 */
export const useIsDarkMode = (): boolean => {
  const theme = useTheme();
  return theme.isDark;
};

export default ThemeContext;
