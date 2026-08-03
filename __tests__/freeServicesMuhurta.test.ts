import {
  getMuhurtaServiceKind,
  formatTimeValue,
} from '../src/features/free-services/utils/muhurtaService';

describe('getMuhurtaServiceKind', () => {
  it('returns chaughadiya for chaughadiya titles', () => {
    expect(getMuhurtaServiceKind('Chaughadiya Muhurata')).toBe('chaughadiya');
  });

  it('returns abhijeet for abhijeet titles', () => {
    expect(getMuhurtaServiceKind('Abhijeet Muhurata')).toBe('abhijeet');
  });

  it('returns other for unrelated titles', () => {
    expect(getMuhurtaServiceKind('Horoscope')).toBe('other');
  });
});

describe('formatTimeValue', () => {
  it('returns the string as-is when given a string', () => {
    expect(formatTimeValue('18:25:00')).toBe('18:25:00');
  });

  it('formats an object with hour, minute, second keys', () => {
    expect(formatTimeValue({hour: 18, minute: 25, second: 0})).toBe('18:25:00');
  });

  it('formats an object with minute key (alternative)', () => {
    expect(formatTimeValue({hour: 6, min: 5})).toBe('06:05');
  });

  it('formats an object with sec key (alternative)', () => {
    expect(formatTimeValue({hour: 23, minute: 5, sec: 30})).toBe('23:05:30');
  });

  it('returns empty string for undefined', () => {
    expect(formatTimeValue(undefined)).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatTimeValue(null as any)).toBe('');
  });

  it('pads hour and minute with leading zeros', () => {
    expect(formatTimeValue({hour: 5, minute: 7, second: 9})).toBe('05:07:09');
  });
});
