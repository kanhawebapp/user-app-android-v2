export type AstrologyServiceType = 'chaughadiya' | 'abhijeet';

export type TimeValue =
  | string
  | {hour: number; minute: number; second?: number; min?: number; sec?: number};

export interface AstrologyMuhurtaPayload {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

/** Request body for the general nakshatra report endpoint (adds gender). */
export interface GeneralNakshatraReportPayload extends AstrologyMuhurtaPayload {
  gender: 'male' | 'female';
}

/**
 * Response for POST /v1/general_nakshatra_report.
 *
 * Each key is a report section holding one or more paragraphs. Any section
 * may be missing from the response.
 */
export interface GeneralNakshatraReportResponse {
  physical?: string | string[];
  character?: string | string[];
  education?: string | string[];
  family?: string | string[];
  health?: string | string[];
}

export interface ChaughadiyaMuhurtaResponse {
  chaughadiya?: {
    day?: {
      time?: string;
      muhurta_name?: string;
    } | null;
    night?: {
      time?: string;
      muhurta_name?: string;
    } | null;
  } | null;
}

export interface AbhijeetMuhurtaResponse {
  abhijit_muhurta?: {
    start?: string;
    end?: string;
  } | null;
}

export interface AdvancedPanchangResponse {
  day?: string;
  sunrise?: TimeValue;
  sunset?: TimeValue;
  moonrise?: TimeValue;
  moonset?: TimeValue;
  tithi?: {
    details?: {
      tithi_number?: string;
      tithi_name?: string;
      special?: string;
      deity?: string;
      summary?: string;
    };
    end_time?: TimeValue;
  };
  nakshatra?: {
    details?: {
      nak_number?: string;
      nak_name?: string;
      ruler?: string;
      deity?: string;
      special?: string;
      summary?: string;
    };
    end_time?: TimeValue;
  };
  yog?: {
    details?: {
      yog_number?: string;
      yog_name?: string;
      special?: string;
      meaning?: string;
    };
    end_time?: TimeValue;
  };
  karan?: {
    details?: {
      karan_number?: string;
      karan_name?: string;
      deity?: string;
      special?: string;
    };
    end_time?: TimeValue;
  };
  rahukaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  yamghant_kaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  guliKaal?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  abhijit_muhurta?: {
    start?: TimeValue;
    end?: TimeValue;
  };
  paksha?: string;
  ritu?: string;
  sun_sign?: string;
  moon_sign?: string;
  ayana?: string;
  vikram_samvat?: string;
  vkram_samvat_name?: string;
  shaka_samvat?: string;
  shaka_samvat_name?: string;
  disha_shool?: string;
  disha_shool_remedies?: string;
}

export interface HoraMuhurtaResponse {
  hora?: {
    day?: Array<{
      time?: string;
      hora?: string;
    }> | null;
    night?: Array<{
      time?: string;
      hora?: string;
    }> | null;
  } | null;
}

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

// ============================================
// Horoscope (Sun Sign Prediction) types
// Mapped for the astrologyapi.com
// sun_sign_prediction/daily/:zodiacName endpoints.
// ============================================

/** Tab selector for daily horoscope predictions. */
export type HoroscopeTab = 'today' | 'previous' | 'next';

/** A single zodiac prediction section (personal life, profession, ...). */
export interface HoroscopePrediction {
  personal_life?: string;
  profession?: string;
  health?: string;
  emotions?: string;
  travel?: string;
  luck?: string;

  // Ratings are only returned by the previous/next endpoints.
  personal_life_rating?: number;
  profession_rating?: number;
  health_rating?: number;
  emotions_rating?: number;
  travel_rating?: number;
  luck_rating?: number;
}

/**
 * Raw response for the sun sign prediction endpoints.
 *
 * - `today` returns a **flat** object (just the 6 prediction texts).
 * - `previous` / `next` return a **nested** object with `status`,
 *   `sun_sign`, `prediction_date` and a `prediction` block that also
 *   contains the ratings.
 *
 * The util `getHoroscopeViewModel` normalises both shapes into one view model.
 */
export interface HoroscopeResponse {
  status?: boolean;
  sun_sign?: string;
  prediction_date?: string;
  prediction?: HoroscopePrediction;

  // Flat fields returned by the "today" endpoint
  personal_life?: string;
  profession?: string;
  health?: string;
  emotions?: string;
  travel?: string;
  luck?: string;
}

// ============================================
// Horoscope Chart (horo_chart_image) types
// Mapped for the astrologyapi.com
// /v1/horo_chart_image/:chalit and /v1/horo_chart_image/:D9 endpoints.
// ============================================

/**
 * Charts rendered on the Basic and Planets tabs (fetched together and
 * cached after the first successful request).
 */
export type BaseChartType = 'chalit' | 'D9';

/**
 * All chart variants supported by the horo_chart_image endpoint, including
 * every divisional (Varga) chart rendered on the Divisional Charts tab.
 */
export type HoroscopeChartType =
  | BaseChartType
  | 'SUN'
  | 'MOON'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D7'
  | 'D8'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

/** Request body for the horo_chart_image endpoints. */
export interface HoroscopeChartPayload {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  planetColor: string;
  signColor: string;
  lineColor: string;
  chartType: 'north';
  image_type: 'svg';
}

/** Response for the horo_chart_image endpoints. */
export interface HoroscopeChartResponse {
  svg?: string;
}

// ============================================
// Kundli (Birth Chart) endpoint types
// Mapped for the astrologyapi.com /v1/birth_details,
// /v1/basic_panchang, /v1/astro_details, /v1/planets and
// /v1/major_vdasha endpoints.
// ============================================

/** Response for POST /v1/birth_details. */
export interface BirthDetailsResponse {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  latitude?: number;
  longitude?: number;
  timezone?: number;
  sunrise?: string;
  sunset?: string;
  ayanamsha?: number;
}

/** Response for POST /v1/basic_panchang. */
export interface BasicPanchangResponse {
  day?: string;
  tithi?: string;
  yog?: string;
  nakshatra?: string;
  karan?: string;
  sunrise?: string;
  sunset?: string;
}

/**
 * Response for POST /v1/astro_details.
 *
 * Field names keep the API's original casing (Varna, SignLord, ...) so the
 * values can be mapped directly into display cards.
 */
export interface AstroDetailsResponse {
  ascendant?: string;
  Varna?: string;
  Vashya?: string;
  Yoni?: string;
  Gan?: string;
  Nadi?: string;
  SignLord?: string;
  sign?: string;
  Naksahtra?: string;
  NaksahtraLord?: string;
  Charan?: number | string;
  Yog?: string;
  Karan?: string;
  Tithi?: string;
  yunja?: string;
  tatva?: string;
  name_alphabet?: string;
  paya?: string;
}

/** A single planetary position returned by POST /v1/planets. */
export interface PlanetPosition {
  id?: number;
  name?: string;
  fullDegree?: number;
  normDegree?: number;
  speed?: number;
  isRetro?: string | boolean;
  sign?: string;
  signLord?: string;
  nakshatra?: string;
  nakshatraLord?: string;
  nakshatra_pad?: number;
  house?: number;
  is_planet_set?: boolean;
  planet_awastha?: string;
}

/** A single Maha Vimshottari dasha period returned by POST /v1/major_vdasha. */
export interface MajorDashaPeriod {
  planet?: string;
  planet_id?: number;
  start?: string;
  end?: string;
}

// ============================================
// Kundli Dosha endpoints
// https://json.astrologyapi.com/v1/manglik
// https://json.astrologyapi.com/v1/kalsarpa_details
// https://json.astrologyapi.com/v1/pitra_dosha_report
// https://json.astrologyapi.com/v1/sadhesati_life_details
// https://json.astrologyapi.com/v1/sadhesati_current_status
//
// All accept the same birth-details payload (AstrologyMuhurtaPayload).
// ============================================

/** Response from POST /v1/manglik (Manglik Dosha analysis). */
export interface ManglikResponse {
  is_present?: boolean;
  /** e.g. 'EFFECTIVE' | 'LESS_EFFECTIVE'. */
  manglik_status?: string;
  percentage_manglik_present?: number | string;
  percentage_manglik_after_cancellation?: number | string;
  manglik_report?: string;
  is_mars_manglik_cancelled?: boolean;
  manglik_present_rule?: {
    based_on_aspect?: string[];
    based_on_house?: string[];
  } | null;
  manglik_cancel_rule?: string[];
}

/** Response from POST /v1/kalsarpa_details (Kaal Sarp Dosha analysis). */
export interface KalsarpaResponse {
  present?: boolean;
  type?: string;
  name?: string;
  one_line?: string;
  /** `report.report` is an HTML string rendered as paragraphs. */
  report?: {
    house_id?: number | string;
    report?: string;
  } | null;
}

/**
 * Response from POST /v1/pitra_dosha_report (Pitra Dosha analysis).
 * The API mostly returns `is_pitri_dosha_present`; both spellings are
 * tolerated elsewhere.
 */
export interface PitraDoshaResponse {
  is_pitri_dosha_present?: boolean;
  is_pitra_dosha_present?: boolean;
  rules_matched?: string[];
  conclusion?: string;
  remedies?: Array<string | Record<string, unknown>>;
  effects?: Array<string | Record<string, unknown>>;
  what_is_pitri_dosha?: string;
}

/** A single Sade Sati lifecycle event from POST /v1/sadhesati_life_details. */
export interface SadhesatiLifeEvent {
  moon_sign?: string;
  saturn_sign?: string;
  is_saturn_retrograde?: boolean;
  /** One of SETTING_END | SETTING_START | PEAK_START | RISING_START | RISING_END. */
  type?: string;
  /** Epoch millisecond as a string. */
  millisecond?: string | number;
  /** dd-mm-yyyy. */
  date?: string;
  summary?: string;
}

/** POST /v1/sadhesati_life_details returns a chronological event array. */
export type SadhesatiLifeDetailsResponse = SadhesatiLifeEvent[];

/** Response from POST /v1/sadhesati_current_status. */
export interface SadhesatiCurrentStatusResponse {
  consideration_date?: string;
  is_saturn_retrograde?: boolean;
  moon_sign?: string;
  saturn_sign?: string;
  /** e.g. 'Yes, currently you are undergoing...'. */
  is_undergoing_sadhesati?: string | boolean;
  /** Whether Sade Sati is currently running. */
  sadhesati_status?: boolean;
  what_is_sadhesati?: string;
}
