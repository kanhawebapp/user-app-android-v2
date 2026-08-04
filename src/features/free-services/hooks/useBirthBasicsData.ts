/**
 * Basic tab data hook.
 *
 * Fetches the three "Basic" endpoints in parallel with `Promise.all`:
 *  - /v1/birth_details
 *  - /v1/basic_panchang
 *  - /v1/astro_details
 *
 * Each request settles on its own, so a single failure does not prevent the
 * other two cards from rendering. Successful responses are cached keyed by
 * endpoint + payload, so re-opening the screen never repeats a request.
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
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';
import type {AsyncResult} from './asyncTypes';

export interface UseBirthBasicsDataReturn {
  birthDetails: AsyncResult<BirthDetailsResponse>;
  panchang: AsyncResult<BasicPanchangResponse>;
  astroDetails: AsyncResult<AstroDetailsResponse>;
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-card errors live on the results. */
  error: any;
  /** Re-fetch all three endpoints in parallel, bypassing the cache. */
  reload: () => void;
}

const empty = <T>(): AsyncResult<T> => ({
  data: null,
  error: null,
  loading: true,
});

const ENDPOINTS = ['birth_details', 'basic_panchang', 'astro_details'] as const;

/** Hydrates hook state synchronously from the response cache (if present). */
const hydrate = <T>(endpoint: string, payload: AstrologyMuhurtaPayload | null) =>
  payload
    ? getCachedResponse<T>(buildKundliCacheKey(endpoint, payload)) ?? null
    : null;

export const useBirthBasicsData = (
  payload: AstrologyMuhurtaPayload | null,
): UseBirthBasicsDataReturn => {
  const [birthDetails, setBirthDetails] = useState<AsyncResult<BirthDetailsResponse>>(
    () => {
      const cached = hydrate<BirthDetailsResponse>('birth_details', payload);
      return cached ? {data: cached, error: null, loading: false} : empty();
    },
  );
  const [panchang, setPanchang] = useState<AsyncResult<BasicPanchangResponse>>(
    () => {
      const cached = hydrate<BasicPanchangResponse>('basic_panchang', payload);
      return cached ? {data: cached, error: null, loading: false} : empty();
    },
  );
  const [astroDetails, setAstroDetails] = useState<AsyncResult<AstroDetailsResponse>>(
    () => {
      const cached = hydrate<AstroDetailsResponse>('astro_details', payload);
      return cached ? {data: cached, error: null, loading: false} : empty();
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (force = false) => {
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

      await Promise.all([
        fetchWithCache({
          key: buildKundliCacheKey('birth_details', payload),
          request: () => getBirthDetails(payload),
          apply: setBirthDetails,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('basic_panchang', payload),
          request: () => getBasicPanchang(payload),
          apply: setPanchang,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('astro_details', payload),
          request: () => getAstroDetails(payload),
          apply: setAstroDetails,
          bypassCache: force,
        }),
      ]);

      setLoading(false);
    },
    [payload],
  );

  useEffect(() => {
    if (!payload) {
      fetchData();
      return;
    }
    // Everything already cached: hydrate once in the state initialisers and
    // skip the request entirely.
    const allCached = ENDPOINTS.every(endpoint =>
      hasCachedResponse(buildKundliCacheKey(endpoint, payload)),
    );
    if (!allCached) {
      fetchData();
    }
  }, [fetchData, payload]);

  return {
    birthDetails,
    panchang,
    astroDetails,
    loading,
    error,
    reload: () => fetchData(true),
  };
};
