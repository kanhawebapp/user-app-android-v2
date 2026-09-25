/**
 * Normalises the Kundli Dosha API responses (Manglik, Kaal Sarp, Pitra
 * Dosha and Sade Sati) into view models consumed by the dosha screens.
 *
 * The APIs return inconsistent shapes (periods, names or objects inside
 * list fields; HTML inside report strings). Every normaliser is defensive:
 * unknown or missing values become null so the UI never renders "undefined".
 */

import type {
  KalsarpaResponse,
  ManglikResponse,
  PitraDoshaResponse,
  SadhesatiCurrentStatusResponse,
  SadhesatiLifeDetailsResponse,
  SadhesatiLifeEvent,
} from '../../../services/api/astrologyApi/astrology.types';

export const toBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true' || value === 1 || value === '1') {
    return true;
  }
  if (value === 'false' || value === 0 || value === '0') {
    return false;
  }
  return null;
};

const toNullableString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

const toPercentage = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  return null;
};

/** Reads nested HTML (e.g. `<p>...</p>` blocks) into plain paragraph text. */
export const htmlToParagraphs = (value?: string | null): string[] => {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(/<\/p>/i)
    .map(part => {
      const cleaned = part
        .replace(/<p[^>]*>/gi, '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return cleaned;
    })
    .filter(paragraph => paragraph.length > 0);
};

/** Flattens string / object list fields into a displayable string list. */
export const toDisplayList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    if (typeof value === 'string' && value.trim()) {
      return [value];
    }
    return [];
  }

  return value
    .map(item => {
      if (typeof item === 'string') {
        return item.trim();
      }
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const candidate =
          record.description ??
          record.title ??
          record.name ??
          record.text ??
          Object.values(record).find(valueItem => {
            return typeof valueItem === 'string' && valueItem.trim() !== '';
          });
        return typeof candidate === 'string' ? candidate.trim() : '';
      }
      return String(item);
    })
    .filter(item => item.length > 0);
};

/** 'Yes' / 'No' / '—' badge text for an optional boolean value. */
export const presentText = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) {
    return '—';
  }
  return value ? 'Yes' : 'No';
};

/** Rounds a percentage number for display, null when not provided. */
export const formatPercent = (
  value: number | null | undefined,
): string | null => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  return `${Math.round(value)}%`;
};

/** 'EFFECTIVE', 'based_on_house' etc. → 'Effective', 'Based On House'. */
export const humanizeLabel = (
  value: string | null | undefined,
): string | null => {
  if (!value) {
    return null;
  }
  return value
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, character => character.toUpperCase());
};

// ============================================
// Manglik Dosha
// ============================================

export interface ManglikData {
  present: boolean | null;
  /** 'EFFECTIVE' | 'LESS_EFFECTIVE' (humanised for display). */
  status: string | null;
  percentage: number | null;
  percentageAfterCancellation: number | null;
  isMarsCancelled: boolean | null;
  reportParagraphs: string[];
  cancelRules: string[];
  basedOnAspect: string[];
  basedOnHouse: string[];
}

export const normalizeManglik = (
  raw: ManglikResponse | null | undefined,
): ManglikData => {
  const response = raw && typeof raw === 'object' ? raw : {};
  return {
    present: toBoolean(response.is_present),
    status: humanizeLabel(toNullableString(response.manglik_status)),
    percentage: toPercentage(response.percentage_manglik_present),
    percentageAfterCancellation: toPercentage(
      response.percentage_manglik_after_cancellation,
    ),
    isMarsCancelled: toBoolean(response.is_mars_manglik_cancelled),
    reportParagraphs: htmlToParagraphs(response.manglik_report),
    cancelRules: toDisplayList(response.manglik_cancel_rule),
    basedOnAspect: toDisplayList(
      response.manglik_present_rule?.based_on_aspect,
    ),
    basedOnHouse: toDisplayList(response.manglik_present_rule?.based_on_house),
  };
};

/** True when the response carried no usable Manglik data. */
export const isManglikEmpty = (data: ManglikData | null): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.percentage === null &&
    data.status === null &&
    data.reportParagraphs.length === 0 &&
    data.cancelRules.length === 0 &&
    data.basedOnAspect.length === 0 &&
    data.basedOnHouse.length === 0
  );
};

// ============================================
// Kaal Sarp Dosha
// ============================================

export interface KalsarpaData {
  present: boolean | null;
  type: string | null;
  name: string | null;
  oneLine: string | null;
  house: number | string | null;
  /** `report.report` HTML rendered as plain paragraphs. */
  reportParagraphs: string[];
}

export const normalizeKalsarpa = (
  raw: KalsarpaResponse | null | undefined,
): KalsarpaData => {
  const response = raw && typeof raw === 'object' ? raw : {};
  return {
    present: toBoolean(response.present),
    type: humanizeLabel(toNullableString(response.type)),
    name: toNullableString(response.name),
    oneLine: toNullableString(response.one_line),
    house: toNullableString(response.report?.house_id),
    reportParagraphs: htmlToParagraphs(response.report?.report),
  };
};

/** True when the response carried no usable Kaal Sarp data. */
export const isKalsarpaEmpty = (data: KalsarpaData | null): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.present === null &&
    !data.type &&
    !data.name &&
    !data.oneLine &&
    data.house === null &&
    data.reportParagraphs.length === 0
  );
};

// ============================================
// Pitra Dosha
// ============================================

export interface PitraDoshaData {
  present: boolean | null;
  whatIs: string | null;
  conclusion: string | null;
  rulesMatched: string[];
  effects: string[];
  remedies: string[];
}

export const normalizePitraDosha = (
  raw: PitraDoshaResponse | null | undefined,
): PitraDoshaData => {
  const response = raw && typeof raw === 'object' ? raw : {};
  return {
    present: toBoolean(
      response.is_pitri_dosha_present ?? response.is_pitra_dosha_present,
    ),
    whatIs: toNullableString(response.what_is_pitri_dosha),
    conclusion: toNullableString(response.conclusion),
    rulesMatched: toDisplayList(response.rules_matched),
    effects: toDisplayList(response.effects),
    remedies: toDisplayList(response.remedies),
  };
};

/** True when the response carried no usable Pitra Dosha data. */
export const isPitraDoshaEmpty = (data: PitraDoshaData | null): boolean => {
  if (!data) {
    return true;
  }
  return (
    !data.whatIs &&
    !data.conclusion &&
    data.rulesMatched.length === 0 &&
    data.effects.length === 0 &&
    data.remedies.length === 0
  );
};

// ============================================
// Sade Sati
// ============================================

export interface SadhesatiStatusData {
  present: boolean | null;
  moonSign: string | null;
  saturnSign: string | null;
  saturnRetrograde: boolean | null;
  /** Human sentence from the API when available. */
  isUndergoing: string | null;
  considerationDate: string | null;
  whatIs: string | null;
}

export interface SadhesatiPhase {
  key: string;
  type: string;
  /** Display label ('Rising', 'Peak', 'Setting') or '—'. */
  label: string;
  date: string;
  summary: string;
  moonSign: string | null;
  saturnSign: string | null;
  isRetrograde: boolean | null;
}

export interface SadeSatiData {
  present: boolean | null;
  currentPhase: SadhesatiPhase | null;
  /** Chronologically sorted lifecycle events. */
  phases: SadhesatiPhase[];
  moonSign: string | null;
  saturnSign: string | null;
  saturnRetrograde: boolean | null;
  isUndergoing: string | null;
  considerationDate: string | null;
  whatIs: string | null;
}

const SADHESATI_PHASE_LABELS: Record<string, string> = {
  RISING_START: 'Rising',
  RISING_END: 'Rising',
  PEAK_START: 'Peak',
  SETTING_START: 'Setting',
  SETTING_END: 'Setting',
};

export const getSadhesatiPhaseLabel = (
  type: string | null | undefined,
): string | null => {
  if (!type) {
    return null;
  }
  return SADHESATI_PHASE_LABELS[type] ?? null;
};

export const normalizeSadhesatiEvents = (
  events: SadhesatiLifeDetailsResponse | null | undefined,
): SadhesatiPhase[] => {
  if (!Array.isArray(events)) {
    return [];
  }

  return events
    .filter(
      (event): event is SadhesatiLifeEvent =>
        !!event && typeof event === 'object',
    )
    .map((event, index) => {
      const type = toNullableString(event.type) ?? '';
      return {
        key: String(
          toNullableString(event.millisecond) ??
            toNullableString(event.date) ??
            index,
        ),
        type,
        label: getSadhesatiPhaseLabel(type) ?? '—',
        date: toNullableString(event.date) ?? '',
        summary: toNullableString(event.summary) ?? '',
        moonSign: toNullableString(event.moon_sign),
        saturnSign: toNullableString(event.saturn_sign),
        isRetrograde: toBoolean(event.is_saturn_retrograde),
      };
    })
    .filter(
      phase => phase.type !== '' || (phase.date !== '' && phase.summary !== ''),
    );
};

export const normalizeSadhesatiStatus = (
  raw: SadhesatiCurrentStatusResponse | null | undefined,
): SadhesatiStatusData | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const isUndergoing = raw.is_undergoing_sadhesati;
  return {
    present: toBoolean(raw.sadhesati_status),
    moonSign: toNullableString(raw.moon_sign),
    saturnSign: toNullableString(raw.saturn_sign),
    saturnRetrograde: toBoolean(raw.is_saturn_retrograde),
    isUndergoing:
      typeof isUndergoing === 'boolean' ? null : toNullableString(isUndergoing),
    considerationDate: toNullableString(raw.consideration_date),
    whatIs: toNullableString(raw.what_is_sadhesati),
  };
};

const parseEventTimestamp = (phase: SadhesatiPhase): number => {
  const milliseconds = Number(phase.key);
  if (Number.isFinite(milliseconds)) {
    return milliseconds;
  }

  const match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(phase.date || '');
  if (match) {
    return new Date(
      Number(match[3]),
      Number(match[2]) - 1,
      Number(match[1]),
    ).getTime();
  }
  return 0;
};

/** Latest lifecycle event that has already passed (or is happening now). */
export const getCurrentSadhesatiPhase = (
  phases: SadhesatiPhase[],
): SadhesatiPhase | null => {
  const now = Date.now();
  let current: SadhesatiPhase | null = null;
  let bestTimestamp = -Infinity;

  phases.forEach(phase => {
    const timestamp = parseEventTimestamp(phase);
    if (timestamp <= now && timestamp > bestTimestamp) {
      bestTimestamp = timestamp;
      current = phase;
    }
  });

  return current;
};

const deriveSadeSatiPresent = (phases: SadhesatiPhase[]): boolean | null => {
  if (phases.length === 0) {
    return null;
  }
  const current = getCurrentSadhesatiPhase(phases);
  if (current) {
    return current.type.endsWith('_START');
  }
  // Events exist but none has started yet.
  return false;
};

/** Combines the life-details + current-status responses into one view model. */
export const mergeSadeSati = (
  phases: SadhesatiPhase[],
  status: SadhesatiStatusData | null,
): SadeSatiData => {
  const sortedPhases = [...phases].sort(
    (firstPhase, secondPhase) =>
      parseEventTimestamp(firstPhase) - parseEventTimestamp(secondPhase),
  );

  const firstValue = <K extends keyof SadhesatiPhase>(
    key: K,
  ): SadhesatiPhase[K] | null => {
    const match = sortedPhases.find(
      phase => phase[key] !== null && phase[key] !== undefined,
    );
    return match ? match[key] : null;
  };

  return {
    present: status?.present ?? deriveSadeSatiPresent(sortedPhases),
    currentPhase: getCurrentSadhesatiPhase(sortedPhases),
    phases: sortedPhases,
    moonSign: status?.moonSign ?? firstValue('moonSign'),
    saturnSign: status?.saturnSign ?? firstValue('saturnSign'),
    saturnRetrograde: status?.saturnRetrograde ?? firstValue('isRetrograde'),
    isUndergoing: status?.isUndergoing ?? null,
    considerationDate: status?.considerationDate ?? null,
    whatIs: status?.whatIs ?? null,
  };
};

/** True when the response carried no usable Sade Sati data. */
export const isSadeSatiEmpty = (data: SadeSatiData | null): boolean => {
  if (!data) {
    return true;
  }
  return (
    data.phases.length === 0 &&
    !data.whatIs &&
    !data.isUndergoing &&
    !data.considerationDate &&
    data.moonSign === null &&
    data.saturnSign === null
  );
};
