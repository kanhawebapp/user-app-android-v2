/**
 * Divisional Charts tab data hook.
 *
 * Fetches every divisional chart (SUN, MOON, D1–D60, excluding `chalit`) in
 * parallel with `Promise.all` the first time the tab is opened (`enabled`).
 *
 * Charts already cached (e.g. D9 fetched on the Basic tab) are served from
 * the cache without a new request. The result is kept once loaded.
 */

import {useCallback, useEffect, useRef, useState} from 'react';

import {getHoroscopeChart} from '../../../services/api/astrologyApi/astrology.api';
import type {HoroscopeChartPayload} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildChartCacheKey,
  getCachedChartSvg,
  setCachedChartSvg,
} from '../utils/chartSvgCache';
import {DIVISIONAL_CHARTS, type DivisionalChart} from '../utils/kundliService';

export interface DivisionalChartResult {
  chartId: DivisionalChart['chartId'];
  title: string;
  /** SVG string returned by the API (null when the request failed). */
  svg: string | null;
  /** Error thrown for this specific chart (null on success). */
  error: any;
}

export interface UseDivisionalChartsReturn {
  /** One entry per divisional chart, in the DIVISIONAL_CHARTS order. */
  charts: DivisionalChartResult[];
  /** True while the parallel requests are in flight. */
  loading: boolean;
  /** Global error (e.g. missing birth details). Per-chart errors live on `charts`. */
  error: any;
  /** Re-fetch every chart, bypassing the cache. */
  reload: () => void;
}

const buildEmptyCharts = (): DivisionalChartResult[] =>
  DIVISIONAL_CHARTS.map(chart => ({
    chartId: chart.chartId,
    title: chart.title,
    svg: null,
    error: null,
  }));

export const useDivisionalCharts = (
  payload: HoroscopeChartPayload | null,
  enabled: boolean,
): UseDivisionalChartsReturn => {
  const [charts, setCharts] =
    useState<DivisionalChartResult[]>(buildEmptyCharts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const fetchedRef = useRef(false);

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

      const results = await Promise.all(
        DIVISIONAL_CHARTS.map(async chart => {
          const cacheKey = buildChartCacheKey(chart.chartId, payload);
          const cachedSvg = force ? null : getCachedChartSvg(cacheKey);

          if (cachedSvg) {
            return {
              chartId: chart.chartId,
              title: chart.title,
              svg: cachedSvg,
              error: null,
            };
          }

          try {
            const response = await getHoroscopeChart(chart.chartId, payload);
            const svg = response?.svg || null;
            if (svg) {
              setCachedChartSvg(cacheKey, svg);
            }
            return {
              chartId: chart.chartId,
              title: chart.title,
              svg,
              error: null,
            };
          } catch (err: any) {
            return {
              chartId: chart.chartId,
              title: chart.title,
              svg: null,
              error: err,
            };
          }
        }),
      );

      setCharts(results);
      setLoading(false);
    },
    [payload],
  );

  useEffect(() => {
    if (enabled && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchCharts();
    }
  }, [enabled, fetchCharts]);

  return {
    charts,
    loading,
    error,
    reload: () => {
      fetchedRef.current = true;
      fetchCharts(true);
    },
  };
};
