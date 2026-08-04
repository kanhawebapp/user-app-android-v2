import type {IconProps} from '../../../components/Icon/iconType';
import type {GeneralNakshatraReportResponse} from '../../../services/api/astrologyApi/astrology.types';

/** One displayed section of the General Life Prediction report. */
export interface LifePredictionSection {
  key: 'physical' | 'character' | 'education' | 'family' | 'health';
  title: string;
  icon: IconProps;
  /** Paragraphs of this section, each rendered as a bullet point. */
  paragraphs: string[];
}

export interface GeneralLifePredictionData {
  sections: LifePredictionSection[];
}

/** Display order + titles/icons for every report section. */
export const GENERAL_LIFE_SECTIONS: LifePredictionSection[] = [
  {
    key: 'physical',
    title: 'Physical',
    icon: {name: 'accessibility', library: 'MaterialIcons'},
    paragraphs: [],
  },
  {
    key: 'character',
    title: 'Character',
    icon: {name: 'person', library: 'MaterialIcons'},
    paragraphs: [],
  },
  {
    key: 'education',
    title: 'Education',
    icon: {name: 'school', library: 'MaterialIcons'},
    paragraphs: [],
  },
  {
    key: 'family',
    title: 'Family',
    icon: {name: 'home', library: 'MaterialIcons'},
    paragraphs: [],
  },
  {
    key: 'health',
    title: 'Health',
    icon: {name: 'favorite', library: 'MaterialIcons'},
    paragraphs: [],
  },
];

const asParagraphList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0,
    );
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }
  return [];
};

/** Resolves a section value case-insensitively (physical / Physical / ...). */
const getSectionValue = (
  source: Record<string, unknown>,
  key: string,
): unknown => {
  if (source[key] !== undefined) {
    return source[key];
  }
  const upper = key.charAt(0).toUpperCase() + key.slice(1);
  if (source[upper] !== undefined) {
    return source[upper];
  }
  const match = Object.keys(source).find(k => k.toLowerCase() === key);
  return match ? source[match] : undefined;
};

/**
 * Normalises the general_nakshatra_report response into an ordered list of
 * sections (Physical, Character, Education, Family, Health). Missing
 * sections keep an empty paragraphs array so the UI can render an empty state.
 */
export const normalizeGeneralLifePrediction = (
  response: GeneralNakshatraReportResponse | null | undefined,
): GeneralLifePredictionData => {
  const source = (response || {}) as Record<string, unknown>;

  return {
    sections: GENERAL_LIFE_SECTIONS.map(section => ({
      ...section,
      paragraphs: asParagraphList(getSectionValue(source, section.key)),
    })),
  };
};

/** Returns true when every section of the report is empty. */
export const isGeneralLifePredictionEmpty = (
  data: GeneralLifePredictionData | null,
): boolean =>
  !data || data.sections.every(section => section.paragraphs.length === 0);
