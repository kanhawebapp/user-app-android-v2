import axios from 'axios';

import {
  getAstroDetails,
  getBasicPanchang,
  getBirthDetails,
  getHoroscopeChart,
  getMajorVdasha,
  getPlanets,
  normalizeHoroscopeChartResponse,
} from '../src/services/api/astrologyApi/astrology.api';
import type {AstrologyMuhurtaPayload, HoroscopeChartPayload} from '../src/services/api/astrologyApi/astrology.types';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    request: jest.fn(),
    interceptors: {request: {use: jest.fn()}},
  })),
  get: jest.fn(),
}));

const mockCreate = axios.create as jest.MockedFunction<typeof axios.create>;

const getRequestMock = () => {
  const client = mockCreate.mock.results[0]?.value;
  return (client as {request: jest.Mock}).request;
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

describe('normalizeHoroscopeChartResponse', () => {
  it('wraps a raw SVG string (chalit response shape)', () => {
    expect(normalizeHoroscopeChartResponse('<svg>chalit</svg>')).toEqual({
      svg: '<svg>chalit</svg>',
    });
  });

  it('passes through a wrapped svg object (D9 response shape)', () => {
    expect(normalizeHoroscopeChartResponse({svg: '<svg>d9</svg>'})).toEqual({
      svg: '<svg>d9</svg>',
    });
  });

  it('returns an empty object for an empty string', () => {
    expect(normalizeHoroscopeChartResponse('')).toEqual({});
  });

  it('returns an empty object for non-svg data', () => {
    expect(normalizeHoroscopeChartResponse(null)).toEqual({});
    expect(normalizeHoroscopeChartResponse({status: 200})).toEqual({});
    expect(normalizeHoroscopeChartResponse(123)).toEqual({});
  });
});

describe('getHoroscopeChart', () => {
  it('calls the chalit endpoint and normalizes a raw string response', async () => {
    getRequestMock().mockResolvedValueOnce({data: '<svg>chalit</svg>'});

    const result = await getHoroscopeChart('chalit', PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/v1/horo_chart_image/chalit',
      }),
    );
    expect(result).toEqual({svg: '<svg>chalit</svg>'});
  });

  it('calls the D9 endpoint and passes through the wrapped response', async () => {
    getRequestMock().mockResolvedValueOnce({data: {svg: '<svg>d9</svg>'}});

    const result = await getHoroscopeChart('D9', PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/v1/horo_chart_image/D9',
      }),
    );
    expect(result).toEqual({svg: '<svg>d9</svg>'});
  });

  it('throws a formatted error when the request fails', async () => {
    getRequestMock().mockRejectedValueOnce({
      response: {status: 500, data: 'Server exploded'},
    });

    await expect(getHoroscopeChart('chalit', PAYLOAD)).rejects.toThrow(
      'Astrology API request failed',
    );
  });
});

describe('Kundli (Birth Chart) endpoints', () => {
  const BASIC_PAYLOAD: AstrologyMuhurtaPayload = {
    day: 10,
    month: 5,
    year: 1990,
    hour: 19,
    min: 55,
    lat: 19.2056,
    lon: 25.2056,
    tzone: 5.5,
  };

  it('getBirthDetails calls /v1/birth_details with the shared payload', async () => {
    getRequestMock().mockResolvedValueOnce({data: {year: 1990, month: 5}});

    const result = await getBirthDetails(BASIC_PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/v1/birth_details',
      }),
    );
    expect(result).toEqual({year: 1990, month: 5});
  });

  it('getBasicPanchang calls /v1/basic_panchang', async () => {
    getRequestMock().mockResolvedValueOnce({data: {day: 'Wednesday'}});

    const result = await getBasicPanchang(BASIC_PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({url: '/v1/basic_panchang'}),
    );
    expect(result).toEqual({day: 'Wednesday'});
  });

  it('getAstroDetails calls /v1/astro_details', async () => {
    getRequestMock().mockResolvedValueOnce({data: {ascendant: 'Leo'}});

    const result = await getAstroDetails(BASIC_PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({url: '/v1/astro_details'}),
    );
    expect(result).toEqual({ascendant: 'Leo'});
  });

  it('getPlanets calls /v1/planets and returns the planet list', async () => {
    const planets = [{name: 'Sun', house: 9}];
    getRequestMock().mockResolvedValueOnce({data: planets});

    const result = await getPlanets(BASIC_PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({url: '/v1/planets'}),
    );
    expect(result).toEqual(planets);
  });

  it('getMajorVdasha calls /v1/major_vdasha and returns the dasha list', async () => {
    const dashas = [{planet: 'Ketu', start: '2-5-1994  14:7'}];
    getRequestMock().mockResolvedValueOnce({data: dashas});

    const result = await getMajorVdasha(BASIC_PAYLOAD);

    expect(getRequestMock()).toHaveBeenCalledWith(
      expect.objectContaining({url: '/v1/major_vdasha'}),
    );
    expect(result).toEqual(dashas);
  });

  it('throws a formatted error for failed kundli requests', async () => {
    getRequestMock().mockRejectedValueOnce({
      response: {status: 401, data: {error: 'Unauthorized'}},
    });

    await expect(getPlanets(BASIC_PAYLOAD)).rejects.toThrow(
      'Astrology API request failed',
    );
  });
});
