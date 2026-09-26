import {act, create} from 'react-test-renderer';
import React from 'react';

import {
  getNumeroPredictionDaily,
  getNumeroReport,
  getNumeroTable,
  getNumeroFavTime,
  getNumeroPlaceVastu,
  getNumeroFastsReport,
  getNumeroFavLord,
  getNumeroFavMantra,
} from '../src/services/api/astrologyApi/astrology.api';
import {useNumerologyData} from '../src/features/free-services/hooks/useNumerologyData';
import {clearKundliResponseCache} from '../src/features/free-services/utils/kundliApiCache';
import type {NumeroRequestPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('../src/services/api/astrologyApi/astrology.api', () => ({
  getNumeroPredictionDaily: jest.fn(),
  getNumeroTable: jest.fn(),
  getNumeroReport: jest.fn(),
  getNumeroFavTime: jest.fn(),
  getNumeroPlaceVastu: jest.fn(),
  getNumeroFastsReport: jest.fn(),
  getNumeroFavLord: jest.fn(),
  getNumeroFavMantra: jest.fn(),
}));

const mocked = {
  getNumeroPredictionDaily: getNumeroPredictionDaily as jest.MockedFunction<
    typeof getNumeroPredictionDaily
  >,
  getNumeroTable: getNumeroTable as jest.MockedFunction<typeof getNumeroTable>,
  getNumeroReport: getNumeroReport as jest.MockedFunction<
    typeof getNumeroReport
  >,
  getNumeroFavTime: getNumeroFavTime as jest.MockedFunction<
    typeof getNumeroFavTime
  >,
  getNumeroPlaceVastu: getNumeroPlaceVastu as jest.MockedFunction<
    typeof getNumeroPlaceVastu
  >,
  getNumeroFastsReport: getNumeroFastsReport as jest.MockedFunction<
    typeof getNumeroFastsReport
  >,
  getNumeroFavLord: getNumeroFavLord as jest.MockedFunction<
    typeof getNumeroFavLord
  >,
  getNumeroFavMantra: getNumeroFavMantra as jest.MockedFunction<
    typeof getNumeroFavMantra
  >,
};

const PAYLOAD: NumeroRequestPayload = {
  name: 'Ari',
  day: 10,
  month: 5,
  year: 1990,
};

let capturedResult: ReturnType<typeof useNumerologyData> | null = null;

const Harness: React.FC<{payload: NumeroRequestPayload | null}> = ({
  payload,
}) => {
  capturedResult = useNumerologyData(payload);
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

describe('useNumerologyData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearKundliResponseCache();
    mocked.getNumeroPredictionDaily.mockResolvedValue({prediction: 'Good day'});
    mocked.getNumeroTable.mockResolvedValue({destiny_number: 5});
    mocked.getNumeroReport.mockResolvedValue({
      title: 'Report',
      description: 'Desc',
    });
    mocked.getNumeroFavTime.mockResolvedValue({
      title: 'Time',
      description: 'Desc',
    });
    mocked.getNumeroPlaceVastu.mockResolvedValue({
      title: 'Vastu',
      description: 'Desc',
    });
    mocked.getNumeroFastsReport.mockResolvedValue({
      title: 'Fasts',
      description: 'Desc',
    });
    mocked.getNumeroFavLord.mockResolvedValue({
      title: 'Lord',
      description: 'Desc',
    });
    mocked.getNumeroFavMantra.mockResolvedValue({
      title: 'Mantra',
      description: 'Desc',
    });
  });

  afterEach(() => {
    unmount();
  });

  it('fetches all eight endpoints in parallel with the same payload', async () => {
    const getResult = renderHook(PAYLOAD);

    expect(getResult()?.error).toBeNull();

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getNumeroPredictionDaily).toHaveBeenCalledTimes(1);
    expect(mocked.getNumeroPredictionDaily).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroTable).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroReport).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroFavTime).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroPlaceVastu).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroFastsReport).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroFavLord).toHaveBeenCalledWith(PAYLOAD);
    expect(mocked.getNumeroFavMantra).toHaveBeenCalledWith(PAYLOAD);

    expect(getResult()?.prediction.data).toEqual({prediction: 'Good day'});
    expect(getResult()?.table.data).toEqual({destiny_number: 5});
    expect(getResult()?.report.data).toEqual({
      title: 'Report',
      description: 'Desc',
    });
  });

  it('keeps the successful cards when one request fails', async () => {
    mocked.getNumeroReport.mockRejectedValue(new Error('Report failed'));

    const getResult = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(getResult()?.prediction.data).toEqual({prediction: 'Good day'});
    expect(getResult()?.report.data).toBeNull();
    expect(getResult()?.report.error?.message).toBe('Report failed');
    expect(getResult()?.error).toBeNull();
  });

  it('sets a global error and skips fetching when payload is missing', async () => {
    const getResult = renderHook(null);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getNumeroPredictionDaily).not.toHaveBeenCalled();
    expect(getResult()?.error?.message).toBe('Birth details are missing.');
  });

  it('serves cached responses without re-fetching on re-mount', async () => {
    renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getNumeroPredictionDaily).toHaveBeenCalledTimes(1);

    unmount();

    const getResult2 = renderHook(PAYLOAD);

    await act(async () => {
      await flushPromises();
    });

    expect(mocked.getNumeroPredictionDaily).toHaveBeenCalledTimes(1);
    expect(getResult2()?.prediction.data).toEqual({prediction: 'Good day'});
  });
});
