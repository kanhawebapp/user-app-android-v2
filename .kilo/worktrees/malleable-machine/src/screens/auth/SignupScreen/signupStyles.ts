
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// ============== SignupScreen Styles ==============

export const signupScreenStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      flex: 1,
    } as ViewStyle,
    scrollContent: {
      flexGrow: 1,
    } as ViewStyle,
    cardContainer: {
      backgroundColor: colors.common.white,
      padding: 24,
      height: '100%',
    } as ViewStyle,
    errorContainer: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: colors.error.light + '20',
      borderRadius: 8,
    } as ViewStyle,
    signupButton: {
      marginTop: 8,
      marginBottom: 0,
    } as ViewStyle,
  });

// ============== LogoSection Styles ==============

export const logoSectionStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 32,
    } as ViewStyle,
    logoContainer: {
      width: 130,
      height: 130,
      borderRadius: 65,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    } as ViewStyle,
    appName: {
      marginBottom: 8,
    } as TextStyle,
    tagline: {
      opacity: 0.8,
    } as TextStyle,
  });

// ============== SignupFormSection Styles ==============

export const signupFormSectionStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    } as ViewStyle,
    inputGroup: {
      marginBottom: 16,
    } as ViewStyle,
    label: {
      marginBottom: 12,
      fontWeight: '500',
    } as TextStyle,
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    countryCode: {
      height: 54,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    } as ViewStyle,
    phoneInputWrapper: {
      flex: 1,
    } as ViewStyle,
  });

// ============== SocialLoginSection Styles ==============

export const socialLoginSectionStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: 16,
    } as ViewStyle,
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    } as ViewStyle,
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border.light,
    } as ViewStyle,
    dividerText: {
      paddingHorizontal: 16,
      fontWeight: '600',
      letterSpacing: 2,
    } as TextStyle,
    socialButton: {
      marginBottom: 12,
    } as ViewStyle,
  });

// ============== TermsAndConditions Styles ==============

export const termsAndConditionsStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      paddingHorizontal: 16,
    } as ViewStyle,
    termsText: {
      lineHeight: 18,
      textAlign: 'center',
    } as TextStyle,
    link: {
      textDecorationLine: 'underline' as const,
    } as TextStyle,
  });

// ============== LoginRedirect Styles ==============

export const loginRedirectStyles = (colors: any): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      marginTop: 24,
      alignItems: 'center',
      paddingVertical: 12,
    } as ViewStyle,
    link: {
      textDecorationLine: 'underline' as const,
    } as TextStyle,
  });

// Export all styles as a combined object
export const signupStyles = {
  signupScreen: signupScreenStyles,
  logoSection: logoSectionStyles,
  signupFormSection: signupFormSectionStyles,
  socialLoginSection: socialLoginSectionStyles,
  termsAndConditions: termsAndConditionsStyles,
  loginRedirect: loginRedirectStyles,
};

export default signupStyles;

