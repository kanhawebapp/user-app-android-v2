import {graphqlRequest} from '../../graphql.client';

import {
  CreatePujaBookingInput,
  CreatePujaBookingResponse,
  PujaBooking,
} from './pujaBooking.types';

const CREATE_PUJA_BOOKING = `
mutation CreatePujaBooking($input: CreatePujaBookingInput!) {
  createPujaBooking(input: $input) {
    id
    pujaId
    mantraOptionId
    mantraOptionName
    quantity
    unitPrice
    totalAmount
    paymentStatus
    bookingStatus
    __typename
  }
}
`;

/**
 * Creates a puja booking before payment.
 *
 * The whole payload travels as a single `CreatePujaBookingInput` variable
 * (`{ input }`), so `pujaId`, `mantraOptionId` and `quantity` are always
 * supplied by the caller and never inlined into the query.
 */
export const createPujaBooking = async (
  input: CreatePujaBookingInput,
): Promise<PujaBooking> => {
  try {
    const response = await graphqlRequest<CreatePujaBookingResponse>(
      'CreatePujaBooking',
      CREATE_PUJA_BOOKING,
      {input},
    );

    return response?.createPujaBooking;
  } catch (error: any) {
    console.log(
      'CREATE PUJA BOOKING ERROR:',
      JSON.stringify(
        error?.response?.data || error?.message || error,
        null,
        2,
      ),
    );

    throw error;
  }
};
