export type UpcomingLiveStatus = 'LIVE' | 'SCHEDULED';

export interface UpcomingLiveAstrologer {
  id: string;

  name: string;

  displayName: string | null;

  profilePic: string | null;

  rating: number | null;
}

export interface UpcomingLive {
  id: string;

  title: string;

  status: UpcomingLiveStatus;

  channelName: string;

  /** Epoch milliseconds as a string, e.g. "1791828000000" */
  scheduledAt: string;

  astrologer: UpcomingLiveAstrologer | null;
}

export interface UpcomingLivesPagination {
  data: UpcomingLive[];

  totalCount: number;

  currentPage: number;

  totalPages: number;
}

export interface GetUpcomingLivesResponse {
  getUpcomingLives: UpcomingLivesPagination;
}

export interface GetUpcomingLivesVariables {
  page?: number;

  limit?: number;
}
