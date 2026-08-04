/**
 * Planets tab data hook.
 *
 * Fetches the planets and Maha Vimshottari dasha endpoints in parallel with
 * `Promise.all` the first time the Planets tab is opened (`enabled`):
 *  - /v1/planets
 *  - /v1/major_vdasha
 *
 * The result is kept once loaded, so switching back to the tab never
 * re-triggers a request.
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
import type {AsyncResult} from './asyncTypes';

export interface UsePlanetsDataReturn {
  planets: AsyncResult<PlanetPosition[]>;
  dasha: AsyncResult<MajorDashaPeriod[]>;
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-section errors live on the results. */
  error: any;
  /** Re-fetch both endpoints. */
  reload: () => void;
}

const empty = <T>(): AsyncResult<T> => ({
  data: null,
  error: null,
  loading: true,
});

export const usePlanetsData = (
  payload: AstrologyMuhurtaPayload | null,
  enabled: boolean,
): UsePlanetsDataReturn => {
  const [planets, setPlanets] = useState<AsyncResult<PlanetPosition[]>>(empty);
  const [dasha, setDasha] = useState<AsyncResult<MajorDashaPeriod[]>>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!payload) {
      setPlanets(empty());
      setDasha(empty());
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
      run<PlanetPosition[]>(getPlanets(payload), setPlanets),
      run<MajorDashaPeriod[]>(getMajorVdasha(payload), setDasha),
    ]);

    setLoading(false);
  }, [payload]);

  useEffect(() => {
    if (enabled && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    planets,
    dasha,
    loading,
    error,
    reload: () => {
      fetchedRef.current = true;
      fetchData();
    },
  };
};
