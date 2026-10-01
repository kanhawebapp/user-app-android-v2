/**
 * Shared birth-details request input for the Kundli reports.
 *
 * Several Kundli screens (Nakshatra prediction, Ascendant report, ...) are
 * driven by the same birth details that the Kundli form collected: the date of
 * birth, the birth time and the geocoded birth place (latitude / longitude /
 * timezone). The validation lives here once so every report rejects an
 * incomplete request instead of silently sending a wrong chart.
 */

import type {AstrologyMuhurtaPayload} from '../../../services/api/astrologyApi/astrology.types';
import {buildBasicDetailsPayload} from './kundliService';

/** The eight values every birth-details based Kundli request requires. */
export const REQUIRED_BIRTH_KEYS: (keyof AstrologyMuhurtaPayload)[] = [
  'day',
  'month',
  'year',
  'hour',
  'min',
  'lat',
  'lon',
  'tzone',
];

/**
 * True when every value a request needs is present and numeric.
 * Checked on the raw source because `buildBasicDetailsPayload` coerces a
 * missing number to 0, which would otherwise turn a missing timezone into a
 * silent UTC birth chart.
 */
export const hasEveryBirthValue = (source: object): boolean =>
  REQUIRED_BIRTH_KEYS.every(key => {
    const raw = (source as Record<string, unknown>)[key];
    return (
      raw !== undefined &&
      raw !== null &&
      raw !== '' &&
      Number.isFinite(Number(raw))
    );
  });

/** True when the built payload holds plausible birth values. */
export const isCompleteBirthPayload = (
  payload: AstrologyMuhurtaPayload,
): boolean =>
  Number.isFinite(payload.day) &&
  Number.isFinite(payload.month) &&
  Number.isFinite(payload.year) &&
  Number.isFinite(payload.hour) &&
  Number.isFinite(payload.min) &&
  Number.isFinite(payload.lat) &&
  Number.isFinite(payload.lon) &&
  Number.isFinite(payload.tzone) &&
  payload.day > 0 &&
  payload.day <= 31 &&
  payload.month > 0 &&
  payload.month <= 12 &&
  payload.year > 0 &&
  payload.hour >= 0 &&
  payload.hour <= 23 &&
  payload.min >= 0 &&
  payload.min <= 59 &&
  payload.lat >= -90 &&
  payload.lat <= 90 &&
  payload.lon >= -180 &&
  payload.lon <= 180;

/**
 * Resolves the birth-details request body from the Kundli flow result — the
 * same payload the Kundli form produced (DOB, birth time, geocoded latitude /
 * longitude and timezone). Accepts both the navigation result (`{payload}`)
 * and a bare payload. Returns null when any value is missing or out of range,
 * so the screen can explain what is required instead of sending an invalid
 * request.
 */
export const resolveBirthDetailsPayload = (
  result: any,
): AstrologyMuhurtaPayload | null => {
  const source = result?.payload ?? result;
  if (!source || typeof source !== 'object' || !hasEveryBirthValue(source)) {
    return null;
  }

  const payload = buildBasicDetailsPayload(source);
  return isCompleteBirthPayload(payload) ? payload : null;
};
