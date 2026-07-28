import {graphqlRequest} from '../graphql.client';

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
