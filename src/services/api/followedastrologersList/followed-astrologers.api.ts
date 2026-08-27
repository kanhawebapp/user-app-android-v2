import { graphqlRequest } from '../graphql.client';

import { GetFollowedAstrologersResponse } from './followed-astrologers.types';

const GET_FOLLOWED_ASTROLOGERS = `
query GetFollowedAstrologers(
  $page: Int!
  $limit: Int!
) {
  getFollowedAstrologers(
    page: $page
    limit: $limit
  ) {
    astrologers {
      id

      name
      skills
      displayName

      profilePic

      rating

      experience
      
      isBusy
      isOnline
      isChatActive
      isCallActive
      isLiveActive


      pricing {
        id

        type

        price

        offerPrice
      }

     
    }

    total

    page

    limit

    totalPages
  }
}
`;

export const getFollowedAstrologers =
  async (
    page: number = 1,
    limit: number = 10,
  ) => {
    try {
      console.log(
        'FOLLOWED ASTROLOGERS PARAMS:',
        {
          page,
          limit,
        },
      );

      const response =
        await graphqlRequest<GetFollowedAstrologersResponse>(
          'GetFollowedAstrologers',
          GET_FOLLOWED_ASTROLOGERS,
          {
            page,
            limit,
          },
        );

      console.log(
        'FOLLOWED ASTROLOGERS RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return response.getFollowedAstrologers;
    } catch (error: any) {
      console.log(
        'GET FOLLOWED ASTROLOGERS ERROR:',
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