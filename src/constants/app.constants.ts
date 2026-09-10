// ============================================
// DhwaniAstro - App Constants
// ============================================

/**
 * Application-wide constants
 */

// ============================================
// App Info
// ============================================

export const APP_INFO = {
  NAME: 'DhwaniAstro',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  PACKAGE_NAME: 'com.DhwaniAstro.app',
  BUNDLE_ID: 'com.DhwaniAstro.app',
} as const;

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',

  // Session
  ACTIVE_SESSION: 'active_session',
  SESSION_HISTORY: 'session_history',
  CRASH_RECOVERY_STATE: 'crash_recovery_state',

  // Chat
  CHAT_CACHE: 'chat_cache',
  MESSAGE_QUEUE: 'message_queue',
  DRAFT_MESSAGES: 'draft_messages',

  // App State
  APP_STATE: 'app_state',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Cachegd 
  ASTROLOGER_CACHE: 'astrologer_cache',
  USER_CACHE: 'user_cache',
  NOTIFICATION_CACHE: 'notification_cache',

  // Settings
  SETTINGS: 'settings',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
  FCM_TOKEN: 'fcm_token',

  // Analytics
  ANALYTICS_USER_ID: 'analytics_user_id',
  SESSION_START_TIME: 'session_start_time',

  // Debug
  DEBUG_LOGS: 'debug_logs',
} as const;

// ============================================
// Validation Rules
// ============================================

export const VALIDATION_RULES = {
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 12,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 32,
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 2000,
  OTP_LENGTH: 6,
  PIN_LENGTH: 4,
  UPI_ID_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
} as const;

// ============================================
// Timeouts
// ============================================

export const TIMEOUTS = {
  // Auth
  OTP_RESEND_DELAY: 30000, // 30 seconds
  SESSION_EXPIRY: 3600000, // 1 hour
  AUTO_LOGOUT_DELAY: 1800000, // 30 minutes

  // UI
  DEBOUNCE: 300,
  THROTTLE: 500,
  DOUBLE_TAP: 300,
  ANIMATION_SHORT: 200,
  ANIMATION_MEDIUM: 300,
  ANIMATION_LONG: 500,

  // Loading
  SKELETON_LOADING: 800,
  INITIAL_LOADING: 500,
  REFRESH_TIMEOUT: 5000,

  // Toast/Snackbar
  TOAST_SHORT: 2000,
  TOAST_MEDIUM: 3000,
  TOAST_LONG: 4500,
} as any;

// ============================================
// Animation Constants
// ============================================

export const ANIMATION = {
  SPRING_CONFIG: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  TIMING_CONFIG: {
    duration: 300,
  },
  FADE_IN_OUT: {
    duration: 200,
  },
  SLIDE_IN_OUT: {
    duration: 300,
  },
} as const;

// ============================================
// Platform Constants
// ============================================

export const PLATFORM = {
  IS_IOS: require('react-native').Platform.OS === 'ios',
  IS_ANDROID: require('react-native').Platform.OS === 'android',
  IS_DEV: __DEV__,
} as const;

// ============================================
// Feature Flags
// ============================================

export const FEATURE_FLAGS = {
  ENABLE_VIDEO_CALLS: true,
  ENABLE_CHAT: true,
  ENABLE_WALLET: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_REANIMATED_ANIMATIONS: true,
  ENABLE_HERMES: true,
  ENABLE_DEBUG_MODE: __DEV__,
  ENABLE_LOGGING: __DEV__,
  ENABLE_NETWORK_LOGGING: __DEV__,
} as const;

// ============================================
// Default Values
// ============================================

export const DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_RATING: 5,
  MIN_RATING: 1,
  CURRENCY: '₹',
  LANGUAGE: 'en',
  COUNTRY_CODE: '+91',
  THEME: 'light',
} as const;

// ============================================
// BackgroundLayout Defaults
// ============================================

export const BACKGROUND_LAYOUT_DEFAULTS = {
  /** Default background color */
  BACKGROUND_COLOR: '#6200EE',
  /** Default overlay color (semi-transparent black) */
  OVERLAY_COLOR: 'rgba(0, 0, 0, 0.5)',
  /** Default overlay opacity */
  OVERLAY_OPACITY: 0.5,
  /** Default gradient direction */
  GRADIENT_DIRECTION: 'vertical' as const,
  /** Default blur radius (0 = disabled) */
  BLUR_RADIUS: 0,
  /** Default SafeAreaView usage */
  USE_SAFE_AREA: true,
  /** Default status bar visibility */
  STATUS_BAR_VISIBLE: true,
} as const;

// ============================================
// Emoji/Icon Constants
// ============================================

export const ICONS = {
  BACK: 'arrow-back',
  FORWARD: 'arrow-forward',
  HOME: 'home',
  CHAT: 'chat',
  CALL: 'call',
  WALLET: 'wallet',
  PROFILE: 'person',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  SEARCH: 'search',
  FILTER: 'filter',
  MORE: 'more-vert',
  CLOSE: 'close',
  CHECK: 'check',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  STAR: 'star',
  HEART: 'favorite',
  SHARE: 'share',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  REFRESH: 'refresh',
  DELETE: 'delete',
  EDIT: 'edit',
  ADD: 'add',
  REMOVE: 'remove',
  MIC: 'mic',
  MIC_OFF: 'mic-off',
  VIDEO_CAMERA: 'videocam',
  VIDEO_OFF: 'videocam-off',
  PHONE: 'phone',
  PHONE_DISABLED: 'phone-disabled',
  SEND: 'send',
  ATTACHMENT: 'attach-file',
  IMAGE: 'image',
  DOCUMENT: 'description',
  LOCATION: 'location-on',
} as const;

// ============================================
// Date/Time Formats
// ============================================

export const DATE_FORMATS = {
  DISPLAY_DATE: 'DD MMM YYYY',
  DISPLAY_TIME: 'HH:mm',
  DISPLAY_DATE_TIME: 'DD MMM YYYY, HH:mm',
  DISPLAY_FULL: 'EEEE, dd MMMM yyyy',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  DATE_INDIA: 'dd/MM/yyyy',
  ISO: 'yyyy-MM-dd',
  MESSAGE: 'MMM dd, HH:mm',
  CHAT_TIMESTAMP: 'HH:mm',
  RELATIVE: 'relative',
} as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  // Network
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',

  // Auth
  INVALID_OTP: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',

  // Payment
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance. Please recharge.',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed. Contact support.',

  // Call
  CALL_CONNECTION_FAILED: 'Unable to connect call. Please try again.',
  CALL_DROPPED: 'Call was disconnected. Attempting to reconnect...',
  NO_ANSWER: 'No answer from the astrologer.',

  // Chat
  MESSAGE_FAILED: 'Failed to send message. Please try again.',
  CHAT_ENDED: 'This chat session has ended.',

  // General
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  TRY_AGAIN: 'Something went wrong. Please try again.',
} as const;

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP sent successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PAYMENT_SUCCESS: 'Payment successful!',
  MESSAGE_SENT: 'Message sent!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ASTROLOGER_FOLLOWED: 'Astrologer followed!',
  ASTROLOGER_UNFOLLOWED: 'Astrologer unfollowed!',
  SESSION_ENDED: 'Session ended successfully.',
  REVIEW_SUBMITTED: 'Thank you for your review!',
  WITHDRAWAL_INITIATED: 'Withdrawal initiated successfully!',
} as const;

// ============================================
// Supported Languages
// ============================================

export const LANGUAGES = [
  {code: 'en', name: 'English', nativeName: 'English'},
  {code: 'hi', name: 'Hindi', nativeName: 'हिंदी'},
  {code: 'ta', name: 'Tamil', nativeName: 'தமிழ்'},
  {code: 'te', name: 'Telugu', nativeName: 'తెలుగు'},
  {code: 'bn', name: 'Bengali', nativeName: 'বাংলা'},
  {code: 'mr', name: 'Marathi', nativeName: 'मराठी'},
  {code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી'},
  {code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ'},
  {code: 'ml', name: 'Malayalam', nativeName: 'മലയാളി'},
  {code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ'},
] as const;

// ============================================
// Country Codes
// ============================================

export interface CountryCode {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  {code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳'},
  {code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸'},
  {code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧'},
  {code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦'},
  {code: 'AU', name: 'Australia', phoneCode: '+61', flag: '🇦🇺'},
  {code: 'DE', name: 'Germany', phoneCode: '+49', flag: '🇩🇪'},
  {code: 'FR', name: 'France', phoneCode: '+33', flag: '🇫🇷'},
  {code: 'JP', name: 'Japan', phoneCode: '+81', flag: '🇯🇵'},
  {code: 'CN', name: 'China', phoneCode: '+86', flag: '🇨🇳'},
  {code: 'KR', name: 'South Korea', phoneCode: '+82', flag: '🇰🇷'},
  {code: 'BR', name: 'Brazil', phoneCode: '+55', flag: '🇧🇷'},
  {code: 'MX', name: 'Mexico', phoneCode: '+52', flag: '🇲🇽'},
  {code: 'IT', name: 'Italy', phoneCode: '+39', flag: '🇮🇹'},
  {code: 'ES', name: 'Spain', phoneCode: '+34', flag: '🇪🇸'},
  {code: 'NL', name: 'Netherlands', phoneCode: '+31', flag: '🇳🇱'},
  {code: 'SE', name: 'Sweden', phoneCode: '+46', flag: '🇸🇪'},
  {code: 'NO', name: 'Norway', phoneCode: '+47', flag: '🇳🇴'},
  {code: 'DK', name: 'Denmark', phoneCode: '+45', flag: '🇩🇰'},
  {code: 'FI', name: 'Finland', phoneCode: '+358', flag: '🇫🇮'},
  {code: 'CH', name: 'Switzerland', phoneCode: '+41', flag: '🇨🇭'},
  {code: 'AT', name: 'Austria', phoneCode: '+43', flag: '🇦🇹'},
  {code: 'BE', name: 'Belgium', phoneCode: '+32', flag: '🇧🇪'},
  {code: 'PT', name: 'Portugal', phoneCode: '+351', flag: '🇵🇹'},
  {code: 'PL', name: 'Poland', phoneCode: '+48', flag: '🇵🇱'},
  {code: 'RU', name: 'Russia', phoneCode: '+7', flag: '🇷🇺'},
  {code: 'UA', name: 'Ukraine', phoneCode: '+380', flag: '🇺🇦'},
  {code: 'ZA', name: 'South Africa', phoneCode: '+27', flag: '🇿🇦'},
  {code: 'NG', name: 'Nigeria', phoneCode: '+234', flag: '🇳🇬'},
  {code: 'EG', name: 'Egypt', phoneCode: '+20', flag: '🇪🇬'},
  {code: 'SA', name: 'Saudi Arabia', phoneCode: '+966', flag: '🇸🇦'},
  {code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', flag: '🇦🇪'},
  {code: 'SG', name: 'Singapore', phoneCode: '+65', flag: '🇸🇬'},
  {code: 'MY', name: 'Malaysia', phoneCode: '+60', flag: '🇲🇾'},
  {code: 'TH', name: 'Thailand', phoneCode: '+66', flag: '🇹🇭'},
  {code: 'ID', name: 'Indonesia', phoneCode: '+62', flag: '🇮🇩'},
  {code: 'PH', name: 'Philippines', phoneCode: '+63', flag: '🇵🇭'},
  {code: 'NZ', name: 'New Zealand', phoneCode: '+64', flag: '🇳🇿'},
  {code: 'PK', name: 'Pakistan', phoneCode: '+92', flag: '🇵🇰'},
  {code: 'BD', name: 'Bangladesh', phoneCode: '+880', flag: '🇧🇩'},
  {code: 'LK', name: 'Sri Lanka', phoneCode: '+94', flag: '🇱🇰'},
  {code: 'NP', name: 'Nepal', phoneCode: '+977', flag: '🇳🇵'},
  {code: 'MM', name: 'Myanmar', phoneCode: '+95', flag: '🇲🇲'},
  {code: 'VN', name: 'Vietnam', phoneCode: '+84', flag: '🇻🇳'},
  {code: 'HK', name: 'Hong Kong', phoneCode: '+852', flag: '🇭🇰'},
  {code: 'TW', name: 'Taiwan', phoneCode: '+886', flag: '🇹🇼'},
];

// ============================================
// Zodiac Signs
// ============================================

export const ZODIAC_SIGNS = [
  {id: 'aries', name: 'Aries', dateRange: 'Mar 21 - Apr 19', element: 'Fire'},
  {
    id: 'taurus',
    name: 'Taurus',
    dateRange: 'Apr 20 - May 20',
    element: 'Earth',
  },
  {id: 'gemini', name: 'Gemini', dateRange: 'May 21 - Jun 20', element: 'Air'},
  {
    id: 'cancer',
    name: 'Cancer',
    dateRange: 'Jun 21 - Jul 22',
    element: 'Water',
  },
  {id: 'leo', name: 'Leo', dateRange: 'Jul 23 - Aug 22', element: 'Fire'},
  {id: 'virgo', name: 'Virgo', dateRange: 'Aug 23 - Sep 22', element: 'Earth'},
  {id: 'libra', name: 'Libra', dateRange: 'Sep 23 - Oct 22', element: 'Air'},
  {
    id: 'scorpio',
    name: 'Scorpio',
    dateRange: 'Oct 23 - Nov 21',
    element: 'Water',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    dateRange: 'Nov 22 - Dec 21',
    element: 'Fire',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    dateRange: 'Dec 22 - Jan 19',
    element: 'Earth',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    dateRange: 'Jan 20 - Feb 18',
    element: 'Air',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    dateRange: 'Feb 19 - Mar 20',
    element: 'Water',
  },
] as const;

// ============================================
// Astrology Categories
// ============================================

export const ASTROLOGY_CATEGORIES = [
  'Vedic Astrology',
  'Numerology',
  'Tarot Reading',
  'Palmistry',
  'Prashna (Horary)',
  'KP Astrology',
  'Nadi Astrology',
  'Lal Kitab',
  'Vastu Shastra',
  'Muhurta',
  'Horoscope Matching',
] as const;

// ============================================
// Terms and Policy
// ============================================

export const TERMS_AND_POLICY = {
  // Login screen
  LOGIN_TERMS_PREFIX: 'By continuing, you agree to our',
  // Signup screen
  SIGNUP_TERMS_PREFIX: 'By signing up, you agree to our',
  // Common
  TERMS_OF_SERVICE: 'Terms of Service',
  PRIVACY_POLICY: 'Privacy Policy',
  AND: 'and',
} as const;

// ============================================
// Splash Labels - All UI text for Splash screens
// ============================================

export const SPLASH_LABEL = {
  REMEDIES: '',
  GUIDANCE: 'Unlock your Destiny with DhwaniAstro',
  TRANSFORMATION: '',
  ASTROLOGY_GUIDANCE: '',
  TRUSTED_GUIDANCE: 'Trusted Guidance',
  PERSONAL_REMEDIES: 'Personal Remedies',
  SHOP_PRODUCTS: 'Shop Abhimantrit Products',
};

// ============================================
// Auth Labels - All UI text for Authentication screens
// ============================================

export const AUTH_LABELS = {
  // Phone Input
  PHONE_LABEL: 'Phone Number',
  PHONE_PLACEHOLDER: 'Enter phone number',
  LOGIN_OR_SIGNUP: 'Login or Sign Up',
  PHONE_COUNTRY_CODE: '+91',
  TRUSTED_THOUSANDS: 'Trusted by thousands of users',
  // Name Input (Signup)
  NAME_LABEL: 'Full Name',
  NAME_PLACEHOLDER: 'Enter your full name',

  // Email Input (Signup)
  EMAIL_LABEL: 'Email Address',
  EMAIL_PLACEHOLDER: 'Enter your email',

  // Password Input (Signup)
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Create a password',

  // Confirm Password Input (Signup)
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm your password',

  // Login Screen Buttons
  GET_OTP_BUTTON: 'Get OTP',
  GET_OTP_LOADING: 'Sending...',
  CONTINUE_AS_GUEST: 'Explore App as Guest',

  // Signup Screen Buttons
  CREATE_ACCOUNT_BUTTON: 'Create Account',
  CREATE_ACCOUNT_LOADING: 'Creating Account...',

  // Social Login
  OR_DIVIDER: 'OR',
  CONTINUE_WITH_GOOGLE: 'Continue with Google',
  CONTINUE_WITH_FACEBOOK: 'Continue with Facebook',
  SIGNUP_WITH_GOOGLE: 'Sign up with Google',
  SIGNUP_WITH_FACEBOOK: 'Sign up with Facebook',

  // Signup Button
  DONT_HAVE_ACCOUNT: "Don't have an account?",
  SIGNUP_LINK: 'Sign up',
  OTP_DIDNT_RECEIVE: "Didn't receive the OTP?",

  // Login Redirect
  ALREADY_HAVE_ACCOUNT: 'Already have an account?',
  LOGIN_LINK: 'Log In',

  // OTP Modal
  OTP_TITLE: 'Enter OTP',
  OTP_SUBTITLE_PHONE: (phone: string) =>
    `We have sent a verification code to\n+91 ${phone}`,
  OTP_SUBTITLE_DEFAULT: 'Please enter the 4-digit code sent to your phone',
  OTP_RESEND_TIMER: (seconds: number) => `Resend OTP in ${seconds}s`,
  OTP_RESEND_BUTTON: 'Resend OTP',
  OTP_VERIFY_BUTTON: 'Verify & Continue',
  OTP_VERIFY_LOADING: 'Verifying...',
  OTP_ERROR_INCOMPLETE: 'Please enter complete OTP',
  CREATE_ACC_GET_STARTED: 'Create your account to get started',

  // Login Required Modal
  LOGIN_REQUIRED_TITLE: 'Login Required',
  LOGIN_REQUIRED_MESSAGE: 'Please login to perform this action',
  LOGIN_REQUIRED_MESSAGE_SUFFIX: 'it takes less than 10 seconds.',
  LOGIN_REQUIRED_LOGIN_BUTTON: 'Login',
  LOGIN_REQUIRED_SIGNUP_BUTTON: 'Sign Up',
  LOGIN_REQUIRED_GUEST_BUTTON: 'Continue as Guest',
} as const;

// ============================================
// Chat/Call Screen Labels - All UI text for ChatCall screens
// ============================================

export const CHAT_CALL_LABELS = {
  // Header
  CHAT_HEADER_TITLE: 'Chat with Astrologers',
  CALL_HEADER_TITLE: 'Call with Astrologers',
  CHAT_HEADER_SUBTITLE: (onlineCount: number) =>
    `Get instant chat readings • ${onlineCount} online now`,
  CALL_HEADER_SUBTITLE: (onlineCount: number) =>
    `Talk to our experts • ${onlineCount} online now`,

  // Tabs
  TAB_CHAT: 'Chat',
  TAB_CALL: 'Call',

  // Search
  SEARCH_PLACEHOLDER: 'Search astrologers...',

  // Filters
  FILTER_SHOWING: 'Showing',
  FILTER_OF: 'of',
  FILTER_ASTROLOGERS: 'astrologers',
  FILTER_TOGGLE_SHOW: 'Filters',
  FILTER_TOGGLE_HIDE: 'Hide Filters',
  FILTER_CLEAR_ALL: 'Clear All Filters',

  // Filter Options
  FILTER_STATUS_LABEL: 'Status',
  FILTER_STATUS_ALL: 'All',
  FILTER_STATUS_ONLINE: 'Online',
  FILTER_STATUS_OFFLINE: 'Offline',
  FILTER_PRICE_LABEL: 'Price',
  FILTER_RATING_LABEL: 'Rating',
  FILTER_LANGUAGE_LABEL: 'Language',

  // Empty State
  EMPTY_TITLE: 'No Astrologers Found',
  EMPTY_SUBTITLE:
    'Try adjusting your filters or search query to find more astrologers',

  // Astrologer Card
  CARD_EXPERIENCE: 'exp',
  CARD_CHAT: 'Chat',
  CARD_CALL: 'Call',
  CARD_VIEW_PROFILE: 'View Profile',
  CARD_PER_MINUTE: '/min',

  // Login Required Messages
  LOGIN_REQUIRED_MESSAGE: 'Please login to perform this action',
  LOGIN_REQUIRED_CHAT: (name: string) =>
    `Please login to start a chat with ${name}`,
  LOGIN_REQUIRED_CALL: (name: string) =>
    `Please login to make a call with ${name}`,
  LOGIN_REQUIRED_PROFILE: (name: string) =>
    `Please login to view ${name}'s profile`,
} as const;

// ============================================
// Wallet Screen Labels - All UI text for Wallet screens
// ============================================

export const WALLET_LABELS = {
  // Balance Card
  AVAILABLE_BALANCE: 'Available Balance',
  SECURE_PAYMENT: 'Secure Payment',
  PERCENT_SECURE: '100% Secure',
  RECHARGE: 'Recharge Wallet',
  WITHDRAW: 'Withdraw',
  MIN_BALANCE_WARNING: 'Use balance for calls, chats, and remedies etc',
  SELECT_RECHARGE: 'Select Recharge Amount',

  // Transaction List
  TRANSACTION_HISTORY: 'All Transaction',
  WALLET_RECHARGE: 'Wallet Recharge',
  SERVICE_PAYMENT: 'Service Payment',
  NO_TRANSACTIONS: 'No transactions found',
  TAB_ALL: 'All',
  TAB_CREDIT: 'Credit',
  TAB_DEBIT: 'Debit',

  // Recharge Bottom Sheet
  RECHARGE_WALLET: 'Recharge Wallet',
  CURRENT_BALANCE: 'Current Balance',
  SELECT_AMOUNT: 'Select Amount',
  OR_ENTER_CUSTOM_AMOUNT: 'Or enter custom amount',
  ENTER_AMOUNT: 'Enter amount',
  MIN_AMOUNT_LABEL: 'Min',
  MAX_AMOUNT_LABEL: 'Max',
  PAYMENT_METHOD: 'Payment Method',
  RECHARGE_AMOUNT: 'Recharge Amount',
  BONUS_AMOUNT: 'Bonus Amount',
  TOTAL_VALUE: 'Total Value',
  YOU_SAVE: (amount: number) => `You save ₹${amount} with this recharge!`,
  SELECT_AMOUNT_AND_PAYMENT: 'Select Amount & Payment Method',
  PAY_BUTTON: (amount: number) => `Pay ₹${amount}`,

  // Payment Methods
  PAYMENT_UPI: 'UPI',
  PAYMENT_DEBIT_CARD: 'Debit Card',
  PAYMENT_NET_BANKING: 'Net Banking',
  PAYMENT_WALLET: 'Wallet',

  // Recharge Options
  BONUS: (amount: number) => `+₹${amount} Bonus`,
  POPULAR: 'Popular',

  // Business Tip
  BUSINESS_TIP:
    'Tip: Maintaining a minimum balance ensures uninterrupted consultations with astrologers',

  // Selected Payment Display
  SELECTED_SUFFIX: 'selected',

  // Validation
  MIN_RECHARGE: 50,
  MAX_RECHARGE: 10000,
} as const;
