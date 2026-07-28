import {graphqlRequest} from '../../graphql.client';

import {
  UpdateBookingAstrologerInput,
  UpdateBookingAstrologerResponse,
  UpdatedBookingAstrologer,
} from './bookingAstrologer.types';

const UPDATE_BOOKING_ASTROLOGER = `
mutation UpdateBookingAstrologer($bookingId: ID!, $astrologerId: ID!) {
  updateBookingAstrologer(bookingId: $bookingId, astrologerId: $astrologerId) {
    id
    astrologerId
  }
}
`;

export const updateBookingAstrologer = async (
  input: UpdateBookingAstrologerInput,
): Promise<UpdatedBookingAstrologer> => {
  try {
    const response =
      await graphqlRequest<UpdateBookingAstrologerResponse>(
        'UpdateBookingAstrologer',
        UPDATE_BOOKING_ASTROLOGER,
        input,
      );

    console.log(
      'UPDATE BOOKING ASTROLOGER RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response?.updateBookingAstrologer;
  } catch (error: any) {
    console.log(
      'UPDATE BOOKING ASTROLOGER ERROR:',
      JSON.stringify(
        error?.response?.data || error?.message || error,
        null,
        2,
      ),
    );

    throw error;
  }
};