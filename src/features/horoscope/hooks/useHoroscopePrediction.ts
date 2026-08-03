/**
 * Horoscope prediction data hook.
 *
 * Behaviour:
 *  - Calls the `today` API automatically when the hook mounts.
 *  - Calls `previous` / `next` only when their tab is selected.
 *  - Caches every response locally so switching tabs never re-fetches.
 *  - Guards against duplicate in-flight requests while loading.
 *  - Race-safe: only commits results to the currently active tab, so
 *    switching tabs mid-request never shows stale data.
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import {
  getSunSignPredictionNext,
  getSunSignPredictionPrevious,
  getSunSignPredictionToday,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  HoroscopeResponse,
  HoroscopeTab,
} from '../../../services/api/astrologyApi/astrology.types';
import {getHoroscopeViewModel} from '../utils/horoscopeResponse';
import type {HoroscopeViewModel} from '../utils/horoscopeResponse';

export interface UseHoroscopePredictionReturn {
  /** Currently selected tab. */
  activeTab: HoroscopeTab;
  /** Select a tab (Previous / Today / Next). */
  setActiveTab: (tab: HoroscopeTab) => void;
  /** Normalised view model for the active tab. */
  data: HoroscopeViewModel | null;
  /** True while a request for the active tab is in flight. */
  loading: boolean;
  /** Last error thrown by an API call for the active tab (or null). */
  error: any;
  /** Re-fetch the active tab bypassing the cache. */
  reload: () => void;
}

const TAB_FETCHERS: Record<
  HoroscopeTab,
  (zodiacName: string) => Promise<HoroscopeResponse>
> = {
  today: getSunSignPredictionToday,
  previous: getSunSignPredictionPrevious,
  next: getSunSignPredictionNext,
};

const initialCache = (): Record<HoroscopeTab, HoroscopeResponse | null> => ({
  today: null,
  previous: null,
  next: null,
});

export const useHoroscopePrediction = (
  zodiacName: string,
): UseHoroscopePredictionReturn => {
  const [activeTab, setActiveTab] = useState<HoroscopeTab>('today');
  const [data, setData] = useState<HoroscopeViewModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Local cache: one response per tab. A ref keeps the cache without
  // triggering re-renders, so we control the update surface explicitly.
  const cacheRef = useRef<Record<HoroscopeTab, HoroscopeResponse | null>>(
    initialCache(),
  );
  // Track the tab currently being fetched to avoid duplicate requests.
  const fetchingRef = useRef<HoroscopeTab | null>(null);
  // Track the active tab without causing re-renders (used to guard commits).
  const activeTabRef = useRef<HoroscopeTab>(activeTab);
  activeTabRef.current = activeTab;
  // Track the zodiac sign to invalidate the cache when it changes.
  const lastZodiacNameRef = useRef<string>(zodiacName);

  const fetchData = useCallback(
    async (tab: HoroscopeTab, force: boolean = false) => {
      if (!zodiacName) {
        return;
      }

      // Invalidate the cache when the selected zodiac sign changes.
      if (lastZodiacNameRef.current !== zodiacName) {
        cacheRef.current = initialCache();
        lastZodiacNameRef.current = zodiacName;
        setData(null);
        setError(null);
      }

      // Serve a cached response immediately instead of re-fetching.
      if (!force && cacheRef.current[tab]) {
        if (activeTabRef.current === tab) {
          setData(getHoroscopeViewModel(cacheRef.current[tab]));
          setLoading(false);
          setError(null);
        }
        return;
      }

      // Prevent duplicate in-flight requests for the same tab.
      if (!force && fetchingRef.current === tab) {
        return;
      }

      const fetcher = TAB_FETCHERS[tab];
      if (!fetcher) {
        return;
      }

      fetchingRef.current = tab;
      const isActive = activeTabRef.current === tab;
      if (isActive) {
        if (!force) {
          setData(null);
        }
        setLoading(true);
        setError(null);
      }

      try {
        const response = await fetcher(zodiacName);
        cacheRef.current[tab] = response;

        if (activeTabRef.current === tab) {
          setData(getHoroscopeViewModel(response));
          setError(null);
        }
      } catch (e: any) {
        if (activeTabRef.current === tab) {
          setError(e);
        }
      } finally {
        fetchingRef.current = null;
        if (activeTabRef.current === tab) {
          setLoading(false);
        }
      }
    },
    [zodiacName],
  );

  // (Re)load whenever the active tab or zodiac sign changes.
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const reload = useCallback(() => {
    fetchData(activeTab, true);
  }, [activeTab, fetchData]);

  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    error,
    reload,
  };
};
