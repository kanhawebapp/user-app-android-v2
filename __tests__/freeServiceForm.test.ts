import {
  getInitialBirthValues,
  buildBirthPayload,
} from '../src/features/free-services/utils/freeServiceForm';

describe('getInitialBirthValues', () => {
  it('returns a date in DD/MM/YYYY format', () => {
    const values = getInitialBirthValues();
    expect(values.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('returns a time in 12-hour AM/PM format', () => {
    const values = getInitialBirthValues();
    expect(values.time).toMatch(/^\d{2}:\d{2} (AM|PM)$/);
  });
});

describe('buildBirthPayload', () => {
  it('converts PM time to 24-hour format', () => {
    const payload = buildBirthPayload(
      {date: '15/08/2024', time: '09:30 PM'},
      28.61,
      77.2,
      5.5,
      'New Delhi, India',
    );
    expect(payload.day).toBe(15);
    expect(payload.month).toBe(8);
    expect(payload.year).toBe(2024);
    expect(payload.hour).toBe(21);
    expect(payload.min).toBe(30);
    expect(payload.lat).toBe(28.61);
    expect(payload.lon).toBe(77.2);
    expect(payload.tzone).toBe(5.5);
    expect(payload.address).toBe('New Delhi, India');
  });

  it('converts 12 PM to hour 12', () => {
    const payload = buildBirthPayload(
      {date: '01/01/2024', time: '12:00 PM'},
      1,
      1,
      0,
    );
    expect(payload.hour).toBe(12);
  });

  it('converts 12 AM to hour 0', () => {
    const payload = buildBirthPayload(
      {date: '01/01/2024', time: '12:00 AM'},
      1,
      1,
      0,
    );
    expect(payload.hour).toBe(0);
  });

  it('defaults address to empty string', () => {
    const payload = buildBirthPayload(
      {date: '01/01/2024', time: '08:15 AM'},
      1,
      1,
      0,
    );
    expect(payload.address).toBe('');
  });
});
