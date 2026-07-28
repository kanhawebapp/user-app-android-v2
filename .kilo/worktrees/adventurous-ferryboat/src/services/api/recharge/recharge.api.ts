import {graphqlRequest} from '../graphql.client';
import {RechargePackResponse} from './recharge.types';

const GET_RECHARGE_PACKS = `
query GetRechargePacks {
  getRechargePacks {
    data {
      id
      name
      description
      price
      talktime
      __typename
    }
    totalCount
    __typename
  }
}
`;

export const getRechargePacks = async () => {
  try {
    const response = await graphqlRequest<RechargePackResponse>(
      'GetRechargePacks',
      GET_RECHARGE_PACKS,
      {},
    );

    return response.getRechargePacks;
  } catch (error) {
    console.log('RECHARGE API ERROR:', error);
    throw error;
  }
};
