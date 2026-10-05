import {useCallback, useEffect, useRef, useState} from 'react';

import {getCoupons} from './coupon.api';

import {Coupon} from './coupon.types';

/**
 * Lazily loads coupons through `GetCoupons`.
 *
 * Deliberately does **not** fetch on mount: the Payment Screen only needs the
 * list once the user opens the coupon sheet, and re-opening the sheet must
 * reuse the coupons already fetched for that screen session.
 *
 * - `hasFetched` turns true after a successful call, which is how the screen
 *   decides between showing the cached list or triggering a request.
 * - An in-flight ref guards against duplicate requests while loading.
 */
export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const [hasFetched, setHasFetched] = useState(false);

  const isMountedRef = useRef(true);

  const isRequestInFlightRef = useRef(false);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const fetchCoupons = useCallback(
    async ({force = false}: {force?: boolean} = {}) => {
      if (isRequestInFlightRef.current) {
        return;
      }

      if (hasFetched && !force) {
        return;
      }

      isRequestInFlightRef.current = true;

      try {
        setLoading(true);

        setError(null);

        const response = await getCoupons();

        if (!isMountedRef.current) {
          return;
        }

        setCoupons(response);

        setHasFetched(true);
      } catch (err: any) {
        console.log('COUPONS HOOK ERROR:', err);

        if (!isMountedRef.current) {
          return;
        }

        setError(err);
      } finally {
        isRequestInFlightRef.current = false;

        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [hasFetched],
  );

  return {
    coupons,
    loading,
    error,
    hasFetched,
    fetchCoupons,
  };
};
