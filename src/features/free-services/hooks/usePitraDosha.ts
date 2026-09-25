/**
 * Pitra Dosha data hook. Fetches POST /v1/pitra_dosha_report once per
 * Kundli payload, cached keyed by endpoint + payload.
 */

import {getPitraDoshaReport} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  PitraDoshaResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {normalizePitraDosha, type PitraDoshaData} from '../utils/doshaReport';
import {useDoshaEndpoint, type UseFieldReturn} from './useDoshaEndpoint';

const ENDPOINT = 'pitra_dosha_report';

export const usePitraDosha = (
  payload: AstrologyMuhurtaPayload | null,
): UseFieldReturn<PitraDoshaData> =>
  useDoshaEndpoint<PitraDoshaResponse, PitraDoshaData>(
    ENDPOINT,
    payload,
    getPitraDoshaReport,
    normalizePitraDosha,
  );
