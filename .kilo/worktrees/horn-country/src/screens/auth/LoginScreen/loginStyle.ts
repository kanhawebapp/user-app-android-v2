import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {colors, typography} from '../../../theme';

// ============== LoginScreen Styles ==============

export const loginScreenStyles = (
  colors:
    | {
        primary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        textColor: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        common: {
          white: string;
          black: string;
          transparent: string;
          gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
        };
        background: {
          primary: string;
          secondary: string;
          tertiary: string;
          dark: string;
        };
        text: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        error: {main: string; light: string; dark: string; background: string};
        success: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        warning: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        info: {main: string; light: string; dark: string; background: string};
        border: {
          light: string;
          main: string;
          dark: string;
          focus: string;
          error: string;
        };
        overlay: string;
        divider: string;
        card: {background: string; border: string};
        input: {
          background: string;
          border: string;
          placeholder: string;
          text: string;
        };
        surface: {elevated: string; overlay: string};
        icon: {
          primary: string;
          secondary: string;
          tertiary: string;
          inverse: string;
        };
        skeleton: {base: string; highlight: string};
        statusBar: 'dark-content';
      }
    | {
        primary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        common: {
          white: string;
          black: string;
          transparent: string;
          gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
        };
        background: {
          primary: string;
          secondary: string;
          tertiary: string;
          dark: string;
        };
        text: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        error: {main: string; light: string; dark: string; background: string};
        success: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        warning: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        info: {main: string; light: string; dark: string; background: string};
        border: {
          light: string;
          main: string;
          dark: string;
          focus: string;
          error: string;
        };
        overlay: string;
        divider: string;
        card: {background: string; border: string};
        input: {
          background: string;
          border: string;
          placeholder: string;
          text: string;
        };
        surface: {elevated: string; overlay: string};
        icon: {
          primary: string;
          secondary: string;
          tertiary: string;
          inverse: string;
        };
        skeleton: {base: string; highlight: string};
        statusBar: 'light-content';
      },
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      flex: 1,
    } as ViewStyle,
    scrollContent: {
      flexGrow: 1,
    } as ViewStyle,
    cardContainer: {
      backgroundColor: colors.background.card || colors.common.white,
      marginTop: 20,
      padding: 20,
      borderRadius: 28,
      shadowColor: colors.shadow?.default || '#000',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border?.light || 'rgba(255,255,255,0.2)',
    } as ViewStyle,
    getOTPButton: {
      marginTop: 4,
      marginBottom: 0,
    } as ViewStyle,
  });

// ============== LogoSection Styles ==============

export const logoSectionStyles = (
  colors:
    | {
        primary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        textColor: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        common: {
          white: string;
          black: string;
          transparent: string;
          gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
        };
        background: {
          primary: string;
          secondary: string;
          tertiary: string;
          dark: string;
        };
        text: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        error: {main: string; light: string; dark: string; background: string};
        success: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        warning: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        info: {main: string; light: string; dark: string; background: string};
        border: {
          light: string;
          main: string;
          dark: string;
          focus: string;
          error: string;
        };
        overlay: string;
        divider: string;
        card: {background: string; border: string};
        input: {
          background: string;
          border: string;
          placeholder: string;
          text: string;
        };
        surface: {elevated: string; overlay: string};
        icon: {
          primary: string;
          secondary: string;
          tertiary: string;
          inverse: string;
        };
        skeleton: {base: string; highlight: string};
        statusBar: 'dark-content';
      }
    | {
        primary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        secondary: {
          main: string;
          light: string;
          dark: string;
          contrastText: string;
        };
        common: {
          white: string;
          black: string;
          transparent: string;
          gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
          cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
          };
        };
        background: {
          primary: string;
          secondary: string;
          tertiary: string;
          dark: string;
        };
        text: {
          primary: string;
          secondary: string;
          tertiary: string;
          disabled: string;
          inverse: string;
          link: string;
        };
        error: {main: string; light: string; dark: string; background: string};
        success: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        warning: {
          main: string;
          light: string;
          dark: string;
          background: string;
        };
        info: {main: string; light: string; dark: string; background: string};
        border: {
          light: string;
          main: string;
          dark: string;
          focus: string;
          error: string;
        };
        overlay: string;
        divider: string;
        card: {background: string; border: string};
        input: {
          background: string;
          border: string;
          placeholder: string;
          text: string;
        };
        surface: {elevated: string; overlay: string};
        icon: {
          primary: string;
          secondary: string;
          tertiary: string;
          inverse: string;
        };
        skeleton: {base: string; highlight: string};
        statusBar: 'light-content';
      },
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: typography.spacing['3xl'],
    } as ViewStyle,
    logoContainer: {
      // width: 130,
      // height: 130,
      borderRadius: typography.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      // marginBottom: typography.spacing.lg,
      marginTop: 20,
    } as ViewStyle,
    appName: {
      fontFamily: 'Inter',
      fontWeight: '600', // SemiBold
      fontSize: 23,
      lineHeight: 24, // 100%
      textAlign: 'center',

      alignSelf: 'center', // ensures proper centering
    },
    tagline: {
      opacity: 0.8,
    } as TextStyle,
  });

// ============== PhoneInputSection Styles ==============

export const phoneInputSectionStyles = (
  colors: any,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginBottom: typography.spacing.lg,
      width: '100%',
    } as ViewStyle,
    label: {
      marginBottom: typography.spacing.md,
      fontWeight: typography.fontWeight.medium,
    } as TextStyle,
    // inputContainer: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   borderWidth: 1,
    //   borderRadius: typography.borderRadius.sm,
    //   overflow: 'hidden',
    //   width: '100%',
    //   minHeight: 56,
    // } as ViewStyle,
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth: 1,
      // borderRadius: typography.borderRadius.sm,
      // overflow: 'hidden',
      // width: '100%',
      // height: 56,
    },
    countryCode: {
      height: 54,
      paddingHorizontal: typography.padding.md,
      borderRadius: typography.borderRadius.sm,
      borderWidth: typography.borderWidth.thin,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: typography.spacing.md,
    } as ViewStyle,
    phoneInputWrapper: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    phoneInput: {
      marginBottom: 0,
    } as ViewStyle,
    countryCodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 8,
    } as ViewStyle,
    dropdownIcon: {
      marginLeft: 4,
    } as TextStyle,
    // New styles for improved PhoneInputSection
    countryCodeSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: typography.padding.md,
      paddingVertical: typography.padding.sm,
      minWidth: 90,
      justifyContent: 'center',
      borderWidth: 1,
      height: 50,
      borderRadius: 12,
      borderColor: 'gray',
    } as ViewStyle,
    flagText: {
      fontSize: 24,
      marginRight: 4,
    } as TextStyle,
    phoneCodeText: {
      fontWeight: typography.fontWeight.semiBold,
      marginRight: 2,
    } as TextStyle,
    inputBoxContainer: {
      flex: 1,
      marginBottom: 0,
      width: '100%',
    } as ViewStyle,
    // inputBox: {
    //   paddingLeft: typography.padding.sm,
    // } as TextStyle,
    inputBox: {
      paddingVertical: 0,
      height: '100%',
      textAlignVertical: 'center',
    },
    helperText: {
      marginTop: typography.spacing.xs,
      marginLeft: typography.spacing.md,
    } as TextStyle,
  });

// ============== SocialLoginSection Styles ==============

export const socialLoginSectionStyles = (
  colors: any,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: typography.spacing.xl,
    } as ViewStyle,
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: typography.spacing.xl,
    } as ViewStyle,
    dividerLine: {
      flex: 1,
      height: typography.borderWidth.thin,
    } as ViewStyle,
    dividerText: {
      paddingHorizontal: typography.spacing.md,
      fontWeight: typography.fontWeight.semiBold,
      letterSpacing: typography.letterSpacing.wide,
    } as TextStyle,
    socialButton: {
      marginBottom: typography.spacing.md,
    } as ViewStyle,
  });

// ============== TermsAndConditions Styles ==============

export const termsAndConditionsStyles = (
  colors: any,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: typography.spacing.xl,
      paddingHorizontal: typography.spacing.lg,
    } as ViewStyle,
    termsText: {
      fontFamily: 'Inter',
      fontWeight: '400', // Regular
      fontSize: 12,

      lineHeight: 12, // 100%
      textAlign: 'center',

      letterSpacing: 0, // explicit (figma match)
    },
    link: {
      textDecorationLine: 'underline' as const,
    } as TextStyle,
  });

// ============== GuestSkipButton Styles ==============

export const guestSkipButtonStyles = (
  colors: any,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: typography.spacing.xl,
      alignSelf: 'center',
      paddingVertical: typography.padding.md,
      paddingHorizontal: typography.padding.xl,
    } as ViewStyle,
  });

// ============== SignupButton Styles ==============

export const signupButtonStyles = (
  colors: any,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: typography.spacing.lg,
      alignSelf: 'center',
      paddingVertical: typography.padding.sm,
      paddingHorizontal: typography.padding.md,
    },
    link: {
      textDecorationLine: 'underline',
    },
  });

// Export all styles as a combined object
export const loginStyles = {
  loginScreen: loginScreenStyles,
  logoSection: logoSectionStyles,
  phoneInputSection: phoneInputSectionStyles,
  socialLoginSection: socialLoginSectionStyles,
  termsAndConditions: termsAndConditionsStyles,
  guestSkipButton: guestSkipButtonStyles,
  signupButton: signupButtonStyles,
};

export default loginStyles;
