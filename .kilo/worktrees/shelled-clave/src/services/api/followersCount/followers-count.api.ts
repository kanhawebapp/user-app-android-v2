import {graphqlRequest} from '../graphql.client';

import {GetFollowersCountResponse} from './followers-count.types';

const GET_ASTROLOGER_FOLLOWERS_COUNT = `
query GetAstrologerFollowersCount($astrologerId: ID!) {
  getAstrologerFollowersCount(
    astrologerId: $astrologerId
  ) {
    totalFollowers
  }
}
`;

export const getAstrologerFollowersCount =
  async (astrologerId: string) => {
    try {
      console.log(
        'FOLLOWERS COUNT ASTRO ID:',
        astrologerId,
      );

      const response =
        await graphqlRequest<GetFollowersCountResponse>(
          'GetAstrologerFollowersCount',
          GET_ASTROLOGER_FOLLOWERS_COUNT,
          {
            astrologerId,
          },
        );

      console.log(
        'FOLLOWERS COUNT RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      return response.getAstrologerFollowersCount;
    } catch (error: any) {
      console.log(
        'GET FOLLOWERS COUNT ERROR:',
        JSON.stringify(
          error?.response?.data ||
            error?.message ||
            error,
          null,
          2,
        ),
      );

      throw error;
    }
  };