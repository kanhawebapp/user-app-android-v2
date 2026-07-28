// import axios from 'axios';
// import {API_BASE_URL} from '../../../constants/api.constants';
// export const createRechargeOrder = async (amount: number) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL.DEVELOPMENT}api/createOrder`,
//       {
//         amount,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log('CREATE ORDER RESPONSE:', response.data);

//     return response.data;
//   } catch (error: any) {
//     console.log(
//       'CREATE ORDER API ERROR:',
//       error?.response?.data || error?.message,
//     );
//     throw error;
//   }
// };

import {graphqlRequest} from '../graphql.client';

const CREATE_ORDER = `
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    success
    orderId
    amount
    currency
    __typename
  }
}
`;

export const createRechargeOrder = async (rechargePackId: string) => {
  try {
    const response = await graphqlRequest('CreateOrder', CREATE_ORDER, {
      input: {
        rechargePackId,
      },
    });

    console.log('CREATE ORDER RESPONSE:', response);

    return response.createOrder;
  } catch (error) {
    console.log('CREATE ORDER API ERROR:', error);
    throw error;
  }
};
