import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getMajorVdasha,
  getPlanets,
} from '../src/services/api/astrologyApi/astrology.api';
import {usePlanetsData} from '../src/features/free-services/hooks/usePlanetsData';
import {
  buildKundliCacheKey,
  clearKundliResponseCache,
  setCachedResponse,
} from '../src/features/free-services/utils/kundliApiCache';
import type {AstrologyMuhurtaPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getPlanets: jest.fn(),
  getMajorVdasha: jest.fn(),
}));

const mocked = {
  getPlanets: getPlanets as jest.MockedFunction<typeof getPlanets>,
  getMajorVdasha: getMajorVdasha as jest.MockedFunction<typeof getMajorVdasha>,
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

let capturedResult: ReturnType<typeof usePlanetsData> | null = null;

const Harness: React.FC<{
  payload: AstrologyMuhurtaPayload | null;
  enabled: boolean;
}> = ({payload, enabled}) => {
  capturedResult = usePlanetsData(payload, enabled);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (
  payload: AstrologyMuhurtaPayload | null,
  enabled: boolean,
) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness payload={payload} enabled={enabled} />);
  });
  return () => capturedResult;
};

const rerender = (
  payload: AstrologyMuhurtaPayload | null,
  enabled: boolean,
) => {
  act(() => {
    renderer.update(<Harness payload={payload} enabled={enabled} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('usePlanetsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getPlanets.mockResolvedValue([{name: 'Sun', house: 9}]);
    mocked.getMajorVdasha.mockResolvedValue([{planet: 'Ketu'}]);
  });

  afterEach(() => {
    unmount();
  });

  it('does not fetch anything until the tab is enabled', async () => {
    const getResult = renderHook(PAYLOAD, false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPlanets).not.toHaveBeenCalled();
    expect(mocked.getMajorVdasha).not.toHaveBeenCalled();
    expect(getResult()?.loading).toBe(false);
  });

  it('fetches planets and dasha in parallel once enabled', async () => {
    renderHook(PAYLOAD, false);

    const getResult = rerender(PAYLOAD, true);

    expect(getResult()?.loading).toBe(true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPlanets).toHaveBeenCalledTimes(1);
    expect(mocked.getPlanets).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getMajorVdasha).toHaveBeenCalledWith(PAYLOAD);

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.planets.data).toEqual([{name: 'Sun', house: 9}]);
    expect(getResult()?.dasha.data).toEqual([{planet: 'Ketu'}]);
  });

  it('keeps the data when re-enabled and does not refetch', async () => {
    renderHook(PAYLOAD, false);
    const getResult = rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });
    expect(mocked.getPlanets).toHaveBeenCalledTimes(1);

    rerender(PAYLOAD, false);
    rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPlanets).toHaveBeenCalledTimes(1);
    expect(getResult()?.planets.data).toEqual([{name: 'Sun', house: 9}]);
  });

  it('serves both endpoints from the response cache without new requests', async () => {
    setCachedResponse(buildKundliCacheKey('planets', PAYLOAD), [
      {name: 'Sun', house: 9},
    ]);
    setCachedResponse(buildKundliCacheKey('major_vdasha', PAYLOAD), [
      {planet: 'Ketu'},
    ]);

    const getResult = renderHook(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPlanets).not.toHaveBeenCalled();
    expect(mocked.getMajorVdasha).not.toHaveBeenCalled();
    expect(getResult()?.planets.data).toEqual([{name: 'Sun', house: 9}]);
    expect(getResult()?.dasha.data).toEqual([{planet: 'Ketu'}]);
    expect(getResult()?.loading).toBe(false);
  });

  it('reload bypasses the cache and refetches', async () => {
    const getResult = renderHook(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });
    expect(mocked.getPlanets).toHaveBeenCalledTimes(1);

    act(() => {
      getResult()?.reload();
    });
    expect(getResult()?.loading).toBe(true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPlanets).toHaveBeenCalledTimes(2);
    expect(getResult()?.loading).toBe(false);
  });
});
