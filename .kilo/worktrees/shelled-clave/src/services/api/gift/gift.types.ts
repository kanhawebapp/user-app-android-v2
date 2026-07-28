export interface Gift {
  id: string;

  name: string;

  amount: number;

  image: string;

  status: string;
}

export interface GiftPagination {
  totalCount: number;

  data: Gift[];
}

export interface GetGiftsResponse {
  getGifts: GiftPagination;
}
