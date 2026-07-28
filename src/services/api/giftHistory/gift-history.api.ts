import {graphqlRequest} from '../graphql.client';

import {GetGiftHistoryResponse} from './gift-history.types';

const GET_GIFT_HISTORY = `
query GetGiftHistory {
  getGiftHistory {
    id

    giftName

    giftPrice

    createdAt

    user {
      id

      name

      mobile
    }

    astrologer {
      id

      name

      profilePic
    }
  }
}
`;

export const getGiftHistory =
  async () => {
    try {
      const response =
        await graphqlRequest<GetGiftHistoryResponse>(
          'GetGiftHistory',
          GET_GIFT_HISTORY,
        );

      console.log(
        'GIFT HISTORY RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return response.getGiftHistory;
    } catch (error: any) {
      console.log(
        'GET GIFT HISTORY ERROR:',
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