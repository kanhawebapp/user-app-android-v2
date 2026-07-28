export interface GiftHistoryUser {
  id: string;

  name: string;

  mobile: string;
}

export interface GiftHistoryAstrologer {
  id: string;

  name: string;

  profilePic?: string | null;
}

export interface GiftHistory {
  id: string;

  giftName: string;

  giftPrice: number;

  createdAt: string;

  user: GiftHistoryUser;

  astrologer: GiftHistoryAstrologer;
}

export interface GetGiftHistoryResponse {
  getGiftHistory: GiftHistory[];
}