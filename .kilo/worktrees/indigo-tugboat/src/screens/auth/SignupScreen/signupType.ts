
// ============== SignupScreen Types ==============

export interface SignupScreenProps {
  // Navigation handlers
  onSignupSuccess?: () => void;
  onLoginPress?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

// ============== LogoSection Types ==============

export interface LogoSectionProps {
  testID?: string;
}

// ============== SignupFormSection Types ==============

export interface SignupFormSectionProps {
  // Name
  name: string;
  onNameChange: (text: string) => void;
  nameError?: string | null;
  isNameValid?: boolean;

  // Email
  email: string;
  onEmailChange: (text: string) => void;
  emailError?: string | null;
  isEmailValid?: boolean;

  // Phone
  phone: string;
  onPhoneChange: (text: string) => void;
  phoneError?: string | null;
  isPhoneValid?: boolean;

  // Password
  password: string;
  onPasswordChange: (text: string) => void;
  passwordError?: string | null;
  isPasswordValid?: boolean;

  // Confirm Password
  confirmPassword: string;
  onConfirmPasswordChange: (text: string) => void;
  confirmPasswordError?: string | null;
  isConfirmPasswordValid?: boolean;

  testID?: string;
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

// ============== LoginRedirect Types ==============

export interface LoginRedirectProps {
  onPress: () => void;
  testID?: string;
}

