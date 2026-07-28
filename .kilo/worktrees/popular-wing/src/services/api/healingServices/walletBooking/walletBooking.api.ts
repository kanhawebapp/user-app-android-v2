import { graphqlRequest } from '../../graphql.client';

import {
    ConfirmWalletBookingInput,
    ConfirmWalletBookingResponse,
    WalletBooking,
} from './walletBooking.types';

const CONFIRM_WALLET_BOOKING = `
mutation ConfirmWalletBooking(
  $bookingId: ID!,
  $astrologerId: ID!,
  $walletAmount: Float!
) {
  confirmWalletBooking(
    bookingId: $bookingId
    astrologerId: $astrologerId
    walletAmount: $walletAmount
  ) {
    success
    message
    booking {
      id
      bookingStatus
      paymentStatus
    }
  }
}
`;

export const confirmWalletBooking = async (
    input: ConfirmWalletBookingInput,
): Promise<ConfirmWalletBookingResponse> => {
    try {
        const response =
            await graphqlRequest<ConfirmWalletBookingResponse>(
                'ConfirmWalletBooking',
                CONFIRM_WALLET_BOOKING,
                input,
            );

        console.log(
            'CONFIRM WALLET BOOKING RESPONSE:',
            JSON.stringify(response, null, 2),
        );

        return response?.confirmWalletBooking;
    } catch (error: any) {
        console.log(
            'CONFIRM WALLET BOOKING ERROR:',
            JSON.stringify(
                error?.response?.data || error?.message || error,
                null,
                2,
            ),
        );

        throw error;
    }
};