import {
  kundliCards,
  getKundliCardIcon,
  isKundliService,
  CHART_LABELS,
  CHART_TYPES,
  DIVISIONAL_CHARTS,
  buildBasicDetailsPayload,
  buildHoroscopeChartPayload,
  isBirthChartCard,
  getSvgAspectRatio,
  beautifyKundliSvg,
  PLANET_COLOR_MAP,
  ZODIAC_COLOR_MAP,
  formatDashaDateTime,
  getDashaDuration,
  formatDashaDuration,
  getPlanetAbbreviation,
  getPlanetColor,
  formatPlanetDegree,
  formatPlanetSpeed,
  toDisplayValue,
} from '../src/features/free-services/utils/kundliService';

describe('kundliCards', () => {
  it('contains the expected 12 feature cards', () => {
    expect(kundliCards).toHaveLength(12);
  });

  it('contains the expected card names and descriptions', () => {
    expect(kundliCards).toEqual([
      {
        name: 'Birth Chart / Kundli',
        named: 'Planet positions & various charts',
      },
      {
        name: 'General Life Prediction',
        named: 'Get to know about your nature',
      },
      {
        name: 'Dosha in Kundli',
        named: 'Do you have any Kundli Dosh?',
      },
      {
        name: 'Match Horoscope',
        named: 'Kundli Milan (Guna Milan)',
      },
      {
        name: 'Numerology',
        named: 'Your Lucky number is...',
      },
      {
        name: 'My Day Today',
        named: 'Get predictions about the day',
      },
      {
        name: 'Nakshatra',
        named: 'Get to know about your Nakshatra',
      },
      {
        name: 'Lal Kitab Horoscope',
        named: 'Get your Life Report as PDF',
      },
      {
        name: 'Sade Sati',
        named: 'How Sade Sati affects you?',
      },
      {
        name: 'Suggestions and Remedies',
        named: 'Free Remedies Suggestion Report',
      },
      {
        name: 'Ascendant Report',
        named: 'Get your Life Report as PDF',
      },
      {
        name: 'Char / Yogini Dasha',
        named: 'Timing events based on planets',
      },
    ]);
  });
});

describe('getKundliCardIcon', () => {
  it('returns an icon config for every card', () => {
    kundliCards.forEach(card => {
      const icon = getKundliCardIcon(card.name);
      expect(typeof icon.name).toBe('string');
      expect(icon.library).toBe('MaterialIcons');
    });
  });

  it('maps specific cards to meaningful icons', () => {
    expect(getKundliCardIcon('Birth Chart / Kundli').name).toBe('donut-large');
    expect(getKundliCardIcon('Nakshatra').name).toBe('stars');
    expect(getKundliCardIcon('Match Horoscope').name).toBe('favorite');
    expect(getKundliCardIcon('Numerology').name).toBe('tag');
    expect(getKundliCardIcon('Char / Yogini Dasha').name).toBe('timeline');
  });

  it('returns a fallback icon for unknown names', () => {
    expect(getKundliCardIcon('Unknown Feature').name).toBe('auto-awesome');
  });
});

describe('isKundliService', () => {
  it('returns true for kundli titles', () => {
    expect(isKundliService('Kundli')).toBe(true);
    expect(isKundliService('Free Kundli')).toBe(true);
    expect(isKundliService('Kundli Reading')).toBe(true);
  });

  it('returns true for kundali spelling', () => {
    expect(isKundliService('Kundali')).toBe(true);
  });

  it('returns false for unrelated titles', () => {
    expect(isKundliService('Panchang')).toBe(false);
    expect(isKundliService('Chaughadiya Muhurta')).toBe(false);
    expect(isKundliService('')).toBe(false);
  });
});

describe('CHART_LABELS', () => {
  it('maps both chart types to their display labels', () => {
    expect(CHART_LABELS.chalit).toBe('Lagna / Ascendant / Basic Birth Chart');
    expect(CHART_LABELS.D9).toBe('Navamsa (Prospects of Marriage)');
  });

  it('exposes a stable chart type order', () => {
    expect(CHART_TYPES).toEqual(['chalit', 'D9']);
  });
});

describe('DIVISIONAL_CHARTS', () => {
  it('lists every divisional chart from the task table and excludes chalit', () => {
    const ids = DIVISIONAL_CHARTS.map(c => c.chartId);
    expect(ids).toEqual([
      'SUN',
      'MOON',
      'D1',
      'D2',
      'D3',
      'D4',
      'D5',
      'D7',
      'D8',
      'D9',
      'D10',
      'D12',
      'D16',
      'D20',
      'D24',
      'D27',
      'D30',
      'D40',
      'D45',
      'D60',
    ]);
    expect(ids).not.toContain('chalit');
  });

  it('maps every chart id to a display title', () => {
    const titles = DIVISIONAL_CHARTS.map(c => c.title);
    expect(titles).toContain('Sun Chart');
    expect(titles).toContain('Navamansha Chart');
    expect(titles).toContain('Shashtymsha Chart');
    DIVISIONAL_CHARTS.forEach(c => {
      expect(typeof c.title).toBe('string');
      expect(c.title.length).toBeGreaterThan(0);
    });
  });
});

describe('buildBasicDetailsPayload', () => {
  it('reuses the birth details and strips chart/config and address fields', () => {
    const birthPayload = {
      day: 10,
      month: 5,
      year: 1990,
      hour: 19,
      min: 55,
      lat: 19.2056,
      lon: 25.2056,
      tzone: 5.5,
      address: 'Somewhere',
    };

    expect(buildBasicDetailsPayload(birthPayload)).toEqual({
      day: 10,
      month: 5,
      year: 1990,
      hour: 19,
      min: 55,
      lat: 19.2056,
      lon: 25.2056,
      tzone: 5.5,
    });
  });

  it('tolerates a missing payload', () => {
    const payload = buildBasicDetailsPayload(null);
    expect(payload.day).toBe(0);
    expect(payload.tzone).toBe(0);
  });
});

describe('buildHoroscopeChartPayload', () => {
  it('reuses the birth details and adds chart configuration', () => {
    const birthPayload = {
      day: 10,
      month: 5,
      year: 1990,
      hour: 19,
      min: 55,
      lat: 19.2056,
      lon: 25.2056,
      tzone: 5.5,
      address: 'Somewhere',
    };

    expect(buildHoroscopeChartPayload(birthPayload)).toEqual({
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
    });
  });

  it('does not include the address field', () => {
    const payload = buildHoroscopeChartPayload({
      day: 1,
      month: 1,
      year: 2000,
      hour: 12,
      min: 0,
      lat: 1,
      lon: 2,
      tzone: 3,
      address: 'Somewhere',
    });

    expect(payload).not.toHaveProperty('address');
  });

  it('tolerates a missing payload', () => {
    const payload = buildHoroscopeChartPayload(null);
    expect(payload.day).toBe(0);
    expect(payload.image_type).toBe('svg');
  });
});

describe('isBirthChartCard', () => {
  it('returns true for the Birth Chart card name', () => {
    expect(isBirthChartCard('Birth Chart / Kundli')).toBe(true);
    expect(isBirthChartCard('birth chart')).toBe(true);
  });

  it('returns false for unrelated cards', () => {
    expect(isBirthChartCard('Nakshatra')).toBe(false);
    expect(isBirthChartCard('')).toBe(false);
  });
});

describe('getSvgAspectRatio', () => {
  it('extracts the aspect ratio from a viewBox', () => {
    const svg = '<svg xmlns="..." viewBox="0 0 400 300">...</svg>';
    expect(getSvgAspectRatio(svg)).toBeCloseTo(400 / 300);
  });

  it('handles a viewBox with negative origin', () => {
    const svg = '<svg viewBox="-10 -20 500 250"/>';
    expect(getSvgAspectRatio(svg)).toBeCloseTo(2);
  });

  it('returns null when there is no viewBox', () => {
    expect(getSvgAspectRatio('<svg width="100"></svg>')).toBeNull();
  });

  it('returns null for empty or malformed input', () => {
    expect(getSvgAspectRatio('')).toBeNull();
    expect(getSvgAspectRatio(undefined as unknown as string)).toBeNull();
    expect(getSvgAspectRatio('viewBox="0 0 0 300"')).toBeNull();
  });
});

const SAMPLE_CHART_SVG =
  '<svg width="350" height="350" id="chartSvg" xmlns="http://www.w3.org/2000/svg">' +
  '<g class="slice">' +
  '<path d="M10,10L175,10L92.5,92.5L10,10" stroke="#ff0000" stroke-width="1" fill="none"></path>' +
  '<text font-size="15" style="fill: black;">11</text>' +
  '<text x="171.7" y="161.8" font-size="15" style="fill: black;">6</text>' +
  '<text x="247.5" y="175" font-size="14" style="fill: black;">Ju </text>' +
  '<text x="165" y="262.5" font-size="14" style="fill: black;">Ve </text>' +
  '</g>' +
  '</svg>';

describe('beautifyKundliSvg', () => {
  it('returns input untouched for empty or malformed values', () => {
    expect(beautifyKundliSvg('')).toBe('');
    expect(beautifyKundliSvg('   ')).toBe('   ');
    expect(beautifyKundliSvg('not an svg')).toBe('not an svg');
  });

  it('skips already-beautified SVGs that have a viewBox', () => {
    const already = '<svg viewBox="0 0 350 350"></svg>';
    expect(beautifyKundliSvg(already)).toBe(already);
  });

  it('replaces fixed dimensions with a responsive viewBox', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const openTag = out.match(/<svg\b[^>]*>/)?.[0] ?? '';
    expect(openTag).not.toContain('width=');
    expect(openTag).not.toContain('height=');
    expect(out).toMatch(/viewBox="0 0 350 350"/);
  });

  it('adds a rounded soft background behind the chart', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    expect(out).toContain('rx="12"');
    expect(out).toContain('fill="#f1ebffb3"');
    expect(out).not.toContain('fill="#FFA500"');
  });

  it('keeps the slice group and geometry untransformed', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const sliceOpen = out.match(/<g class="slice"[^>]*>/)?.[0] ?? '';
    expect(sliceOpen).toBe('<g class="slice">');
    expect(sliceOpen).not.toMatch(/\btransform=/);
    expect(out).toContain('d="M10,10L175,10L92.5,92.5L10,10"');
  });

  it('recolours and thickens every chart line', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    expect(out).toContain('stroke="#FFA500"');
    expect(out).toContain('stroke-width="1.5"');
    expect(out).not.toContain('stroke="#ff0000"');
  });

  it('preserves every path with the expected line styling', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const paths = [...out.matchAll(/<path\b[^>]*>/g)].map(m => m[0]);
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach(p => {
      expect(p).toContain('stroke="#FFA500"');
      expect(p).toContain('stroke-width="1.5"');
      expect(p).toContain('fill="none"');
      expect(p).toContain('d="');
    });
  });

  it('colours house numbers from the zodiac palette', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    expect(out).toContain(`fill: ${ZODIAC_COLOR_MAP[6]}; font-weight: 600;`);
    expect(out).toContain('font-size="14"');
  });

  it('keeps every label inside the slice group', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const sliceGroup =
      out.match(/<g class="slice"[^>]*>[\s\S]*?<\/g>/)?.[0] ?? '';
    expect(sliceGroup).toContain('<path');
    expect(sliceGroup).toContain('<text');
  });

  it('preserves the original label coordinates from the API', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    expect(out).toContain('x="171.7" y="161.8"');
    expect(out).toContain('x="247.5" y="175"');
    expect(out).toContain('x="165" y="262.5"');
  });

  it('adds no position offsets or anchors to any label', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const texts = [...out.matchAll(/<text\b([^>]*)>/g)].map(m => m[1]);
    expect(texts.length).toBeGreaterThan(0);
    texts.forEach(attrs => {
      expect(attrs).not.toMatch(/\b(dx|dy|transform)=/);
      expect(attrs).not.toMatch(/\btext-anchor=/);
    });
  });

  it('keeps every label inside the chart canvas', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const texts = [...out.matchAll(/<text\b([^>]*)>/g)].map(m => m[1]);
    expect(texts.length).toBeGreaterThan(0);
    texts.forEach(attrs => {
      const x = attrs.match(/x="(\d+(?:\.\d+)?)"/)?.[1];
      const y = attrs.match(/y="(\d+(?:\.\d+)?)"/)?.[1];
      if (x) {
        expect(parseFloat(x)).toBeGreaterThanOrEqual(0);
        expect(parseFloat(x)).toBeLessThanOrEqual(350);
      }
      if (y) {
        expect(parseFloat(y)).toBeGreaterThanOrEqual(0);
        expect(parseFloat(y)).toBeLessThanOrEqual(350);
      }
    });
  });

  it('leaves the label without coordinates exactly as the API returned it', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    const elevenText = out.match(/<text\b[^>]*>11<\/text>/)?.[0] ?? '';
    expect(elevenText).not.toMatch(/\bx=/);
    expect(elevenText).not.toMatch(/\by=/);
    expect(elevenText).not.toMatch(/\btext-anchor=/);
  });

  it('trims and colours planet abbreviations from the planet palette', () => {
    const out = beautifyKundliSvg(SAMPLE_CHART_SVG);
    expect(out).toContain(`fill: ${PLANET_COLOR_MAP.Ju}; font-weight: 600;`);
    expect(out).toContain(`fill: ${PLANET_COLOR_MAP.Ve}; font-weight: 600;`);
    expect(out).toContain('font-size="15"');
    expect(out).not.toContain('>Ju </text>');
    expect(out).not.toContain('>Ve </text>');
  });
});

describe('formatDashaDateTime', () => {
  it('formats the API date string with 12-hour time', () => {
    expect(formatDashaDateTime('2-5-1994  14:7')).toBe('02 May 1994, 02:07 PM');
    expect(formatDashaDateTime('2-5-1994 8:7')).toBe('02 May 1994, 08:07 AM');
  });

  it('formats midnight as 12 AM and noon as 12 PM', () => {
    expect(formatDashaDateTime('1-1-2000  0:0')).toBe(
      '01 January 2000, 12:00 AM',
    );
    expect(formatDashaDateTime('1-1-2000  12:30')).toBe(
      '01 January 2000, 12:30 PM',
    );
  });

  it('returns the raw value for unexpected formats', () => {
    expect(formatDashaDateTime('not-a-date')).toBe('not-a-date');
    expect(formatDashaDateTime(undefined)).toBe('—');
  });
});

describe('getPlanetAbbreviation', () => {
  it('maps known planet names to their chart abbreviations', () => {
    expect(getPlanetAbbreviation('Sun')).toBe('Su');
    expect(getPlanetAbbreviation('Moon')).toBe('Mo');
    expect(getPlanetAbbreviation('Mercury')).toBe('Me');
    expect(getPlanetAbbreviation('Jupiter')).toBe('Ju');
    expect(getPlanetAbbreviation('Venus')).toBe('Ve');
    expect(getPlanetAbbreviation('Saturn')).toBe('Sa');
    expect(getPlanetAbbreviation('Rahu')).toBe('Ra');
    expect(getPlanetAbbreviation('Ketu')).toBe('Ke');
  });

  it('falls back to the first two letters for unknown names', () => {
    expect(getPlanetAbbreviation('Foo')).toBe('Fo');
    expect(getPlanetAbbreviation(undefined)).toBe('?');
  });
});

describe('getPlanetColor', () => {
  it('returns the chart colour for known planets', () => {
    expect(getPlanetColor('Sun')).toBe(PLANET_COLOR_MAP.Su);
    expect(getPlanetColor('Moon')).toBe(PLANET_COLOR_MAP.Mo);
    expect(getPlanetColor('Ketu')).toBe(PLANET_COLOR_MAP.Ke);
  });

  it('falls back to the primary colour for unknown planets', () => {
    expect(getPlanetColor('Foo')).toBe('#5B2CA5');
    expect(getPlanetColor(undefined)).toBe('#5B2CA5');
  });
});

describe('getDashaDuration', () => {
  it('computes whole-year spans', () => {
    expect(getDashaDuration('2-5-1994 14:7', '2-5-2001 8:7')).toEqual({
      years: 7,
      months: 0,
      days: 0,
    });
  });

  it('computes months and days with borrowing', () => {
    expect(getDashaDuration('10-3-1990 12:0', '10-5-1997 12:0')).toEqual({
      years: 7,
      months: 2,
      days: 0,
    });
    expect(getDashaDuration('10-1-2020 0:0', '5-2-2020 0:0')).toEqual({
      years: 0,
      months: 0,
      days: 26,
    });
    expect(getDashaDuration('31-3-2020 0:0', '1-5-2020 0:0')).toEqual({
      years: 0,
      months: 1,
      days: 0,
    });
  });

  it('returns null when dates are unparseable or inverted', () => {
    expect(getDashaDuration(undefined, '2-5-2001 8:7')).toBeNull();
    expect(getDashaDuration('not-a-date', '2-5-2001 8:7')).toBeNull();
    expect(getDashaDuration('2-5-2001 8:7', '2-5-1994 14:7')).toBeNull();
  });
});

describe('formatDashaDuration', () => {
  it('formats the duration as readable parts', () => {
    expect(formatDashaDuration('2-5-1994 14:7', '2-5-2001 8:7')).toBe(
      '7 years',
    );
    expect(formatDashaDuration('10-3-1990 12:0', '10-5-1997 12:0')).toBe(
      '7 years, 2 months',
    );
    expect(formatDashaDuration('10-1-2020 0:0', '5-2-2020 0:0')).toBe(
      '26 days',
    );
  });

  it('uses singular units and handles zero-length spans', () => {
    expect(formatDashaDuration('2-5-1994 14:7', '2-6-1994 14:7')).toBe(
      '1 month',
    );
    expect(formatDashaDuration('2-5-1994 14:7', '2-5-1994 14:7')).toBe(
      '0 days',
    );
  });

  it('returns a dash when the duration cannot be computed', () => {
    expect(formatDashaDuration(undefined, '2-5-2001 8:7')).toBe('—');
    expect(formatDashaDuration('2-5-2001 8:7', '2-5-1994 14:7')).toBe('—');
  });
});

describe('formatPlanetDegree', () => {
  it('formats numeric degrees with two decimals and a degree symbol', () => {
    expect(formatPlanetDegree(12.189540792)).toBe('12.19°');
    expect(formatPlanetDegree('0')).toBe('0.00°');
  });

  it('returns a dash for missing values', () => {
    expect(formatPlanetDegree(undefined)).toBe('—');
    expect(formatPlanetDegree('n/a')).toBe('—');
  });
});

describe('formatPlanetSpeed', () => {
  it('formats speed with two decimals and keeps negative values', () => {
    expect(formatPlanetSpeed(0.953779744)).toBe('0.95°/day');
    expect(formatPlanetSpeed(-0.294679)).toBe('-0.29°/day');
  });

  it('returns a dash for missing values', () => {
    expect(formatPlanetSpeed(undefined)).toBe('—');
  });
});

describe('toDisplayValue', () => {
  it('renders booleans as Yes/No', () => {
    expect(toDisplayValue(true)).toBe('Yes');
    expect(toDisplayValue(false)).toBe('No');
  });

  it('renders nullish/empty values as a dash', () => {
    expect(toDisplayValue(null)).toBe('—');
    expect(toDisplayValue(undefined)).toBe('—');
    expect(toDisplayValue('')).toBe('—');
  });

  it('stringifies other values', () => {
    expect(toDisplayValue('Leo')).toBe('Leo');
    expect(toDisplayValue(3)).toBe('3');
  });
});
