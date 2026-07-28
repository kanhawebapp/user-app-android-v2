// import {graphqlRequest} from '../graphql.client';
// import {
//   GetAstrologersResponse,
//   AstrologerSearchInput,
// } from './astrologer.types';

import {graphqlRequest} from '../graphql.client';

// const GET_ASTROLOGERS_QUERY = `
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

// export const getAstrologers = async (searchInput?: AstrologerSearchInput) => {
//   const response = await graphqlRequest<GetAstrologersResponse>(
//     'GetAstrologers',
//     GET_ASTROLOGERS_QUERY,
//     {
//       searchInput,
//     },
//   );

//   return response.getAstrologerListBySearch;
// };

const GET_ASTROLOGERS = `
query GetAstrologers($searchInput: AstrologerSearchInput) {
  getAstrologerListBySearch(searchInput: $searchInput) {
    data {
      id
      profilePic
      name
      experience
      price
      rating
      skills
      languages
      __typename
    }
    totalCount
    currentPage
    totalPages
    __typename
  }
}
`;

export const getAstrologers = async (searchInput: any) => {
  const res = await graphqlRequest<{
    getAstrologerListBySearch: {
      data: any[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    };
  }>('GetAstrologers', GET_ASTROLOGERS, {searchInput});

  return res.getAstrologerListBySearch;
};
