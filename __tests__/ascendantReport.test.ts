import {
  ASCENDANT_REPORT_TITLE,
  hasAscendantContent,
  isAscendantReportEmpty,
  normalizeAscendantReport,
  normalizeAscendantReportData,
  normalizeNakshatraSections,
  resolveAscendantReportInput,
} from '../src/features/free-services/utils/ascendantReport';
import {isAscendantReportCard} from '../src/features/free-services/utils/kundliService';

const BIRTH_PAYLOAD = {
  day: 15,
  month: 8,
  year: 1995,
  hour: 10,
  min: 30,
  lat: 28.6139,
  lon: 77.209,
  tzone: 5.5,
  address: 'Delhi, India',
  gender: 'male',
};

const ASCENDANT_RESPONSE = {
  asc_report: {
    ascendant: 'Virgo',
    report: 'Your Ascendant (also known as your Rising sign) is...',
  },
};

const NAKSHATRA_RESPONSE = {
  physical: ['Strong and agile.'],
  character: ['Optimistic.', 'Organised.'],
  education: ['Good in academics.'],
  family: ['Supportive.'],
  health: ['Generally good.'],
};

describe('isAscendantReportCard', () => {
  it('matches the Ascendant Report kundli card', () => {
    expect(isAscendantReportCard('Ascendant Report')).toBe(true);
    expect(isAscendantReportCard('ascendant report')).toBe(true);
  });

  it('does not match the other kundli cards', () => {
    expect(isAscendantReportCard('Nakshatra')).toBe(false);
    expect(isAscendantReportCard('General Life Prediction')).toBe(false);
    expect(isAscendantReportCard('Birth Chart / Kundli')).toBe(false);
    expect(isAscendantReportCard(undefined as unknown as string)).toBe(false);
  });
});

describe('resolveAscendantReportInput', () => {
  it('builds the request body from the Kundli flow payload', () => {
    expect(resolveAscendantReportInput({payload: BIRTH_PAYLOAD})).toEqual({
      day: 15,
      month: 8,
      year: 1995,
      hour: 10,
      min: 30,
      lat: 28.6139,
      lon: 77.209,
      tzone: 5.5,
    });
  });

  it('returns null when there is no payload at all', () => {
    expect(resolveAscendantReportInput(undefined)).toBeNull();
    expect(resolveAscendantReportInput({})).toBeNull();
  });

  it.each(['lat', 'lon', 'tzone'])(
    'returns null when %s is missing instead of defaulting it',
    key => {
      const payload: Record<string, unknown> = {...BIRTH_PAYLOAD};
      delete payload[key];

      expect(resolveAscendantReportInput({payload})).toBeNull();
    },
  );
});

describe('normalizeAscendantReport', () => {
  it('reads the sign and the report out of the asc_report block', () => {
    expect(normalizeAscendantReport(ASCENDANT_RESPONSE)).toEqual({
      ascendant: 'Virgo',
      report: 'Your Ascendant (also known as your Rising sign) is...',
    });
  });

  it('accepts the same fields returned unwrapped', () => {
    expect(
      normalizeAscendantReport({
        ascendant: 'Leo',
        report: 'Description',
      }),
    ).toEqual({ascendant: 'Leo', report: 'Description'});
  });

  it('treats a missing or empty response as no content', () => {
    expect(normalizeAscendantReport(null)).toEqual({
      ascendant: null,
      report: null,
    });
    expect(normalizeAscendantReport({asc_report: {ascendant: '   '}})).toEqual({
      ascendant: null,
      report: null,
    });
  });

  it('keeps a partial response (sign without description)', () => {
    const summary = normalizeAscendantReport({
      asc_report: {ascendant: 'Virgo'},
    });

    expect(summary.ascendant).toBe('Virgo');
    expect(summary.report).toBeNull();
    expect(hasAscendantContent(summary)).toBe(true);
  });
});

describe('normalizeNakshatraSections', () => {
  it('keeps the documented sections in display order', () => {
    expect(
      normalizeNakshatraSections(NAKSHATRA_RESPONSE).map(
        section => section.key,
      ),
    ).toEqual(['physical', 'character', 'education', 'family', 'health']);
  });

  it('drops a section the API returned empty so no empty card is shown', () => {
    const sections = normalizeNakshatraSections({
      ...NAKSHATRA_RESPONSE,
      health: [],
    });

    expect(sections.map(section => section.key)).not.toContain('health');
    expect(sections).toHaveLength(4);
  });

  it('drops a section the API omitted entirely', () => {
    const sections = normalizeNakshatraSections({character: ['Optimistic.']});

    expect(sections).toHaveLength(1);
    expect(sections[0].paragraphs).toEqual(['Optimistic.']);
  });

  it('returns nothing for a missing or empty response', () => {
    expect(normalizeNakshatraSections(null)).toEqual([]);
    expect(normalizeNakshatraSections({})).toEqual([]);
    expect(
      normalizeNakshatraSections({
        physical: '  ',
        character: [],
      }),
    ).toEqual([]);
  });
});

describe('normalizeAscendantReportData', () => {
  it('combines both API responses into one view model', () => {
    const data = normalizeAscendantReportData(
      ASCENDANT_RESPONSE,
      NAKSHATRA_RESPONSE,
    );

    expect(data.ascendant.ascendant).toBe('Virgo');
    expect(data.sections).toHaveLength(5);
  });

  it('still builds a view model when one response is missing', () => {
    expect(
      normalizeAscendantReportData(ASCENDANT_RESPONSE, null).sections,
    ).toEqual([]);
    expect(
      normalizeAscendantReportData(null, NAKSHATRA_RESPONSE).ascendant,
    ).toEqual({ascendant: null, report: null});
  });
});

describe('isAscendantReportEmpty', () => {
  it('is true when neither response carried anything', () => {
    expect(isAscendantReportEmpty(null)).toBe(true);
    expect(isAscendantReportEmpty(normalizeAscendantReportData({}, {}))).toBe(
      true,
    );
  });

  it('is false when only the sign or a single section is present', () => {
    expect(
      isAscendantReportEmpty(
        normalizeAscendantReportData(ASCENDANT_RESPONSE, {}),
      ),
    ).toBe(false);
    expect(
      isAscendantReportEmpty(
        normalizeAscendantReportData({}, NAKSHATRA_RESPONSE),
      ),
    ).toBe(false);
  });
});

describe('report titles', () => {
  it('uses the documented headings', () => {
    expect(ASCENDANT_REPORT_TITLE).toBe('Ascendant Report');
  });
});
