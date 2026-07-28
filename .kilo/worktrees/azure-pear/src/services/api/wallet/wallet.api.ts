import {graphqlRequest} from '../graphql.client';
import {UserWalletResponse} from './wallet.types';

const GET_USER_WALLET = `
query GetUserWallet {
  getUserWallet {
    balanceCoins
    lockedCoins
    __typename
  }
}
`;

export const getUserWallet = async () => {
  try {
    console.log('=== GET USER WALLET API CALL ===');
    console.log('Calling graphqlRequest...');

    const response = await graphqlRequest<UserWalletResponse>(
      'GetUserWallet',
      GET_USER_WALLET,
      {},
    );

    console.log('WALLET RESPONSE:', response);

    return response.getUserWallet;
  } catch (error: any) {
    console.log('=== WALLET API ERROR ===');
    console.log('Error message:', error?.message);
    console.log('Error response:', error?.response);
    console.log('Error stack:', error?.stack);
    console.log('Full error:', error);
    throw error;
  }
};
