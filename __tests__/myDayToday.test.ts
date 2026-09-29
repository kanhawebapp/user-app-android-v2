import {
  buildMyDayTodayViewModel,
  buildPredictionDateLabel,
  formatPredictionDate,
  getTodayCacheSuffix,
  getTodayDisplayDate,
  isMyDayTodayViewModelEmpty,
  isNumeroInputComplete,
  resolveMyDayTodayInput,
} from '../src/features/free-services/utils/myDayToday';
import {isMyDayTodayCard} from '../src/features/free-services/utils/kundliService';

describe('isMyDayTodayCard', () => {
  it('matches the My Day Today kundli card', () => {
    expect(isMyDayTodayCard('My Day Today')).toBe(true);
    expect(isMyDayTodayCard('my day today')).toBe(true);
  });

  it('does not match other kundli cards', () => {
    expect(isMyDayTodayCard('Numerology')).toBe(false);
    expect(isMyDayTodayCard('General Life Prediction')).toBe(false);
    expect(isMyDayTodayCard(undefined as unknown as string)).toBe(false);
  });
});

describe('formatPredictionDate', () => {
  it('formats the API DD-MM-YYYY value', () => {
    expect(formatPredictionDate('17-6-2017')).toBe('17-6-2017');
    expect(formatPredictionDate('29-09-2026')).toBe('29-9-2026');
  });

  it('formats an ISO date without a timezone shift', () => {
    expect(formatPredictionDate('2026-09-29')).toBe('29-9-2026');
    expect(formatPredictionDate('1990-05-10T00:00:00Z')).toBe('10-5-1990');
  });

  it('returns null for missing or unrecognised values', () => {
    expect(formatPredictionDate(undefined)).toBeNull();
    expect(formatPredictionDate(null)).toBeNull();
    expect(formatPredictionDate('   ')).toBeNull();
    expect(formatPredictionDate('not-a-date')).toBeNull();
  });
});

describe('buildPredictionDateLabel', () => {
  it('uses the API prediction date when available', () => {
    expect(buildPredictionDateLabel('17-6-2017', new Date(2026, 8, 29))).toBe(
      "Today's Prediction - 17-6-2017",
    );
  });

  it('falls back to today when the API date is missing', () => {
    expect(buildPredictionDateLabel(null, new Date(2026, 8, 29))).toBe(
      "Today's Prediction - 29-9-2026",
    );
  });
});

describe('today helpers', () => {
  it('reads local date parts (no UTC shift)', () => {
    expect(getTodayDisplayDate(new Date(2026, 8, 29))).toBe('29-9-2026');
    expect(getTodayDisplayDate(new Date(1990, 0, 1))).toBe('1-1-1990');
  });

  it('builds a stable day cache suffix', () => {
    expect(getTodayCacheSuffix(new Date(2026, 8, 29))).toBe('2026-09-29');
    expect(getTodayCacheSuffix(new Date(2026, 8, 29))).not.toBe(
      getTodayCacheSuffix(new Date(2026, 8, 30)),
    );
  });
});

describe('isNumeroInputComplete', () => {
  it('accepts a name with a full DOB', () => {
    expect(
      isNumeroInputComplete({name: 'Ari', day: 10, month: 5, year: 1990}),
    ).toBe(true);
  });

  it('rejects a missing name or incomplete DOB', () => {
    expect(isNumeroInputComplete(null)).toBe(false);
    expect(
      isNumeroInputComplete({name: '', day: 10, month: 5, year: 1990}),
    ).toBe(false);
    expect(
      isNumeroInputComplete({name: 'Ari', day: 0, month: 5, year: 1990}),
    ).toBe(false);
    expect(
      isNumeroInputComplete({name: 'Ari', day: 10, month: 5, year: 0}),
    ).toBe(false);
  });
});

describe('resolveMyDayTodayInput', () => {
  it('prefers the kundli form name + payload', () => {
    const payload = resolveMyDayTodayInput(
      {name: 'Ravi', payload: {day: 15, month: 8, year: 1995}},
      {name: 'Profile Name', dateOfBirth: '1990-05-10'},
    );
    expect(payload).toEqual({name: 'Ravi', day: 15, month: 8, year: 1995});
  });

  it('falls back to the stored profile DOB without shifting the date', () => {
    const payload = resolveMyDayTodayInput(null, {
      name: 'Ari',
      dateOfBirth: '1990-05-10',
    });
    expect(payload).toEqual({name: 'Ari', day: 10, month: 5, year: 1990});
  });

  it('supports a DD-MM-YYYY profile DOB', () => {
    const payload = resolveMyDayTodayInput(null, {
      name: 'Ari',
      dateOfBirth: '15-08-1995',
    });
    expect(payload).toEqual({name: 'Ari', day: 15, month: 8, year: 1995});
  });

  it('returns null when the DOB is missing', () => {
    expect(resolveMyDayTodayInput(null, {name: 'Ari'})).toBeNull();
    expect(
      resolveMyDayTodayInput(null, {name: 'Ari', dateOfBirth: 'garbage'}),
    ).toBeNull();
    expect(resolveMyDayTodayInput(null, null)).toBeNull();
  });

  it('returns null when the name is missing', () => {
    expect(
      resolveMyDayTodayInput(
        {payload: {day: 1, month: 1, year: 2000}},
        {
          name: '',
        },
      ),
    ).toBeNull();
  });
});

describe('buildMyDayTodayViewModel', () => {
  const at = new Date(2026, 8, 29);

  it('maps the API response to display values', () => {
    const viewModel = buildMyDayTodayViewModel(
      {
        prediction: 'You would be straightforward in providing solutions.',
        lucky_color: 'copper',
        lucky_number: '1',
        prediction_date: '29-9-2026',
      },
      at,
    );

    expect(viewModel.title).toBe('Prediction of the Day');
    expect(viewModel.dateLabel).toBe("Today's Prediction - 29-9-2026");
    expect(viewModel.prediction).toBe(
      'You would be straightforward in providing solutions.',
    );
    expect(viewModel.items).toEqual([
      {label: 'Lucky Color', value: 'copper'},
      {label: 'Lucky Number', value: '1'},
    ]);
    expect(isMyDayTodayViewModelEmpty(viewModel)).toBe(false);
  });

  it('handles an empty response safely', () => {
    const viewModel = buildMyDayTodayViewModel({}, at);
    expect(viewModel.prediction).toBeNull();
    expect(viewModel.dateLabel).toBe("Today's Prediction - 29-9-2026");
    expect(viewModel.items).toEqual([
      {label: 'Lucky Color', value: undefined},
      {label: 'Lucky Number', value: undefined},
    ]);
    expect(isMyDayTodayViewModelEmpty(viewModel)).toBe(true);
  });

  it('handles a null response safely', () => {
    const viewModel = buildMyDayTodayViewModel(null, at);
    expect(viewModel.prediction).toBeNull();
    expect(isMyDayTodayViewModelEmpty(viewModel)).toBe(true);
  });

  it('treats a blank prediction string as empty', () => {
    const viewModel = buildMyDayTodayViewModel(
      {prediction: '   ', lucky_color: 'gold'},
      at,
    );
    expect(viewModel.prediction).toBeNull();
    expect(isMyDayTodayViewModelEmpty(viewModel)).toBe(false);
  });
});
