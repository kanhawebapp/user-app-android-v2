/**
 * "My Day Today" data hook.
 *
 * Fetches the daily numerology prediction (POST /v1/numero_prediction/daily)
 * for the user's own birth details. The response is cached in the shared
 * Kundli response cache, keyed by endpoint + payload + today's date, so:
 *  - re-opening the screen (or re-rendering it) never repeats a request,
 *  - a past prediction is refetched once the local day rolls over.
 *
 * The request is only issued when the name + DOB are actually available, so an
 * incomplete profile renders a message instead of sending invalid data.
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import {getNumeroPredictionDaily} from '../../../services/api/astrologyApi/astrology.api';
import type {
  NumeroPredictionResponse,
  NumeroRequestPayload,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';
import {getTodayCacheSuffix} from '../utils/myDayToday';

export const MY_DAY_TODAY_ENDPOINT = 'numero_prediction/daily';

export interface UseMyDayTodayReturn {
  /** Normalised API response (null before the first successful load). */
  data: NumeroPredictionResponse | null;
  /** True while the request is in flight. */
  loading: boolean;
  /** Error from the latest attempt (null on success). */
  error: any;
  /** True when the name / DOB needed for the request is missing. */
  missingDetails: boolean;
  /** Re-fetch, bypassing the cache. */
  reload: () => void;
}

const cacheKeyFor = (payload: NumeroRequestPayload): string =>
  buildKundliCacheKey(MY_DAY_TODAY_ENDPOINT, {
    ...payload,
    as_of: getTodayCacheSuffix(),
  });

export const useMyDayToday = (
  payload: NumeroRequestPayload | null,
): UseMyDayTodayReturn => {
  const payloadRef = useRef(payload);

  const [data, setData] = useState<NumeroPredictionResponse | null>(() =>
    payload
      ? getCachedResponse<NumeroPredictionResponse>(cacheKeyFor(payload))
      : null,
  );
  const [loading, setLoading] = useState(() =>
    payload ? !hasCachedResponse(cacheKeyFor(payload)) : false,
  );
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async (force = false) => {
    const target = payloadRef.current;
    if (!target) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    await fetchWithCache<NumeroPredictionResponse>({
      key: cacheKeyFor(target),
      request: () => getNumeroPredictionDaily(target),
      apply: result => {
        // Ignore a response for a payload that is no longer current.
        if (payloadRef.current !== target) {
          return;
        }
        setData(result.data ?? null);
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
      setError(null);
      setLoading(false);
      return;
    }

    // Already fetched for this user today: serve it without a new request.
    // (Still applied to state, so a payload resolved after mount hydrates.)
    if (hasCachedResponse(cacheKeyFor(payload))) {
      setData(
        getCachedResponse<NumeroPredictionResponse>(cacheKeyFor(payload)),
      );
      setError(null);
      setLoading(false);
      return;
    }

    fetchData();
  }, [payload, fetchData]);

  return {
    data,
    loading,
    error,
    missingDetails: !payload,
    reload: () => fetchData(true),
  };
};
