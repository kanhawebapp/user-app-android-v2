import {getMuhurtaStyle, MUHURTA_COLOR_MAP} from '../src/features/free-services/utils/muhurtaColors';

describe('muhurtaColors', () => {
  it('returns mapped colors for known muhurta names', () => {
    expect(getMuhurtaStyle('Amrit')).toEqual({
      backgroundColor: '#22c55e',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Shubh')).toEqual({
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Labh')).toEqual({
      backgroundColor: '#14b8a6',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Char')).toEqual({
      backgroundColor: '#f97316',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Udveg')).toEqual({
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Rog')).toEqual({
      backgroundColor: '#b91c1c',
      textColor: '#ffffff',
    });
    expect(getMuhurtaStyle('Kaal')).toEqual({
      backgroundColor: '#374151',
      textColor: '#ffffff',
    });
  });

  it('returns default transparent style for unknown muhurta', () => {
    expect(getMuhurtaStyle('Unknown')).toEqual({
      backgroundColor: 'transparent',
      textColor: '#000000',
    });
  });

  it('returns default transparent style for empty muhurta', () => {
    expect(getMuhurtaStyle('')).toEqual({
      backgroundColor: 'transparent',
      textColor: '#000000',
    });
    expect(getMuhurtaStyle(undefined)).toEqual({
      backgroundColor: 'transparent',
      textColor: '#000000',
    });
  });

  it('is case-sensitive and trims whitespace', () => {
    expect(getMuhurtaStyle(' amrit ')).toEqual({
      backgroundColor: 'transparent',
      textColor: '#000000',
    });
  });
});
