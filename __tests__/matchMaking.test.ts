import {
  ASTRO_DETAIL_FIELDS,
  KOOTA_KEYS,
  buildMatchMakingPayload,
  buildMatchPartiesSummary,
  fetchMatchMakingBundle,
  formatBirthDate,
  formatBirthTime,
  getBirthMoment,
  getFirstErrorMessage,
  hasErrors,
  isAshtakootEmpty,
  isAstroDetailsEmpty,
  isManglikAnalysisEmpty,
  isMatchMakingReportEmpty,
  isMatchObstructionsEmpty,
  normalizeAstroPartyDetails,
  normalizeMatchAshtakootPoints,
  normalizeMatchAstroDetails,
  normalizeMatchMakingReport,
  normalizeMatchManglikReport,
  normalizeMatchObstructions,
  parseTime,
  summarizeMatchPayload,
  validateMatchForm,
  validateParty,
  type MatchFormValues,
  type ResolvedParty,
} from '../src/features/free-services/utils/matchMaking';
import type {MatchMakingPayload} from '../src/services/api/astrologyApi/astrology.types';
import * as astrologyApi from '../src/services/api/astrologyApi/astrology.api';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getMatchMakingReport: jest.fn(),
  getMatchManglikReport: jest.fn(),
  getMatchAstroDetails: jest.fn(),
  getMatchObstructions: jest.fn(),
  getMatchAshtakootPoints: jest.fn(),
  resolveBirthPlace: jest.fn(),
}));

const mocked = astrologyApi as jest.Mocked<typeof astrologyApi>;

const MALE: ResolvedParty = {
  party: {
    name: 'Rahul',
    date: '10/05/1990',
    time: '09:30 PM',
    address: 'Delhi',
  },
  birthPlace: {lat: 28.6139, lon: 77.209, timezone: 5.5, place: 'Delhi'},
};

const FEMALE: ResolvedParty = {
  party: {
    name: 'Priya',
    date: '22/11/1992',
    time: '06:15 AM',
    address: 'Mumbai',
  },
  birthPlace: {lat: 19.076, lon: 72.8777, timezone: 5.5, place: 'Mumbai'},
};

describe('parseTime', () => {
  it('converts a 12-hour time to 24-hour', () => {
    expect(parseTime('09:30 PM')).toEqual({hour: 21, min: 30});
    expect(parseTime('06:15 AM')).toEqual({hour: 6, min: 15});
  });

  it('handles the 12 AM / 12 PM boundaries', () => {
    expect(parseTime('12:00 AM')).toEqual({hour: 0, min: 0});
    expect(parseTime('12:45 PM')).toEqual({hour: 12, min: 45});
  });

  it('rejects malformed and out-of-range times', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('25:00 PM')).toBeNull();
    expect(parseTime('09:75 PM')).toBeNull();
    expect(parseTime('9:5')).toBeNull();
    expect(parseTime('abc')).toBeNull();
  });
});

describe('validateParty', () => {
  it('passes for a complete party', () => {
    expect(validateParty(MALE.party)).toEqual({});
    expect(hasErrors(validateParty(MALE.party))).toBe(false);
  });

  it('requires name, date, time and place', () => {
    const errors = validateParty({name: '  ', date: '', time: '', address: ''});
    expect(errors).toEqual({
      name: 'Please enter the name',
      date: 'Please select a valid date of birth',
      time: 'Please select a valid time of birth',
      address: 'Please select a birth place',
    });
  });

  it('rejects impossible dates such as 31/02/1990', () => {
    expect(
      validateParty({...MALE.party, date: '31/02/1990'}).date,
    ).toBeDefined();
  });
});

describe('validateMatchForm', () => {
  it('validates both parties and exposes the first message for the toast', () => {
    const values: MatchFormValues = {
      male: MALE.party,
      female: {name: '', date: 'bad', time: '', address: ''},
    };

    const errors = validateMatchForm(values);
    expect(errors.male).toEqual({});
    expect(errors.female.name).toBe('Please enter the name');
    expect(getFirstErrorMessage(errors)).toBe('Please enter the name');
  });

  it('returns null when everything is valid', () => {
    const errors = validateMatchForm({male: MALE.party, female: FEMALE.party});
    expect(getFirstErrorMessage(errors)).toBeNull();
  });
});

describe('buildMatchMakingPayload', () => {
  it('builds the shared m_/f_ payload from both parties', () => {
    expect(
      buildMatchMakingPayload({male: MALE, female: FEMALE}),
    ).toEqual<MatchMakingPayload>({
      m_day: 10,
      m_month: 5,
      m_year: 1990,
      m_hour: 21,
      m_min: 30,
      m_lat: 28.6139,
      m_lon: 77.209,
      m_tzone: 5.5,
      f_day: 22,
      f_month: 11,
      f_year: 1992,
      f_hour: 6,
      f_min: 15,
      f_lat: 19.076,
      f_lon: 72.8777,
      f_tzone: 5.5,
    });
  });

  it('throws rather than sending a malformed payload', () => {
    expect(() =>
      buildMatchMakingPayload({
        male: MALE,
        female: {...FEMALE, party: {...FEMALE.party, time: 'nope'}},
      }),
    ).toThrow('Please complete both birth dates and birth times.');
  });
});

describe('getBirthMoment', () => {
  it('builds the birth instant used to pick the UTC offset', () => {
    const moment = getBirthMoment(MALE.party);
    expect(moment).toBeInstanceOf(Date);
    expect(moment?.getFullYear()).toBe(1990);
    expect(moment?.getMonth()).toBe(4);
    expect(moment?.getDate()).toBe(10);
  });

  it('returns null for an invalid party', () => {
    expect(
      getBirthMoment({...MALE.party, date: '01/01/1990', time: 'x'}),
    ).toBeNull();
  });
});

describe('header summaries', () => {
  it('formats the report header from the form values and geocoded place', () => {
    expect(buildMatchPartiesSummary({male: MALE, female: FEMALE})).toEqual({
      male: {
        name: 'Rahul',
        date: '10 May 1990',
        time: '09:30 PM',
        place: 'Delhi',
      },
      female: {
        name: 'Priya',
        date: '22 November 1992',
        time: '06:15 AM',
        place: 'Mumbai',
      },
    });
  });

  it('falls back to the payload when the form values are unavailable', () => {
    const payload = buildMatchMakingPayload({male: MALE, female: FEMALE});
    expect(summarizeMatchPayload(payload).male).toEqual({
      name: '',
      date: '10 May 1990',
      time: '09:30 PM',
      place: '',
    });
    expect(summarizeMatchPayload(null).male.date).toBe('0 January 0');
  });

  it('formats dates and times', () => {
    expect(formatBirthDate({day: 1, month: 1, year: 2000})).toBe(
      '1 January 2000',
    );
    expect(formatBirthTime({hour: 0, min: 5})).toBe('12:05 AM');
    expect(formatBirthTime({hour: 13, min: 0})).toBe('01:00 PM');
  });
});

describe('normalizeMatchMakingReport', () => {
  it('builds the four overview rows and strips HTML from the conclusion', () => {
    const data = normalizeMatchMakingReport({
      ashtakoota: {status: 'Yes', received_points: 24, total_points: 36},
      manglik: {status: 'No', male_percentage: 50, female_percentage: 0},
      rajju_dosha: {status: 'No'},
      vedha_dosha: {status: 'Yes'},
      conclusion: {match_report: '<p>Good match</p><p>Overall</p>'},
    } as never);

    expect(data.overview.map(item => item.key)).toEqual([
      'ashtakoota',
      'manglik',
      'rajju_dosha',
      'vedha_dosha',
    ]);
    expect(data.overview[0].isPresent).toBe(true);
    expect(data.overview[0].details).toEqual([
      {label: 'Received Points', value: '24 / 36'},
    ]);
    expect(data.overview[1].details).toEqual([
      {label: 'Male', value: '50%'},
      {label: 'Female', value: '0%'},
    ]);
    expect(data.conclusion).toBe('<p>Good match</p><p>Overall</p>');
    expect(data.conclusionParagraphs).toEqual(['Good match', 'Overall']);
    expect(isMatchMakingReportEmpty(data)).toBe(false);
  });

  it('treats a missing response as empty and never throws', () => {
    const data = normalizeMatchMakingReport(null);
    expect(data.overview.every(item => item.isPresent === null)).toBe(true);
    expect(data.conclusion).toBeNull();
    expect(isMatchMakingReportEmpty(data)).toBe(true);
  });
});

describe('normalizeMatchManglikReport', () => {
  it('normalizes both parties, the rules and the conclusion', () => {
    const data = normalizeMatchManglikReport({
      male: {
        is_present: true,
        manglik_status: 'EFFECTIVE',
        percentage_manglik_present: 75,
        percentage_manglik_after_cancellation: 25,
        manglik_report: '<p>Male report</p>',
        manglik_present_rule: {
          based_on_aspect: 'Mars, Saturn',
          based_on_house: ['1st', '7th'],
        },
        manglik_cancel_rule: 'Benefit of Venus',
      },
      female: {is_present: false},
      conclusion: {match: true, report: '<p>Compatible</p>'},
    } as never);

    expect(data.male.isPresent).toBe(true);
    expect(data.male.status).toBe('Effective');
    expect(data.male.percentage).toBe(75);
    expect(data.male.percentageAfterCancellation).toBe(25);
    expect(data.male.basedOnAspect).toEqual(['Mars, Saturn']);
    expect(data.male.basedOnHouse).toEqual(['1st', '7th']);
    expect(data.male.cancelRules).toEqual(['Benefit of Venus']);
    expect(data.male.reportParagraphs).toEqual(['Male report']);
    expect(data.female.isPresent).toBe(false);
    expect(data.conclusionMatch).toBe(true);
    expect(data.conclusionParagraphs).toEqual(['Compatible']);
    expect(isManglikAnalysisEmpty(data.male)).toBe(false);
    // Analysed and explicitly not Manglik is still data, unlike a missing party.
    expect(data.female.isPresent).toBe(false);
    expect(isManglikAnalysisEmpty(data.female)).toBe(false);
  });

  it('treats a party the API did not return as empty', () => {
    const data = normalizeMatchManglikReport(null);
    expect(isManglikAnalysisEmpty(data.male)).toBe(true);
    expect(data.conclusionMatch).toBeNull();
  });
});

describe('normalizeMatchAstroDetails', () => {
  it('renders only returned fields, in the canonical order', () => {
    // Key casing follows the existing /v1/astro_details shape used by
    // BasicTabView, and the alternate nakshatra spelling stays a fallback.
    const items = normalizeAstroPartyDetails({
      Naksahtra: 'Mrigashira',
      ascendant: 'Leo',
      Varna: 'Brahmin',
      Nakshatra: 'Ignored because Naksahtra is present',
    } as never);

    expect(items).toEqual([
      {label: 'Ascendant', value: 'Leo'},
      {label: 'Varna', value: 'Brahmin'},
      {label: 'Nakshatra', value: 'Mrigashira'},
    ]);
  });

  it('falls back to the alternate nakshatra spelling', () => {
    expect(normalizeAstroPartyDetails({Nakshatra: 'Ashwini'} as never)).toEqual(
      [{label: 'Nakshatra', value: 'Ashwini'}],
    );
  });

  it('covers every documented field and never throws on null', () => {
    expect(ASTRO_DETAIL_FIELDS.length).toBeGreaterThan(10);
    expect(normalizeAstroPartyDetails(null)).toEqual([]);
    expect(isAstroDetailsEmpty(normalizeMatchAstroDetails(null))).toBe(true);
  });
});

describe('normalizeMatchObstructions', () => {
  it('reads the vedha fields and paragraphs', () => {
    const data = normalizeMatchObstructions({
      is_present: true,
      vedha_name: 'Vedha Dosha Present',
      vedha_report: '<p>Blocked</p>',
    } as never);

    expect(data.isPresent).toBe(true);
    expect(data.vedhaName).toBe('Vedha Dosha Present');
    expect(data.reportParagraphs).toEqual(['Blocked']);
    expect(isMatchObstructionsEmpty(data)).toBe(false);
    expect(isMatchObstructionsEmpty(normalizeMatchObstructions(null))).toBe(
      true,
    );
  });
});

describe('normalizeMatchAshtakootPoints', () => {
  it('always returns all 8 kootas in order with the totals', () => {
    const data = normalizeMatchAshtakootPoints({
      varna: {
        male_koot_attribute: 'Do not match',
        female_koot_attribute: 'Match',
        received_points: 1,
        total_points: 1,
        description: 'Spiritual compatibility',
      },
      nadi: {male_koot_attribute: 'Aadi', received_points: 0},
      total: {total_points: 36, received_points: 24, minimum_required: 18},
      conclusion: {status: true, report: '<p>Match found</p>'},
    } as never);

    expect(data.kootas).toHaveLength(8);
    expect(KOOTA_KEYS.map(item => item.key)).toEqual([
      'varna',
      'vashya',
      'tara',
      'yoni',
      'maitri',
      'gan',
      'bhakut',
      'nadi',
    ]);
    expect(data.kootas.map(item => item.label)).toEqual([
      'VARNA',
      'VASHYA',
      'TARA',
      'YONI',
      'MAITRI',
      'GAN',
      'BHAKUT',
      'NADI',
    ]);
    expect(data.kootas[0].description).toBe('Spiritual compatibility');
    expect(data.kootas[1].maleValue).toBeNull();
    expect(data.totalPoints).toBe(36);
    expect(data.receivedPoints).toBe(24);
    expect(data.minimumRequired).toBe(18);
    expect(data.conclusionStatus).toBe(true);
    expect(data.conclusionParagraphs).toEqual(['Match found']);
    expect(isAshtakootEmpty(data)).toBe(false);
    expect(isAshtakootEmpty(normalizeMatchAshtakootPoints(null))).toBe(true);
  });
});

describe('fetchMatchMakingBundle', () => {
  const payload = buildMatchMakingPayload({male: MALE, female: FEMALE});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls all five endpoints in parallel with the shared payload', async () => {
    mocked.getMatchMakingReport.mockResolvedValue({} as never);
    mocked.getMatchManglikReport.mockResolvedValue({} as never);
    mocked.getMatchAstroDetails.mockResolvedValue({} as never);
    mocked.getMatchObstructions.mockResolvedValue({} as never);
    mocked.getMatchAshtakootPoints.mockResolvedValue({} as never);

    const bundle = await fetchMatchMakingBundle(payload);

    expect(mocked.getMatchMakingReport).toHaveBeenCalledWith(payload);
    expect(mocked.getMatchManglikReport).toHaveBeenCalledWith(payload);
    expect(mocked.getMatchAstroDetails).toHaveBeenCalledWith(payload);
    expect(mocked.getMatchObstructions).toHaveBeenCalledWith(payload);
    expect(mocked.getMatchAshtakootPoints).toHaveBeenCalledWith(payload);
    expect(bundle.errors).toEqual({});
    expect(bundle.hasAnyData).toBe(false);
  });

  it('keeps the other sections when one endpoint fails', async () => {
    mocked.getMatchMakingReport.mockRejectedValue(new Error('report boom'));
    mocked.getMatchManglikReport.mockResolvedValue({} as never);
    mocked.getMatchAstroDetails.mockResolvedValue({} as never);
    mocked.getMatchObstructions.mockResolvedValue({} as never);
    mocked.getMatchAshtakootPoints.mockResolvedValue({
      total: {total_points: 36, received_points: 21},
    } as never);

    const bundle = await fetchMatchMakingBundle(payload);

    expect(bundle.errors.report).toBe('report boom');
    expect(bundle.errors.manglik).toBeUndefined();
    expect(bundle.ashtakoot.receivedPoints).toBe(21);
    expect(bundle.hasAnyData).toBe(true);
  });

  it('throws only when every endpoint fails', async () => {
    mocked.getMatchMakingReport.mockRejectedValue(new Error('total failure'));
    mocked.getMatchManglikReport.mockRejectedValue(new Error('total failure'));
    mocked.getMatchAstroDetails.mockRejectedValue(new Error('total failure'));
    mocked.getMatchObstructions.mockRejectedValue(new Error('total failure'));
    mocked.getMatchAshtakootPoints.mockRejectedValue(
      new Error('total failure'),
    );

    await expect(fetchMatchMakingBundle(payload)).rejects.toThrow(
      'total failure',
    );
  });

  it('produces a usable fallback message for non-Error rejections', async () => {
    mocked.getMatchMakingReport.mockRejectedValue('plain string');
    mocked.getMatchManglikReport.mockResolvedValue({} as never);
    mocked.getMatchAstroDetails.mockResolvedValue({} as never);
    mocked.getMatchObstructions.mockResolvedValue({} as never);
    mocked.getMatchAshtakootPoints.mockResolvedValue({} as never);

    const bundle = await fetchMatchMakingBundle(payload);

    expect(bundle.errors.report).toBe(
      'Unable to load this section of the report.',
    );
  });
});
