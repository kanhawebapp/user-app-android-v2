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

let capturedResult: ReturnType<typeof useDivisionalCharts> | null = null;

const Harness: React.FC<{
  payload: HoroscopeChartPayload | null;
  enabled: boolean;
}> = ({payload, enabled}) => {
  capturedResult = useDivisionalCharts(payload, enabled);
  return null;
};

let renderer: ReturnType<typeof create>;

const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: HoroscopeChartPayload | null, enabled: boolean) => {
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

  it('fetches every divisional chart in parallel once enabled', async () => {
    renderHook(PAYLOAD, false);
    const getResult = rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(
      DIVISIONAL_CHARTS.length,
    );
    DIVISIONAL_CHARTS.forEach(chart => {
      expect(mocked.getHoroscopeChart).toHaveBeenCalledWith(
        chart.chartId,
        PAYLOAD,
      );
    });

    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.charts).toHaveLength(DIVISIONAL_CHARTS.length);
    expect(getResult()?.charts[0]).toEqual({
      chartId: 'SUN',
      title: DIVISIONAL_CHARTS[0].title,
      svg: '<svg>SUN</svg>',
      error: null,
    });
  });

  it('serves cached charts from the cache without a new request', async () => {
    const d9Key = buildChartCacheKey('D9', PAYLOAD);
    setCachedChartSvg(d9Key, '<svg>cached-d9</svg>');

    renderHook(PAYLOAD, false);
    const getResult = rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getHoroscopeChart).toHaveBeenCalledTimes(
      DIVISIONAL_CHARTS.length - 1,
    );
    expect(mocked.getHoroscopeChart).not.toHaveBeenCalledWith('D9', PAYLOAD);

    const d9 = getResult()?.charts.find(c => c.chartId === 'D9');
    expect(d9?.svg).toBe('<svg>cached-d9</svg>');
    expect(d9?.error).toBeNull();
  });

  it('captures per-chart errors without failing the rest', async () => {
    mocked.getHoroscopeChart.mockImplementation(async type => {
      if (type === 'MOON') {
        throw new Error('Moon failed');
      }
      return {svg: `<svg>${type}</svg>`};
    });

    renderHook(PAYLOAD, false);
    const getResult = rerender(PAYLOAD, true);

    await act(async () => {
      await flushPromises();
    });

    const moon = getResult()?.charts.find(c => c.chartId === 'MOON');
    expect(moon?.svg).toBeNull();
    expect(moon?.error?.message).toBe('Moon failed');

    const sun = getResult()?.charts.find(c => c.chartId === 'SUN');
    expect(sun?.svg).toBe('<svg>SUN</svg>');
    expect(getResult()?.error).toBeNull();
  });
});
