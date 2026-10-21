export interface LiveGift {
  id: string;
  name: string;
  icon: string;
  price: number;
  __typename?: string;
}

export interface GetLiveGiftsResponse {
  getLiveGifts: LiveGift[];
}

export interface SendLiveGiftVariables {
  streamId: string;
  giftId: string;
  quantity: number;
}

export interface SendLiveGiftResult {
  success: boolean;
  message: string;
  giftId: string;
  giftName: string;
  icon: string;
  quantity: number;
  totalCoins: number;
  astrologerCoins: number;
  commissionCoins: number;
  userBalance: number;
  astrologerBalance: number;
  transactionId: string;
  __typename?: string;
}

export interface SendLiveGiftResponse {
  sendLiveGift: SendLiveGiftResult;
}
