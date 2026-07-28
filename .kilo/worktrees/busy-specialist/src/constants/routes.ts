// // ============================================
// // DhwaniAstro - Route Constants
// // ============================================

// /**
//  * All navigation routes for the app
//  * Organized by module for better maintainability
//  */

// // ============================================
// // Auth Routes
// // ============================================
// export const AUTH_ROUTES = {
//   LOGIN: 'auth/login',
//   VERIFY_OTP: 'auth/verify-otp',
//   REGISTER: 'auth/register',
//   FORGOT_PASSWORD: 'auth/forgot-password',
//   RESET_PASSWORD: 'auth/reset-password',
// } as const;

// // ============================================
// // Home Routes
// // ============================================
// export const HOME_ROUTES = {
//   HOME: 'home',
//   HOME_TAB: 'home/tab',
//   DASHBOARD: 'home/dashboard',
//   ASTROLOGY_HOROSCOPE: 'home/horoscope',
//   DAILY_PREDICTION: 'home/daily-prediction',
//   kUNDALI_MATCHING: 'home/kundali-matching',
//   MUHURAT: 'home/muhurat',
//   PANCHANG: 'home/panchang',
// } as const;

// // ============================================
// // Astrologer Routes
// // ============================================
// export const ASTROLOGER_ROUTES = {
//   ASTROLOGER_LIST: 'astrologer/list',
//   ASTROLOGER_DETAIL: 'astrologer/detail',
//   ASTROLOGER_PROFILE: 'astrologer/profile/:astrologerId',
//   ASTROLOGER_REVIEWS: '/:astrologer/reviewsastrologerId',
//   ASTROLOGER_AVAILABILITY: 'astrologer/availability/:astrologerId',
//   ASTROLOGER_FOLLOWED: 'astrologer/followed',
//   ASTROLOGER_SEARCH: 'astrologer/search',
// } as const;

// // ============================================
// // Chat Routes
// // ============================================
// export const CHAT_ROUTES = {
//   CHAT_LIST: 'chat/list',
//   CHAT_SESSION: 'chat/session',
//   CHAT_SESSION_: 'chat/session/:sessionId',
//   CHAT_ACTIVE: 'chat/active/:sessionId',
//   CHAT_INCOMING: 'chat/incoming/:sessionId',
//   CHAT_ENDED: 'chat/ended/:sessionId',
//   CHAT_ARCHIVE: 'chat/archive',
// } as const;

// // ============================================
// // Call Routes
// // ============================================
// export const CALL_ROUTES = {
//   CALL_INCOMING: 'call/incoming/:sessionId',
//   CALL_OUTGOING: 'call/outgoing/:sessionId',
//   CALL_ACTIVE: 'call/active/:sessionId',
//   CALL_ENDED: 'call/ended/:sessionId',
//   CALL_HISTORY: 'call/history',
//   CALL_DIALER: 'call/dialer/:astrologerId',
// } as const;

// // ============================================
// // Wallet Routes
// // ============================================
// export const WALLET_ROUTES = {
//   WALLET: 'wallet',
//   WALLET_HOME: 'wallet/home',
//   WALLET_TRANSACTIONS: 'wallet/transactions',
//   WALLET_RECHARGE: 'wallet/recharge',
//   WALLET_WITHDRAWAL: 'wallet/withdrawal',
//   WALLET_METHODS: 'wallet/methods',
//   WALLET_HISTORY: 'wallet/history',
// } as const;

// // ============================================
// // Payment Routes
// // ============================================
// export const PAYMENT_ROUTES = {
//   PAYMENT_METHODS: 'payment/methods',
//   PAYMENT_ADD_CARD: 'payment/add-card',
//   PAYMENT_UPI: 'payment/upi',
//   PAYMENT_REVIEW: 'payment/review',
//   PAYMENT_SUCCESS: 'payment/success',
//   PAYMENT_FAILURE: 'payment/failure',
//   PAYMENT_WEBVIEW: 'payment/webview/:orderId',
// } as const;

// // ============================================
// // Profile Routes
// // ============================================
// export const PROFILE_ROUTES = {
//   PROFILE: 'profile',
//   PROFILE_EDIT: 'profile/edit',
//   PROFILE_SETTINGS: 'profile/settings',
//   PROFILE_KUNDALI: 'profile/kundali',
//   PROFILE_PREFERENCES: 'profile/preferences',
//   PROFILE_NOTIFICATIONS: 'profile/notifications',
//   PROFILE_PRIVACY: 'profile/privacy',
//   PROFILE_HELP: 'profile/help',
//   PROFILE_ABOUT: 'profile/about',
//   PROFILE_BLOCKED: 'profile/blocked',
//   PROFILE_LANGUAGE: 'profile/language',
// } as const;

// // ============================================
// // Session Routes
// // ============================================
// export const SESSION_ROUTES = {
//   SESSION_ACTIVE: 'session/active',
//   SESSION_HISTORY: 'session/history',
//   SESSION_DETAIL: 'session/detail/:sessionId',
//   SESSION_REPORT: 'session/report/:sessionId',
//   SESSION_REVIEW: 'session/review/:sessionId',
// } as const;

// // ============================================
// // Notification Routes
// // ============================================
// export const NOTIFICATION_ROUTES = {
//   NOTIFICATIONS: 'notifications',
//   NOTIFICATION_SETTINGS: 'notifications/settings',
// } as const;

// // ============================================
// // Main Navigation Types
// // ============================================

// export type RootStackParamList = {
//   [AUTH_ROUTES.LOGIN]: undefined;
//   [AUTH_ROUTES.VERIFY_OTP]: { phone: string; countryCode: string };
//   [AUTH_ROUTES.REGISTER]: undefined;
//   [AUTH_ROUTES.FORGOT_PASSWORD]: undefined;
//   [AUTH_ROUTES.RESET_PASSWORD]: { phone: string };

//   // Main App (after auth)
//   MAIN_APP: undefined;
  
//   [HOME_ROUTES.HOME]: undefined;
//   [HOME_ROUTES.DASHBOARD]: undefined;
//   [HOME_ROUTES.ASTROLOGY_HOROSCOPE]: undefined;
  
//   [ASTROLOGER_ROUTES.ASTROLOGER_LIST]: undefined;
//   [ASTROLOGER_ROUTES.ASTROLOGER_DETAIL]: { astrologerId: string };
//   [ASTROLOGER_ROUTES.ASTROLOGER_REVIEWS]: { astrologerId: string };
//   [ASTROLOGER_ROUTES.ASTROLOGER_SEARCH]: undefined;

//   [CHAT_ROUTES.CHAT_LIST]: undefined;
//   [CHAT_ROUTES.CHAT_SESSION_]: { sessionId: string };
//   [CHAT_ROUTES.CHAT_ENDED]: { sessionId: string };
//   [CHAT_ROUTES.CHAT_ARCHIVE]: undefined;

//   [CALL_ROUTES.CALL_INCOMING]: { sessionId: string };
//   [CALL_ROUTES.CALL_ACTIVE]: { sessionId: string };
//   [CALL_ROUTES.CALL_ENDED]: { sessionId: string };
//   [CALL_ROUTES.CALL_HISTORY]: undefined;

//   [WALLET_ROUTES.WALLET_HOME]: undefined;
//   [WALLET_ROUTES.WALLET_TRANSACTIONS]: undefined;
//   [WALLET_ROUTES.WALLET_RECHARGE]: undefined;

//   [PAYMENT_ROUTES.PAYMENT_REVIEW]: { orderId: string };
//   [PAYMENT_ROUTES.PAYMENT_SUCCESS]: { orderId: string };
//   [PAYMENT_ROUTES.PAYMENT_FAILURE]: { orderId: string; error?: string };

//   [PROFILE_ROUTES.PROFILE]: undefined;
//   [PROFILE_ROUTES.PROFILE_EDIT]: undefined;
//   [PROFILE_ROUTES.PROFILE_PREFERENCES]: undefined;
//   [PROFILE_ROUTES.PROFILE_NOTIFICATIONS]: undefined;

//   [NOTIFICATION_ROUTES.NOTIFICATIONS]: undefined;

//   // Modal Routes
//   MODAL_CONFIRMATION: { title: string; message: string; confirmText?: string; cancelText?: string };
//   MODAL_BOTTOM_SHEET: { component: string; props?: Record<string, unknown> };
// };

// // ============================================
// // Tab Navigation Types
// // ============================================

// export type TabParamList = {
//   [HOME_ROUTES.HOME_TAB]: undefined;
//   [ASTROLOGER_ROUTES.ASTROLOGER_LIST]: undefined;
//   [CHAT_ROUTES.CHAT_LIST]: undefined;
//   [WALLET_ROUTES.WALLET_HOME]: undefined;
//   [PROFILE_ROUTES.PROFILE]: undefined;
// };

// // ============================================
// // Deep Link Routes
// // ============================================

// export const DEEP_LINK_ROUTES = {
//   ASTROLOGER: 'dhwaniastro://astrologer',
//   CHAT: 'dhwaniastro://chat',
//   CALL: 'dhwaniastro://call',
//   WALLET: 'dhwaniastro://wallet',
//   PAYMENT: 'dhwaniastro://payment',
//   NOTIFICATION: 'dhwaniastro://notification',
// } as const;

// // ============================================
// // Navigation Constants
// // ============================================

// export const NAVIGATION_CONFIG = {
//   ANIMATION_DURATION: 300,
//   CARD_STYLE_INTERPOLATOR: 'horizontal',
//   HEADER_HEIGHT: 56,
//   TAB_BAR_HEIGHT: 60,
//   STATUS_BAR_HEIGHT: 44,
// } as const;

// // ============================================
// // Screen Names for Analytics
// // ============================================

// export const SCREEN_NAMES = {
//   LOGIN: 'LoginScreen',
//   VERIFY_OTP: 'VerifyOTPScreen',
//   HOME: 'HomeScreen',
//   ASTROLOGER_LIST: 'AstrologerListScreen',
//   ASTROLOGER_DETAIL: 'AstrologerDetailScreen',
//   CHAT_LIST: 'ChatListScreen',
//   CHAT_SESSION: 'ChatSessionScreen',
//   CALL_INCOMING: 'CallIncomingScreen',
//   CALL_ACTIVE: 'CallActiveScreen',
//   CALL_ENDED: 'CallEndedScreen',
//   WALLET: 'WalletScreen',
//   TRANSACTIONS: 'TransactionsScreen',
//   PROFILE: 'ProfileScreen',
//   SETTINGS: 'SettingsScreen',
//   NOTIFICATIONS: 'NotificationsScreen',
// } as const;

// // ============================================
// // Navigation State
// // ============================================

// export const NAVIGATION_STATE_KEYS = {
//   ROUTER_STATE: 'router',
//   NAVIGATION_STATE: 'navigation',
// } as const;

