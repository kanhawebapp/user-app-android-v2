// ============================================
// DhwaniAstro - Global Type Definitions
// Enterprise-grade TypeScript types for 1M+ users
// ============================================

// ============================================
// Core Types
// ============================================

export interface User {
  placeOfBirth: string;
  countryCode: string | undefined;
  mobile: string | undefined;
  id: string;
  phone: string;
  email?: string;
  name: string;
  profilePic?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: Gender;
  zodiacSign?: string;
  languagePreference: string;
  walletBalance: number;
  isVerified: boolean;
  isAstrologer: boolean;
  astrologerProfile?: AstrologerProfile;
  createdAt: string;
  updatedAt: string;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface AstrologerProfile {
  id: string;
  userId: string;
  expertise: string[];
  languages: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalConsultations: number;
  hourlyRate: number;
  minCallDuration: number; // minutes
  status: AstrologerStatus;
  bio?: string;
  skills?: string[];
  availability: AstrologerAvailability;
  verificationStatus: VerificationStatus;
  bankDetails?: BankDetails;
  payoutSettings?: PayoutSettings;
}

export type AstrologerStatus =
  | 'online'
  | 'offline'
  | 'busy'
  | 'on_call'
  | 'away';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
}

export interface PayoutSettings {
  payoutMethod: 'bank_transfer' | 'upi' | 'paypal';
  preferredPayoutDay: number; // 1-28
  minimumPayoutAmount: number;
}

export interface AstrologerAvailability {
  timezone: string;
  schedule: WeeklySchedule;
  is24x7Available: boolean;
  customSlots?: CustomAvailabilitySlot[];
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  slots?: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string;
}

export interface CustomAvailabilitySlot {
  date: string;
  slots: TimeSlot[];
}

// ============================================
// Wallet & Payment Types
// ============================================

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  isFrozen: boolean;
  lastUpdated: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  orderId?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type TransactionType =
  | 'credit'
  | 'debit'
  | 'refund'
  | 'payout'
  | 'reversal'
  | 'bonus';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'upi' | 'net_banking' | 'wallet' | 'crypto';
  provider?: string;
  lastFour?: string;
  token?: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: PaymentOrderType;
  status: PaymentOrderStatus;
  paymentMethod?: PaymentMethod;
  razorpayOrderId?: string;
  stripePaymentIntentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

export type PaymentOrderType =
  | 'wallet_recharge'
  | 'call_payment'
  | 'chat_payment'
  | 'subscription';

export type PaymentOrderStatus =
  | 'created'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired';

// ============================================
// Chat Types
// ============================================

export interface ChatSession {
  id: string;
  userId: string;
  astrologerId: string;
  type: ChatType;
  status: ChatStatus;
  startTime: string;
  endTime?: string;
  totalDuration: number; // seconds
  perMinuteRate: number;
  costPerSecond: number;
  totalCost: number;
  walletDeducted: number;
  messages: ChatMessage[];
  unreadCount: number;
  isActive: boolean;
  paymentStatus: PaymentSessionStatus;
  astrologer?: AstrologerProfile;
  user?: User;
}

export type ChatType = 'text' | 'audio' | 'video';

export type ChatStatus =
  | 'initiated'
  | 'waiting'
  | 'active'
  | 'on_hold'
  | 'ended'
  | 'cancelled';

export type PaymentSessionStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed';

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'astrologer' | 'system';
  type: MessageType;
  content: string;
  attachments?: Attachment[];
  isRead: boolean;
  timestamp: string;
  metadata?: MessageMetadata;
}

export type MessageType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'location'
  | 'astro_report';

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
  fileName?: string;
}

export interface MessageMetadata {
  messageId?: string;
  replyToMessageId?: string;
  edited?: boolean;
  editedAt?: string;
  delivered?: boolean;
  read?: boolean;
}

// ============================================
// Call Types
// ============================================

export interface CallSession {
  id: string;
  userId: string;
  astrologerId: string;
  type: CallType;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  totalDuration: number; // seconds
  perMinuteRate: number;
  costPerSecond: number;
  totalCost: number;
  walletDeducted: number;
  agoraChannelName: string;
  agoraToken?: string;
  astrologer?: AstrologerProfile;
  user?: User;
  paymentStatus: PaymentSessionStatus;
  isRecorded: boolean;
  recordingUrl?: string;
}

export type CallType = 'voice' | 'video';

export type CallStatus =
  | 'initiated'
  | 'ringing'
  | 'connecting'
  | 'active'
  | 'on_hold'
  | 'ended'
  | 'failed'
  | 'no_answer'
  | 'busy';

export interface RTCToken {
  token: string;
  channelName: string;
  uid: number;
  expiresAt: string;
}

export interface CallEvent {
  type: CallEventType;
  sessionId: string;
  userId: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export type CallEventType =
  | 'incoming'
  | 'outgoing'
  | 'answered'
  | 'ended'
  | 'missed'
  | 'failed'
  | 'reconnected'
  | 'hold'
  | 'resume';

// ============================================
// Session Types
// ============================================

export interface ActiveSession {
  id: string;
  type: SessionType;
  status: SessionStatus;
  startedAt: string;
  lastActivityAt: string;
  relatedSessionId?: string;
  metadata?: Record<string, unknown>;
}

export type SessionType = 'chat' | 'call';

export type SessionStatus = 'active' | 'paused' | 'ended' | 'error';

export interface SessionState {
  currentSession: ActiveSession | null;
  isSessionActive: boolean;
  sessionHistory: ActiveSession[];
  sessionTimer: number;
  accumulatedCost: number;
}

// ============================================
// Notification Types
// ============================================

export interface NotificationPayload {
  title: string;
  body: string;
  data?: NotificationData;
  channelId?: string;
  priority?: 'high' | 'max';
  categoryId?: string;
  imageUrl?: string;
}

export interface NotificationData {
  type: NotificationType;
  sessionId?: string;
  astrologerId?: string;
  messageId?: string;
  deepLink?: string;
  [key: string]: string | undefined;
}

export type NotificationType =
  | 'chat_message'
  | 'call_incoming'
  | 'wallet_low'
  | 'wallet_recharge'
  | 'session_ended'
  | 'review_request'
  | 'promotional'
  | 'astro_live';

export interface NotificationPreference {
  userId: string;
  chatEnabled: boolean;
  callEnabled: boolean;
  walletEnabled: boolean;
  promotionalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: ApiMeta;
}

// ============================================
// WebSocket Event Types
// ============================================

export interface SocketEventMap {
  // Connection events
  'connection:established': {socketId: string; timestamp: string};
  'connection:lost': {reason: string};
  'connection:reconnected': {socketId: string; timestamp: string};

  // Chat events
  'chat:message:received': ChatMessage;
  'chat:message:delivered': {messageId: string};
  'chat:message:read': {sessionId: string; messageId: string};
  'chat:session:started': ChatSession;
  'chat:session:ended': {sessionId: string; reason: string};
  'chat:typing': {sessionId: string; userId: string; isTyping: boolean};

  // Call events
  'call:incoming': {sessionId: string; callerId: string; callType: CallType};
  'call:outgoing': {sessionId: string; calleeId: string};
  'call:answered': {sessionId: string};
  'call:ended': {sessionId: string; reason: string; duration: number};
  'call:missed': {sessionId: string};
  'call:reconnected': {sessionId: string};

  // Wallet events
  'wallet:balance_updated': {balance: number; transactionId?: string};

  // Session events
  'session:crash_recovery': {activeSession: ActiveSession | null};
}

// ============================================
// Error Types
// ============================================

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
  retryAction?: () => void;
}

export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'PAYMENT_FAILED'
  | 'INSUFFICIENT_WALLET_BALANCE'
  | 'CALL_CONNECTION_FAILED'
  | 'CHAT_CONNECTION_FAILED'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

// ============================================
// Crash Recovery Types
// ============================================

export interface CrashRecoveryState {
  lastSessionId?: string;
  lastSessionType?: SessionType;
  crashTimestamp: string;
  recoveryAttempted: boolean;
  restoredSession: ActiveSession | null;
  pendingActions: PendingAction[];
}

export interface PendingAction {
  id: string;
  type: 'payment' | 'message' | 'call';
  data: Record<string, unknown>;
  createdAt: string;
}

// ============================================
// Deep Link Types
// ============================================

export interface DeepLinkPayload {
  type: DeepLinkType;
  params: Record<string, string>;
  path: string;
}

export type DeepLinkType =
  | 'astrologer_profile'
  | 'chat_session'
  | 'call_session'
  | 'wallet'
  | 'payment'
  | 'notification'
  | 'generic';

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  userId?: string;
}

export interface UserJourneyStep {
  step: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}
