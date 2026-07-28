export interface LoginScreenProps {
  // Navigation handlers (optional - for external navigation control)
  onLoginSuccess?: () => void;
  onGuestLogin?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  onSignupPress?: () => void;
}

// ============== LogoSection Types ==============

export interface LogoSectionProps {
  testID?: string;
}

// ============== PhoneInputSection Types ==============

export interface PhoneInputSectionProps {
  phoneNumber: string;
  onPhoneChange: (text: string) => void;
  isValid: boolean;
  error?: string | null;
  testID?: string;
  selectedCountry?: {
    code: string;
    name: string;
    phoneCode: string;
    flag: string;
  };
  onCountryChange?: (country: {
    code: string;
    name: string;
    phoneCode: string;
    flag: string;
  }) => void;
}

// ============== SocialLoginSection Types ==============

export interface SocialLoginSectionProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
  isGoogleLoading?: boolean;
  isFacebookLoading?: boolean;
  testID?: string;
}

// ============== TermsAndConditions Types ==============

export interface TermsAndConditionsProps {
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  testID?: string;
}

// ============== GuestSkipButton Types ==============

export interface GuestSkipButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  testID?: string;
}

// ============== SignupButton Types ==============

export interface SignupButtonProps {
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

// ============== useLogin Hook Types ==============

export interface UseLoginProps {
  phoneNumber: string;
  onOTPRequested?: () => void;
  onOTPSuccess?: () => void;
  onLoginSuccess?: () => void;
  onLoginError?: (error: Error) => void;
}

export interface UsePhoneValidationProps {
  initialValue?: string;
  minLength?: number;
  maxLength?: number;
}

export interface UsePhoneValidationReturn {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  handlePhoneChange: (text: string) => void;
  isValid: boolean;
  error: string | null;
  formattedPhone: string;
  reset: () => void;
}

export interface UseLoginReturn {
  // OTP Login State
  isOTPRequested: boolean;
  isOTPVerifying: boolean;
  otpError: string | null;

  // Social Login State
  isGoogleLoading: boolean;
  isFacebookLoading: boolean;

  // Guest Login State
  isGuestLoading: boolean;

  // Actions
  requestOTP: () => Promise<{message: string} | undefined>;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  closeOTPModal: () => void;
  clearErrors: () => void;
}
