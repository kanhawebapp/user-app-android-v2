/**
 * Kaal Sarp Dosha data hook. Fetches POST /v1/kalsarpa_details once per
 * Kundli payload, cached keyed by endpoint + payload.
 */

import {getKalsarpaDetails} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  KalsarpaResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {normalizeKalsarpa, type KalsarpaData} from '../utils/doshaReport';
import {useDoshaEndpoint, type UseFieldReturn} from './useDoshaEndpoint';

const ENDPOINT = 'kalsarpa_details';

export const useKalsarpa = (
  payload: AstrologyMuhurtaPayload | null,
): UseFieldReturn<KalsarpaData> =>
  useDoshaEndpoint<KalsarpaResponse, KalsarpaData>(
    ENDPOINT,
    payload,
    getKalsarpaDetails,
    normalizeKalsarpa,
  );
