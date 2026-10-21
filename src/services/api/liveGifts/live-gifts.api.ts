import {graphqlRequest} from '../graphql.client';
import {
  GetLiveGiftsResponse,
  LiveGift,
  SendLiveGiftResponse,
  SendLiveGiftResult,
  SendLiveGiftVariables,
} from './live-gifts.types';

const GET_LIVE_GIFTS = `
query GetLiveGifts {
  getLiveGifts {
    id
    name
    icon
    price
    __typename
  }
}
`;

const SEND_LIVE_GIFT = `
mutation SendLiveGift(
  $streamId: ID!
  $giftId: ID!
  $quantity: Int!
) {
  sendLiveGift(
    streamId: $streamId
    giftId: $giftId
    quantity: $quantity
  ) {
    success
    message
    giftId
    giftName
    icon
    quantity
    totalCoins
    astrologerCoins
    commissionCoins
    userBalance
    astrologerBalance
    transactionId
    __typename
  }
}
`;

export const getLiveGifts = async (): Promise<LiveGift[]> => {
  try {
    const response = await graphqlRequest<GetLiveGiftsResponse>(
      'GetLiveGifts',
      GET_LIVE_GIFTS,
      {},
    );

    return response.getLiveGifts ?? [];
  } catch (error: any) {
    console.log(
      'GET LIVE GIFTS ERROR:',
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
};

export const sendLiveGift = async (
  variables: SendLiveGiftVariables,
): Promise<SendLiveGiftResult> => {
  try {
    const response = await graphqlRequest<SendLiveGiftResponse>(
      'SendLiveGift',
      SEND_LIVE_GIFT,
      {
        streamId: variables.streamId,
        giftId: variables.giftId,
        quantity: variables.quantity,
      },
    );

    return response.sendLiveGift;
  } catch (error: any) {
    console.log(
      'SEND LIVE GIFT ERROR:',
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
};
