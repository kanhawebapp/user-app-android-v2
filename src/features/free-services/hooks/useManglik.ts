/**
 * Manglik Dosha data hook. Fetches POST /v1/manglik once per Kundli payload,
 * cached keyed by endpoint + payload.
 */

import {getManglik} from '../../../services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  ManglikResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {normalizeManglik, type ManglikData} from '../utils/doshaReport';
import {useDoshaEndpoint, type UseFieldReturn} from './useDoshaEndpoint';

const ENDPOINT = 'manglik';

export const useManglik = (
  payload: AstrologyMuhurtaPayload | null,
): UseFieldReturn<ManglikData> =>
  useDoshaEndpoint<ManglikResponse, ManglikData>(
    ENDPOINT,
    payload,
    getManglik,
    normalizeManglik,
  );
