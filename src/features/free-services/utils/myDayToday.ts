/**
 * "My Day Today" view-model helpers.
 *
 * The screen shows a single daily numerology prediction
 * (POST /v1/numero_prediction/daily) built from the user's birth details, so
 * these helpers stay pure: they validate the request input, normalise the raw
 * response into display strings and resolve the prediction date with a
 * today-fallback.
 *
 * All date maths is done on the raw parts of a date string. `new Date(string)`
 * is deliberately avoided so a `DD-MM-YYYY` / `YYYY-MM-DD` value can never be
 * shifted a day by the device timezone.
 */

import type {InfoItem} from '../components/InfoCard';
import type {
  NumeroPredictionResponse,
  NumeroRequestPayload,
} from '../../../services/api/astrologyApi/astrology.types';
import {resolveNumeroInput} from './kundliService';

/** Display model consumed by MyDayTodayView. */
export interface MyDayTodayViewModel {
  /** Card title, e.g. "Prediction of the Day". */
  title: string;
  /** Card subtitle, e.g. "Today's Prediction - 29-9-2026". */
  dateLabel: string;
  /** Prediction paragraph (null when the API returned nothing). */
  prediction: string | null;
  /** Lucky color + lucky number rows (values are null when unavailable). */
  items: InfoItem[];
}

/** The user profile subset needed to resolve the numerology request input. */
export interface MyDayTodayUser {
  name?: string;
  dateOfBirth?: string;
}

export const MY_DAY_TODAY_TITLE = 'Prediction of the Day';

/** Cache key suffix so a "daily" response is refetched after the day rolls over. */
export const getTodayCacheSuffix = (at: Date = new Date()): string =>
  [
    at.getFullYear(),
    String(at.getMonth() + 1).padStart(2, '0'),
    String(at.getDate()).padStart(2, '0'),
  ].join('-');

/** Formats a date as `d-m-yyyy` (e.g. `29-9-2026`). */
const formatParts = (day: number, month: number, year: number): string =>
  `${day}-${month}-${year}`;

/**
 * Normalises an API `prediction_date` into a `d-m-yyyy` display string.
 * Returns null for a missing/blank value or one that can't be recognised, so
 * the caller can fall back to today's date. Accepts the `DD-MM-YYYY` shape the
 * API returns plus an ISO `YYYY-MM-DD` value (optionally with a time part).
 */
export const formatPredictionDate = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }
  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return formatParts(
      Number(isoMatch[3]),
      Number(isoMatch[2]),
      Number(isoMatch[1]),
    );
  }

  const dmyMatch = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (dmyMatch) {
    return formatParts(
      Number(dmyMatch[1]),
      Number(dmyMatch[2]),
      Number(dmyMatch[3]),
    );
  }

  return null;
};

/** Today's date as `d-m-yyyy`, built from local date parts (no timezone shift). */
export const getTodayDisplayDate = (at: Date = new Date()): string =>
  formatParts(at.getDate(), at.getMonth() + 1, at.getFullYear());

/**
 * The date line under the title: the API's `prediction_date` when available,
 * otherwise today. Shown as "Today's Prediction - 29-9-2026".
 */
export const buildPredictionDateLabel = (
  predictionDate?: string | null,
  at: Date = new Date(),
): string =>
  `Today's Prediction - ${
    formatPredictionDate(predictionDate) ?? getTodayDisplayDate(at)
  }`;

/** True when the resolved input carries a usable name and full DOB. */
export const isNumeroInputComplete = (
  payload: NumeroRequestPayload | null | undefined,
): payload is NumeroRequestPayload => {
  if (!payload) {
    return false;
  }
  return Boolean(
    payload.name &&
      payload.name.trim() &&
      Number.isFinite(payload.day) &&
      Number.isFinite(payload.month) &&
      Number.isFinite(payload.year) &&
      payload.day > 0 &&
      payload.month > 0 &&
      payload.year > 0,
  );
};

/**
 * Resolves the numerology request body from the Kundli form payload, falling
 * back to the stored user profile (name + dateOfBirth). Returns null when the
 * name or the DOB is missing, so no request is sent with invalid data.
 */
export const resolveMyDayTodayInput = (
  result: any,
  user?: MyDayTodayUser | null,
): NumeroRequestPayload | null => {
  const resolved = resolveNumeroInput(result, user);
  return isNumeroInputComplete(resolved) ? resolved : null;
};

/** Builds the display model from the raw API response. */
export const buildMyDayTodayViewModel = (
  response: NumeroPredictionResponse | null | undefined,
  at: Date = new Date(),
): MyDayTodayViewModel => ({
  title: MY_DAY_TODAY_TITLE,
  dateLabel: buildPredictionDateLabel(response?.prediction_date, at),
  prediction: response?.prediction ? response.prediction.trim() || null : null,
  items: [
    {label: 'Lucky Color', value: response?.lucky_color},
    {label: 'Lucky Number', value: response?.lucky_number},
  ],
});

/** True when the response carries nothing worth rendering. */
export const isMyDayTodayViewModelEmpty = (
  viewModel: MyDayTodayViewModel,
): boolean =>
  !viewModel.prediction && viewModel.items.every(item => !item.value);
