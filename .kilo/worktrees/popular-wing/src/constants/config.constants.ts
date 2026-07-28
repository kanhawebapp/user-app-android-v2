// ============================================
// DhwaniAstro - Configuration Constants
// ============================================

/**
 * Default configuration values and storage keys
 * These are used as fallback when API is unavailable
 */

import type {
  AppConfiguration,
  AppBranding,
  ApiConfiguration,
  AppTexts,
  FeatureFlags,
  AppLimits,
  SocialLinks,
} from '../types/config.types';

// ============================================
// Storage Keys
// ============================================

export const CONFIG_STORAGE_KEYS = {
  /** Key for storing app configuration */
  APP_CONFIG: 'app_configuration',
  /** Key for storing config version */
  CONFIG_VERSION: 'config_version',
  /** Key for storing last fetch timestamp */
  CONFIG_LAST_FETCHED: 'config_last_fetched',
} as const;

// ============================================
// Default Branding
// ============================================

export const DEFAULT_BRANDING: AppBranding = {
  appName: 'DhwaniAstro',
  companyName: 'Dhwani Astro',
  tagline: 'Your Personal Astrology Guide',
  logoUrl: undefined,
  splashLogoUrl: undefined,
  backgroundImageUrl: undefined,
  splashBackgroundImageUrl1: undefined,
  splashBackgroundImageUrl2: undefined,
  faviconUrl: undefined,
  primaryColor: '#6200EE',
  secondaryColor: '#03DAC6',
  accentColor: '#FF6D00',
  primaryColorDark: '#BB86FC',
  secondaryColorDark: '#03DAC6',
};

// ============================================
// Default API Configuration
// ============================================

export const DEFAULT_API_CONFIG: ApiConfiguration = {
  baseUrl: 'https://api.dhwaniastro.com',
  wsUrl: 'wss://ws.dhwaniastro.com',
  agoraAppId: undefined,
  paymentPublicKey: undefined,
  sentryDsn: undefined,
  fcmToken: undefined,

  // WebRTC Configuration
  webRtcStunServer: 'stun:stun.l.google.com:19302',
  webRtcTurnServer: undefined,
  webRtcTurnUsername: undefined,
  webRtcTurnPassword: undefined,
  signalingServerUrl: undefined,

  // Environment
  environment: 'development',
};

// ============================================
// Default App Texts
// ============================================

/** Default onboarding benefits */
export const DEFAULT_ONBOARDING_BENEFITS = [
  {
    icon: 'favorite',
    iconLibrary: 'MaterialIcons' as const,
    title: 'Love & Relationships',
    description: 'Find your perfect match',
  },
  {
    icon: 'briefcase',
    iconLibrary: 'Ionicons' as const,
    title: 'Career Guidance',
    description: 'Navigate your professional path',
  },
  {
    icon: 'account-balance-wallet',
    iconLibrary: 'MaterialIcons' as const,
    title: 'Financial Prosperity',
    description: 'Unlock wealth opportunities',
  },
];

export const DEFAULT_APP_TEXTS: AppTexts = {
  // Auth texts
  loginTitle: 'Welcome',
  loginSubtitle: 'Sign in to continue',
  welcomeBack: 'Welcome back!',
  signUpTitle: 'Create Account',
  forgotPassword: 'Forgot Password?',
  dontHaveAccount: "Don't have an account?",
  alreadyHaveAccount: 'Already have an account?',

  // Common texts
  continueText: 'Continue',
  skip: 'Skip',
  next: 'Next',
  back: 'Back',
  done: 'Done',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  search: 'Search',
  loading: 'Loading...',
  retry: 'Retry',

  // Button texts
  loginButton: 'Login',
  signupButton: 'Sign Up',
  logoutButton: 'Logout',
  verifyOtpButton: 'Verify OTP',
  resendOtpButton: 'Resend OTP',

  // Error messages
  networkError: 'Unable to connect. Please check your internet connection.',
  serverError: 'Something went wrong. Please try again later.',
  sessionExpired: 'Your session has expired. Please login again.',
  unauthorized: 'You are not authorized to perform this action.',

  // Success messages
  otpSent: 'OTP sent successfully!',
  loginSuccess: 'Welcome back!',
  profileUpdated: 'Profile updated successfully!',

  // Tab names
  homeTab: 'Home',
  chatTab: 'Chat',
  callTab: 'Call',
  walletTab: 'Wallet',
  profileTab: 'Profile',

  // Onboarding
  onboardingTitle: 'Welcome to DhwaniAstro',
  onboardingSubtitle: 'Discover your future with expert astrologers',
  getStarted: 'Get Started',

  // New: Onboarding screens
  onboardingTagline: 'Unlock your destiny with Dhwani Astro',
  onboardingHeadline: 'Astrology guidance for love, career, money, health etc',
  onboardingBenefits: DEFAULT_ONBOARDING_BENEFITS,
  splashAutoNavigateTimeout: 3000,
};

// ============================================
// Default Feature Flags
// ============================================

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableVideoCalls: true,
  enableChat: true,
  enableWallet: true,
  enablePushNotifications: true,
  enableAnalytics: true,
  enableDarkMode: true,
  enableReferral: true,
  enableLiveSessions: true,
  enableOffers: true,
  enableRatings: true,
  enableSupportChat: true,
};

// ============================================
// Default App Limits
// ============================================

export const DEFAULT_APP_LIMITS: AppLimits = {
  maxWalletBalance: 100000,
  minRechargeAmount: 100,
  maxRechargeAmount: 50000,
  minWithdrawalAmount: 500,
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  maxMessageLength: 2000,
  maxAttachmentsPerMessage: 5,
  chatSessionTimeout: 30 * 60 * 1000, // 30 minutes
  callSessionTimeout: 4 * 60 * 60 * 1000, // 4 hours
};

// ============================================
// Default Social Links
// ============================================

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  privacyPolicyUrl: 'https://dhwaniastro.com/privacy',
  termsOfServiceUrl: 'https://dhwaniastro.com/terms',
  contactUsUrl: 'https://dhwaniastro.com/contact',
  aboutUsUrl: 'https://dhwaniastro.com/about',
  faqUrl: 'https://dhwaniastro.com/faq',
  supportEmail: 'support@dhwaniastro.com',
  supportPhone: undefined,
  facebookUrl: undefined,
  instagramUrl: undefined,
  twitterUrl: undefined,
  youtubeUrl: undefined,
};

// ============================================
// Default Complete Configuration
// ============================================

export const DEFAULT_APP_CONFIG: AppConfiguration = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  branding: DEFAULT_BRANDING,
  api: DEFAULT_API_CONFIG,
  texts: DEFAULT_APP_TEXTS,
  features: DEFAULT_FEATURE_FLAGS,
  limits: DEFAULT_APP_LIMITS,
  social: DEFAULT_SOCIAL_LINKS,
  metadata: undefined,
};

// ============================================
// API Endpoints for Configuration
// ============================================

export const CONFIG_ENDPOINTS = {
  /** Main configuration endpoint */
  CONFIG: '/v1/app/config',
  /** Branding-specific config */
  BRANDING: '/v1/app/config/branding',
  /** Texts-specific config */
  TEXTS: '/v1/app/config/texts',
  /** Feature flags config */
  FEATURES: '/v1/app/config/features',
} as const;

// ============================================
// Config Cache Settings
// ============================================

export const CONFIG_CACHE_SETTINGS = {
  /** Cache duration in milliseconds (default: 24 hours) */
  CACHE_DURATION: 24 * 60 * 60 * 1000,
  /** Minimum time between fetches (default: 1 hour) */
  MIN_FETCH_INTERVAL: 60 * 60 * 1000,
  /** Maximum retry attempts */
  MAX_RETRY_ATTEMPTS: 3,
  /** Retry delay in milliseconds */
  RETRY_DELAY: 1000,
} as const;
