export interface ConfirmWalletBookingInput {
  bookingId: string;
  astrologerId: string;
  walletAmount: number;
}

export interface WalletBooking {
  id: string;
  bookingStatus: string;
  paymentStatus: string;
}

export interface ConfirmWalletBookingResponse {
  confirmWalletBooking: ConfirmWalletBookingResponse | PromiseLike<ConfirmWalletBookingResponse>;
  success: boolean;
  message: string;
  booking: WalletBooking;
}
