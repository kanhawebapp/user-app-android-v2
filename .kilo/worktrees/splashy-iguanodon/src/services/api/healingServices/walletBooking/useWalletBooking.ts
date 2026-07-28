import {useState} from 'react';

import {confirmWalletBooking} from './walletBooking.api';

import {
  ConfirmWalletBookingInput,
  WalletBooking,
} from './walletBooking.types';

export const useWalletBooking = () => {
  const [booking, setBooking] =
    useState<WalletBooking | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const confirmBooking = async (
    input: ConfirmWalletBookingInput,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await confirmWalletBooking(input);

      setBooking(response.booking);

      return response;
    } catch (err: any) {
      console.log('WALLET BOOKING HOOK ERROR:', err);

      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    booking,
    loading,
    error,
    confirmBooking,
  };
};