import {Buffer} from 'buffer';
import axios from 'axios';

import type {
  AbhijeetMuhurtaResponse,
  AdvancedPanchangResponse,
  AstrologyMuhurtaPayload,
  ChaughadiyaMuhurtaResponse,
  GeocodeResult,
  HoraMuhurtaResponse,
  HoroscopeChartPayload,
  HoroscopeChartResponse,
  HoroscopeChartType,
  HoroscopeResponse,
} from './astrology.types';

const ASTROLOGY_API_BASE_URL = 'https://json.astrologyapi.com';
const ASTROLOGY_API_USERNAME = '618742';
const ASTROLOGY_API_PASSWORD = '7c20599eb23be276e8c8ace8bef880c2';

const getAuthorizationHeader = () => {
  const credentials = `${ASTROLOGY_API_USERNAME}:${ASTROLOGY_API_PASSWORD}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  return `Basic ${encodedCredentials}`;
};

const buildFormBody = (payload: AstrologyMuhurtaPayload) => {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};

const requestAstrology = async <T>(
  endpoint: string,
  payload: Record<string, unknown>,
) => {
  try {
    const response = await astrologyApiClient.request<T>({
      method: 'POST',
      url: endpoint,
      data: buildFormBody(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      typeof data === 'string'
        ? data
        : data?.message ||
          data?.error ||
          error?.message ||
          'Astrology API request failed';

    throw new Error(
      `Astrology API request failed (${status || 'unknown'}): ${message}`,
    );
  }
};

const astrologyApiClient = axios.create({
  baseURL: ASTROLOGY_API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: getAuthorizationHeader(),
  },
});

astrologyApiClient.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Authorization: getAuthorizationHeader(),
  };

  return config;
});

export const geocodeAddress = async (
  address: string,
): Promise<GeocodeResult> => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodedAddress}`;

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'DhwaniAstro/1.0',
    },
  });

  const firstResult = Array.isArray(response.data) ? response.data[0] : null;

  if (!firstResult) {
    throw new Error('No coordinates found for the selected address.');
  }

  return {
    display_name: firstResult.display_name,
    lat: firstResult.lat,
    lon: firstResult.lon,
  };
};

export const getChaughadiyaMuhurta = async (
  payload: AstrologyMuhurtaPayload,
): Promise<ChaughadiyaMuhurtaResponse> => {
  return requestAstrology<ChaughadiyaMuhurtaResponse>(
    '/v1/chaughadiya_muhurta',
    payload,
  );
};

export const getAbhijeetMuhurta = async (
  payload: AstrologyMuhurtaPayload,
): Promise<AbhijeetMuhurtaResponse> => {
  return requestAstrology<AbhijeetMuhurtaResponse>(
    '/v1/advanced_panchang',
    payload,
  );
};

export const getAdvancedPanchang = async (
  payload: AstrologyMuhurtaPayload,
): Promise<AdvancedPanchangResponse> => {
  return requestAstrology<AdvancedPanchangResponse>(
    '/v1/advanced_panchang',
    payload,
  );
};

export const getHoraMuhurta = async (
  payload: AstrologyMuhurtaPayload,
): Promise<HoraMuhurtaResponse> => {
  return requestAstrology<HoraMuhurtaResponse>('/v1/hora_muhurta', payload);
};

// ============================================
// Horoscope (Sun Sign Prediction) endpoints
// https://json.astrologyapi.com/v1/sun_sign_prediction/daily/:zodiacName
//
// The `today` endpoint returns a flat prediction object, while the
// `previous` / `next` endpoints wrap the prediction (plus ratings)
// inside a nested `prediction` object. `HoroscopeResponse` models both.
// ============================================

const HOROSCOPE_TIMEZONE = 5.5;

export const getSunSignPredictionToday = async (
  zodiacName: string,
  timezone: number = HOROSCOPE_TIMEZONE,
): Promise<HoroscopeResponse> => {
  return requestAstrology<HoroscopeResponse>(
    `/v1/sun_sign_prediction/daily/${zodiacName}`,
    {timezone},
  );
};

export const getSunSignPredictionPrevious = async (
  zodiacName: string,
  timezone: number = HOROSCOPE_TIMEZONE,
): Promise<HoroscopeResponse> => {
  return requestAstrology<HoroscopeResponse>(
    `/v1/sun_sign_prediction/daily/previous/${zodiacName}`,
    {timezone},
  );
};

export const getSunSignPredictionNext = async (
  zodiacName: string,
  timezone: number = HOROSCOPE_TIMEZONE,
): Promise<HoroscopeResponse> => {
  return requestAstrology<HoroscopeResponse>(
    `/v1/sun_sign_prediction/daily/next/${zodiacName}`,
    {timezone},
  );
};

// ============================================
// Horoscope Chart (horo_chart_image) endpoints
// https://json.astrologyapi.com/v1/horo_chart_image/:chalit
// https://json.astrologyapi.com/v1/horo_chart_image/:D9
// Both endpoints accept the same request body and return an SVG string.
// ============================================

/**
 * Normalises the horo_chart_image response into a uniform `{svg}` shape.
 *
 * The `chalit` endpoint returns the raw SVG string, while the `D9` endpoint
 * wraps it in a JSON object (`{svg: "..."}`). Handle both so every caller
 * receives a consistent response.
 */
export const normalizeHoroscopeChartResponse = (
  data: unknown,
): HoroscopeChartResponse => {
  if (typeof data === 'string' && data.length > 0) {
    return {svg: data};
  }

  if (
    data &&
    typeof data === 'object' &&
    typeof (data as {svg?: unknown}).svg === 'string'
  ) {
    return {svg: (data as {svg: string}).svg};
  }

  return {};
};

export const getHoroscopeChart = async (
  chartType: HoroscopeChartType,
  payload: HoroscopeChartPayload,
): Promise<HoroscopeChartResponse> => {
  const endpoint = `/v1/horo_chart_image/${chartType}`;
  const startedAt = Date.now();

  console.log(`[BirthChart] ${chartType} API request`, {
    endpoint,
    ...payload,
  });

  try {
    const data = await requestAstrology<unknown>(
      endpoint,
      payload as unknown as Record<string, unknown>,
    );

    // The Chalit endpoint returns the raw SVG string while the D9 endpoint
    // wraps it in `{svg}`. Normalise both shapes here.
    const normalized = normalizeHoroscopeChartResponse(data);
    const svgLength = normalized.svg?.length || 0;

    console.log(`[BirthChart] ${chartType} API response`, {
      endpoint,
      rawType: typeof data,
      svgLength,
      validSvg: svgLength > 0,
      durationMs: Date.now() - startedAt,
    });

    return normalized;
  } catch (err: any) {
    console.log(`[BirthChart] ${chartType} API error`, {
      endpoint,
      message: err?.message,
      durationMs: Date.now() - startedAt,
    });
    throw err;
  }
};
