// import { graphqlRequest } from '../graphql.client';
// import {GET_WALLET_TRANSACTIONS} from './walletTransactions.query';
// import {
//   WalletTransactionInput,
//   WalletTransactionResponse,
// } from './walletTransactions.types';

// export const getWalletTransactions = async (
//   input: WalletTransactionInput,
// ): Promise<WalletTransactionResponse> => {
//   try {
//     const response = await graphqlRequest<{
//       getWalletTransactions: WalletTransactionResponse;
//     }>(
//       'GetWalletTransactions',
//       GET_WALLET_TRANSACTIONS,
//     );

//     return response.getWalletTransactions;
//   } catch (error) {
//     console.log('WALLET TRANSACTION API ERROR:', error);
//     throw error;
//   }
// };

import {graphqlRequest} from '../graphql.client';
import {GET_WALLET_TRANSACTIONS} from './walletTransactions.query';
import {
  WalletTransactionFilter,
  WalletTransactionResponse,
} from './walletTransactions.types';

export const getWalletTransactions = async (
  filter: WalletTransactionFilter,
): Promise<WalletTransactionResponse> => {
  try {
    const response = await graphqlRequest<{
      getUserWalletTransactions: WalletTransactionResponse;
    }>('GetUserWalletTransactions', GET_WALLET_TRANSACTIONS, {
      filter, // IMPORTANT
    });

    return response.getUserWalletTransactions;
  } catch (error) {
    console.log('API ERROR:', error);
    throw error;
  }
};
