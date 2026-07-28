export interface SendGiftInput {
  astro_id: string;

  gift_id: string;

  giftname: string;

  giftprice: number;

  user_id: string;
}

export interface SendGiftResponse {
  success: boolean;

  message: string;

  userBalance: number;

  astrologerBalance: number;
}

export interface SendGiftGraphQLResponse {
  sendGift: SendGiftResponse;
}