import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getAstroDetails,
  getBasicPanchang,
  getBirthDetails,
} from '../src/services/api/astrologyApi/astrology.api';
import {useBirthBasicsData} from '../src/features/free-services/hooks/useBirthBasicsData';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import type {AstrologyMuhurtaPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getBirthDetails: jest.fn(),
  getBasicPanchang: jest.fn(),
  getAstroDetails: jest.fn(),
}));

const mocked = {
  getBirthDetails: getBirthDetails as jest.MockedFunction<
    typeof getBirthDetails
  >,
  getBasicPanchang: getBasicPanchang as jest.MockedFunction<
    typeof getBasicPanchang
  >,
  getAstroDetails: getAstroDetails as jest.MockedFunction<
    typeof getAstroDetails
  >,
};

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

let capturedResult: ReturnType<typeof useBirthBasicsData> | null = null;

const Harness: React.FC<{payload: AstrologyMuhurtaPayload | null}> = ({
  payload,
}) => {
  capturedResult = useBirthBasicsData(payload);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: AstrologyMuhurtaPayload | null) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('useBirthBasicsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getBirthDetails.mockResolvedValue({year: 1990});
    mocked.getBasicPanchang.mockResolvedValue({day: 'Wednesday'});
    mocked.getAstroDetails.mockResolvedValue({ascendant: 'Leo'});
  });

  afterEach(() => {
    unmount();
  });

  it('fetches the three basic endpoints in parallel with the same payload', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.loading).toBe(true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getBirthDetails).toHaveBeenCalledTimes(1);
    expect(mocked.getBirthDetails).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getBasicPanchang).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getAstroDetails).toHaveBeenCalledWith(PAYLOAD);

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.birthDetails.data).toEqual({year: 1990});
    expect(getResult()?.panchang.data).toEqual({day: 'Wednesday'});
    expect(getResult()?.astroDetails.data).toEqual({ascendant: 'Leo'});
  });

  it('keeps the successful cards when one request fails', async () => {
    mocked.getBasicPanchang.mockRejectedValue(new Error('Panchang failed'));

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.birthDetails.error).toBeNull();
    expect(getResult()?.panchang.data).toBeNull();
    expect(getResult()?.panchang.error?.message).toBe('Panchang failed');
    expect(getResult()?.astroDetails.data).toEqual({ascendant: 'Leo'});
  });

  it('sets a global error and skips fetching when payload is missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getBirthDetails).not.toHaveBeenCalled();
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error?.message).toBe('Birth details are missing.');
  });
});
