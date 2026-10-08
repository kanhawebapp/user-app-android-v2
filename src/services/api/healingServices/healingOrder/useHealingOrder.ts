import { useState } from 'react';

import { createHealingOrder } from './healingOrder.api';

import {
  CreateHealingOrderInput,
  HealingOrder,
} from './healingOrder.types';

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
        input: CreateHealingOrderInput,
      ) => {
        try {
          setLoading(true);

          setError(null);
          console.log(
            'CREATE HEALING ORDER INPUT:',
            JSON.stringify(input, null, 2),
          );

          const response =
            await createHealingOrder(
              input,
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