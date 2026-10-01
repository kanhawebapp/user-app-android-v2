/**
 * Ascendant Report data hook.
 *
 * Fetches the two independent Ascendant Report endpoints in parallel:
 *  - POST /v1/general_ascendant_report (rising sign + description)
 *  - POST /v1/general_nakshatra_report (sectioned paragraphs)
 *
 * Behaviour:
 *  - Both requests use the birth details collected by the Kundli form. No
 *    request is sent when any of them (lat / lon / tzone included) is missing.
 *  - Each response settles on its own, so one failing endpoint never hides the
 *    other report. A global error is only raised when both failed.
 *  - Successful responses are cached per endpoint + birth details in the shared
 *    Kundli response cache, so re-opening the screen never repeats a request.
 *  - Stale in-flight responses are ignored when the birth details change.
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  getGeneralAscendantReport,
  getGeneralNakshatraReport,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AscendantReportPayload,
  GeneralAscendantReportResponse,
  GeneralNakshatraReportResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  buildKundliCacheKey,
  getCachedResponse,
  hasCachedResponse,
  setCachedResponse,
} from '../utils/kundliApiCache';
import {
  normalizeAscendantReportData,
  type AscendantReportData,
} from '../utils/ascendantReport';

/** Cache keys: one per endpoint, so both halves cache independently. */
export const ASCENDANT_REPORT_ENDPOINT = 'general_ascendant_report';
export const NAKSHATRA_REPORT_ENDPOINT = 'general_nakshatra_report';

const ASCENDANT_ERROR_TEXT = 'Failed to load the Ascendant Report.';
const NAKSHATRA_ERROR_TEXT = 'Failed to load the General Nakshatra Report.';

/** One endpoint's settled outcome. */
interface SettledResult<T> {
  data: T | null;
  error: Error | null;
}

const toError = (err: unknown, fallback: string): Error =>
  err instanceof Error ? err : new Error(fallback);

/** Runs one request and turns a rejection into an error, never a throw. */
const settle = async <T>(
  request: () => Promise<T>,
  fallbackMessage: string,
  onSuccess: (data: T) => void,
): Promise<SettledResult<T>> => {
  try {
    const data = await request();
    onSuccess(data);
    return {data, error: null};
  } catch (err: unknown) {
    return {data: null, error: toError(err, fallbackMessage)};
  }
};

export interface UseAscendantReportReturn {
  /** Normalised report (null until the first settled response). */
  data: AscendantReportData | null;
  /** True while either request is in flight. */
  loading: boolean;
  /** Set only when both endpoints failed, so the whole screen can show it. */
  error: Error | null;
  /** Error of the ascendant request alone (the Nakshatra half can still show). */
  ascendantError: Error | null;
  /** Error of the general Nakshatra request alone. */
  nakshatraError: Error | null;
  /** True when the birth details needed for the request are missing. */
  missingDetails: boolean;
  /** Re-fetch both reports, bypassing the cache. */
  reload: () => void;
}

export const useAscendantReport = (
  payload: AscendantReportPayload | null,
): UseAscendantReportReturn => {
  const payloadRef = useRef(payload);

  const [data, setData] = useState<AscendantReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [ascendantError, setAscendantError] = useState<Error | null>(null);
  const [nakshatraError, setNakshatraError] = useState<Error | null>(null);

  // Identifies the birth details without depending on object identity, so a
  // re-render that rebuilds the payload cannot restart the request loop.
  const payloadKey = useMemo(
    () => (payload ? JSON.stringify(payload) : ''),
    [payload],
  );

  const fetchData = useCallback(async (force: boolean = false) => {
    const target = payloadRef.current;
    if (!target) {
      setData(null);
      setError(null);
      setAscendantError(null);
      setNakshatraError(null);
      setLoading(false);
      return;
    }

    const ascendantKey = buildKundliCacheKey(ASCENDANT_REPORT_ENDPOINT, target);
    const nakshatraKey = buildKundliCacheKey(NAKSHATRA_REPORT_ENDPOINT, target);

    const ascendantCached = !force && hasCachedResponse(ascendantKey);
    const nakshatraCached = !force && hasCachedResponse(nakshatraKey);

    // Nothing to do: both reports were already fetched for these birth details.
    if (ascendantCached && nakshatraCached) {
      setData(
        normalizeAscendantReportData(
          getCachedResponse<GeneralAscendantReportResponse>(ascendantKey),
          getCachedResponse<GeneralNakshatraReportResponse>(nakshatraKey),
        ),
      );
      setAscendantError(null);
      setNakshatraError(null);
      setError(null);
      setLoading(false);
      return;
    }

    // A cached half is reused as-is, so only what is missing is requested.
    if (ascendantCached || nakshatraCached) {
      setData(
        normalizeAscendantReportData(
          ascendantCached
            ? getCachedResponse<GeneralAscendantReportResponse>(ascendantKey)
            : null,
          nakshatraCached
            ? getCachedResponse<GeneralNakshatraReportResponse>(nakshatraKey)
            : null,
        ),
      );
    }

    setLoading(true);

    // Both reports run in parallel; each promise settles on its own so a single
    // failing endpoint does not discard the other report.
    const [ascendant, nakshatra] = await Promise.all([
      ascendantCached
        ? Promise.resolve<SettledResult<GeneralAscendantReportResponse>>({
            data: getCachedResponse<GeneralAscendantReportResponse>(
              ascendantKey,
            ),
            error: null,
          })
        : settle(
            () => getGeneralAscendantReport(target),
            ASCENDANT_ERROR_TEXT,
            response => setCachedResponse(ascendantKey, response),
          ),
      nakshatraCached
        ? Promise.resolve<SettledResult<GeneralNakshatraReportResponse>>({
            data: getCachedResponse<GeneralNakshatraReportResponse>(
              nakshatraKey,
            ),
            error: null,
          })
        : settle(
            () => getGeneralNakshatraReport(target),
            NAKSHATRA_ERROR_TEXT,
            response => setCachedResponse(nakshatraKey, response),
          ),
    ]);

    // The birth details may have changed while the requests were in flight: the
    // responses belong to a chart that is no longer on screen.
    if (JSON.stringify(payloadRef.current) !== JSON.stringify(target)) {
      return;
    }

    setData(normalizeAscendantReportData(ascendant.data, nakshatra.data));
    setAscendantError(ascendant.error);
    setNakshatraError(nakshatra.error);
    setError(ascendant.error && nakshatra.error ? ascendant.error : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    payloadRef.current = payload;

    if (!payload) {
      setData(null);
      setError(null);
      setAscendantError(null);
      setNakshatraError(null);
      setLoading(false);
      return;
    }

    fetchData();
  }, [fetchData, payload, payloadKey]);

  return {
    data,
    loading,
    error,
    ascendantError,
    nakshatraError,
    missingDetails: !payload,
    reload: () => {
      fetchData(true);
    },
  };
};
