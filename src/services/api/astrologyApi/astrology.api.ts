import {Buffer} from 'buffer';
import axios from 'axios';

import type {
  AbhijeetMuhurtaResponse,
  AdvancedPanchangResponse,
  AstrologyMuhurtaPayload,
  AstroDetailsResponse,
  BasicPanchangResponse,
  BirthDetailsResponse,
  ChaughadiyaMuhurtaResponse,
  GeocodeResult,
  GeneralNakshatraReportPayload,
  GeneralNakshatraReportResponse,
  HoraMuhurtaResponse,
  HoroscopeChartPayload,
  HoroscopeChartResponse,
  HoroscopeChartType,
  HoroscopeResponse,
  KalsarpaResponse,
  MajorDashaPeriod,
  ManglikResponse,
  MatchAstroDetails,
  MatchAshtakootPoints,
  MatchMakingPayload,
  MatchMakingReport,
  MatchManglikReport,
  MatchObstructions,
  BirthPlace,
  PitraDoshaResponse,
  PlanetPosition,
  SadhesatiCurrentStatusResponse,
  SadhesatiLifeDetailsResponse,
} from './astrology.types';

const ASTROLOGY_API_BASE_URL = 'https://json.astrologyapi.com';
const ASTROLOGY_API_USERNAME = '618742';
const ASTROLOGY_API_PASSWORD = '7c20599eb23be276e8c8ace8bef880c2';

const getAuthorizationHeader = () => {
  const credentials = `${ASTROLOGY_API_USERNAME}:${ASTROLOGY_API_PASSWORD}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  return `Basic ${encodedCredentials}`;
};

const buildFormBody = (payload: Record<string, unknown>) => {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};

const requestAstrology = async <T>(
  endpoint: string,
  payload: object,
  extraHeaders: Record<string, string> = {},
) => {
  try {
    const response = await astrologyApiClient.request<T>({
      method: 'POST',
      url: endpoint,
      data: buildFormBody(payload as Record<string, unknown>),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        ...extraHeaders,
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
  } as typeof config.headers;

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

// ============================================
// Birth place resolution (latitude / longitude / timezone)
//
// Nominatim resolves the coordinates but does not return a timezone, so the
// coordinates are looked up in a second, key-free reverse-timezone service.
// Neither call sends credentials.
// ============================================

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const getZonedDateParts = (
  ianaTimezone: string,
  date: Date,
): ZonedDateParts | null => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaTimezone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const partsFormatter = formatter as unknown as {
      formatToParts?: (input: Date) => Array<{type: string; value: string}>;
    };

    if (typeof partsFormatter.formatToParts === 'function') {
      const values: Record<string, string> = {};
      partsFormatter.formatToParts(date).forEach(part => {
        values[part.type] = part.value;
      });

      return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        // Intl can report hour 24 for midnight with hour12: false.
        hour: Number(values.hour) % 24,
        minute: Number(values.minute),
        second: Number(values.second),
      };
    }

    // Engines without formatToParts still produce a stable en-US string.
    const match = /(\d+)\/(\d+)\/(\d+),?\s+(\d+):(\d+):(\d+)/.exec(
      formatter.format(date),
    );

    if (!match) {
      return null;
    }

    return {
      month: Number(match[1]),
      day: Number(match[2]),
      year: Number(match[3]),
      hour: Number(match[4]) % 24,
      minute: Number(match[5]),
      second: Number(match[6]),
    };
  } catch {
    return null;
  }
};

/**
 * UTC offset in hours of an IANA zone at a given instant, e.g. 5.5 for
 * Asia/Kolkata. Returns null when the zone is unknown or Intl is missing.
 */
const getTimezoneOffsetHours = (
  ianaTimezone: string,
  at: Date,
): number | null => {
  const parts = getZonedDateParts(ianaTimezone, at);
  if (!parts) {
    return null;
  }

  // Reading the zone's wall clock as if it were UTC, then comparing it with the
  // real instant, yields the zone's own offset — independent of the device's.
  const wallClockAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return Number(((wallClockAsUtc - at.getTime()) / 60000 / 60).toFixed(4));
};

interface TimezoneLookupResponse {
  timezone?: string;
  utc_offset_seconds?: number;
}

const lookupTimezoneForCoordinates = async (
  lat: number,
  lon: number,
  at: Date,
): Promise<{name: string | null; offsetHours: number}> => {
  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=' +
    lat +
    '&longitude=' +
    lon +
    '&timezone=auto&current=temperature_2m';

  const response = await axios.get<TimezoneLookupResponse>(url, {
    timeout: 15000,
  });

  const name =
    typeof response.data?.timezone === 'string' ? response.data.timezone : null;

  if (name) {
    // Prefer the historical offset for the birth moment, not "now".
    const historical = getTimezoneOffsetHours(name, at);
    if (historical !== null) {
      return {name, offsetHours: historical};
    }
  }

  // Used only when Intl cannot report the zone, e.g. an older JS engine.
  const currentOffset = response.data?.utc_offset_seconds;
  if (typeof currentOffset === 'number' && Number.isFinite(currentOffset)) {
    return {name, offsetHours: Number((currentOffset / 3600).toFixed(4))};
  }

  throw new Error('No timezone found for the selected birth place.');
};

/**
 * Resolves a selected place-of-birth into the values the astrology APIs need:
 * latitude, longitude and the UTC offset in hours at `at` (the birth moment).
 *
 * Coordinates come from the same geocoder the rest of the Kundli flow uses.
 * The timezone is required: falling back to the device's own offset would
 * silently compute the chart for the wrong location, so a failed lookup is
 * reported to the user instead.
 */
export const resolveBirthPlace = async (
  address: string,
  at: Date = new Date(),
): Promise<BirthPlace> => {
  const coords = await geocodeAddress(address);
  const lat = Number(coords.lat);
  const lon = Number(coords.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('No coordinates found for the selected address.');
  }

  let lookup: {name: string | null; offsetHours: number};
  try {
    lookup = await lookupTimezoneForCoordinates(lat, lon, at);
  } catch {
    throw new Error(
      'Unable to resolve the timezone of the selected birth place. Please check your connection and try again.',
    );
  }

  if (!Number.isFinite(lookup.offsetHours)) {
    throw new Error(
      'Unable to resolve the timezone of the selected birth place. Please check your connection and try again.',
    );
  }

  return {
    place: coords.display_name,
    lat,
    lon,
    timezone: lookup.offsetHours,
    timezoneName: lookup.name,
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
// Kundli (Birth Chart) endpoints
// https://json.astrologyapi.com/v1/birth_details
// https://json.astrologyapi.com/v1/basic_panchang
// https://json.astrologyapi.com/v1/astro_details
// https://json.astrologyapi.com/v1/planets
// https://json.astrologyapi.com/v1/major_vdasha
//
// All endpoints accept the same birth-details payload (day, month, year,
// hour, min, lat, lon, tzone) and are meant to be called in parallel.
// ============================================

export const getBirthDetails = async (
  payload: AstrologyMuhurtaPayload,
): Promise<BirthDetailsResponse> => {
  return requestAstrology<BirthDetailsResponse>('/v1/birth_details', payload);
};

export const getBasicPanchang = async (
  payload: AstrologyMuhurtaPayload,
): Promise<BasicPanchangResponse> => {
  return requestAstrology<BasicPanchangResponse>('/v1/basic_panchang', payload);
};

export const getAstroDetails = async (
  payload: AstrologyMuhurtaPayload,
): Promise<AstroDetailsResponse> => {
  return requestAstrology<AstroDetailsResponse>('/v1/astro_details', payload);
};

export const getPlanets = async (
  payload: AstrologyMuhurtaPayload,
): Promise<PlanetPosition[]> => {
  return requestAstrology<PlanetPosition[]>('/v1/planets', payload);
};

export const getMajorVdasha = async (
  payload: AstrologyMuhurtaPayload,
): Promise<MajorDashaPeriod[]> => {
  return requestAstrology<MajorDashaPeriod[]>('/v1/major_vdasha', payload);
};

// ============================================
// General Nakshatra Report endpoint
// https://json.astrologyapi.com/v1/general_nakshatra_report
//
// Reuses the stored birth details and adds the gender selected in the Kundli
// form. Returns sectioned paragraphs (physical, character, education,
// family, health).
// ============================================

export const getGeneralNakshatraReport = async (
  payload: GeneralNakshatraReportPayload,
): Promise<GeneralNakshatraReportResponse> => {
  return requestAstrology<GeneralNakshatraReportResponse>(
    '/v1/general_nakshatra_report',
    payload,
  );
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

// ============================================
// Kundli Dosha endpoints
// https://json.astrologyapi.com/v1/manglik
// https://json.astrologyapi.com/v1/kalsarpa_details
// https://json.astrologyapi.com/v1/pitra_dosha_report
// https://json.astrologyapi.com/v1/sadhesati_life_details
// https://json.astrologyapi.com/v1/sadhesati_current_status
//
// All accept the same birth-details payload (day, month, year, hour, min,
// lat, lon, tzone).
// ============================================

export const getManglik = async (
  payload: AstrologyMuhurtaPayload,
): Promise<ManglikResponse> => {
  return requestAstrology<ManglikResponse>('/v1/manglik', payload);
};

export const getKalsarpaDetails = async (
  payload: AstrologyMuhurtaPayload,
): Promise<KalsarpaResponse> => {
  return requestAstrology<KalsarpaResponse>('/v1/kalsarpa_details', payload);
};

export const getPitraDoshaReport = async (
  payload: AstrologyMuhurtaPayload,
): Promise<PitraDoshaResponse> => {
  return requestAstrology<PitraDoshaResponse>(
    '/v1/pitra_dosha_report',
    payload,
  );
};

export const getSadhesatiLifeDetails = async (
  payload: AstrologyMuhurtaPayload,
): Promise<SadhesatiLifeDetailsResponse> => {
  return requestAstrology<SadhesatiLifeDetailsResponse>(
    '/v1/sadhesati_life_details',
    payload,
  );
};

export const getSadhesatiCurrentStatus = async (
  payload: AstrologyMuhurtaPayload,
): Promise<SadhesatiCurrentStatusResponse> => {
  return requestAstrology<SadhesatiCurrentStatusResponse>(
    '/v1/sadhesati_current_status',
    payload,
  );
};

// ============================================
// Match Making (Kundli Milan) endpoints
// https://json.astrologyapi.com/v1/match_making_report
// https://json.astrologyapi.com/v1/match_manglik_report
// https://json.astrologyapi.com/v1/match_astro_details
// https://json.astrologyapi.com/v1/match_obstructions
// https://json.astrologyapi.com/v1/match_ashtakoot_points
//
// All five accept the same two-person payload (MatchMakingPayload) and are
// independent of each other, so the caller runs them in parallel.
// ============================================

/** The Match Making report text is always requested in English. */
const MATCH_MAKING_HEADERS = {'Accept-Language': 'en'};

const requestMatchMaking = <T>(
  endpoint: string,
  payload: MatchMakingPayload,
): Promise<T> => requestAstrology<T>(endpoint, payload, MATCH_MAKING_HEADERS);

/** POST /v1/match_making_report — overview flags and the match conclusion. */
export const getMatchMakingReport = async (
  payload: MatchMakingPayload,
): Promise<MatchMakingReport> => {
  return requestMatchMaking<MatchMakingReport>(
    '/v1/match_making_report',
    payload,
  );
};

/** POST /v1/match_manglik_report — Manglik Dosha analysis of both parties. */
export const getMatchManglikReport = async (
  payload: MatchMakingPayload,
): Promise<MatchManglikReport> => {
  return requestMatchMaking<MatchManglikReport>(
    '/v1/match_manglik_report',
    payload,
  );
};

/** POST /v1/match_astro_details — astro details of both parties. */
export const getMatchAstroDetails = async (
  payload: MatchMakingPayload,
): Promise<MatchAstroDetails> => {
  return requestMatchMaking<MatchAstroDetails>(
    '/v1/match_astro_details',
    payload,
  );
};

/** POST /v1/match_obstructions — Vedha / other obstructions. */
export const getMatchObstructions = async (
  payload: MatchMakingPayload,
): Promise<MatchObstructions> => {
  return requestMatchMaking<MatchObstructions>(
    '/v1/match_obstructions',
    payload,
  );
};

/** POST /v1/match_ashtakoot_points — the 8 Koota score sheet. */
export const getMatchAshtakootPoints = async (
  payload: MatchMakingPayload,
): Promise<MatchAshtakootPoints> => {
  return requestMatchMaking<MatchAshtakootPoints>(
    '/v1/match_ashtakoot_points',
    payload,
  );
};
