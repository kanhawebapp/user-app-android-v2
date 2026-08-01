import {getMuhurtaServiceKind} from '../src/features/free-services/utils/muhurtaService';

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
