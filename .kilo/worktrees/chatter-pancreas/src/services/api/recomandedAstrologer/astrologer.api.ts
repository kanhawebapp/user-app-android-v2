// import {graphqlRequest} from '../graphql.client';

// const GET_ASTROLOGERS = `
// query GetAstrologers($searchInput: AstrologerSearchInput) {
//   getAstrologerListBySearch(searchInput: $searchInput) {
//     data {
//       id
//       profilePic
//       name
//       experience
//       price
//       rating
//       skills
//       languages
//       __typename
//     }
//     totalCount
//     currentPage
//     totalPages
//     __typename
//   }
// }
// `;

// export const getAstrologers = async (searchInput: any) => {
//   const res = await graphqlRequest<{
//     getAstrologerListBySearch: {
//       data: any[];
//       totalCount: number;
//       currentPage: number;
//       totalPages: number;
//     };
//   }>('GetAstrologers', GET_ASTROLOGERS, {searchInput});

//   return res.getAstrologerListBySearch;
// };


// //2nd
// import {graphqlRequest} from '../graphql.client';
// import {
//   GetAstrologersResponse,
//   AstrologerSearchInput,
// } from './astrologer.types';

// const GET_ASTROLOGERS = `
// query GetAstrologers($searchInput: AstrologerSearchInput) {
//   getAstrologerListBySearch(searchInput: $searchInput) {
//     data {
//       id
//       profilePic
//       name
//       experience
//       price
//       offerPrice
//       commissionPercent
//       rating
//       skills
//       languages
//       __typename
//     }
//     totalPages
//     __typename
//   }
// }
// `;

// export const getAstrologers = async (searchInput: AstrologerSearchInput) => {
//   const response = await graphqlRequest<GetAstrologersResponse>(
//     'GetAstrologers',
//     GET_ASTROLOGERS,
//     {
//       searchInput,
//     },
//   );

//   return response.getAstrologerListBySearch;
// };


import { graphqlRequest } from '../graphql.client';
import {
  GetAstrologersResponse,
  AstrologerSearchInput,
} from './astrologer.types';

// const GET_ASTROLOGERS = `
//   query GetAstrologers($searchInput: AstrologerSearchInput) {
//     getAstrologerListBySearch(searchInput: $searchInput) {
//       data {
//         id
//         profilePic
//         name
//         experience
//         price
//         offerPrice
//         commissionPercent
//         rating
//         skills
//         languages
//       }
//       totalPages
//     }
//   }
// `;

const GET_ASTROLOGERS = `
  query GetAstrologers($searchInput: AstrologerSearchInput) {
    getAstrologerListBySearch(searchInput: $searchInput) {
      data {
        id
        profilePic
        name
        experience

        pricing {
          type
          price
          offerPrice
          commissionPercent
        }

        rating
        skills
        languages
      }

      totalPages
    }
  }
`;

export const getAstrologers = async (
  searchInput: AstrologerSearchInput,
) => {
  try {
    console.log(
      'ASTROLOGER REQUEST =>',
      JSON.stringify(searchInput, null, 2),
    );

    const response = await graphqlRequest<GetAstrologersResponse>(
      'GetAstrologers',
      GET_ASTROLOGERS,
      {
        searchInput,
      },
    );

    console.log(
      'ASTROLOGER RESPONSE =>',
      JSON.stringify(response, null, 2),
    );

    return response.getAstrologerListBySearch;
  } catch (error: any) {
    console.log(
      'GRAPHQL FULL ERROR =>',
      JSON.stringify(error?.response?.data, null, 2),
    );

    throw error;
  }
};

