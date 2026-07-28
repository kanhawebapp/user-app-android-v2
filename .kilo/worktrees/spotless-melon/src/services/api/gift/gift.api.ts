import {graphqlRequest} from '../graphql.client';

import {GetGiftsResponse} from './gift.types';

const GET_GIFTS = `
query GetGifts {
  getGifts {

    totalCount

    data {
      id

      name

      amount

      image

      status
    }
  }
}
`;

export const getGifts = async () => {
  try {
    const response = await graphqlRequest<GetGiftsResponse>(
      'GetGifts',
      GET_GIFTS,
      {},
    );

    console.log('GIFTS RESPONSE:', response);

    return response.getGifts;
  } catch (error: any) {
    console.log(
      'GET GIFTS ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
