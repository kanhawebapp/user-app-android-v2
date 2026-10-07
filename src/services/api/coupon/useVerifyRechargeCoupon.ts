import {useCallback, useEffect, useRef, useState} from 'react';

import {verifyRechargeCoupon} from './coupon.api';

import {
  VerifyRechargeCouponInput,
  VerifyRechargeCouponResult,
} from './coupon.types';

/**
 * Runs the `VerifyRechargeCoupon` mutation for the recharge payment flow.
 *
 * - `loading` drives the Apply button's spinner / disabled state.
 * - An in-flight ref guards against duplicate requests, so repeated Apply
 *   taps while a verification is running are ignored (`verify` resolves to
 *   `null` for the ignored caller) instead of firing a second mutation.
 * - Errors are both stored in `error` and re-thrown so the caller can show
 *   the backend / network message through the existing toast helpers.
 */
export const useVerifyRechargeCoupon = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const isMountedRef = useRef(true);

  const isRequestInFlightRef = useRef(false);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const verify = useCallback(
    async (
      input: VerifyRechargeCouponInput,
    ): Promise<VerifyRechargeCouponResult | null> => {
      if (isRequestInFlightRef.current) {
        return null;
      }

      isRequestInFlightRef.current = true;

      try {
        setLoading(true);

        setError(null);

        const result = await verifyRechargeCoupon(input);

        if (!isMountedRef.current) {
          return null;
        }

        return result;
      } catch (err: any) {
        console.log('VERIFY RECHARGE COUPON HOOK ERROR:', err);

        if (!isMountedRef.current) {
          return null;
        }

        setError(err);

        throw err;
      } finally {
        isRequestInFlightRef.current = false;

        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return {
    loading,
    error,
    verify,
  };
};
