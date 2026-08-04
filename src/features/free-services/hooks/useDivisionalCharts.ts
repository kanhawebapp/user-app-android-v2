/**
 * Divisional Charts tab data hook.
 *
 * Charts are fetched lazily: only the charts that are actually requested
 * (i.e. scrolled into view) trigger a network request, so opening the tab
 * never fires all 20 requests at once. The FlatList renders a card per chart,
 * each of which calls `requestChart(chartId)` when it mounts.
 *
 * Every successful SVG is cached keyed by chart type + payload (the D9 chart
 * fetched on the Basic/Planets tab is reused here without a request). A
 * resolved chart is never requested twice, even when the FlatList unmounts and
 * re-mounts its cells while scrolling.
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {getHoroscopeChart} from '../../../services/api/astrologyApi/astrology.api';
import type {HoroscopeChartPayload} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildChartCacheKey,
  getCachedChartSvg,
  removeCachedChartSvg,
  setCachedChartSvg,
} from '../utils/chartSvgCache';
import {DIVISIONAL_CHARTS, type DivisionalChart} from '../utils/kundliService';

/** Per-chart state used by the DivisionalChartsView FlatList. */
export interface DivisionalChartState {
  chartId: DivisionalChart['chartId'];
  title: string;
  /** SVG string returned by the API (null when the request failed). */
  svg: string | null;
  /** Error thrown for this specific chart (null on success). */
  error: any;
  /** True while this chart's request is in flight. */
  loading: boolean;
}

export interface UseDivisionalChartsReturn {
  /** One entry per divisional chart, in the DIVISIONAL_CHARTS order. */
  charts: DivisionalChartState[];
  /** Requests (and caches) a single chart. Safe to call repeatedly. */
  requestChart: (chartId: string) => void;
  /** Re-fetches a single chart, bypassing the cache (used by retry). */
  retryChart: (chartId: string) => void;
  /** Global error (e.g. missing birth details). Per-chart errors live on `charts`. */
  error: any;
  /** Re-fetches every chart, bypassing the cache. */
  reload: () => void;
}

const buildInitialState = (): Record<string, DivisionalChartState> =>
  Object.fromEntries(
    DIVISIONAL_CHARTS.map(chart => [
      chart.chartId,
      {
        chartId: chart.chartId,
        title: chart.title,
        svg: null,
        error: null,
        loading: true,
      },
    ]),
  );

export const useDivisionalCharts = (
  payload: HoroscopeChartPayload | null,
  enabled: boolean,
): UseDivisionalChartsReturn => {
  const [chartMap, setChartMap] =
    useState<Record<string, DivisionalChartState>>(buildInitialState);
  const [error, setError] = useState<any>(null);

  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  /** Chart ids that already settled (cached, succeeded or failed). */
  const resolvedRef = useRef<Set<string>>(new Set());
  /** Chart ids currently being fetched (dedupe concurrent requests). */
  const inFlightRef = useRef<Set<string>>(new Set());
  /** Whether the hook already ran its initial load. */
  const bootstrappedRef = useRef(false);

  // Stable order + stable per-chart object identities: when one chart updates,
  // only that cell re-renders (its result reference changes).
  const charts = useMemo(
    () => DIVISIONAL_CHARTS.map(chart => chartMap[chart.chartId]),
    [chartMap],
  );

  const applyChart = useCallback(
    (chartId: string, patch: Partial<DivisionalChartState>) => {
      setChartMap(prev => {
        const current = prev[chartId];
        if (!current) {
          return prev;
        }
        return {...prev, [chartId]: {...current, ...patch}};
      });
    },
    [],
  );

  const loadChart = useCallback(
    (chartId: string, force = false) => {
      const currentPayload = payloadRef.current;
      const definition = DIVISIONAL_CHARTS.find(c => c.chartId === chartId);
      if (!currentPayload || !definition) {
        return;
      }

      // Already resolved (from state or cache) — never re-request.
      if (!force && resolvedRef.current.has(chartId)) {
        return;
      }

      const cacheKey = buildChartCacheKey(chartId, currentPayload);
      if (!force) {
        const cachedSvg = getCachedChartSvg(cacheKey);
        if (cachedSvg) {
          resolvedRef.current.add(chartId);
          applyChart(chartId, {svg: cachedSvg, error: null, loading: false});
          return;
        }
      }

      // One in-flight request per chart, no matter how often a cell re-mounts.
      if (inFlightRef.current.has(chartId)) {
        return;
      }
      inFlightRef.current.add(chartId);
      applyChart(chartId, {loading: true, error: null});

      getHoroscopeChart(chartId, currentPayload)
        .then(response => {
          const svg = response?.svg || null;
          if (svg) {
            setCachedChartSvg(cacheKey, svg);
          }
          resolvedRef.current.add(chartId);
          applyChart(chartId, {svg, error: null, loading: false});
        })
        .catch((err: any) => {
          resolvedRef.current.add(chartId);
          applyChart(chartId, {svg: null, error: err, loading: false});
        })
        .finally(() => {
          inFlightRef.current.delete(chartId);
        });
    },
    [applyChart],
  );

  const requestChart = useCallback(
    (chartId: string) => loadChart(chartId, false),
    [loadChart],
  );

  const retryChart = useCallback(
    (chartId: string) => {
      resolvedRef.current.delete(chartId);
      loadChart(chartId, true);
    },
    [loadChart],
  );

  const reload = useCallback(() => {
    const currentPayload = payloadRef.current;
    if (!currentPayload) {
      return;
    }

    resolvedRef.current.clear();
    inFlightRef.current.clear();
    DIVISIONAL_CHARTS.forEach(chart => {
      removeCachedChartSvg(buildChartCacheKey(chart.chartId, currentPayload));
      applyChart(chart.chartId, {svg: null, error: null, loading: true});
    });

    // Re-request the first few charts immediately; the rest are pulled in as
    // their cards scroll into view.
    DIVISIONAL_CHARTS.slice(0, 3).forEach(chart => loadChart(chart.chartId));
  }, [applyChart, loadChart]);

  useEffect(() => {
    if (!enabled || bootstrappedRef.current) {
      return;
    }
    bootstrappedRef.current = true;
    if (!payload) {
      setError(new Error('Birth details are missing.'));
      return;
    }
    setError(null);
    // Warm the first batch (visible without scrolling); the FlatList requests
    // the remaining charts as their cards mount.
    DIVISIONAL_CHARTS.slice(0, 3).forEach(chart => requestChart(chart.chartId));
  }, [enabled, payload, requestChart]);

  return {charts, requestChart, retryChart, error, reload};
};
