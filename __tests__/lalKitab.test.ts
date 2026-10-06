import {
  getSoyaLabel,
  isLalKitabDebtsEmpty,
  isLalKitabHousesEmpty,
  isLalKitabHoroscopeEmpty,
  isLalKitabPlanetsEmpty,
  isLalKitabTab,
  LAL_KITAB_TABS,
  normalizeLalKitabDebts,
  normalizeLalKitabHouses,
  normalizeLalKitabHoroscope,
  normalizeLalKitabPlanets,
} from '../src/features/free-services/utils/lalKitab';

describe('Lal Kitab tabs', () => {
  it('exposes the four reports in display order', () => {
    expect(LAL_KITAB_TABS).toEqual([
      {key: 'horoscope', label: 'Horoscope'},
      {key: 'debts', label: 'Debts'},
      {key: 'houses', label: 'Houses'},
      {key: 'planets', label: 'Planets'},
    ]);
  });

  it('narrows only known tab ids', () => {
    expect(isLalKitabTab('horoscope')).toBe(true);
    expect(isLalKitabTab('houses')).toBe(true);
    expect(isLalKitabTab('manglik')).toBe(false);
    expect(isLalKitabTab('')).toBe(false);
  });
});

describe('normalizeLalKitabHoroscope', () => {
  it('keeps sign number, name, planets and degrees', () => {
    const signs = normalizeLalKitabHoroscope([
      {
        sign: 1,
        sign_name: 'Aries',
        planet: ['Sun', 'Mars'],
        planet_small: ['Su', 'Ma'],
        planet_degree: ['12.1895', '7.5'],
      },
    ]);

    expect(signs).toHaveLength(1);
    expect(signs[0].signNumber).toBe('1');
    expect(signs[0].signName).toBe('Aries');
    expect(signs[0].isEmpty).toBe(false);
    expect(signs[0].placements).toEqual([
      {name: 'Sun', short: 'Su', degree: '12.19°'},
      {name: 'Mars', short: 'Ma', degree: '7.50°'},
    ]);
  });

  it('flags a sign with no planets and never invents a degree', () => {
    const signs = normalizeLalKitabHoroscope([
      {
        sign: 3,
        sign_name: 'Gemini',
        planet: [],
        planet_small: [],
        planet_degree: [],
      },
    ]);

    expect(signs[0].isEmpty).toBe(true);
    expect(signs[0].placements).toEqual([]);
  });

  it('keeps each degree with its own planet when the list is short', () => {
    const signs = normalizeLalKitabHoroscope([
      {
        sign: 4,
        sign_name: 'Cancer',
        planet: ['Sun', 'Mars', 'Venus'],
        planet_small: ['Su'],
        planet_degree: ['12.1895'],
      },
    ]);

    expect(signs[0].placements).toEqual([
      {name: 'Sun', short: 'Su', degree: '12.19°'},
      {name: 'Mars', short: null, degree: null},
      {name: 'Venus', short: null, degree: null},
    ]);
  });

  it('tolerates a missing, null or malformed planet_degree', () => {
    expect(
      normalizeLalKitabHoroscope([
        {sign: 1, sign_name: 'Aries', planet: ['Sun']},
      ])[0].placements[0].degree,
    ).toBeNull();

    expect(
      normalizeLalKitabHoroscope([
        {sign: 1, sign_name: 'Aries', planet: ['Sun'], planet_degree: null},
      ])[0].placements[0].degree,
    ).toBeNull();

    expect(
      normalizeLalKitabHoroscope([
        {sign: 1, sign_name: 'Aries', planet: ['Sun'], planet_degree: '4.2'},
      ])[0].placements[0].degree,
    ).toBe('4.20°');
  });

  it('returns nothing usable for a non-array or malformed response', () => {
    expect(normalizeLalKitabHoroscope(null)).toEqual([]);
    expect(normalizeLalKitabHoroscope(undefined)).toEqual([]);
    expect(normalizeLalKitabHoroscope([])).toEqual([]);

    expect(normalizeLalKitabHoroscope({} as any)).toEqual([]);

    expect(normalizeLalKitabHoroscope(['nope'] as any)).toEqual([]);
  });

  it('reports an empty horoscope', () => {
    expect(isLalKitabHoroscopeEmpty([])).toBe(true);
    expect(isLalKitabHoroscopeEmpty(null)).toBe(true);
    expect(
      isLalKitabHoroscopeEmpty(normalizeLalKitabHoroscope([{sign: 1}])),
    ).toBe(false);
  });
});

describe('normalizeLalKitabDebts', () => {
  it('keeps the debt name, indications and events', () => {
    const debts = normalizeLalKitabDebts([
      {
        debt_name: 'Self Debts',
        indications: 'You may borrow money.',
        events: 'Loan approval or debt recovery.',
      },
      {
        debt_name: 'Debts to Relatives',
        indications: 'Family obligations.',
        events: 'Support from family.',
      },
    ]);

    expect(debts).toHaveLength(2);
    expect(debts[0].name).toBe('Self Debts');
    expect(debts[0].indications).toBe('You may borrow money.');
    expect(debts[0].events).toBe('Loan approval or debt recovery.');
    expect(debts[0].isEmpty).toBe(false);
    expect(debts[1].name).toBe('Debts to Relatives');
  });

  it('never renders undefined for a missing paragraph', () => {
    const debts = normalizeLalKitabDebts([
      {debt_name: 'Self Debts', indications: undefined, events: null},
    ]);

    expect(debts[0].indications).toBeNull();
    expect(debts[0].events).toBeNull();
    expect(debts[0].isEmpty).toBe(true);
  });

  it('falls back to a dash for a missing name', () => {
    expect(normalizeLalKitabDebts([{}])[0].name).toBe('—');
  });

  it('returns nothing usable for a malformed response', () => {
    expect(normalizeLalKitabDebts(null)).toEqual([]);
    expect(normalizeLalKitabDebts([])).toEqual([]);

    expect(normalizeLalKitabDebts({} as any)).toEqual([]);
    expect(isLalKitabDebtsEmpty([])).toBe(true);
    expect(isLalKitabDebtsEmpty(normalizeLalKitabDebts([{}]))).toBe(false);
  });
});

describe('normalizeLalKitabHouses', () => {
  it('keeps every house field and derives the sleeping state', () => {
    const houses = normalizeLalKitabHouses([
      {
        khana_number: 1,
        maalik: 'Mars',
        pakka_ghar: 'Sun',
        kismat: 'Mars',
        soya: true,
        exalt: ['Sun'],
        debilitated: ['Saturn'],
      },
    ]);

    expect(houses[0].khanaNumber).toBe('1');
    expect(houses[0].maalik).toBe('Mars');
    expect(houses[0].pakkaGhar).toBe('Sun');
    expect(houses[0].kismat).toBe('Mars');
    expect(houses[0].isSleeping).toBe(true);
    expect(houses[0].sleepingLabel).toBe('Sleeping');
    expect(houses[0].exalt).toEqual(['Sun']);
    expect(houses[0].debilitated).toEqual(['Saturn']);
  });

  it('handles the full 12-house response', () => {
    const houses = normalizeLalKitabHouses(
      Array.from({length: 12}, (_, index) => ({
        khana_number: index + 1,
        maalik: 'Mars',
        pakka_ghar: 'Sun',
        kismat: 'Mars',
        soya: index % 2 === 0,
      })),
    );

    expect(houses).toHaveLength(12);
    expect(houses[11].khanaNumber).toBe('12');
    expect(houses[0].sleepingLabel).toBe('Sleeping');
    expect(houses[1].sleepingLabel).toBe('Active');
  });

  it('handles "-", empty arrays, null and undefined without breaking', () => {
    const houses = normalizeLalKitabHouses([
      {
        khana_number: 2,
        maalik: '-',
        pakka_ghar: null,
        kismat: undefined,
        soya: '-',
        exalt: [],
        debilitated: '-',
      },
    ]);

    expect(houses[0].maalik).toBeNull();
    expect(houses[0].pakkaGhar).toBeNull();
    expect(houses[0].kismat).toBeNull();
    expect(houses[0].isSleeping).toBeNull();
    expect(houses[0].sleepingLabel).toBe('—');
    expect(houses[0].exalt).toEqual([]);
    expect(houses[0].debilitated).toEqual([]);
  });

  it('accepts a single string as well as a list for exalt / debilitated', () => {
    const houses = normalizeLalKitabHouses([
      {khana_number: 1, exalt: 'Sun', debilitated: ['Saturn', '-']},
    ]);

    expect(houses[0].exalt).toEqual(['Sun']);
    expect(houses[0].debilitated).toEqual(['Saturn']);
  });

  it('returns nothing usable for a malformed response', () => {
    expect(normalizeLalKitabHouses(null)).toEqual([]);

    expect(normalizeLalKitabHouses({} as any)).toEqual([]);
    expect(isLalKitabHousesEmpty([])).toBe(true);
  });
});

describe('normalizeLalKitabPlanets', () => {
  it('keeps every planet, including Rahu and Ketu', () => {
    const bodies = [
      'Sun',
      'Moon',
      'Mars',
      'Mercury',
      'Jupiter',
      'Venus',
      'Saturn',
      'Rahu',
      'Ketu',
    ];

    const planets = normalizeLalKitabPlanets(
      bodies.map(planet => ({
        planet,
        rashi: 'Virgo',
        soya: false,
        position: ' NEUTRAL SIGN ',
        nature: 'Malefic',
      })),
    );

    expect(planets.map(planet => planet.planet)).toEqual(bodies);
    expect(planets).toHaveLength(9);
    expect(planets[7].planet).toBe('Rahu');
    expect(planets[8].planet).toBe('Ketu');
  });

  it('trims the position and derives the sleeping state', () => {
    const planets = normalizeLalKitabPlanets([
      {
        planet: 'Sun',
        rashi: 'Virgo',
        soya: true,
        position: ' NEUTRAL SIGN ',
        nature: 'Malefic',
      },
    ]);

    expect(planets[0].position).toBe('NEUTRAL SIGN');
    expect(planets[0].rashi).toBe('Virgo');
    expect(planets[0].nature).toBe('Malefic');
    expect(planets[0].isSleeping).toBe(true);
    expect(planets[0].sleepingLabel).toBe('Sleeping');
  });

  it('never renders undefined for missing fields', () => {
    const planets = normalizeLalKitabPlanets([{planet: 'Moon'}]);

    expect(planets[0].rashi).toBeNull();
    expect(planets[0].position).toBeNull();
    expect(planets[0].nature).toBeNull();
    expect(planets[0].sleepingLabel).toBe('—');
  });

  it('returns nothing usable for a malformed response', () => {
    expect(normalizeLalKitabPlanets(null)).toEqual([]);

    expect(normalizeLalKitabPlanets({} as any)).toEqual([]);
    expect(isLalKitabPlanetsEmpty([])).toBe(true);
  });
});

describe('getSoyaLabel', () => {
  it('maps the API boolean to the display label', () => {
    expect(getSoyaLabel(true)).toBe('Sleeping');
    expect(getSoyaLabel(false)).toBe('Active');
    expect(getSoyaLabel(null)).toBe('—');
    expect(getSoyaLabel(undefined)).toBe('—');
  });
});
