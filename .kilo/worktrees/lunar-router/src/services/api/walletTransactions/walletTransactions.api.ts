import { graphqlRequest } from '../graphql.client';
import {GET_WALLET_TRANSACTIONS} from './walletTransactions.query';
import {
  WalletTransactionInput,
  WalletTransactionResponse,
} from './walletTransactions.types';

export const getWalletTransactions = async (
  input: WalletTransactionInput,
): Promise<WalletTransactionResponse> => {
  try {
    const response = await graphqlRequest<{
      getWalletTransactions: WalletTransactionResponse;
    }>(
      'GetWalletTransactions',
      GET_WALLET_TRANSACTIONS,
    );

    return response.getWalletTransactions;
  } catch (error) {
    console.log('WALLET TRANSACTION API ERROR:', error);
    throw error;
  }
};