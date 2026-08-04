/**
 * General Life Prediction data hook.
 *
 * Fetches POST /v1/general_nakshatra_report once per Kundli payload. The
 * successful response is cached keyed by endpoint + payload (which includes
 * the gender), so revisiting the screen never repeats a request unless the
 * Kundli details change.
 */

import {useCallback, useEffect, useState} from 'react';

import {getGeneralNakshatraReport} from '../../../services/api/astrologyApi/astrology.api';
import type {
  GeneralNakshatraReportPayload,
  GeneralNakshatraReportResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';
import {
  normalizeGeneralLifePrediction,
  type GeneralLifePredictionData,
} from '../utils/generalLifePrediction';

export interface UseGeneralLifePredictionReturn {
  /** Normalised report sections (null before the first successful load). */
  data: GeneralLifePredictionData | null;
  /** True while the request is in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details or a failed request). */
  error: any;
  /** Re-fetch the report, bypassing the cache. */
  reload: () => void;
}

const ENDPOINT = 'general_nakshatra_report';

const cacheKeyFor = (payload: GeneralNakshatraReportPayload) =>
  buildKundliCacheKey(ENDPOINT, payload);

export const useGeneralLifePrediction = (
  payload: GeneralNakshatraReportPayload | null,
): UseGeneralLifePredictionReturn => {
  const [data, setData] = useState<GeneralLifePredictionData | null>(() => {
    if (!payload || !hasCachedResponse(cacheKeyFor(payload))) {
      return null;
    }
    const cached = getCachedResponse<GeneralNakshatraReportResponse>(
      cacheKeyFor(payload),
    );
    return cached ? normalizeGeneralLifePrediction(cached) : null;
  });
  const [loading, setLoading] = useState(() =>
    payload ? !hasCachedResponse(cacheKeyFor(payload)) : false,
  );
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (force = false) => {
      if (!payload) {
        setData(null);
        setError(new Error('Birth details are missing.'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      await fetchWithCache({
        key: cacheKeyFor(payload),
        request: () => getGeneralNakshatraReport(payload),
        apply: result => {
          setData(
            result.data ? normalizeGeneralLifePrediction(result.data) : null,
          );
          setError(result.error);
        },
        bypassCache: force,
      });

      setLoading(false);
    },
    [payload],
  );

  useEffect(() => {
    if (!payload) {
      setError(new Error('Birth details are missing.'));
      setLoading(false);
      return;
    }

    // Already cached: the state initialiser hydrated the report, so skip the
    // request entirely (no duplicate API call when revisiting the screen).
    if (hasCachedResponse(cacheKeyFor(payload))) {
      return;
    }

    fetchData();
  }, [fetchData, payload]);

  return {
    data,
    loading,
    error,
    reload: () => fetchData(true),
  };
};
