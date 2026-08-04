/**
 * Basic tab data hook.
 *
 * Fetches the three "Basic" endpoints in parallel with `Promise.all`:
 *  - /v1/birth_details
 *  - /v1/basic_panchang
 *  - /v1/astro_details
 *
 * Each request settles on its own, so a single failure does not prevent the
 * other two cards from rendering.
 */

import {useCallback, useEffect, useState} from 'react';

import {
  getAstroDetails,
  getBasicPanchang,
  getBirthDetails,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstroDetailsResponse,
  AstrologyMuhurtaPayload,
  BasicPanchangResponse,
  BirthDetailsResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from './asyncTypes';

export interface UseBirthBasicsDataReturn {
  birthDetails: AsyncResult<BirthDetailsResponse>;
  panchang: AsyncResult<BasicPanchangResponse>;
  astroDetails: AsyncResult<AstroDetailsResponse>;
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-card errors live on the results. */
  error: any;
  /** Re-fetch all three endpoints in parallel. */
  reload: () => void;
}

const empty = <T>(): AsyncResult<T> => ({
  data: null,
  error: null,
  loading: true,
});

export const useBirthBasicsData = (
  payload: AstrologyMuhurtaPayload | null,
): UseBirthBasicsDataReturn => {
  const [birthDetails, setBirthDetails] =
    useState<AsyncResult<BirthDetailsResponse>>(empty);
  const [panchang, setPanchang] =
    useState<AsyncResult<BasicPanchangResponse>>(empty);
  const [astroDetails, setAstroDetails] =
    useState<AsyncResult<AstroDetailsResponse>>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!payload) {
      setBirthDetails(empty());
      setPanchang(empty());
      setAstroDetails(empty());
      setLoading(false);
      setError(new Error('Birth details are missing.'));
      return;
    }

    setLoading(true);
    setError(null);

    const run = async <T>(
      request: Promise<T>,
      apply: (result: AsyncResult<T>) => void,
    ) => {
      try {
        const data = await request;
        apply({data, error: null, loading: false});
      } catch (err: any) {
        apply({data: null, error: err, loading: false});
      }
    };

    await Promise.all([
      run<BirthDetailsResponse>(getBirthDetails(payload), setBirthDetails),
      run<BasicPanchangResponse>(getBasicPanchang(payload), setPanchang),
      run<AstroDetailsResponse>(getAstroDetails(payload), setAstroDetails),
    ]);

    setLoading(false);
  }, [payload]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    birthDetails,
    panchang,
    astroDetails,
    loading,
    error,
    reload: fetchData,
  };
};
