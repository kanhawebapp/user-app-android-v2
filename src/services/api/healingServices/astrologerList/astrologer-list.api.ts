import { graphqlRequest } from '../../graphql.client';

import {
  AstrologerListResponse,
  AstrologerSearchInput,
  GetAstrologerListForUserResponse,
} from './astrologer-list.types';

const GET_ASTROLOGER_LIST = `
query GetAstrologerListForUser(
  $searchInput: AstrologerSearchInput
) {
  getAstrologerListForUser(
    searchInput: $searchInput
  ) {
    totalCount
    currentPage
    totalPages

    data {
      id
      profilePic
      name
      experience
      rating
      skills
      languages
      isBusy
      isOnline
      isChatActive
      isCallActive
      isLiveActive
      activeOffer {
        id
        offerName
        price
        description
      }

      pricing {
        type
        price
        originalPrice
        offerPrice
        commissionPercent
        isActive
      }

    }
  }
}
`;

export const getAstrologerListForUser =
  async (
    searchInput?: AstrologerSearchInput,
  ): Promise<AstrologerListResponse> => {
    try {
      const response =
        await graphqlRequest<GetAstrologerListForUserResponse>(
          'GetAstrologerListForUser',
          GET_ASTROLOGER_LIST,
          {
            searchInput,
          },
        );

      console.log(
        'GET ASTROLOGER LIST RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return (
        response?.getAstrologerListForUser || {
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          data: [],
        }
      );
    } catch (error: any) {
      console.log(
        'GET ASTROLOGER LIST ERROR:',
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

  