/**
 * Match Making (Kundli Milan) data hook.
 *
 * The form screen already awaits the five endpoints before navigating, so the
 * bundle it produced is cached (keyed by endpoint + two-person payload, via the
 * shared Kundli cache) and served to the report screen without a second round
 * trip. When the cache is cold — e.g. the report screen is remounted — the hook
 * refetches and shows its own loading state.
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import type {MatchMakingPayload} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
  setCachedResponse,
} from '../utils/kundliApiCache';
import {
  EMPTY_MATCH_MAKING_BUNDLE,
  fetchMatchMakingBundle,
  type MatchMakingBundle,
} from '../utils/matchMaking';
import type {UseFieldReturn} from './useDoshaEndpoint';

/** Cache key prefix for the whole Match Making bundle. */
const MATCH_BUNDLE_ENDPOINT = 'match_making_bundle';

export const buildMatchMakingCacheKey = (
  payload: MatchMakingPayload | null | undefined,
): string => buildKundliCacheKey(MATCH_BUNDLE_ENDPOINT, payload);

/** Stores a fetched bundle so the report screen can render it instantly. */
export const cacheMatchMakingBundle = (
  payload: MatchMakingPayload,
  bundle: MatchMakingBundle,
): void => {
  setCachedResponse(buildMatchMakingCacheKey(payload), bundle);
};

export const useMatchMaking = (
  payload: MatchMakingPayload | null,
  preloadedBundle?: MatchMakingBundle | null,
): UseFieldReturn<MatchMakingBundle> => {
  const payloadRef = useRef(payload);

  const [data, setData] = useState<MatchMakingBundle | null>(() => {
    if (preloadedBundle) {
      return preloadedBundle;
    }
    if (!payload) {
      return null;
    }
    return getCachedResponse<MatchMakingBundle>(
      buildMatchMakingCacheKey(payload),
    );
  });
  const [loading, setLoading] = useState(() => {
    if (preloadedBundle) {
      return false;
    }
    return payload
      ? !hasCachedResponse(buildMatchMakingCacheKey(payload))
      : false;
  });
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async (force = false) => {
    const target = payloadRef.current;
    if (!target) {
      setData(null);
      setError(new Error('Birth details are missing.'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    await fetchWithCache<MatchMakingBundle>({
      key: buildMatchMakingCacheKey(target),
      request: () => fetchMatchMakingBundle(target),
      apply: result => {
        // Ignore a response that belongs to a payload the user already changed.
        if (payloadRef.current !== target) {
          return;
        }
        setData(result.data ? result.data : EMPTY_MATCH_MAKING_BUNDLE);
        setError(result.error);
      },
      bypassCache: force,
    });

    if (payloadRef.current === target) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    payloadRef.current = payload;

    if (!payload) {
      setData(null);
      setError(new Error('Birth details are missing.'));
      setLoading(false);
      return;
    }

    if (preloadedBundle) {
      cacheMatchMakingBundle(payload, preloadedBundle);
      setData(preloadedBundle);
      setError(null);
      setLoading(false);
      return;
    }

    if (hasCachedResponse(buildMatchMakingCacheKey(payload))) {
      setData(
        getCachedResponse<MatchMakingBundle>(buildMatchMakingCacheKey(payload)),
      );
      setError(null);
      setLoading(false);
      return;
    }

    fetchData();
  }, [payload, preloadedBundle, fetchData]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      reload: () => {
        fetchData(true);
      },
    }),
    [data, loading, error, fetchData],
  );
};
