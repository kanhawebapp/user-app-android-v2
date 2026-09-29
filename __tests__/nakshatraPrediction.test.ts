import {
  getTabReferenceDate,
  isNakshatraPredictionEmpty,
  isNakshatraPredictionTab,
  NAKSHATRA_PREDICTION_ENDPOINTS,
  NAKSHATRA_PREDICTION_SECTIONS,
  NAKSHATRA_PREDICTION_TABS,
  normalizeNakshatraPrediction,
  resolveNakshatraPredictionInput,
  resolvePredictionDate,
} from '../src/features/free-services/utils/nakshatraPrediction';
import {isNakshatraCard} from '../src/features/free-services/utils/kundliService';

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

const RESPONSE = {
  birth_moon_sign: 'Cancer',
  birth_moon_nakshatra: 'Punarvasu',
  prediction: {
    health: 'Health text',
    emotions: 'Emotions text',
    profession: 'Profession text',
    luck: 'Luck text',
    personal_life: 'Personal life text',
    travel: 'Travel text',
  },
  prediction_date: '7 July 2017',
};

describe('isNakshatraCard', () => {
  it('matches the Nakshatra kundli card', () => {
    expect(isNakshatraCard('Nakshatra')).toBe(true);
    expect(isNakshatraCard('nakshatra')).toBe(true);
  });

  it('does not match the other kundli cards', () => {
    expect(isNakshatraCard('Numerology')).toBe(false);
    expect(isNakshatraCard('My Day Today')).toBe(false);
    expect(isNakshatraCard('General Life Prediction')).toBe(false);
    expect(isNakshatraCard(undefined as unknown as string)).toBe(false);
  });
});

describe('resolveNakshatraPredictionInput', () => {
  it('builds the request body from the Kundli flow payload', () => {
    expect(resolveNakshatraPredictionInput({payload: BIRTH_PAYLOAD})).toEqual({
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

  it('accepts the payload passed directly', () => {
    expect(resolveNakshatraPredictionInput(BIRTH_PAYLOAD)?.year).toBe(1995);
  });

  it('returns null when there is no payload at all', () => {
    expect(resolveNakshatraPredictionInput(undefined)).toBeNull();
    expect(resolveNakshatraPredictionInput(null)).toBeNull();
    expect(resolveNakshatraPredictionInput({})).toBeNull();
  });

  it.each([
    ['date of birth', {day: 0}],
    ['month', {month: 13}],
    ['year', {year: 0}],
    ['birth time', {hour: 25, min: 70}],
    ['latitude', {lat: 91}],
    ['longitude', {lon: 181}],
  ])('returns null when the %s is out of range', (_label, override) => {
    expect(
      resolveNakshatraPredictionInput({
        payload: {...BIRTH_PAYLOAD, ...override},
      }),
    ).toBeNull();
  });

  it.each(['day', 'month', 'year', 'hour', 'min', 'lat', 'lon', 'tzone'])(
    'returns null when %s is missing instead of defaulting it',
    key => {
      const payload: Record<string, unknown> = {...BIRTH_PAYLOAD};
      delete payload[key];

      // `buildBasicDetailsPayload` would coerce a missing value to 0, which
      // would silently compute the chart for the wrong place / moment.
      expect(resolveNakshatraPredictionInput({payload})).toBeNull();
    },
  );

  it('accepts a birth moment at midnight in UTC', () => {
    expect(
      resolveNakshatraPredictionInput({
        payload: {...BIRTH_PAYLOAD, hour: 0, min: 0, tzone: 0},
      }),
    ).toEqual({
      day: 15,
      month: 8,
      year: 1995,
      hour: 0,
      min: 0,
      lat: 28.6139,
      lon: 77.209,
      tzone: 0,
    });
  });
});

describe('tab definitions', () => {
  it('exposes Yesterday / Today / Tomorrow in order', () => {
    expect(NAKSHATRA_PREDICTION_TABS.map(tab => tab.label)).toEqual([
      'Yesterday',
      'Today',
      'Tomorrow',
    ]);
  });

  it('maps every tab to its endpoint', () => {
    expect(NAKSHATRA_PREDICTION_ENDPOINTS).toEqual({
      yesterday: 'daily_nakshatra_prediction/previous',
      today: 'daily_nakshatra_prediction',
      tomorrow: 'daily_nakshatra_prediction/next',
    });
  });

  it('narrows a tab id coming from the segmented control', () => {
    expect(isNakshatraPredictionTab('yesterday')).toBe(true);
    expect(isNakshatraPredictionTab('today')).toBe(true);
    expect(isNakshatraPredictionTab('tomorrow')).toBe(true);
    expect(isNakshatraPredictionTab('next')).toBe(false);
  });
});

describe('getTabReferenceDate', () => {
  const at = new Date(2026, 8, 29, 10, 0, 0);

  it('reads local date parts without a UTC shift', () => {
    expect(getTabReferenceDate('today', at)).toBe('29 September 2026');
  });

  it('shifts a day for yesterday and tomorrow', () => {
    expect(getTabReferenceDate('yesterday', at)).toBe('28 September 2026');
    expect(getTabReferenceDate('tomorrow', at)).toBe('30 September 2026');
  });

  it('crosses a month boundary', () => {
    expect(getTabReferenceDate('tomorrow', new Date(2026, 8, 30))).toBe(
      '1 October 2026',
    );
    expect(getTabReferenceDate('yesterday', new Date(2026, 0, 1))).toBe(
      '31 December 2025',
    );
  });
});

describe('resolvePredictionDate', () => {
  it('uses the API prediction date when present', () => {
    expect(
      resolvePredictionDate('7 July 2017', 'today', new Date(2026, 8, 29)),
    ).toBe('7 July 2017');
  });

  it('falls back to the tab reference date when missing or blank', () => {
    expect(
      resolvePredictionDate(null, 'yesterday', new Date(2026, 8, 29)),
    ).toBe('28 September 2026');
    expect(
      resolvePredictionDate('   ', 'tomorrow', new Date(2026, 8, 29)),
    ).toBe('30 September 2026');
  });
});

describe('normalizeNakshatraPrediction', () => {
  it('returns null without a response', () => {
    expect(normalizeNakshatraPrediction(null, 'today')).toBeNull();
    expect(normalizeNakshatraPrediction(undefined, 'today')).toBeNull();
  });

  it.each(['yesterday', 'today', 'tomorrow'] as const)(
    'exposes every field for the %s tab',
    tab => {
      const viewModel = normalizeNakshatraPrediction(RESPONSE, tab)!;

      const label =
        tab === 'yesterday'
          ? 'Yesterday'
          : tab === 'today'
          ? 'Today'
          : 'Tomorrow';

      expect(viewModel.title).toBe(`Nakshatra Prediction: ${label}`);
      expect(viewModel.moonSign).toBe('Cancer');
      expect(viewModel.nakshatra).toBe('Punarvasu');
      expect(viewModel.date).toBe('7 July 2017');
      expect(viewModel.sections.map(section => section.title)).toEqual(
        NAKSHATRA_PREDICTION_SECTIONS.map(section => section.title),
      );
      expect(viewModel.sections.map(section => section.text)).toEqual([
        'Health text',
        'Emotions text',
        'Profession text',
        'Luck text',
        'Personal life text',
        'Travel text',
      ]);
    },
  );

  it('never renders undefined or null for missing fields', () => {
    const viewModel = normalizeNakshatraPrediction(
      {prediction: {health: '  ', emotions: null}},
      'today',
    )!;

    expect(viewModel.moonSign).toBe('—');
    expect(viewModel.nakshatra).toBe('—');
    expect(viewModel.date).toBe('29 September 2026');
    expect(viewModel.sections[0].text).toBeNull();
    expect(viewModel.sections[1].text).toBeNull();
    expect(viewModel.sections[2].text).toBeNull();
  });

  it('tolerates a missing prediction block', () => {
    const viewModel = normalizeNakshatraPrediction(
      {birth_moon_sign: 'Virgo', birth_moon_nakshatra: 'Uttra Phalguni'},
      'today',
    )!;

    expect(viewModel.moonSign).toBe('Virgo');
    expect(viewModel.sections.every(section => section.text === null)).toBe(
      true,
    );
  });

  it('handles a non-string prediction value', () => {
    const viewModel = normalizeNakshatraPrediction(
      {prediction: {luck: 42} as never},
      'today',
    )!;

    expect(
      viewModel.sections.find(section => section.key === 'luck')?.text,
    ).toBe(null);
  });
});

describe('isNakshatraPredictionEmpty', () => {
  it('is true without a view model', () => {
    expect(isNakshatraPredictionEmpty(null)).toBe(true);
  });

  it('is true when the response carries nothing', () => {
    expect(normalizeNakshatraPrediction({}, 'today')).not.toBeNull();
    expect(
      isNakshatraPredictionEmpty(normalizeNakshatraPrediction({}, 'today')),
    ).toBe(true);
  });

  it('is false when the moon details or a section text is present', () => {
    expect(
      isNakshatraPredictionEmpty(
        normalizeNakshatraPrediction({birth_moon_sign: 'Cancer'}, 'today'),
      ),
    ).toBe(false);

    expect(
      isNakshatraPredictionEmpty(
        normalizeNakshatraPrediction({prediction: {health: 'ok'}}, 'today'),
      ),
    ).toBe(false);
  });
});
