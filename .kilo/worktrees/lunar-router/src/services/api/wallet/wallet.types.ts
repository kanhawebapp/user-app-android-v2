export interface UserWallet {
  balanceCoins: number;
  lockedCoins: number;
  __typename?: string;
}

export interface UserWalletResponse {
  getUserWallet: UserWallet;
}