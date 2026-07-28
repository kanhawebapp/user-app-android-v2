// ============================================
// DhwaniAstro - API Constants
// ============================================

/**
 * Centralized API configuration constants
 * All API endpoints, timeouts, and retry policies
 *
 * Note: These values are now managed via the Config Store.
 * For dynamic values, use the config store hooks instead.
 */

// ============================================
// Base URLs - Default Values
// ============================================

export const API_BASE_URL = {
  PRODUCTION: 'https://api.dhwaniastro.com',
  STAGING: 'https://staging-api.dhwaniastro.com',
  DEVELOPMENT: 'https://dev-api.dhwaniastro.com',
} as const;

export const WS_BASE_URL = {
  PRODUCTION: 'wss://ws.dhwaniastro.com',
  STAGING: 'wss://staging-ws.dhwaniastro.com',
  DEVELOPMENT: 'wss://dev-ws.dhwaniastro.com',
} as const;

export const RTC_APP_ID = {
  PRODUCTION: 'YOUR_AGORA_APP_ID',
  STAGING: 'YOUR_STAGING_AGORA_APP_ID',
  DEVELOPMENT: 'YOUR_DEV_AGORA_APP_ID',
} as const;

// ============================================
// API Endpoints
// ============================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/v1/auth/login',
    VERIFY_OTP: '/v1/auth/verify-otp',
    REFRESH_TOKEN: '/v1/auth/refresh-token',
    LOGOUT: '/v1/auth/logout',
    CHANGE_PASSWORD: '/v1/auth/change-password',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
  },

  // User
  USER: {
    PROFILE: '/v1/user/profile',
    UPDATE_PROFILE: '/v1/user/profile',
    DEVICE_REGISTRATION: '/v1/user/device',
    DELETE_ACCOUNT: '/v1/user/account',
  },

  // Astrologer
  ASTROLOGER: {
    LIST: '/v1/astrologers',
    DETAIL: '/v1/astrologers/:astrologerId',
    REVIEWS: '/v1/astrologers/:astrologerId/reviews',
    FOLLOW: '/v1/astrologers/:astrologerId/follow',
    UNFOLLOW: '/v1/astrologers/:astrologerId/unfollow',
    FOLLOWED: '/v1/astrologers/followed',
    SEARCH: '/v1/astrologers/search',
    AVAILABILITY: '/v1/astrologers/:astrologerId/availability',
  },

  // Chat
  CHAT: {
    START: '/v1/chat/start',
    END: '/v1/chat/end',
    MESSAGES: '/v1/chat/sessions/:sessionId/messages',
    SEND_MESSAGE: '/v1/chat/sessions/:sessionId/messages',
    TYPING: '/v1/chat/sessions/:sessionId/typing',
    HISTORY: '/v1/chat/sessions/:sessionId/history',
    ACTIVE_SESSIONS: '/v1/chat/active-sessions',
  },

  // Call
  CALL: {
    INITIATE: '/v1/call/initiate',
    END: '/v1/call/end',
    RTC_TOKEN: '/v1/call/token',
    HISTORY: '/v1/call/history',
    RATING: '/v1/call/:sessionId/rating',
  },

  // Wallet
  WALLET: {
    BALANCE: '/v1/wallet/balance',
    TRANSACTIONS: '/v1/wallet/transactions',
    PAYMENT_ORDERS: '/v1/wallet/payment-orders',
    CREATE_ORDER: '/v1/wallet/payment-orders',
    VERIFY_PAYMENT: '/v1/wallet/verify-payment',
    WITHDRAWAL: '/v1/wallet/withdrawal',
    METHODS: '/v1/wallet/methods',
  },

  // Session
  SESSION: {
    ACTIVE: '/v1/session/active',
    CRASH_RECOVERY: '/v1/session/crash-recovery',
    HISTORY: '/v1/session/history',
    DETAIL: '/v1/session/:sessionId',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/v1/notifications',
    MARK_READ: '/v1/notifications/:notificationId/read',
    MARK_ALL_READ: '/v1/notifications/read-all',
    PREFERENCES: '/v1/notifications/preferences',
    UPDATE_PREFERENCES: '/v1/notifications/preferences',
  },

  // Reports
  REPORTS: {
    GENERATE: '/v1/reports/generate',
    DOWNLOAD: '/v1/reports/:reportId/download',
    HISTORY: '/v1/reports/history',
  },
} as const;

// ============================================
// HTTP Methods
// ============================================

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// ============================================
// Content Types
// ============================================

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  MULTIPART_FORM: 'multipart/form-data',
} as const;

// ============================================
// HTTP Status Codes
// ============================================

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirect
  MOVED_PERMANENTLY: 301,
  FOUND: 302,

  // Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Error
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ============================================
// Timeout Configuration
// ============================================

export const TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  LONG: 60000, // 60 seconds
  UPLOAD: 120000, // 2 minutes
  DOWNLOAD: 300000, // 5 minutes
  WEBSOCKET: Infinity,
} as const;

// ============================================
// Retry Configuration
// ============================================

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2,
  RETRYABLE_STATUS_CODES: [
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.BAD_GATEWAY,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.GATEWAY_TIMEOUT,
    HTTP_STATUS.TOO_MANY_REQUESTS,
  ],
} as const;

// ============================================
// WebSocket Configuration
// ============================================

export const WS_CONFIG = {
  RECONNECT_INTERVAL: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 25000, // 25 seconds
  PING_TIMEOUT: 10000, // 10 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
} as const;

// ============================================
// Pagination
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ============================================
// Rate Limiting
// ============================================

export const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 100,
  MESSAGE_THRESHOLD: 80, // 80% of max
} as const;

// ============================================
// Currency
// ============================================

export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  DECIMAL_PLACES: 2,
} as const;

// ============================================
// Chat Configuration
// ============================================

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_ATTACHMENTS: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf'],
  MESSAGE_BATCH_SIZE: 50,
  TYPING_TIMEOUT: 3000, // 3 seconds
  READ_RECEIPT_DELAY: 500, // 0.5 seconds
} as const;

// ============================================
// Call Configuration
// ============================================

export const CALL_CONFIG = {
  MIN_DURATION_BILLABLE: 60, // 60 seconds
  GRACE_PERIOD: 10, // 10 seconds before billing starts
  MAX_DURATION_PER_SESSION: 14400, // 4 hours
  RECONNECT_WINDOW: 30, // 30 seconds
  RTC_TOKEN_EXPIRY: 3600, // 1 hour
  MAX_RECONNECT_ATTEMPTS: 3,
  QUALITY_PRESETS: {
    low: {width: 320, height: 240, bitrate: 200},
    medium: {width: 640, height: 480, bitrate: 600},
    high: {width: 1280, height: 720, bitrate: 1500},
    hd: {width: 1920, height: 1080, bitrate: 3000},
  },
} as const;

// ============================================
// Payment Configuration
// ============================================

export const PAYMENT_CONFIG = {
  MIN_RECHARGE_AMOUNT: 100,
  MAX_RECHARGE_AMOUNT: 50000,
  PRESET_RECHARGE_AMOUNTS: [100, 200, 500, 1000, 2000, 5000],
  MIN_WITHDRAWAL_AMOUNT: 500,
  WALLET_LOW_BALANCE_THRESHOLD: 50,
  PAYMENT_TIMEOUT: 900000, // 15 minutes
  ORDER_EXPIRY: 900000, // 15 minutes
} as const;

// ============================================
// Session Configuration
// ============================================

export const SESSION_CONFIG = {
  SESSION_TIMEOUT: 1800000, // 30 minutes of inactivity
  CRASH_RECOVERY_WINDOW: 86400000, // 24 hours
  MAX_CONCURRENT_SESSIONS: 1,
  BACKGROUND_TIMEOUT: 300000, // 5 minutes
} as const;

// ============================================
// Notification Configuration
// ============================================

export const NOTIFICATION_CONFIG = {
  CHANNEL_IDS: {
    CHAT: 'chat_messages',
    CALL: 'call_alerts',
    WALLET: 'wallet_updates',
    PROMOTIONAL: 'promotional',
    SYSTEM: 'system_alerts',
  },
  PRIORITIES: {
    HIGH: 'high',
    MAX: 'max',
  },
  CATEGORIES: {
    CALL_INCOMING: 'CALL_INCOMING',
    CALL_ENDED: 'CALL_ENDED',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    WALLET_LOW: 'WALLET_LOW',
    REVIEW_REQUEST: 'REVIEW_REQUEST',
  },
} as const;

// ============================================
// Analytics
// ============================================

export const ANALYTICS_CONFIG = {
  SCREEN_VIEW_TIMEOUT: 100,
  SESSION_TIMEOUT: 300000, // 5 minutes
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 30000, // 30 seconds
} as const;

// ============================================
// Environment Detection
// ============================================

export const ENV = {
  DEVELOPMENT: __DEV__,
  PRODUCTION: !__DEV__,
} as const;

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
