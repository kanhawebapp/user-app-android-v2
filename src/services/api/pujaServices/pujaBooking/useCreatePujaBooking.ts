import {useCallback, useRef, useState} from 'react';

import {createPujaBooking} from './pujaBooking.api';
import {
  CreatePujaBookingInput,
  PujaBooking,
} from './pujaBooking.types';

/**
 * Creates a puja booking from Buy It Now. An in-flight ref blocks duplicate
 * submissions while the mutation is running.
 */
export const useCreatePujaBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [booking, setBooking] = useState<PujaBooking | null>(null);
  const inFlightRef = useRef(false);

  const submitBooking = useCallback(
    async (input: CreatePujaBookingInput): Promise<PujaBooking | null> => {
      if (inFlightRef.current) {
        return null;
      }

      inFlightRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await createPujaBooking(input);

        if (!response?.id) {
          throw new Error('Booking was created without a valid id.');
        }

        setBooking(response);
        return response;
      } catch (err: unknown) {
        console.log('CREATE PUJA BOOKING HOOK ERROR:', err);
        setError(err);
        throw err;
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  const resetBooking = useCallback(() => {
    setBooking(null);
    setError(null);
  }, []);

  return {
    booking,
    loading,
    error,
    submitBooking,
    resetBooking,
  };
};
