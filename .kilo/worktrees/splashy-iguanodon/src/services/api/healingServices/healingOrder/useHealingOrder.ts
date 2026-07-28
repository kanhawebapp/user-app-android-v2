// import {useState} from 'react';

// import {createHealingOrder} from './healingOrder.api';

// import {
//   CreateHealingOrderInput,
//   HealingOrder,
// } from './healingOrder.types';

// export const useHealingOrder = () => {
//   const [order, setOrder] =
//     useState<HealingOrder | null>(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState<any>(null);

//   const createOrder = async (
//     input: CreateHealingOrderInput,
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response =
//         await createHealingOrder(input);

//       setOrder(response);

//       return response;
//     } catch (err: any) {
//       console.log('HEALING ORDER HOOK ERROR:', err);

//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     order,
//     loading,
//     error,
//     createOrder,
//   };
// };

import { useState } from 'react';
import { HealingOrder } from './healingOrder.types';
import { createHealingOrder } from './healingOrder.api';

// import {createHealingOrder} from './healing-order.api';

// import {HealingOrder} from './healing-order.types';

export const useCreateHealingOrder =
  () => {
    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<any>(null);

    const [data, setData] =
      useState<HealingOrder | null>(
        null,
      );

    const createOrder =
      async (
        bookingId: string,
      ) => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await createHealingOrder(
              bookingId,
            );

          setData(response);

          return response;
        } catch (err: any) {
          console.log(
            'CREATE HEALING ORDER HOOK ERROR:',
            err,
          );

          setError(err);

          throw err;
        } finally {
          setLoading(false);
        }
      };

    return {
      data,

      loading,

      error,

      createOrder,
    };
  };