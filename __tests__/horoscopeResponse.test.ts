import {
  getHoroscopeViewModel,
  HOROSCOPE_SECTIONS,
} from '../src/features/horoscope/utils/horoscopeResponse';

const TEXTS = {
  personal_life: 'Love description',
  profession: 'Work description',
  health: 'Health description',
  emotions: 'Emotion description',
  travel: 'Travel description',
  luck: 'Luck description',
};

const RATINGS = {
  personal_life_rating: 6,
  profession_rating: 7,
  health_rating: 5,
  emotions_rating: 6,
  travel_rating: 8,
  luck_rating: 7,
};

describe('HOROSCOPE_SECTIONS', () => {
  it('exposes six prediction sections in the required order', () => {
    expect(HOROSCOPE_SECTIONS).toHaveLength(6);
    expect(HOROSCOPE_SECTIONS.map(s => s.label)).toEqual([
      'Personal Life',
      'Profession',
      'Health',
      'Emotions',
      'Travel',
      'Luck',
    ]);
    expect(HOROSCOPE_SECTIONS.map(s => s.emoji)).toEqual([
      '❤️',
      '💼',
      '💚',
      '😊',
      '✈️',
      '🍀',
    ]);
  });
});

describe('getHoroscopeViewModel', () => {
  it('returns null for null / undefined input', () => {
    expect(getHoroscopeViewModel(null)).toBeNull();
    expect(getHoroscopeViewModel(undefined)).toBeNull();
  });

  it('normalises the flat "today" response (no date, no ratings)', () => {
    const vm = getHoroscopeViewModel({...TEXTS});

    expect(vm).not.toBeNull();
    expect(vm?.date).toBeUndefined();
    expect(vm?.hasRatings).toBe(false);
    expect(vm?.sections.map(s => s.description)).toEqual([
      'Love description',
      'Work description',
      'Health description',
      'Emotion description',
      'Travel description',
      'Luck description',
    ]);
    // no rating values present
    expect(vm?.sections.every(s => s.rating === undefined)).toBe(true);
  });

  it('normalises the nested "previous/next" response (date + ratings)', () => {
    const vm = getHoroscopeViewModel({
      status: true,
      sun_sign: 'aries',
      prediction_date: '21-3-2024',
      prediction: {...TEXTS, ...RATINGS},
    });

    expect(vm?.date).toBe('21-3-2024');
    expect(vm?.sunSign).toBe('aries');
    expect(vm?.hasRatings).toBe(true);
    expect(vm?.sections[0].description).toBe('Love description');
    expect(vm?.sections[0].rating).toBe(6);
    expect(vm?.sections[5].rating).toBe(7);
  });

  it('shows ratings only when at least one rating exists', () => {
    const vm = getHoroscopeViewModel({
      prediction_date: '1-1-2024',
      prediction: {
        ...TEXTS,
        personal_life_rating: 4,
        // other ratings omitted -> missing
      },
    });

    expect(vm?.hasRatings).toBe(true);
    expect(vm?.sections[0].rating).toBe(4);
    expect(vm?.sections[1].rating).toBeUndefined();
  });

  it('exposes undefined (rendered as "-") for missing prediction text', () => {
    const vm = getHoroscopeViewModel({
      personal_life: 'Only personal life present',
    });

    expect(vm?.sections[0].description).toBe('Only personal life present');
    expect(vm?.sections[0].rating).toBeUndefined();
    expect(vm?.sections[1].description).toBeUndefined();
  });
});
