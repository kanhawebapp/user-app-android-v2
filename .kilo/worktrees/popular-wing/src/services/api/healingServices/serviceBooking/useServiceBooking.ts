// import {useState} from 'react';


// import {createServiceBooking} from './serviceBooking.api';

// import {
//   CreateServiceBookingInput,
//   ServiceBooking,
// } from './serviceBooking.types';

// export const useServiceBooking = () => {
//   const [booking, setBooking] =
//     useState<ServiceBooking | null>(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState<any>(null);

//   const bookService = async (
//     input: CreateServiceBookingInput,
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response =
//         await createServiceBooking(input);

//       setBooking(response);

//       return response;
//     } catch (err: any) {
//       console.log('SERVICE BOOKING HOOK ERROR:', err);

//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     booking,
//     loading,
//     error,
//     bookService,
//   };
// };


import { useState } from 'react';
import { CreateServiceBookingInput, ServiceBooking } from './serviceBooking.types';
import { createServiceBooking } from './serviceBooking.api';

export const useCreateServiceBooking =
  () => {
    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<any>(null);

    const [booking, setBooking] =
      useState<ServiceBooking | null>(
        null,
      );

    const submitBooking =
      async (
        input: CreateServiceBookingInput,
      ) => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await createServiceBooking(
              input,
            );

          setBooking(response);

          return response;
        } catch (err: any) {
          console.log(
            'CREATE SERVICE BOOKING HOOK ERROR:',
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

      submitBooking,
    };
  };

