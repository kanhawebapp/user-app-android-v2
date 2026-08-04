import {act, create} from 'react-test-renderer';
import React from 'react';

import {getHoroscopeChart} from '../src/services/api/astrologyApi/astrology.api';
import {useHoroscopeCharts} from '../src/features/free-services/hooks/useHoroscopeCharts';
import {
  clearChartSvgCache,
} from '../src/features/free-services/utils/chartSvgCache';
import {
  CHART_LABELS,
  CHART_TYPES,
} from '../src/features/free-services/utils/kundliService';
import type {HoroscopeChartPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getHoroscopeChart: jest.fn(),
}));

const mocked = {
  getHoroscopeChart: getHoroscopeChart as jest.MockedFunction<
    typeof getHoroscopeChart
  >,
};

const PAYLOAD: HoroscopeChartPayload = {
  day: 10,
  month: 5,
  year: 1990,
  hour: 19,
  min: 55,
  lat: 19.2056,
  lon: 25.2056,
  tzone: 5.5,
  planetColor: '#ff0000',
  signColor: '#ff0000',
  lineColor: '#ff0000',
  chartType: 'north',
  image_type: 'svg',
};

let capturedResult: ReturnType<typeof useHoroscopeCharts> | null = null;

const Harness: React.FC<{payload: HoroscopeChartPayload | null}> = ({
  payload,
}) => {
  capturedResult = useHoroscopeCharts(payload);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: HoroscopeChartPayload | null) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('useHoroscopeCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearChartSvgCache();
    mocked.getHoroscopeChart.mockImplementation(async type => ({
      svg: `<svg type="${type}"/>`,
    }));
  });

  afterEach(() => {
    unmount();
  });

  it('fetches both charts in parallel with the same payload', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.loading).toBe(true);
    expect(getResult()?.charts).toHaveLength(2);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(2);
    expect(mocked.getHoroscopeChart).toHaveBeenCalledWith('chalit', PAYLOAD);
    expect(mocked.getHoroscopeChart).toHaveBeenCalledWith('D9', PAYLOAD);
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.charts).toEqual([
      {
        type: 'chalit',
        label: CHART_LABELS.chalit,
        svg: '<svg type="chalit"/>',
        error: null,
      },
      {
        type: 'D9',
        label: CHART_LABELS.D9,
        svg: '<svg type="D9"/>',
        error: null,
      },
    ]);
  });

  it('keeps the successful chart when the other one fails', async () => {
    mocked.getHoroscopeChart.mockImplementation(async type => {
      if (type === 'D9') {
        throw new Error('D9 failed');
      }
      return {svg: '<svg chalit/>'};
    });

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();

    const chalit = getResult()?.charts.find(c => c.type === 'chalit');
    expect(chalit?.svg).toBe('<svg chalit/>');
    expect(chalit?.error).toBeNull();

    const d9 = getResult()?.charts.find(c => c.type === 'D9');
    expect(d9?.svg).toBeNull();
    expect(d9?.error?.message).toBe('D9 failed');
  });

  it('captures errors on both charts when both requests fail', async () => {
    mocked.getHoroscopeChart.mockRejectedValue(new Error('Network down'));

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(
      getResult()?.charts.every(
        c => c.error?.message === 'Network down' && c.svg === null,
      ),
    ).toBe(true);
  });

  it('reloads both charts when reload is called', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });
    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(2);

    await act(async () => {
      getResult()?.reload();
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(4);
  });

  it('reuses cached SVGs on a subsequent mount without calling the API again', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });
    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(2);

    unmount();

    const getResult2 = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(2);
    expect(getResult2()?.loading).toBe(false);
    expect(getResult2()?.error).toBeNull();
    expect(getResult2()?.charts).toEqual([
      {
        type: 'chalit',
        label: CHART_LABELS.chalit,
        svg: '<svg type="chalit"/>',
        error: null,
      },
      {
        type: 'D9',
        label: CHART_LABELS.D9,
        svg: '<svg type="D9"/>',
        error: null,
      },
    ]);
  });

  it('sets a global error and skips fetching when payload is missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).not.toHaveBeenCalled();
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error?.message).toBe('Birth details are missing.');
    expect(getResult()?.charts).toEqual(
      CHART_TYPES.map(type => ({
        type,
        label: CHART_LABELS[type],
        svg: null,
        error: null,
      })),
    );
  });
});
