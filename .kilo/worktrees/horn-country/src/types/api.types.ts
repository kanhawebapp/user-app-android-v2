// ============================================
// DhwaniAstro - API Types
// ============================================

import type {
  User,
  Wallet,
  WalletTransaction,
  PaymentOrder,
  ChatSession,
  ChatMessage,
  CallSession,
  AstrologerProfile,
  NotificationPreference,
  ApiResponse,
  PaginatedResponse,
} from './global.types';

// ============================================
// Auth API Types
// ============================================

export interface LoginParams {
  phone: string;
  countryCode: string;
  deviceId: string;
  fcmToken?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface VerifyOTPParams {
  phone: string;
  countryCode: string;
  otp: string;
  requestId: string;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export interface LogoutParams {
  userId: string;
  deviceId: string;
}

// ============================================
// User API Types
// ============================================

export interface UpdateProfileParams {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: string;
  languagePreference?: string;
}

export interface UpdateProfileResponse extends ApiResponse<User> {}

export interface GetUserProfileParams {
  userId: string;
}

export interface GetUserProfileResponse extends ApiResponse<User> {}

// ============================================
// Astrologer API Types
// ============================================

export interface GetAstrologersParams {
  page?: number;
  limit?: number;
  search?: string;
  expertise?: string[];
  language?: string[];
  minRating?: number;
  minExperience?: number;
  maxRate?: number;
  sortBy?: 'rating' | 'experience' | 'price' | 'availability';
  sortOrder?: 'asc' | 'desc';
  isAvailable?: boolean;
}

export interface GetAstrologersResponse
  extends PaginatedResponse<AstrologerProfile> {}

export interface GetAstrologerDetailParams {
  astrologerId: string;
}

export interface GetAstrologerDetailResponse
  extends ApiResponse<AstrologerProfile> {}

export interface GetAstrologerReviewsParams {
  astrologerId: string;
  page?: number;
  limit?: number;
}

export interface AstrologerReview {
  id: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  rating: number;
  review: string;
  sessionType: 'chat' | 'call';
  createdAt: string;
}

export interface GetAstrologerReviewsResponse
  extends PaginatedResponse<AstrologerReview> {}

export interface FollowAstrologerParams {
  astrologerId: string;
}

export interface FollowAstrologerResponse
  extends ApiResponse<{isFollowing: boolean}> {}

// ============================================
// Wallet API Types
// ============================================

export interface GetWalletParams {
  userId: string;
}

export interface GetWalletResponse extends ApiResponse<Wallet> {}

export interface GetTransactionsParams {
  userId: string;
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetTransactionsResponse
  extends PaginatedResponse<WalletTransaction> {}

export interface CreatePaymentOrderParams {
  userId: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  type: string;
}

export interface CreatePaymentOrderResponse extends ApiResponse<PaymentOrder> {}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResponse extends ApiResponse<PaymentOrder> {}

// ============================================
// Chat API Types
// ============================================

export interface StartChatParams {
  astrologerId: string;
  initialMessage?: string;
}

export interface StartChatResponse extends ApiResponse<ChatSession> {}

export interface SendMessageParams {
  sessionId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'document';
  attachments?: File[];
}

export interface SendMessageResponse extends ApiResponse<ChatMessage> {}

export interface GetChatHistoryParams {
  sessionId: string;
  page?: number;
  limit?: number;
  before?: string;
}

export interface GetChatHistoryResponse
  extends PaginatedResponse<ChatMessage> {}

export interface EndChatParams {
  sessionId: string;
}

export interface EndChatResponse extends ApiResponse<ChatSession> {}

export interface GetActiveChatsParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetActiveChatsResponse
  extends PaginatedResponse<ChatSession> {}

// ============================================
// Call API Types
// ============================================

export interface InitiateCallParams {
  astrologerId: string;
  type: 'voice' | 'video';
}

export interface InitiateCallResponse
  extends ApiResponse<{
    session: CallSession;
    rtcToken: string;
    channelName: string;
  }> {}

export interface GetRTCTokenParams {
  sessionId: string;
}

export interface GetRTCTokenResponse
  extends ApiResponse<{
    token: string;
    channelName: string;
    uid: number;
  }> {}

export interface EndCallParams {
  sessionId: string;
  reason?: string;
}

export interface EndCallResponse extends ApiResponse<CallSession> {}

export interface GetCallHistoryParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetCallHistoryResponse
  extends PaginatedResponse<CallSession> {}

// ============================================
// Session API Types
// ============================================

export interface GetActiveSessionParams {
  userId: string;
}

export interface GetActiveSessionResponse
  extends ApiResponse<{
    chat: ChatSession | null;
    call: CallSession | null;
  }> {}

export interface CrashRecoveryParams {
  userId: string;
  lastSessionId?: string;
  lastSessionType?: string;
}

export interface CrashRecoveryResponse
  extends ApiResponse<{
    activeSession: {
      id: string;
      type: string;
      status: string;
      startedAt: string;
      lastActivityAt: string;
    } | null;
    pendingActions: Array<{
      id: string;
      type: string;
      data: Record<string, unknown>;
    }>;
  }> {}

// ============================================
// Notification API Types
// ============================================

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse
  extends PaginatedResponse<AppNotification> {
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  error: any;
  data: any;
  success: any;
}

export interface MarkNotificationReadParams {
  notificationId: string;
}

export interface MarkNotificationReadResponse
  extends ApiResponse<AppNotification> {}

export interface MarkAllNotificationsReadResponse
  extends ApiResponse<{count: number}> {}

export interface GetNotificationPreferencesParams {
  userId: string;
}

export interface GetNotificationPreferencesResponse
  extends ApiResponse<NotificationPreference> {}

export interface UpdateNotificationPreferencesParams {
  userId: string;
  preferences: Partial<NotificationPreference>;
}

export interface UpdateNotificationPreferencesResponse
  extends ApiResponse<NotificationPreference> {}

// ============================================
// Report API Types
// ============================================

export interface GenerateReportParams {
  sessionId: string;
  reportType: 'chat_transcript' | 'call_summary' | 'astro_analysis';
}

export interface GenerateReportResponse
  extends ApiResponse<{
    reportId: string;
    downloadUrl: string;
    expiresAt: string;
  }> {}
