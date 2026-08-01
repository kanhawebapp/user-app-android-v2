import {getMuhurtaDetailsViewModel} from '../src/features/free-services/utils/muhurtaResponse';

describe('getMuhurtaDetailsViewModel', () => {
  it('returns a valid view model for chaughadiya responses', () => {
    const result = getMuhurtaDetailsViewModel('chaughadiya', {
      chaughadiya: {
        day: [{time: '09:16:31 - 10:53:48', muhurta: 'Shubh'}],
        night: [{time: '22:14:47 - 23:37:30', muhurta: 'Amrit'}],
      },
    });

    expect(result).toEqual({
      kind: 'chaughadiya',
      day: [{time: '09:16:31 - 10:53:48', muhurta: 'Shubh'}],
      night: [{time: '22:14:47 - 23:37:30', muhurta: 'Amrit'}],
    });
  });

  it('returns a valid view model for abhijeet responses', () => {
    const result = getMuhurtaDetailsViewModel('abhijeet', {
      abhijit_muhurta: {
        start: '05:30',
        end: '06:30',
      },
    });

    expect(result).toEqual({
      kind: 'abhijeet',
      start: '05:30',
      end: '06:30',
      duration: '1h',
    });
  });

  it('returns null for invalid payloads', () => {
    expect(getMuhurtaDetailsViewModel('chaughadiya', {})).toBeNull();
    expect(getMuhurtaDetailsViewModel('abhijeet', {})).toBeNull();
  });

  it('returns null for chaughadiya payloads with empty arrays', () => {
    expect(
      getMuhurtaDetailsViewModel('chaughadiya', {
        chaughadiya: {day: [], night: []},
      }),
    ).toBeNull();
  });
});
