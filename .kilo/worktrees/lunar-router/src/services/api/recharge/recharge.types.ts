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