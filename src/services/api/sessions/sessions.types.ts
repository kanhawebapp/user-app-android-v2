export type SessionStatus = 'COMPLETED' | 'ONGOING' | 'CANCELLED' | 'SCHEDULED';

export type SessionType = 'CALL' | 'CHAT';

export interface Session {
  id: string;
  userName: string;
  astrologerName: string;
  displayName: string;
  astrologerImage: string;
  type: SessionType;
  status: SessionStatus;
  startedAt: string;
  endedAt: string;
  durationSec: number;
  durationMin: number;
  ratePerMin: number;
  ratePerSecond: number;
  totalCharge: number;
  coinsEarned: number;
  commission: number;
}

export interface SessionResponse {
  data: Session[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface SessionFilterInput {
  status?: SessionStatus;
  type?: SessionType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
