
export interface RechargePack {
  id: string;
  name: string;
  description: string;
  price: number;
  talktime: number;
  __typename?: string;
}

export interface RechargePackResponse {
  getRechargePacks: {
    data: RechargePack[];
    totalCount: number;
    __typename?: string;
  };
}

/* ================= ORDER TYPES ================= */

export interface CreateRechargeOrderInput {
  packId: string;
  mobileNumber: string;
}

export interface RechargeOrder {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  __typename?: string;
}

export interface CreateRechargeOrderResponse {
  createRechargeOrder: {
    data: RechargeOrder;
    message: string;
    __typename?: string;
  };
}
