// ============================================
// DhwaniAstro - Validator Functions
// ============================================

import {VALIDATION_RULES, ERROR_MESSAGES} from '../constants/app.constants';
import {CURRENCY} from '../constants/api.constants';
import type {ApiError} from '../types/global.types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate phone number
 */
export const validatePhoneNumber = (
  phone: string,
  countryCode: string = '+91',
): ValidationResult => {
  const errors: string[] = [];
  const cleanedPhone = phone.replace(/[+\s-]/g, '');

  if (!cleanedPhone) {
    errors.push('Phone number is required');
  } else if (cleanedPhone.length < VALIDATION_RULES.PHONE_MIN_LENGTH) {
    errors.push(
      `Phone number must be at least ${VALIDATION_RULES.PHONE_MIN_LENGTH} digits`,
    );
  } else if (cleanedPhone.length > VALIDATION_RULES.PHONE_MAX_LENGTH) {
    errors.push(
      `Phone number must be less than ${VALIDATION_RULES.PHONE_MAX_LENGTH} digits`,
    );
  } else if (!/^[0-9]+$/.test(cleanedPhone)) {
    errors.push('Phone number must contain only digits');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password
 */
export const validatePasswordField = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      errors.push(
        `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
      );
    }
    if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
      errors.push(
        `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
      );
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate name
 */
export const validateName = (
  name: string,
  fieldName: string = 'Name',
): ValidationResult => {
  const errors: string[] = [];
  const trimmed = name.trim();

  if (!trimmed) {
    errors.push(`${fieldName} is required`);
  } else if (trimmed.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.push(
      `${fieldName} must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`,
    );
  } else if (trimmed.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    errors.push(
      `${fieldName} must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
    );
  } else if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    errors.push(
      `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate OTP
 */
export const validateOTP = (otp: string): ValidationResult => {
  const errors: string[] = [];

  if (!otp) {
    errors.push('OTP is required');
  } else if (otp.length !== VALIDATION_RULES.OTP_LENGTH) {
    errors.push(`OTP must be ${VALIDATION_RULES.OTP_LENGTH} digits`);
  } else if (!/^[0-9]+$/.test(otp)) {
    errors.push('OTP must contain only digits');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate amount
 */
export const validateAmount = (
  amount: number,
  min: number = 1,
  max?: number,
): ValidationResult => {
  const errors: string[] = [];

  if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  } else if (amount < min) {
    errors.push(`Minimum amount is ${CURRENCY.SYMBOL}${min}`);
  } else if (max && amount > max) {
    errors.push(`Maximum amount is ${CURRENCY.SYMBOL}${max}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate UPI ID
 */
export const validateUPIId = (upiId: string): ValidationResult => {
  const errors: string[] = [];

  if (!upiId) {
    errors.push('UPI ID is required');
  } else if (!VALIDATION_RULES.UPI_ID_REGEX.test(upiId)) {
    errors.push('Please enter a valid UPI ID');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate message content
 */
export const validateMessage = (content: string): ValidationResult => {
  const errors: string[] = [];
  const trimmed = content.trim();

  if (!trimmed) {
    errors.push('Message cannot be empty');
  } else if (trimmed.length > VALIDATION_RULES.MESSAGE_MAX_LENGTH) {
    errors.push(
      `Message must be less than ${VALIDATION_RULES.MESSAGE_MAX_LENGTH} characters`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (dob: string): ValidationResult => {
  const errors: string[] = [];

  if (!dob) {
    errors.push('Date of birth is required');
  } else {
    const date = new Date(dob);
    const now = new Date();

    if (isNaN(date.getTime())) {
      errors.push('Please enter a valid date');
    } else if (date >= now) {
      errors.push('Date of birth must be in the past');
    } else {
      const age = now.getFullYear() - date.getFullYear();
      if (age > 150) {
        errors.push('Please enter a valid date of birth');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate API error response
 */
export const validateApiError = (error: unknown): ApiError => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  ) {
    return error as ApiError;
  }

  return {
    code: 'UNKNOWN',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
  };
};

/**
 * Compose multiple validators
 */
export const composeValidators = (
  ...validators: Array<(value: string) => ValidationResult>
): ((value: string) => ValidationResult) => {
  return (value: string): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return {isValid: true, errors: []};
  };
};

/**
 * Validate form object
 */
export const validateForm = <T extends Record<string, string>>(
  data: T,
  rules: Partial<Record<keyof T, (value: string) => ValidationResult>>,
): ValidationResult & {fieldErrors: Partial<Record<keyof T, string[]>>} => {
  const fieldErrors: Partial<Record<keyof T, string[]>> = {};
  let hasErrors = false;

  Object.entries(rules).forEach(([key, validator]) => {
    const value = data[key as keyof T];
    const result = validator!(value);

    if (!result.isValid) {
      fieldErrors[key as keyof T] = result.errors;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    errors: hasErrors ? ['Please fix the errors above'] : [],
    fieldErrors,
  };
};

/**
 * Sanitize input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, VALIDATION_RULES.MESSAGE_MAX_LENGTH);
};

/**
 * Validate card number (Luhn algorithm)
 */
export const validateCardNumber = (cardNumber: string): ValidationResult => {
  const errors: string[] = [];
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    errors.push('Invalid card number length');
    return {isValid: false, errors};
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    errors.push('Invalid card number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate expiry date
 */
export const validateExpiryDate = (expiry: string): ValidationResult => {
  const errors: string[] = [];

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.push('Expiry must be in MM/YY format');
    return {isValid: false, errors};
  }

  const [month, year] = expiry.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (month < 1 || month > 12) {
    errors.push('Invalid month');
  } else if (
    year < currentYear ||
    (year === currentYear && month < currentMonth)
  ) {
    errors.push('Card has expired');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate CVV
 */
export const validateCVV = (
  cvv: string,
  cardNumber?: string,
): ValidationResult => {
  const errors: string[] = [];

  if (!/^\d{3,4}$/.test(cvv)) {
    errors.push('CVV must be 3 or 4 digits');
    return {isValid: false, errors};
  }

  // For Amex, CVV should be 4 digits
  if (cardNumber?.startsWith('34') || cardNumber?.startsWith('37')) {
    if (cvv.length !== 4) {
      errors.push('CVV must be 4 digits for American Express');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
