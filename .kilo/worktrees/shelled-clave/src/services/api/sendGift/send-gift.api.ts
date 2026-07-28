import {graphqlRequest} from '../graphql.client';

import {
  SendGiftInput,
  SendGiftGraphQLResponse,
} from './send-gift.types';

const SEND_GIFT = `
mutation SendGift($input: SendGiftInput!) {
  sendGift(input: $input) {
    success

    message

    userBalance

    astrologerBalance
  }
}
`;

export const sendGift = async (
  input: SendGiftInput,
) => {
  try {
    const response =
      await graphqlRequest<SendGiftGraphQLResponse>(
        'SendGift',
        SEND_GIFT,
        {
          input,
        },
      );

    console.log(
      'SEND GIFT RESPONSE:',
      JSON.stringify(
        response,
        null,
        2,
      ),
    );

    return response.sendGift;
  } catch (error: any) {
    console.log(
      'SEND GIFT ERROR:',
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