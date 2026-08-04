import type {IconProps} from '../../../components/Icon/iconType';
import type {
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

/** Display labels for each horoscope chart variant. */
export const CHART_LABELS: Record<HoroscopeChartType, string> = {
  chalit: 'Lagna / Ascendant / Basic Birth Chart',
  D9: 'Navamsa (Prospects of Marriage)',
};

export const CHART_TYPES: HoroscopeChartType[] = ['chalit', 'D9'];

/**
 * Builds the horo_chart_image request body from the birth details already
 * collected in the Kundli form payload, avoiding a duplicated payload.
 */
export const buildHoroscopeChartPayload = (
  birthPayload: any,
): HoroscopeChartPayload => ({
  day: Number(birthPayload?.day) || 0,
  month: Number(birthPayload?.month) || 0,
  year: Number(birthPayload?.year) || 0,
  hour: Number(birthPayload?.hour) || 0,
  min: Number(birthPayload?.min) || 0,
  lat: Number(birthPayload?.lat) || 0,
  lon: Number(birthPayload?.lon) || 0,
  tzone: Number(birthPayload?.tzone) || 0,
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

  return result;
};
