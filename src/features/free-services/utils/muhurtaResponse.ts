export interface MuhurtaDetailsViewModel {
  kind: 'chaughadiya' | 'abhijeet';
  day?: Array<{
    time?: string;
    muhurta?: string;
  }> | null;
  night?: Array<{
    time?: string;
    muhurta?: string;
  }> | null;
  start?: string;
  end?: string;
  duration?: string;
}

export type AbhijeetStatus = {
  label: string;
  variant: 'success' | 'warning' | 'default';
};

const toMinutes = (time?: string): number | null => {
  if (!time) {
    return null;
  }
  const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] ? Number(match[3]) : 0;
  return hours * 60 + minutes + seconds / 60;
};

const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  }
  if (hours) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

const calculateDuration = (
  start?: string,
  end?: string,
): string | undefined => {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) {
    return undefined;
  }

  let diff = endMinutes - startMinutes;
  if (diff < 0) {
    diff += 24 * 60;
  }

  return formatDuration(diff);
};

export const getAbhijeetStatus = (
  start?: string,
  end?: string,
  tzone?: number,
): AbhijeetStatus => {
  if (!start || !end) {
    return {label: 'Unknown', variant: 'default'};
  }

  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const offsetMinutes = tzone ? Math.round(tzone * 60) : 0;
  const targetMinutes = utcMinutes + offsetMinutes;
  const normalizedCurrent = ((targetMinutes % 1440) + 1440) % 1440;

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  if (startMinutes === null || endMinutes === null) {
    return {label: 'Unknown', variant: 'default'};
  }

  if (normalizedCurrent >= startMinutes && normalizedCurrent <= endMinutes) {
    return {label: 'Active', variant: 'success'};
  }

  return {label: 'Over', variant: 'warning'};
};

export const getMuhurtaDetailsViewModel = (
  kind: 'chaughadiya' | 'abhijeet',
  response: any,
): MuhurtaDetailsViewModel | null => {
  if (kind === 'chaughadiya') {
    const data = response?.chaughadiya;
    const dayEntries = Array.isArray(data?.day) ? data.day : [];
    const nightEntries = Array.isArray(data?.night) ? data.night : [];

    if (!dayEntries.length && !nightEntries.length) {
      return null;
    }

    return {
      kind,
      day: dayEntries.length ? dayEntries : null,
      night: nightEntries.length ? nightEntries : null,
    };
  }

  const data = response?.abhijit_muhurta;
  if (!data || (!data.start && !data.end)) {
    return null;
  }

  const duration = calculateDuration(data.start, data.end);

  return {
    kind,
    start: data.start,
    end: data.end,
    duration,
  };
};
