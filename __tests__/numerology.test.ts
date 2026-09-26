import {
  isNumerologyCard,
  buildNumeroPayload,
  resolveNumeroInput,
} from '../src/features/free-services/utils/kundliService';
import {
  buildNumerologySections,
  isNumerologySectionEmpty,
  type NumerologySection,
  type NumerologyResponses,
} from '../src/features/free-services/utils/numerology';

const ok = <T>(data: T) => ({data, error: null, loading: false});
const loading = () => ({data: null, error: null, loading: true});
const failed = (message: string) => ({
  data: null,
  error: new Error(message),
  loading: false,
});

const emptyResponses = (): NumerologyResponses => ({
  prediction: loading(),
  table: loading(),
  report: loading(),
  favTime: loading(),
  placeVastu: loading(),
  fastsReport: loading(),
  favLord: loading(),
  favMantra: loading(),
});

const filledResponses = (): NumerologyResponses => ({
  prediction: ok({
    prediction: 'Today is auspicious',
    lucky_color: 'Blue',
    lucky_number: '7',
    prediction_date: '2026-09-26',
  }),
  table: ok({
    destiny_number: 5,
    radical_number: 3,
    name_number: 8,
    evil_num: '13',
    friendly_num: '1, 3',
    neutral_num: '6, 7',
    fav_color: 'Blue',
    fav_day: 'Thursday',
    fav_god: 'Shiva',
    fav_mantra: 'Om Namah Shivaya',
    fav_metal: 'Silver',
    fav_stone: 'Amethyst',
    fav_substone: 'Clear Quartz',
    radical_num: '3',
    radical_ruler: 'Jupiter',
  }),
  report: ok({
    title: 'Number Says',
    description: 'You are a seeker.',
  }),
  favTime: ok({title: 'Fav Time', description: 'Morning 6-8 AM'}),
  placeVastu: ok({title: 'Vastu', description: 'North side'}),
  fastsReport: ok({title: 'Fasts', description: 'Ekadashi'}),
  favLord: ok({title: 'Lord', description: 'Worship Lord Shiva'}),
  favMantra: ok({title: 'Mantra', description: 'Gayatri Mantra'}),
});

describe('isNumerologyCard', () => {
  it('returns true for the Numerology card', () => {
    expect(isNumerologyCard('Numerology')).toBe(true);
    expect(isNumerologyCard('numerology')).toBe(true);
    expect(isNumerologyCard('Your numerology details')).toBe(true);
  });

  it('returns false for unrelated cards', () => {
    expect(isNumerologyCard('Nakshatra')).toBe(false);
    expect(isNumerologyCard('')).toBe(false);
  });
});

describe('buildNumeroPayload', () => {
  it('builds the numerology payload from name + day/month/year', () => {
    expect(buildNumeroPayload({day: 10, month: 5, year: 1990}, 'Ari')).toEqual({
      name: 'Ari',
      day: 10,
      month: 5,
      year: 1990,
    });
  });

  it('trims the name and defaults to an empty string', () => {
    expect(buildNumeroPayload({day: 1, month: 1, year: 2000})).toEqual({
      name: '',
      day: 1,
      month: 1,
      year: 2000,
    });
  });

  it('falls back to 0 for missing numbers', () => {
    const payload = buildNumeroPayload({}, 'Ari');
    expect(payload.day).toBe(0);
    expect(payload.year).toBe(0);
  });
});

describe('resolveNumeroInput', () => {
  it('uses the name + day/month/year from the result payload', () => {
    const result = {
      name: 'Ari',
      payload: {day: 10, month: 5, year: 1990},
    };
    expect(resolveNumeroInput(result, null)).toEqual({
      name: 'Ari',
      day: 10,
      month: 5,
      year: 1990,
    });
  });

  it('prefers the result name over the user name', () => {
    const result = {name: 'Ari', payload: {day: 1, month: 1, year: 2000}};
    expect(
      resolveNumeroInput(result, {name: 'Other', dateOfBirth: '1990-05-10'}),
    ).toEqual({
      name: 'Ari',
      day: 1,
      month: 1,
      year: 2000,
    });
  });

  it('falls back to the user profile ISO date when payload is missing', () => {
    const result = {name: ''};
    expect(
      resolveNumeroInput(result, {name: 'Ari', dateOfBirth: '1990-05-10'}),
    ).toEqual({name: 'Ari', day: 10, month: 5, year: 1990});
  });

  it('falls back to the user profile DD-MM-YYYY date', () => {
    const result = {name: ''};
    expect(
      resolveNumeroInput(result, {name: 'Ari', dateOfBirth: '10-05-1990'}),
    ).toEqual({name: 'Ari', day: 10, month: 5, year: 1990});
  });

  it('returns null when neither payload nor a usable date is available', () => {
    expect(resolveNumeroInput({}, null)).toBeNull();
    expect(resolveNumeroInput({}, {name: 'Ari'})).toBeNull();
  });
});

describe('buildNumerologySections', () => {
  it('builds all ten sections in the expected order', () => {
    const sections = buildNumerologySections(filledResponses());
    expect(sections).toHaveLength(10);
    expect(sections.map(s => [s.kind, s.key])).toEqual([
      ['prediction', 'numerology-prediction'],
      ['info', 'numerology-numbers'],
      ['info', 'numerology-evil-neutral'],
      ['info', 'numerology-favorites'],
      ['report', 'numerology-report'],
      ['report', 'numerology-fav-time'],
      ['report', 'numerology-place-vastu'],
      ['report', 'numerology-fasts'],
      ['report', 'numerology-fav-lord'],
      ['report', 'numerology-fav-mantra'],
    ]);
  });

  it('maps the prediction fields correctly', () => {
    const [prediction] = buildNumerologySections(filledResponses());
    expect(prediction.kind).toBe('prediction');
    expect(prediction.title).toBe("Today's Prediction");
    expect(prediction.description).toBe('Today is auspicious');
    expect(prediction.items).toEqual([
      {label: 'Lucky Color', value: 'Blue'},
      {label: 'Lucky Number', value: '7'},
    ]);
    expect(prediction.loading).toBe(false);
    expect(prediction.error).toBeNull();
  });

  it('maps the table fields into the info sections', () => {
    const sections = buildNumerologySections(filledResponses());
    const numbers = sections[1];
    const evilNeutral = sections[2];
    const favorites = sections[3];

    expect(numbers.kind).toBe('info');
    expect(numbers.items).toEqual([
      {label: 'Destiny Number', value: 5},
      {label: 'Radical Number', value: 3},
      {label: 'Name Number', value: 8},
    ]);

    expect(evilNeutral.items).toEqual([
      {label: 'Evil Numbers', value: '13'},
      {label: 'Friendly Numbers', value: '1, 3'},
      {label: 'Neutral Numbers', value: '6, 7'},
    ]);

    expect(favorites.items).toContainEqual({
      label: 'Favorite God',
      value: 'Shiva',
    });
    expect(favorites.items).toContainEqual({
      label: 'Radical Ruler',
      value: 'Jupiter',
    });
  });

  it('uses the API title when present, otherwise the fallback label', () => {
    const sections = buildNumerologySections(filledResponses());
    expect(sections[4].title).toBe('Number Says');
    expect(sections[5].title).toBe('Fav Time');
  });

  it('passes loading/error through from each API result', () => {
    const responses = emptyResponses();
    const sections = buildNumerologySections(responses);
    expect(sections.every(s => s.loading)).toBe(true);
    expect(sections.every(s => s.error === null)).toBe(true);

    const failedResponses: NumerologyResponses = {
      ...filledResponses(),
      prediction: failed('Prediction failed'),
    };
    const [failedPrediction] = buildNumerologySections(failedResponses);
    expect(failedPrediction.loading).toBe(false);
    expect(failedPrediction.error?.message).toBe('Prediction failed');
  });
});

describe('isNumerologySectionEmpty', () => {
  it('returns true for a fully-empty report/info section', () => {
    const emptySection: NumerologySection = {
      kind: 'report',
      key: 'empty',
      title: 'Empty',
      icon: {name: 'test', library: 'MaterialIcons'},
      description: null,
      loading: false,
      error: null,
    };
    expect(isNumerologySectionEmpty(emptySection)).toBe(true);
  });

  it('returns false when the report has a description', () => {
    const section: NumerologySection = {
      kind: 'report',
      key: 'with-desc',
      title: 'With',
      icon: {name: 'test', library: 'MaterialIcons'},
      description: 'Some text',
      loading: false,
      error: null,
    };
    expect(isNumerologySectionEmpty(section)).toBe(false);
  });

  it('returns false when the section is errored', () => {
    const section: NumerologySection = {
      kind: 'report',
      key: 'errored',
      title: 'Errored',
      icon: {name: 'test', library: 'MaterialIcons'},
      description: null,
      loading: false,
      error: new Error('boom'),
    };
    expect(isNumerologySectionEmpty(section)).toBe(false);
  });
});
