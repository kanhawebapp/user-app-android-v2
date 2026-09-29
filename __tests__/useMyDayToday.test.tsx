import {act, create} from 'react-test-renderer';
import React from 'react';

import {getNumeroPredictionDaily} from '../src/services/api/astrologyApi/astrology.api';
import {useMyDayToday} from '../src/features/free-services/hooks/useMyDayToday';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import type {NumeroRequestPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getNumeroPredictionDaily: jest.fn(),
}));

const mocked = getNumeroPredictionDaily as jest.MockedFunction<
  typeof getNumeroPredictionDaily
>;

const PAYLOAD: NumeroRequestPayload = {
  name: 'Ari',
  day: 10,
  month: 5,
  year: 1990,
};

let capturedResult: ReturnType<typeof useMyDayToday> | null = null;

const Harness: React.FC<{payload: NumeroRequestPayload | null}> = ({
  payload,
}) => {
  capturedResult = useMyDayToday(payload);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: NumeroRequestPayload | null) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('useMyDayToday', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.mockResolvedValue({
      prediction: 'You would be straightforward in providing any solutions.',
      lucky_color: 'copper',
      lucky_number: '1',
      prediction_date: '29-9-2026',
    });
  });

  it('fetches with the user birth details and exposes the response', async () => {
    renderHook(PAYLOAD);
    expect(capturedResult?.loading).toBe(true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked).toHaveBeenCalledWith(PAYLOAD);
    expect(capturedResult?.loading).toBe(false);
    expect(capturedResult?.error).toBeNull();
    expect(capturedResult?.data?.prediction).toBe(
      'You would be straightforward in providing any solutions.',
    );
    expect(capturedResult?.data?.lucky_color).toBe('copper');
    expect(capturedResult?.data?.lucky_number).toBe('1');
    expect(capturedResult?.data?.prediction_date).toBe('29-9-2026');

    unmount();
  });

  it('does not call the API when the birth details are missing', async () => {
    renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked).not.toHaveBeenCalled();
    expect(capturedResult?.missingDetails).toBe(true);
    expect(capturedResult?.data).toBeNull();
    expect(capturedResult?.loading).toBe(false);

    unmount();
  });

  it('surfaces a network error without throwing', async () => {
    mocked.mockRejectedValue(new Error('Network error'));

    renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(capturedResult?.error).toEqual(new Error('Network error'));
    expect(capturedResult?.loading).toBe(false);
    expect(capturedResult?.data).toBeNull();

    unmount();
  });

  it('handles an empty response safely', async () => {
    mocked.mockResolvedValue({});

    renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(capturedResult?.error).toBeNull();
    expect(capturedResult?.data).toEqual({});

    unmount();
  });

  it('serves the cached response on a remount instead of refetching', async () => {
    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });
    unmount();

    expect(mocked).toHaveBeenCalledTimes(1);

    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });

    expect(mocked).toHaveBeenCalledTimes(1);
    expect(capturedResult?.loading).toBe(false);
    expect(capturedResult?.data?.lucky_number).toBe('1');

    unmount();
  });

  it('does not refetch on a re-render with the same payload', async () => {
    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });

    act(() => {
      renderer.update(<Harness payload={PAYLOAD} />);
    });
    await act(async () => {
      await flushPromises();
    });

    expect(mocked).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('refetches on reload, bypassing the cache', async () => {
    renderHook(PAYLOAD);
    await act(async () => {
      await flushPromises();
    });

    act(() => {
      capturedResult?.reload();
    });
    await act(async () => {
      await flushPromises();
    });

    expect(mocked).toHaveBeenCalledTimes(2);

    unmount();
  });
});
