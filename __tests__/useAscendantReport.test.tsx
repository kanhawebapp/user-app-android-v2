import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getGeneralAscendantReport,
  getGeneralNakshatraReport,
} from '../src/services/api/astrologyApi/astrology.api';
import type {AscendantReportPayload} from '../src/services/api/astrologyApi/astrology.types';
import {useAscendantReport} from '../src/features/free-services/hooks/useAscendantReport';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import {normalizeAscendantReportData} from '../src/features/free-services/utils/ascendantReport';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getGeneralAscendantReport: jest.fn(),
  getGeneralNakshatraReport: jest.fn(),
}));

const mocked = {
  getGeneralAscendantReport: getGeneralAscendantReport as jest.MockedFunction<
    typeof getGeneralAscendantReport
  >,
  getGeneralNakshatraReport: getGeneralNakshatraReport as jest.MockedFunction<
    typeof getGeneralNakshatraReport
  >,
};

const PAYLOAD: AscendantReportPayload = {
  day: 10,
  month: 5,
  year: 1990,
  hour: 19,
  min: 55,
  lat: 19.2056,
  lon: 25.2056,
  tzone: 5.5,
};

const OTHER_PAYLOAD: AscendantReportPayload = {
  ...PAYLOAD,
  day: 11,
};

const ASCENDANT_RESPONSE = {
  asc_report: {ascendant: 'Virgo', report: 'Rising sign description.'},
};

const NAKSHATRA_RESPONSE = {
  physical: ['Strong and agile.'],
  character: ['Optimistic.', 'Organised.'],
  education: ['Good in academics.'],
  family: ['Supportive.'],
  health: ['Generally good.'],
};

/** Minimal harness: renders the hook in a component and captures each result. */
let captured: ReturnType<typeof useAscendantReport> | null = null;
let renderer: ReturnType<typeof create>;

const Harness: React.FC<{payload: AscendantReportPayload | null}> = ({
  payload,
}) => {
  captured = useAscendantReport(payload);
  return null;
};

const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

const renderHook = (payload: AscendantReportPayload | null) => {
  captured = null;
  act(() => {
    renderer = create(<Harness payload={payload} />);
  });
  return () => captured;
};

describe('useAscendantReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getGeneralAscendantReport.mockResolvedValue(ASCENDANT_RESPONSE);
    mocked.getGeneralNakshatraReport.mockResolvedValue(NAKSHATRA_RESPONSE);
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
  });

  it('requests both reports with the Kundli birth details', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.loading).toBe(true);
    expect(getResult()?.data).toBeNull();
    expect(getResult()?.missingDetails).toBe(false);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getGeneralAscendantReport).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getGeneralNakshatraReport).toHaveBeenCalledWith(PAYLOAD);
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.error).toBeNull();
    expect(getResult()?.data).toEqual(
      normalizeAscendantReportData(ASCENDANT_RESPONSE, NAKSHATRA_RESPONSE),
    );
  });

  it('starts both requests without waiting for the first one', async () => {
    renderHook(PAYLOAD);

    // Neither promise has settled yet, but both calls are already in flight.
    expect(mocked.getGeneralAscendantReport).toHaveBeenCalledTimes(1);
    expect(mocked.getGeneralNakshatraReport).toHaveBeenCalledTimes(1);

    await act(async () => {
      await flushPromises();
    });
  });

  it('sends no request when the birth details are missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getGeneralAscendantReport).not.toHaveBeenCalled();
    expect(mocked.getGeneralNakshatraReport).not.toHaveBeenCalled();
    expect(getResult()?.missingDetails).toBe(true);
    expect(getResult()?.loading).toBe(false);
    expect(getResult()?.data).toBeNull();
  });

  it('keeps the Nakshatra report when only the ascendant request fails', async () => {
    mocked.getGeneralAscendantReport.mockRejectedValue(
      new Error('Astrology API request failed (500): boom'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.data?.ascendant.ascendant).toBeNull();
    expect(getResult()?.data?.sections).toHaveLength(5);
    expect(getResult()?.ascendantError?.message).toContain('500');
    expect(getResult()?.nakshatraError).toBeNull();
    // The whole screen is not in an error state, so the report still renders.
    expect(getResult()?.error).toBeNull();
  });

  it('keeps the ascendant report when only the Nakshatra request fails', async () => {
    mocked.getGeneralNakshatraReport.mockRejectedValue(
      new Error('Astrology API request failed (404): not found'),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.data?.ascendant.ascendant).toBe('Virgo');
    expect(getResult()?.data?.sections).toEqual([]);
    expect(getResult()?.nakshatraError?.message).toContain('404');
    expect(getResult()?.ascendantError).toBeNull();
    expect(getResult()?.error).toBeNull();
  });

  it('reports a global error only when both requests fail', async () => {
    mocked.getGeneralAscendantReport.mockRejectedValue(new Error('offline'));
    mocked.getGeneralNakshatraReport.mockRejectedValue(new Error('offline'));

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.error?.message).toBe('offline');
    expect(getResult()?.ascendantError?.message).toBe('offline');
    expect(getResult()?.nakshatraError?.message).toBe('offline');
    expect(getResult()?.loading).toBe(false);
  });

  it('serves a repeat visit from the cache without a new request', async () => {
    const first = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    act(() => {
      renderer.unmount();
    });

    const second = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getGeneralAscendantReport).toHaveBeenCalledTimes(1);
    expect(mocked.getGeneralNakshatraReport).toHaveBeenCalledTimes(1);
    expect(second()?.data).toEqual(first()?.data);
    expect(second()?.loading).toBe(false);
  });

  it('re-requests both reports on reload, bypassing the cache', async () => {
    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      getResult()?.reload();
      await flushPromises();
    });

    expect(mocked.getGeneralAscendantReport).toHaveBeenCalledTimes(2);
    expect(mocked.getGeneralNakshatraReport).toHaveBeenCalledTimes(2);
  });

  it('requests the new report when the birth details change', async () => {
    renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      renderer.update(<Harness payload={OTHER_PAYLOAD} />);
      await flushPromises();
    });

    expect(mocked.getGeneralAscendantReport).toHaveBeenCalledTimes(2);
    expect(mocked.getGeneralAscendantReport).toHaveBeenLastCalledWith(
      OTHER_PAYLOAD,
    );
    expect(mocked.getGeneralNakshatraReport).toHaveBeenCalledTimes(2);
  });

  it('ignores a response for birth details that are no longer shown', async () => {
    // The first chart's requests stay in flight until the second chart's
    // report has already been rendered.
    let settleFirstAscendant: (
      value: typeof ASCENDANT_RESPONSE,
    ) => void = () => {};
    let settleFirstNakshatra: (
      value: typeof NAKSHATRA_RESPONSE,
    ) => void = () => {};

    mocked.getGeneralAscendantReport.mockReturnValueOnce(
      new Promise(resolve => {
        settleFirstAscendant = resolve;
      }),
    );
    mocked.getGeneralNakshatraReport.mockReturnValueOnce(
      new Promise(resolve => {
        settleFirstNakshatra = resolve;
      }),
    );

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      renderer.update(<Harness payload={OTHER_PAYLOAD} />);
      await flushPromises();
    });

    expect(getResult()?.data?.ascendant.ascendant).toBe('Virgo');

    // The stale response belongs to the previous chart: it must not overwrite
    // the report of the chart that is now on screen.
    await act(async () => {
      settleFirstAscendant({
        asc_report: {ascendant: 'Stale', report: 'Previous chart.'},
      });
      // An empty response is what the stale chart returns for its Nakshatra half.
      settleFirstNakshatra({} as typeof NAKSHATRA_RESPONSE);
      await flushPromises();
    });

    expect(getResult()?.data?.ascendant.ascendant).toBe('Virgo');
  });
});
