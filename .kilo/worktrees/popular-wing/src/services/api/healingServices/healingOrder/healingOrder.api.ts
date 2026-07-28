// import {graphqlRequest} from '../../graphql.client';

// import {
//   CreateHealingOrderInput,
//   CreateHealingOrderResponse,
//   HealingOrder,
// } from './healingOrder.types';

// const CREATE_HEALING_ORDER = `
// mutation CreateHealingOrder($bookingId: ID!, $useWallet: Boolean!) {
//   createHealingOrder(bookingId: $bookingId, useWallet: $useWallet) {
//     success
//     orderId
//     bookingId
//     currency
//     totalAmount
//     walletAmount
//     payableAmount
//   }
// }
// `;

// export const createHealingOrder = async (
//   input: CreateHealingOrderInput,
// ): Promise<HealingOrder> => {
//   try {
//     const response =
//       await graphqlRequest<CreateHealingOrderResponse>(
//         'CreateHealingOrder',
//         CREATE_HEALING_ORDER,
//         input,
//       );

//     console.log(
//       'CREATE HEALING ORDER RESPONSE:',
//       JSON.stringify(response, null, 2),
//     );

//     return response?.createHealingOrder;
//   } catch (error: any) {
//     console.log(
//       'CREATE HEALING ORDER ERROR:',
//       JSON.stringify(
//         error?.response?.data || error?.message || error,
//         null,
//         2,
//       ),
//     );

//     throw error;
//   }
// };

import {graphqlRequest} from '../../graphql.client';
import { CreateHealingOrderResponse, HealingOrder } from './healingOrder.types';

// import {
//   CreateHealingOrderResponse,
//   HealingOrder,
// } from './healing-order.types';

const CREATE_HEALING_ORDER = `
mutation CreateHealingOrder(
  $bookingId: ID!
) {
  createHealingOrder(
    bookingId: $bookingId
  ) {
    success
    orderId
    bookingId
    currency
    totalAmount
    payableAmount
  }
}
`;

export const createHealingOrder =
  async (
    bookingId: string,
  ): Promise<HealingOrder> => {
    try {
      const response =
        await graphqlRequest<CreateHealingOrderResponse>(
          'CreateHealingOrder',
          CREATE_HEALING_ORDER,
          {
            bookingId,
          },
        );

      console.log(
        'CREATE HEALING ORDER RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      return response.createHealingOrder;
    } catch (error: any) {
      console.log(
        'CREATE HEALING ORDER ERROR:',
        JSON.stringify(
          error?.response?.data ||
            error?.message ||
            error,
          null,
          2,
        ),
      );

      throw error;
    }
  };