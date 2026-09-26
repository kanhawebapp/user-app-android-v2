/**
 * Match Making (Kundli Milan) helpers.
 *
 * Contains three things:
 *  - the form model + validation for the two-party Match Making form,
 *  - the builder that turns that form model into the single `MatchMakingPayload`
 *    every match_making_* endpoint expects,
 *  - normalisers that turn the five API responses into defensive view models
 *    (mirroring `doshaReport.ts`) plus a `fetchMatchMakingBundle` helper that
 *    runs the five independent endpoints in parallel.
 *
 * Nothing here hardcodes report data: every value is either derived from the
 * form or taken verbatim from the API responses.
 */

import {
  getMatchAshtakootPoints,
  getMatchAstroDetails,
  getMatchMakingReport,
  getMatchManglikReport,
  getMatchObstructions,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  BirthPlace,
  Koota,
  MatchAstroDetails,
  MatchAstroPartyDetails,
  MatchAshtakootPoints,
  MatchMakingPayload,
  MatchMakingReport,
  MatchManglikReport,
  MatchObstructions,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  formatPercent,
  htmlToParagraphs,
  humanizeLabel,
  presentText,
  toBoolean,
  toDisplayList,
} from './doshaReport';
import {getInitialBirthValues} from './freeServiceForm';

// ============================================
// Form model + validation
// ============================================

/** Header of the two-person input form. */
export const MATCH_MAKING_FORM_TITLE = 'Free Match Making';

/** Header of the generated report. Fixed, so the report is always identified. */
export const MATCH_MAKING_REPORT_TITLE =
  'Free Match Making - Kundli Milan Report';

/** One party of the match as collected by the form. */
export interface MatchPartyForm {
  name: string;
  /** DD/MM/YYYY, matching the shared date picker. */
  date: string;
  /** hh:mm AM/PM, matching the shared time picker. */
  time: string;
  /** Free-text place picked from the shared place-of-birth search. */
  address: string;
}

/** Per-field validation messages, keyed as `maleName`, `femaleTime`, ... */
export type MatchPartyErrors = Partial<
  Record<'name' | 'date' | 'time' | 'address', string>
>;

export interface MatchFormErrors {
  male: MatchPartyErrors;
  female: MatchPartyErrors;
}

export interface MatchFormValues {
  male: MatchPartyForm;
  female: MatchPartyForm;
}

const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
const TIME_PATTERN = /^\d{1,2}:\d{2}\s?(AM|PM)$/i;

/** Empty form model with today's date/time prefilled, ready to edit. */
export const getInitialMatchFormValues = (): MatchFormValues => {
  const initial = getInitialBirthValues();

  return {
    male: {name: '', date: initial.date, time: initial.time, address: ''},
    female: {name: '', date: initial.date, time: initial.time, address: ''},
  };
};

/** `'15/08/1990'` → `{day: 15, month: 8, year: 1990}`, or null when invalid. */
const parseDate = (
  value: string,
): {day: number; month: number; year: number} | null => {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [day, month, year] = value.split('/').map(Number);
  const parsed = new Date(year, month - 1, day);

  // Rejects impossible dates such as 31/02/1990 and future years.
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return {day, month, year};
};

/** `'09:30 PM'` → `{hour: 21, min: 30}`, or null when invalid. */
export const parseTime = (
  value: string,
): {hour: number; min: number} | null => {
  if (!TIME_PATTERN.test(value)) {
    return null;
  }

  const [timePart, meridiem] = value.trim().split(/\s+/);
  const [rawHour, rawMin] = timePart.split(':');

  let hour = Number(rawHour);
  const min = Number(rawMin);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(min) ||
    hour < 1 ||
    hour > 12 ||
    min < 0 ||
    min > 59
  ) {
    return null;
  }

  const upperMeridiem = (meridiem || 'AM').toUpperCase();
  if (upperMeridiem === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (upperMeridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  return {hour, min};
};

/** Validates one party. Returns an empty object when the party is complete. */
export const validateParty = (party: MatchPartyForm): MatchPartyErrors => {
  const errors: MatchPartyErrors = {};

  if (!party.name?.trim()) {
    errors.name = 'Please enter the name';
  }

  if (!parseDate(party.date ?? '')) {
    errors.date = 'Please select a valid date of birth';
  }

  if (!parseTime(party.time ?? '')) {
    errors.time = 'Please select a valid time of birth';
  }

  if (!party.address?.trim()) {
    errors.address = 'Please select a birth place';
  }

  return errors;
};

export const hasErrors = (errors: MatchPartyErrors): boolean =>
  Object.keys(errors).length > 0;

/** Validates both parties. The form submits only when the result is clean. */
export const validateMatchForm = (
  values: MatchFormValues,
): MatchFormErrors => ({
  male: validateParty(values.male),
  female: validateParty(values.female),
});

/** First validation message across both parties, used for the toast. */
export const getFirstErrorMessage = (
  errors: MatchFormErrors,
): string | null => {
  const messages = [
    ...Object.values(errors.male),
    ...Object.values(errors.female),
  ].filter((message): message is string => Boolean(message));

  return messages.length > 0 ? messages[0] : null;
};

// ============================================
// Payload builder
// ============================================

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** A party paired with its resolved coordinates / timezone. */
export interface ResolvedParty {
  party: MatchPartyForm;
  birthPlace: BirthPlace;
}

/** Display details for one party, shown in the report header. */
export interface MatchPartySummary {
  name: string;
  /** Formatted birth date, e.g. '10 May 1990'. */
  date: string;
  /** Formatted 12-hour birth time, e.g. '11:55 AM'. */
  time: string;
  /** Geocoded place name. */
  place: string;
}

/**
 * Builds the report header details for both parties from the form values and
 * the resolved birth places. Every value comes from user input or the
 * geocoder — nothing is hardcoded.
 */
export const buildMatchPartiesSummary = ({
  male,
  female,
}: {
  male: ResolvedParty;
  female: ResolvedParty;
}): {male: MatchPartySummary; female: MatchPartySummary} => {
  const summarize = ({party, birthPlace}: ResolvedParty): MatchPartySummary => {
    const date = parseDate(party.date);
    const time = parseTime(party.time);

    return {
      name: party.name.trim(),
      date: date ? formatBirthDate(date) : '—',
      time: time ? formatBirthTime(time) : '—',
      place: birthPlace.place || party.address.trim() || '—',
    };
  };

  return {male: summarize(male), female: summarize(female)};
};

/**
 * Fallback header details derived straight from the payload, used when the
 * report is rendered from a cached bundle without the original form values.
 */
export const summarizeMatchPayload = (
  payload: MatchMakingPayload | null | undefined,
): {male: MatchPartySummary; female: MatchPartySummary} => {
  const summarize = (prefix: 'm' | 'f'): MatchPartySummary => ({
    name: '',
    date: formatBirthDate({
      day: toNumber(payload?.[`${prefix}_day`]),
      month: toNumber(payload?.[`${prefix}_month`]),
      year: toNumber(payload?.[`${prefix}_year`]),
    }),
    time: formatBirthTime({
      hour: toNumber(payload?.[`${prefix}_hour`]),
      min: toNumber(payload?.[`${prefix}_min`]),
    }),
    place: '',
  });

  return {male: summarize('m'), female: summarize('f')};
};

/**
 * Builds the single `MatchMakingPayload` shared by all five endpoints.
 *
 * Throws when a party is incomplete so a malformed payload is never sent.
 */
export const buildMatchMakingPayload = ({
  male,
  female,
}: {
  male: ResolvedParty;
  female: ResolvedParty;
}): MatchMakingPayload => {
  const maleDate = parseDate(male.party.date);
  const maleTime = parseTime(male.party.time);
  const femaleDate = parseDate(female.party.date);
  const femaleTime = parseTime(female.party.time);

  if (!maleDate || !maleTime || !femaleDate || !femaleTime) {
    throw new Error('Please complete both birth dates and birth times.');
  }

  return {
    m_day: maleDate.day,
    m_month: maleDate.month,
    m_year: maleDate.year,
    m_hour: maleTime.hour,
    m_min: maleTime.min,
    m_lat: toNumber(male.birthPlace.lat),
    m_lon: toNumber(male.birthPlace.lon),
    m_tzone: toNumber(male.birthPlace.timezone),

    f_day: femaleDate.day,
    f_month: femaleDate.month,
    f_year: femaleDate.year,
    f_hour: femaleTime.hour,
    f_min: femaleTime.min,
    f_lat: toNumber(female.birthPlace.lat),
    f_lon: toNumber(female.birthPlace.lon),
    f_tzone: toNumber(female.birthPlace.timezone),
  };
};

/** The birth instant a party was born at, used to pick the right UTC offset. */
export const getBirthMoment = (party: MatchPartyForm): Date | null => {
  const date = parseDate(party.date);
  const time = parseTime(party.time);

  if (!date || !time) {
    return null;
  }

  return new Date(date.year, date.month - 1, date.day, time.hour, time.min);
};

// ============================================
// Display helpers
// ============================================

/** `'1990-05-10'`-free formatting of the raw payload numbers for the header. */
export const formatBirthDate = (parts: {
  day: number;
  month: number;
  year: number;
}): string => {
  const monthName = [
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
  ][Math.max(0, Math.min(11, parts.month - 1))];

  if (!monthName) {
    return `${parts.day}/${parts.month}/${parts.year}`;
  }

  return `${parts.day} ${monthName} ${parts.year}`;
};

/** `hour: 21, min: 5` → `'09:05 PM'`. */
export const formatBirthTime = (parts: {hour: number; min: number}): string => {
  const meridiem = parts.hour >= 12 ? 'PM' : 'AM';
  const hour12 = parts.hour % 12 || 12;

  return `${String(hour12).padStart(2, '0')}:${String(parts.min).padStart(
    2,
    '0',
  )} ${meridiem}`;
};

// ============================================
// Match Making Report (match_making_report)
// ============================================

export interface MatchOverviewItem {
  key: 'ashtakoota' | 'manglik' | 'rajju_dosha' | 'vedha_dosha';
  label: string;
  /** Raw API status: 'Yes' / 'No' / '—'. */
  status: string;
  /** True only when the API explicitly returned `status: true`. */
  isPresent: boolean | null;
  /** Optional extra rows (e.g. received points, percentages). */
  details: {label: string; value: string}[];
}

export interface MatchMakingReportData {
  overview: MatchOverviewItem[];
  /** `conclusion.match_report` rendered as paragraphs. */
  conclusionParagraphs: string[];
  conclusion: string | null;
}

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toText = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

/**
 * Parses the match endpoints' status flag, which is documented as
 * `'Yes' | 'No' | '—'` but has also come back as a real boolean. `'—'` and any
 * other unrecognised value mean "not reported", which renders as null.
 */
const toStatusFlag = (value: unknown): boolean | null => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'yes') {
      return true;
    }
    if (normalized === 'no') {
      return false;
    }
    return null;
  }
  return toBoolean(value);
};

export const normalizeMatchMakingReport = (
  raw: MatchMakingReport | null | undefined,
): MatchMakingReportData => {
  const response = raw && typeof raw === 'object' ? raw : {};

  const receivedPoints = toNumberOrNull(response.ashtakoota?.received_points);
  const totalPoints = toNumberOrNull(response.ashtakoota?.total_points);
  const malePercentage = toNumberOrNull(response.manglik?.male_percentage);
  const femalePercentage = toNumberOrNull(response.manglik?.female_percentage);

  const ashtakootaDetails: {label: string; value: string}[] = [];
  if (receivedPoints !== null) {
    ashtakootaDetails.push({
      label: 'Received Points',
      value:
        totalPoints !== null
          ? `${receivedPoints} / ${totalPoints}`
          : String(receivedPoints),
    });
  }

  const manglikDetails: {label: string; value: string}[] = [];
  const malePercentText = formatPercent(malePercentage);
  const femalePercentText = formatPercent(femalePercentage);
  if (malePercentText) {
    manglikDetails.push({label: 'Male', value: malePercentText});
  }
  if (femalePercentText) {
    manglikDetails.push({label: 'Female', value: femalePercentText});
  }

  const overviewRow = (
    key: MatchOverviewItem['key'],
    label: string,
    status: unknown,
    details: {label: string; value: string}[],
  ): MatchOverviewItem => {
    const isPresent = toStatusFlag(status);
    return {key, label, status: presentText(isPresent), isPresent, details};
  };

  const overview: MatchOverviewItem[] = [
    overviewRow(
      'ashtakoota',
      'Ashtakoota',
      response.ashtakoota?.status,
      ashtakootaDetails,
    ),
    overviewRow('manglik', 'Manglik', response.manglik?.status, manglikDetails),
    overviewRow('rajju_dosha', 'Rajju Dosha', response.rajju_dosha?.status, []),
    overviewRow('vedha_dosha', 'Vedha Dosha', response.vedha_dosha?.status, []),
  ];

  const conclusion = toText(response.conclusion?.match_report);

  return {
    overview,
    conclusion,
    conclusionParagraphs: htmlToParagraphs(conclusion),
  };
};

export const isMatchMakingReportEmpty = (
  data: MatchMakingReportData | null,
): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.conclusion === null &&
    data.overview.every(item => item.isPresent === null)
  );
};

// ============================================
// Match Manglik Report (match_manglik_report)
// ============================================

export interface ManglikAnalysisData {
  isPresent: boolean | null;
  /** 'EFFECTIVE' → 'Effective'. */
  status: string | null;
  percentage: number | null;
  percentageAfterCancellation: number | null;
  reportParagraphs: string[];
  basedOnAspect: string[];
  basedOnHouse: string[];
  cancelRules: string[];
}

export interface MatchManglikReportData {
  male: ManglikAnalysisData;
  female: ManglikAnalysisData;
  conclusionMatch: boolean | null;
  conclusionParagraphs: string[];
  conclusion: string | null;
}

const normalizeManglikAnalysis = (
  analysis: MatchManglikReport['male'],
): ManglikAnalysisData => {
  const source = analysis && typeof analysis === 'object' ? analysis : {};

  return {
    isPresent: toBoolean(source.is_present),
    status: humanizeLabel(toText(source.manglik_status)),
    percentage: toNumberOrNull(source.percentage_manglik_present),
    percentageAfterCancellation: toNumberOrNull(
      source.percentage_manglik_after_cancellation,
    ),
    reportParagraphs: htmlToParagraphs(toText(source.manglik_report)),
    basedOnAspect: toDisplayList(source.manglik_present_rule?.based_on_aspect),
    basedOnHouse: toDisplayList(source.manglik_present_rule?.based_on_house),
    cancelRules: toDisplayList(source.manglik_cancel_rule),
  };
};

export const normalizeMatchManglikReport = (
  raw: MatchManglikReport | null | undefined,
): MatchManglikReportData => {
  const response = raw && typeof raw === 'object' ? raw : {};
  const conclusion = toText(response.conclusion?.report);

  return {
    male: normalizeManglikAnalysis(response.male),
    female: normalizeManglikAnalysis(response.female),
    conclusionMatch: toBoolean(response.conclusion?.match),
    conclusion,
    conclusionParagraphs: htmlToParagraphs(conclusion),
  };
};

export const isManglikAnalysisEmpty = (
  data: ManglikAnalysisData | null,
): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.isPresent === null &&
    data.status === null &&
    data.percentage === null &&
    data.percentageAfterCancellation === null &&
    data.reportParagraphs.length === 0 &&
    data.basedOnAspect.length === 0 &&
    data.basedOnHouse.length === 0 &&
    data.cancelRules.length === 0
  );
};

// ============================================
// Match Astro Details (match_astro_details)
// ============================================

/**
 * Ordered label → API key map for the astro details table. The report renders
 * only the keys the API actually returned, in this order.
 */
export const ASTRO_DETAIL_FIELDS: {label: string; keys: string[]}[] = [
  {label: 'Ascendant', keys: ['ascendant']},
  {label: 'Varna', keys: ['Varna']},
  {label: 'Vashya', keys: ['Vashya']},
  {label: 'Yoni', keys: ['Yoni']},
  {label: 'Gan', keys: ['Gan']},
  {label: 'Nadi', keys: ['Nadi']},
  {label: 'Sign Lord', keys: ['SignLord']},
  {label: 'Sign', keys: ['sign']},
  // The API has used both spellings for nakshatra.
  {label: 'Nakshatra', keys: ['Naksahtra', 'Nakshatra']},
  {label: 'Nakshatra Lord', keys: ['NaksahtraLord', 'NakshatraLord']},
  {label: 'Charan', keys: ['Charan']},
  {label: 'Yog', keys: ['Yog']},
  {label: 'Karan', keys: ['Karan']},
  {label: 'Tithi', keys: ['Tithi']},
  {label: 'Yunja', keys: ['yunja', 'Yunja']},
  {label: 'Tatva', keys: ['tatva', 'Tatva']},
  {label: 'Name Alphabet', keys: ['name_alphabet']},
  {label: 'Paya', keys: ['paya']},
];

export interface AstroDetailItem {
  label: string;
  value: string;
}

/** Flattens one party's astro details into the ordered label/value list. */
export const normalizeAstroPartyDetails = (
  details: MatchAstroPartyDetails | null | undefined,
): AstroDetailItem[] => {
  if (!details || typeof details !== 'object') {
    return [];
  }

  const source = details as unknown as Record<string, unknown>;

  return ASTRO_DETAIL_FIELDS.reduce<AstroDetailItem[]>((items, field) => {
    for (const key of field.keys) {
      const value = toText(source[key]);
      if (value) {
        items.push({label: field.label, value});
        return items;
      }
    }
    return items;
  }, []);
};

export interface MatchAstroDetailsData {
  male: AstroDetailItem[];
  female: AstroDetailItem[];
}

export const normalizeMatchAstroDetails = (
  raw: MatchAstroDetails | null | undefined,
): MatchAstroDetailsData => {
  const response = raw && typeof raw === 'object' ? raw : {};

  return {
    male: normalizeAstroPartyDetails(response.male_astro_details),
    female: normalizeAstroPartyDetails(response.female_astro_details),
  };
};

export const isAstroDetailsEmpty = (
  data: MatchAstroDetailsData | null,
): boolean => !data || (data.male.length === 0 && data.female.length === 0);

// ============================================
// Match Obstructions (match_obstructions)
// ============================================

export interface MatchObstructionsData {
  isPresent: boolean | null;
  vedhaName: string | null;
  reportParagraphs: string[];
  report: string | null;
}

export const normalizeMatchObstructions = (
  raw: MatchObstructions | null | undefined,
): MatchObstructionsData => {
  const response = raw && typeof raw === 'object' ? raw : {};
  const report = toText(response.vedha_report);

  return {
    isPresent: toBoolean(response.is_present),
    vedhaName:
      typeof response.vedha_name === 'string'
        ? toText(response.vedha_name)
        : null,
    report,
    reportParagraphs: htmlToParagraphs(report),
  };
};

export const isMatchObstructionsEmpty = (
  data: MatchObstructionsData | null,
): boolean => {
  if (!data) {
    return true;
  }
  return data.isPresent === null && !data.report && !data.vedhaName;
};

// ============================================
// Match Ashtakoot Points (match_ashtakoot_points)
// ============================================

export interface KootaKey {
  key: keyof MatchAshtakootPoints;
  label: string;
}

/** The 8 Kootas, in the order the report renders them. */
export const KOOTA_KEYS: KootaKey[] = [
  {key: 'varna', label: 'VARNA'},
  {key: 'vashya', label: 'VASHYA'},
  {key: 'tara', label: 'TARA'},
  {key: 'yoni', label: 'YONI'},
  {key: 'maitri', label: 'MAITRI'},
  {key: 'gan', label: 'GAN'},
  {key: 'bhakut', label: 'BHAKUT'},
  {key: 'nadi', label: 'NADI'},
];

export interface KootaView extends Koota {
  key: string;
  label: string;
  maleValue: string | null;
  femaleValue: string | null;
  receivedPoints: number | null;
  totalPoints: number | null;
  description: string | null;
}

export interface AshtakootSummaryData {
  kootas: KootaView[];
  totalPoints: number | null;
  receivedPoints: number | null;
  minimumRequired: number | null;
  conclusionStatus: boolean | null;
  conclusion: string | null;
  conclusionParagraphs: string[];
}

export const normalizeMatchAshtakootPoints = (
  raw: MatchAshtakootPoints | null | undefined,
): AshtakootSummaryData => {
  const response = raw && typeof raw === 'object' ? raw : {};

  const kootas = KOOTA_KEYS.map<KootaView>(({key, label}) => {
    const koota = response[key] as Koota | null | undefined;

    return {
      key: String(key),
      label,
      maleValue: koota ? toText(koota.male_koot_attribute) : null,
      femaleValue: koota ? toText(koota.female_koot_attribute) : null,
      receivedPoints: koota ? toNumberOrNull(koota.received_points) : null,
      totalPoints: koota ? toNumberOrNull(koota.total_points) : null,
      description: koota ? toText(koota.description) : null,
    };
  });

  const conclusion = toText(response.conclusion?.report);

  return {
    kootas,
    totalPoints: toNumberOrNull(response.total?.total_points),
    receivedPoints: toNumberOrNull(response.total?.received_points),
    minimumRequired: toNumberOrNull(response.total?.minimum_required),
    conclusionStatus: toStatusFlag(response.conclusion?.status),
    conclusion,
    conclusionParagraphs: htmlToParagraphs(conclusion),
  };
};

export const isAshtakootEmpty = (
  data: AshtakootSummaryData | null,
): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.kootas.every(
      koota =>
        koota.maleValue === null &&
        koota.femaleValue === null &&
        koota.receivedPoints === null,
    ) &&
    data.totalPoints === null &&
    data.receivedPoints === null &&
    data.conclusion === null
  );
};

// ============================================
// Parallel bundle fetch
// ============================================

/** A normalised Match Making report, section by section. */
export interface MatchMakingBundle {
  report: MatchMakingReportData;
  manglik: MatchManglikReportData;
  astroDetails: MatchAstroDetailsData;
  obstructions: MatchObstructionsData;
  ashtakoot: AshtakootSummaryData;
  /** Male / female display details shown in the report header. */
  parties?: {male: MatchPartySummary; female: MatchPartySummary};
  /**
   * Per-section errors. A section that failed is null and its entry here is
   * set, so one failing endpoint never blanks the whole report.
   */
  errors: Partial<Record<MatchMakingSection, string>>;
  /** True when at least one section was populated. */
  hasAnyData: boolean;
}

export type MatchMakingSection =
  | 'report'
  | 'manglik'
  | 'astroDetails'
  | 'obstructions'
  | 'ashtakoot';

const EMPTY_BUNDLE: MatchMakingBundle = {
  report: normalizeMatchMakingReport(null),
  manglik: normalizeMatchManglikReport(null),
  astroDetails: normalizeMatchAstroDetails(null),
  obstructions: normalizeMatchObstructions(null),
  ashtakoot: normalizeMatchAshtakootPoints(null),
  errors: {},
  hasAnyData: false,
};

const errorMessageOf = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    const {message} = error as {message?: unknown};
    if (typeof message === 'string' && message.trim() !== '') {
      return message;
    }
  }
  return 'Unable to load this section of the report.';
};

/**
 * Fetches the five Match Making endpoints in parallel and returns one
 * normalised bundle.
 *
 * `Promise.allSettled` keeps a single failing endpoint from discarding the
 * other four; the failures are surfaced per section. Only a total failure
 * (every endpoint rejected) throws, so the form can show one clear error.
 */
export const fetchMatchMakingBundle = async (
  payload: MatchMakingPayload,
): Promise<MatchMakingBundle> => {
  const [report, manglik, astroDetails, obstructions, ashtakoot] =
    await Promise.allSettled([
      getMatchMakingReport(payload),
      getMatchManglikReport(payload),
      getMatchAstroDetails(payload),
      getMatchObstructions(payload),
      getMatchAshtakootPoints(payload),
    ]);

  if (
    report.status === 'rejected' &&
    manglik.status === 'rejected' &&
    astroDetails.status === 'rejected' &&
    obstructions.status === 'rejected' &&
    ashtakoot.status === 'rejected'
  ) {
    throw report.reason instanceof Error
      ? report.reason
      : new Error(errorMessageOf(report.reason));
  }

  const errors: Partial<Record<MatchMakingSection, string>> = {};
  const sectionValue = <T>(result: PromiseSettledResult<T>): T | null => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return null;
  };

  if (report.status === 'rejected') {
    errors.report = errorMessageOf(report.reason);
  }
  if (manglik.status === 'rejected') {
    errors.manglik = errorMessageOf(manglik.reason);
  }
  if (astroDetails.status === 'rejected') {
    errors.astroDetails = errorMessageOf(astroDetails.reason);
  }
  if (obstructions.status === 'rejected') {
    errors.obstructions = errorMessageOf(obstructions.reason);
  }
  if (ashtakoot.status === 'rejected') {
    errors.ashtakoot = errorMessageOf(ashtakoot.reason);
  }

  const bundle: MatchMakingBundle = {
    report: normalizeMatchMakingReport(sectionValue(report)),
    manglik: normalizeMatchManglikReport(sectionValue(manglik)),
    astroDetails: normalizeMatchAstroDetails(sectionValue(astroDetails)),
    obstructions: normalizeMatchObstructions(sectionValue(obstructions)),
    ashtakoot: normalizeMatchAshtakootPoints(sectionValue(ashtakoot)),
    errors,
    hasAnyData: false,
  };

  bundle.hasAnyData =
    !isMatchMakingReportEmpty(bundle.report) ||
    !isManglikAnalysisEmpty(bundle.manglik.male) ||
    !isManglikAnalysisEmpty(bundle.manglik.female) ||
    !isAstroDetailsEmpty(bundle.astroDetails) ||
    !isMatchObstructionsEmpty(bundle.obstructions) ||
    !isAshtakootEmpty(bundle.ashtakoot);

  return bundle;
};

export {EMPTY_BUNDLE as EMPTY_MATCH_MAKING_BUNDLE};
