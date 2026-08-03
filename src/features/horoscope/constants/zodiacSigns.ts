/**
 * Horoscope Zodiac constants
 *
 * Reuses the existing static `ZODIAC_SIGNS` constant from the app constants
 * (no API call is made to fetch the zodiac list). Presentation-only metadata
 * (zodiac symbol + image) is layered on top so the same list drives the
 * selection grid, the header and the API request.
 */

import {ZODIAC_SIGNS} from '../../../constants/api.constants';
import {images} from '../../../assets/images';
import type {HoroscopeResponse} from '../../../services/api/astrologyApi/astrology.types';

/** Presentation metadata for every zodiac sign, derived from ZODIAC_SIGNS. */
export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  element: string;
  symbol: string;
  image: any;
  apiName: string;
}

/** Unicode zodiac glyphs keyed by the lowercase sign id used by the API. */
export const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
};

/** Shared decorative zodiac image used as the card/header hero asset. */
const ZODIAC_HERO_IMAGE = images.Zodiac;

/**
 * Static zodiac list enriched with presentation metadata.
 * Used by the Zodiac Selection screen (display) and to build the API path
 * (`apiName` is the lowercase sign name the astrology API expects).
 */
export const horoscopeZodiacSigns: ZodiacSign[] = ZODIAC_SIGNS.map(sign => ({
  id: sign.id,
  name: sign.name,
  dateRange: sign.dateRange,
  element: sign.element,
  symbol: ZODIAC_SYMBOLS[sign.id] ?? '★',
  image: ZODIAC_HERO_IMAGE,
  apiName: sign.id,
}));

/** Quick lookup of a sign by its lowercase API name. */
export const getZodiacById = (id: string): ZodiacSign | undefined =>
  horoscopeZodiacSigns.find(
    sign => sign.apiName.toLowerCase() === (id ?? '').toLowerCase(),
  );

/** Resolve the display sign for a horoscope API response. */
export const getZodiacFromResponse = (
  response: HoroscopeResponse | null | undefined,
): ZodiacSign | undefined => {
  if (!response) {
    return undefined;
  }

  const sign = response.sun_sign;

  return sign ? getZodiacById(sign) : undefined;
};
