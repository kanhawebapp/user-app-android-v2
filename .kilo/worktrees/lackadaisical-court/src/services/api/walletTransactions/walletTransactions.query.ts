// export const GET_WALLET_TRANSACTIONS = `

// query GetWalletTransactions(
//   $page: Int
//   $limit: Int
//   $type: String
//   $fromDate: String
//   $toDate: String
// ) {
//   getWalletTransactions(
//     page: $page
//     limit: $limit
//     type: $type
//     fromDate: $fromDate
//     toDate: $toDate
//   ) {
//     data {
//       id
//       type
//       coins
//       amount
//       description
//       createdAt
//     }
//     totalCount
//     currentPage
//     totalPages
//   }
// }
// `;

export const GET_WALLET_TRANSACTIONS = `
query GetUserWalletTransactions($filter: WalletTransactionFilter) {
  getUserWalletTransactions(filter: $filter) {
    data {
      id
      type
      coins
      amount
      description
      astrologerName
      createdAt
    }
    totalCount
    currentPage
    totalPages
  }
}
`;
