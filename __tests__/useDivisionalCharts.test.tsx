import {act, create} from 'react-test-renderer';
import React from 'react';

import {getHoroscopeChart} from '../src/services/api/astrologyApi/astrology.api';
import {useDivisionalCharts} from '../src/features/free-services/hooks/useDivisionalCharts';
import {
  buildChartCacheKey,
  clearChartSvgCache,
  setCachedChartSvg,
} from '../src/features/free-services/utils/chartSvgCache';
import {DIVISIONAL_CHARTS} from '../src/features/free-services/utils/kundliService';
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

const PRELOAD_IDS = DIVISIONAL_CHARTS.slice(0, 3).map(c => c.chartId);

let capturedResult: ReturnType<typeof useDivisionalCharts> | null = null;

const Harness: React.FC<{
  payload: HoroscopeChartPayload | null;
  enabled: boolean;
}> = ({payload, enabled}) => {
  capturedResult = useDivisionalCharts(payload, enabled);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (
  payload: HoroscopeChartPayload | null,
  enabled: boolean,
) => {
  capturedResult = null;
  act(() => {
    renderer = create(<Harness payload={payload} enabled={enabled} />);
  });
  return () => capturedResult;
};

const rerender = (payload: HoroscopeChartPayload | null, enabled: boolean) => {
  act(() => {
    renderer.update(<Harness payload={payload} enabled={enabled} />);
  });
  return () => capturedResult;
};

const unmount = () => renderer.unmount();

describe('useDivisionalCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearChartSvgCache();
    mocked.getHoroscopeChart.mockImplementation(async type => ({
      svg: `<svg>${type}</svg>`,
    }));
  });

  afterEach(() => {
    unmount();
  });

  it('does not fetch anything until the tab is enabled', async () => {
    renderHook(PAYLOAD, false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).not.toHaveBeenCalled();
  });

  it('preloads only the first batch of charts once enabled', async () => {
    renderHook(PAYLOAD, false);
    const getResult = rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(PRELOAD_IDS.length);
    PRELOAD_IDS.forEach(id => {
      expect(mocked.getHoroscopeChart).toHaveBeenCalledWith(id, PAYLOAD);
    });

    expect(getResult()?.charts).toHaveLength(DIVISIONAL_CHARTS.length);
    expect(getResult()?.charts[0]).toEqual({
      chartId: 'SUN',
      title: DIVISIONAL_CHARTS[0].title,
      svg: '<svg>SUN</svg>',
      error: null,
      loading: false,
    });
    // Charts outside the first batch stay pending until requested.
    expect(getResult()?.charts[PRELOAD_IDS.length]).toMatchObject({
      chartId: DIVISIONAL_CHARTS[PRELOAD_IDS.length].chartId,
      svg: null,
      error: null,
      loading: true,
    });
  });

  it('requestChart lazily fetches a single chart and never re-requests it', async () => {
    renderHook(PAYLOAD, true);
    await act(async () => {
      await flushPromises();
    });

    const lazyId = DIVISIONAL_CHARTS[PRELOAD_IDS.length].chartId;
    act(() => {
      capturedResult?.requestChart(lazyId);
    });

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledWith(lazyId, PAYLOAD);

    const chart = capturedResult?.charts.find(c => c.chartId === lazyId);
    expect(chart?.svg).toBe(`<svg>${lazyId}</svg>`);
    expect(chart?.loading).toBe(false);

    const callsBefore = mocked.getHoroscopeChart.mock.calls.length;
    act(() => {
      capturedResult?.requestChart(lazyId);
    });
    await act(async () => {
      await flushPromises();
    });
    expect(mocked.getHoroscopeChart.mock.calls.length).toBe(callsBefore);
  });

  it('serves a cached chart without a new request', async () => {
    setCachedChartSvg(
      buildChartCacheKey('D9', PAYLOAD),
      '<svg>cached-d9</svg>',
    );

    renderHook(PAYLOAD, true);
    await act(async () => {
      await flushPromises();
    });

    act(() => {
      capturedResult?.requestChart('D9');
    });
    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).not.toHaveBeenCalledWith('D9', PAYLOAD);

    const d9 = capturedResult?.charts.find(c => c.chartId === 'D9');
    expect(d9?.svg).toBe('<svg>cached-d9</svg>');
    expect(d9?.error).toBeNull();
    expect(d9?.loading).toBe(false);
  });

  it('captures per-chart errors and retryChart refetches bypassing the cache', async () => {
    mocked.getHoroscopeChart.mockImplementation(async type => {
      if (type === 'MOON') {
        throw new Error('Moon failed');
      }
      return {svg: `<svg>${type}</svg>`};
    });

    renderHook(PAYLOAD, true);
    await act(async () => {
      await flushPromises();
    });

    const moon = capturedResult?.charts.find(c => c.chartId === 'MOON');
    expect(moon?.svg).toBeNull();
    expect(moon?.error?.message).toBe('Moon failed');
    expect(moon?.loading).toBe(false);

    mocked.getHoroscopeChart.mockImplementation(async type => ({
      svg: `<svg>${type}-fixed</svg>`,
    }));

    act(() => {
      capturedResult?.retryChart('MOON');
    });
    await act(async () => {
      await flushPromises();
    });

    const moonFixed = capturedResult?.charts.find(c => c.chartId === 'MOON');
    expect(moonFixed?.svg).toBe('<svg>MOON-fixed</svg>');
    expect(moonFixed?.error).toBeNull();

    const sun = capturedResult?.charts.find(c => c.chartId === 'SUN');
    expect(sun?.svg).toBe('<svg>SUN</svg>');
    expect(capturedResult?.error).toBeNull();
  });

  it('sets a global error when birth details are missing', async () => {
    const getResult = renderHook(null, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).not.toHaveBeenCalled();
    expect(getResult()?.error?.message).toBe('Birth details are missing.');
  });
});
