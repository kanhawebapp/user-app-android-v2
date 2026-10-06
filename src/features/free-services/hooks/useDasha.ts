/**
 * Char Dasha + Yogini Dasha data hook.
 *
 * Fetches the four Dasha endpoints in parallel, once per Kundli payload
 * (each cached keyed by endpoint + payload), and combines them into a single
 * view model. Each endpoint keeps its own error so one failed API does not
 * destroy the others' results (partial-data UX).
 */

import {useMemo, useState} from 'react';

import type {AstrologyMuhurtaPayload} from '../../../services/api/astrologyApi/astrology.types';
import {
  getCurrentCharDasha,
  getCurrentYoginiDasha,
  getMajorCharDasha,
  getMajorYoginiDasha,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  CurrentCharDashaResponse,
  CurrentYoginiDashaResponse,
  MajorCharDashaResponse,
  MajorYoginiDashaResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  DASHA_ENDPOINTS,
  normalizeCurrentCharDasha,
  normalizeCurrentYoginiDasha,
  normalizeMajorCharDasha,
  normalizeMajorYoginiDasha,
  type DashaCurrentView,
  type DashaPeriodView,
  type DashaTab,
} from '../utils/dasha';
import {useDoshaEndpoint} from './useDoshaEndpoint';

interface DashaField<T> {
  data: T;
  loading: boolean;
  error: any;
}

export interface DashaData {
  activeTab: DashaTab;
  setActiveTab: (tab: DashaTab) => void;
  majorChar: DashaField<DashaPeriodView[]>;
  currentChar: DashaField<DashaCurrentView | null>;
  majorYogini: DashaField<DashaPeriodView[]>;
  currentYogini: DashaField<DashaCurrentView | null>;
  loading: boolean;
  /** True when birth details are missing so no request is made. */
  missingDetails: boolean;
  /** Re-fetch all four endpoints, bypassing the cache. */
  reload: () => void;
}

export const useDasha = (
  payload: AstrologyMuhurtaPayload | null,
): DashaData => {
  const [activeTab, setActiveTab] = useState<DashaTab>('char');

  const majorCharEndpoint = useDoshaEndpoint<
    MajorCharDashaResponse,
    DashaPeriodView[]
  >(
    DASHA_ENDPOINTS.majorChar,
    payload,
    getMajorCharDasha,
    normalizeMajorCharDasha,
  );

  const currentCharEndpoint = useDoshaEndpoint<
    CurrentCharDashaResponse,
    DashaCurrentView | null
  >(
    DASHA_ENDPOINTS.currentChar,
    payload,
    getCurrentCharDasha,
    normalizeCurrentCharDasha,
  );

  const majorYoginiEndpoint = useDoshaEndpoint<
    MajorYoginiDashaResponse,
    DashaPeriodView[]
  >(
    DASHA_ENDPOINTS.majorYogini,
    payload,
    getMajorYoginiDasha,
    normalizeMajorYoginiDasha,
  );

  const currentYoginiEndpoint = useDoshaEndpoint<
    CurrentYoginiDashaResponse,
    DashaCurrentView | null
  >(
    DASHA_ENDPOINTS.currentYogini,
    payload,
    getCurrentYoginiDasha,
    normalizeCurrentYoginiDasha,
  );

  // useDoshaEndpoint returns `data: T | null` even when the normalized value
  // itself is a nullable type; collapse the flag into a concrete default.
  const data = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      majorChar: {
        data: majorCharEndpoint.data ?? [],
        loading: majorCharEndpoint.loading,
        error: majorCharEndpoint.error,
      },
      currentChar: {
        data: currentCharEndpoint.data as DashaCurrentView | null,
        loading: currentCharEndpoint.loading,
        error: currentCharEndpoint.error,
      },
      majorYogini: {
        data: majorYoginiEndpoint.data ?? [],
        loading: majorYoginiEndpoint.loading,
        error: majorYoginiEndpoint.error,
      },
      currentYogini: {
        data: currentYoginiEndpoint.data as DashaCurrentView | null,
        loading: currentYoginiEndpoint.loading,
        error: currentYoginiEndpoint.error,
      },
      loading:
        majorCharEndpoint.loading ||
        currentCharEndpoint.loading ||
        majorYoginiEndpoint.loading ||
        currentYoginiEndpoint.loading,
      missingDetails: !payload,
      reload: () => {
        majorCharEndpoint.reload();
        currentCharEndpoint.reload();
        majorYoginiEndpoint.reload();
        currentYoginiEndpoint.reload();
      },
    }),
    [
      activeTab,
      majorCharEndpoint,
      currentCharEndpoint,
      majorYoginiEndpoint,
      currentYoginiEndpoint,
      payload,
    ],
  );

  return data;
};
