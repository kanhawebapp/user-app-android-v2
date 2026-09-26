/**
 * Numerology view-model normalizer.
 *
 * Maps the eight raw numerlogy API responses (each wrapped in an AsyncResult
 * so loading / error / missing-data can be surfaced per card) into a flat list
 * of display sections for NumerologyView.
 *
 * The section order mirrors the requested UI:
 *  1. Today's Prediction (+ lucky color + lucky number)
 *  2. Destiny / Radical / Name Number
 *  3. Evil / Friendly / Neutral Numbers
 *  4. Favorite Color / God / Metal / Stone / Sub-stone / Day / Mantra
 *  5. What the Number Says About You
 *  6. Favourable Time
 *  7. Favourable Place Vastu
 *  8. Fast Vrata
 *  9. Favourable Lord
 * 10. Favourable Gayatri Mantra
 */

import type {IconProps} from '../../../components/Icon/iconType';
import type {InfoItem} from '../components/InfoCard';
import type {AsyncResult} from '../hooks/asyncTypes';
import type {
  NumeroPredictionResponse,
  NumeroTableResponse,
  NumeroTitleDescriptionResponse,
} from '../../../services/api/astrologyApi/astrology.types';

/** A single favourable-time / fav-lord / fav-mantra style report card. */
export interface NumerologyReportSection {
  kind: 'report';
  key: string;
  title: string;
  icon: IconProps;
  description: string | null;
  loading: boolean;
  error: any;
}

/** A label/value information card (numbers, favourites, lucky color…). */
export interface NumerologyInfoSection {
  kind: 'info';
  key: string;
  title: string;
  icon: IconProps;
  items: InfoItem[];
  loading: boolean;
  error: any;
}

/** The "Today's Prediction" card: a paragraph plus lucky color / number. */
export interface NumerologyPredictionSection {
  kind: 'prediction';
  key: string;
  title: string;
  icon: IconProps;
  description: string | null;
  items: InfoItem[];
  loading: boolean;
  error: any;
}

export type NumerologySection =
  | NumerologyPredictionSection
  | NumerologyInfoSection
  | NumerologyReportSection;

export interface NumerologyResponses {
  prediction: AsyncResult<NumeroPredictionResponse>;
  table: AsyncResult<NumeroTableResponse>;
  report: AsyncResult<NumeroTitleDescriptionResponse>;
  favTime: AsyncResult<NumeroTitleDescriptionResponse>;
  placeVastu: AsyncResult<NumeroTitleDescriptionResponse>;
  fastsReport: AsyncResult<NumeroTitleDescriptionResponse>;
  favLord: AsyncResult<NumeroTitleDescriptionResponse>;
  favMantra: AsyncResult<NumeroTitleDescriptionResponse>;
}

const MATERIAL = 'MaterialIcons' as const;

const reportLabel = (fallback: string, apiTitle?: string): string =>
  apiTitle || fallback;

/** Builds the full set of display sections from the eight API results. */
export const buildNumerologySections = (
  responses: NumerologyResponses,
): NumerologySection[] => {
  const prediction = responses.prediction;
  const table = responses.table;
  const report = responses.report;
  const favTime = responses.favTime;
  const placeVastu = responses.placeVastu;
  const fastsReport = responses.fastsReport;
  const favLord = responses.favLord;
  const favMantra = responses.favMantra;

  const predictionData = prediction.data;
  const tableData = table.data;

  const predictionItems: InfoItem[] = [
    {label: 'Lucky Color', value: predictionData?.lucky_color},
    {label: 'Lucky Number', value: predictionData?.lucky_number},
  ];

  const numberItems: InfoItem[] = [
    {label: 'Destiny Number', value: tableData?.destiny_number},
    {label: 'Radical Number', value: tableData?.radical_number},
    {label: 'Name Number', value: tableData?.name_number},
  ];

  const evilNeutralItems: InfoItem[] = [
    {label: 'Evil Numbers', value: tableData?.evil_num},
    {label: 'Friendly Numbers', value: tableData?.friendly_num},
    {label: 'Neutral Numbers', value: tableData?.neutral_num},
  ];

  const favoriteItems: InfoItem[] = [
    {label: 'Favorite Color', value: tableData?.fav_color},
    {label: 'Favorite God', value: tableData?.fav_god},
    {label: 'Favorite Metal', value: tableData?.fav_metal},
    {label: 'Favorite Stone', value: tableData?.fav_stone},
    {label: 'Favorite Sub-stone', value: tableData?.fav_substone},
    {label: 'Favorite Day', value: tableData?.fav_day},
    {label: 'Favorite Mantra', value: tableData?.fav_mantra},
    {label: 'Radical Ruler', value: tableData?.radical_ruler},
  ];

  const sections: NumerologySection[] = [
    {
      kind: 'prediction',
      key: 'numerology-prediction',
      title: "Today's Prediction",
      icon: {name: 'wb-sunny', library: MATERIAL},
      description: predictionData?.prediction ?? null,
      items: predictionItems,
      loading: prediction.loading,
      error: prediction.error,
    },
    {
      kind: 'info',
      key: 'numerology-numbers',
      title: 'Numbers',
      icon: {name: 'tag', library: MATERIAL},
      items: numberItems,
      loading: table.loading,
      error: table.error,
    },
    {
      kind: 'info',
      key: 'numerology-evil-neutral',
      title: 'Evil / Friendly / Neutral Numbers',
      icon: {name: 'balance', library: MATERIAL},
      items: evilNeutralItems,
      loading: table.loading,
      error: table.error,
    },
    {
      kind: 'info',
      key: 'numerology-favorites',
      title: 'Favourites',
      icon: {name: 'star', library: MATERIAL},
      items: favoriteItems,
      loading: table.loading,
      error: table.error,
    },
    {
      kind: 'report',
      key: 'numerology-report',
      title: reportLabel('What the Number Says About You', report.data?.title),
      icon: {name: 'menu-book', library: MATERIAL},
      description: report.data?.description ?? null,
      loading: report.loading,
      error: report.error,
    },
    {
      kind: 'report',
      key: 'numerology-fav-time',
      title: reportLabel('Favourable Time', favTime.data?.title),
      icon: {name: 'access-time', library: MATERIAL},
      description: favTime.data?.description ?? null,
      loading: favTime.loading,
      error: favTime.error,
    },
    {
      kind: 'report',
      key: 'numerology-place-vastu',
      title: reportLabel('Favourable Place Vastu', placeVastu.data?.title),
      icon: {name: 'house', library: MATERIAL},
      description: placeVastu.data?.description ?? null,
      loading: placeVastu.loading,
      error: placeVastu.error,
    },
    {
      kind: 'report',
      key: 'numerology-fasts',
      title: reportLabel('Fast Vrata', fastsReport.data?.title),
      icon: {name: 'festival', library: MATERIAL},
      description: fastsReport.data?.description ?? null,
      loading: fastsReport.loading,
      error: fastsReport.error,
    },
    {
      kind: 'report',
      key: 'numerology-fav-lord',
      title: reportLabel('Favourable Lord', favLord.data?.title),
      icon: {name: 'account-balance', library: MATERIAL},
      description: favLord.data?.description ?? null,
      loading: favLord.loading,
      error: favLord.error,
    },
    {
      kind: 'report',
      key: 'numerology-fav-mantra',
      title: reportLabel('Favourable Gayatri Mantra', favMantra.data?.title),
      icon: {name: 'music-note', library: MATERIAL},
      description: favMantra.data?.description ?? null,
      loading: favMantra.loading,
      error: favMantra.error,
    },
  ];

  return sections;
};

/** Returns true when a section has no content to display. */
export const isNumerologySectionEmpty = (
  section: NumerologySection,
): boolean => {
  if (section.error) {
    return false;
  }
  switch (section.kind) {
    case 'prediction':
      return !section.description && section.items.every(i => !i.value);
    case 'info':
      return section.items.every(i => !i.value);
    case 'report':
      return !section.description;
    default:
      return true;
  }
};
