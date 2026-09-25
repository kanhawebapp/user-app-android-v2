/**
 * Sade Sati data hook.
 *
 * Fetches POST /v1/sadhesati_life_details and POST /v1/sadhesati_current_status
 * in parallel once per Kundli payload (each cached keyed by endpoint + payload)
 * and combines them into a single view model.
 */

import {useMemo} from 'react';

import {
  getSadhesatiCurrentStatus,
  getSadhesatiLifeDetails,
} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  SadhesatiCurrentStatusResponse,
  SadhesatiLifeDetailsResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {
  mergeSadeSati,
  normalizeSadhesatiEvents,
  normalizeSadhesatiStatus,
  type SadhesatiPhase,
  type SadhesatiStatusData,
  type SadeSatiData,
} from '../utils/doshaReport';
import {useDoshaEndpoint, type UseFieldReturn} from './useDoshaEndpoint';

const LIFE_ENDPOINT = 'sadhesati_life_details';
const STATUS_ENDPOINT = 'sadhesati_current_status';

export const useSadeSati = (
  payload: AstrologyMuhurtaPayload | null,
): UseFieldReturn<SadeSatiData> => {
  const life = useDoshaEndpoint<SadhesatiLifeDetailsResponse, SadhesatiPhase[]>(
    LIFE_ENDPOINT,
    payload,
    getSadhesatiLifeDetails,
    normalizeSadhesatiEvents,
  );

  const status = useDoshaEndpoint<
    SadhesatiCurrentStatusResponse,
    SadhesatiStatusData | null
  >(
    STATUS_ENDPOINT,
    payload,
    getSadhesatiCurrentStatus,
    normalizeSadhesatiStatus,
  );

  const data = useMemo(
    () => mergeSadeSati(life.data ?? [], status.data),
    [life.data, status.data],
  );

  return {
    data,
    loading: life.loading || status.loading,
    error: life.error || status.error,
    reload: () => {
      life.reload();
      status.reload();
    },
  };
};
