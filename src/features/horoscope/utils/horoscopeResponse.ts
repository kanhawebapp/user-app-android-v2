/**
 * Horoscope response normalisation.
 *
 * The astrologyapi.com sun sign prediction endpoints return two different
 * shapes:
 *
 *  - `today`      -> a flat object  ({ personal_life, profession, ... })
 *  - `previous` / `next` -> a nested object
 *                       ({ status, sun_sign, prediction_date, prediction: { ...ratings } })
 *
 * `getHoroscopeViewModel` normalises both into a single view model so the
 * presentation layer never has to care which tab produced the data.
 */

import type {HoroscopeResponse} from '../../../services/api/astrologyApi/astrology.types';

/** A single prediction/rating section. */
export interface HoroscopeSection {
  key: string;
  label: string;
  emoji: string;
  description?: string;
  rating?: number;
}

/** Normalised horoscope view model consumed by the UI. */
export interface HoroscopeViewModel {
  /** Prediction date (only present for previous/next responses). */
  date?: string;
  /** The zodiac sign name returned by the API (when available). */
  sunSign?: string;
  /** Ordered list of the six prediction sections. */
  sections: HoroscopeSection[];
  /** True when any rating value exists in the response. */
  hasRatings: boolean;
}

/** Section definitions shared by the prediction cards and the ratings block. */
export const HOROSCOPE_SECTIONS = [
  {key: 'personal_life', label: 'Personal Life', emoji: '❤️'},
  {key: 'profession', label: 'Profession', emoji: '💼'},
  {key: 'health', label: 'Health', emoji: '💚'},
  {key: 'emotions', label: 'Emotions', emoji: '😊'},
  {key: 'travel', label: 'Travel', emoji: '✈️'},
  {key: 'luck', label: 'Luck', emoji: '🍀'},
] as const;

/**
 * Convert a raw (today OR previous/next) horoscope response into a view model.
 * Returns `null` when there is no data to display.
 */
export const getHoroscopeViewModel = (
  response: HoroscopeResponse | null | undefined,
): HoroscopeViewModel | null => {
  if (!response) {
    return null;
  }

  // `today` is flat, `previous`/`next` nest everything under `prediction`.
  const data = response.prediction ?? response;

  const sections: HoroscopeSection[] = HOROSCOPE_SECTIONS.map(section => ({
    key: section.key,
    label: section.label,
    emoji: section.emoji,
    description: data?.[section.key] ?? undefined,
    rating: data?.[`${section.key}_rating`] ?? undefined,
  }));

  const hasRatings = sections.some(section => section.rating != null) ?? false;

  return {
    date: response.prediction_date,
    sunSign: response.sun_sign,
    sections,
    hasRatings: Boolean(hasRatings),
  };
};
