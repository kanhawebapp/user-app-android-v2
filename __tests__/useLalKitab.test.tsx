import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getLalKitabDebts,
  getLalKitabHouses,
  getLalKitabHoroscope,
  getLalKitabPlanets,
} from '../src/services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  LalKitabDebtsResponse,
  LalKitabHousesResponse,
  LalKitabHoroscopeResponse,
  LalKitabPlanetsResponse,
} from '../src/services/api/astrologyApi/astrology.types';
import {
  useLalKitab,
  type UseLalKitabReturn,
} from '../src/features/free-services/hooks/useLalKitab';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import {
  normalizeLalKitabDebts,
  normalizeLalKitabHouses,
  normalizeLalKitabHoroscope,
  normalizeLalKitabPlanets,
  resolveLalKitabInput,
} from '../src/features/free-services/utils/lalKitab';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getLalKitabHoroscope: jest.fn(),
  getLalKitabDebts: jest.fn(),
  getLalKitabHouses: jest.fn(),
  getLalKitabPlanets: jest.fn(),
}));

const mocked = {
  getLalKitabHoroscope: getLalKitabHoroscope as jest.MockedFunction<
    typeof getLalKitabHoroscope
  >,
  getLalKitabDebts: getLalKitabDebts as jest.MockedFunction<
    typeof getLalKitabDebts
  >,
  getLalKitabHouses: getLalKitabHouses as jest.MockedFunction<
    typeof getLalKitabHouses
  >,
  getLalKitabPlanets: getLalKitabPlanets as jest.MockedFunction<
    typeof getLalKitabPlanets
  >,
};

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

const HOROSCOPE: LalKitabHoroscopeResponse = [
  {
    sign: 1,
    sign_name: 'Aries',
    planet: [],
    planet_small: [],
    planet_degree: [],
  },
  {
    sign: 2,
    sign_name: 'Taurus',
    planet: ['Sun'],
    planet_small: ['Su'],
    planet_degree: ['12.1895'],
  },
];

const DEBTS: LalKitabDebtsResponse = [
  {
    debt_name: 'Self Debts',
    indications: 'Indications of self debt',
    events: 'Events of self debt',
  },
];

const HOUSES: LalKitabHousesResponse = [
  {
    khana_number: 1,
    maalik: 'Mars',
    pakka_ghar: 'Sun',
    kismat: 'Mars',
    soya: true,
    exalt: ['Sun'],
    debilitated: ['Saturn'],
  },
];

const PLANETS: LalKitabPlanetsResponse = [
  {
    planet: 'Sun',
    rashi: 'Virgo',
    soya: true,
    position: ' NEUTRAL SIGN ',
    nature: 'Malefic',
  },
];

let captured: UseLalKitabReturn | null = null;
let renderer: ReturnType<typeof create>;

const Harness: React.FC<{payload: AstrologyMuhurtaPayload | null}> = ({
  payload,
}) => {
  captured = useLalKitab(payload);
  return null;
};

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: AstrologyMuhurtaPayload | null) => {
  captured = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => captured as UseLalKitabReturn;
};

describe('useLalKitab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getLalKitabHoroscope.mockResolvedValue(HOROSCOPE);
    mocked.getLalKitabDebts.mockResolvedValue(DEBTS);
    mocked.getLalKitabHouses.mockResolvedValue(HOUSES);
    mocked.getLalKitabPlanets.mockResolvedValue(PLANETS);
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
  });

  it('requests all four endpoints with the same birth-details payload', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult().activeTab).toBe('horoscope');
    expect(getResult().loading).toBe(true);
    expect(getResult().missingDetails).toBe(false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getLalKitabHoroscope).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getLalKitabDebts).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getLalKitabHouses).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getLalKitabPlanets).toHaveBeenCalledWith(PAYLOAD);
    expect(getResult().loading).toBe(false);
    expect(getResult().error).toBeNull();
  });

  it('normalises every report from the single response set', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().data.horoscope).toEqual(
      normalizeLalKitabHoroscope(HOROSCOPE),
    );
    expect(getResult().data.debts).toEqual(normalizeLalKitabDebts(DEBTS));
    expect(getResult().data.houses).toEqual(normalizeLalKitabHouses(HOUSES));
    expect(getResult().data.planets).toEqual(normalizeLalKitabPlanets(PLANETS));
  });

  it('does not re-request when switching tabs', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult().setActiveTab('debts');
      getResult().setActiveTab('houses');
      getResult().setActiveTab('planets');
      await flushPromises();
    });

    expect(getResult().activeTab).toBe('planets');
    expect(mocked.getLalKitabHoroscope).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabDebts).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabHouses).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabPlanets).toHaveBeenCalledTimes(1);
  });

  it('serves the shared cache on remount without new requests', async () => {
    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });
    act(() => {
      renderer?.unmount();
    });

    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getLalKitabHoroscope).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabDebts).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabHouses).toHaveBeenCalledTimes(1);
    expect(mocked.getLalKitabPlanets).toHaveBeenCalledTimes(1);
  });

  it('keeps the other three reports usable when one endpoint fails', async () => {
    mocked.getLalKitabHouses.mockRejectedValue(
      new Error('Astrology API request failed (500): server error'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().errors.houses).toBeInstanceOf(Error);
    expect(getResult().errors.houses?.message).toContain('500');
    expect(getResult().errors.horoscope).toBeNull();
    expect(getResult().errors.debts).toBeNull();
    expect(getResult().errors.planets).toBeNull();
    // The failing report is absent, the healthy ones still render.
    expect(getResult().data.houses).toBeNull();
    expect(getResult().data.planets).toEqual(normalizeLalKitabPlanets(PLANETS));
    // A failure is still surfaced once for the toast.
    expect(getResult().error).toBeInstanceOf(Error);
  });

  it('recovers the failed report on reload', async () => {
    mocked.getLalKitabHouses.mockRejectedValueOnce(new Error('boom'));

    const getResult = renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });
    expect(getResult().errors.houses).toBeInstanceOf(Error);

    await act(async () => {
      getResult().reload();
      await flushPromises();
    });

    expect(getResult().errors.houses).toBeNull();
    expect(getResult().data.houses).toEqual(normalizeLalKitabHouses(HOUSES));
  });

  it('does not request anything when the birth details are missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().missingDetails).toBe(true);
    expect(getResult().loading).toBe(false);
    expect(getResult().data.horoscope).toBeNull();
    expect(mocked.getLalKitabHoroscope).not.toHaveBeenCalled();
    expect(mocked.getLalKitabDebts).not.toHaveBeenCalled();
    expect(mocked.getLalKitabHouses).not.toHaveBeenCalled();
    expect(mocked.getLalKitabPlanets).not.toHaveBeenCalled();
  });
});

describe('resolveLalKitabInput', () => {
  it('maps the Kundli navigation result onto the API payload', () => {
    expect(resolveLalKitabInput({payload: PAYLOAD})).toEqual(PAYLOAD);
    expect(resolveLalKitabInput({payload: {...PAYLOAD}})).toEqual(PAYLOAD);
  });

  it('rejects incomplete birth details instead of sending zeros', () => {
    // Missing coordinates must never become lat: 0 / lon: 0.
    expect(
      resolveLalKitabInput({payload: {...PAYLOAD, lat: undefined}}),
    ).toBeNull();
    expect(
      resolveLalKitabInput({payload: {...PAYLOAD, lon: undefined}}),
    ).toBeNull();
    expect(resolveLalKitabInput({payload: {...PAYLOAD, tzone: ''}})).toBeNull();
    expect(
      resolveLalKitabInput({payload: {...PAYLOAD, hour: null}}),
    ).toBeNull();
  });

  it('rejects out-of-range and absent birth details', () => {
    expect(resolveLalKitabInput({payload: {...PAYLOAD, month: 13}})).toBeNull();
    expect(resolveLalKitabInput({payload: {...PAYLOAD, hour: 25}})).toBeNull();
    expect(resolveLalKitabInput({payload: {...PAYLOAD, min: 60}})).toBeNull();
    expect(resolveLalKitabInput({})).toBeNull();
    expect(resolveLalKitabInput(null)).toBeNull();
  });
});
