import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getSunSignPredictionToday,
  getSunSignPredictionPrevious,
  getSunSignPredictionNext,
} from '../src/services/api/astrologyApi/astrology.api';
import {useHoroscopePrediction} from '../src/features/horoscope/hooks/useHoroscopePrediction';
import {getHoroscopeViewModel} from '../src/features/horoscope/utils/horoscopeResponse';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getSunSignPredictionToday: jest.fn(),
  getSunSignPredictionPrevious: jest.fn(),
  getSunSignPredictionNext: jest.fn(),
}));

const mocked = {
  getSunSignPredictionToday: getSunSignPredictionToday as jest.MockedFunction<
    typeof getSunSignPredictionToday
  >,
  getSunSignPredictionPrevious:
    getSunSignPredictionPrevious as jest.MockedFunction<
      typeof getSunSignPredictionPrevious
    >,
  getSunSignPredictionNext: getSunSignPredictionNext as jest.MockedFunction<
    typeof getSunSignPredictionNext
  >,
};

const TODAY_RESPONSE = {personal_life: 'Today text', health: 'Today health'};
const PREV_RESPONSE = {
  status: true,
  sun_sign: 'aries',
  prediction_date: '20-3-2024',
  prediction: {
    personal_life: 'Prev text',
    personal_life_rating: 8,
  },
};
const NEXT_RESPONSE = {
  status: true,
  sun_sign: 'aries',
  prediction_date: '22-3-2024',
  prediction: {
    personal_life: 'Next text',
    personal_life_rating: 5,
  },
};

/**
 * A minimal test harness: renders the hook inside a real component so that
 * React's hook dispatcher is available, and captures the return value on
 * every render.
 */
let capturedResult: ReturnType<typeof useHoroscopePrediction> | null = null;

const Harness: React.FC<{zodiacName: string}> = ({zodiacName}) => {
  capturedResult = useHoroscopePrediction(zodiacName);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (zodiacName: string) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness zodiacName={zodiacName} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('useHoroscopePrediction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocked.getSunSignPredictionToday.mockResolvedValue(TODAY_RESPONSE);
    mocked.getSunSignPredictionPrevious.mockResolvedValue(PREV_RESPONSE);
    mocked.getSunSignPredictionNext.mockResolvedValue(NEXT_RESPONSE);
  });

  afterEach(() => {
    unmount();
  });

  it('fetches "today" on mount and returns a view model', async () => {
    const getResult = renderHook('aries');

    expect(getResult()?.activeTab).toBe('today');
    expect(getResult()?.loading).toBe(true);
    expect(getResult()?.data).toBeNull();

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionToday).toHaveBeenCalledWith('aries');
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.data).toEqual(getHoroscopeViewModel(TODAY_RESPONSE));
  });

  it('fetches previous/next only when their tab is selected', async () => {
    const getResult = renderHook('aries');

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionPrevious).not.toHaveBeenCalled();
    expect(mocked.getSunSignPredictionNext).not.toHaveBeenCalled();

    await act(async () => {
      getResult()?.setActiveTab('previous');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionPrevious).toHaveBeenCalledWith('aries');
    expect(getResult()?.data).toEqual(getHoroscopeViewModel(PREV_RESPONSE));

    await act(async () => {
      getResult()?.setActiveTab('next');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionNext).toHaveBeenCalledWith('aries');
    expect(getResult()?.data).toEqual(getHoroscopeViewModel(NEXT_RESPONSE));
  });

  it('serves cached data on tab re-selection without re-fetching', async () => {
    const getResult = renderHook('aries');

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('next');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionNext).toHaveBeenCalledTimes(1);

    await act(async () => {
      getResult()?.setActiveTab('today');
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('next');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionNext).toHaveBeenCalledTimes(1);
  });

  it('sets loading false and error on fetch failure', async () => {
    mocked.getSunSignPredictionToday.mockRejectedValueOnce(
      new Error('Network error'),
    );

    const getResult = renderHook('aries');

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeInstanceOf(Error);
    expect(getResult()?.error?.message).toBe('Network error');
    expect(getResult()?.data).toBeNull();
  });

  it('bypasses cache when reload is called', async () => {
    const getResult = renderHook('aries');

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionToday).toHaveBeenCalledTimes(1);

    await act(async () => {
      getResult()?.reload();
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionToday).toHaveBeenCalledTimes(2);
  });

  it('does not fetch when zodiacName is empty', async () => {
    const getResult = renderHook('');

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionToday).not.toHaveBeenCalled();
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.data).toBeNull();
  });

  it('invalidates cache when zodiacName changes', async () => {
    const getResult = renderHook('aries');

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.setActiveTab('next');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionNext).toHaveBeenCalledTimes(1);

    await act(async () => {
      getResult()?.setActiveTab('today');
      await flushPromises();
    });

    // Re-render the harness with a new zodiacName (simulates prop change).
    capturedResult = null;
    act(() => {
      renderer.update(<Harness zodiacName="taurus" />);
    });

    expect(mocked.getSunSignPredictionToday).toHaveBeenCalledWith('taurus');

    await act(async () => {
      await flushPromises();
    });

    // After zodiac change, switching back to "next" should re-fetch.
    await act(async () => {
      getResult()?.setActiveTab('next');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionNext).toHaveBeenCalledTimes(2);
  });

  it('does not commit a stale response after switching tabs', async () => {
    let firstResolve: (value: typeof TODAY_RESPONSE) => void;
    mocked.getSunSignPredictionToday.mockImplementation(
      () =>
        new Promise(resolve => {
          firstResolve = resolve;
        }),
    );

    const getResult = renderHook('aries');

    expect(getResult()?.loading).toBe(true);

    await act(async () => {
      getResult()?.setActiveTab('previous');
      await flushPromises();
    });

    expect(mocked.getSunSignPredictionPrevious).toHaveBeenCalled();
    expect(getResult()?.data).toEqual(getHoroscopeViewModel(PREV_RESPONSE));

    await act(async () => {
      firstResolve!(TODAY_RESPONSE);
      await flushPromises();
    });

    // The stale "today" response should not overwrite the active "previous" tab.
    expect(getResult()?.data).toEqual(getHoroscopeViewModel(PREV_RESPONSE));
  });
});
