/**
 * Sade Sati data hook.
 *
 * Fetches POST /v1/sadhesati_life_details, POST /v1/sadhesati_current_status
 * and POST /v1/sadhesati_remedies in parallel once per Kundli payload (each
 * cached keyed by endpoint + language + payload). Switching tabs never
 * triggers a new request; reload re-fetches the active tab (or all three).
 */

import {useCallback, useMemo, useState} from 'react';

import {
  getSadhesatiCurrentStatus,
  getSadhesatiLifeDetails,
  getSadhesatiRemedies,
  resolveAstrologyLanguage,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  SadhesatiCurrentStatusResponse,
  SadhesatiLifeDetailsResponse,
  SadhesatiRemediesResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {useAppStore} from '../../../stores/app.store';
import {
  isSadeSatiTab,
  mergeSadeSati,
  normalizeSadhesatiEvents,
  normalizeSadhesatiRemedies,
  normalizeSadhesatiStatus,
  type SadhesatiPhase,
  type SadhesatiRemediesData,
  type SadhesatiStatusData,
  type SadeSatiData,
  type SadeSatiTab,
} from '../utils/doshaReport';
import {useDoshaEndpoint, type UseFieldReturn} from './useDoshaEndpoint';

export interface UseSadeSatiOptions {
  /**
   * When false, skips the remedies endpoint (used by the Dosha list, which
   * only needs presence from status + life details). Defaults to true.
   */
  includeRemedies?: boolean;
}

export interface UseSadeSatiReturn extends UseFieldReturn<SadeSatiData> {
  activeTab: SadeSatiTab;
  setActiveTab: (tab: SadeSatiTab) => void;
  /** Loading state for the currently selected tab only. */
  tabLoading: boolean;
  /** Error for the currently selected tab only. */
  tabError: any;
  /** Re-fetch the active tab (or all tabs when omitted), bypassing cache. */
  reloadTab: (tab?: SadeSatiTab) => void;
}

export const useSadeSati = (
  payload: AstrologyMuhurtaPayload | null,
  options: UseSadeSatiOptions = {},
): UseSadeSatiReturn => {
  const includeRemedies = options.includeRemedies !== false;
  const language = useAppStore(state => state.language);
  const languageKey = resolveAstrologyLanguage(language);

  const [activeTab, setActiveTabState] = useState<SadeSatiTab>('status');

  const setActiveTab = useCallback((tab: SadeSatiTab) => {
    if (isSadeSatiTab(tab)) {
      setActiveTabState(tab);
    }
  }, []);

  const life = useDoshaEndpoint<SadhesatiLifeDetailsResponse, SadhesatiPhase[]>(
    `sadhesati_life_details:${languageKey}`,
    payload,
    getSadhesatiLifeDetails,
    normalizeSadhesatiEvents,
  );

  const status = useDoshaEndpoint<
    SadhesatiCurrentStatusResponse,
    SadhesatiStatusData | null
  >(
    `sadhesati_current_status:${languageKey}`,
    payload,
    getSadhesatiCurrentStatus,
    normalizeSadhesatiStatus,
  );

  const remedies = useDoshaEndpoint<
    SadhesatiRemediesResponse,
    SadhesatiRemediesData | null
  >(
    `sadhesati_remedies:${languageKey}`,
    payload,
    getSadhesatiRemedies,
    normalizeSadhesatiRemedies,
    includeRemedies,
  );

  const data = useMemo(
    () => mergeSadeSati(life.data ?? [], status.data, remedies.data),
    [life.data, status.data, remedies.data],
  );

  const tabLoading =
    activeTab === 'status'
      ? status.loading
      : activeTab === 'remedies'
        ? remedies.loading
        : life.loading;

  const tabError =
    activeTab === 'status'
      ? status.error
      : activeTab === 'remedies'
        ? remedies.error
        : life.error;

  const reloadTab = useCallback(
    (tab?: SadeSatiTab) => {
      const target = tab ?? activeTab;
      if (target === 'status') {
        status.reload();
        return;
      }
      if (target === 'remedies') {
        remedies.reload();
        return;
      }
      life.reload();
    },
    [activeTab, life, remedies, status],
  );

  const reload = useCallback(() => {
    status.reload();
    remedies.reload();
    life.reload();
  }, [life, remedies, status]);

  return {
    data,
    loading: life.loading || status.loading || remedies.loading,
    error: life.error || status.error || remedies.error,
    reload,
    activeTab,
    setActiveTab,
    tabLoading,
    tabError,
    reloadTab,
  };
};
