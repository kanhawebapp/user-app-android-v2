import {graphqlRequest} from '../../graphql.client';

import {
  CreatePujaOrderInput,
  CreatePujaOrderResponse,
  PujaOrder,
} from './pujaOrder.types';

const CREATE_PUJA_ORDER = `
mutation CreatePujaOrder($input: CreatePujaOrderInput!) {
  createPujaOrder(input: $input) {
    success
    message
    orderId
    amount
    currency
    bookingId
    pujaTitle
    totalAmount
    __typename
  }
}
`;

/**
 * Creates the Razorpay payment order for a puja booking.
 *
 * The whole payload travels as a single `CreatePujaOrderInput` variable
 * (`{ input }`). The client must never invent a Razorpay order id — only
 * the backend-returned `orderId` / `amount` / `currency` are used at checkout.
 */
export const createPujaOrder = async (
  input: CreatePujaOrderInput,
): Promise<PujaOrder> => {
  try {
    const response = await graphqlRequest<CreatePujaOrderResponse>(
      'CreatePujaOrder',
      CREATE_PUJA_ORDER,
      {input},
    );

    return response?.createPujaOrder;
  } catch (error: any) {
    console.log(
      'CREATE PUJA ORDER ERROR:',
      JSON.stringify(
        error?.response?.data || error?.message || error,
        null,
        2,
      ),
    );

    throw error;
  }
};
