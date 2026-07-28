import {useEffect, useState} from 'react';

import {getMyServiceBookings} from './my-service-bookings.api';

import {
  MyServiceBooking,
} from './my-service-bookings.types';

export const useMyServiceBookings =
  () => {
    const [bookings, setBookings] =
      useState<MyServiceBooking[]>(
        [],
      );

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<any>(null);

    const fetchBookings =
      async () => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await getMyServiceBookings();

          const bookingsData = Array.isArray(response)
            ? response
            : response?.data || [];

          setBookings(
            bookingsData,
          );
        } catch (err: any) {
          console.log(
            'MY SERVICE BOOKINGS HOOK ERROR:',
            err,
          );

          setError(err);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      fetchBookings();
    }, []);

    return {
      bookings,

      loading,

      error,

      refresh: fetchBookings,
    };
  };