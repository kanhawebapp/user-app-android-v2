/**
 * Ascendant Report view-model helpers.
 *
 * The report is built from two independent API responses:
 *  - general_ascendant_report -> the rising sign and its description
 *  - general_nakshatra_report -> sectioned paragraphs (physical, character,
 *    education, family, health)
 *
 * The helpers here stay pure: they resolve the birth-details request input
 * from the Kundli flow and normalise both raw responses into display values.
 * Nothing is hardcoded — the sign and every paragraph come from the API, and a
 * section the API left empty is dropped so the UI never shows an empty card.
 */

import type {
  AscendantReportPayload,
  GeneralAscendantReportResponse,
  GeneralNakshatraReportResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import {resolveBirthDetailsPayload} from './birthDetails';
import {normalizeGeneralLifePrediction} from './generalLifePrediction';
import type {LifePredictionSection} from './generalLifePrediction';

/** Titles used by the two report blocks. */
export const ASCENDANT_REPORT_TITLE = 'Ascendant Report';
export const ASCENDANT_SECTION_TITLE = 'Ascendant';
export const NAKSHATRA_REPORT_TITLE = 'General Nakshatra Report';

/** The rising sign plus its description, as returned by the API. */
export interface AscendantSummary {
  /** The rising sign, e.g. 'Virgo'. Null when the API returned none. */
  ascendant: string | null;
  /** The long-form ascendant description. Null when the API returned none. */
  report: string | null;
}

/** Normalised Ascendant Report consumed by AscendantReportView. */
export interface AscendantReportData {
  ascendant: AscendantSummary;
  /** Non-empty Nakshatra sections only, in display order. */
  sections: LifePredictionSection[];
}

/**
 * Resolves the request body for both Ascendant Report endpoints from the
 * Kundli flow result (DOB, birth time, geocoded latitude/longitude/timezone).
 * Returns null when any value is missing so the screen can explain what is
 * required instead of sending an invalid request.
 */
export const resolveAscendantReportInput = (
  result: any,
): AscendantReportPayload | null => resolveBirthDetailsPayload(result);

/** Reads a trimmed string, treating blanks and non-strings as missing. */
const asText = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  return value.trim() || null;
};

/**
 * Normalises the general_ascendant_report response. The API nests both values
 * under `asc_report`; the unwrapped shape is accepted as a fallback so the
 * report keeps working if the wrapper ever changes.
 */
export const normalizeAscendantReport = (
  response: GeneralAscendantReportResponse | null | undefined,
): AscendantSummary => {
  const block = response?.asc_report ?? response ?? undefined;

  return {
    ascendant: asText(block?.ascendant),
    report: asText(block?.report),
  };
};

/** True when the ascendant response carries a sign or a description. */
export const hasAscendantContent = (ascendant: AscendantSummary): boolean =>
  Boolean(ascendant.ascendant || ascendant.report);

/**
 * Normalises the general_nakshatra_report response into the Nakshatra sections
 * that actually have content. Sections the API omitted (or returned empty) are
 * dropped, so the UI can hide their card entirely.
 */
export const normalizeNakshatraSections = (
  response: GeneralNakshatraReportResponse | null | undefined,
): LifePredictionSection[] =>
  normalizeGeneralLifePrediction(response).sections.filter(
    section => section.paragraphs.length > 0,
  );

/**
 * Builds the full Ascendant Report view model from both responses. Either
 * response may be missing (e.g. only one of the two requests succeeded); the
 * other half is simply rendered without content.
 */
export const normalizeAscendantReportData = (
  ascendantResponse: GeneralAscendantReportResponse | null | undefined,
  nakshatraResponse: GeneralNakshatraReportResponse | null | undefined,
): AscendantReportData => ({
  ascendant: normalizeAscendantReport(ascendantResponse),
  sections: normalizeNakshatraSections(nakshatraResponse),
});

/**
 * True when the response carries nothing worth rendering: neither a rising sign
 * nor a description, and no Nakshatra paragraph.
 */
export const isAscendantReportEmpty = (
  data: AscendantReportData | null,
): boolean =>
  !data || (!hasAscendantContent(data.ascendant) && data.sections.length === 0);
