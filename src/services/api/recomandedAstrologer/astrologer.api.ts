import { graphqlRequest } from '../graphql.client';
import {
  GetAstrologersResponse,
  AstrologerSearchInput,
} from './astrologer.types';

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

// export const getAstrologers = async (searchInput: AstrologerSearchInput) => {
//   const response = await graphqlRequest<GetAstrologersResponse>(
//     'GetAstrologers',
//     GET_ASTROLOGERS,
//     { searchInput },
//   );

//   return response.getAstrologerListBySearch;
// };

// import {graphqlRequest} from '../graphql.client';
import { getAuthToken } from './authCheck';
// import {getAuthToken} from '../auth/auth.storage';

export const getAstrologers = async (searchInput: AstrologerSearchInput) => {
  const token = await getAuthToken();

  try {
    if (token) {
      const response = await graphqlRequest<any>(
        'GetAstrologerListForUser',
        GET_ASTROLOGERS_FOR_USER,
        { searchInput },
      );

      return response.getAstrologerListForUser;
    }

    const response = await graphqlRequest<GetAstrologersResponse>(
      'GetAstrologers',
      GET_ASTROLOGERS,
      { searchInput },
    );
    return response.getAstrologerListBySearch;
  } catch (error) {
    console.log('Authenticated API failed, fallback to guest API');

    const response = await graphqlRequest<GetAstrologersResponse>(
      'GetAstrologers',
      GET_ASTROLOGERS,
      { searchInput },
    );

    return response.getAstrologerListBySearch;
  }
};

