/**
 * useSignupValidation Hook
 * Custom hook for handling signup form validation
 */

import {useState, useCallback, useMemo} from 'react';

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface UseSignupValidationProps {
  initialValues?: Partial<SignupFormData>;
}

interface UseSignupValidationReturn {
  // Form fields
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Field handlers
  handleNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handlePhoneChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;

  // Validation states
  nameError: string | null;
  emailError: string | null;
  phoneError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;

  // Overall validation
  isValid: boolean;
  isNameValid: boolean;
  isEmailValid: boolean;
  isPhoneValid: boolean;
  isPasswordValid: boolean;
  isConfirmPasswordValid: boolean;

  // Helper
  getFieldError: (field: keyof SignupFormData) => string | null;
  validateAll: () => boolean;
  reset: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;
const PHONE_MIN_LENGTH = 10;

export const useSignupValidation = ({
  initialValues = {},
}: UseSignupValidationProps = {}): UseSignupValidationReturn => {
  const [name, setName] = useState(initialValues.name || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');
  const [password, setPassword] = useState(initialValues.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    initialValues.confirmPassword || '',

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  // Validate name
  const validateName = useCallback((value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  }, []);

  // Validate email
  const validateEmail = useCallback((value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }, []);

  // Validate phone
  const validatePhone = useCallback((value: string): string | null => {
    if (!value || value.length === 0) {
      return 'Phone number is required';
    }
    if (value.length < PHONE_MIN_LENGTH) {
      return `Phone number must be ${PHONE_MIN_LENGTH} digits`;
    }
    return null;
  }, []);

  // Validate password
  const validatePassword = useCallback((value: string): string | null => {
    if (!value || value.length === 0) {
      return 'Password is required';
    }
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    return null;
  }, []);

  // Validate confirm password
  const validateConfirmPassword = useCallback(
    (value: string, pwd: string): string | null => {
      if (!value || value.length === 0) {
        return 'Please confirm your password';
      }
      if (value !== pwd) {
        return 'Passwords do not match';
      }
      return null;
    },
    [],
  );

  // Field change handlers
  const handleNameChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^a-zA-Z\s]/g, '');
      setName(cleaned);
      if (nameError) {
        setNameError(null);
      }
    },
    [nameError],
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text.toLowerCase().trim());
      if (emailError) {
        setEmailError(null);
      }
    },
    [emailError],
  );

  const handlePhoneChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '');
      const truncated = cleaned.slice(0, 10);
      setPhone(truncated);
      if (phoneError) {
        setPhoneError(null);
      }
    },
    [phoneError],
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (passwordError) {
        setPasswordError(null);
      }
    },
    [passwordError],
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      if (confirmPasswordError) {
        setConfirmPasswordError(null);
      }
    },
    [confirmPasswordError],
  );

  // Individual field validation states
  const isNameValid = useMemo(() => name.trim().length >= 2, [name]);
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isPhoneValid = useMemo(() => phone.length >= PHONE_MIN_LENGTH, [phone]);
  const isPasswordValid = useMemo(
    () => password.length >= PASSWORD_MIN_LENGTH,
    [password],
  );
  const isConfirmPasswordValid = useMemo(
    () => confirmPassword.length > 0 && confirmPassword === password,
    [confirmPassword, password],
  );

  // Overall form validity
  const isValid = useMemo(
    () =>
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid,
    [
      isNameValid,
      isEmailValid,
      isPhoneValid,
      isPasswordValid,
      isConfirmPasswordValid,
    ],
  );

  // Get field error
  const getFieldError = useCallback(
    (field: keyof SignupFormData): string | null => {
      switch (field) {
        case 'name':
          return nameError;
        case 'email':
          return emailError;
        case 'phone':
          return phoneError;
        case 'password':
          return passwordError;
        case 'confirmPassword':
          return confirmPasswordError;
        default:
          return null;
      }
    },
    [nameError, emailError, phoneError, passwordError, confirmPasswordError],
  );

  // Validate all fields and set errors
  const validateAll = useCallback((): boolean => {
    const newNameError = validateName(name);
    const newEmailError = validateEmail(email);
    const newPhoneError = validatePhone(phone);
    const newPasswordError = validatePassword(password);
    const newConfirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password,
    );

    setNameError(newNameError);
    setEmailError(newEmailError);
    setPhoneError(newPhoneError);
    setPasswordError(newPasswordError);
    setConfirmPasswordError(newConfirmPasswordError);

    return !(
      newNameError ||
      newEmailError ||
      newPhoneError ||
      newPasswordError ||
      newConfirmPasswordError
    );
  }, [
    name,
    email,
    phone,
    password,
    confirmPassword,
    validateName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateConfirmPassword,
  ]);

  // Reset form
  const reset = useCallback(() => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setNameError(null);
    setEmailError(null);
    setPhoneError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }, []);

  return {
    // Form fields
    name,
    email,
    phone,
    password,
    confirmPassword,

    // Field handlers
    handleNameChange,
    handleEmailChange,
    handlePhoneChange,
    handlePasswordChange,
    handleConfirmPasswordChange,

    // Validation states
    nameError,
    emailError,
    phoneError,
    passwordError,
    confirmPasswordError,

    // Overall validation
    isValid,
    isNameValid,
    isEmailValid,
    isPhoneValid,
    isPasswordValid,
    isConfirmPasswordValid,

    // Helper
    getFieldError,
    validateAll,
    reset,
  };
};

export default useSignupValidation;
