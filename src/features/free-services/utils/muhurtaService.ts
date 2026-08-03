import type {TimeValue} from '../../../services/api/astrologyApi/astrology.types';

export type MuhurtaServiceKind =
  | 'chaughadiya'
  | 'abhijeet'
  | 'panchang'
  | 'other';

export const getMuhurtaServiceKind = (title: string): MuhurtaServiceKind => {
  const normalizedTitle = title?.toLowerCase() || '';

  if (normalizedTitle.includes('chaughadiya')) {
    return 'chaughadiya';
  }

  if (
    normalizedTitle.includes('abhijeet') ||
    normalizedTitle.includes('abhijit')
  ) {
    return 'abhijeet';
  }

  if (normalizedTitle.includes('panchang')) {
    return 'panchang';
  }

  return 'other';
};

export const formatTimeValue = (value: TimeValue | undefined): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    const minute = value.minute ?? value.min;
    const hour = value.hour;
    const second = value.second ?? value.sec;
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    if (second !== undefined) {
      const s = String(second).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    return `${h}:${m}`;
  }
  return String(value);
};
