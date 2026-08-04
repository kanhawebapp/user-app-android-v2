/**
 * Planets tab data hook.
 *
 * Fetches the planets and Maha Vimshottari dasha endpoints in parallel with
 * `Promise.all` the first time the Planets tab is opened (`enabled`):
 *  - /v1/planets
 *  - /v1/major_vdasha
 *
 * The result is kept once loaded, so switching back to the tab never
 * re-triggers a request. Successful responses are cached keyed by endpoint +
 * payload, so re-opening the screen never repeats a request.
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import {
  getMajorVdasha,
  getPlanets,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  MajorDashaPeriod,
  PlanetPosition,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';
import type {AsyncResult} from './asyncTypes';

export interface UsePlanetsDataReturn {
  planets: AsyncResult<PlanetPosition[]>;
  dasha: AsyncResult<MajorDashaPeriod[]>;
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-section errors live on the results. */
  error: any;
  /** Re-fetch both endpoints, bypassing the cache. */
  reload: () => void;
}

const empty = <T>(): AsyncResult<T> => ({
  data: null,
  error: null,
  loading: true,
});

/** Hydrates hook state synchronously from the response cache (if present). */
const hydrate = <T>(
  endpoint: string,
  payload: AstrologyMuhurtaPayload | null,
) =>
  payload
    ? getCachedResponse<T>(buildKundliCacheKey(endpoint, payload)) ?? null
    : null;

export const usePlanetsData = (
  payload: AstrologyMuhurtaPayload | null,
  enabled: boolean,
): UsePlanetsDataReturn => {
  const [planets, setPlanets] = useState<AsyncResult<PlanetPosition[]>>(() => {
    const cached = hydrate<PlanetPosition[]>('planets', payload);
    return cached ? {data: cached, error: null, loading: false} : empty();
  });
  const [dasha, setDasha] = useState<AsyncResult<MajorDashaPeriod[]>>(() => {
    const cached = hydrate<MajorDashaPeriod[]>('major_vdasha', payload);
    return cached ? {data: cached, error: null, loading: false} : empty();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(
    async (force = false) => {
      if (!payload) {
        setPlanets(empty());
        setDasha(empty());
        setLoading(false);
        setError(new Error('Birth details are missing.'));
        return;
      }

      setLoading(true);
      setError(null);

      await Promise.all([
        fetchWithCache({
          key: buildKundliCacheKey('planets', payload),
          request: () => getPlanets(payload),
          apply: setPlanets,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('major_vdasha', payload),
          request: () => getMajorVdasha(payload),
          apply: setDasha,
          bypassCache: force,
        }),
      ]);

      setLoading(false);
    },
    [payload],
  );

  useEffect(() => {
    if (!enabled || fetchedRef.current) {
      return;
    }
    fetchedRef.current = true;
    if (!payload) {
      fetchData();
      return;
    }
    const allCached =
      hasCachedResponse(buildKundliCacheKey('planets', payload)) &&
      hasCachedResponse(buildKundliCacheKey('major_vdasha', payload));
    if (!allCached) {
      fetchData();
    }
  }, [enabled, fetchData, payload]);

  return {
    planets,
    dasha,
    loading,
    error,
    reload: () => {
      fetchedRef.current = true;
      fetchData(true);
    },
  };
};
