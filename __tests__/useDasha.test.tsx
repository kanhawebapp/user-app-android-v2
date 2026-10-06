import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getCurrentCharDasha,
  getCurrentYoginiDasha,
  getMajorCharDasha,
  getMajorYoginiDasha,
} from '../src/services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  CurrentCharDashaResponse,
  CurrentYoginiDashaResponse,
  MajorCharDashaResponse,
  MajorYoginiDashaResponse,
} from '../src/services/api/astrologyApi/astrology.types';
import {
  useDasha,
  type DashaData,
} from '../src/features/free-services/hooks/useDasha';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import {
  normalizeCurrentCharDasha,
  normalizeCurrentYoginiDasha,
  normalizeMajorCharDasha,
  normalizeMajorYoginiDasha,
  resolveDashaInput,
} from '../src/features/free-services/utils/dasha';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getMajorCharDasha: jest.fn(),
  getCurrentCharDasha: jest.fn(),
  getMajorYoginiDasha: jest.fn(),
  getCurrentYoginiDasha: jest.fn(),
}));

const mocked = {
  getMajorCharDasha: getMajorCharDasha as jest.MockedFunction<
    typeof getMajorCharDasha
  >,
  getCurrentCharDasha: getCurrentCharDasha as jest.MockedFunction<
    typeof getCurrentCharDasha
  >,
  getMajorYoginiDasha: getMajorYoginiDasha as jest.MockedFunction<
    typeof getMajorYoginiDasha
  >,
  getCurrentYoginiDasha: getCurrentYoginiDasha as jest.MockedFunction<
    typeof getCurrentYoginiDasha
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

const MAJOR_CHAR: MajorCharDashaResponse = [
  {sign_id: 10, sign_name: 'Aquarius', duration: '5 Years'},
  {sign_id: 11, sign_name: 'Pisces', duration: '7 Years'},
];

const CURRENT_CHAR: CurrentCharDashaResponse = {
  dasha_date: '16-8-2015',
  major_dasha: {sign_id: 10, sign_name: 'Aquarius', duration: '5 Years'},
  sub_dasha: {sign_id: 11, sign_name: 'Pisces', duration: '5 Months'},
  sub_sub_dasha: [{sign_id: 0, sign_name: 'Aries'}],
};

const MAJOR_YOGINI: MajorYoginiDashaResponse = [
  {dasha_id: 1, dasha_name: 'Pingla', duration: 2},
  {dasha_id: 2, dasha_name: 'Vishakti', duration: 1},
];

const CURRENT_YOGINI: CurrentYoginiDashaResponse = {
  major_dasha: {dasha_id: 4, dasha_name: 'Bhadrika', duration: '5 Years'},
  sub_dasha: {dasha_id: 5, dasha_name: 'Ulka'},
  sub_sub_dasha: {dasha_id: 4, dasha_name: 'Bhadrika'},
};

let captured: DashaData | null = null;
let renderer: ReturnType<typeof create>;

const Harness: React.FC<{payload: AstrologyMuhurtaPayload | null}> = ({
  payload,
}) => {
  captured = useDasha(payload);
  return null;
};

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: AstrologyMuhurtaPayload | null) => {
  captured = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => captured as DashaData;
};

describe('useDasha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getMajorCharDasha.mockResolvedValue(MAJOR_CHAR);
    mocked.getCurrentCharDasha.mockResolvedValue(CURRENT_CHAR);
    mocked.getMajorYoginiDasha.mockResolvedValue(MAJOR_YOGINI);
    mocked.getCurrentYoginiDasha.mockResolvedValue(CURRENT_YOGINI);
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
  });

  it('requests all four endpoints with the same birth-details payload', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult().activeTab).toBe('char');
    expect(getResult().missingDetails).toBe(false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getMajorCharDasha).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getCurrentCharDasha).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getMajorYoginiDasha).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getCurrentYoginiDasha).toHaveBeenCalledWith(PAYLOAD);
  });

  it('normalises every report from the single response set', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().majorChar.data).toEqual(
      normalizeMajorCharDasha(MAJOR_CHAR),
    );
    expect(getResult().currentChar.data).toEqual(
      normalizeCurrentCharDasha(CURRENT_CHAR),
    );
    expect(getResult().majorYogini.data).toEqual(
      normalizeMajorYoginiDasha(MAJOR_YOGINI),
    );
    expect(getResult().currentYogini.data).toEqual(
      normalizeCurrentYoginiDasha(CURRENT_YOGINI),
    );
  });

  it('does not re-request when switching tabs', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult().setActiveTab('yogini');
      getResult().setActiveTab('char');
      await flushPromises();
    });

    expect(getResult().activeTab).toBe('char');
    expect(mocked.getMajorCharDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getCurrentCharDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getMajorYoginiDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getCurrentYoginiDasha).toHaveBeenCalledTimes(1);
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

    expect(mocked.getMajorCharDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getCurrentCharDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getMajorYoginiDasha).toHaveBeenCalledTimes(1);
    expect(mocked.getCurrentYoginiDasha).toHaveBeenCalledTimes(1);
  });

  it('keeps the other three reports usable when one endpoint fails', async () => {
    mocked.getCurrentCharDasha.mockRejectedValue(
      new Error('Astrology API request failed (500): server error'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().currentChar.error?.message).toContain('500');
    expect(getResult().currentChar.data).toBeNull();
    // The healthy reports still render.
    expect(getResult().majorChar.data).toEqual(
      normalizeMajorCharDasha(MAJOR_CHAR),
    );
    expect(getResult().majorYogini.data).toEqual(
      normalizeMajorYoginiDasha(MAJOR_YOGINI),
    );
    expect(getResult().currentYogini.data).toEqual(
      normalizeCurrentYoginiDasha(CURRENT_YOGINI),
    );
  });

  it('recovers the failed report on reload', async () => {
    mocked.getCurrentYoginiDasha.mockRejectedValueOnce(new Error('boom'));

    const getResult = renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });
    expect(getResult().currentYogini.error).toBeInstanceOf(Error);

    await act(async () => {
      getResult().reload();
      await flushPromises();
    });

    expect(getResult().currentYogini.error).toBeNull();
    expect(getResult().currentYogini.data).toEqual(
      normalizeCurrentYoginiDasha(CURRENT_YOGINI),
    );
  });

  it('does not request anything when the birth details are missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult().missingDetails).toBe(true);
    expect(mocked.getMajorCharDasha).not.toHaveBeenCalled();
    expect(mocked.getCurrentCharDasha).not.toHaveBeenCalled();
    expect(mocked.getMajorYoginiDasha).not.toHaveBeenCalled();
    expect(mocked.getCurrentYoginiDasha).not.toHaveBeenCalled();
  });
});

describe('resolveDashaInput', () => {
  it('maps the Kundli navigation result onto the API payload', () => {
    expect(resolveDashaInput({payload: PAYLOAD})).toEqual(PAYLOAD);
    expect(resolveDashaInput({payload: {...PAYLOAD}})).toEqual(PAYLOAD);
  });

  it('rejects incomplete birth details instead of sending zeros', () => {
    expect(resolveDashaInput({payload: {...PAYLOAD, lat: undefined}})).toBeNull();
    expect(resolveDashaInput({payload: {...PAYLOAD, lon: undefined}})).toBeNull();
    expect(resolveDashaInput({payload: {...PAYLOAD, tzone: ''}})).toBeNull();
    expect(resolveDashaInput({})).toBeNull();
    expect(resolveDashaInput(null)).toBeNull();
  });
});