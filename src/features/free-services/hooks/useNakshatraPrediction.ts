/**
 * Daily Nakshatra prediction data hook.
 *
 * Behaviour:
 *  - Calls the "today" endpoint on mount; `previous` / `next` are called only
 *    when their tab is selected, so opening the screen costs a single request.
 *  - Every response is cached per tab in the shared Kundli response cache
 *    (keyed by endpoint + birth details + the current day), so switching tabs
 *    and re-opening the screen never repeat a request until the day rolls over.
 *  - Guards against duplicate in-flight requests, so a re-render or a fast
 *    double tap cannot fire the same call twice.
 *  - Race-safe: only commits results to the currently active tab.
 *  - No request is sent when the birth details are incomplete.
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  getDailyNakshatraPrediction,
  getNextNakshatraPrediction,
  getPreviousNakshatraPrediction,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  DailyNakshatraPredictionResponse,
  NakshatraPredictionTab,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  getCachedResponse,
  hasCachedResponse,
  setCachedResponse,
} from '../utils/kundliApiCache';
import {getTodayCacheSuffix} from '../utils/myDayToday';
import {
  NAKSHATRA_PREDICTION_ENDPOINTS,
  normalizeNakshatraPrediction,
  type NakshatraPredictionViewModel,
} from '../utils/nakshatraPrediction';

export interface UseNakshatraPredictionReturn {
  /** Currently selected tab. */
  activeTab: NakshatraPredictionTab;
  /** Select a tab (Yesterday / Today / Tomorrow). */
  setActiveTab: (tab: NakshatraPredictionTab) => void;
  /** Normalised view model for the active tab. */
  data: NakshatraPredictionViewModel | null;
  /** True while a request for the active tab is in flight. */
  loading: boolean;
  /** Last error thrown for the active tab (or null). */
  error: Error | null;
  /** True when the birth details needed for the request are missing. */
  missingDetails: boolean;
  /** Re-fetch the active tab, bypassing the cache. */
  reload: () => void;
}

const TAB_FETCHERS: Record<
  NakshatraPredictionTab,
  (
    payload: AstrologyMuhurtaPayload,
  ) => Promise<DailyNakshatraPredictionResponse>
> = {
  yesterday: getPreviousNakshatraPrediction,
  today: getDailyNakshatraPrediction,
  tomorrow: getNextNakshatraPrediction,
};

const emptyCache = (): Record<
  NakshatraPredictionTab,
  DailyNakshatraPredictionResponse | null
> => ({yesterday: null, today: null, tomorrow: null});

/**
 * Cache key for a tab: the endpoint + the birth details + the current day, so
 * yesterday's prediction is not served again once that day has passed.
 */
const cacheKeyFor = (
  tab: NakshatraPredictionTab,
  payload: AstrologyMuhurtaPayload,
): string =>
  buildKundliCacheKey(NAKSHATRA_PREDICTION_ENDPOINTS[tab], {
    ...payload,
    as_of: getTodayCacheSuffix(),
  });

export const useNakshatraPrediction = (
  payload: AstrologyMuhurtaPayload | null,
): UseNakshatraPredictionReturn => {
  const payloadRef = useRef(payload);

  const [activeTab, setActiveTab] = useState<NakshatraPredictionTab>('today');
  const [data, setData] = useState<NakshatraPredictionViewModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // One cached response per tab. A ref keeps the cache without triggering
  // re-renders, so the update surface stays explicit.
  const cacheRef = useRef(emptyCache());
  // Cache keys currently in flight, so the same call is never issued twice.
  const inFlightRef = useRef<Set<string>>(new Set());
  // Active tab without causing re-renders (used to guard commits).
  const activeTabRef = useRef<NakshatraPredictionTab>(activeTab);
  activeTabRef.current = activeTab;
  // The birth details the local cache was filled for; a change invalidates it.
  const cachedPayloadKeyRef = useRef<string>('');

  // Identifies the birth details without depending on object identity, so a
  // re-render that rebuilds the payload cannot restart the request loop.
  const payloadKey = useMemo(
    () => (payload ? JSON.stringify(payload) : ''),
    [payload],
  );

  const fetchData = useCallback(
    async (tab: NakshatraPredictionTab, force: boolean = false) => {
      const target = payloadRef.current;

      if (!target) {
        if (activeTabRef.current === tab) {
          setData(null);
          setError(null);
          setLoading(false);
        }
        return;
      }

      // The birth details changed: drop everything cached for the old ones.
      const targetKey = JSON.stringify(target);
      if (cachedPayloadKeyRef.current !== targetKey) {
        cachedPayloadKeyRef.current = targetKey;
        cacheRef.current = emptyCache();
      }

      const key = cacheKeyFor(tab, target);

      if (!force) {
        // Reuse the local cache, falling back to the shared response cache so
        // a prediction fetched earlier in the session is never re-requested.
        let cached = cacheRef.current[tab];
        if (!cached && hasCachedResponse(key)) {
          cached =
            getCachedResponse<DailyNakshatraPredictionResponse>(key) ?? null;
          cacheRef.current[tab] = cached;
        }

        if (cached && activeTabRef.current === tab) {
          setData(normalizeNakshatraPrediction(cached, tab));
          setError(null);
          setLoading(false);
        }
        if (cached) {
          return;
        }
      }

      if (inFlightRef.current.has(key)) {
        return;
      }

      const fetcher = TAB_FETCHERS[tab];

      inFlightRef.current.add(key);

      const isActive = activeTabRef.current === tab;
      if (isActive) {
        if (!force) {
          setData(null);
        }
        setLoading(true);
        setError(null);
      }

      try {
        const response = await fetcher(target);

        // The birth details may have changed while the request was in flight,
        // in which case the response belongs to a chart that is no longer
        // shown: it must not be cached for the current details nor displayed.
        if (JSON.stringify(payloadRef.current) !== targetKey) {
          return;
        }

        setCachedResponse(key, response);
        cacheRef.current[tab] = response;

        if (activeTabRef.current === tab) {
          setData(normalizeNakshatraPrediction(response, tab));
          setError(null);
        }
      } catch (e) {
        if (activeTabRef.current === tab) {
          setError(
            e instanceof Error
              ? e
              : new Error('Failed to load the Nakshatra prediction.'),
          );
        }
      } finally {
        inFlightRef.current.delete(key);
        if (activeTabRef.current === tab) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // (Re)load whenever the active tab or the birth details change. The shared
  // response cache is served synchronously inside fetchData, so a cached
  // prediction is displayed without a loading flash or a new request.
  useEffect(() => {
    payloadRef.current = payload;

    if (!payload) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    fetchData(activeTab);
  }, [activeTab, fetchData, payload, payloadKey]);

  const reload = useCallback(() => {
    fetchData(activeTab, true);
  }, [activeTab, fetchData]);

  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    error,
    missingDetails: !payload,
    reload,
  };
};
