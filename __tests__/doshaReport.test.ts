import {
  formatPercent,
  getCurrentSadhesatiPhase,
  getSadhesatiPhaseLabel,
  htmlToParagraphs,
  humanizeLabel,
  isKalsarpaEmpty,
  isManglikEmpty,
  isPitraDoshaEmpty,
  isSadeSatiEmpty,
  mergeSadeSati,
  normalizeKalsarpa,
  normalizeManglik,
  normalizePitraDosha,
  normalizeSadhesatiEvents,
  normalizeSadhesatiStatus,
  presentText,
  toBoolean,
  toDisplayList,
} from '../src/features/free-services/utils/doshaReport';

describe('toBoolean', () => {
  it('maps real booleans, truthy/falsy strings and 0/1', () => {
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(false)).toBe(false);
    expect(toBoolean('true')).toBe(true);
    expect(toBoolean('1')).toBe(true);
    expect(toBoolean(1)).toBe(true);
    expect(toBoolean('false')).toBe(false);
    expect(toBoolean('0')).toBe(false);
    expect(toBoolean(0)).toBe(false);
  });

  it.each([['yes'], ['TRUE'], ['10'], [null], [undefined], [{}]])(
    'returns null for %s',
    value => {
      expect(toBoolean(value)).toBeNull();
    },
  );
});

describe('presentText', () => {
  it('renders Yes / No / em dash', () => {
    expect(presentText(true)).toBe('Yes');
    expect(presentText(false)).toBe('No');
    expect(presentText(null)).toBe('—');
    expect(presentText(undefined)).toBe('—');
  });
});

describe('htmlToParagraphs', () => {
  it('splits on <p> blocks and strips tags', () => {
    const result = htmlToParagraphs(
      '<p>First paragraph.</p><p>Second <b>bold</b> paragraph.</p>',
    );
    expect(result).toEqual(['First paragraph.', 'Second bold paragraph.']);
  });

  it('treats <br> as a space', () => {
    expect(htmlToParagraphs('<p>Line one<br/>Line two</p>')).toEqual([
      'Line one Line two',
    ]);
  });

  it('returns an empty array for missing/empty values', () => {
    expect(htmlToParagraphs(undefined)).toEqual([]);
    expect(htmlToParagraphs('')).toEqual([]);
    expect(htmlToParagraphs(null)).toEqual([]);
  });
});

describe('toDisplayList', () => {
  it('flattens string arrays', () => {
    expect(toDisplayList(['  a ', 'b'])).toEqual(['a', 'b']);
  });

  it('extracts a readable field from object items', () => {
    const items = [
      {description: 'From description'},
      {name: 'From name'},
      'plain text',
    ];
    expect(toDisplayList(items)).toEqual([
      'From description',
      'From name',
      'plain text',
    ]);
  });

  it('wraps a single string and ignores junk', () => {
    expect(toDisplayList('solo')).toEqual(['solo']);
    expect(toDisplayList(null)).toEqual([]);
    expect(toDisplayList(['', 5])).toEqual(['5']);
  });
});

describe('formatPercent', () => {
  it('rounds for display and nulls out missing values', () => {
    expect(formatPercent(12.6)).toBe('13%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(null)).toBeNull();
    expect(formatPercent(undefined)).toBeNull();
  });
});

describe('humanizeLabel', () => {
  it('turns snake case into title case', () => {
    expect(humanizeLabel('EFFECTIVE')).toBe('Effective');
    expect(humanizeLabel('based_on_house')).toBe('Based On House');
    expect(humanizeLabel(null)).toBeNull();
    expect(humanizeLabel('')).toBeNull();
  });
});

describe('normalizeManglik', () => {
  it('maps the response into a usable view model', () => {
    const data = normalizeManglik({
      is_present: 'true',
      manglik_status: 'LESS_EFFECTIVE',
      percentage_manglik_present: '55.5',
      percentage_manglik_after_cancellation: 20,
      is_mars_manglik_cancelled: 'false',
      manglik_report: '<p>Report text.</p>',
      manglik_cancel_rule: ['Rule one', 'Rule two'],
      manglik_present_rule: {
        based_on_aspect: ['Aspect one'],
        based_on_house: [{house: 'House two'}],
      },
    });

    expect(data.present).toBe(true);
    expect(data.status).toBe('Less Effective');
    expect(data.percentage).toBe(55.5);
    expect(data.percentageAfterCancellation).toBe(20);
    expect(data.isMarsCancelled).toBe(false);
    expect(data.reportParagraphs).toEqual(['Report text.']);
    expect(data.cancelRules).toEqual(['Rule one', 'Rule two']);
    expect(data.basedOnAspect).toEqual(['Aspect one']);
    expect(data.basedOnHouse).toEqual(['House two']);
  });

  it('tolerates a malformed response', () => {
    expect(normalizeManglik(null)).toMatchObject({
      present: null,
      status: null,
      percentage: null,
      reportParagraphs: [],
      cancelRules: [],
    });
    expect(isManglikEmpty(normalizeManglik(null))).toBe(true);
  });
});

describe('normalizeKalsarpa', () => {
  it('maps the response and reads report.report HTML', () => {
    const data = normalizeKalsarpa({
      present: true,
      type: 'SERPENT',
      name: 'Kalsarpa',
      one_line: 'One line summary',
      report: {house_id: 5, report: '<p>Kalsarpa report.</p>'},
    });

    expect(data.present).toBe(true);
    expect(data.type).toBe('Serpent');
    expect(data.name).toBe('Kalsarpa');
    expect(data.oneLine).toBe('One line summary');
    expect(data.house).toBe('5');
    expect(data.reportParagraphs).toEqual(['Kalsarpa report.']);
  });

  it('defensively maps array-shaped present fields to null', () => {
    const data = normalizeKalsarpa([
      {
        present: [true],
        type: ['ANANT'],
      },
    ] as unknown as Parameters<typeof normalizeKalsarpa>[0]);
    expect(data.present).toBeNull();
    expect(data.type).toBeNull();
  });

  it('reports empty when nothing usable exists', () => {
    expect(isKalsarpaEmpty(normalizeKalsarpa(null))).toBe(true);
  });
});

describe('normalizePitraDosha', () => {
  it('reads is_pitri_dosha_present and tolerates the alternate key', () => {
    const data = normalizePitraDosha({
      is_pitri_dosha_present: 'true',
      what_is_pitri_dosha: 'What is',
      conclusion: 'Conclusion',
      rules_matched: ['Rule'],
      effects: [{description: 'Effect'}],
      remedies: ['Remedy'],
    });
    expect(data.present).toBe(true);
    expect(data.whatIs).toBe('What is');
    expect(data.conclusion).toBe('Conclusion');
    expect(data.rulesMatched).toEqual(['Rule']);
    expect(data.effects).toEqual(['Effect']);
    expect(data.remedies).toEqual(['Remedy']);

    const alt = normalizePitraDosha({is_pitra_dosha_present: false});
    expect(alt.present).toBe(false);
  });

  it('reports empty when nothing usable exists', () => {
    expect(isPitraDoshaEmpty(normalizePitraDosha(null))).toBe(true);
  });
});

describe('Sade Sati lifecycle normalizers', () => {
  const PAST = Date.now() - 60_000;
  const FUTURE = Date.now() + 60_000;

  it('labels phases and maps events', () => {
    expect(getSadhesatiPhaseLabel('RISING_START')).toBe('Rising');
    expect(getSadhesatiPhaseLabel('PEAK_START')).toBe('Peak');
    expect(getSadhesatiPhaseLabel('SETTING_END')).toBe('Setting');
    expect(getSadhesatiPhaseLabel('UNKNOWN')).toBeNull();

    const phases = normalizeSadhesatiEvents([
      {
        type: 'RISING_START',
        date: '01-01-2020',
        millisecond: String(PAST),
        summary: 'Started rising',
        moon_sign: 'Aries',
        saturn_sign: 'Capricorn',
        is_saturn_retrograde: 'true',
      },
    ]);

    expect(phases[0]).toMatchObject({
      key: String(PAST),
      type: 'RISING_START',
      label: 'Rising',
      date: '01-01-2020',
      summary: 'Started rising',
      moonSign: 'Aries',
      saturnSign: 'Capricorn',
      isRetrograde: true,
    });
  });

  it('picks the latest passed phase as current', () => {
    const phases = [
      {key: String(PAST), type: 'RISING_START', label: 'Rising', summary: ''},
      {key: String(FUTURE), type: 'PEAK_START', label: 'Peak', summary: ''},
    ];
    expect(getCurrentSadhesatiPhase(phases)?.type).toBe('RISING_START');
  });

  it('returns null when no event has started yet', () => {
    const phases = [
      {key: String(FUTURE), type: 'PEAK_START', label: 'Peak', summary: ''},
    ];
    expect(getCurrentSadhesatiPhase(phases)).toBeNull();
  });
});

describe('mergeSadeSati', () => {
  const PAST = Date.now() - 60_000;
  const FUTURE = Date.now() + 60_000;

  it('combines status and lifecycle data, deriving present from events', () => {
    const phases = normalizeSadhesatiEvents([
      {type: 'RISING_START', date: '01-01-2023', millisecond: '0'},
      {type: 'PEAK_START', date: '01-01-2024', millisecond: String(PAST)},
      {type: 'SETTING_START', date: '01-01-2026', millisecond: String(FUTURE)},
    ]);

    const data = mergeSadeSati(
      phases,
      normalizeSadhesatiStatus({
        sadhesati_status: 'true',
        moon_sign: 'Leo',
        saturn_sign: 'Pisces',
        is_saturn_retrograde: 'false',
        is_undergoing_sadhesati: 'Currently undergoing',
        consideration_date: '01-01-2025',
        what_is_sadhesati: 'Explanation',
      }),
    );

    expect(data.present).toBe(true);
    expect(data.currentPhase?.type).toBe('PEAK_START');
    expect(data.phases.map(phase => phase.type)).toEqual([
      'RISING_START',
      'PEAK_START',
      'SETTING_START',
    ]);
    expect(data.moonSign).toBe('Leo');
    expect(data.saturnSign).toBe('Pisces');
    expect(data.saturnRetrograde).toBe(false);
    expect(data.isUndergoing).toBe('Currently undergoing');
    expect(data.considerationDate).toBe('01-01-2025');
    expect(data.whatIs).toBe('Explanation');
  });

  it('derives present from the latest passed lifecycle event', () => {
    const phases = normalizeSadhesatiEvents([
      {type: 'RISING_END', date: '01-01-2023', millisecond: String(PAST)},
      {type: 'PEAK_START', date: '01-01-2024', millisecond: String(FUTURE)},
    ]);
    expect(mergeSadeSati(phases, null).present).toBe(false);
  });

  it('reports empty when nothing usable exists', () => {
    expect(isSadeSatiEmpty(mergeSadeSati([], null))).toBe(true);
  });
});
