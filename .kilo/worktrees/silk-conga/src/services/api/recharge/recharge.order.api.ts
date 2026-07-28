// import {graphqlRequest} from '../graphql.client';
// import {
//   CreateRechargeOrderResponse,
//   CreateRechargeOrderInput,
// } from './recharge.types';

// const CREATE_RECHARGE_ORDER = `
// mutation CreateRechargeOrder($input: CreateRechargeOrderInput!) {
//   createRechargeOrder(input: $input) {
//     data {
//       id
//       amount
//       status
//       createdAt
//       __typename
//     }
//     message
//     __typename
//   }
// }
// `;

// export const createRechargeOrder = async (input: CreateRechargeOrderInput) => {
//   try {
//     const response = await graphqlRequest<CreateRechargeOrderResponse>(
//       'CreateRechargeOrder',
//       CREATE_RECHARGE_ORDER,
//       {input},
//     );

//     console.log('CREATE ORDER RESPONSE:', response);

//     return response.createRechargeOrder;
//   } catch (error: any) {
//     console.log(
//       'CREATE ORDER API ERROR:',
//       error?.response?.data || error?.message,
//     );
//     throw error;
//   }
// };

import axios from 'axios';
import {API_BASE_URL} from '../../../constants/api.constants';
// `${API_BASE_URL.DEVELOPMENT}dhwani-astro`
export const createRechargeOrder = async (amount: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL.DEVELOPMENT}api/createOrder`,
      //   `${API_BASE_URL.DEVELOPMENT}/createOrder`,
      {
        amount,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // if needed
        },
      },
    );

    console.log('CREATE ORDER RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      'CREATE ORDER API ERROR:',
      error?.response?.data || error?.message,
    );
    throw error;
  }
};
