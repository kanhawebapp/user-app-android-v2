// ==========================================
// recentIntakes.api.ts
// ==========================================

import {graphqlRequest} from '../graphql.client';
import {RecentIntakesResponse} from './recentIntakes.types';

const GET_RECENT_INTAKES = `
query RecentIntakes {
  recentIntakes {
    success
    message
    data {
      id
      name
      countryCode
      mobile
      gender
      birthDate
      birthTime
      occupation
      birthPlace
      __typename
    }
    __typename
  }
}
`;

export const getRecentIntakes = async () => {
  try {
    const response = await graphqlRequest<RecentIntakesResponse>(
      'RecentIntakes',
      GET_RECENT_INTAKES,
      {},
    );

    // console.log('RECENT INTAKES RESPONSE:', response);

    return response.recentIntakes;
  } catch (error) {
    console.log('RECENT INTAKES API ERROR:', error);
    throw error;
  }
};
