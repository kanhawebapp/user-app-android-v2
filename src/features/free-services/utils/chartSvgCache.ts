/**
 * In-memory cache for horoscope chart SVGs.
 *
 * Keyed by chart type + the full birth payload so that the Chalit and D9
 * charts are only fetched once per birth details and can be reused across
 * the Basic and Planets tabs (and re-used when the screen is opened again).
 */

export interface ChartCachePayload {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

const CHART_SVG_CACHE = new Map<string, string>();

/** Builds a stable cache key for a chart type + birth payload. */
export const buildChartCacheKey = (
  chartType: string,
  payload: ChartCachePayload | null | undefined,
): string => {
  const {day, month, year, hour, min, lat, lon, tzone} = payload || {};
  return `${chartType}:${day}-${month}-${year}-${hour}-${min}-${lat}-${lon}-${tzone}`;
};

/** Returns the cached SVG for a key, or null when absent. */
export const getCachedChartSvg = (key: string): string | null =>
  CHART_SVG_CACHE.get(key) ?? null;

/** Returns true when a key already has a cached SVG. */
export const hasCachedChartSvg = (key: string): boolean =>
  CHART_SVG_CACHE.has(key);

/** Stores a chart SVG for a key. */
export const setCachedChartSvg = (key: string, svg: string): void => {
  CHART_SVG_CACHE.set(key, svg);
};

/** Removes a single chart SVG from the cache (used by reload). */
export const removeCachedChartSvg = (key: string): void => {
  CHART_SVG_CACHE.delete(key);
};

/** Clears the whole chart cache (mainly used by tests). */
export const clearChartSvgCache = (): void => {
  CHART_SVG_CACHE.clear();
};
