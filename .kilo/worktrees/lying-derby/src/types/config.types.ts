// ============================================
// DhwaniAstro - Configuration Types
// ============================================

/**
 * Customizable app configuration types
 * These values can be fetched from API and customized per app instance
 */

// ============================================
// App Branding
// ============================================

export interface AppBranding {
  /** Application name displayed to users */
  appName: string;
  /** Company or organization name */
  companyName: string;
  /** Tagline or short description */
  tagline?: string;
  /** App logo URL */
  logoUrl?: string;
  /** Splash screen logo URL */
  splashLogoUrl?: string;
  /** Background image URL for splash/login screens */
  backgroundImageUrl?: string;
  /** Splash screen 1 background image URL (remote) */
  splashBackgroundImageUrl1?: string;
  /** Splash screen 2 background image URL (remote) */
  splashBackgroundImageUrl2?: string;
  /** Favicon URL */
  faviconUrl?: string;
  /** Primary color in hex format */
  primaryColor: string;
  /** Secondary color in hex format */
  secondaryColor: string;
  /** Accent color in hex format */
  accentColor?: string;
  /** Dark mode primary color */
  primaryColorDark?: string;
  /** Dark mode secondary color */
  secondaryColorDark?: string;
}

// ============================================
// API Configuration
// ============================================

export interface ApiConfiguration {
  /** Base URL for API endpoints */
  baseUrl: string;
  /** WebSocket URL for real-time connections */
  wsUrl?: string;
  /** Agora RTC App ID for calls */
  agoraAppId?: string;
  /** Payment gateway public key */
  paymentPublicKey?: string;
  /** Sentry DSN for error tracking */
  sentryDsn?: string;
  /** Firebase Cloud Messaging token */
  fcmToken?: string;

  // ============================================
  // WebRTC Configuration
  // ============================================
  /** WebRTC STUN server URL */
  webRtcStunServer?: string;
  /** WebRTC TURN server URL */
  webRtcTurnServer?: string;
  /** WebRTC TURN username */
  webRtcTurnUsername?: string;
  /** WebRTC TURN password */
  webRtcTurnPassword?: string;
  /** Signaling server URL for WebRTC */
  signalingServerUrl?: string;

  // ============================================
  // Environment
  // ============================================
  /** Current environment mode: production, staging, development */
  environment?: 'production' | 'staging' | 'development';
}

// ============================================
// App Texts
// ============================================

export interface OnboardingBenefit {
  /** Icon name from vector icons */
  icon: string;
  /** Icon library to use */
  iconLibrary?: 'MaterialIcons' | 'Ionicons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'Feather' | 'AntDesign';
  /** Title of the benefit */
  title: string;
  /** Description of the benefit */
  description: string;
}

export interface AppTexts {
  // Auth texts
  loginTitle: string;
  loginSubtitle: string;
  welcomeBack: string;
  signUpTitle: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;

  // Common texts
  continueText: string;
  skip: string;
  next: string;
  back: string;
  done: string;
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  search: string;
  loading: string;
  retry: string;

  // Button texts
  loginButton: string;
  signupButton: string;
  logoutButton: string;
  verifyOtpButton: string;
  resendOtpButton: string;

  // Error messages
  networkError: string;
  serverError: string;
  sessionExpired: string;
  unauthorized: string;

  // Success messages
  otpSent: string;
  loginSuccess: string;
  profileUpdated: string;

  // Tab names
  homeTab: string;
  chatTab: string;
  callTab: string;
  walletTab: string;
  profileTab: string;

  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  getStarted: string;

  // New: Onboarding screens
  /** First splash tagline: "Unlock your destiny with Dhwani Astro" */
  onboardingTagline?: string;
  /** Second splash headline: "Astrology guidance for love, career, money, health etc" */
  onboardingHeadline?: string;
  /** Array of 3 quick benefits shown on second splash */
  onboardingBenefits?: OnboardingBenefit[];
  /** Auto navigation timeout in milliseconds for onboarding splash screens */
  splashAutoNavigateTimeout?: number;
}

// ============================================
// Feature Flags
// ============================================

export interface FeatureFlags {
  /** Enable video calls */
  enableVideoCalls: boolean;
  /** Enable chat functionality */
  enableChat: boolean;
  /** Enable wallet feature */
  enableWallet: boolean;
  /** Enable push notifications */
  enablePushNotifications: boolean;
  /** Enable analytics */
  enableAnalytics: boolean;
  /** Enable dark mode */
  enableDarkMode: boolean;
  /** Enable referral program */
  enableReferral: boolean;
  /** Enable live astrologer sessions */
  enableLiveSessions: boolean;
  /** Enable wallet recharge offers */
  enableOffers: boolean;
  /** Enable astrologer ratings */
  enableRatings: boolean;
  /** Enable in-app support chat */
  enableSupportChat: boolean;
}

// ============================================
// Limits & Constraints
// ============================================

export interface AppLimits {
  /** Maximum wallet balance allowed */
  maxWalletBalance: number;
  /** Minimum recharge amount */
  minRechargeAmount: number;
  /** Maximum recharge amount per transaction */
  maxRechargeAmount: number;
  /** Minimum withdrawal amount */
  minWithdrawalAmount: number;
  /** Maximum file upload size in bytes */
  maxUploadSize: number;
  /** Maximum message length */
  maxMessageLength: number;
  /** Maximum attachments per message */
  maxAttachmentsPerMessage: number;
  /** Chat session timeout in milliseconds */
  chatSessionTimeout: number;
  /** Call session timeout in milliseconds */
  callSessionTimeout: number;
}

// ============================================
// Social Links
// ============================================

export interface SocialLinks {
  /** Privacy policy URL */
  privacyPolicyUrl: string;
  /** Terms of service URL */
  termsOfServiceUrl: string;
  /** Contact us URL */
  contactUsUrl: string;
  /** About us URL */
  aboutUsUrl: string;
  /** FAQ URL */
  faqUrl?: string;
  /** Support email */
  supportEmail: string;
  /** Support phone number */
  supportPhone?: string;
  /** Facebook page URL */
  facebookUrl?: string;
  /** Instagram profile URL */
  instagramUrl?: string;
  /** Twitter profile URL */
  twitterUrl?: string;
  /** YouTube channel URL */
  youtubeUrl?: string;
}

// ============================================
// Complete App Configuration
// ============================================

export interface AppConfiguration {
  /** Unique configuration version */
  version: string;
  /** Last update timestamp */
  lastUpdated: string;
  /** Branding configuration */
  branding: AppBranding;
  /** API configuration */
  api: ApiConfiguration;
  /** App texts and labels */
  texts: AppTexts;
  /** Feature toggle flags */
  features: FeatureFlags;
  /** App limits and constraints */
  limits: AppLimits;
  /** Social and support links */
  social: SocialLinks;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// API Response Types
// ============================================

export interface ConfigApiResponse {
  success: boolean;
  data: AppConfiguration;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// Store State Types
// ============================================

export interface ConfigState {
  /** Full app configuration */
  config: AppConfiguration | null;
  /** Whether config is loaded */
  isLoaded: boolean;
  /** Whether config is currently being fetched */
  isLoading: boolean;
  /** Error message if config fetch failed */
  error: string | null;
  /** Timestamp of last successful fetch */
  lastFetchedAt: string | null;
}

export interface ConfigActions {
  /** Fetch configuration from API */
  fetchConfig: () => Promise<void>;
  /** Update specific configuration value */
  updateConfig: (updates: Partial<AppConfiguration>) => void;
  /** Reset configuration to defaults */
  resetConfig: () => void;
  /** Clear error state */
  clearError: () => void;
}

export type ConfigStore = ConfigState & ConfigActions;

// ============================================
// Utility Types
// ============================================

export type ConfigKey = keyof AppConfiguration;

export interface ConfigUpdatePayload {
  key: ConfigKey;
  value: AppConfiguration[ConfigKey];
}

