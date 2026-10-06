/**
 * Lal Kitab data hook.
 *
 * Behaviour:
 *  - All four endpoints take the same birth-details payload, so they are
 *    requested in parallel on mount and the four tabs then read from that one
 *    result set. Switching tabs never triggers a new request.
 *  - Each endpoint is cached separately in the shared Kundli response cache
 *    (keyed by endpoint + birth details), so re-opening the screen does not
 *    re-request a report that was already fetched this session.
 *  - Partial failure is tolerated: each request settles independently, so one
 *    failing endpoint only breaks its own tab while the other three keep
 *    rendering.
 *  - Race-safe: results belonging to birth details that are no longer shown are
 *    discarded rather than committed or cached for the current details.
 *  - No request is sent when the birth details are incomplete.
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  getLalKitabDebts,
  getLalKitabHouses,
  getLalKitabHoroscope,
  getLalKitabPlanets,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  LalKitabDebtsResponse,
  LalKitabHousesResponse,
  LalKitabHoroscopeResponse,
  LalKitabPlanetsResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  getCachedResponse,
  hasCachedResponse,
  setCachedResponse,
} from '../utils/kundliApiCache';
import {
  LAL_KITAB_ENDPOINTS,
  LAL_KITAB_TAB_KEYS,
  normalizeLalKitabDebts,
  normalizeLalKitabHouses,
  normalizeLalKitabHoroscope,
  normalizeLalKitabPlanets,
  type LalKitabDebtView,
  type LalKitabHouseView,
  type LalKitabPlanetView,
  type LalKitabSignView,
  type LalKitabTab,
} from '../utils/lalKitab';

/** Normalised payload per tab, or null while that tab has no data yet. */
export interface LalKitabData {
  horoscope: LalKitabSignView[] | null;
  debts: LalKitabDebtView[] | null;
  houses: LalKitabHouseView[] | null;
  planets: LalKitabPlanetView[] | null;
}

/** Per-tab error, so only the failing tab shows its own error state. */
export type LalKitabErrors = Record<LalKitabTab, Error | null>;

export interface UseLalKitabReturn {
  /** Currently selected tab. */
  activeTab: LalKitabTab;
  /** Select a tab (Horoscope / Debts / Houses / Planets). */
  setActiveTab: (tab: LalKitabTab) => void;
  /** Normalised data for every tab. */
  data: LalKitabData;
  /** True while any of the four requests is in flight. */
  loading: boolean;
  /** Per-tab error (null when that tab loaded). */
  errors: LalKitabErrors;
  /** First error across the tabs, for the toast. */
  error: Error | null;
  /** True when the birth details needed for the request are missing. */
  missingDetails: boolean;
  /** Re-fetch every report, bypassing the cache. */
  reload: () => void;
}

/** One fetcher per tab. All four share the same request body. */
const FETCHERS: Record<
  LalKitabTab,
  (payload: AstrologyMuhurtaPayload) => Promise<unknown>
> = {
  horoscope: getLalKitabHoroscope,
  debts: getLalKitabDebts,
  houses: getLalKitabHouses,
  planets: getLalKitabPlanets,
};

/** Raw response per tab, kept in state and normalised on read. */
type LalKitabRaw = Record<LalKitabTab, unknown>;

const emptyData = (): LalKitabRaw => ({
  horoscope: null,
  debts: null,
  houses: null,
  planets: null,
});

const emptyErrors = (): LalKitabErrors => ({
  horoscope: null,
  debts: null,
  houses: null,
  planets: null,
});

const cacheKeyFor = (
  tab: LalKitabTab,
  payload: AstrologyMuhurtaPayload,
): string => buildKundliCacheKey(LAL_KITAB_ENDPOINTS[tab], payload);

/** Outcome of a single endpoint request. Never rejects. */
interface SettledResult {
  tab: LalKitabTab;
  data: unknown;
  error: Error | null;
}

const toError = (value: unknown, fallback: string): Error =>
  value instanceof Error ? value : new Error(fallback);

export const useLalKitab = (
  payload: AstrologyMuhurtaPayload | null,
): UseLalKitabReturn => {
  const payloadRef = useRef(payload);

  const [activeTab, setActiveTab] = useState<LalKitabTab>('horoscope');
  const [data, setData] = useState<LalKitabRaw>(emptyData);
  const [errors, setErrors] = useState<LalKitabErrors>(emptyErrors);
  const [loading, setLoading] = useState<boolean>(false);

  // Cache keys currently in flight, so a re-render or a fast double tap cannot
  // fire the same call twice.
  const inFlightRef = useRef<Set<string>>(new Set());

  // Identifies the birth details without depending on object identity, so a
  // re-render that rebuilds the payload cannot restart the request loop.
  const payloadKey = useMemo(
    () => (payload ? JSON.stringify(payload) : ''),
    [payload],
  );

  /**
   * Resolves one tab from the shared cache or the network. Always resolves:
   * a rejection becomes a per-tab error instead of failing the whole screen.
   */
  const loadTab = useCallback(
    async (
      tab: LalKitabTab,
      target: AstrologyMuhurtaPayload,
      force: boolean,
    ): Promise<SettledResult> => {
      const key = cacheKeyFor(tab, target);

      if (!force && hasCachedResponse(key)) {
        return {
          tab,
          data: getCachedResponse(key),
          error: null,
        };
      }

      if (inFlightRef.current.has(key)) {
        return {tab, data: null, error: null};
      }

      inFlightRef.current.add(key);

      try {
        const response = await FETCHERS[tab](target);
        setCachedResponse(key, response);
        return {tab, data: response, error: null};
      } catch (e) {
        return {
          tab,
          data: null,
          error: toError(
            e,
            'Unable to load Lal Kitab details. Please try again.',
          ),
        };
      } finally {
        inFlightRef.current.delete(key);
      }
    },
    [],
  );

  const fetchAll = useCallback(
    async (target: AstrologyMuhurtaPayload, force: boolean) => {
      const targetKey = JSON.stringify(target);

      // Serve whatever the cache already holds so the screen has content
      // immediately instead of flashing a loading state over known data.
      const cached = emptyData();
      let hasCached = false;

      LAL_KITAB_TAB_KEYS.forEach(tab => {
        const key = cacheKeyFor(tab, target);
        if (!force && hasCachedResponse(key)) {
          cached[tab] = getCachedResponse(key);
          hasCached = true;
        }
      });

      if (hasCached) {
        setData(cached);
        setErrors(emptyErrors());
        setLoading(false);
      } else {
        setData(emptyData());
        setErrors(emptyErrors());
        setLoading(true);
      }

      const settled = await Promise.all(
        LAL_KITAB_TAB_KEYS.map(tab => loadTab(tab, target, force)),
      );

      // The birth details may have changed while the requests were in flight,
      // in which case the responses belong to a chart that is no longer shown:
      // they must neither be displayed nor cached for the current details.
      if (JSON.stringify(payloadRef.current) !== targetKey) {
        return;
      }

      const next = emptyData();
      const nextErrors = emptyErrors();

      settled.forEach(({tab, data: tabData, error}) => {
        if (tabData !== null && tabData !== undefined) {
          next[tab] = tabData;
        }
        nextErrors[tab] = error;
      });

      setData(next);
      setErrors(nextErrors);
      setLoading(false);
    },
    [loadTab],
  );

  useEffect(() => {
    payloadRef.current = payload;

    if (!payload) {
      setData(emptyData());
      setErrors(emptyErrors());
      setLoading(false);
      return;
    }

    fetchAll(payload, false);
  }, [payload, payloadKey, fetchAll]);

  const reload = useCallback(() => {
    const target = payloadRef.current;
    if (target) {
      fetchAll(target, true);
    }
  }, [fetchAll]);

  const error = useMemo(
    () =>
      LAL_KITAB_TAB_KEYS.map(tab => errors[tab]).find(
        (e): e is Error => e !== null,
      ) ?? null,
    [errors],
  );

  // Normalised once per raw response instead of on every render, so memoised
  // children keep a stable identity while the user switches tabs.
  const normalized = useMemo<LalKitabData>(
    () => ({
      horoscope:
        data.horoscope === null
          ? null
          : normalizeLalKitabHoroscope(
              data.horoscope as LalKitabHoroscopeResponse,
            ),
      debts:
        data.debts === null
          ? null
          : normalizeLalKitabDebts(data.debts as LalKitabDebtsResponse),
      houses:
        data.houses === null
          ? null
          : normalizeLalKitabHouses(data.houses as LalKitabHousesResponse),
      planets:
        data.planets === null
          ? null
          : normalizeLalKitabPlanets(data.planets as LalKitabPlanetsResponse),
    }),
    [data],
  );

  return {
    activeTab,
    setActiveTab,
    data: normalized,
    loading,
    errors,
    error,
    missingDetails: !payload,
    reload,
  };
};
