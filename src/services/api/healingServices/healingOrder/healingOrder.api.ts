import {graphqlRequest} from '../../graphql.client';

import {
  CreateHealingOrderInput,
  CreateHealingOrderResponse,
  HealingOrder,
} from './healingOrder.types';

const CREATE_HEALING_ORDER = `
mutation CreateHealingOrder($input: CreateHealingOrderInput!) {
  createHealingOrder(input: $input) {
    success
    orderId
    bookingId
    currency
    totalAmount
    amount
    __typename
  }
}
`;

/**
 * Creates the payment order for a service booking.
 *
 * The whole payload travels as a single `CreateHealingOrderInput` variable
 * (`{ input }`), so `bookingId`, `couponCode` and `amount` are always supplied
 * by the caller and never inlined into the query.
 */
export const createHealingOrder =
  async (
    input: CreateHealingOrderInput,
  ): Promise<HealingOrder> => {
    try {
      const response =
        await graphqlRequest<CreateHealingOrderResponse>(
          'CreateHealingOrder',
          CREATE_HEALING_ORDER,
          {input},
        );

      // console.log(
      //   'CREATE HEALING ORDER RESPONSE:',
      //   JSON.stringify(response, null, 2),
      // );

      return response?.createHealingOrder;
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