// ============================================
// DhwaniAstro - Helper Functions
// ============================================

import { Platform } from 'react-native';
import { VALIDATION_RULES, DATE_FORMATS } from '../constants/app.constants';
import type { DeepLinkPayload, DeepLinkType } from '../types/global.types';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (simple validation)
 */
export const isValidPhoneNumber = (
  phone: string,
  _countryCode: string = '+91'
): boolean => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[+\s-]/g, ''));
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    errors.push(`Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`);
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

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate name format
 */
export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  if (trimmed.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return false;
  }
  if (trimmed.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return false;
  }
  // Only allow letters, spaces, and some special characters
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(trimmed);
};

/**
 * Format currency value
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (
  date: string | Date,
  format: string = DATE_FORMATS.DISPLAY_DATE
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  switch (format) {
    case DATE_FORMATS.DISPLAY_DATE:
      return `${day} ${getMonthName(d.getMonth())} ${year}`;
    case DATE_FORMATS.DISPLAY_DATE_TIME:
      return `${day} ${getMonthName(d.getMonth())} ${year}, ${formatTime(d)}`;
    case DATE_FORMATS.DATE_INDIA:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.ISO:
      return `${year}-${month}-${day}`;
    default:
      return `${day} ${getMonthName(d.getMonth())} ${year}`;
  }
};

/**
 * Format time for display
 */
export const formatTime = (
  date: string | Date,
  format: '12h' | '24h' = '12h'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (format === '24h') {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else {
    return formatDate(d, DATE_FORMATS.DISPLAY_DATE);
  }
};

/**
 * Format duration from seconds
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

/**
 * Get month name
 */
export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[monthIndex] || '';
};

/**
 * Get day name
 */
export const getDayName = (date: Date): string => {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  return days[date.getDay()] || '';
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a short ID
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T>(
  str: string,
  fallback: T
): T => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text
 */
export const truncate = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Parse deep link URL
 */
export const parseDeepLink = (url: string): DeepLinkPayload | null => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const params: Record<string, string> = {};

    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    let type: DeepLinkType = 'generic';

    if (path.includes('astrologer')) {
      type = 'astrologer_profile';
    } else if (path.includes('chat')) {
      type = 'chat_session';
    } else if (path.includes('call')) {
      type = 'call_session';
    } else if (path.includes('wallet')) {
      type = 'wallet';
    } else if (path.includes('payment')) {
      type = 'payment';
    } else if (path.includes('notification')) {
      type = 'notification';
    }

    return {
      type,
      params,
      path,
    };
  } catch {
    return null;
  }
};

/**
 * Build deep link URL
 */
export const buildDeepLink = (
  type: DeepLinkType,
  params: Record<string, string>
): string => {
  const baseUrl = 'dhwaniastro://';

  switch (type) {
    case 'astrologer_profile':
      return `${baseUrl}astrologer/${params.astrologerId}`;
    case 'chat_session':
      return `${baseUrl}chat/${params.sessionId}`;
    case 'call_session':
      return `${baseUrl}call/${params.sessionId}`;
    case 'wallet':
      return `${baseUrl}wallet`;
    case 'payment':
      return `${baseUrl}payment/${params.orderId}`;
    default:
      return baseUrl;
  }
};

/**
 * Get platform-specific value
 */
export const getPlatformValue = <T>(
  ios: T,
  android: T,
  defaultValue: T
): T => {
  if (Platform.OS === 'ios') {
    return ios;
  } else if (Platform.OS === 'android') {
    return android;
  }
  return defaultValue;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
};

/**
 * Group array by key
 */
export const groupBy = <T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 */
export const sortBy = <T>(
  array: T[],
  keyFn: (item: T) => number | string,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Mask sensitive data (e.g., card number, phone)
 */
export const maskData = (
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string => {
  if (data.length <= visibleChars) {
    return data;
  }
  const masked = maskChar.repeat(data.length - visibleChars);
  const visible = data.slice(-visibleChars);
  return masked + visible;
};

/**
 * Format card number for display
 */
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

/**
 * Format UPI ID
 */
export const formatUPIId = (upiId: string): string => {
  return upiId.toLowerCase();
};

/**
 * Calculate age from DOB
 */
export const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Get zodiac sign from DOB
 */
export const getZodiacSign = (dateOfBirth: string): string => {
  const dob = new Date(dateOfBirth);
  const month = dob.getMonth() + 1;
  const day = dob.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

