import {useState} from 'react';

import {updateBookingAstrologer} from './bookingAstrologer.api';

import {
  UpdateBookingAstrologerInput,
  UpdatedBookingAstrologer,
} from './bookingAstrologer.types';

export const useBookingAstrologer = () => {
  const [booking, setBooking] =
    useState<UpdatedBookingAstrologer | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const assignAstrologer = async (
    input: UpdateBookingAstrologerInput,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await updateBookingAstrologer(input);

      setBooking(response);

      return response;
    } catch (err: any) {
      console.log(
        'UPDATE BOOKING ASTROLOGER HOOK ERROR:',
        err,
      );

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
    assignAstrologer,
  };
};