import { graphqlRequest } from '../graphql.client';
import {
  GetAstrologersResponse,
  AstrologerSearchInput,
} from './astrologer.types';
import { getAuthToken } from './authCheck';
import { useAuthStore } from '../../../stores/auth.store';

export const GET_ASTROLOGERS = `
  query GetAstrologers($searchInput: AstrologerSearchInput) {
    getAstrologerListBySearch(searchInput: $searchInput) {
      data {
        id
        profilePic
        name
        displayName
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
          offerPrice
          commissionPercent
          isActive
        }
      }

      totalPages
    }
  }
`;

export const GET_ASTROLOGERS_FOR_USER = `
  query GetAstrologerListForUser($searchInput: AstrologerSearchInput) {
    getAstrologerListForUser(searchInput: $searchInput) {
      totalCount
      currentPage
      totalPages

      data {
        id
        profilePic
        name
        displayName
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

export const getAstrologers = async (searchInput: AstrologerSearchInput) => {
  const authToken = await getAuthToken();
  const token = authToken;

  // console.log('ASTROLOGER API TOKEN:', token);
  // console.log('AUTH STORE TOKEN:', useAuthStore.getState().accessToken);

  if (token) {
    try {
      const response = await graphqlRequest<any>(
        'GetAstrologerListForUser',
        GET_ASTROLOGERS_FOR_USER,
        { searchInput },
      );

      return response.getAstrologerListForUser;
    } catch (error) {
      console.log('GET_ASTROLOGERS_FOR_USER ERROR:', error);
      throw error;
    }
  }

  const response = await graphqlRequest<GetAstrologersResponse>(
    'GetAstrologers',
    GET_ASTROLOGERS,
    { searchInput },
  );
  return response.getAstrologerListBySearch;
};

