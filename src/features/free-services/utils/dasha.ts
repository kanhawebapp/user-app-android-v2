/**
 * Char Dasha + Yogini Dasha helpers.
 *
 * Both dashas share the same Kundli birth-details payload and follow the same
 * report pattern: a sequential major period list plus the currently running
 * major/sub/sub-sub breakdown. The API date strings (e.g. `16-8-2015`,
 * `9-11-2000 5:9`) are normalized through the existing safe formatter
 * (`formatDashaDateTime`) which never applies timezone shifting.
 */

import type {
  AstrologyMuhurtaPayload,
  CurrentCharDashaResponse,
  CurrentYoginiDashaResponse,
  DashaCharPeriod,
  DashaYoginiPeriod,
  MajorCharDashaResponse,
  MajorYoginiDashaResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {resolveBirthDetailsPayload} from './birthDetails';
import {formatDashaDateTime} from './kundliService';

export type DashaTab = 'char' | 'yogini';

export interface DashaTabOption {
  key: DashaTab;
  label: string;
}

export const DASHA_TABS: DashaTabOption[] = [
  {key: 'char', label: 'Char Dasha'},
  {key: 'yogini', label: 'Yogini Dasha'},
];

export const DASHA_ENDPOINTS: Record<
  'majorChar' | 'currentChar' | 'majorYogini' | 'currentYogini',
  string
> = {
  majorChar: 'major_chardasha',
  currentChar: 'current_chardasha',
  majorYogini: 'major_yogini_dasha',
  currentYogini: 'current_yogini_dasha',
};

export const isDashaTab = (value: string): value is DashaTab =>
  value === 'char' || value === 'yogini';

/** Renders an API duration (raw string or numeric years) for display. */
export const toDashaDurationText = (
  duration?: string | number | null,
): string => {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return `${duration} ${duration === 1 ? 'Year' : 'Years'}`;
  }
  if (typeof duration === 'string') {
    const trimmed = duration.trim();
    if (trimmed && trimmed !== '-') {
      return trimmed;
    }
  }
  return '—';
};

/**
 * A single rendered period. `name` is the sign name (Char Dasha) or the
 * Yogini name, while the remaining fields are display-safe strings.
 */
export interface DashaPeriodView {
  key: string;
  name: string;
  duration: string;
  startDate: string;
  endDate: string;
}

/** A "current dasha" breakdown (major/sub/sub-sub). */
export interface DashaCurrentView {
  dashaDate: string | null;
  major: DashaPeriodView | null;
  sub: DashaPeriodView | null;
  /** Sub-sub periods — always a list after normalization. */
  subSub: DashaPeriodView[];
}

export interface DashaInfoItem {
  label: string;
  value: string;
}

/**
 * InfoCard-safe rows for a period. The Duration row is omitted when the API
 * did not return one so missing values never render as placeholders.
 */
export const toDashaInfoItems = (period: DashaPeriodView): DashaInfoItem[] => {
  const items: DashaInfoItem[] = [];
  if (period.duration !== '—') {
    items.push({label: 'Duration', value: period.duration});
  }
  items.push({label: 'Start Date', value: period.startDate});
  items.push({label: 'End Date', value: period.endDate});
  return items;
};

/** Same rows as `toDashaInfoItems` but with the period name first. */
export const toNamedDashaInfoItems = (
  period: DashaPeriodView,
  nameLabel: string,
): DashaInfoItem[] => [
  {label: nameLabel, value: period.name},
  ...toDashaInfoItems(period),
];

/** Coerces a nullable API date into the formatter's accepted input. */
const toDateValue = (value?: string | null): string | undefined =>
  value ?? undefined;

const toCharPeriodView = (
  period: DashaCharPeriod | null | undefined,
  index: number,
  prefix: string,
): DashaPeriodView | null => {
  if (!period) {
    return null;
  }
  const name =
    typeof period.sign_name === 'string' && period.sign_name.trim()
      ? period.sign_name.trim()
      : `Sign ${Number(period.sign_id) || index + 1}`;
  return {
    key: `${prefix}-${period.sign_id ?? index}`,
    name,
    duration: toDashaDurationText(period.duration),
    startDate: formatDashaDateTime(toDateValue(period.start_date)),
    endDate: formatDashaDateTime(toDateValue(period.end_date)),
  };
};

const toYoginiPeriodView = (
  period: DashaYoginiPeriod | null | undefined,
  index: number,
  prefix: string,
): DashaPeriodView | null => {
  if (!period) {
    return null;
  }
  const name =
    typeof period.dasha_name === 'string' && period.dasha_name.trim()
      ? period.dasha_name.trim()
      : `Dasha ${Number(period.dasha_id) || index + 1}`;
  return {
    key: `${prefix}-${period.dasha_id ?? index}`,
    name,
    duration: toDashaDurationText(period.duration),
    startDate: formatDashaDateTime(toDateValue(period.start_date)),
    endDate: formatDashaDateTime(toDateValue(period.end_date)),
  };
};

/** POST /v1/major_chardasha — every major Char Dasha period sequentially. */
export const normalizeMajorCharDasha = (
  raw: MajorCharDashaResponse | null | undefined,
): DashaPeriodView[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((period, index) => toCharPeriodView(period, index, 'maj-char'))
    .filter((period): period is DashaPeriodView => period !== null);
};

/** POST /v1/current_chardasha — running Char Dasha breakdown. */
export const normalizeCurrentCharDasha = (
  raw: CurrentCharDashaResponse | null | undefined,
): DashaCurrentView | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const subSub = Array.isArray(raw.sub_sub_dasha)
    ? raw.sub_sub_dasha
        .map((period, index) => toCharPeriodView(period, index, 'sub-char'))
        .filter((period): period is DashaPeriodView => period !== null)
    : [];
  return {
    dashaDate: raw.dasha_date ? formatDashaDateTime(raw.dasha_date) : null,
    major: toCharPeriodView(raw.major_dasha, 0, 'maj-char'),
    sub: toCharPeriodView(raw.sub_dasha, 0, 'sub-char'),
    subSub,
  };
};

/** POST /v1/major_yogini_dasha — every major Yogini Dasha period. */
export const normalizeMajorYoginiDasha = (
  raw: MajorYoginiDashaResponse | null | undefined,
): DashaPeriodView[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((period, index) => toYoginiPeriodView(period, index, 'maj-yog'))
    .filter((period): period is DashaPeriodView => period !== null);
};

/** POST /v1/current_yogini_dasha — running Yogini Dasha breakdown. */
export const normalizeCurrentYoginiDasha = (
  raw: CurrentYoginiDashaResponse | null | undefined,
): DashaCurrentView | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  // NOTE: Yogini's sub_sub_dasha is a single object (unlike Char Dasha's array).
  const subSub = toYoginiPeriodView(raw.sub_sub_dasha, 0, 'sub-yog');
  return {
    dashaDate: null,
    major: toYoginiPeriodView(raw.major_dasha, 0, 'maj-yog'),
    sub: toYoginiPeriodView(raw.sub_dasha, 0, 'sub-yog'),
    subSub: subSub ? [subSub] : [],
  };
};

/** Maps the stored Kundli birth details onto the Dasha API payload. */
export const resolveDashaInput = (
  result: any,
): AstrologyMuhurtaPayload | null => resolveBirthDetailsPayload(result);
