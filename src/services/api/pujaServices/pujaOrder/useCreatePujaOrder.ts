import {useCallback, useRef, useState} from 'react';

import {createPujaOrder} from './pujaOrder.api';
import {CreatePujaOrderInput, PujaOrder} from './pujaOrder.types';

/**
 * Creates a puja payment order from the Payment Screen. An in-flight ref
 * blocks duplicate order creation while the mutation is running.
 */
export const useCreatePujaOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<PujaOrder | null>(null);
  const inFlightRef = useRef(false);

  const createOrder = useCallback(
    async (input: CreatePujaOrderInput): Promise<PujaOrder | null> => {
      if (inFlightRef.current) {
        return null;
      }

      inFlightRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await createPujaOrder(input);

        if (response?.success !== true) {
          throw new Error(
            response?.message || 'Unable to create the puja payment order.',
          );
        }

        if (!response?.orderId) {
          throw new Error(
            response?.message ||
              'Payment order was created without a valid order id.',
          );
        }

        setData(response);
        return response;
      } catch (err: unknown) {
        console.log('CREATE PUJA ORDER HOOK ERROR:', err);
        setError(err);
        throw err;
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    createOrder,
  };
};
