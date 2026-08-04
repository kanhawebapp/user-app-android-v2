/**
 * Horoscope chart data hook.
 *
 * Behaviour:
 *  - Fetches the Chalit and Navamsa (D9) charts in parallel with
 *    `Promise.all` using the same birth-details payload.
 *  - Charts are only committed once both requests have settled, so the
 *    screen renders a single loading state.
 *  - Individual failures are captured per chart, allowing one chart to
 *    render even when the other failed.
 *  - Successful SVGs are cached keyed by chart type + birth payload. On a
 *    fresh mount the cache is consulted first, so re-opening the screen or
 *    another hook requesting the same chart does not trigger a new request.
 */

import {useCallback, useEffect, useState} from 'react';

import {getHoroscopeChart} from '../../../services/api/astrologyApi/astrology.api';
import type {
  BaseChartType,
  HoroscopeChartPayload,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildChartCacheKey,
  getCachedChartSvg,
  setCachedChartSvg,
} from '../utils/chartSvgCache';
import {CHART_LABELS, CHART_TYPES} from '../utils/kundliService';

export interface HoroscopeChartResult {
  type: BaseChartType;
  label: string;
  /** SVG string returned by the API (null when the request failed). */
  svg: string | null;
  /** Error thrown for this specific chart (null on success). */
  error: any;
}

export interface UseHoroscopeChartsReturn {
  /** One entry per chart type, in a stable order (chalit, D9). */
  charts: HoroscopeChartResult[];
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-chart errors live on `charts`. */
  error: any;
  /** Re-fetch both charts, bypassing the cache. */
  reload: () => void;
}

const buildEmptyCharts = (): HoroscopeChartResult[] =>
  CHART_TYPES.map(type => ({
    type,
    label: CHART_LABELS[type],
    svg: null,
    error: null,
  }));

export const useHoroscopeCharts = (
  payload: HoroscopeChartPayload | null,
): UseHoroscopeChartsReturn => {
  const [charts, setCharts] =
    useState<HoroscopeChartResult[]>(buildEmptyCharts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCharts = useCallback(
    async (force = false) => {
      if (!payload) {
        setCharts(buildEmptyCharts());
        setError(new Error('Birth details are missing.'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Both requests run in parallel; each promise settles on its own so a
        // single failure does not prevent the other chart from rendering.
        const results = await Promise.all(
          CHART_TYPES.map(async type => {
            const cacheKey = buildChartCacheKey(type, payload);
            const cachedSvg = force ? null : getCachedChartSvg(cacheKey);

            if (cachedSvg) {
              return {
                type,
                label: CHART_LABELS[type],
                svg: cachedSvg,
                error: null,
              };
            }

            try {
              const response = await getHoroscopeChart(type, payload);
              const svg = response?.svg || null;
              if (svg) {
                setCachedChartSvg(cacheKey, svg);
              }
              return {
                type,
                label: CHART_LABELS[type],
                svg,
                error: null,
              };
            } catch (err: any) {
              return {
                type,
                label: CHART_LABELS[type],
                svg: null,
                error: err,
              };
            }
          }),
        );

        setCharts(results);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [payload],
  );

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return {charts, loading, error, reload: () => fetchCharts(true)};
};
