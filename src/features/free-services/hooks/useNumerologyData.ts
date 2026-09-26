/**
 * Numerology data hook.
 *
 * Fetches all eight numerlogy endpoints in parallel with `Promise.all`:
 *  - /v1/numero_prediction/daily
 *  - /v1/numero_table
 *  - /v1/numero_report
 *  - /v1/numero_fav_time
 *  - /v1/numero_place_vastu
 *  - /v1/numero_fasts_report
 *  - /v1/numero_fav_lord
 *  - /v1/numero_fav_mantra
 *
 * `fetchWithCache` settles every request itself (it never rejects), so a single
 * failing endpoint does not prevent the other seven cards from rendering. Each
 * result lives in its own {@link AsyncResult} so the UI can show a per-card
 * loading / error / missing-data state. Successful responses are cached keyed by
 * endpoint + payload, so revisiting the screen never repeats a request.
 */

import {useCallback, useEffect, useState} from 'react';

import {
  getNumeroFastsReport,
  getNumeroFavLord,
  getNumeroFavMantra,
  getNumeroFavTime,
  getNumeroPlaceVastu,
  getNumeroPredictionDaily,
  getNumeroReport,
  getNumeroTable,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  NumeroPredictionResponse,
  NumeroRequestPayload,
  NumeroTableResponse,
  NumeroTitleDescriptionResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  fetchWithCache,
  getCachedResponse,
  hasCachedResponse,
} from '../utils/kundliApiCache';
import type {AsyncResult} from './asyncTypes';

export interface UseNumerologyDataReturn {
  prediction: AsyncResult<NumeroPredictionResponse>;
  table: AsyncResult<NumeroTableResponse>;
  report: AsyncResult<NumeroTitleDescriptionResponse>;
  favTime: AsyncResult<NumeroTitleDescriptionResponse>;
  placeVastu: AsyncResult<NumeroTitleDescriptionResponse>;
  fastsReport: AsyncResult<NumeroTitleDescriptionResponse>;
  favLord: AsyncResult<NumeroTitleDescriptionResponse>;
  favMantra: AsyncResult<NumeroTitleDescriptionResponse>;
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-card errors live on the results. */
  error: any;
  /** Re-fetch all eight endpoints, bypassing the cache. */
  reload: () => void;
}

const empty = <T>(): AsyncResult<T> => ({
  data: null,
  error: null,
  loading: true,
});

const ENDPOINTS = [
  'numero_prediction/daily',
  'numero_table',
  'numero_report',
  'numero_fav_time',
  'numero_place_vastu',
  'numero_fasts_report',
  'numero_fav_lord',
  'numero_fav_mantra',
] as const;

/** Hydrates hook state synchronously from the response cache (if present). */
const hydrate = <T>(endpoint: string, payload: NumeroRequestPayload | null) =>
  payload
    ? getCachedResponse<T>(buildKundliCacheKey(endpoint, payload)) ?? null
    : null;

const hydrateSettled = <T>(
  endpoint: string,
  payload: NumeroRequestPayload | null,
): AsyncResult<T> => {
  const cached = hydrate<T>(endpoint, payload);
  return cached ? {data: cached, error: null, loading: false} : empty();
};

export const useNumerologyData = (
  payload: NumeroRequestPayload | null,
): UseNumerologyDataReturn => {
  const [prediction, setPrediction] = useState<
    AsyncResult<NumeroPredictionResponse>
  >(() =>
    hydrateSettled<NumeroPredictionResponse>(
      'numero_prediction/daily',
      payload,
    ),
  );
  const [table, setTable] = useState<AsyncResult<NumeroTableResponse>>(() =>
    hydrateSettled<NumeroTableResponse>('numero_table', payload),
  );
  const [report, setReport] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>('numero_report', payload),
  );
  const [favTime, setFavTime] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>('numero_fav_time', payload),
  );
  const [placeVastu, setPlaceVastu] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>(
      'numero_place_vastu',
      payload,
    ),
  );
  const [fastsReport, setFastsReport] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>(
      'numero_fasts_report',
      payload,
    ),
  );
  const [favLord, setFavLord] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>('numero_fav_lord', payload),
  );
  const [favMantra, setFavMantra] = useState<
    AsyncResult<NumeroTitleDescriptionResponse>
  >(() =>
    hydrateSettled<NumeroTitleDescriptionResponse>(
      'numero_fav_mantra',
      payload,
    ),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (force = false) => {
      if (!payload) {
        setPrediction(empty());
        setTable(empty());
        setReport(empty());
        setFavTime(empty());
        setPlaceVastu(empty());
        setFastsReport(empty());
        setFavLord(empty());
        setFavMantra(empty());
        setLoading(false);
        setError(new Error('Birth details are missing.'));
        return;
      }

      setLoading(true);
      setError(null);

      await Promise.all([
        fetchWithCache({
          key: buildKundliCacheKey('numero_prediction/daily', payload),
          request: () => getNumeroPredictionDaily(payload),
          apply: setPrediction,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_table', payload),
          request: () => getNumeroTable(payload),
          apply: setTable,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_report', payload),
          request: () => getNumeroReport(payload),
          apply: setReport,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_fav_time', payload),
          request: () => getNumeroFavTime(payload),
          apply: setFavTime,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_place_vastu', payload),
          request: () => getNumeroPlaceVastu(payload),
          apply: setPlaceVastu,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_fasts_report', payload),
          request: () => getNumeroFastsReport(payload),
          apply: setFastsReport,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_fav_lord', payload),
          request: () => getNumeroFavLord(payload),
          apply: setFavLord,
          bypassCache: force,
        }),
        fetchWithCache({
          key: buildKundliCacheKey('numero_fav_mantra', payload),
          request: () => getNumeroFavMantra(payload),
          apply: setFavMantra,
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

    // Every endpoint already cached: hydrate once in the state initialisers and
    // skip the request entirely (no duplicate API call when revisiting).
    const allCached = ENDPOINTS.every(endpoint =>
      hasCachedResponse(buildKundliCacheKey(endpoint, payload)),
    );
    if (!allCached) {
      fetchData();
    }
  }, [fetchData, payload]);

  return {
    prediction,
    table,
    report,
    favTime,
    placeVastu,
    fastsReport,
    favLord,
    favMantra,
    loading,
    error,
    reload: () => fetchData(true),
  };
};
