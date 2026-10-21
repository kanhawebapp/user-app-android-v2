import {graphqlRequest} from '../graphql.client';

import {
  GetUpcomingLivesResponse,
  GetUpcomingLivesVariables,
  JoinLiveResponse,
  LiveJoinResponse,
} from './live-sessions.types';

const GET_UPCOMING_LIVES = `
query GetUpcomingLives($page: Int, $limit: Int) {
  getUpcomingLives(page: $page, limit: $limit) {
    data {
      id
      title
      status
      channelName
      scheduledAt
      astrologer {
        id
        name
        displayName
        profilePic
        rating
      }
    }
    totalCount
    currentPage
    totalPages
  }
}
`;

export const getUpcomingLives = async ({
  page = 1,
  limit = 10,
}: GetUpcomingLivesVariables = {}) => {
  const response = await graphqlRequest<GetUpcomingLivesResponse>(
    'GetUpcomingLives',
    GET_UPCOMING_LIVES,
    {
      page,
      limit,
    },
  );

  return response.getUpcomingLives;
};

const JOIN_LIVE_STREAM = `
query JoinLive($channelName: String!) {
  joinLive(channelName: $channelName) {
    id
    rtcToken
    uid
    appId
    channelName
    chatUserId
    chatToken
    chatRoomId
    chatAppKey
  }
}
`;

export const joinLive = async (channelName: string) => {
  const response = await graphqlRequest<JoinLiveResponse>(
    'JoinLive',
    JOIN_LIVE_STREAM,
    {
      channelName,
    },
  );

  return response.joinLive;
};

const LEAVE_LIVE_STREAM = `
mutation LeaveLiveStream($channelName: String!) {
  leaveLive(channelName: $channelName) {
    success
    message
    channelName
    __typename
  }
}
`;

export const leaveLiveStream = async (channelName: string) => {
  const response = await graphqlRequest<LeaveLiveResponse>(
    'LeaveLiveStream',
    LEAVE_LIVE_STREAM,
    {
      channelName,
    },
  );

  return response.leaveLive;
};
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/** Returns an error message when the RTC credentials can't be used to join, otherwise null. */
export const getLiveJoinRtcError = (
  joinData: LiveJoinResponse | null | undefined,
  expectedChannelName: string,
): string | null => {
  if (!joinData) {
    return 'No live session details were returned. Please try again.';
  }
  if (
    !isNonEmptyString(joinData.appId) ||
    !isNonEmptyString(joinData.rtcToken) ||
    !isNonEmptyString(joinData.channelName)
  ) {
    return 'Live stream details are incomplete. Please try again.';
  }
  if (!Number.isInteger(joinData.uid) || joinData.uid < 0) {
    return 'Live stream user id is invalid. Please try again.';
  }
  if (joinData.channelName !== expectedChannelName) {
    return 'Received details for a different live session. Please try again.';
  }
  return null;
};

/** Returns an error message when the Chat credentials are unusable, otherwise null. */
export const getLiveJoinChatError = (
  joinData: LiveJoinResponse | null | undefined,
): string | null => {
  if (
    !joinData ||
    !isNonEmptyString(joinData.chatAppKey) ||
    !isNonEmptyString(joinData.chatUserId) ||
    !isNonEmptyString(joinData.chatToken) ||
    !isNonEmptyString(joinData.chatRoomId)
  ) {
    return 'Live chat is unavailable for this session.';
  }
  return null;
};
