/**
 * In-memory cache for Kundli API responses.
 *
 * Keyed by endpoint name + the birth-details payload so that the Basic and
 * Planets endpoints are only requested once per birth details. On a fresh
 * mount (e.g. re-opening the screen) the cached response is served without a
 * new request. Only successful responses are cached.
 */

import type {AsyncResult} from '../hooks/asyncTypes';

const RESPONSE_CACHE = new Map<string, unknown>();

/** Builds a stable cache key for an endpoint + birth-details payload. */
export const buildKundliCacheKey = (
  endpoint: string,
  payload: object | null | undefined,
): string => `${endpoint}:${payload ? JSON.stringify(payload) : ''}`;

/** Returns the cached response for a key, or null when absent. */
export const getCachedResponse = <T>(key: string): T | null => {
  const value = RESPONSE_CACHE.get(key);
  return value === undefined ? null : (value as T);
};

/** Returns true when a key already has a cached response. */
export const hasCachedResponse = (key: string): boolean =>
  RESPONSE_CACHE.has(key);

/** Stores a successful response for a key. */
export const setCachedResponse = (key: string, value: unknown): void => {
  RESPONSE_CACHE.set(key, value);
};

/** Clears the whole response cache (mainly used by tests). */
export const clearKundliResponseCache = (): void => {
  RESPONSE_CACHE.clear();
};

export interface FetchWithCacheOptions<T> {
  key: string;
  request: () => Promise<T>;
  /** Applies the settled result to the hook's state. */
  apply: (result: AsyncResult<T>) => void;
  /** Skips the cache and always calls the API (used by reload). */
  bypassCache?: boolean;
}

/**
 * Runs a request through the cache: serves the cached response when present,
 * otherwise calls the API and stores the successful response.
 */
export const fetchWithCache = async <T>({
  key,
  request,
  apply,
  bypassCache = false,
}: FetchWithCacheOptions<T>): Promise<void> => {
  if (!bypassCache) {
    const cached = getCachedResponse<T>(key);
    if (cached !== null) {
      apply({data: cached, error: null, loading: false});
      return;
    }
  }

  try {
    const data = await request();
    setCachedResponse(key, data);
    apply({data, error: null, loading: false});
  } catch (err: any) {
    apply({data: null, error: err, loading: false});
  }
};
