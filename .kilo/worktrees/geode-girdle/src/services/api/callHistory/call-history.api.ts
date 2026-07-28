import {graphqlRequest} from '../graphql.client';

import {
  GetUserCallHistoryResponse,
  UserCallHistoryFilterInput,
} from './call-history.types';

const GET_USER_CALL_HISTORY = `
query GetUserCallHistory($filter: UserCallHistoryFilterInput) {
  getUserCallHistory(filter: $filter) {

    success

    summary {
      totalCoinsDeducted

      totalCoinsEarned

      totalCommission

      totalRecords

      __typename
    }

    totalCount

    currentPage

    totalPages

    data {
      srNo

      sessionId

      startedAt

      endedAt

      createdAt

      status

      durationSec

      durationMinutes

      ratePerMin

      coinsDeducted

      coinsEarned

      commission

      user {
        id

        name

        mobile

        countryCode

        __typename
      }

      astrologer {
        id

        name

        profilePic

        experience

        rating

        skills

        languages

        __typename
      }

      __typename
    }

    __typename
  }
}
`;

export const getUserCallHistory = async (
  filter: UserCallHistoryFilterInput,
) => {
  try {
    console.log('USER CALL HISTORY FILTER:', filter);

    const response = await graphqlRequest<GetUserCallHistoryResponse>(
      'GetUserCallHistory',
      GET_USER_CALL_HISTORY,
      {
        filter,
      },
    );

    console.log('USER CALL HISTORY RESPONSE:', response);

    return response.getUserCallHistory;
  } catch (error: any) {
    console.log(
      'GET USER CALL HISTORY ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
