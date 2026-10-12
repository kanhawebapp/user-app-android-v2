import {graphqlRequest} from '../graphql.client';

import {
  GetUpcomingLivesResponse,
  GetUpcomingLivesVariables,
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
