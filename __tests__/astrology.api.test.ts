import axios from 'axios';

import {
  getAstroDetails,
  getBasicPanchang,
  getBirthDetails,
  getHoroscopeChart,
  getMajorVdasha,
  getMatchAshtakootPoints,
  getMatchAstroDetails,
  getMatchMakingReport,
  getMatchManglikReport,
  getMatchObstructions,
  getPlanets,
  normalizeHoroscopeChartResponse,
  resolveBirthPlace,
} from '../src/services/api/astrologyApi/astrology.api';
import type {
  AstrologyMuhurtaPayload,
  HoroscopeChartPayload,
  MatchMakingPayload,
} from '../src/services/api/astrologyApi/astrology.types';

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

describe('Match Making (Kundli Milan) endpoints', () => {
  const MATCH_PAYLOAD: MatchMakingPayload = {
    m_day: 10,
    m_month: 5,
    m_year: 1990,
    m_hour: 21,
    m_min: 30,
    m_lat: 28.6139,
    m_lon: 77.209,
    m_tzone: 5.5,
    f_day: 22,
    f_month: 11,
    f_year: 1992,
    f_hour: 6,
    f_min: 15,
    f_lat: 19.076,
    f_lon: 72.8777,
    f_tzone: 5.5,
  };

  const callExpectations: {
    name: string;
    run: () => Promise<unknown>;
    url: string;
  }[] = [
    {
      name: 'getMatchMakingReport',
      run: () => getMatchMakingReport(MATCH_PAYLOAD),
      url: '/v1/match_making_report',
    },
    {
      name: 'getMatchManglikReport',
      run: () => getMatchManglikReport(MATCH_PAYLOAD),
      url: '/v1/match_manglik_report',
    },
    {
      name: 'getMatchAstroDetails',
      run: () => getMatchAstroDetails(MATCH_PAYLOAD),
      url: '/v1/match_astro_details',
    },
    {
      name: 'getMatchObstructions',
      run: () => getMatchObstructions(MATCH_PAYLOAD),
      url: '/v1/match_obstructions',
    },
    {
      name: 'getMatchAshtakootPoints',
      run: () => getMatchAshtakootPoints(MATCH_PAYLOAD),
      url: '/v1/match_ashtakoot_points',
    },
  ];

  it.each(callExpectations)(
    '$name posts the shared payload to $url and returns the response',
    async ({run, url}) => {
      getRequestMock().mockResolvedValueOnce({data: {ok: true}});

      const result = await run();

      expect(getRequestMock()).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url,
          data: expect.stringContaining('m_day=10'),
        }),
      );
      expect(result).toEqual({ok: true});
    },
  );

  it.each(callExpectations)(
    '$name requests the report in English',
    async ({run}) => {
      getRequestMock().mockResolvedValueOnce({data: {}});

      await run();

      expect(getRequestMock()).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({'Accept-Language': 'en'}),
        }),
      );
    },
  );

  it('throws a formatted error when a match request fails', async () => {
    getRequestMock().mockRejectedValueOnce({
      response: {status: 500, data: 'Server exploded'},
    });

    await expect(getMatchMakingReport(MATCH_PAYLOAD)).rejects.toThrow(
      'Astrology API request failed',
    );
  });
});

describe('resolveBirthPlace', () => {
  const mockGeocode = (response: unknown) => {
    (axios.get as jest.Mock).mockResolvedValueOnce({data: response});
  };

  beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
  });

  it('geocodes the place and derives the offset for the birth moment', async () => {
    // Asia/Kolkata has been UTC+5:30 with no daylight saving since 1945.
    mockGeocode([
      {
        lat: '28.6139',
        lon: '77.209',
        display_name: 'Delhi, India',
      },
    ]);
    mockGeocode({timezone: 'Asia/Kolkata', utc_offset_seconds: 19800});

    const place = await resolveBirthPlace(
      'Delhi',
      new Date(1990, 4, 10, 21, 30),
    );

    expect(place).toEqual({
      place: 'Delhi, India',
      lat: 28.6139,
      lon: 77.209,
      timezone: 5.5,
      timezoneName: 'Asia/Kolkata',
    });
  });

  it('queries the timezone of the resolved coordinates', async () => {
    mockGeocode([{lat: '19.076', lon: '72.8777', display_name: 'Mumbai'}]);
    mockGeocode({timezone: 'Asia/Kolkata'});

    await resolveBirthPlace('Mumbai', new Date(1992, 10, 22, 6, 15));

    expect(axios.get).toHaveBeenLastCalledWith(
      expect.stringContaining('latitude=19.076'),
      expect.anything(),
    );
  });

  it('rejects when the place has no coordinates', async () => {
    mockGeocode([{lat: 'not-a-number', lon: 'nope', display_name: 'Nowhere'}]);

    await expect(resolveBirthPlace('Nowhere')).rejects.toThrow(
      'No coordinates found for the selected address.',
    );
  });

  it('fails instead of falling back to the device timezone', async () => {
    mockGeocode([{lat: '28.6139', lon: '77.209', display_name: 'Delhi'}]);
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('offline'));

    await expect(resolveBirthPlace('Delhi')).rejects.toThrow(
      'Unable to resolve the timezone of the selected birth place.',
    );
  });

  it('uses the offset in force at the birth moment, not the current one', async () => {
    // London was UTC+0 in January 1990 and UTC+1 (BST) in July 1990, and the
    // device running this test is on UTC+5:30, so a device-derived offset
    // could not produce either value.
    mockGeocode([{lat: '51.5074', lon: '-0.1278', display_name: 'London'}]);

    mockGeocode({timezone: 'Europe/London', utc_offset_seconds: 0});
    const winter = await resolveBirthPlace(
      'London',
      new Date(1990, 0, 15, 12, 0),
    );

    mockGeocode([{lat: '51.5074', lon: '-0.1278', display_name: 'London'}]);
    mockGeocode({timezone: 'Europe/London', utc_offset_seconds: 3600});
    const summer = await resolveBirthPlace(
      'London',
      new Date(1990, 6, 15, 12, 0),
    );

    expect(winter.timezone).toBe(0);
    expect(summer.timezone).toBe(1);
  });

  it('fails when the timezone lookup returns nothing usable', async () => {
    mockGeocode([{lat: '28.6139', lon: '77.209', display_name: 'Delhi'}]);
    mockGeocode({});

    await expect(resolveBirthPlace('Delhi')).rejects.toThrow(
      'Unable to resolve the timezone of the selected birth place.',
    );
  });
});
