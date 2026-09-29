import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getDailyNakshatraPrediction,
  getNextNakshatraPrediction,
  getPreviousNakshatraPrediction,
} from '../src/services/api/astrologyApi/astrology.api';
import type {AstrologyMuhurtaPayload} from '../src/services/api/astrologyApi/astrology.types';
import {useNakshatraPrediction} from '../src/features/free-services/hooks/useNakshatraPrediction';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import {normalizeNakshatraPrediction} from '../src/features/free-services/utils/nakshatraPrediction';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getDailyNakshatraPrediction: jest.fn(),
  getNextNakshatraPrediction: jest.fn(),
  getPreviousNakshatraPrediction: jest.fn(),
}));

const mocked = {
  getDailyNakshatraPrediction:
    getDailyNakshatraPrediction as jest.MockedFunction<
      typeof getDailyNakshatraPrediction
    >,
  getNextNakshatraPrediction: getNextNakshatraPrediction as jest.MockedFunction<
    typeof getNextNakshatraPrediction
  >,
  getPreviousNakshatraPrediction:
    getPreviousNakshatraPrediction as jest.MockedFunction<
      typeof getPreviousNakshatraPrediction
    >,
};

const PAYLOAD: AstrologyMuhurtaPayload = {
  day: 15,
  month: 8,
  year: 1995,
  hour: 10,
  min: 30,
  lat: 28.6139,
  lon: 77.209,
  tzone: 5.5,
};

const TODAY_RESPONSE = {
  birth_moon_sign: 'Cancer',
  birth_moon_nakshatra: 'Punarvasu',
  prediction: {health: 'Today health'},
  prediction_date: '29 September 2026',
};
const PREVIOUS_RESPONSE = {
  birth_moon_sign: 'Gemini',
  birth_moon_nakshatra: 'Ardra',
  prediction: {health: 'Yesterday health'},
  prediction_date: '28 September 2026',
};
const NEXT_RESPONSE = {
  birth_moon_sign: 'Leo',
  birth_moon_nakshatra: 'Magha',
  prediction: {health: 'Tomorrow health'},
  prediction_date: '30 September 2026',
};

/** Minimal harness: renders the hook in a component and captures each result. */
let captured: ReturnType<typeof useNakshatraPrediction> | null = null;
let renderer: ReturnType<typeof create>;

const Harness: React.FC<{payload: AstrologyMuhurtaPayload | null}> = ({
  payload,
}) => {
  captured = useNakshatraPrediction(payload);
  return null;
};

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: AstrologyMuhurtaPayload | null) => {
  captured = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => captured;
};

describe('useNakshatraPrediction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getDailyNakshatraPrediction.mockResolvedValue(TODAY_RESPONSE);
    mocked.getPreviousNakshatraPrediction.mockResolvedValue(PREVIOUS_RESPONSE);
    mocked.getNextNakshatraPrediction.mockResolvedValue(NEXT_RESPONSE);
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
  });

  it('fetches only the today prediction on mount', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.activeTab).toBe('today');
    expect(getResult()?.loading).toBe(true);
    expect(getResult()?.data).toBeNull();
    expect(getResult()?.missingDetails).toBe(false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getPreviousNakshatraPrediction).not.toHaveBeenCalled();
    expect(mocked.getNextNakshatraPrediction).not.toHaveBeenCalled();
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(TODAY_RESPONSE, 'today'),
    );
  });

  it('fetches yesterday when its tab is selected', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('yesterday');
      await flushPromises();
    });

    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledWith(PAYLOAD);
    expect(getResult()?.activeTab).toBe('yesterday');
    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(PREVIOUS_RESPONSE, 'yesterday'),
    );
  });

  it('fetches tomorrow when its tab is selected', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('tomorrow');
      await flushPromises();
    });

    expect(mocked.getNextNakshatraPrediction).toHaveBeenCalledWith(PAYLOAD);
    expect(getResult()?.activeTab).toBe('tomorrow');
    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(NEXT_RESPONSE, 'tomorrow'),
    );
  });

  it('reuses fetched predictions when switching back and forth', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('yesterday');
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('tomorrow');
      await flushPromises();
    });

    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledTimes(1);
    expect(mocked.getNextNakshatraPrediction).toHaveBeenCalledTimes(1);
    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);

    // Yesterday -> Today -> Tomorrow -> Today -> Yesterday
    await act(async () => {
      getResult()?.setActiveTab('today');
      await flushPromises();
    });

    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(TODAY_RESPONSE, 'today'),
    );
    expect(getResult()?.loading).toBe(false);

    await act(async () => {
      getResult()?.setActiveTab('yesterday');
      await flushPromises();
    });

    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(PREVIOUS_RESPONSE, 'yesterday'),
    );
    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledTimes(1);
    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);
  });

  it('does not repeat the request on re-render', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);

    // A new object with identical values must not be treated as new birth data.
    await act(async () => {
      renderer.update(<Harness payload={{...PAYLOAD}} />);
      await flushPromises();
    });

    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(TODAY_RESPONSE, 'today'),
    );
    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);
  });

  it('serves the shared response cache on a fresh mount', async () => {
    renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);

    act(() => {
      renderer.unmount();
    });

    const second = renderHook(PAYLOAD);

    expect(second()?.loading).toBe(false);
    expect(second()?.data).toEqual(
      normalizeNakshatraPrediction(TODAY_RESPONSE, 'today'),
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);
  });

  it('stops loading and reports the error when the request fails', async () => {
    mocked.getDailyNakshatraPrediction.mockRejectedValueOnce(
      new Error('Network error'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeInstanceOf(Error);
    expect(getResult()?.error?.message).toBe('Network error');
    expect(getResult()?.data).toBeNull();
  });

  it('keeps a failed tab recoverable and fetches the others', async () => {
    mocked.getDailyNakshatraPrediction.mockRejectedValueOnce(
      new Error('Network error'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.error).toBeInstanceOf(Error);

    await act(async () => {
      getResult()?.setActiveTab('tomorrow');
      await flushPromises();
    });

    expect(getResult()?.error).toBeNull();
    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(NEXT_RESPONSE, 'tomorrow'),
    );
  });

  it('bypasses the cache when reload is called', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(1);

    await act(async () => {
      getResult()?.reload();
      await flushPromises();
    });

    expect(mocked.getDailyNakshatraPrediction).toHaveBeenCalledTimes(2);
  });

  it('does not request anything when the birth details are missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.missingDetails).toBe(true);
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.data).toBeNull();
    expect(getResult()?.error).toBeNull();
    expect(mocked.getDailyNakshatraPrediction).not.toHaveBeenCalled();
    expect(mocked.getPreviousNakshatraPrediction).not.toHaveBeenCalled();
    expect(mocked.getNextNakshatraPrediction).not.toHaveBeenCalled();
  });

  it('refetches and drops the cache when the birth details change', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('yesterday');
      await flushPromises();
    });

    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledTimes(1);

    const other: AstrologyMuhurtaPayload = {...PAYLOAD, year: 1990, day: 10};
    act(() => {
      renderer.update(<Harness payload={other} />);
    });

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledWith(other);
    expect(mocked.getPreviousNakshatraPrediction).toHaveBeenCalledTimes(2);
  });

  it('does not commit a stale response after switching tabs', async () => {
    let resolveToday: (value: typeof TODAY_RESPONSE) => void;
    mocked.getDailyNakshatraPrediction.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveToday = resolve;
        }),
    );

    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.loading).toBe(true);

    await act(async () => {
      getResult()?.setActiveTab('tomorrow');
      await flushPromises();
    });

    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(NEXT_RESPONSE, 'tomorrow'),
    );

    await act(async () => {
      resolveToday!(TODAY_RESPONSE);
      await flushPromises();
    });

    // The late "today" response must not overwrite the active "tomorrow" tab.
    expect(getResult()?.data).toEqual(
      normalizeNakshatraPrediction(NEXT_RESPONSE, 'tomorrow'),
    );
    expect(getResult()?.loading).toBe(false);
  });

  it('does not cache a response that arrives after the birth details change', async () => {
    let resolveToday: (value: typeof TODAY_RESPONSE) => void;
    mocked.getDailyNakshatraPrediction.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveToday = resolve;
        }),
    );

    const getResult = renderHook(PAYLOAD);

    const other: AstrologyMuhurtaPayload = {...PAYLOAD, year: 1990};
    mocked.getDailyNakshatraPrediction.mockResolvedValueOnce({
      ...TODAY_RESPONSE,
      prediction: {health: 'Other chart health'},
    });

    await act(async () => {
      renderer.update(<Harness payload={other} />);
      await flushPromises();
    });

    expect(getResult()?.data?.sections[0].text).toBe('Other chart health');

    // The first request resolves only now, for the previous birth details.
    await act(async () => {
      resolveToday!(TODAY_RESPONSE);
      await flushPromises();
    });

    // It must not overwrite the data or poison the cache for the new details.
    expect(getResult()?.data?.sections[0].text).toBe('Other chart health');
  });
});
