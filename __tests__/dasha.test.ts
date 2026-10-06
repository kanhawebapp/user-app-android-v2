import type {
  AstrologyMuhurtaPayload,
  CurrentCharDashaResponse,
  CurrentYoginiDashaResponse,
  MajorCharDashaResponse,
  MajorYoginiDashaResponse,
} from '../src/services/api/astrologyApi/astrology.types';
import {
  DASHA_TABS,
  isDashaTab,
  normalizeCurrentCharDasha,
  normalizeCurrentYoginiDasha,
  normalizeMajorCharDasha,
  normalizeMajorYoginiDasha,
  resolveDashaInput,
  toDashaDurationText,
  toDashaInfoItems,
  toNamedDashaInfoItems,
} from '../src/features/free-services/utils/dasha';

/** The birth details the Kundli form produced for the request. */
const PAYLOAD: AstrologyMuhurtaPayload = {
  day: 10,
  month: 5,
  year: 1990,
  hour: 19,
  min: 55,
  lat: 19.2056,
  lon: 25.2056,
  tzone: 5.5,
};

describe('Char / Yogini Dasha utilities', () => {
  it('exposes the two report tabs', () => {
    expect(DASHA_TABS).toEqual([
      {key: 'char', label: 'Char Dasha'},
      {key: 'yogini', label: 'Yogini Dasha'},
    ]);
    expect(isDashaTab('char')).toBe(true);
    expect(isDashaTab('yogini')).toBe(true);
    expect(isDashaTab('mangal')).toBe(false);
  });
});

describe('normalizeMajorCharDasha', () => {
  const MAJOR_CHAR: MajorCharDashaResponse = [
    {
      sign_id: 10,
      sign_name: 'Aquarius',
      duration: '5 Years',
      start_date: '16-8-2015',
      end_date: '16-8-2020',
    },
    {
      sign_id: 11,
      sign_name: 'Pisces',
      duration: '7 Years',
      start_date: '16-8-2020',
      end_date: '16-8-2027',
    },
  ];

  it('keeps every major period with its sign details', () => {
    expect(normalizeMajorCharDasha(MAJOR_CHAR)).toEqual([
      {
        key: 'maj-char-10',
        name: 'Aquarius',
        duration: '5 Years',
        startDate: '16 August 2015',
        endDate: '16 August 2020',
      },
      {
        key: 'maj-char-11',
        name: 'Pisces',
        duration: '7 Years',
        startDate: '16 August 2020',
        endDate: '16 August 2027',
      },
    ]);
  });

  it('renders however many periods the API returns', () => {
    expect(normalizeMajorCharDasha([MAJOR_CHAR[0]])).toHaveLength(1);
  });

  it('handles missing, null and empty responses safely', () => {
    expect(normalizeMajorCharDasha(undefined)).toEqual([]);
    expect(normalizeMajorCharDasha(null)).toEqual([]);
    expect(normalizeMajorCharDasha([])).toEqual([]);
    expect(normalizeMajorCharDasha({} as MajorCharDashaResponse)).toEqual([]);
  });

  it('falls back to a safe label when the sign name is missing', () => {
    const [period] = normalizeMajorCharDasha([
      {sign_id: 4, duration: '2 Years'},
    ]);
    expect(period.name).toBe('Sign 4');
  });
});

describe('normalizeCurrentCharDasha', () => {
  const CURRENT_CHAR: CurrentCharDashaResponse = {
    dasha_date: '16-8-2015',
    major_dasha: {
      sign_id: 10,
      sign_name: 'Aquarius',
      duration: '5 Years',
      start_date: '16-8-2015',
      end_date: '16-8-2020',
    },
    sub_dasha: {
      sign_id: 11,
      sign_name: 'Pisces',
      duration: '5 Months',
      start_date: '16-8-2015',
      end_date: '16-1-2016',
    },
    sub_sub_dasha: [
      {
        sign_id: 0,
        sign_name: 'Aries',
        start_date: '16-8-2015',
        end_date: '28-8-2015',
      },
      {
        sign_id: 1,
        sign_name: 'Taurus',
        start_date: '28-8-2015',
        end_date: '9-9-2015',
      },
    ],
  };

  it('keeps dasha date, major and sub, and every sub-sub period', () => {
    const view = normalizeCurrentCharDasha(CURRENT_CHAR);
    expect(view).not.toBeNull();
    expect(view!.dashaDate).toBe('16 August 2015');
    expect(view!.major).toEqual({
      key: 'maj-char-10',
      name: 'Aquarius',
      duration: '5 Years',
      startDate: '16 August 2015',
      endDate: '16 August 2020',
    });
    expect(view!.sub).toEqual({
      key: 'sub-char-11',
      name: 'Pisces',
      duration: '5 Months',
      startDate: '16 August 2015',
      endDate: '16 January 2016',
    });
    expect(view!.subSub).toHaveLength(2);
    expect(view!.subSub[1].name).toBe('Taurus');
  });

  it('treats sub_sub_dasha as a list, never as a single object', () => {
    const view = normalizeCurrentCharDasha(CURRENT_CHAR);
    expect(Array.isArray(view!.subSub)).toBe(true);
    // Even when the API returns one object instead of an array, the view still
    // exposes a list (defensive, no crash).
    const isolated = normalizeCurrentCharDasha({
      major_dasha: CURRENT_CHAR.major_dasha,
      sub_sub_dasha: CURRENT_CHAR.sub_sub_dasha![0],
    } as CurrentCharDashaResponse);
    expect(Array.isArray(isolated?.subSub)).toBe(true);
  });

  it('handles missing responses and missing inner blocks', () => {
    expect(normalizeCurrentCharDasha(null)).toBeNull();
    expect(normalizeCurrentCharDasha(undefined)).toBeNull();
    const empty = normalizeCurrentCharDasha({});
    expect(empty).not.toBeNull();
    expect(empty!.major).toBeNull();
    expect(empty!.sub).toBeNull();
    expect(empty!.subSub).toEqual([]);
  });

  it('renders dash placeholders for missing dates and durations', () => {
    const view = normalizeCurrentCharDasha({
      ...CURRENT_CHAR,
      sub_dasha: {sign_name: 'Pisces'},
    });
    expect(view!.sub!.duration).toBe('—');
    expect(view!.sub!.startDate).toBe('—');
  });
});

describe('normalizeMajorYoginiDasha', () => {
  const MAJOR_YOGINI: MajorYoginiDashaResponse = [
    {
      dasha_id: 1,
      dasha_name: 'Pingla',
      start_date: '9-11-2000 5:9',
      end_date: '9-11-2002 5:9',
      start_ms: 973726740000,
      end_ms: 1036798740000,
      duration: 2,
    },
    {
      dasha_id: 2,
      dasha_name: 'Vishakti',
      start_date: '9-11-2002 5:9',
      end_date: '9-11-2003 5:9',
      start_ms: 1036798740000,
      end_ms: 1068331140000,
      duration: 1,
    },
  ];

  it('keeps every major period and converts numeric durations to years', () => {
    expect(normalizeMajorYoginiDasha(MAJOR_YOGINI)).toEqual([
      {
        key: 'maj-yog-1-0',
        name: 'Pingla',
        duration: '2 Years',
        startDate: '09 November 2000, 05:09 AM',
        endDate: '09 November 2002, 05:09 AM',
      },
      {
        key: 'maj-yog-2-1',
        name: 'Vishakti',
        duration: '1 Year',
        startDate: '09 November 2002, 05:09 AM',
        endDate: '09 November 2003, 05:09 AM',
      },
    ]);
  });

  it('does not expose milliseconds in the UI rows', () => {
    const [period] = normalizeMajorYoginiDasha(MAJOR_YOGINI);
    const [item] = toDashaInfoItems(period);
    expect(item).toEqual({label: 'Duration', value: '2 Years'});
  });

  it('keeps keys unique when the Yogini cycle repeats dasha_id', () => {
    // The Yogini cycle repeats, so `dasha_id` (and `dasha_name`) can appear
    // more than once. Every rendered sibling must still get a unique key.
    const repeated: MajorYoginiDashaResponse = [
      {dasha_id: 2, dasha_name: 'Dhanya', duration: 3},
      {dasha_id: 3, dasha_name: 'Bhramari', duration: 1},
      {dasha_id: 2, dasha_name: 'Dhanya', duration: 3},
    ];
    const periods = normalizeMajorYoginiDasha(repeated);
    const keys = periods.map(period => period.key);

    expect(keys).toEqual(['maj-yog-2-0', 'maj-yog-3-1', 'maj-yog-2-2']);
    expect(new Set(keys).size).toBe(keys.length);
    // The repeated period is kept and rendered, not filtered out.
    expect(periods).toHaveLength(3);
    expect(periods[0].name).toBe('Dhanya');
    expect(periods[0].duration).toBe('3 Years');
    expect(periods[2].name).toBe('Dhanya');
  });

  it('handles missing responses safely', () => {
    expect(normalizeMajorYoginiDasha(undefined)).toEqual([]);
    expect(normalizeMajorYoginiDasha(null)).toEqual([]);
    expect(normalizeMajorYoginiDasha([])).toEqual([]);
  });
});

describe('normalizeCurrentYoginiDasha', () => {
  const CURRENT_YOGINI: CurrentYoginiDashaResponse = {
    major_dasha: {
      dasha_id: 4,
      dasha_name: 'Bhadrika',
      duration: '5 Years',
      start_date: '1-3-2014 2:30',
      end_date: '1-3-2019 2:30',
    },
    sub_dasha: {
      dasha_id: 5,
      dasha_name: 'Ulka',
      start_date: '9-11-2014 18:0',
      end_date: '10-9-2015 4:0',
    },
    // NOTE: Yogini's sub_sub_dasha is a single OBJECT (unlike Char Dasha).
    sub_sub_dasha: {
      dasha_id: 4,
      dasha_name: 'Bhadrika',
      start_date: '29-7-2015 21:25',
      end_date: '10-9-2015 4:0',
    },
  };

  it('keeps major, sub and the single sub-sub object', () => {
    const view = normalizeCurrentYoginiDasha(CURRENT_YOGINI);
    expect(view).not.toBeNull();
    expect(view!.dashaDate).toBeNull();
    expect(view!.major).toEqual({
      key: 'maj-yog-4-0',
      name: 'Bhadrika',
      duration: '5 Years',
      startDate: '01 March 2014, 02:30 AM',
      endDate: '01 March 2019, 02:30 AM',
    });
    // The single sub-sub object is wrapped into a one-entry list for rendering.
    expect(view!.subSub).toHaveLength(1);
    expect(view!.subSub[0].name).toBe('Bhadrika');
    // Sub-dasha without a duration omits the Duration row but keeps dates.
    expect(toNamedDashaInfoItems(view!.sub!, 'Yogini')).toEqual([
      {label: 'Yogini', value: 'Ulka'},
      {label: 'Start Date', value: '09 November 2014, 06:00 PM'},
      {label: 'End Date', value: '10 September 2015, 04:00 AM'},
    ]);
  });

  it('handles missing responses safely', () => {
    expect(normalizeCurrentYoginiDasha(null)).toBeNull();
    expect(normalizeCurrentYoginiDasha(undefined)).toBeNull();
    expect(normalizeCurrentYoginiDasha({})?.subSub).toEqual([]);
  });
});

describe('toDashaDurationText', () => {
  it('formats numeric years and passes string durations through', () => {
    expect(toDashaDurationText(2)).toBe('2 Years');
    expect(toDashaDurationText(1)).toBe('1 Year');
    expect(toDashaDurationText('5 Months')).toBe('5 Months');
    expect(toDashaDurationText('5 Years')).toBe('5 Years');
  });

  it('maps empty and missing values to a dash placeholder', () => {
    expect(toDashaDurationText(undefined)).toBe('—');
    expect(toDashaDurationText(null)).toBe('—');
    expect(toDashaDurationText('')).toBe('—');
    expect(toDashaDurationText('-')).toBe('—');
  });
});

describe('resolveDashaInput', () => {
  it('maps the Kundli navigation result onto the API payload', () => {
    expect(resolveDashaInput({payload: PAYLOAD})).toEqual(PAYLOAD);
    expect(resolveDashaInput({payload: {...PAYLOAD}})).toEqual(PAYLOAD);
  });

  it('rejects incomplete birth details instead of sending zeros', () => {
    expect(
      resolveDashaInput({payload: {...PAYLOAD, lat: undefined}}),
    ).toBeNull();
    expect(
      resolveDashaInput({payload: {...PAYLOAD, lon: undefined}}),
    ).toBeNull();
    expect(resolveDashaInput({payload: {...PAYLOAD, tzone: ''}})).toBeNull();
    expect(resolveDashaInput({payload: {...PAYLOAD, hour: null}})).toBeNull();
  });

  it('rejects out-of-range and absent birth details', () => {
    expect(resolveDashaInput({payload: {...PAYLOAD, month: 13}})).toBeNull();
    expect(resolveDashaInput({payload: {...PAYLOAD, hour: 25}})).toBeNull();
    expect(resolveDashaInput({})).toBeNull();
    expect(resolveDashaInput(null)).toBeNull();
  });
});
