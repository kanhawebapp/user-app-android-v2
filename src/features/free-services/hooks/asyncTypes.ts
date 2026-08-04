/** Shared shape for a single async API result used by the Kundli hooks. */
export interface AsyncResult<T> {
  /** Response payload (null when the request failed or hasn't loaded). */
  data: T | null;
  /** Error thrown for this request (null on success or while loading). */
  error: any;
  /** True while the request is in flight. */
  loading: boolean;
}
