/**
 * Shared single-endpoint hook used by the Kundli Dosha hooks.
 *
 * Fetches an endpoint once per Kundli payload, serves the cached response
 * on later mounts, and ignores stale in-flight responses if the payload
 * changes while a request is still running (prevents race conditions).
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import type {AstrologyMuhurtaPayload} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';

export interface UseFieldReturn<T> {
  /** Normalised data (null before the first successful load). */
  data: T | null;
  /** True while the request is in flight. */
  loading: boolean;
  /** Error from the latest request (e.g. missing birth details). */
  error: any;
  /** Re-fetch, bypassing the cache. */
  reload: () => void;
}

export const useDoshaEndpoint = <R, T>(
  endpoint: string,
  payload: AstrologyMuhurtaPayload | null,
  request: (value: AstrologyMuhurtaPayload) => Promise<R>,
  normalize: (raw: R | null | undefined) => T,
): UseFieldReturn<T> => {
  const payloadRef = useRef(payload);

  const cacheKeyFor = useCallback(
    (value: AstrologyMuhurtaPayload) => buildKundliCacheKey(endpoint, value),
    [endpoint],
  );

  const [data, setData] = useState<T | null>(() => {
    if (!payload || !hasCachedResponse(cacheKeyFor(payload))) {
      return null;
    }
    const cached = getCachedResponse<R>(cacheKeyFor(payload));
    return cached ? normalize(cached) : null;
  });
  const [loading, setLoading] = useState(() =>
    payload ? !hasCachedResponse(cacheKeyFor(payload)) : false,
  );
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (force = false) => {
      const target = payloadRef.current;
      if (!target) {
        setData(null);
        setError(new Error('Birth details are missing.'));
        setLoading(false);
        return;
      }

      const key = cacheKeyFor(target);
      setLoading(true);
      setError(null);

      await fetchWithCache({
        key,
        request: () => request(target),
        apply: result => {
          if (payloadRef.current !== target) {
            return;
          }
          setData(result.data ? normalize(result.data) : null);
          setError(result.error);
        },
        bypassCache: force,
      });

      if (payloadRef.current === target) {
        setLoading(false);
      }
    },
    [cacheKeyFor, request, normalize],
  );

  useEffect(() => {
    payloadRef.current = payload;
    if (!payload) {
      setError(new Error('Birth details are missing.'));
      setLoading(false);
      return;
    }

    if (hasCachedResponse(cacheKeyFor(payload))) {
      return;
    }
    fetchData();
  }, [payload, cacheKeyFor, fetchData]);

  return {
    data,
    loading,
    error,
    reload: () => fetchData(true),
  };
};
