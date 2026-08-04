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
 */

import {useCallback, useEffect, useState} from 'react';

import {getHoroscopeChart} from '../../../services/api/astrologyApi/astrology.api';
import type {
  HoroscopeChartPayload,
  HoroscopeChartType,
} from '../../../services/api/astrologyApi/astrology.types';
import {CHART_LABELS, CHART_TYPES} from '../utils/kundliService';

export interface HoroscopeChartResult {
  type: HoroscopeChartType;
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
  /** Re-fetch both charts. */
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

  const fetchCharts = useCallback(async () => {
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
          try {
            const response = await getHoroscopeChart(type, payload);
            return {
              type,
              label: CHART_LABELS[type],
              svg: response?.svg || null,
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
  }, [payload]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return {charts, loading, error, reload: fetchCharts};
};
