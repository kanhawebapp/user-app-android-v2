import type {IconProps} from '../../../components/Icon/iconType';
import type {
  AstrologyMuhurtaPayload,
  BaseChartType,
  HoroscopeChartPayload,
  HoroscopeChartType,
} from '../../../services/api/astrologyApi/astrology.types';

export interface KundliCard {
  name: string;
  named: string;
}

export const kundliCards: KundliCard[] = [
  {
    name: 'Birth Chart / Kundli',
    named: 'Planet positions & various charts',
  },
  {
    name: 'General Life Prediction',
    named: 'Get to know about your nature',
  },
  {
    name: 'Dosha in Kundli',
    named: 'Do you have any Kundli Dosh?',
  },
  {
    name: 'Match Horoscope',
    named: 'Kundli Milan (Guna Milan)',
  },
  {
    name: 'Numerology',
    named: 'Your Lucky number is...',
  },
  {
    name: 'My Day Today',
    named: 'Get predictions about the day',
  },
  {
    name: 'Nakshatra',
    named: 'Get to know about your Nakshatra',
  },
  {
    name: 'Lal Kitab Horoscope',
    named: 'Get your Life Report as PDF',
  },
  {
    name: 'Sade Sati',
    named: 'How Sade Sati affects you?',
  },
  {
    name: 'Suggestions and Remedies',
    named: 'Free Remedies Suggestion Report',
  },
  {
    name: 'Ascendant Report',
    named: 'Get your Life Report as PDF',
  },
  {
    name: 'Char / Yogini Dasha',
    named: 'Timing events based on planets',
  },
];

export const getKundliCardIcon = (name: string): IconProps => {
  const normalized = name.toLowerCase();

  if (normalized.includes('birth chart') || normalized.includes('kundli')) {
    return {name: 'donut-large', library: 'MaterialIcons'};
  }
  if (normalized.includes('life prediction')) {
    return {name: 'psychology', library: 'MaterialIcons'};
  }
  if (normalized.includes('dosha')) {
    return {name: 'warning', library: 'MaterialIcons'};
  }
  if (normalized.includes('match')) {
    return {name: 'favorite', library: 'MaterialIcons'};
  }
  if (normalized.includes('numerology')) {
    return {name: 'tag', library: 'MaterialIcons'};
  }
  if (normalized.includes('my day')) {
    return {name: 'wb-sunny', library: 'MaterialIcons'};
  }
  if (normalized.includes('nakshatra')) {
    return {name: 'stars', library: 'MaterialIcons'};
  }
  if (normalized.includes('lal kitab')) {
    return {name: 'menu-book', library: 'MaterialIcons'};
  }
  if (normalized.includes('sade sati')) {
    return {name: 'tune', library: 'MaterialIcons'};
  }
  if (normalized.includes('suggestions') || normalized.includes('remedies')) {
    return {name: 'spa', library: 'MaterialIcons'};
  }
  if (normalized.includes('ascendant')) {
    return {name: 'trending-up', library: 'MaterialIcons'};
  }
  if (normalized.includes('dasha')) {
    return {name: 'timeline', library: 'MaterialIcons'};
  }

  return {name: 'auto-awesome', library: 'MaterialIcons'};
};

export const isKundliService = (title: string): boolean => {
  const normalizedTitle = title?.toLowerCase() || '';
  return (
    normalizedTitle === 'kundli' ||
    normalizedTitle.includes('kundli') ||
    normalizedTitle.includes('kundali')
  );
};

/** Display labels for the base charts shown on the Basic and Planets tabs. */
export const CHART_LABELS: Record<BaseChartType, string> = {
  chalit: 'Lagna / Ascendant / Basic Birth Chart',
  D9: 'Navamsa (Prospects of Marriage)',
};

export const CHART_TYPES: BaseChartType[] = ['chalit', 'D9'];

/** One entry of the Divisional Charts tab (excludes `chalit`). */
export interface DivisionalChart {
  chartId: Exclude<HoroscopeChartType, 'chalit'>;
  title: string;
}

/** All divisional (Varga) charts rendered on the Divisional Charts tab. */
export const DIVISIONAL_CHARTS: DivisionalChart[] = [
  {chartId: 'SUN', title: 'Sun Chart'},
  {chartId: 'MOON', title: 'Moon Chart'},
  {chartId: 'D1', title: 'Birth Chart'},
  {chartId: 'D2', title: 'Hora Chart'},
  {chartId: 'D3', title: 'Dreshkan Chart'},
  {chartId: 'D4', title: 'Chaturthamasha Chart'},
  {chartId: 'D5', title: 'Panchmansha Chart'},
  {chartId: 'D7', title: 'Saptamansha Chart'},
  {chartId: 'D8', title: 'Ashtamansha Chart'},
  {chartId: 'D9', title: 'Navamansha Chart'},
  {chartId: 'D10', title: 'Dashamansha Chart'},
  {chartId: 'D12', title: 'Dwadashamsha Chart'},
  {chartId: 'D16', title: 'Shodashamsha Chart'},
  {chartId: 'D20', title: 'Vishamansha Chart'},
  {chartId: 'D24', title: 'Chaturvimshamsha Chart'},
  {chartId: 'D27', title: 'Bhamsha Chart'},
  {chartId: 'D30', title: 'Trishamansha Chart'},
  {chartId: 'D40', title: 'Khavedamsha Chart'},
  {chartId: 'D45', title: 'Akshvedansha Chart'},
  {chartId: 'D60', title: 'Shashtymsha Chart'},
];

const toBirthNumber = (value: unknown, fallback = 0): number =>
  Number(value) || fallback;

/**
 * Builds the plain birth-details payload shared by every Kundli API
 * (birth_details, basic_panchang, astro_details, planets, major_vdasha)
 * from the birth details already collected in the Kundli form.
 */
export const buildBasicDetailsPayload = (
  birthPayload: any,
): AstrologyMuhurtaPayload => ({
  day: toBirthNumber(birthPayload?.day),
  month: toBirthNumber(birthPayload?.month),
  year: toBirthNumber(birthPayload?.year),
  hour: toBirthNumber(birthPayload?.hour),
  min: toBirthNumber(birthPayload?.min),
  lat: toBirthNumber(birthPayload?.lat),
  lon: toBirthNumber(birthPayload?.lon),
  tzone: toBirthNumber(birthPayload?.tzone),
});

/**
 * Builds the horo_chart_image request body from the birth details already
 * collected in the Kundli form payload, avoiding a duplicated payload.
 */
export const buildHoroscopeChartPayload = (
  birthPayload: any,
): HoroscopeChartPayload => ({
  ...buildBasicDetailsPayload(birthPayload),
  planetColor: '#ff0000',
  signColor: '#ff0000',
  lineColor: '#ff0000',
  chartType: 'north',
  image_type: 'svg',
});

/** Returns true when the tapped kundli card is the "Birth Chart / Kundli" card. */
export const isBirthChartCard = (name: string): boolean =>
  (name || '').toLowerCase().includes('birth chart');

/**
 * Extracts the aspect ratio (width / height) from an SVG string's viewBox.
 * Used to size the rendered chart responsively. Returns null when unknown.
 */
export const getSvgAspectRatio = (svg: string): number | null => {
  const match = svg?.match(
    /viewBox\s*=\s*["']\s*[-0-9.]+[\s,]+[-0-9.]+[\s,]+([-0-9.]+)[\s,]+([-0-9.]+)\s*["']/i,
  );
  if (!match) {
    return null;
  }

  const width = parseFloat(match[1]);
  const height = parseFloat(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return width / height;
};

// ============================================
// Kundli SVG beautification
// ============================================

/** Distinct colour per planet abbreviation. */
export const PLANET_COLOR_MAP: Record<string, string> = {
  Su: '#ff6f00',
  Mo: '#800080',
  Ma: '#ff00fe',
  Me: '#0000ff',
  Ve: '#034804',
  Sa: '#a52a2a',
  Ju: '#aa00ff',
  Ra: '#f44336',
  Ke: '#008000',
  Ur: '#ff1f1f',
};

/** Chart abbreviation per planet name (e.g. "Sun" -> "Su"). */
const PLANET_ABBREVIATIONS: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
  Lagna: 'La',
};

/** Returns the two-letter chart abbreviation for a planet name. */
export const getPlanetAbbreviation = (name?: string): string => {
  if (name) {
    const abbreviation = PLANET_ABBREVIATIONS[name];
    if (abbreviation) {
      return abbreviation;
    }
  }
  const fallback = name?.slice(0, 2);
  return fallback ? fallback.charAt(0).toUpperCase() + fallback.charAt(1) : '?';
};

/** Returns the brand colour used for a planet across charts and cards. */
export const getPlanetColor = (name?: string): string =>
  PLANET_COLOR_MAP[getPlanetAbbreviation(name)] || '#5B2CA5';

/** Distinct colour per zodiac house number. */
export const ZODIAC_COLOR_MAP: Record<number, string> = {
  1: '#ff0000',
  2: '#827717',
  3: '#0000ff',
  4: '#c51162',
  5: '#ff00ff',
  6: '#f57c00',
  7: '#800000',
  8: '#008000',
  9: '#000080',
  10: '#ffa500',
  11: '#a52a2a',
  12: '#800080',
};

/** Soft light background behind the chart. */
const CHART_BACKGROUND = '#f1ebffb3';
/** Stroke colour for the chart lines. */
const CHART_LINE_STROKE = '#FFA500';
/** Consistent line thickness. */
const CHART_LINE_STROKE_WIDTH = 1.5;
/** Planet label font size. */
const CHART_PLANET_FONT_SIZE = 15;
/** Zodiac number font size. */
const CHART_NUMBER_FONT_SIZE = 14;
/** Fallback canvas size when the SVG has no explicit dimensions. */
const DEFAULT_SVG_SIZE = 350;

/**
 * Result cache for beautifyKundliSvg, keyed by the raw SVG string. The
 * beautification is pure, so the same input always yields the same output.
 * Caching avoids re-running the (expensive) regex rewriting on every render,
 * which matters when a chart is re-shown after a tab switch.
 */
const SVG_BEAUTIFY_CACHE = new Map<string, string>();
/** Upper bound on cached SVGs so the map cannot grow unboundedly. */
const SVG_BEAUTIFY_CACHE_LIMIT = 50;

/** Clears the SVG beautify cache (mainly used by tests). */
export const clearSvgBeautifyCache = (): void => {
  SVG_BEAUTIFY_CACHE.clear();
};

/**
 * Enhances a raw Kundli chart SVG string for a consistent, premium look.
 *
 * - Rewrites the root tag: drops fixed width/height, adds a `viewBox` so the
 *   chart scales responsively to any screen size.
 * - Inserts a rounded soft-coloured background that acts as the card padding.
 * - Applies a clean, consistent stroke to all chart lines.
 * - Re-colours planet and zodiac number labels and adjusts their font.
 *
 * The chart geometry is never touched: every `<path>` keeps its original
 * coordinates and every `<text>` keeps its exact `x`/`y` from the API. No
 * `dx`, `dy`, `transform`, or `text-anchor` is added, so the chart renders
 * identically to the API output with only its colours and fonts upgraded.
 *
 * All Kundli chart types (Chalit, D9, D10, D12, ...) should be passed through
 * this helper before rendering.
 */
export const beautifyKundliSvg = (svg: string): string => {
  if (!svg || typeof svg !== 'string' || svg.trim().length === 0) {
    return svg;
  }

  const cached = SVG_BEAUTIFY_CACHE.get(svg);
  if (cached) {
    return cached;
  }

  const svgTagMatch = svg.match(/<svg\b[^>]*>/);
  if (!svgTagMatch) {
    return svg;
  }

  const svgTag = svgTagMatch[0];

  // Already beautified (contains a viewBox) — avoid double-processing.
  if (svgTag.includes('viewBox')) {
    return svg;
  }

  const width =
    parseFloat(svgTag.match(/width=["'](\d+(?:\.\d+)?)["']/)?.[1] ?? '') ||
    DEFAULT_SVG_SIZE;
  const height =
    parseFloat(svgTag.match(/height=["'](\d+(?:\.\d+)?)["']/)?.[1] ?? '') ||
    DEFAULT_SVG_SIZE;

  // Responsive root: remove fixed dimensions, expose the drawing via viewBox.
  const responsiveTag = svgTag
    .replace(/\s*width=["'][^"']*["']/, '')
    .replace(/\s*height=["'][^"']*["']/, '')
    .replace(/>$/, ` viewBox="0 0 ${width} ${height}">`);

  // Rounded soft background behind the chart.
  const background = `<rect x="0" y="0" width="${width}" height="${height}" rx="12" ry="12" fill="${CHART_BACKGROUND}"></rect>`;

  let result = svg.replace(svgTag, `${responsiveTag}${background}`);

  // Normalise every chart line. Each path keeps its geometry (`d`) untouched
  // and is guaranteed to carry the stroke colour, thickness and fill, so no
  // border or house-divider line can be lost or left with a stale colour.
  result = result.replace(/<path\b[^>]*>/g, pathTag => {
    const pathBody = pathTag
      .replace(/\s+stroke-width="[^"]*"/g, '')
      .replace(/\s+stroke="[^"]*"/g, '')
      .replace(/\s+fill="[^"]*"/g, '')
      .replace(/\s*\/?\s*>$/, '');
    return `${pathBody} stroke="${CHART_LINE_STROKE}" stroke-width="${CHART_LINE_STROKE_WIDTH}" fill="none">`;
  });

  // Restyle labels only. Original `x`/`y` (and every other attribute) are
  // preserved exactly as returned by the API; only the font and colour change.
  result = result.replace(
    /<text\b([^>]*)>([^<]*)<\/text>/g,
    (_match, attrs: string, content: string) => {
      const label = content.trim();
      const isPlanet = Boolean(PLANET_COLOR_MAP[label]);
      const fill =
        PLANET_COLOR_MAP[label] || ZODIAC_COLOR_MAP[Number(label)] || '#111827';
      const fontSize = isPlanet
        ? CHART_PLANET_FONT_SIZE
        : CHART_NUMBER_FONT_SIZE;

      const newAttrs = attrs
        .replace(/font-size="[^"]*"/g, '')
        .replace(/\s*style="[^"]*"/g, '')
        .trim();

      return `<text${
        newAttrs ? ` ${newAttrs}` : ''
      } font-size="${fontSize}" style="fill: ${fill}; font-weight: 600;">${label}</text>`;
    },
  );

  if (SVG_BEAUTIFY_CACHE.size >= SVG_BEAUTIFY_CACHE_LIMIT) {
    const oldestKey = SVG_BEAUTIFY_CACHE.keys().next().value;
    if (oldestKey) {
      SVG_BEAUTIFY_CACHE.delete(oldestKey);
    }
  }
  SVG_BEAUTIFY_CACHE.set(svg, result);

  return result;
};

// ============================================
// Display formatters
// ============================================

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

const pad2 = (value: number): string => String(value).padStart(2, '0');

/**
 * Formats a dasha date string from the major_vdasha API
 * (e.g. `2-5-1994  14:7`) into `02 May 1994, 02:07 PM`.
 * Returns the raw value (or a dash) when the format is unexpected.
 */
export const formatDashaDateTime = (value?: string): string => {
  if (!value) {
    return '—';
  }

  const [datePart, timePart] = String(value).trim().split(/\s+/);
  const dateMatch = datePart?.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  const timeMatch = timePart?.match(/^(\d{1,2}):(\d{1,2})$/);

  if (!dateMatch) {
    return String(value);
  }

  const [, day, month, year] = dateMatch;
  const monthName = MONTH_NAMES[Number(month) - 1] || month;

  if (!timeMatch) {
    return `${pad2(Number(day))} ${monthName} ${year}`;
  }

  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${pad2(Number(day))} ${monthName} ${year}, ${pad2(hour)}:${pad2(
    minute,
  )} ${meridiem}`;
};

/** Parses a dasha date string (e.g. `2-5-1994  14:7`) into a local Date. */
const parseDashaDateTime = (value?: string): Date | null => {
  if (!value) {
    return null;
  }
  const [datePart, timePart] = String(value).trim().split(/\s+/);
  const dateMatch = datePart?.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!dateMatch) {
    return null;
  }
  const timeMatch = timePart?.match(/^(\d{1,2}):(\d{1,2})$/);
  const [, day, month, year] = dateMatch;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    timeMatch?.[1] ? Number(timeMatch[1]) : 0,
    timeMatch?.[2] ? Number(timeMatch[2]) : 0,
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Calendar difference between two dasha dates. */
export interface DashaDuration {
  years: number;
  months: number;
  days: number;
}

/**
 * Computes the years/months/days between two dasha dates. Returns null when
 * either date is unparseable or the end precedes the start.
 */
export const getDashaDuration = (
  start?: string,
  end?: string,
): DashaDuration | null => {
  const startDate = parseDashaDateTime(start);
  const endDate = parseDashaDateTime(end);
  if (!startDate || !endDate || endDate.getTime() < startDate.getTime()) {
    return null;
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {years, months, days};
};

/**
 * Human-readable duration between two dasha dates
 * (e.g. `2-5-1994 14:7` -> `2-5-2001 8:7` => `7 years`).
 */
export const formatDashaDuration = (start?: string, end?: string): string => {
  const duration = getDashaDuration(start, end);
  if (!duration) {
    return '—';
  }

  const parts: string[] = [];
  if (duration.years) {
    parts.push(`${duration.years} ${duration.years === 1 ? 'year' : 'years'}`);
  }
  if (duration.months) {
    parts.push(
      `${duration.months} ${duration.months === 1 ? 'month' : 'months'}`,
    );
  }
  if (duration.days) {
    parts.push(`${duration.days} ${duration.days === 1 ? 'day' : 'days'}`);
  }
  if (parts.length === 0) {
    return '0 days';
  }
  return parts.join(', ');
};

/** Formats a degree value (e.g. `12.1895`) as `12.19°`. */
export const formatPlanetDegree = (value?: number | string): string => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '—';
  }
  return `${numeric.toFixed(2)}°`;
};

/** Formats a planet speed as `0.95°/day` (negative values stay negative). */
export const formatPlanetSpeed = (value?: number | string): string => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '—';
  }
  return `${numeric.toFixed(2)}°/day`;
};

/**
 * Converts any API value into a display-safe string: booleans become
 * Yes/No and missing values become a dash.
 */
export const toDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
};
