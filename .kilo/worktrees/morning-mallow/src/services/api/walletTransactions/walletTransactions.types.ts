// export type TransactionType = 'CREDIT' | 'DEBIT';

// export interface WalletTransaction {
//   id: string;
//   type: TransactionType;
//   coins: number;
//   amount: number;
//   description: string;
//   createdAt: string;
// }

// export interface WalletTransactionResponse {
//   data: WalletTransaction[];
//   totalCount: number;
//   currentPage: number;
//   totalPages: number;
// }

// export interface WalletTransactionInput {
//   page?: number;
//   limit?: number;
//   type?: TransactionType;
//   fromDate?: string;
//   toDate?: string;

// }

export type TransactionType = 'CREDIT' | 'DEBIT';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  coins: number;
  amount: number | null;
  description: string;
  astrologerName?: string;
  createdAt: string;
}

export interface WalletTransactionResponse {
  data: WalletTransaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface WalletTransactionFilter {
  type?: TransactionType[];
  page?: number;
  limit?: number;
}
