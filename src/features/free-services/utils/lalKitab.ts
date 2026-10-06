/**
 * Lal Kitab view-model helpers.
 *
 * The four Lal Kitab endpoints (horoscope / debts / houses / planets) all take
 * the same birth-details payload, so these helpers stay pure: they resolve the
 * request input from the Kundli flow, normalise each raw response into display
 * models, and describe the four report tabs.
 *
 * The API is loose with its values: a missing slot arrives as `"-"`, as `null`,
 * as `undefined`, as an empty array, and `planet_degree` is usually absent for a
 * sign with no planets. Every normaliser therefore maps unknown values to null
 * or an empty list so the UI can never render "undefined" / "null".
 */

import type {
  AstrologyMuhurtaPayload,
  LalKitabDebt,
  LalKitabDebtsResponse,
  LalKitabHoroscopeItem,
  LalKitabHoroscopeResponse,
  LalKitabHouse,
  LalKitabHousesResponse,
  LalKitabPlanet,
  LalKitabPlanetsResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {resolveBirthDetailsPayload} from './birthDetails';
import {toBoolean, toDisplayList} from './doshaReport';

/** The four Lal Kitab reports shown as tabs. */
export type LalKitabTab = 'horoscope' | 'debts' | 'houses' | 'planets';

/** Every tab key, in display order. */
export const LAL_KITAB_TAB_KEYS: LalKitabTab[] = [
  'horoscope',
  'debts',
  'houses',
  'planets',
];

/** Tab bar definition, in display order. */
export const LAL_KITAB_TABS: {key: LalKitabTab; label: string}[] =
  LAL_KITAB_TAB_KEYS.map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

/** Cache key per tab (matches the API path suffix). */
export const LAL_KITAB_ENDPOINTS: Record<LalKitabTab, string> = {
  horoscope: 'lalkitab_horoscope',
  debts: 'lalkitab_debts',
  houses: 'lalkitab_houses',
  planets: 'lalkitab_planets',
};

/** Narrows a tab id coming from the UI (the segmented control) to a tab. */
export const isLalKitabTab = (value: string): value is LalKitabTab =>
  LAL_KITAB_TABS.some(tab => tab.key === value);

/**
 * Reads a display string. Blank strings and the API's `"-"` placeholder both
 * mean "no value", so they become null rather than being shown to the user.
 */
const toNullableText = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' || trimmed === '-' ? null : trimmed;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

/**
 * True for a raw entry that cannot be rendered: absent, a primitive, or an
 * array (which would mean the API returned an unexpected shape).
 */
const isUnusableRecord = (value: unknown): boolean =>
  !value || typeof value !== 'object' || Array.isArray(value);

/** Filters the API's `"-"` placeholders out of an already-flattened list. */
const dropPlaceholders = (values: string[]): string[] =>
  values.filter(value => value !== '-');

// ============================================
// Lal Kitab Horoscope
// ============================================

/** One planet placed in a sign, with its chart abbreviation and degree. */
export interface LalKitabPlacementView {
  /** Full planet name, e.g. 'Sun'. */
  name: string;
  /** Chart abbreviation, e.g. 'Su'. Null when the API omitted it. */
  short: string | null;
  /** Degree inside the sign, e.g. '12.19°'. Null when not populated. */
  degree: string | null;
}

/** One zodiac sign card: its number, name and the planets placed in it. */
export interface LalKitabSignView {
  key: string;
  /** Display sign number, or '—' when the API omitted it. */
  signNumber: string;
  /** e.g. 'Aries'. */
  signName: string;
  /** One entry per planet in the sign (empty when there are none). */
  placements: LalKitabPlacementView[];
  /** True when the sign holds no planets, so the UI can say so. */
  isEmpty: boolean;
}

/**
 * Formats one degree entry as `12.19°`, tolerating the string or number form
 * the API uses. Returns null for a value that is not a usable degree.
 */
const toDegreeText = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numeric =
    typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return `${numeric.toFixed(2)}°`;
};

/**
 * Turns `planet` / `planet_small` / `planet_degree` into per-planet placements.
 *
 * The three lists are parallel, but `planet_small` and `planet_degree` are
 * frequently shorter than `planet` (or absent entirely), so each is read by
 * index and a missing entry becomes null rather than shifting the next planet's
 * value onto the wrong row.
 */
export const normalizeLalKitabHoroscope = (
  response: LalKitabHoroscopeResponse | null | undefined,
): LalKitabSignView[] => {
  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .filter((item): item is LalKitabHoroscopeItem => !isUnusableRecord(item))
    .map((item, index) => {
      const planets = dropPlaceholders(toDisplayList(item.planet));
      const planetShort = dropPlaceholders(toDisplayList(item.planet_small));

      // `planet_degree` is normally an array parallel to `planet`, but a lone
      // string / number is tolerated.
      const rawDegrees: unknown[] = Array.isArray(item.planet_degree)
        ? item.planet_degree
        : item.planet_degree === null || item.planet_degree === undefined
        ? []
        : [item.planet_degree];

      const signNumber = toNullableText(item.sign);
      const signName = toNullableText(item.sign_name);

      return {
        key: `${signName ?? 'sign'}-${signNumber ?? index}`,
        signNumber: signNumber ?? '—',
        signName: signName ?? '—',
        placements: planets.map((name, planetIndex) => ({
          name,
          short: planetShort[planetIndex] ?? null,
          degree: toDegreeText(rawDegrees[planetIndex]),
        })),
        isEmpty: planets.length === 0,
      };
    });
};

/** True when the horoscope response carried no usable sign. */
export const isLalKitabHoroscopeEmpty = (
  signs: LalKitabSignView[] | null,
): boolean => !signs || signs.length === 0;

// ============================================
// Lal Kitab Debts
// ============================================

/** One debt card. */
export interface LalKitabDebtView {
  key: string;
  /** e.g. 'Self Debts'. */
  name: string;
  /** What this debt indicates, shown in full. */
  indications: string | null;
  /** Events associated with this debt, shown in full. */
  events: string | null;
  /** True when neither paragraph carried any text. */
  isEmpty: boolean;
}

export const normalizeLalKitabDebts = (
  response: LalKitabDebtsResponse | null | undefined,
): LalKitabDebtView[] => {
  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .filter((item): item is LalKitabDebt => !isUnusableRecord(item))
    .map((item, index) => {
      const indications = toNullableText(item.indications);
      const events = toNullableText(item.events);

      return {
        key: `${toNullableText(item.debt_name) ?? 'debt'}-${index}`,
        name: toNullableText(item.debt_name) ?? '—',
        indications,
        events,
        isEmpty: !indications && !events,
      };
    });
};

export const isLalKitabDebtsEmpty = (
  debts: LalKitabDebtView[] | null,
): boolean => !debts || debts.length === 0;

// ============================================
// Lal Kitab Houses
// ============================================

/** One house (khana) card. */
export interface LalKitabHouseView {
  key: string;
  /** Khana / house number as a string, or '—'. */
  khanaNumber: string;
  /** Owner planet, e.g. 'Mars'. */
  maalik: string | null;
  /** Pakka Ghar (fixed sign lord). */
  pakkaGhar: string | null;
  /** Kismat (disposable sign lord). */
  kismat: string | null;
  /** null when the API omitted the flag. */
  isSleeping: boolean | null;
  /** 'Sleeping' | 'Active' | '—', derived from `soya`. */
  sleepingLabel: string;
  /** Planets exalted in the house (empty when none). */
  exalt: string[];
  /** Planets debilitated in the house (empty when none). */
  debilitated: string[];
}

export const normalizeLalKitabHouses = (
  response: LalKitabHousesResponse | null | undefined,
): LalKitabHouseView[] => {
  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .filter((item): item is LalKitabHouse => !isUnusableRecord(item))
    .map((item, index) => {
      const isSleeping = toBoolean(item.soya);
      const khanaNumber = toNullableText(item.khana_number);

      return {
        key: `house-${khanaNumber ?? index}`,
        khanaNumber: khanaNumber ?? '—',
        maalik: toNullableText(item.maalik),
        pakkaGhar: toNullableText(item.pakka_ghar),
        kismat: toNullableText(item.kismat),
        isSleeping,
        sleepingLabel: getSoyaLabel(isSleeping),
        exalt: dropPlaceholders(toDisplayList(item.exalt)),
        debilitated: dropPlaceholders(toDisplayList(item.debilitated)),
      };
    });
};

/** 'Sleeping' when the body/house is soya, 'Active' when not, '—' if unknown. */
export const getSoyaLabel = (soya: boolean | null | undefined): string => {
  if (soya === null || soya === undefined) {
    return '—';
  }
  return soya ? 'Sleeping' : 'Active';
};

export const isLalKitabHousesEmpty = (
  houses: LalKitabHouseView[] | null,
): boolean => !houses || houses.length === 0;

// ============================================
// Lal Kitab Planets
// ============================================

/** One planet card. The API also returns Rahu and Ketu. */
export interface LalKitabPlanetView {
  key: string;
  /** e.g. 'Sun', 'Rahu'. */
  planet: string;
  /** Sign the planet occupies, e.g. 'Virgo'. */
  rashi: string | null;
  /** null when the API omitted the flag. */
  isSleeping: boolean | null;
  /** 'Sleeping' | 'Active' | '—', derived from `soya`. */
  sleepingLabel: string;
  /** e.g. 'NEUTRAL SIGN'. */
  position: string | null;
  /** e.g. 'Malefic' | 'Benefic'. */
  nature: string | null;
}

export const normalizeLalKitabPlanets = (
  response: LalKitabPlanetsResponse | null | undefined,
): LalKitabPlanetView[] => {
  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .filter((item): item is LalKitabPlanet => !isUnusableRecord(item))
    .map((item, index) => {
      const planet = toNullableText(item.planet);
      const isSleeping = toBoolean(item.soya);

      return {
        key: `${planet ?? 'planet'}-${index}`,
        planet: planet ?? '—',
        rashi: toNullableText(item.rashi),
        isSleeping,
        sleepingLabel: getSoyaLabel(isSleeping),
        position: toNullableText(item.position),
        nature: toNullableText(item.nature),
      };
    });
};

export const isLalKitabPlanetsEmpty = (
  planets: LalKitabPlanetView[] | null,
): boolean => !planets || planets.length === 0;

// ============================================
// Shared request input
// ============================================

/**
 * Resolves the request body from the Kundli flow payload — the same birth
 * details (DOB, birth time, geocoded latitude / longitude and timezone) every
 * other Kundli report uses. Returns null when any value is missing or out of
 * range so the screen explains what is required instead of sending an invalid
 * request. The Lal Kitab endpoints need exactly this payload, so no separate
 * date / time conversion is required (or wanted): the device's own location and
 * timezone are never substituted.
 */
export const resolveLalKitabInput = (
  result: any,
): AstrologyMuhurtaPayload | null => resolveBirthDetailsPayload(result);
