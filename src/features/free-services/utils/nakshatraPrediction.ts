/**
 * Daily Nakshatra prediction view-model helpers.
 *
 * The three endpoints (previous / daily / next) share one response shape, so
 * these helpers stay pure: they resolve the birth-details request input from
 * the Kundli flow, normalise the raw response into display strings, and derive
 * the date shown for the selected tab.
 *
 * All date maths is done on local date parts. `new Date(string)` is
 * deliberately avoided so a birth date can never be shifted a day by the
 * device timezone.
 */

import type {IconProps} from '../../../components/Icon/iconType';
import type {
  AstrologyMuhurtaPayload,
  DailyNakshatraPrediction,
  DailyNakshatraPredictionResponse,
  NakshatraPredictionTab,
} from '../../../services/api/astrologyApi/astrology.types';
import {buildBasicDetailsPayload, toDisplayValue} from './kundliService';

/** One displayed prediction card (Health, Emotions, ...). */
export interface NakshatraPredictionSection {
  key: keyof DailyNakshatraPrediction;
  title: string;
  icon: IconProps;
  /** Prediction text, or null when the API returned nothing for this section. */
  text: string | null;
}

/** Normalised view model consumed by NakshatraPredictionView. */
export interface NakshatraPredictionViewModel {
  /** The tab this model was built for. */
  tab: NakshatraPredictionTab;
  /** Card title, e.g. "Nakshatra Prediction: Today". */
  title: string;
  /** The day the prediction is for, e.g. "29 September 2026". */
  date: string;
  /** Birth moon sign, display-safe (never null/undefined). */
  moonSign: string;
  /** Birth moon nakshatra, display-safe (never null/undefined). */
  nakshatra: string;
  /** The six prediction sections, in display order. */
  sections: NakshatraPredictionSection[];
}

/** Yesterday / Today / Tomorrow tab definitions. */
export const NAKSHATRA_PREDICTION_TABS: {
  key: NakshatraPredictionTab;
  label: string;
}[] = [
  {key: 'yesterday', label: 'Yesterday'},
  {key: 'today', label: 'Today'},
  {key: 'tomorrow', label: 'Tomorrow'},
];

/** Endpoint cache key per tab (matches the three API paths). */
export const NAKSHATRA_PREDICTION_ENDPOINTS: Record<
  NakshatraPredictionTab,
  string
> = {
  yesterday: 'daily_nakshatra_prediction/previous',
  today: 'daily_nakshatra_prediction',
  tomorrow: 'daily_nakshatra_prediction/next',
};

/** Narrows a tab id coming from the UI (e.g. the segmented control) to a tab. */
export const isNakshatraPredictionTab = (
  value: string,
): value is NakshatraPredictionTab =>
  NAKSHATRA_PREDICTION_TABS.some(tab => tab.key === value);

/** Display order + titles/icons of the six prediction sections. */
export const NAKSHATRA_PREDICTION_SECTIONS: {
  key: keyof DailyNakshatraPrediction;
  title: string;
  icon: IconProps;
}[] = [
  {
    key: 'health',
    title: 'Health',
    icon: {name: 'favorite', library: 'MaterialIcons'},
  },
  {
    key: 'emotions',
    title: 'Emotions',
    icon: {name: 'sentiment-satisfied', library: 'MaterialIcons'},
  },
  {
    key: 'profession',
    title: 'Profession',
    icon: {name: 'work', library: 'MaterialIcons'},
  },
  {
    key: 'luck',
    title: 'Luck',
    icon: {name: 'casino', library: 'MaterialIcons'},
  },
  {
    key: 'personal_life',
    title: 'Personal Life',
    icon: {name: 'favorite-border', library: 'MaterialIcons'},
  },
  {
    key: 'travel',
    title: 'Travel',
    icon: {name: 'flight', library: 'MaterialIcons'},
  },
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Formats a local date as `29 September 2026` from its own parts. */
const formatLocalDate = (at: Date): string =>
  `${at.getDate()} ${
    MONTH_NAMES[at.getMonth()] || at.getMonth() + 1
  } ${at.getFullYear()}`;

/**
 * The local calendar day the given tab refers to. Built from local date parts
 * (never from a parsed string), so it cannot drift across a timezone boundary.
 */
export const getTabReferenceDate = (
  tab: NakshatraPredictionTab,
  at: Date = new Date(),
): string => {
  const offsetDays = tab === 'yesterday' ? -1 : tab === 'tomorrow' ? 1 : 0;

  if (offsetDays === 0) {
    return formatLocalDate(at);
  }

  // Constructing from local parts keeps the day shift in local time.
  const shifted = new Date(
    at.getFullYear(),
    at.getMonth(),
    at.getDate() + offsetDays,
  );

  return formatLocalDate(shifted);
};

/**
 * The date shown for a tab: the API's `prediction_date` when it carries a
 * value, otherwise the tab's own reference date. A raw value is shown as-is
 * because the API returns a readable string (e.g. "7 July 2017").
 */
export const resolvePredictionDate = (
  predictionDate: string | null | undefined,
  tab: NakshatraPredictionTab,
  at: Date = new Date(),
): string => {
  const raw = typeof predictionDate === 'string' ? predictionDate.trim() : '';
  return raw || getTabReferenceDate(tab, at);
};

/** Reads a section's text, treating blank strings as missing. */
const asPredictionText = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  return value.trim() || null;
};

/**
 * True when every birth-detail value the request needs is present and numeric.
 * Guards against sending an incomplete request: the API needs all eight values
 * (day, month, year, hour, min, lat, lon, tzone).
 */
const isCompleteBirthPayload = (payload: AstrologyMuhurtaPayload): boolean =>
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

/** The eight values the daily Nakshatra prediction request requires. */
const REQUIRED_BIRTH_KEYS: (keyof AstrologyMuhurtaPayload)[] = [
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
 * True when the source actually carries every requested value. Checked on the
 * raw source because `buildBasicDetailsPayload` coerces a missing number to 0,
 * which would otherwise turn a missing timezone into a silent UTC birth chart.
 */
const hasEveryBirthValue = (source: object): boolean =>
  REQUIRED_BIRTH_KEYS.every(key => {
    const raw = (source as Record<string, unknown>)[key];
    return (
      raw !== undefined &&
      raw !== null &&
      raw !== '' &&
      Number.isFinite(Number(raw))
    );
  });

/**
 * Resolves the request body from the Kundli flow payload — the same birth
 * details (DOB, birth time, geocoded latitude/longitude and timezone) the
 * other Kundli screens use. Returns null when any value is missing, so the
 * screen can explain what is required instead of sending an invalid request.
 */
export const resolveNakshatraPredictionInput = (
  result: any,
): AstrologyMuhurtaPayload | null => {
  const source = result?.payload ?? result;
  if (!source || typeof source !== 'object' || !hasEveryBirthValue(source)) {
    return null;
  }

  const payload = buildBasicDetailsPayload(source);
  return isCompleteBirthPayload(payload) ? payload : null;
};

/**
 * Normalises a raw response into a view model for the selected tab. Returns
 * null when there is no response to render. Missing fields become display-safe
 * values so `undefined` / `null` are never rendered to the user.
 */
export const normalizeNakshatraPrediction = (
  response: DailyNakshatraPredictionResponse | null | undefined,
  tab: NakshatraPredictionTab,
  at: Date = new Date(),
): NakshatraPredictionViewModel | null => {
  if (!response) {
    return null;
  }

  const prediction = response.prediction ?? {};

  return {
    tab,
    title: `Nakshatra Prediction: ${
      NAKSHATRA_PREDICTION_TABS.find(item => item.key === tab)?.label ?? 'Today'
    }`,
    date: resolvePredictionDate(response.prediction_date, tab, at),
    moonSign: toDisplayValue(response.birth_moon_sign),
    nakshatra: toDisplayValue(response.birth_moon_nakshatra),
    sections: NAKSHATRA_PREDICTION_SECTIONS.map(section => ({
      key: section.key,
      title: section.title,
      icon: section.icon,
      text: asPredictionText(prediction[section.key]),
    })),
  };
};

/**
 * True when the response carries nothing worth rendering: no prediction text
 * and no birth moon sign / nakshatra to show above it.
 */
export const isNakshatraPredictionEmpty = (
  viewModel: NakshatraPredictionViewModel | null,
): boolean => {
  if (!viewModel) {
    return true;
  }

  const hasMoonDetails =
    viewModel.moonSign !== '—' || viewModel.nakshatra !== '—';

  return !hasMoonDetails && viewModel.sections.every(section => !section.text);
};
