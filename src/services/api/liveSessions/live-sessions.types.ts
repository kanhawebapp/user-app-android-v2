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

export interface LiveJoinResponse {
  id: string;

  rtcToken: string;

  uid: number;

  appId: string;

  channelName: string;

  chatUserId: string;

  chatToken: string;

  chatRoomId: string;

  chatAppKey: string;
}

export interface JoinLiveResponse {
  joinLive: LiveJoinResponse;
}

export interface LeaveLiveResponse {
  leaveLive: {
    success: boolean;
    message: string;
    channelName: string;
    __typename?: string;
  };
}
