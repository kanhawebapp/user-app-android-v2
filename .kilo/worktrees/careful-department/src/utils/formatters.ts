// ============================================
// DhwaniAstro - Formatter Functions
// ============================================

import { Platform } from 'react-native';
import { DATE_FORMATS } from '../constants/app.constants';
import { CURRENCY, ZODIAC_SIGNS } from '../constants/api.constants';
import {
  formatDate,
  formatTime,
  formatDuration,
} from './helpers';

/**
 * Format phone number for display
 */
export const formatPhoneNumberForDisplay = (
  phone: string,
  countryCode: string = '+91'
): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${countryCode} ${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return `${countryCode} ${cleaned}`;
};

/**
 * Format phone number for API
 */
export const formatPhoneNumberForApi = (
  phone: string,
  countryCode: string = '+91'
): string => {
  return `${countryCode}${phone.replace(/\D/g, '')}`;
};

/**
 * Format currency for display
 */
export const formatCurrencyForDisplay = (
  amount: number,
  showSymbol: boolean = true
): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
};

/**
 * Format wallet balance
 */
export const formatWalletBalance = (balance: number): string => {
  if (balance >= 10000000) {
    return `${CURRENCY.SYMBOL}${(balance / 10000000).toFixed(1)}Cr`;
  } else if (balance >= 100000) {
    return `${CURRENCY.SYMBOL}${(balance / 100000).toFixed(1)}L`;
  } else if (balance >= 1000) {
    return `${CURRENCY.SYMBOL}${(balance / 1000).toFixed(1)}K`;
  }
  return formatCurrencyForDisplay(balance);
};

/**
 * Format rate per minute
 */
export const formatRatePerMinute = (rate: number): string => {
  return `${CURRENCY.SYMBOL}${rate}/min`;
};

/**
 * Format timestamp for chat
 */
export const formatChatTimestamp = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return formatTime(d, '12h');
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return formatDate(d, 'EEEE');
  }

  return formatDate(d, DATE_FORMATS.MESSAGE);
};

/**
 * Format date for transaction history
 */
export const formatTransactionDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDate(d, DATE_FORMATS.DATE_INDIA);
};

/**
 * Format call duration
 */
export const formatCallDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * Format last active time
 */
export const formatLastActive = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
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
  }

  return formatDate(d, DATE_FORMATS.DISPLAY_DATE);
};

/**
 * Format rating
 */
export const formatRating = (rating: number, maxRating: number = 5): string => {
  return rating.toFixed(1);
};

/**
 * Format experience years
 */
export const formatExperience = (years: number): string => {
  if (years === 0) {
    return 'New';
  } else if (years === 1) {
    return '1 year';
  }
  return `${years} years`;
};

/**
 * Format review count
 */
export const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return count.toString();
};

/**
 * Format consultation count
 */
export const formatConsultationCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  total: number,
  decimals: number = 0
): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format countdown timer
 */
export const formatCountdown = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Format seconds to readable duration
 */
export const formatReadableDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
};

/**
 * Format age
 */
export const formatAge = (years: number): string => {
  if (years === 0) return '';
  return `${years}y`;
};

/**
 * Format zodiac sign with emoji
 */
export const formatZodiacSign = (sign: string): string => {
  const emojiMap: Record<string, string> = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓',
  };

  const emoji = emojiMap[sign] || '';
  return `${emoji} ${sign}`.trim();
};

/**
 * Format online status
 */
export const formatOnlineStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
    on_call: 'On Call',
    away: 'Away',
  };

  return statusMap[status] || status;
};

/**
 * Format message preview
 */
export const formatMessagePreview = (
  message: string,
  maxLength: number = 50
): string => {
  const trimmed = message.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 3)}...`;
};

/**
 * Format transaction type
 */
export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    credit: 'Added',
    debit: 'Spent',
    refund: 'Refunded',
    payout: 'Withdrawn',
    reversal: 'Reversed',
    bonus: 'Bonus',
  };

  return typeMap[type] || type;
};

/**
 * Format transaction status
 */
export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  return statusMap[status] || status;
};

/**
 * Format payment method
 */
export const formatPaymentMethod = (method: {
  type: string;
  provider?: string;
  lastFour?: string;
}): string => {
  if (method.type === 'card' && method.provider && method.lastFour) {
    return `${method.provider} •••• ${method.lastFour}`;
  } else if (method.type === 'upi') {
    return `UPI`;
  } else if (method.type === 'net_banking') {
    return 'Net Banking';
  } else if (method.type === 'wallet') {
    return 'Wallet';
  }

  return method.type;
};

/**
 * Format notification time
 */
export const formatNotificationTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  return formatDate(d, DATE_FORMATS.DISPLAY_DATE);
};

/**
 * Format time ago
 */
export const formatTimeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear >= 1) return `${diffYear}y`;
  if (diffMonth >= 1) return `${diffMonth}mo`;
  if (diffWeek >= 1) return `${diffWeek}w`;
  if (diffDay >= 1) return `${diffDay}d`;
  if (diffHour >= 1) return `${diffHour}h`;
  if (diffMin >= 1) return `${diffMin}m`;
  return 'Just now';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format phone to masked string
 */
export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return `****${cleaned.slice(-4)}`;
};

/**
 * Format email to masked string
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.charAt(0) + 
    '*'.repeat(Math.max(local.length - 2, 1)) + 
    local.charAt(local.length - 1);
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Get platform-specific format
 */
export const getPlatformFormat = <T>(
  ios: T,
  android: T
): T => {
  if (Platform.OS === 'ios') {
    return ios;
  }
  return android;
};