export interface CallHistoryUser {
  id: string;

  name: string;

  mobile: string;

  countryCode: string;

  __typename?: string;
}

export interface CallHistoryAstrologer {
  id: string;

  name: string;

  profilePic?: string | null;

  experience: number;

  rating: number;

  skills: string[];

  languages: string[];

  __typename?: string;
}

export interface CallHistoryItem {
  srNo: number;

  sessionId: string;

  startedAt: string;

  endedAt: string;

  createdAt: string;

  status: string;

  durationSec: number;

  durationMinutes: number;

  ratePerMin: number;

  coinsDeducted: number;

  coinsEarned: number;

  commission: number;

  user: CallHistoryUser;

  astrologer: CallHistoryAstrologer;

  __typename?: string;
}

export interface CallHistorySummary {
  totalCoinsDeducted: number;

  totalCoinsEarned: number;

  totalCommission: number;

  totalRecords: number;

  __typename?: string;
}

export interface UserCallHistoryPagination {
  success: boolean;

  summary: CallHistorySummary;

  totalCount: number;

  currentPage: number;

  totalPages: number;

  data: CallHistoryItem[];

  __typename?: string;
}

export interface GetUserCallHistoryResponse {
  getUserCallHistory: UserCallHistoryPagination;
}

export interface UserCallHistoryFilterInput {
  page?: number;

  limit?: number;

  status?: string;

  astrologerName?: string;

  startDate?: string;

  endDate?: string;
}
